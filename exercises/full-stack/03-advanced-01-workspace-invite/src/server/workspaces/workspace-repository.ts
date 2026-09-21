import type { Workspace, WorkspaceRepository } from "./types";

export class InMemoryWorkspaceRepository implements WorkspaceRepository {
  readonly #workspaces: Map<string, Workspace>;

  constructor(workspaces: Workspace[]) {
    this.#workspaces = new Map(
      workspaces.map((workspace) => [workspace.id, structuredClone(workspace)]),
    );
  }

  async findById(id: string): Promise<Workspace | undefined> {
    const workspace = this.#workspaces.get(id);

    return workspace === undefined ? undefined : structuredClone(workspace);
  }

  async save(workspace: Workspace): Promise<void> {
    this.#workspaces.set(workspace.id, structuredClone(workspace));
  }
}
