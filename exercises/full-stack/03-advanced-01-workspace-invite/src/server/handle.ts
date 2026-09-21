import type { ApiRequest, ApiResponse } from "../shared/api";
import {
  createWorkspaceHandler,
  getWorkspaceHandler,
  inviteMemberHandler,
} from "./handlers";
import { repository as defaultRepository } from "./seed";
import type { Dependencies } from "./workspaces/types";

const defaultDependencies: Dependencies = {
  createId: () => crypto.randomUUID(),
  repository: defaultRepository,
};

export async function handle(
  request: ApiRequest,
  dependencies: Dependencies = defaultDependencies,
): Promise<ApiResponse> {
  if (request.method === "GET" && request.path.startsWith("/workspaces/")) {
    return getWorkspaceHandler(
      dependencies,
      request.path.slice("/workspaces/".length),
    );
  }

  if (request.method === "POST" && request.path === "/workspaces") {
    return createWorkspaceHandler(dependencies, request.body);
  }

  const invitationMatch = request.path.match(
    /^\/workspaces\/([^/]+)\/invitations$/,
  );
  if (request.method === "POST" && invitationMatch?.[1] !== undefined) {
    return inviteMemberHandler(dependencies, invitationMatch[1], request.body);
  }

  return {
    status: 404,
    body: {
      error: { code: "workspace_not_found", message: "Workspace not found" },
    },
  };
}
