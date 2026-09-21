import { createProfileStore, type ProfileStore } from "./profile-store";
import type { RouteHandler } from "./types";

type ProfileRoute = {
  GET: RouteHandler;
  PATCH: RouteHandler;
};

function json(body: unknown, status = 200): Response {
  return Response.json(body, { status });
}

export function createProfilesRoute(
  store: ProfileStore = createProfileStore(),
): ProfileRoute {
  return {
    async GET(_request, { params }) {
      const { id } = await params;
      const profile = store.get(id);

      if (!profile) {
        return json({ error: "not_found" }, 404);
      }

      return json(profile);
    },

    async PATCH(request, { params }) {
      const { id } = await params;
      const profile = store.get(id);

      if (!profile) {
        return json({ error: "not_found" }, 404);
      }

      let patch: unknown;
      try {
        patch = await request.json();
      } catch {
        return json({ error: "invalid_json" }, 400);
      }

      if (typeof patch !== "object" || patch === null || Array.isArray(patch)) {
        return json({ error: "invalid_patch" }, 400);
      }

      // Starter behavior: this only updates the first level of the document.
      const updated = Object.assign(profile, patch) as typeof profile;
      store.replace(updated);

      return json(updated);
    },
  };
}
