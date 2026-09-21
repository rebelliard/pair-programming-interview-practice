import { describe, expect, it } from "vitest";
import { deliverEvent } from "../../src/server/webhooks/deliver-event";
import {
  accepted,
  createDependencies,
  destination,
  httpResponse,
  networkError,
  presentationEnded,
} from "../../test/fixtures";

const input = { destination, event: presentationEnded };

describe("extension acceptance: bounded delivery", () => {
  it("retries temporary responses until delivery succeeds", async () => {
    const { client, dependencies, sleeper } = createDependencies([
      httpResponse(503),
      httpResponse(502),
      accepted(),
    ]);

    const result = await deliverEvent(dependencies, input);

    expect(result.status).toBe("delivered");
    expect(client.calls).toHaveLength(3);
    expect(sleeper.delays).toEqual([100, 200]);
  });

  it("does not sleep after an exhausted final attempt", async () => {
    const { client, dependencies, sleeper } = createDependencies([
      httpResponse(500),
      httpResponse(503),
      networkError(),
    ]);

    const result = await deliverEvent(dependencies, input);

    expect(result.status).toBe("exhausted");
    expect(client.calls).toHaveLength(3);
    expect(sleeper.delays).toEqual([100, 200]);
  });

  it("stops after a permanently rejected response", async () => {
    const { client, dependencies, sleeper } = createDependencies([
      httpResponse(500),
      httpResponse(404),
      accepted(),
    ]);

    expect((await deliverEvent(dependencies, input)).status).toBe("rejected");
    expect(client.calls).toHaveLength(2);
    expect(sleeper.delays).toEqual([100]);
  });

  it("retries a network error", async () => {
    const { dependencies, sleeper } = createDependencies([
      networkError(),
      accepted(),
    ]);

    expect((await deliverEvent(dependencies, input)).status).toBe("delivered");
    expect(sleeper.delays).toEqual([100]);
  });

  it("keeps a stable idempotency request for every attempt", async () => {
    const { client, dependencies } = createDependencies([
      httpResponse(503),
      httpResponse(502),
      accepted(),
    ]);

    await deliverEvent(dependencies, input);

    expect(client.calls[0]?.headers["idempotency-key"]).toBe("evt-1");
    expect(client.calls[1]).toEqual(client.calls[0]);
    expect(client.calls[2]).toEqual(client.calls[0]);
  });

  it("honors maxAttempts and a custom baseDelayMs", async () => {
    const { client, dependencies, sleeper } = createDependencies(
      [httpResponse(503), httpResponse(503), httpResponse(503), accepted()],
      { maxAttempts: 4, baseDelayMs: 50 },
    );

    expect((await deliverEvent(dependencies, input)).status).toBe("delivered");
    expect(client.calls).toHaveLength(4);
    expect(sleeper.delays).toEqual([50, 100, 200]);
  });

  it("uses digits-only retry-after, including zero", async () => {
    const { dependencies, sleeper } = createDependencies([
      httpResponse(429, { "retry-after": "0" }),
      accepted(),
    ]);

    await deliverEvent(dependencies, input);

    expect(sleeper.delays).toEqual([0]);
  });

  it.each([undefined, "", "abc", "1.5", " 5"])(
    "falls back for retry-after=%j",
    async (retryAfter) => {
      const headers: Record<string, string> =
        retryAfter === undefined ? {} : { "retry-after": retryAfter };
      const { dependencies, sleeper } = createDependencies([
        httpResponse(429, headers),
        accepted(),
      ]);

      await deliverEvent(dependencies, input);

      expect(sleeper.delays).toEqual([100]);
    },
  );

  it("keeps exponential position after retry-after", async () => {
    const { dependencies, sleeper } = createDependencies([
      httpResponse(429, { "retry-after": "2" }),
      httpResponse(503),
      accepted(),
    ]);

    await deliverEvent(dependencies, input);

    expect(sleeper.delays).toEqual([2000, 200]);
  });
});
