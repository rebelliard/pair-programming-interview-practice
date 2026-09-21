# Practice: exercise 6

## Package

- Directory: `exercises/backend-api/02-intermediate-01-room-booking/`
- Package: `pairing-interview-exercise-6`
- Candidate command: `pnpm check`
- Editable paths: `app/`, `src/`, and `test/`

## Gate content

### `open`

> Today is a feature drill. There is no pre-existing defect to find.

### `read`

> Run `pnpm test`. Trace the POST request from its HTTP boundary to the
> in-memory booking store.

### `release-1`

> Add `POST /api/bookings`. A booking uses a room, start, and end time.
> Intervals are half-open: an overlap rejects, while one booking ending exactly
> when another starts is allowed. Return `201` and a `Location` header for a
> successful booking.

> Ask two clarifying questions before implementation.

### `checkpoint-core`

> Show a focused test for overlap and another for a back-to-back booking. Run
> `pnpm test`.

### `release-2`

> Separate malformed request shape from a valid request that conflicts with an
> existing booking. Return useful JSON errors without adding a schema plugin.

### `review`

> Implementation is over. Want to grade this session now?

### `end`

> Time. The next backend-api drill is exercise 7: hours ETag.
