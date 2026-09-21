import type { Ticket } from "../shared/tickets";
import { InMemoryTicketRepository } from "./tickets/ticket-repository";

export const seedTickets: Ticket[] = [
  {
    id: "ticket-1",
    title: "Cannot export quarterly report",
    requester: "finance@acme.io",
    priority: "normal",
    status: "open",
    updatedAt: "2026-09-18T15:00:00.000Z",
  },
  {
    id: "ticket-2",
    title: "Production login unavailable",
    requester: "ops@northstar.io",
    priority: "urgent",
    status: "open",
    updatedAt: "2026-09-20T08:30:00.000Z",
  },
  {
    id: "ticket-3",
    title: "Invoice contains the wrong address",
    requester: "Priya Natarajan",
    priority: "high",
    status: "open",
    updatedAt: "2026-09-19T10:00:00.000Z",
  },
  {
    id: "ticket-4",
    title: "Reset an archived workspace",
    requester: "support@example.com",
    priority: "normal",
    status: "resolved",
    updatedAt: "2026-09-12T09:00:00.000Z",
  },
  {
    id: "ticket-5",
    title: "Change notification language",
    requester: "maria@example.com",
    priority: "low",
    status: "pending",
    updatedAt: "2026-09-17T12:00:00.000Z",
  },
  {
    id: "ticket-6",
    title: "Payment processor recovered",
    requester: "ops@acme.io",
    priority: "urgent",
    status: "resolved",
    updatedAt: "2026-09-16T07:00:00.000Z",
  },
  {
    id: "ticket-7",
    title: "Team member cannot upload a logo",
    requester: "design@northstar.io",
    priority: "high",
    status: "pending",
    updatedAt: "2026-09-13T11:00:00.000Z",
  },
  {
    id: "ticket-8",
    title: "Dashboard loads slowly",
    requester: "engineering@example.com",
    priority: "normal",
    status: "open",
    updatedAt: "2026-09-14T14:00:00.000Z",
  },
];

export function createRepository(): InMemoryTicketRepository {
  return new InMemoryTicketRepository(
    seedTickets.map((ticket) => ({ ...ticket })),
  );
}

export const repository = createRepository();
