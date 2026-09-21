# ⏱️ Candidate guide: hours ETags

This is a **feature-only** drill. Do not build pages, forms, or a database.

Timebox: 50 minutes.

## User story

> As an API consumer, I want to cache opening hours and avoid overwriting a
> concurrent change, so I can read and update the resource safely.

## Start here

From this package:

```bash
pnpm check
pnpm dev
```

The API is available at `GET /api/hours` and `PUT /api/hours`.

## Contract

`GET /api/hours` returns:

```json
{
  "hours": {
    "monday": { "opensAt": "09:00", "closesAt": "17:00" }
  }
}
```

Use a strong `ETag` response header for this representation. A matching,
single-value `If-None-Match` request must return `304` with no body.

For updates, accept a JSON body with the same `hours` shape. Require
`If-Match`:

- no `If-Match` → `428 Precondition Required`
- stale `If-Match` → `412 Precondition Failed`
- matching `If-Match` → save and return the updated representation and ETag

## Priorities

1. Core: emit an ETag and implement the exact-match `If-None-Match` → `304`
   path.
2. Extension: make the ETag independent of object key order, then protect
   updates with `If-Match`.
3. Stretch: support comma-separated `If-None-Match` values and `*`.

## Code map

- `app/api/hours/route.ts` only adapts Next route methods to the handler.
- `src/hours-handler.ts` is the feature boundary to implement.
- `src/hours-store.ts` is an in-memory dependency.
- `src/hash.ts` contains the provided SHA-256 helper.
- `test/` contains starter checks only.

Do not add a page. Keep HTTP code on the standard Web `Request` and
`Response` APIs.

## Working agreement

- Explain a decision when it affects the public contract.
- Start with the smallest observable behavior.
- Say what you would verify before moving to an edge case.
- A tested partial solution is better than an untested broad one.
