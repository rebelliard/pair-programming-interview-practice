import { describe, expect, it } from "vitest";
import { queryTickets } from "../../src/server/tickets/query-tickets";
import { createRepository } from "../fixtures";

describe("queryTickets", () => {
  it("orders tickets by priority", () => {
    const tickets = queryTickets(createRepository());

    expect(tickets.map(({ id }) => id)).toEqual([
      "ticket-2",
      "ticket-6",
      "ticket-3",
      "ticket-7",
      "ticket-1",
      "ticket-4",
      "ticket-8",
      "ticket-5",
    ]);
  });

  it("filters tickets by priority", () => {
    const tickets = queryTickets(createRepository(), { priority: "high" });

    expect(tickets.map(({ id }) => id)).toEqual(["ticket-3", "ticket-7"]);
  });
});
