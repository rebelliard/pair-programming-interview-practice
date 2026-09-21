# Research notes: room booking

## Why this exercise

The task is small enough for a 50-minute pairing session but needs more than
surface-level endpoint wiring. It reveals whether a candidate can separate:

- HTTP input and output;
- request-shape validation;
- a domain rule that depends on existing state; and
- testable dependencies from framework glue.

The app is API-only so UI speed and styling do not affect the result.

## Domain model

Bookings use half-open intervals: `[startsAt, endsAt)`. Two bookings in the
same room conflict when:

```text
existing.startsAt < incoming.endsAt
  AND
incoming.startsAt < existing.endsAt
```

The strict comparisons intentionally allow adjacent intervals. For example,
`[10:00, 11:00)` and `[11:00, 12:00)` do not conflict.

The handler factory receives its repository and ID generator. This keeps the
route modules thin and lets tests inject a deterministic state without mocking
Next.js internals.

## Error boundaries

Request-shape failures happen before the domain rule. Missing fields, invalid
timestamps, non-string room IDs, and an empty or reversed interval are `400`
conditions. A well-formed interval that collides with a stored booking is a
`409` condition. Both should be JSON so API consumers can act on them.

No schema library is needed. Direct checks make the validation boundary visible
and keep the exercise dependency-free.

## Scope choices

In-memory state is intentional. Do not steer candidates toward authentication,
time zones, recurring bookings, databases, capacity, transactions, or
concurrent writes. These are valid production concerns but not assessment
goals here.
