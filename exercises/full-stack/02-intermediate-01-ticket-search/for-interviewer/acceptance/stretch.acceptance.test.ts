import { describe, expect, it } from "vitest";
import { queryTickets } from "../../src/server/tickets/query-tickets";
import { createRepository } from "../../test/fixtures";

describe("stretch acceptance: queue order", () => {
  it("orders equally prioritized tickets from oldest to newest", () => {
    expect(
      queryTickets(createRepository(), { priority: "high" }).map(
        ({ id }) => id,
      ),
    ).toEqual(["ticket-7", "ticket-3"]);
  });
});
