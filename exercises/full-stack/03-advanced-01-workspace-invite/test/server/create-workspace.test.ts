import { describe, expect, it } from "vitest";
import { createWorkspace } from "../../src/server/workspaces/create-workspace";
import { createDependencies } from "../fixtures";

describe("createWorkspace", () => {
  it("creates and persists a workspace", async () => {
    const dependencies = createDependencies();

    const result = await createWorkspace(dependencies, {
      name: "  Design  ",
      seatLimit: 4,
    });

    expect(result).toEqual({
      ok: true,
      value: {
        id: "generated-1",
        name: "Design",
        seatLimit: 4,
        members: [],
        invitations: [],
      },
    });
    await expect(
      dependencies.repository.findById("generated-1"),
    ).resolves.toEqual({
      id: "generated-1",
      name: "Design",
      seatLimit: 4,
      members: [],
      invitations: [],
    });
  });

  it("rejects invalid input", async () => {
    const dependencies = createDependencies();

    const invalidName = await createWorkspace(dependencies, {
      name: " ",
      seatLimit: 2,
    });
    const invalidSeatLimit = await createWorkspace(dependencies, {
      name: "Product",
      seatLimit: 0,
    });

    expect(invalidName).toEqual({ ok: false, error: "invalid_name" });
    expect(invalidSeatLimit).toEqual({
      ok: false,
      error: "invalid_seat_limit",
    });
  });
});
