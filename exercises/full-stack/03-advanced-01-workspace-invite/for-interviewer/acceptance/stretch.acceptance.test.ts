import { describe, expect, it } from "vitest";
import { handle } from "../../src/server/handle";
import * as handlers from "../../src/server/handlers";
import { createDependencies } from "../../test/fixtures";

function accept(workspaceId: string, email: string) {
  return {
    method: "POST" as const,
    path: `/workspaces/${workspaceId}/members`,
    query: {},
    headers: {},
    body: { email },
  };
}

describe("invitation acceptance stretch", () => {
  it("exports acceptInvitationHandler", () => {
    expect("acceptInvitationHandler" in handlers).toBe(true);
  });

  it("accepts and persists a pending invitation", async () => {
    const dependencies = createDependencies();
    const response = await handle(
      accept("ws-acme", "pending@acme.test"),
      dependencies,
    );

    expect(response.status).toBe(200);
    await expect(
      dependencies.repository.findById("ws-acme"),
    ).resolves.toMatchObject({
      members: ["owner@acme.test", "dev@acme.test", "pending@acme.test"],
      invitations: [],
    });
  });

  it("returns not found for missing resources", async () => {
    const missingInvitation = await handle(
      accept("ws-acme", "ghost@acme.test"),
      createDependencies(),
    );
    const missingWorkspace = await handle(
      accept("ws-missing", "pending@acme.test"),
      createDependencies(),
    );

    expect(missingInvitation).toMatchObject({
      status: 404,
      body: { error: { code: "invitation_not_found" } },
    });
    expect(missingWorkspace).toMatchObject({
      status: 404,
      body: { error: { code: "workspace_not_found" } },
    });
  });

  it("keeps a seat occupied after acceptance", async () => {
    const dependencies = createDependencies();

    await handle(
      {
        method: "POST",
        path: "/workspaces/ws-edge/invitations",
        query: {},
        headers: {},
        body: { email: "first@edge.test" },
      },
      dependencies,
    );
    await handle(accept("ws-edge", "first@edge.test"), dependencies);
    const response = await handle(
      {
        method: "POST",
        path: "/workspaces/ws-edge/invitations",
        query: {},
        headers: {},
        body: { email: "second@edge.test" },
      },
      dependencies,
    );

    expect(response).toMatchObject({
      status: 409,
      body: { error: { code: "seat_limit_reached" } },
    });
  });
});
