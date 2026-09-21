export const SESSION_STATUSES = [
  "scheduled",
  "live",
  "paused",
  "ended",
  "cancelled",
] as const;

export type SessionStatus = (typeof SESSION_STATUSES)[number];

export const COMMANDS = ["start", "pause", "resume", "end", "cancel"] as const;

export type Command = (typeof COMMANDS)[number];

export interface Session {
  id: string;
  presentationId: string;
  status: SessionStatus;
}

export interface InvalidTransition {
  kind: "invalid_transition";
  from: SessionStatus;
  command: Command;
}

export type CommandResult =
  | {
      ok: true;
      session: Session;
    }
  | {
      ok: false;
      error: InvalidTransition;
    };
