# Practice: exercise 9

## Package

- Directory: `exercises/backend-api/04-expert-01-merge-patch/`
- Package: `pairing-interview-exercise-9`
- Candidate command: `pnpm check`
- Editable paths: `app/`, `src/`, and `test/`

## Gate content

### `open`

> This is a characterization-first bug drill. Pin the current PATCH behavior
> before choosing a fix.

### `read`

> Run `pnpm test`, then trace the profile route and merge helper. Describe what
> happens to nested objects, nulls, and arrays today.

### `release-1`

> `PATCH /api/profiles/:id` uses shallow assignment. Nested fields disappear
> and null becomes persisted data. Write characterization tests, turn the
> incorrect expectations red, and implement RFC 7396 merge semantics.

> Ask two clarifying questions before implementation.

### `checkpoint-core`

> Show that nested object fields survive, null deletes object keys, and arrays
> replace rather than merge. Run `pnpm test`.

### `release-2`

> Require `application/merge-patch+json`. Reject an invalid patch without
> partially modifying the stored profile.

### `review`

> Implementation is over. Want to grade this session now?

### `end`

> Time. This is the last backend-api drill. Use the scorecards to select the
> next practice focus.
