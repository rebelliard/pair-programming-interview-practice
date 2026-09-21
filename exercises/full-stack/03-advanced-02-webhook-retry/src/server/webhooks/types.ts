import type {
  Destination,
  RetryPolicy,
  WebhookClient,
  WebhookEvent,
} from "../../shared/webhooks";

export type {
  AttemptClassification,
  DeliveryResult,
  DeliveryStatus,
  Destination,
  RetryPolicy,
  WebhookClient,
  WebhookEvent,
  WebhookRequest,
  WebhookResponse,
} from "../../shared/webhooks";

export interface Dependencies {
  client: WebhookClient;
  sleep(milliseconds: number): Promise<void>;
  policy: RetryPolicy;
}

export interface DeliverEventInput {
  destination: Destination;
  event: WebhookEvent;
}
