import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const exerciseRoot = fileURLToPath(new URL("..", import.meta.url));

export default defineConfig({
  root: exerciseRoot,
  test: {
    environment: "node",
    include: [
      "test/**/*.test.ts",
      "for-interviewer/acceptance/**/*.acceptance.test.ts",
    ],
  },
});
