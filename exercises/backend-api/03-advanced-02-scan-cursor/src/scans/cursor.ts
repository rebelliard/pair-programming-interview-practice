import type { ScanKind } from "./types";

export interface ScanCursor {
  id: string;
  kind: ScanKind | null;
  timestamp: string;
}

export function encodeCursor(cursor: ScanCursor): string {
  const bytes = new TextEncoder().encode(JSON.stringify(cursor));
  const base64 = btoa(String.fromCodePoint(...bytes));

  return base64.replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

export function decodeCursor(value: string): ScanCursor {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const bytes = Uint8Array.from(
    atob(`${base64}${padding}`),
    (character) => character.codePointAt(0) ?? 0,
  );
  const candidate: unknown = JSON.parse(new TextDecoder().decode(bytes));

  if (
    typeof candidate !== "object" ||
    candidate === null ||
    !("id" in candidate) ||
    !("timestamp" in candidate) ||
    !("kind" in candidate) ||
    typeof candidate.id !== "string" ||
    typeof candidate.timestamp !== "string" ||
    (candidate.kind !== null &&
      candidate.kind !== "billing" &&
      candidate.kind !== "security") ||
    Number.isNaN(Date.parse(candidate.timestamp))
  ) {
    throw new Error("Invalid scan cursor");
  }

  return candidate as ScanCursor;
}
