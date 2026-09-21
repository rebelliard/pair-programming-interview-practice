import { handle } from "../src/server/handle";
import { createRepository, seedSessions } from "../src/server/seed";
import type { Transport } from "../src/shared/api";
import type {
  Command,
  CommandResult,
  Session,
  SessionStatus,
} from "../src/shared/sessions";

export { createRepository, seedSessions };

export function sessionIn(status: SessionStatus): Session {
  return {
    id: "session-1",
    presentationId: "presentation-42",
    status,
  };
}

export function accepted(status: SessionStatus): CommandResult {
  return {
    ok: true,
    session: sessionIn(status),
  };
}

export function rejected(from: SessionStatus, command: Command): CommandResult {
  return {
    ok: false,
    error: {
      kind: "invalid_transition",
      from,
      command,
    },
  };
}

export function createInMemoryTransport(
  repository = createRepository(),
): Transport {
  return (request) => handle(request, { repository });
}
