import { describe, expect, it } from "vitest";
import { createScansHandler } from "../../src/scans/handler";
import { createScanStore } from "../../src/scans/store";
import type { ScanEvent } from "../../src/scans/types";

interface CursorPage {
  events: ScanEvent[];
  nextCursor: string | null;
}

describe("stretch acceptance: cursor filter binding", () => {
  it("does not let a cursor for one filter continue another filter", async () => {
    const handler = createScansHandler(createScanStore());
    const response = handler.GET(
      new Request("http://localhost/api/scans?kind=security&limit=1"),
    );
    const firstPage = (await response.json()) as CursorPage;
    const changedFilter = handler.GET(
      new Request(
        `http://localhost/api/scans?kind=billing&limit=1&cursor=${firstPage.nextCursor}`,
      ),
    );

    expect(firstPage.events.map((event) => event.id)).toEqual(["scan-06"]);
    expect(firstPage.nextCursor).toEqual(expect.any(String));
    expect(changedFilter.status).toBe(400);
    await expect(changedFilter.json()).resolves.toEqual({
      error: { code: "cursor_filter_mismatch" },
    });
  });
});
