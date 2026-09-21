# Deploying a backend API exercise to Vercel

Deployment is optional. Candidate and acceptance checks run locally and do not
need a Vercel account.

Each backend-api package is an independent Next.js app. To deploy one:

1. Change into its package directory.
2. Run `pnpm install --frozen-lockfile` and `pnpm build`.
3. Link or import that package as the Vercel project root.
4. Deploy with the Vercel dashboard or `vercel`.

The route handlers use in-memory data. A deployment starts with its seed data
and does not provide durable storage. That is intentional for an interview
exercise; do not treat a deployed URL as a shared or persistent environment.

No `vercel.json` is required. Next.js is detected automatically.
