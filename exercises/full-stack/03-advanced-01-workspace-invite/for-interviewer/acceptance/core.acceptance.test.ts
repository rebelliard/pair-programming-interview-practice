import { describe, expect, it } from "vitest";
import { handle } from "../../src/server/handle";
import { createDependencies } from "../../test/fixtures";

describe("invitation core acceptance", () => {
  it("creates and persists an invitation", async () => {
    const dependencies = createDependencies();
    const response = await handle(
      {
        method: "POST",
        path: "/workspaces/ws-acme/invitations",
        query: {},
        headers: {},
        body: { email: "new@acme.test" },
      },
      dependencies,
    );

    expect(response).toMatchObject({
      status: 201,
      body: {
        workspace: {
          id: "ws-acme",
          invitations: [
            { email: "pending@acme.test" },
            { email: "new@acme.test" },
          ],
        },
      },
    });
    await expect(
      dependencies.repository.findById("ws-acme"),
    ).resolves.toMatchObject({
      invitations: [{ email: "pending@acme.test" }, { email: "new@acme.test" }],
    });
  });

  it.each([
    { body: {}, label: "missing" },
    { body: { email: 42 }, label: "not a string" },
    { body: { email: "" }, label: "empty" },
    { body: { email: "not-an-email" }, label: "without an at-sign" },
  ])("rejects $label email input", async ({ body }) => {
    const response = await handle(
      {
        method: "POST",
        path: "/workspaces/ws-acme/invitations",
        query: {},
        headers: {},
        body,
      },
      createDependencies(),
    );

    expect(response).toMatchObject({
      status: 400,
      body: { error: { code: "invalid_email" } },
    });
  });

  it("returns not found for an unknown workspace", async () => {
    const response = await handle(
      {
        method: "POST",
        path: "/workspaces/ws-missing/invitations",
        query: {},
        headers: {},
        body: { email: "new@acme.test" },
      },
      createDependencies(),
    );

    expect(response).toMatchObject({
      status: 404,
      body: { error: { code: "workspace_not_found" } },
    });
  });

  it("rejects existing members and invitations without saving", async () => {
    const dependencies = createDependencies();

    for (const email of ["dev@acme.test", "pending@acme.test"]) {
      const response = await handle(
        {
          method: "POST",
          path: "/workspaces/ws-acme/invitations",
          query: {},
          headers: {},
          body: { email },
        },
        dependencies,
      );

      expect(response).toMatchObject({
        status: 409,
        body: {
          error: {
            code:
              email === "dev@acme.test" ? "already_member" : "already_invited",
          },
        },
      });
    }

    await expect(
      dependencies.repository.findById("ws-acme"),
    ).resolves.toMatchObject({
      invitations: [{ email: "pending@acme.test" }],
      members: ["owner@acme.test", "dev@acme.test"],
    });
  });
});
