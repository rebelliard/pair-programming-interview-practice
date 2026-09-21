import { describe, expect, it } from "vitest";
import { handle } from "../../src/server/handle";
import { createDependencies } from "../fixtures";

describe("workspace routes", () => {
  it("creates a workspace", async () => {
    const response = await handle(
      {
        method: "POST",
        path: "/workspaces",
        query: {},
        headers: {},
        body: { name: "Research", seatLimit: 6 },
      },
      createDependencies(),
    );

    expect(response).toEqual({
      status: 201,
      body: {
        workspace: {
          id: "generated-1",
          name: "Research",
          seatLimit: 6,
          members: [],
          invitations: [],
        },
      },
    });
  });

  it("rejects an invalid workspace name", async () => {
    const response = await handle(
      {
        method: "POST",
        path: "/workspaces",
        query: {},
        headers: {},
        body: { name: 42, seatLimit: 6 },
      },
      createDependencies(),
    );

    expect(response).toMatchObject({
      status: 400,
      body: { error: { code: "invalid_name" } },
    });
  });

  it("returns not found for an unknown workspace", async () => {
    const response = await handle(
      {
        method: "GET",
        path: "/workspaces/ws-missing",
        query: {},
        headers: {},
      },
      createDependencies(),
    );

    expect(response).toMatchObject({
      status: 404,
      body: { error: { code: "workspace_not_found" } },
    });
  });
});
