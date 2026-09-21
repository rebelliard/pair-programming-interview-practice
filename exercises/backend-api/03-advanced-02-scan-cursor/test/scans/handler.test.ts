import { describe, expect, it } from "vitest";
import { createScansHandler } from "../../src/scans/handler";
import { createScanStore } from "../../src/scans/store";
import type { ScanEvent } from "../../src/scans/types";

interface OffsetPage {
  events: ScanEvent[];
  nextOffset: number | null;
}

describe("scans handler starter behavior", () => {
  it("returns a sorted offset page", async () => {
    const handler = createScansHandler(createScanStore());
    const response = handler.GET(
      new Request("http://localhost/api/scans?offset=0&limit=2"),
    );

    expect(response.status).toBe(200);
    const page = (await response.json()) as OffsetPage;
    expect(page).toEqual({
      events: [
        {
          id: "scan-06",
          kind: "security",
          timestamp: "2026-03-12T10:04:00.000Z",
        },
        {
          id: "scan-05",
          kind: "billing",
          timestamp: "2026-03-12T10:03:00.000Z",
        },
      ],
      nextOffset: 2,
    });
  });

  it("inserts a valid event through POST", async () => {
    const handler = createScansHandler(createScanStore());
    const event = {
      id: "scan-07",
      kind: "billing",
      timestamp: "2026-03-12T10:05:00.000Z",
    };
    const response = await handler.POST(
      new Request("http://localhost/api/scans", {
        body: JSON.stringify(event),
        method: "POST",
      }),
    );

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({ event });
  });
});
