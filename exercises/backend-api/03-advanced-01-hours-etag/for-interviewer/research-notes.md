# Research notes

## Why this exercise

Conditional requests make a small HTTP feature test several advanced backend
habits: defining a representation, generating a deterministic validator, and
checking a precondition before a state change.

The starter deliberately supplies in-memory state and SHA-256 hashing. The
candidate should focus on request behavior, not a database, framework adapter,
or cryptographic implementation.

## Confirmed stack

- Next 16.3.5 route handlers with standard Web `Request` and `Response`.
- React and React DOM 19.2.8 support the required Next layout only.
- TypeScript 6.0.3, Vitest 4.1.11, and Biome 2.5.10 match the exercise
  collection.
- `generateEtags: false` prevents Next from adding a framework ETag that could
  obscure the feature-owned validator.

## Sources

Accessed 2026-09-21.

- RFC 9110, conditional request semantics and entity tags:
  <https://www.rfc-editor.org/rfc/rfc9110#section-13>
- RFC 9110, 304 Not Modified:
  <https://www.rfc-editor.org/rfc/rfc9110#section-15.4.5>
- Next.js Route Handlers:
  <https://nextjs.org/docs/app/getting-started/route-handlers>
- Next.js `generateEtags` configuration:
  <https://nextjs.org/docs/app/api-reference/config/next-config-js/generateEtags>

## Evaluation cautions

- Accept any deterministic canonical object-key strategy. Arrays must retain
  their order.
- Do not require a particular error JSON shape if status codes, no-save
  behavior, and explanation are clear.
- `If-None-Match: *` is stretch work; it is not expected before core behavior.
- This is feature-only work, not a production caching design. Do not penalize
  candidates for not adding cache-control headers or persistence.

## Reference model lane

The reference patch uses only the provided helper and platform APIs. It does
not require an AI model, model provider, or external service.
