import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['for-interviewer/acceptance/**/*.test.ts'],
  },
});
