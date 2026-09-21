import {
  createProfileStore,
  type ProfileStore,
} from '../../src/profiles/profile-store';
import { createProfilesRoute } from '../../src/profiles/profiles-route';

export function context(id = 'pro-1') {
  return { params: Promise.resolve({ id }) };
}

export function routeWithStore(store: ProfileStore = createProfileStore()) {
  return { route: createProfilesRoute(store), store };
}

export function patchRequest(
  body: unknown,
  contentType = 'application/merge-patch+json',
): Request {
  return new Request('http://test/api/profiles/pro-1', {
    method: 'PATCH',
    headers: { 'content-type': contentType },
    body: JSON.stringify(body),
  });
}

export async function responseBody(
  response: Response,
): Promise<Record<string, unknown>> {
  return response.json() as Promise<Record<string, unknown>>;
}
