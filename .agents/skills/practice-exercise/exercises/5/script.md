# Practice: exercise 5

## Package

- Directory: `exercises/backend-api/01-beginner-01-menu-filter/`
- Package: `pairing-interview-exercise-5`
- Candidate command: `pnpm check`
- Editable paths: `app/`, `src/`, and `test/`

## Gate content

### `open`

> This is a 45-minute backend API warm-up. Restate the behavior of a missing,
> true, and false query parameter before you inspect the implementation.

### `read`

> Run `pnpm test`, then trace `GET /api/menu` from the route to the handler and
> its tests. Do not change code yet.

### `implement`

> Write one regression that makes `?vegetarian=false` red. Then make the
> smallest fix that distinguishes absent, `true`, and `false`.

### `checkpoint-red`

> Show the regression failing before the production fix. State the exact
> response you expect for `vegetarian=false`.

### `checkpoint-green`

> Run `pnpm check`. Explain why a generic truthiness check is not HTTP boolean
> parsing.

### `review`

> Implementation is over. Want to grade this warm-up now?

### `end`

> Time. The next backend-api drill is exercise 6: room booking.
