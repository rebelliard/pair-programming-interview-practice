import type { Command, CommandResult, Session } from "../../shared/sessions";
import { isTerminal } from "../../shared/transitions";

function invalidTransition(session: Session, command: Command): CommandResult {
  return {
    ok: false,
    error: {
      kind: "invalid_transition",
      from: session.status,
      command,
    },
  };
}

export function applyCommand(
  session: Session,
  command: Command,
): CommandResult {
  switch (command) {
    case "start":
      if (session.status !== "scheduled") {
        return invalidTransition(session, command);
      }
      return { ok: true, session: { ...session, status: "live" } };
    case "pause":
      if (session.status !== "live") {
        return invalidTransition(session, command);
      }
      return { ok: true, session: { ...session, status: "paused" } };
    case "resume":
      if (isTerminal(session.status)) {
        return invalidTransition(session, command);
      }
      return { ok: true, session: { ...session, status: "live" } };
    case "end":
      if (session.status !== "live" && session.status !== "paused") {
        return invalidTransition(session, command);
      }
      return { ok: true, session: { ...session, status: "ended" } };
    case "cancel":
      if (isTerminal(session.status)) {
        return invalidTransition(session, command);
      }
      return { ok: true, session: { ...session, status: "cancelled" } };
    default: {
      const unreachable: never = command;
      throw new Error(`Unhandled command: ${unreachable}`);
    }
  }
}
