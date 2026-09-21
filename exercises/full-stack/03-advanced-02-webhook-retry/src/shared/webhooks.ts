export interface WebhookEvent {
  id: string;
  type: "presentation.ended";
  occurredAt: string;
  payload: {
    presentationId: string;
    participantCount: number;
  };
}

export interface Destination {
  url: string;
}

export interface WebhookRequest {
  method: "POST";
  url: string;
  headers: Record<string, string>;
  body: string;
}

export type WebhookResponse =
  | {
      kind: "http";
      status: number;
      headers: Record<string, string>;
    }
  | {
      kind: "network_error";
      message: string;
    };

export interface WebhookClient {
  send(request: WebhookRequest): Promise<WebhookResponse>;
}

export type AttemptClassification = "delivered" | "retryable" | "rejected";

export type DeliveryStatus = "delivered" | "rejected" | "exhausted";

export interface RetryPolicy {
  maxAttempts: number;
  baseDelayMs: number;
}

export interface DeliveryResult {
  status: DeliveryStatus;
  attempts: WebhookResponse[];
}

export interface Delivery {
  id: string;
  event: WebhookEvent;
  destination: Destination;
  status: DeliveryStatus;
  attempts: number;
}
