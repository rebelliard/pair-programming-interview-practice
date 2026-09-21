import { describe, expect, it } from "vitest";
import { createMenuResponse, type MenuItem } from "../src/menu";

describe("GET /api/menu", () => {
  it("returns every menu item when vegetarian is absent", async () => {
    const response = createMenuResponse(
      new Request("http://localhost/api/menu"),
    );
    const body = (await response.json()) as { items: MenuItem[] };

    expect(body.items.map((item) => item.id)).toEqual([
      "margherita-pizza",
      "ramen",
      "falafel-bowl",
      "steak-frites",
    ]);
  });
});
