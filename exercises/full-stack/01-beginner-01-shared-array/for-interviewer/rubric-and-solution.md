# 📊 Rubric and reference solution

Keep this file private from the candidate until a debrief.

## ⚖️ Scoring principles

- Score observable evidence, not confidence, accent, speed, or nervous mannerisms.
- One or two normal hints are compatible with a strong result at this level.
- Record a timestamped example for every score when you discuss the warm-up.
- Treat the result as one practice signal, not a hiring verdict.

## 🔢 Four-point scale

| Level | Meaning                                                   |
| ----- | --------------------------------------------------------- |
| 1     | No clear evidence yet, even after direct help             |
| 2     | Some progress; still needs direct implementation guidance |
| 3     | Expected performance with normal navigator hints          |
| 4     | Independent, well-prioritized, and thoroughly verified    |

## 📊 Weighted rubric

| Dimension                       | Weight | Expected level-three evidence                                               |
| ------------------------------- | -----: | --------------------------------------------------------------------------- |
| Baseline and walkthrough        |    15% | Explains the shared array, the two widgets, and the intended priority order |
| Clarification and scope         |    10% | Restates observed vs expected and keeps the fix to the reported mutation    |
| Codebase navigation             |     5% | Traces client render, API fetch, and server query before editing            |
| Incremental implementation      |    20% | Writes the failing test first, then the smallest copy-before-sort change    |
| Testing and verification        |    15% | Adds a meaningful client regression and runs `pnpm check`                   |
| Diagnosis and debugging         |     5% | Names `sort()` mutation of the shared `tickets` array from evidence         |
| UI state and accessibility      |    10% | Queries the Priority queue by role or label and asserts visible row order   |
| Communication and collaboration |    10% | Explains the mutation, the test, and the copy in a few sentences            |
| Cursor and tool judgment        |    10% | Delegates narrowly if AI is used, explains retained output, and verifies it |

Use the weights only to compare practice sessions. A useful target is level
three in most areas, with no level one in diagnosis, implementation, or
testing. Do not classify the person from one score.

Styling is not assessed; reuse the existing components.

## 🏁 Expected completion by level

| Progress                                                             | Interpretation       |
| -------------------------------------------------------------------- | -------------------- |
| Starter checks pass and the candidate can load the app               | Expected preparation |
| A failing client test names the Priority queue order                 | Expected first slice |
| `[...tickets].sort(...)` in `RecentActivity` and five tests pass     | Expected completion  |
| The candidate explains why a server or repository copy cannot fix it | Strong completion    |

## ✅ Core acceptance criteria

### 🐛 Baseline regression

- Rendering Recent activity does not change the Priority queue order.
- The Priority queue first cells match the server order.
- Recent activity still shows most-recent order.
- The candidate can explain that the copy prevents `sort()` from mutating the
  shared array.
- `pnpm check` passes on the submitted state.

## 🧭 Reference implementation direction

In `RecentActivity`, copy before sorting:

```typescript
const recentTickets = [...tickets].sort(compareByMostRecent);
```

Do not change `queryTickets`. The server already copies.

## 📎 Reference files

[`for-interviewer/reference.patch`](reference.patch) contains the complete reference change.

In a disposable copy:

```bash
git apply --unidiff-zero for-interviewer/reference.patch
pnpm check
pnpm exec tsc --project for-interviewer/tsconfig.json
pnpm exec vitest run --config for-interviewer/vitest.config.ts
```

The acceptance tests intentionally fail against the starter and pass against
the reference implementation.

## 📝 Feedback note template

| Time | Observation | Hint level | Dimension | Keep or change |
| ---- | ----------- | ---------: | --------- | -------------- |
|      |             |            |           |                |

✅ Good feedback:

> You wrote the Priority queue assertion before editing `App.tsx`. Keep that
> red-first loop.

❌ Weak feedback:

> You seemed confident.
