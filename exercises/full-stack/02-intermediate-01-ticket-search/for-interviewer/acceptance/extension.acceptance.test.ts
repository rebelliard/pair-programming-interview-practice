import { describe, expect, it } from "vitest";
import { handle } from "../../src/server/handle";
import { createRepository } from "../../test/fixtures";

describe("extension acceptance: resolved visibility", () => {
  it("hides resolved tickets unless requested", async () => {
    const repository = createRepository();
    const hiddenResponse = await handle(
      {
        method: "GET",
        path: "/tickets",
        query: {},
        headers: {},
      },
      { repository },
    );
    const visibleResponse = await handle(
      {
        method: "GET",
        path: "/tickets",
        query: { includeResolved: "true" },
        headers: {},
      },
      { repository },
    );

    expect(hiddenResponse).toMatchObject({
      body: {
        tickets: expect.not.arrayContaining([
          expect.objectContaining({ status: "resolved" }),
        ]),
      },
      status: 200,
    });
    expect(visibleResponse).toMatchObject({
      body: {
        tickets: expect.arrayContaining([
          expect.objectContaining({ status: "resolved" }),
        ]),
      },
      status: 200,
    });
  });

  it.each(["false", "1", "yes"])(
    'does not include resolved tickets for includeResolved="%s"',
    async (includeResolved) => {
      const response = await handle(
        {
          method: "GET",
          path: "/tickets",
          query: { includeResolved },
          headers: {},
        },
        { repository: createRepository() },
      );

      expect(response).toMatchObject({ status: 200 });
      expect(response).toMatchObject({
        body: {
          tickets: expect.not.arrayContaining([
            expect.objectContaining({ status: "resolved" }),
          ]),
        },
        status: 200,
      });
    },
  );

  it("combines search, priority, and visibility", async () => {
    const repository = createRepository();
    const hiddenResponse = await handle(
      {
        method: "GET",
        path: "/tickets",
        query: { priority: "normal", q: "workspace" },
        headers: {},
      },
      { repository },
    );
    const visibleResponse = await handle(
      {
        method: "GET",
        path: "/tickets",
        query: {
          includeResolved: "true",
          priority: "normal",
          q: "workspace",
        },
        headers: {},
      },
      { repository },
    );

    expect(hiddenResponse).toEqual({ status: 200, body: { tickets: [] } });
    expect(visibleResponse).toMatchObject({
      body: { tickets: [expect.objectContaining({ id: "ticket-4" })] },
      status: 200,
    });
  });
});
