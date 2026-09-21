import type { CreateWorkspaceErrorCode } from "../../shared/workspaces";
import type { Dependencies, Result, Workspace } from "./types";

interface CreateWorkspaceInput {
  name: string;
  seatLimit: number;
}

export async function createWorkspace(
  dependencies: Dependencies,
  input: CreateWorkspaceInput,
): Promise<Result<Workspace, CreateWorkspaceErrorCode>> {
  const name = input.name.trim();

  if (name === "") {
    return { ok: false, error: "invalid_name" };
  }

  if (!Number.isInteger(input.seatLimit) || input.seatLimit < 1) {
    return { ok: false, error: "invalid_seat_limit" };
  }

  const workspace: Workspace = {
    id: dependencies.createId(),
    name,
    seatLimit: input.seatLimit,
    members: [],
    invitations: [],
  };

  await dependencies.repository.save(workspace);

  return { ok: true, value: workspace };
}
