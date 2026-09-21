# Scan feed cursor

You have 50 minutes.

## Goal

The scan feed is sorted newest first. Replace its offset pagination with an
opaque cursor so a new live scan does not duplicate or skip scans that the
caller has not yet read.

## Start

```bash
pnpm check
pnpm dev
```

The API is available at `http://localhost:3000/api/scans`.

## Defect reproduction

1. Request the first page:

   ```bash
   curl -s 'http://localhost:3000/api/scans?offset=0&limit=2'
   ```

2. Add a newer scan between page requests:

   ```bash
   curl -s -X POST http://localhost:3000/api/scans \
     -H 'content-type: application/json' \
     --data '{"id":"scan-07","kind":"billing","timestamp":"2026-03-12T10:05:00.000Z"}'
   ```

3. Request the next offset page:

   ```bash
   curl -s 'http://localhost:3000/api/scans?offset=2&limit=2'
   ```

4. Observe that `scan-05` appears in both pages. A feed reader can also skip
   an event when data is deleted or reordered.

## Constraints

- Keep the feed newest first.
- Keep the existing `timestamp, id` ordering rule.
- Use the Web `Request` and `Response` APIs with JSON bodies.
- Keep route files thin. Put request behavior in `src/scans/`.
- Do not add a database or third-party pagination package.

## Working agreement

You drive. Explain your assumptions and run focused checks as you work. It is
fine to pause to read, ask a question, or stop after a tested partial solution.

See [advice-and-phrases.md](advice-and-phrases.md) for useful pairing phrases.
