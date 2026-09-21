import { describe, expect, it } from "vitest";
import { handle } from "../../src/server/handle";
import { createRepository } from "../fixtures";

describe("GET /tickets", () => {
  it("returns matching tickets", async () => {
    const response = await handle(
      {
        method: "GET",
        path: "/tickets",
        query: { priority: "low" },
        headers: {},
      },
      { repository: createRepository() },
    );

    expect(response).toEqual({
      status: 200,
      body: {
        tickets: [
          expect.objectContaining({
            id: "ticket-5",
            priority: "low",
          }),
        ],
      },
    });
  });

  it("rejects an unsupported priority", async () => {
    const response = await handle(
      {
        method: "GET",
        path: "/tickets",
        query: { priority: "critical" },
        headers: {},
      },
      { repository: createRepository() },
    );

    expect(response).toEqual({
      status: 400,
      body: { error: "Unsupported priority: critical" },
    });
  });
});
