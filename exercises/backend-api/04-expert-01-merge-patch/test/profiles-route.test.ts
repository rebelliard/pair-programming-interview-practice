import { describe, expect, it } from "vitest";
import { createProfileStore } from "../src/profiles/profile-store";
import { createProfilesRoute } from "../src/profiles/profiles-route";

const context = (id = "pro-1") => ({ params: Promise.resolve({ id }) });

async function profileFrom(
  response: Response,
): Promise<Record<string, unknown>> {
  return response.json() as Promise<Record<string, unknown>>;
}

describe("profiles API starter behavior", () => {
  it("returns the seeded profile", async () => {
    const route = createProfilesRoute(createProfileStore());
    const response = await route.GET(
      new Request("http://test/api/profiles/pro-1"),
      context(),
    );

    expect(response.status).toBe(200);
    expect(await profileFrom(response)).toMatchObject({
      id: "pro-1",
      displayName: "Ada Lovelace",
    });
  });

  it("shallowly replaces a nested object", async () => {
    const route = createProfilesRoute(createProfileStore());
    const response = await route.PATCH(
      new Request("http://test/api/profiles/pro-1", {
        method: "PATCH",
        body: JSON.stringify({ contact: { address: { city: "Paris" } } }),
      }),
      context(),
    );

    expect(await profileFrom(response)).toMatchObject({
      contact: { address: { city: "Paris" } },
    });
  });

  it("stores null values from a patch", async () => {
    const route = createProfilesRoute(createProfileStore());
    const response = await route.PATCH(
      new Request("http://test/api/profiles/pro-1", {
        method: "PATCH",
        body: JSON.stringify({ preferences: null }),
      }),
      context(),
    );

    expect(await profileFrom(response)).toMatchObject({ preferences: null });
  });

  it("replaces scalar and array fields", async () => {
    const route = createProfilesRoute(createProfileStore());
    const response = await route.PATCH(
      new Request("http://test/api/profiles/pro-1", {
        method: "PATCH",
        body: JSON.stringify({
          displayName: "Countess Ada",
          tags: ["pioneer"],
        }),
      }),
      context(),
    );

    expect(await profileFrom(response)).toMatchObject({
      displayName: "Countess Ada",
      tags: ["pioneer"],
    });
  });
});
