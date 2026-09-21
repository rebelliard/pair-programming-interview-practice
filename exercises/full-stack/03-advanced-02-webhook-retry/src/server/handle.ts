import type { ApiRequest, ApiResponse } from "../shared/api";
import type { Delivery, RetryPolicy, WebhookClient } from "../shared/webhooks";
import type { DeliveryRepository } from "./deliveries/delivery-repository";
import { policy, repository, sleep, webhookClient } from "./seed";
import { deliverEvent } from "./webhooks/deliver-event";

export interface Dependencies {
  client: WebhookClient;
  policy: RetryPolicy;
  repository: DeliveryRepository;
  sleep(milliseconds: number): Promise<void>;
}

const defaultDependencies: Dependencies = {
  client: webhookClient,
  policy,
  repository,
  sleep,
};

function listDeliveries(
  deliveryRepository: DeliveryRepository,
): ApiResponse<{ deliveries: Delivery[] }> {
  return {
    status: 200,
    body: { deliveries: deliveryRepository.list() },
  };
}

async function retryDelivery(
  id: string,
  deps: Dependencies,
): Promise<ApiResponse<{ delivery: Delivery } | { error: string }>> {
  const delivery = deps.repository.findById(id);

  if (delivery === undefined) {
    return { status: 404, body: { error: "delivery_not_found" } };
  }

  const result = await deliverEvent(deps, delivery);
  const nextDelivery = {
    ...delivery,
    attempts: delivery.attempts + result.attempts.length,
    status: result.status,
  };
  deps.repository.save(nextDelivery);

  return { status: 200, body: { delivery: nextDelivery } };
}

export async function handle(
  request: ApiRequest,
  deps: Dependencies = defaultDependencies,
): Promise<ApiResponse> {
  if (request.method === "GET" && request.path === "/deliveries") {
    return listDeliveries(deps.repository);
  }

  const retryMatch = /^\/deliveries\/([^/]+)\/retry$/.exec(request.path);

  if (request.method === "POST" && retryMatch?.[1] !== undefined) {
    return retryDelivery(retryMatch[1], deps);
  }

  return { status: 404, body: { error: "not_found" } };
}
