import { describe, expect, it } from "vitest";
import { createScansHandler } from "../../src/scans/handler";
import { createScanStore } from "../../src/scans/store";

async function readError(
  response: Response,
): Promise<{ error: { code: string } }> {
  return (await response.json()) as { error: { code: string } };
}

describe("extension acceptance: request boundaries", () => {
  it("rejects malformed and repeated query parameters", async () => {
    const handler = createScansHandler(createScanStore());

    const malformed = handler.GET(
      new Request("http://localhost/api/scans?cursor=not-a-cursor"),
    );
    const repeatedLimit = handler.GET(
      new Request("http://localhost/api/scans?limit=2&limit=1"),
    );
    const repeatedCursor = handler.GET(
      new Request("http://localhost/api/scans?cursor=one&cursor=two"),
    );

    expect(malformed.status).toBe(400);
    await expect(readError(malformed)).resolves.toEqual({
      error: { code: "invalid_cursor" },
    });
    expect(repeatedLimit.status).toBe(400);
    await expect(readError(repeatedLimit)).resolves.toEqual({
      error: { code: "repeated_query_parameter" },
    });
    expect(repeatedCursor.status).toBe(400);
    await expect(readError(repeatedCursor)).resolves.toEqual({
      error: { code: "repeated_query_parameter" },
    });
  });

  it("returns JSON errors for malformed request bodies", async () => {
    const handler = createScansHandler(createScanStore());
    const response = await handler.POST(
      new Request("http://localhost/api/scans", {
        body: "{",
        headers: { "content-type": "application/json" },
        method: "POST",
      }),
    );

    expect(response.status).toBe(400);
    await expect(readError(response)).resolves.toEqual({
      error: { code: "invalid_json" },
    });
  });
});
