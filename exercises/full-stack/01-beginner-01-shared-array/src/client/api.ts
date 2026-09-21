import type { Transport } from "../shared/api";
import type { Ticket } from "../shared/tickets";

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
    async listTickets(query: { priority?: string }): Promise<Ticket[]> {
      const response = await transport({
        method: "GET",
        path: "/tickets",
        query,
        headers: {},
      });

      if (response.status !== 200) {
        throw new Error("Unable to load tickets");
      }

      const body = response.body as { tickets: Ticket[] };

      return body.tickets;
    },
  };
}

export type Api = ReturnType<typeof createApi>;
