# Research notes

## Why this exercise

Offset pagination is easy to understand and commonly fails on mutable,
ordered feeds. The defect is small enough to reproduce in minutes but tests
several advanced backend habits:

- identify a stable ordering contract;
- choose a page boundary from that ordering;
- keep transport parsing separate from store behavior;
- treat repeated query values as an input boundary;
- make API failures as structured as API success responses.

## Deliberate starter choices

- The in-memory store removes database and transaction details.
- `compareEvents` supplies the ordering and tie-breaker. Candidates do not
  need to invent one.
- The cursor codec is supplied so the core work remains handler behavior.
- A mutation route makes the offset defect observable without external tools.
- The route exports only handlers. This keeps framework wiring out of the
  pairing discussion.

## Evaluation cautions

Do not require a particular encoding. Base64url JSON is sufficient. “Opaque”
means clients treat the value as a token; it does not imply encryption or
signing for this exercise.

Do not penalize a candidate who asks whether a mutable feed needs a snapshot
guarantee. The target guarantee is boundary stability for newly inserted
events, not a transactionally frozen feed.

## Known alternate valid approaches

- Locate the cursor event in the sorted list, then slice after it.
- Compare every candidate event against the cursor fields.
- Return a generic `invalid_request` code instead of the reference’s detailed
  error code, if the candidate makes behavior consistent and tests it.
