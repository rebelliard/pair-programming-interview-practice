import { describe, expect, it } from "vitest";
import { handle } from "../../src/server/handle";
import {
  accepted,
  createDependencies,
  httpResponse,
  seedDeliveries,
} from "../fixtures";

describe("delivery handler", () => {
  it("lists seeded deliveries", async () => {
    const { dependencies } = createDependencies([accepted()]);

    const response = await handle(
      {
        method: "GET",
        path: "/deliveries",
        query: {},
        headers: {},
      },
      dependencies,
    );

    expect(response).toEqual({
      status: 200,
      body: { deliveries: seedDeliveries },
    });
  });

  it("retries a delivery and stores its next result", async () => {
    const { dependencies } = createDependencies([httpResponse(503)]);

    const response = await handle(
      {
        method: "POST",
        path: "/deliveries/dlv-2/retry",
        query: {},
        headers: {},
      },
      dependencies,
    );

    expect(response).toMatchObject({
      status: 200,
      body: {
        delivery: { id: "dlv-2", status: "exhausted", attempts: 1 },
      },
    });
    expect(dependencies.repository.findById("dlv-2")).toMatchObject({
      attempts: 1,
      status: "exhausted",
    });
  });

  it("returns a missing delivery response", async () => {
    const { dependencies } = createDependencies([accepted()]);

    const response = await handle(
      {
        method: "POST",
        path: "/deliveries/missing/retry",
        query: {},
        headers: {},
      },
      dependencies,
    );

    expect(response).toEqual({
      status: 404,
      body: { error: "delivery_not_found" },
    });
  });
});
