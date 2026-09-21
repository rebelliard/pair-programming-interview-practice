import type {
  Delivery,
  WebhookClient,
  WebhookRequest,
  WebhookResponse,
} from "../shared/webhooks";
import { InMemoryDeliveryRepository } from "./deliveries/delivery-repository";

const deliveries: Delivery[] = [
  {
    id: "dlv-1",
    event: {
      id: "event-1",
      type: "presentation.ended",
      occurredAt: "2026-03-01T10:00:00.000Z",
      payload: { presentationId: "pres-1", participantCount: 37 },
    },
    destination: { url: "https://hooks.example.test/menti" },
    status: "delivered",
    attempts: 1,
  },
  {
    id: "dlv-2",
    event: {
      id: "event-2",
      type: "presentation.ended",
      occurredAt: "2026-03-01T10:01:00.000Z",
      payload: { presentationId: "pres-2", participantCount: 14 },
    },
    destination: { url: "https://hooks.example.test/menti" },
    status: "exhausted",
    attempts: 0,
  },
  {
    id: "dlv-3",
    event: {
      id: "event-3",
      type: "presentation.ended",
      occurredAt: "2026-03-01T10:02:00.000Z",
      payload: { presentationId: "pres-3", participantCount: 9 },
    },
    destination: { url: "https://hooks.example.test/menti" },
    status: "exhausted",
    attempts: 0,
  },
  {
    id: "dlv-4",
    event: {
      id: "event-4",
      type: "presentation.ended",
      occurredAt: "2026-03-01T10:03:00.000Z",
      payload: { presentationId: "pres-4", participantCount: 22 },
    },
    destination: { url: "https://hooks.example.test/menti" },
    status: "exhausted",
    attempts: 0,
  },
];

const scripts: Record<string, WebhookResponse[]> = {
  "event-1": [{ kind: "http", status: 200, headers: {} }],
  "event-2": [
    { kind: "http", status: 503, headers: {} },
    { kind: "http", status: 200, headers: {} },
  ],
  "event-3": [
    { kind: "http", status: 429, headers: { "retry-after": "1" } },
    { kind: "http", status: 200, headers: {} },
  ],
  "event-4": [{ kind: "http", status: 409, headers: {} }],
};

class ScriptedWebhookClient implements WebhookClient {
  readonly #scripts = structuredClone(scripts);

  async send(request: WebhookRequest): Promise<WebhookResponse> {
    const event = JSON.parse(request.body) as { id: string };
    const responses = this.#scripts[event.id];
    const response =
      responses?.length === 1 ? responses[0] : responses?.shift();

    if (response === undefined) {
      throw new Error(`No scripted response for ${event.id}`);
    }

    return structuredClone(response);
  }
}

export const repository = new InMemoryDeliveryRepository(deliveries);
export const webhookClient = new ScriptedWebhookClient();
export const policy = { maxAttempts: 3, baseDelayMs: 100 };

export async function sleep(milliseconds: number): Promise<void> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, Math.min(milliseconds, policy.baseDelayMs));
  });
}

export function createRepository(
  seed: Delivery[] = deliveries,
): InMemoryDeliveryRepository {
  return new InMemoryDeliveryRepository(seed);
}
