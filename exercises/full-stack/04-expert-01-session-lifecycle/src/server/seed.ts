import type { Session, SessionStatus } from "../shared/sessions";
import { InMemorySessionRepository } from "./sessions/session-repository";

const PRESENTATION_ID = "presentation-42";

function sessionAt(id: string, status: SessionStatus): Session {
  return {
    id,
    presentationId: PRESENTATION_ID,
    status,
  };
}

export const seedSessions: Session[] = [
  sessionAt("ses-scheduled", "scheduled"),
  sessionAt("ses-live", "live"),
  sessionAt("ses-paused", "paused"),
  sessionAt("ses-ended", "ended"),
  sessionAt("ses-cancelled", "cancelled"),
];

export function createRepository(): InMemorySessionRepository {
  return new InMemorySessionRepository(
    seedSessions.map((session) => ({ ...session })),
  );
}

export const repository = createRepository();
