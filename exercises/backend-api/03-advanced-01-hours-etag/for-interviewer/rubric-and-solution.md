# 📊 Rubric and reference solution

Keep this file private until the debrief.

## Scoring principles

- Score observable evidence, not speed, confidence, accent, or familiarity with
  HTTP terminology.
- One normal navigator hint is compatible with a strong result.
- Core conditional GET is the expected completion point.
- Extension and stretch distinguish depth, not baseline competence.

## Four-point scale

| Level | Meaning                                                 |
| ----- | ------------------------------------------------------- |
| 1     | No clear evidence yet, even with direct help            |
| 2     | Some progress, but needs direct implementation guidance |
| 3     | Expected performance with normal navigator hints        |
| 4     | Independent, well-prioritized, and thoroughly verified  |

## Weighted rubric

| Dimension                       |  Points | Expected evidence                                             |
| ------------------------------- | ------: | ------------------------------------------------------------- |
| Orientation and scope           |      15 | Identifies route, handler, store, and feature-only constraint |
| HTTP validator model            |      20 | Explains a strong ETag and its protected representation       |
| Core implementation             |      20 | Emits ETag; exact match returns bodyless 304                  |
| Canonicalization                |      10 | Makes key order irrelevant without changing array order       |
| Guarded update                  |      15 | Requires and checks If-Match before saving                    |
| Testing and verification        |      10 | Verifies headers, status, bodylessness, and persistence       |
| Communication and collaboration |       5 | States assumptions and asks contract questions                |
| Tool judgment                   |       5 | Uses tools narrowly and reviews results                       |
| **Total**                       | **100** |                                                               |

## Expected behavior

- GET returns the current `{ hours }` representation with a quoted SHA-256
  strong ETag.
- An exact `If-None-Match` returns `304` and a null response body.
- Equivalent object-property orders have the same ETag.
- PUT requires `If-Match`; missing is `428`, stale is `412`, and neither saves.
- A successful PUT persists the representation and returns its new ETag.
- Stretch: GET accepts ETag lists and `*`.

## Reference solution

```bash
git apply --unidiff-zero for-interviewer/reference.patch
pnpm check
pnpm exec tsc --project for-interviewer/tsconfig.json
pnpm exec vitest run --config for-interviewer/vitest.config.ts
```
