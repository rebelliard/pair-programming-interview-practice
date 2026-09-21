import { describe, expect, it } from 'vitest';
import { createHoursStore, type Hours } from '../src/hours-store';

describe('hours store', () => {
  it('persists writes without exposing its stored object', async () => {
    const initial: Hours = {
      monday: { opensAt: '09:00', closesAt: '17:00' },
    };
    const store = createHoursStore(initial);
    const read = await store.read();

    read.monday.opensAt = '00:00';
    expect(await store.read()).toEqual(initial);

    const next: Hours = {
      monday: { opensAt: '08:00', closesAt: '17:00' },
    };
    await store.write(next);

    expect(await store.read()).toEqual(next);
  });
});
