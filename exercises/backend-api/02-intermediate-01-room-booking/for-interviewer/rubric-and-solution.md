# Rubric and solution

Score observed evidence, not style preferences. Total: 100 points.

| Dimension        | Points | Strong evidence                                                         |
| ---------------- | -----: | ----------------------------------------------------------------------- |
| Orientation      |     15 | Traces route, handler factory, and repository before changing code      |
| Core booking     |     45 | Correct half-open overlap rule, `201`, `Location`, and boundary tests   |
| Extension        |     20 | Separates malformed request data from domain conflicts with JSON errors |
| Stretch          |     10 | Deletion releases the interval and is verified                          |
| Pairing practice |     10 | States assumptions, works in checked slices, and verifies tool output   |

## Score guidance

- Award the top band only with direct artifact or session-log evidence.
- A candidate who reaches core but not extension is not penalized for unopened
  work.
- Do not score typing speed, narration volume, accent, nervousness, or the
  frequency of AI use.
- A correct overlap condition is `start < existing.end && end > existing.start`;
  equality permits back-to-back bookings.

## Reference direction

The completed solution validates request shape at the HTTP boundary, keeps the
half-open conflict rule in the booking handler, returns `201` with a booking
location for success, and maps domain conflicts to JSON errors. The private
patch is a comparison aid, not a required implementation shape.
