import {
  COMMANDS,
  type Command,
  SESSION_STATUSES,
  type SessionStatus,
} from "./sessions";

export type { Command, SessionStatus };
export { COMMANDS, SESSION_STATUSES };

export function isTerminal(status: SessionStatus): boolean {
  return status === "ended" || status === "cancelled";
}
