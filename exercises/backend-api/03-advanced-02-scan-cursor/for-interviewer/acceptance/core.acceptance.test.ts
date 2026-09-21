import { describe, expect, it } from "vitest";
import { createScansHandler } from "../../src/scans/handler";
import { createScanStore } from "../../src/scans/store";
import type { ScanEvent } from "../../src/scans/types";

interface CursorPage {
  events: ScanEvent[];
  nextCursor: string | null;
}

async function readPage(response: Response): Promise<CursorPage> {
  return (await response.json()) as CursorPage;
}

describe("core acceptance: stable cursor pagination", () => {
  it("continues after the page boundary without duplicates or skips", async () => {
    const store = createScanStore();
    const handler = createScansHandler(store);
    const firstPage = await readPage(
      handler.GET(new Request("http://localhost/api/scans?limit=2")),
    );

    expect(firstPage.events.map((event) => event.id)).toEqual([
      "scan-06",
      "scan-05",
    ]);
    expect(firstPage.nextCursor).toEqual(expect.any(String));
    expect(firstPage.nextCursor).not.toContain("scan-05");

    store.insert({
      id: "scan-07",
      kind: "billing",
      timestamp: "2026-03-12T10:05:00.000Z",
    });

    const secondPage = await readPage(
      handler.GET(
        new Request(
          `http://localhost/api/scans?limit=2&cursor=${firstPage.nextCursor}`,
        ),
      ),
    );

    expect(secondPage.events.map((event) => event.id)).toEqual([
      "scan-04",
      "scan-03",
    ]);
  });

  it("uses the id tie-breaker at a page boundary", async () => {
    const handler = createScansHandler(createScanStore());
    const firstPage = await readPage(
      handler.GET(new Request("http://localhost/api/scans?limit=3")),
    );
    const secondPage = await readPage(
      handler.GET(
        new Request(
          `http://localhost/api/scans?limit=3&cursor=${firstPage.nextCursor}`,
        ),
      ),
    );

    expect(firstPage.events.map((event) => event.id)).toEqual([
      "scan-06",
      "scan-05",
      "scan-04",
    ]);
    expect(secondPage.events.map((event) => event.id)).toEqual([
      "scan-03",
      "scan-02",
      "scan-01",
    ]);
    expect(secondPage.nextCursor).toBeNull();
  });
});
