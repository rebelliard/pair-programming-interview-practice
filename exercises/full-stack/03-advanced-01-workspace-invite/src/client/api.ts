import type { Transport } from "../shared/api";
import type {
  ApiError,
  InviteErrorCode,
  Workspace,
} from "../shared/workspaces";

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

export type InviteMemberResult =
  | { ok: true; workspace: Workspace }
  | { ok: false; error: ApiError["error"] & { code: InviteErrorCode } };

export function createApi(transport: Transport) {
  return {
    async getWorkspace(id: string): Promise<Workspace> {
      const response = await transport({
        method: "GET",
        path: `/workspaces/${id}`,
        query: {},
        headers: {},
      });

      if (response.status !== 200) {
        throw new Error("Unable to load workspace");
      }

      return (response.body as { workspace: Workspace }).workspace;
    },
    async inviteMember(
      workspaceId: string,
      email: string,
    ): Promise<InviteMemberResult> {
      const response = await transport({
        method: "POST",
        path: `/workspaces/${workspaceId}/invitations`,
        query: {},
        headers: {},
        body: { email },
      });

      if (response.status === 201) {
        return {
          ok: true,
          workspace: (response.body as { workspace: Workspace }).workspace,
        };
      }

      return {
        ok: false,
        error: (response.body as ApiError).error as ApiError["error"] & {
          code: InviteErrorCode;
        },
      };
    },
  };
}

export type Api = ReturnType<typeof createApi>;
