import { describe, expect, it } from "vitest";
import { context, patchRequest, responseBody, routeWithStore } from "./helpers";

describe("core JSON Merge Patch acceptance", () => {
  it("recursively merges a nested object without losing siblings", async () => {
    const { route } = routeWithStore();
    const response = await route.PATCH(
      patchRequest({ contact: { address: { city: "Paris" } } }),
      context(),
    );

    expect(await responseBody(response)).toMatchObject({
      contact: {
        email: "ada@example.test",
        phone: "+44 20 0000 0000",
        address: { city: "Paris", country: "GB" },
      },
    });
  });

  it("deletes a null member instead of storing a delete marker", async () => {
    const { route } = routeWithStore();
    const response = await route.PATCH(
      patchRequest({ contact: { phone: null } }),
      context(),
    );
    const profile = await responseBody(response);

    expect(profile).toMatchObject({
      contact: { email: "ada@example.test", address: { city: "London" } },
    });
    expect((profile.contact as Record<string, unknown>).phone).toBeUndefined();
  });

  it("replaces scalars and arrays", async () => {
    const { route } = routeWithStore();
    const response = await route.PATCH(
      patchRequest({ displayName: "Countess Ada", tags: ["pioneer"] }),
      context(),
    );

    expect(await responseBody(response)).toMatchObject({
      displayName: "Countess Ada",
      tags: ["pioneer"],
    });
  });

  it("makes an empty object patch a no-op", async () => {
    const { route } = routeWithStore();
    const before = await responseBody(
      await route.GET(new Request("http://test/api/profiles/pro-1"), context()),
    );
    const response = await route.PATCH(patchRequest({}), context());

    expect(await responseBody(response)).toEqual(before);
  });
});
