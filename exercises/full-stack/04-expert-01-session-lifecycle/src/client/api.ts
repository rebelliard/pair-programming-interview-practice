import type { Transport } from "../shared/api";
import type { Command, InvalidTransition, Session } from "../shared/sessions";

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

export type ApplyCommandResult =
  | { ok: true; session: Session }
  | { ok: false; error: InvalidTransition };

export function createApi(transport: Transport) {
  return {
    async listSessions(): Promise<Session[]> {
      const response = await transport({
        method: "GET",
        path: "/sessions",
        query: {},
        headers: {},
      });

      if (response.status !== 200) {
        throw new Error("Unable to load sessions");
      }

      const body = response.body as { sessions: Session[] };

      return body.sessions;
    },

    async getSession(id: string): Promise<Session> {
      const response = await transport({
        method: "GET",
        path: `/sessions/${id}`,
        query: {},
        headers: {},
      });

      if (response.status !== 200) {
        throw new Error("Unable to load session");
      }

      const body = response.body as { session: Session };

      return body.session;
    },

    async applyCommand(
      id: string,
      command: Command,
    ): Promise<ApplyCommandResult> {
      const response = await transport({
        method: "POST",
        path: `/sessions/${id}/commands`,
        query: {},
        headers: {},
        body: { command },
      });

      if (response.status === 200) {
        const body = response.body as { session: Session };

        return { ok: true, session: body.session };
      }

      if (response.status === 409) {
        const body = response.body as { error: InvalidTransition };

        return { ok: false, error: body.error };
      }

      throw new Error("Unable to apply command");
    },
  };
}

export type Api = ReturnType<typeof createApi>;
