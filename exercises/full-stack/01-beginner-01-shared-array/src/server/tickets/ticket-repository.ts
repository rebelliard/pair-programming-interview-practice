import type { Ticket } from "../../shared/tickets";

export interface TicketRepository {
  listAll(): Ticket[];
}

export class InMemoryTicketRepository implements TicketRepository {
  readonly #tickets: Ticket[];

  constructor(tickets: Ticket[]) {
    this.#tickets = tickets;
  }

  listAll(): Ticket[] {
    return this.#tickets;
  }
}
