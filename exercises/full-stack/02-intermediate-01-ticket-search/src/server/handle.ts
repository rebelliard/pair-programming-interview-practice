import type { ApiRequest, ApiResponse } from "../shared/api";
import { type Priority, priorities, type Ticket } from "../shared/tickets";
import { repository as defaultRepository } from "./seed";
import { queryTickets } from "./tickets/query-tickets";
import type { TicketRepository } from "./tickets/ticket-repository";

export interface Dependencies {
  repository: TicketRepository;
}

function isPriority(value: string): value is Priority {
  return priorities.some((priority) => priority === value);
}

function listTickets(
  repository: TicketRepository,
  request: ApiRequest,
): ApiResponse<{ tickets: Ticket[] } | { error: string }> {
  const priority = request.query.priority;

  if (priority !== undefined && !isPriority(priority)) {
    return {
      status: 400,
      body: { error: `Unsupported priority: ${priority}` },
    };
  }

  return {
    status: 200,
    body: { tickets: queryTickets(repository, { priority }) },
  };
}

export async function handle(
  request: ApiRequest,
  deps: Dependencies = { repository: defaultRepository },
): Promise<ApiResponse> {
  if (request.method === "GET" && request.path === "/tickets") {
    return listTickets(deps.repository, request);
  }

  return {
    status: 404,
    body: { error: "Not found" },
  };
}
