import type { Workspace } from "../../shared/workspaces";

export type { Workspace };

export interface WorkspaceRepository {
  findById(id: string): Promise<Workspace | undefined>;
  save(workspace: Workspace): Promise<void>;
}

export interface Dependencies {
  createId(): string;
  repository: WorkspaceRepository;
}

export type Result<TValue, TError extends string> =
  | { ok: true; value: TValue }
  | { ok: false; error: TError };
