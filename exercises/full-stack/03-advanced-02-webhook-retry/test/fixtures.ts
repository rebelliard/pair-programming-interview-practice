import {
  type Dependencies as HandlerDependencies,
  handle,
} from "../src/server/handle";
import { createRepository } from "../src/server/seed";
import type { Transport } from "../src/shared/api";
import type {
  Delivery,
  RetryPolicy,
  WebhookClient,
  WebhookEvent,
  WebhookRequest,
  WebhookResponse,
} from "../src/shared/webhooks";

export const presentationEnded: WebhookEvent = {
  id: "evt-1",
  type: "presentation.ended",
  occurredAt: "2026-03-01T10:00:00.000Z",
  payload: { presentationId: "pres-42", participantCount: 37 },
};

export const destination = { url: "https://hooks.example.test/menti" };

export const seedDeliveries: Delivery[] = [
  {
    id: "dlv-1",
    event: presentationEnded,
    destination,
    status: "delivered",
    attempts: 1,
  },
  {
    id: "dlv-2",
    event: { ...presentationEnded, id: "evt-2" },
    destination,
    status: "exhausted",
    attempts: 0,
  },
  {
    id: "dlv-3",
    event: { ...presentationEnded, id: "evt-3" },
    destination,
    status: "exhausted",
    attempts: 0,
  },
];

export function accepted(): WebhookResponse {
  return { kind: "http", status: 200, headers: {} };
}

export function httpResponse(
  status: number,
  headers: Record<string, string> = {},
): WebhookResponse {
  return { kind: "http", status, headers };
}

export function networkError(message = "ECONNRESET"): WebhookResponse {
  return { kind: "network_error", message };
}

export class FakeWebhookClient implements WebhookClient {
  readonly calls: WebhookRequest[] = [];
  readonly #responses: WebhookResponse[];

  constructor(responses: WebhookResponse[]) {
    this.#responses = [...responses];
  }

  async send(request: WebhookRequest): Promise<WebhookResponse> {
    this.calls.push(structuredClone(request));
    const response = this.#responses.shift();

    if (response === undefined) {
      throw new Error(
        `FakeWebhookClient: no scripted response left for attempt ${this.calls.length}`,
      );
    }

    return structuredClone(response);
  }
}

export interface FakeSleeper {
  delays: number[];
  sleep(milliseconds: number): Promise<void>;
}

export function createFakeSleeper(): FakeSleeper {
  const delays: number[] = [];

  return {
    delays,
    async sleep(milliseconds: number): Promise<void> {
      delays.push(milliseconds);
    },
  };
}

export function createDependencies(
  responses: WebhookResponse[],
  policy: RetryPolicy = { maxAttempts: 3, baseDelayMs: 100 },
): {
  client: FakeWebhookClient;
  dependencies: HandlerDependencies;
  sleeper: FakeSleeper;
} {
  const client = new FakeWebhookClient(responses);
  const sleeper = createFakeSleeper();

  return {
    client,
    sleeper,
    dependencies: {
      client,
      policy,
      repository: createRepository(seedDeliveries),
      sleep: sleeper.sleep,
    },
  };
}

export function createInMemoryTransport(
  dependencies = createDependencies([accepted()]).dependencies,
): Transport {
  return (request) => handle(request, dependencies);
}
