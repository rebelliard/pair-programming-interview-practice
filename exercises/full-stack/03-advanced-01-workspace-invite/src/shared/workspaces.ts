export interface Invitation {
  email: string;
}

export interface Workspace {
  id: string;
  name: string;
  seatLimit: number;
  members: string[];
  invitations: Invitation[];
}

export type InviteErrorCode =
  | "invalid_email"
  | "workspace_not_found"
  | "already_member"
  | "already_invited"
  | "seat_limit_reached";

export type CreateWorkspaceErrorCode = "invalid_name" | "invalid_seat_limit";

export type ApiErrorCode =
  | CreateWorkspaceErrorCode
  | InviteErrorCode
  | "invitation_not_found";

export interface ApiError {
  error: {
    code: ApiErrorCode;
    message: string;
  };
}
