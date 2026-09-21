import { describe, expect, it } from "vitest";
import { context, routeWithStore } from "./helpers";

type OptionsRoute = {
  OPTIONS?: (request: Request, context: ReturnType<typeof context>) => Promise<Response>;
};

describe("merge-patch discovery", () => {
  it("advertises PATCH through OPTIONS and Accept-Patch", async () => {
    const { route } = routeWithStore();
    const options = (route as typeof route & OptionsRoute).OPTIONS;

    expect(options).toBeTypeOf("function");
    const response = await options!(
      new Request("http://test/api/profiles/pro-1", { method: "OPTIONS" }),
      context(),
    );

    expect(response.status).toBe(204);
    expect(response.headers.get("allow")).toBe("GET, PATCH, OPTIONS");
    expect(response.headers.get("accept-patch")).toBe("application/merge-patch+json");
  });
});
