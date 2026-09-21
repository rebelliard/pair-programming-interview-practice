import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { handle } from "./src/server/handle";
import type { ApiRequest } from "./src/shared/api";

const srcDir = fileURLToPath(new URL("./src", import.meta.url));

function apiPlugin(): Plugin {
  return {
    name: "exercise-api",
    configureServer(server) {
      server.middlewares.use("/api", async (req, res) => {
        const url = new URL(req.url ?? "/", "http://localhost");
        const chunks: Buffer[] = [];
        for await (const chunk of req) {
          chunks.push(chunk as Buffer);
        }
        const rawBody = Buffer.concat(chunks).toString("utf8");
        const request: ApiRequest = {
          method: (req.method ?? "GET") as ApiRequest["method"],
          path: url.pathname,
          query: Object.fromEntries(url.searchParams),
          headers: Object.fromEntries(
            Object.entries(req.headers).map(([key, value]) => [
              key,
              Array.isArray(value) ? value.join(",") : (value ?? ""),
            ]),
          ),
          body: rawBody ? JSON.parse(rawBody) : undefined,
        };
        const response = await handle(request);
        res.statusCode = response.status;
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify(response.body ?? null));
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), apiPlugin()],
  resolve: { alias: { "@": srcDir } },
});
