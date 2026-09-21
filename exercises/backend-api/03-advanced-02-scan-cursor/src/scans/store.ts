import type { ScanEvent, ScanStore } from "./types";

export const seedEvents: readonly ScanEvent[] = [
  { id: "scan-06", kind: "security", timestamp: "2026-03-12T10:04:00.000Z" },
  { id: "scan-05", kind: "billing", timestamp: "2026-03-12T10:03:00.000Z" },
  { id: "scan-04", kind: "security", timestamp: "2026-03-12T10:02:00.000Z" },
  { id: "scan-03", kind: "billing", timestamp: "2026-03-12T10:02:00.000Z" },
  { id: "scan-02", kind: "security", timestamp: "2026-03-12T10:01:00.000Z" },
  { id: "scan-01", kind: "billing", timestamp: "2026-03-12T10:00:00.000Z" },
];

export function compareEvents(
  left: Pick<ScanEvent, "id" | "timestamp">,
  right: Pick<ScanEvent, "id" | "timestamp">,
): number {
  const timestampComparison = right.timestamp.localeCompare(left.timestamp);

  if (timestampComparison !== 0) {
    return timestampComparison;
  }

  return right.id.localeCompare(left.id);
}

export function createScanStore(
  initialEvents: readonly ScanEvent[] = seedEvents,
): ScanStore {
  const events = [...initialEvents].sort(compareEvents);

  return {
    insert(event) {
      if (events.some((currentEvent) => currentEvent.id === event.id)) {
        throw new Error(`Scan event "${event.id}" already exists`);
      }

      events.push(event);
      events.sort(compareEvents);
    },
    list() {
      return events;
    },
  };
}
