import { describe, expect, it } from "vitest";
import { handle } from "../../src/server/handle";
import { queryTickets } from "../../src/server/tickets/query-tickets";
import { createRepository } from "../../test/fixtures";

describe("core acceptance: search", () => {
  it("keeps repository order stable when querying", () => {
    const repository = createRepository();
    const before = repository.listAll().map(({ id }) => id);

    queryTickets(repository, { priority: "high" });

    expect(repository.listAll().map(({ id }) => id)).toEqual(before);
  });

  it("searches titles and requesters after trimming and case-folding", async () => {
    const repository = createRepository();

    const titleResponse = await handle(
      {
        method: "GET",
        path: "/tickets",
        query: { q: "  LOGIN " },
        headers: {},
      },
      { repository },
    );
    const requesterResponse = await handle(
      {
        method: "GET",
        path: "/tickets",
        query: { q: "  PRIYA " },
        headers: {},
      },
      { repository },
    );

    expect(titleResponse).toMatchObject({
      body: { tickets: [expect.objectContaining({ id: "ticket-2" })] },
      status: 200,
    });
    expect(requesterResponse).toMatchObject({
      body: { tickets: [expect.objectContaining({ id: "ticket-3" })] },
      status: 200,
    });
  });

  it("treats a blank query like no query", async () => {
    const repository = createRepository();

    const blankResponse = await handle(
      {
        method: "GET",
        path: "/tickets",
        query: { q: "   " },
        headers: {},
      },
      { repository },
    );
    const defaultResponse = await handle(
      {
        method: "GET",
        path: "/tickets",
        query: {},
        headers: {},
      },
      { repository },
    );

    expect(blankResponse).toEqual(defaultResponse);
  });

  it("returns an empty successful response when search has no matches", async () => {
    const response = await handle(
      {
        method: "GET",
        path: "/tickets",
        query: { q: "not present" },
        headers: {},
      },
      { repository: createRepository() },
    );

    expect(response).toEqual({ status: 200, body: { tickets: [] } });
  });

  it("passes search and priority through the HTTP layer", async () => {
    const response = await handle(
      {
        method: "GET",
        path: "/tickets",
        query: {
          includeResolved: "true",
          priority: "urgent",
          q: "processor",
        },
        headers: {},
      },
      { repository: createRepository() },
    );

    expect(response).toEqual({
      status: 200,
      body: {
        tickets: [expect.objectContaining({ id: "ticket-6" })],
      },
    });
  });
});
