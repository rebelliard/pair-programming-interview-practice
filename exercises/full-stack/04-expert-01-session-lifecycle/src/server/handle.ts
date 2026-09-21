import type { ApiRequest, ApiResponse } from "../shared/api";
import { COMMANDS, type Command, type Session } from "../shared/sessions";
import { repository as defaultRepository } from "./seed";
import { applyCommand } from "./sessions/apply-command";
import type { SessionRepository } from "./sessions/session-repository";

export interface Dependencies {
  repository: SessionRepository;
}

function isCommand(value: unknown): value is Command {
  return (
    typeof value === "string" && COMMANDS.some((command) => command === value)
  );
}

function notFound(): ApiResponse<{ error: string }> {
  return {
    status: 404,
    body: { error: "Not found" },
  };
}

function matchSessionId(path: string): string | undefined {
  const match = /^\/sessions\/([^/]+)$/.exec(path);

  return match?.[1];
}

function matchSessionCommands(path: string): string | undefined {
  const match = /^\/sessions\/([^/]+)\/commands$/.exec(path);

  return match?.[1];
}

function listSessions(
  repository: SessionRepository,
): ApiResponse<{ sessions: Session[] }> {
  return {
    status: 200,
    body: { sessions: repository.listAll() },
  };
}

function getSession(
  repository: SessionRepository,
  id: string,
): ApiResponse<{ session: Session } | { error: string }> {
  const session = repository.getById(id);

  if (session === undefined) {
    return notFound();
  }

  return {
    status: 200,
    body: { session },
  };
}

function postCommand(
  repository: SessionRepository,
  id: string,
  request: ApiRequest,
): ApiResponse {
  const session = repository.getById(id);

  if (session === undefined) {
    return notFound();
  }

  const command =
    request.body !== null &&
    typeof request.body === "object" &&
    "command" in request.body
      ? request.body.command
      : undefined;

  if (!isCommand(command)) {
    return {
      status: 400,
      body: { error: "Invalid command" },
    };
  }

  const result = applyCommand(session, command);

  if (!result.ok) {
    return {
      status: 409,
      body: { error: result.error },
    };
  }

  repository.save(result.session);

  return {
    status: 200,
    body: { session: result.session },
  };
}

export async function handle(
  request: ApiRequest,
  deps: Dependencies = { repository: defaultRepository },
): Promise<ApiResponse> {
  if (request.method === "GET" && request.path === "/sessions") {
    return listSessions(deps.repository);
  }

  const sessionId = matchSessionId(request.path);

  if (request.method === "GET" && sessionId !== undefined) {
    return getSession(deps.repository, sessionId);
  }

  const commandSessionId = matchSessionCommands(request.path);

  if (request.method === "POST" && commandSessionId !== undefined) {
    return postCommand(deps.repository, commandSessionId, request);
  }

  return notFound();
}
