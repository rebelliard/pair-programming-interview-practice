import { describe, expect, it } from "vitest";
import { deliverEvent } from "../../src/server/webhooks/deliver-event";
import {
  createDependencies,
  destination,
  httpResponse,
  presentationEnded,
} from "../../test/fixtures";

const input = { destination, event: presentationEnded };

describe("stretch acceptance: already delivered server result", () => {
  it("treats an immediate 409 as already delivered", async () => {
    const { client, dependencies, sleeper } = createDependencies([
      httpResponse(409),
    ]);

    const result = await deliverEvent(dependencies, input);

    expect(result).toEqual({
      status: "already_delivered",
      attempts: [httpResponse(409)],
    });
    expect(client.calls).toHaveLength(1);
    expect(sleeper.delays).toEqual([]);
  });

  it("stops after a later 409", async () => {
    const { client, dependencies, sleeper } = createDependencies([
      httpResponse(503),
      httpResponse(409),
      httpResponse(200),
    ]);

    const result = await deliverEvent(dependencies, input);

    expect(result).toEqual({
      status: "already_delivered",
      attempts: [httpResponse(503), httpResponse(409)],
    });
    expect(client.calls).toHaveLength(2);
    expect(sleeper.delays).toEqual([100]);
  });
});
