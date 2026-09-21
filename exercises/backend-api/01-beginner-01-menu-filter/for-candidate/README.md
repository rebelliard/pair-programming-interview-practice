# Menu filter warm-up

This is a 45-minute API-only warm-up. It has one small Next.js Route Handler and
one planted filtering defect.

Start with [the task](warm-up-task.md).

## Working agreement

- Work as you normally would. You can search, run commands, and use AI.
- Keep the change focused. Do not add features or refactor unrelated code.
- You own the final code. Be ready to explain the regression, the fix, and what
  you verified.
- Stop after 45 minutes. Write down what you would try next if unfinished.

## Code map

- `app/api/menu/route.ts` exposes `GET /api/menu`.
- `src/menu.ts` builds the API response.
- `test/` contains the current passing starter test.

## Before you start

Run these commands from this package:

```bash
pnpm check
pnpm dev
```

Then use `curl` or your browser to inspect `http://localhost:3000/api/menu`.
