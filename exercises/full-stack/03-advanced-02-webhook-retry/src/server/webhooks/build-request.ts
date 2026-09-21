import type {
  Destination,
  WebhookEvent,
  WebhookRequest,
} from "../../shared/webhooks";

export function buildRequest(
  destination: Destination,
  event: WebhookEvent,
): WebhookRequest {
  return {
    method: "POST",
    url: destination.url,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(event),
  };
}
