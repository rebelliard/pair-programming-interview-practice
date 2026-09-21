import type { Priority, QueryOptions, Ticket } from "../../shared/tickets";
import type { TicketRepository } from "./ticket-repository";

const priorityRank: Record<Priority, number> = {
  urgent: 0,
  high: 1,
  normal: 2,
  low: 3,
};

function compareByPriority(left: Ticket, right: Ticket): number {
  return priorityRank[left.priority] - priorityRank[right.priority];
}

export function queryTickets(
  repository: TicketRepository,
  options: QueryOptions = {},
): Ticket[] {
  const sortedTickets = [...repository.listAll()].sort(compareByPriority);

  if (options.priority) {
    return sortedTickets.filter(
      (ticket) => ticket.priority === options.priority,
    );
  }

  return sortedTickets;
}
