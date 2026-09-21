import { describe, expect, it } from "vitest";
import { compareEvents, createScanStore } from "../../src/scans/store";

describe("scan store", () => {
  it("sorts newest first and breaks timestamp ties by id", () => {
    const store = createScanStore([
      {
        id: "scan-a",
        kind: "billing",
        timestamp: "2026-03-12T10:00:00.000Z",
      },
      {
        id: "scan-b",
        kind: "security",
        timestamp: "2026-03-12T10:00:00.000Z",
      },
      {
        id: "scan-c",
        kind: "security",
        timestamp: "2026-03-12T10:01:00.000Z",
      },
    ]);

    expect(store.list().map((event) => event.id)).toEqual([
      "scan-c",
      "scan-b",
      "scan-a",
    ]);
    const [firstEvent, secondEvent] = store.list();

    if (firstEvent === undefined || secondEvent === undefined) {
      throw new Error("Expected two scan events");
    }

    expect(compareEvents(firstEvent, secondEvent)).toBeLessThan(0);
  });

  it("keeps a newly inserted event in sorted order", () => {
    const store = createScanStore();

    store.insert({
      id: "scan-07",
      kind: "billing",
      timestamp: "2026-03-12T10:05:00.000Z",
    });

    expect(store.list()[0]?.id).toBe("scan-07");
  });
});
