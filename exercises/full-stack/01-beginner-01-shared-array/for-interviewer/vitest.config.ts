import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const exerciseRoot = fileURLToPath(new URL("..", import.meta.url));
const srcDir = fileURLToPath(new URL("../src", import.meta.url));

export default defineConfig({
  root: exerciseRoot,
  plugins: [react()],
  resolve: { alias: { "@": srcDir } },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "server",
          environment: "node",
          include: [
            "test/server/**/*.test.ts",
            "for-interviewer/acceptance/**/*.acceptance.test.ts",
          ],
        },
      },
      {
        extends: true,
        test: {
          name: "client",
          environment: "jsdom",
          include: [
            "test/client/**/*.test.tsx",
            "for-interviewer/acceptance/**/*.acceptance.test.tsx",
          ],
          setupFiles: ["./vitest.setup.ts"],
        },
      },
    ],
  },
});
