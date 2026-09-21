import { describe, expect, it } from 'vitest';
import { createHoursHandler } from '../../src/hours-handler';
import { createHoursStore, type Hours } from '../../src/hours-store';

const initialHours: Hours = {
  monday: { opensAt: '09:00', closesAt: '17:00' },
  tuesday: { opensAt: '10:00', closesAt: '16:00' },
};

describe('extension acceptance', () => {
  it('uses one ETag for equivalent object key orders', async () => {
    const reorderedHours: Hours = {
      tuesday: { closesAt: '16:00', opensAt: '10:00' },
      monday: { closesAt: '17:00', opensAt: '09:00' },
    };
    const first = await createHoursHandler(createHoursStore(initialHours)).get(
      new Request('http://localhost/api/hours'),
    );
    const second = await createHoursHandler(
      createHoursStore(reorderedHours),
    ).get(new Request('http://localhost/api/hours'));

    expect(first.headers.get('etag')).toMatch(/^"[a-f0-9]{64}"$/);
    expect(first.headers.get('etag')).toBe(second.headers.get('etag'));
  });

  it('requires a current If-Match before saving', async () => {
    const store = createHoursStore(initialHours);
    const handler = createHoursHandler(store);
    const read = await handler.get(new Request('http://localhost/api/hours'));
    const etag = read.headers.get('etag');
    const nextHours: Hours = {
      ...initialHours,
      monday: { opensAt: '08:00', closesAt: '17:00' },
    };

    const missing = await handler.put(
      new Request('http://localhost/api/hours', {
        body: JSON.stringify({ hours: nextHours }),
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
      }),
    );
    expect(missing.status).toBe(428);

    const stale = await handler.put(
      new Request('http://localhost/api/hours', {
        body: JSON.stringify({ hours: nextHours }),
        headers: {
          'Content-Type': 'application/json',
          'If-Match': '"stale"',
        },
        method: 'PUT',
      }),
    );
    expect(stale.status).toBe(412);
    await expect(store.read()).resolves.toEqual(initialHours);

    const saved = await handler.put(
      new Request('http://localhost/api/hours', {
        body: JSON.stringify({ hours: nextHours }),
        headers: {
          'Content-Type': 'application/json',
          'If-Match': etag ?? '',
        },
        method: 'PUT',
      }),
    );
    expect(saved.status).toBe(200);
    expect(saved.headers.get('etag')).not.toBe(etag);
    await expect(store.read()).resolves.toEqual(nextHours);
  });
});
