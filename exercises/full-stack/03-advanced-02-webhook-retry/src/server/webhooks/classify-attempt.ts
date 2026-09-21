import type {
  AttemptClassification,
  WebhookResponse,
} from "../../shared/webhooks";

const retryableStatuses = new Set([429, 500, 502, 503, 504]);

export function classifyAttempt(
  response: WebhookResponse,
): AttemptClassification {
  if (response.kind === "network_error") {
    return "retryable";
  }

  if (response.status >= 200 && response.status < 300) {
    return "delivered";
  }

  if (retryableStatuses.has(response.status)) {
    return "retryable";
  }

  return "rejected";
}
