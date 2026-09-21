import type { Session } from "../../shared/sessions";

export interface SessionRepository {
  getById(id: string): Session | undefined;
  listAll(): Session[];
  save(session: Session): void;
}

export class InMemorySessionRepository implements SessionRepository {
  readonly #sessions: Map<string, Session>;

  constructor(sessions: Session[]) {
    this.#sessions = new Map(
      sessions.map((session) => [session.id, { ...session }]),
    );
  }

  getById(id: string): Session | undefined {
    const session = this.#sessions.get(id);

    if (session === undefined) {
      return undefined;
    }

    return { ...session };
  }

  listAll(): Session[] {
    return [...this.#sessions.values()].map((session) => ({ ...session }));
  }

  save(session: Session): void {
    this.#sessions.set(session.id, { ...session });
  }
}
