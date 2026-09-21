# Facilitator playbook: scan cursor

Run this 50-minute advanced API pairing exercise. Assess navigation, boundary
reasoning, deterministic tests, and communication. Do not assess typing speed.

## Before the session

From this package, run:

```bash
pnpm check
pnpm exec tsc --project for-interviewer/tsconfig.json
pnpm exec vitest run --config for-interviewer/vitest.config.ts
```

The starter checks must pass. The private acceptance suite should fail before
the candidate changes the starter.

Prepare the candidate archive without interviewer material:

```bash
tar \
  --exclude='./node_modules' \
  --exclude='./.next' \
  --exclude='./coverage' \
  --exclude='./for-interviewer' \
  -czf ../03-advanced-02-scan-cursor-candidate.tar.gz .
```

## Starter defect reproduction

Use this sequence after the candidate has read the exercise.

1. Start the API with `pnpm dev`.
2. Request `GET /api/scans?offset=0&limit=2`.
3. Point out that the response contains `scan-06` and `scan-05`.
4. Add a newer event with `POST /api/scans` and timestamp
   `2026-03-12T10:05:00.000Z`.
5. Request `GET /api/scans?offset=2&limit=2`.
6. Observe `scan-05` again. Explain that an offset identifies a position in a
   live collection, not a stable page boundary.

The store is intentionally sorted and includes the `timestamp, id` tie-break.
The interview is about cursors, page boundaries, and request validation—not
sorting algorithms.

## Release plan

### Minutes 0–10: orientation

Ask the candidate to run the starter tests and trace:

1. `app/api/scans/route.ts`;
2. `src/scans/handler.ts`;
3. `src/scans/store.ts`;
4. `src/scans/cursor.ts`;
5. `test/scans/`.

Ask why the duplicate occurs and how a cursor can describe the final item
received.

### Minutes 10–32: core

Reveal:

> Replace offset pagination with an opaque cursor. A response must return a
> nullable `nextCursor`. A later event must not duplicate or skip older events
> after a page boundary. Preserve descending `(timestamp, id)` order.

Clarify that the cursor does not need cryptographic secrecy. It must be an
opaque API token, and clients must not construct its fields themselves.

### Minutes 32–42: extension

Reveal:

> Treat query strings and JSON as untrusted input. Repeated `cursor` or
> `limit` parameters must be rejected, not silently read with `get()`.
> Malformed cursors and malformed JSON must return a JSON `400` response.

The intended prompt is to use `URLSearchParams.getAll()`.

### Minutes 42–46: stretch

Reveal only if the extension is complete:

> Support `kind=billing|security`. Bind the active filter to the cursor so a
> token for one filter cannot continue another filter.

### Minutes 46–50: debrief

Ask what comparator defines the page boundary, which mutation the core test
proves, and how repeated query parameters can bypass `get()`-only validation.

## Hint ladder

1. “What item should a cursor describe: the next item, or the final one you
   already returned?”
2. “How can the existing comparator tell whether a record comes after that
   final item?”
3. “What does `getAll()` tell you that `get()` discards?”
4. “Which request state must travel with a cursor when the feed is filtered?”

Use [rubric-and-solution.md](rubric-and-solution.md) after the session.
