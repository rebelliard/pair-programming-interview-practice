import { describe, expect, it } from "vitest";
import { createRepository } from "../fixtures";

describe("InMemoryWorkspaceRepository", () => {
  it("returns detached copies", async () => {
    const repository = createRepository();
    const workspace = await repository.findById("ws-acme");

    expect(workspace).toBeDefined();
    workspace?.members.push("local-only@acme.test");

    const storedWorkspace = await repository.findById("ws-acme");

    expect(storedWorkspace?.members).not.toContain("local-only@acme.test");
  });

  it("persists saved workspaces and returns undefined for unknown ids", async () => {
    const repository = createRepository();
    const workspace = {
      id: "ws-product",
      name: "Product",
      seatLimit: 2,
      members: [],
      invitations: [],
    };

    await repository.save(workspace);

    await expect(repository.findById("ws-product")).resolves.toEqual(workspace);
    await expect(repository.findById("ws-missing")).resolves.toBeUndefined();
  });
});
