# Rubric and reference solution

Keep this file private until the debrief.

## Scoring principles

- Score observable evidence, not speed, confidence, or prior framework
  familiarity.
- A normal hint is compatible with a strong warm-up.
- Record a concrete example for each score you discuss.
- Treat this as one practice signal, not a hiring verdict.

## 100-point rubric

| Dimension                    | Points | Evidence                                                               |
| ---------------------------- | -----: | ---------------------------------------------------------------------- |
| Reproduction and scope       |     15 | Repeats the failing false query and states the expected output         |
| Regression test              |     25 | Adds a test that fails before the fix and asserts non-vegetarian items |
| Query semantics              |     30 | Correctly separates missing, `"true"`, and `"false"` values            |
| Focused implementation       |     15 | Changes the response factory and keeps the Route Handler thin          |
| Verification and explanation |     15 | Runs checks and explains why truthiness caused the result              |

## Reference direction

The factory must only select vegetarian dishes for `vegetarian === "true"` and
must select non-vegetarian dishes for `vegetarian === "false"`. When the
parameter is absent, it must return the full menu.

The minimal reference change is in
[`reference.patch`](reference.patch). It updates `src/menu.ts` and adds the
candidate-level regression test.

Do not require:

- a parsing library;
- a database or server;
- route changes;
- handling undocumented query values beyond preserving the existing all-items
  fallback;
- a UI.

## Acceptance criteria

- `GET /api/menu` returns all four dishes.
- `GET /api/menu?vegetarian=true` returns the two vegetarian dishes.
- `GET /api/menu?vegetarian=false` returns `ramen` and `steak-frites`.
- The public tests and private acceptance tests pass.

## Feedback prompt

“Your regression described the `false` case before you edited the factory.
What did the original truthiness check do with the string value?”
