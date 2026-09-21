# Practice: exercise 7

## Package

- Directory: `exercises/backend-api/03-advanced-01-hours-etag/`
- Package: `pairing-interview-exercise-7`
- Candidate command: `pnpm check`
- Editable paths: `app/`, `src/`, and `test/`

## Gate content

### `open`

> Today is a feature drill. State what an ETag lets a client avoid before
> reading the code.

### `read`

> Run `pnpm test`, then trace the hours resource and its route handlers.

### `release-1`

> Add a strong ETag to `GET /api/hours`. When a client's `If-None-Match`
> matches it exactly, respond with `304` and no response body.

> Ask two clarifying questions before implementation.

### `checkpoint-core`

> Show the response headers and a test that proves the 304 body is null. Run
> `pnpm test`.

### `release-2`

> Make writes conditional on `If-Match`: require a matching value, use `428`
> when it is missing and `412` when it is stale. Make representation key order
> stable before hashing.

### `review`

> Implementation is over. Want to grade this session now?

### `end`

> Time. The next backend-api drill is exercise 8: scan cursor.
