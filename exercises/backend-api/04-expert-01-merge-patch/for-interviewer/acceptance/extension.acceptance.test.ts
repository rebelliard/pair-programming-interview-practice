import { describe, expect, it } from 'vitest';
import { context, patchRequest, responseBody, routeWithStore } from './helpers';

describe('merge-patch media type and atomic validation', () => {
  it('requires application/merge-patch+json', async () => {
    const { route } = routeWithStore();
    const response = await route.PATCH(
      patchRequest({ displayName: 'Countess Ada' }, 'application/json'),
      context(),
    );

    expect(response.status).toBe(415);
    expect(await responseBody(response)).toEqual({
      error: 'unsupported_media_type',
    });
  });

  it('accepts the merge-patch media type', async () => {
    const { route } = routeWithStore();
    const response = await route.PATCH(
      patchRequest(
        { displayName: 'Countess Ada' },
        'application/merge-patch+json',
      ),
      context(),
    );

    expect(response.status).toBe(200);
    expect(await responseBody(response)).toMatchObject({
      displayName: 'Countess Ada',
    });
  });

  it('rejects an invalid final profile without partially persisting it', async () => {
    const { route } = routeWithStore();
    const response = await route.PATCH(
      patchRequest(
        {
          displayName: 'Grace Hopper',
          contact: { email: 'not-an-email' },
        },
        'application/merge-patch+json',
      ),
      context(),
    );

    expect(response.status).toBe(422);
    expect(await responseBody(response)).toEqual({ error: 'invalid_profile' });

    const current = await responseBody(
      await route.GET(new Request('http://test/api/profiles/pro-1'), context()),
    );
    expect(current).toMatchObject({
      displayName: 'Ada Lovelace',
      contact: { email: 'ada@example.test' },
    });
  });
});
