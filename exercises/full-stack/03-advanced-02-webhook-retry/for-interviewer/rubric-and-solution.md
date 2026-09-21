# 📊 Rubric and reference solution

Keep this file private until the debrief.

## ⚖️ Scoring principles

- Score observable evidence, not confidence, speed, or mannerisms.
- Normal navigator hints are compatible with a strong result.
- Record a timestamped example for every score.

## 🔢 Four-point scale

| Level | Meaning                                                   |
| ----- | --------------------------------------------------------- |
| 1     | No clear evidence yet, even after direct help             |
| 2     | Some progress; still needs direct implementation guidance |
| 3     | Expected performance with normal navigator hints          |
| 4     | Independent, well-prioritized, and thoroughly verified    |

## 📊 Weighted rubric

| Dimension                           | Weight | Expected level-three evidence                              |
| ----------------------------------- | -----: | ---------------------------------------------------------- |
| Cold-start orientation              |    15% | Traces page → API → handler → delivery                     |
| Clarification and scope             |    10% | Confirms one request, total attempts, and no trailing wait |
| Incremental implementation          |    15% | Completes one narrow end-to-end slice before expanding     |
| Testing with deterministic fakes    |    15% | Asserts calls, delays, attempts, and stopping              |
| Boundary and idempotency discipline |    15% | Uses `event.id`, bounded equal requests, no real network   |
| UI state and accessibility          |    10% | Tests disabled state and controls by role or label         |
| Debugging                           |    10% | Uses a recorded sequence as evidence                       |
| Communication and collaboration     |     5% | Explains decisions and processes hints                     |
| Cursor and tool judgment            |     5% | Delegates narrowly and verifies output                     |

## 🏁 Expected completion

| Progress                                                  | Interpretation           |
| --------------------------------------------------------- | ------------------------ |
| Explains the page and one-attempt delivery path           | Expected orientation     |
| Single-flight button, stable key, and returned row update | Expected live completion |
| Bounded retries and digits-only `retry-after` work        | Strong completion        |
| 409 produces `already_delivered` and a distinct badge     | Stretch completion       |

## ✅ Core acceptance

- Double-clicking Retry sends one request while its button is disabled.
- The request header is `idempotency-key: event.id`.
- The row updates from the response and ignores a result after unmount.

## ⏱️ Bounded delivery acceptance

- Retryable responses are attempted up to `maxAttempts` total.
- `baseDelayMs * 2 ** (n - 1)` applies only before a subsequent attempt.
- A digits-only `retry-after` on HTTP 429 becomes seconds multiplied by 1000.
- Missing or malformed values fall back to the computed delay.

## ✅ Stretch acceptance

- HTTP 409 classifies as `already_delivered`.
- Delivery stops immediately without a sleep.
- The page shows an "Already delivered" badge.

## 🧭 Reference direction

The patch makes the client button single-flight and adds its idempotency header.
It then changes `deliverEvent` to a bounded loop using the injected sleeper and
extends the exhaustive status switches for the stretch.

Apply [`reference.patch`](reference.patch) in a disposable copy:

```bash
git apply --unidiff-zero for-interviewer/reference.patch
pnpm check
pnpm exec tsc --project for-interviewer/tsconfig.json
pnpm exec vitest run --config for-interviewer/vitest.config.ts
```

## 📝 Feedback notes

| Time | Observation | Hint level | Dimension | Keep or change |
| ---- | ----------- | ---------- | --------- | -------------- |
|      |             |            |           |                |
