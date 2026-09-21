import { buildRequest } from "./build-request";
import { classifyAttempt } from "./classify-attempt";
import type { DeliverEventInput, DeliveryResult, Dependencies } from "./types";

export async function deliverEvent(
  dependencies: Dependencies,
  input: DeliverEventInput,
): Promise<DeliveryResult> {
  const request = buildRequest(input.destination, input.event);
  const response = await dependencies.client.send(request);
  const attempts = [response];
  const classification = classifyAttempt(response);

  switch (classification) {
    case "delivered":
      return { status: "delivered", attempts };
    case "rejected":
      return { status: "rejected", attempts };
    case "retryable":
      return { status: "exhausted", attempts };
    default: {
      const unreachable: never = classification;
      throw new Error(`Unhandled attempt classification: ${unreachable}`);
    }
  }
}
