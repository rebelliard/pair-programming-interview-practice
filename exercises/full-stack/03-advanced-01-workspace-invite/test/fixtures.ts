import { handle } from "../src/server/handle";
import { seedWorkspaces } from "../src/server/seed";
import type { Dependencies } from "../src/server/workspaces/types";
import { InMemoryWorkspaceRepository } from "../src/server/workspaces/workspace-repository";
import type { Transport } from "../src/shared/api";
import type { Workspace } from "../src/shared/workspaces";

export { seedWorkspaces };

export function createRepository(
  workspaces: Workspace[] = seedWorkspaces,
): InMemoryWorkspaceRepository {
  return new InMemoryWorkspaceRepository(workspaces);
}

export function createSequentialIds(prefix = "generated"): () => string {
  let nextId = 1;

  return () => {
    const id = `${prefix}-${nextId}`;
    nextId += 1;
    return id;
  };
}

export function createDependencies(
  repository = createRepository(),
): Dependencies {
  return {
    createId: createSequentialIds(),
    repository,
  };
}

export function createInMemoryTransport(
  repository = createRepository(),
): Transport {
  return (request) => handle(request, createDependencies(repository));
}
