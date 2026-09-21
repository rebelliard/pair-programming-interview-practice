import { describe, expect, it } from 'vitest';
import { hash } from '../src/hash';

describe('hash', () => {
  it('returns a stable SHA-256 digest', () => {
    expect(hash('hours')).toBe(
      '404314b1f4bd8fa2ff42a84cd851ddc011c76fb64e12dfe3748101b03ed8ce7c',
    );
  });
});
