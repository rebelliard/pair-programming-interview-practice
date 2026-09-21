import { createScanStore } from "./store";
import type { ScanEvent, ScanKind, ScanStore, ScansHandler } from "./types";

const defaultPageSize = 2;

function isScanKind(value: unknown): value is ScanKind {
  return value === "billing" || value === "security";
}

function parseEvent(value: unknown): ScanEvent {
  if (
    typeof value !== "object" ||
    value === null ||
    !("id" in value) ||
    !("kind" in value) ||
    !("timestamp" in value) ||
    typeof value.id !== "string" ||
    !isScanKind(value.kind) ||
    typeof value.timestamp !== "string" ||
    Number.isNaN(Date.parse(value.timestamp))
  ) {
    throw new Error("Invalid scan event");
  }

  return {
    id: value.id,
    kind: value.kind,
    timestamp: value.timestamp,
  };
}

export function createScansHandler(
  store: ScanStore = createScanStore(),
): ScansHandler {
  return {
    GET(request) {
      const url = new URL(request.url);
      const offset = Number(url.searchParams.get("offset") ?? "0");
      const limit = Number(url.searchParams.get("limit") ?? defaultPageSize);
      const events = store.list().slice(offset, offset + limit);
      const nextOffset =
        events.length === limit && offset + events.length < store.list().length
          ? offset + events.length
          : null;

      return Response.json({ events, nextOffset });
    },
    async POST(request) {
      const event = parseEvent(await request.json());

      store.insert(event);
      return Response.json({ event }, { status: 201 });
    },
  };
}
