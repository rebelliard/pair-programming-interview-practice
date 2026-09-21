import { describe, expect, it } from "vitest";
import { deliverEvent } from "../../src/server/webhooks/deliver-event";
import {
  accepted,
  createDependencies,
  destination,
  httpResponse,
  presentationEnded,
} from "../fixtures";

describe("deliverEvent", () => {
  it("delivers after one accepted attempt", async () => {
    const { client, dependencies, sleeper } = createDependencies([accepted()]);

    const result = await deliverEvent(dependencies, {
      destination,
      event: presentationEnded,
    });

    expect(result).toEqual({ status: "delivered", attempts: [accepted()] });
    expect(client.calls).toHaveLength(1);
    expect(sleeper.delays).toEqual([]);
  });

  it("rejects after one permanent response", async () => {
    const { client, dependencies, sleeper } = createDependencies([
      httpResponse(404),
    ]);

    const result = await deliverEvent(dependencies, {
      destination,
      event: presentationEnded,
    });

    expect(result).toEqual({
      status: "rejected",
      attempts: [httpResponse(404)],
    });
    expect(client.calls).toHaveLength(1);
    expect(sleeper.delays).toEqual([]);
  });

  it("exhausts after one retryable response", async () => {
    const { client, dependencies, sleeper } = createDependencies([
      httpResponse(503),
    ]);

    const result = await deliverEvent(dependencies, {
      destination,
      event: presentationEnded,
    });

    expect(result).toEqual({
      status: "exhausted",
      attempts: [httpResponse(503)],
    });
    expect(client.calls).toHaveLength(1);
    expect(sleeper.delays).toEqual([]);
  });
});
