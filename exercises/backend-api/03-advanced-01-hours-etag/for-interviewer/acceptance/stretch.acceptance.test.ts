import { describe, expect, it } from 'vitest';
import { createHoursHandler } from '../../src/hours-handler';
import { createHoursStore } from '../../src/hours-store';

describe('stretch acceptance', () => {
  it('matches an ETag in an If-None-Match list', async () => {
    const handler = createHoursHandler(createHoursStore());
    const read = await handler.get(new Request('http://localhost/api/hours'));
    const etag = read.headers.get('etag');

    const response = await handler.get(
      new Request('http://localhost/api/hours', {
        headers: { 'If-None-Match': `"other", ${etag}` },
      }),
    );

    expect(response.status).toBe(304);
    expect(response.body).toBeNull();
  });

  it('treats If-None-Match star as matching an existing resource', async () => {
    const handler = createHoursHandler(createHoursStore());

    const response = await handler.get(
      new Request('http://localhost/api/hours', {
        headers: { 'If-None-Match': '*' },
      }),
    );

    expect(response.status).toBe(304);
    expect(response.body).toBeNull();
  });
});
