import { describe, expect, it } from "vitest";
import { createMenuResponse, type MenuItem } from "../../src/menu";

describe("vegetarian=false regression", () => {
  it("returns only non-vegetarian menu items", async () => {
    const response = createMenuResponse(
      new Request("http://localhost/api/menu?vegetarian=false"),
    );
    const body = (await response.json()) as { items: MenuItem[] };

    expect(body.items.map((item) => item.id)).toEqual([
      "ramen",
      "steak-frites",
    ]);
  });
});
