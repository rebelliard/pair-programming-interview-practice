import type { Transport } from "../shared/api";
import type { Delivery } from "../shared/webhooks";

export const fetchTransport: Transport = async (request) => {
  const search = new URLSearchParams(
    Object.entries(request.query).filter(
      (entry): entry is [string, string] => entry[1] !== undefined,
    ),
  ).toString();
  const response = await fetch(
    `/api${request.path}${search ? `?${search}` : ""}`,
    {
      method: request.method,
      headers: { "content-type": "application/json", ...request.headers },
      body:
        request.body === undefined ? undefined : JSON.stringify(request.body),
      signal: request.signal,
    },
  );
  const text = await response.text();

  return {
    status: response.status,
    body: text ? JSON.parse(text) : undefined,
  };
};

export function createApi(transport: Transport) {
  return {
    async listDeliveries(): Promise<Delivery[]> {
      const response = await transport({
        method: "GET",
        path: "/deliveries",
        query: {},
        headers: {},
      });

      if (response.status !== 200) {
        throw new Error("Unable to load deliveries");
      }

      const body = response.body as { deliveries: Delivery[] };

      return body.deliveries;
    },
    async retryDelivery(id: string): Promise<Delivery> {
      const response = await transport({
        method: "POST",
        path: `/deliveries/${id}/retry`,
        query: {},
        headers: {},
      });

      if (response.status !== 200) {
        throw new Error("Unable to retry delivery");
      }

      const body = response.body as { delivery: Delivery };

      return body.delivery;
    },
  };
}

export type Api = ReturnType<typeof createApi>;
