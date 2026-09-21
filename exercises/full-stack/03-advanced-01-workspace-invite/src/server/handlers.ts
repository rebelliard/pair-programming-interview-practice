import type {
  ApiError,
  CreateWorkspaceErrorCode,
  InviteErrorCode,
  Workspace,
} from "../shared/workspaces";
import { createWorkspace } from "./workspaces/create-workspace";
import type { Dependencies } from "./workspaces/types";

function error(
  code: CreateWorkspaceErrorCode | InviteErrorCode | "workspace_not_found",
  message: string,
): ApiError {
  return { error: { code, message } };
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function getWorkspaceHandler(
  dependencies: Dependencies,
  workspaceId: string,
): Promise<{ status: number; body: { workspace: Workspace } | ApiError }> {
  const workspace = await dependencies.repository.findById(workspaceId);

  if (workspace === undefined) {
    return {
      status: 404,
      body: error("workspace_not_found", "Workspace not found"),
    };
  }

  return { status: 200, body: { workspace } };
}

export async function createWorkspaceHandler(
  dependencies: Dependencies,
  body: unknown,
): Promise<{ status: number; body: { workspace: Workspace } | ApiError }> {
  const input = body as { name?: unknown; seatLimit?: unknown };

  if (typeof input.name !== "string") {
    return { status: 400, body: error("invalid_name", "Name is required") };
  }

  if (typeof input.seatLimit !== "number") {
    return {
      status: 400,
      body: error("invalid_seat_limit", "Seat limit must be a number"),
    };
  }

  const result = await createWorkspace(dependencies, {
    name: input.name,
    seatLimit: input.seatLimit,
  });

  if (result.ok) {
    return { status: 201, body: { workspace: result.value } };
  }

  switch (result.error) {
    case "invalid_name":
      return { status: 400, body: error(result.error, "Name is required") };
    case "invalid_seat_limit":
      return {
        status: 400,
        body: error(result.error, "Seat limit must be a positive integer"),
      };
    default: {
      const unreachable: never = result.error;
      throw new Error(`Unhandled create workspace error: ${unreachable}`);
    }
  }
}

export async function inviteMemberHandler(
  dependencies: Dependencies,
  workspaceId: string,
  body: unknown,
): Promise<{ status: number; body: { workspace: Workspace } | ApiError }> {
  const input = body as { email?: unknown };

  if (typeof input.email !== "string") {
    return { status: 400, body: error("invalid_email", "Email is invalid") };
  }

  const email = normalizeEmail(input.email);
  if (email === "" || !email.includes("@")) {
    return { status: 400, body: error("invalid_email", "Email is invalid") };
  }

  const workspace = await dependencies.repository.findById(workspaceId);
  if (workspace === undefined) {
    return {
      status: 404,
      body: error("workspace_not_found", "Workspace not found"),
    };
  }

  if (workspace.members.some((member) => normalizeEmail(member) === email)) {
    return {
      status: 409,
      body: error("already_member", "This person is already a member"),
    };
  }

  if (
    workspace.invitations.some(
      (invitation) => normalizeEmail(invitation.email) === email,
    )
  ) {
    return {
      status: 409,
      body: error("already_invited", "This email already has an invitation"),
    };
  }

  workspace.invitations.push({ email });
  await dependencies.repository.save(workspace);

  return { status: 201, body: { workspace } };
}
