# Candidate guide: room booking

This is a **feature-only** intermediate pairing exercise. There is no warm-up
bug to find or repair before the feature work begins.

You have 50 minutes. The interviewer will release the product request after a
short code walkthrough.

## Before the session

From this package, run:

```bash
pnpm check
```

The starter checks should pass before you make any changes. Do not inspect or
include `for-interviewer/` in a candidate copy.

## Code map

- `app/api/` contains the thin Next route modules.
- `src/bookings.ts` contains the in-memory repository and handler factory.
- `test/` contains the starter checks.

This is an API-only Next.js app. There is no browser UI to build.

## Working agreement

- You drive; the interviewer navigates.
- Take quiet reading time when it helps.
- Explain decisions, assumptions, and check results at useful points.
- Ask when a product detail could change the design.
- Make one small end-to-end slice work before broad refactoring.

Use AI deliberately. Say what you expect it to do, inspect what it returns, and
verify every change you keep.

## Closing summary

At the end, summarize:

1. what works;
2. what you tested;
3. assumptions you made; and
4. the next risk or improvement you would address.

See [`advice-and-phrases.md`](advice-and-phrases.md) for a compact pairing
playbook.
