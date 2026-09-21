import { describe, expect, it } from 'vitest';
import { createHoursHandler } from '../../src/hours-handler';
import { createHoursStore } from '../../src/hours-store';

describe('core acceptance', () => {
  it('emits an ETag for the hours representation', async () => {
    const handler = createHoursHandler(createHoursStore());

    const response = await handler.get(
      new Request('http://localhost/api/hours'),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('etag')).toMatch(/^"[a-f0-9]{64}"$/);
    await expect(response.json()).resolves.toMatchObject({
      hours: expect.any(Object),
    });
  });

  it('returns a bodyless 304 for an exact If-None-Match value', async () => {
    const handler = createHoursHandler(createHoursStore());
    const first = await handler.get(new Request('http://localhost/api/hours'));
    const etag = first.headers.get('etag');

    const response = await handler.get(
      new Request('http://localhost/api/hours', {
        headers: { 'If-None-Match': etag ?? '' },
      }),
    );

    expect(response.status).toBe(304);
    expect(response.body).toBeNull();
    await expect(response.text()).resolves.toBe('');
  });
});
