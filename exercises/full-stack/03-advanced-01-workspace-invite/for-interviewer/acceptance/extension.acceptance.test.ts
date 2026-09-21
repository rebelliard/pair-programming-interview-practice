import { describe, expect, it } from "vitest";
import { handle } from "../../src/server/handle";
import { createDependencies, createRepository } from "../../test/fixtures";

function invite(workspaceId: string, email: string) {
  return {
    method: "POST" as const,
    path: `/workspaces/${workspaceId}/invitations`,
    query: {},
    headers: {},
    body: { email },
  };
}

describe("seat-limit acceptance", () => {
  it("rejects an invitation when every seat is used", async () => {
    const response = await handle(
      invite("ws-solo", "new@solo.test"),
      createDependencies(),
    );

    expect(response).toMatchObject({
      status: 409,
      body: { error: { code: "seat_limit_reached" } },
    });
  });

  it("keeps duplicate-member precedence in a full workspace", async () => {
    const response = await handle(
      invite("ws-solo", "solo@solo.test"),
      createDependencies(),
    );

    expect(response).toMatchObject({
      status: 409,
      body: { error: { code: "already_member" } },
    });
  });

  it("keeps duplicate-invitation precedence in a full workspace", async () => {
    const dependencies = createDependencies(
      createRepository([
        {
          id: "ws-full-invited",
          name: "Full and invited",
          seatLimit: 2,
          members: ["owner@example.test"],
          invitations: [{ email: "pending@example.test" }],
        },
      ]),
    );

    const response = await handle(
      invite("ws-full-invited", "pending@example.test"),
      dependencies,
    );

    expect(response).toMatchObject({
      status: 409,
      body: { error: { code: "already_invited" } },
    });
  });

  it("checks membership before invitations and the seat limit", async () => {
    const dependencies = createDependencies(
      createRepository([
        {
          id: "ws-overlap",
          name: "Overlapping data",
          seatLimit: 2,
          members: ["duplicate@example.test"],
          invitations: [{ email: "duplicate@example.test" }],
        },
      ]),
    );

    const response = await handle(
      invite("ws-overlap", "duplicate@example.test"),
      dependencies,
    );

    expect(response).toMatchObject({
      status: 409,
      body: { error: { code: "already_member" } },
    });
  });

  it("counts pending invitations as used seats", async () => {
    const dependencies = createDependencies();

    const firstResponse = await handle(
      invite("ws-edge", "first@edge.test"),
      dependencies,
    );
    const secondResponse = await handle(
      invite("ws-edge", "second@edge.test"),
      dependencies,
    );

    expect(firstResponse.status).toBe(201);
    expect(secondResponse).toMatchObject({
      status: 409,
      body: { error: { code: "seat_limit_reached" } },
    });
  });

  it("does not save a seat-limit rejection", async () => {
    const dependencies = createDependencies();

    await handle(invite("ws-solo", "new@solo.test"), dependencies);

    await expect(
      dependencies.repository.findById("ws-solo"),
    ).resolves.toMatchObject({
      invitations: [],
      members: ["solo@solo.test"],
    });
  });
});
