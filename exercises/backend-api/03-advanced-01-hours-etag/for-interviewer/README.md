# ⏱️ Interviewer guide: hours ETags

Keep this directory private during the exercise.

## Setup

Ask the candidate to work from `for-candidate/README.md`. The visible starter
check passes. The acceptance groups below intentionally fail until the feature
is implemented.

```bash
pnpm check
pnpm exec vitest run --config for-interviewer/vitest.config.ts
```

Run the private acceptance suite only when you choose to reveal progress.

## Suggested pacing

- Minutes 0–5: candidate reads the feature-only brief and traces GET.
- Minutes 5–25: core ETag emission and exact conditional GET.
- Minutes 25–42: canonical representation and guarded PUT.
- Minutes 42–50: test, discuss list/wildcard support, and close.

## Navigator prompts

Use only if the candidate is stuck:

1. “Which representation does this validator describe?”
2. “What must a 304 response contain?”
3. “What state must you read before accepting an update?”
4. “Would a different property order describe a different resource?”

Do not prescribe a serialization strategy unless the candidate asks after
trying one.

## Private checks

- `acceptance/core.acceptance.test.ts`: core behavior.
- `acceptance/extension.acceptance.test.ts`: canonical ETags and guarded PUT.
- `acceptance/stretch.acceptance.test.ts`: conditional GET lists and `*`.

For the intended solution, apply `reference.patch` in a disposable copy, then
run the private typecheck and acceptance suite.
