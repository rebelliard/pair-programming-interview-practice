# Practice: exercise 8

## Package

- Directory: `exercises/backend-api/03-advanced-02-scan-cursor/`
- Package: `pairing-interview-exercise-8`
- Candidate command: `pnpm check`
- Editable paths: `app/`, `src/`, and `test/`

## Gate content

### `open`

> This is a bug drill. Pin the current page boundary before replacing offset
> pagination.

### `read`

> Run `pnpm test` and trace the sorted scan store, comparison helper, and GET
> route. Identify the timestamp and ID ordering contract.

### `release-1`

> An intervening scan can make offset pagination duplicate or skip results.
> Reproduce it, write a regression, then replace offsets with an opaque cursor
> over the timestamp-and-ID ordering.

> Ask two clarifying questions before implementation.

### `checkpoint-core`

> Show the red regression and the fixed two-page sequence. Run `pnpm test`.

### `release-2`

> Reject malformed and repeated cursor parameters with JSON errors. Use
> `URLSearchParams.getAll()` to make the repeated-parameter policy explicit.

### `review`

> Implementation is over. Want to grade this session now?

### `end`

> Time. The next backend-api drill is exercise 9: merge patch.
