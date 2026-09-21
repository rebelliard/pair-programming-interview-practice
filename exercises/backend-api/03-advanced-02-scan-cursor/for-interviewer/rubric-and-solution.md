# Rubric and reference solution

Keep this material private until the debrief.

## Scoring

Score observable evidence, not confidence, speed, or familiarity with cursor
syntax. A normal navigator hint is compatible with a strong result.

| Dimension                 | Points | Expected evidence                                        |
| ------------------------- | -----: | -------------------------------------------------------- |
| Orientation and diagnosis |     15 | Traces route, handler, store, comparator, and defect     |
| Cursor contract           |     20 | Uses an opaque token and nullable `nextCursor`           |
| Boundary correctness      |     25 | Excludes new records and handles the timestamp/id tie    |
| Request validation        |     15 | Uses `getAll`; returns JSON errors for bad input         |
| Focused testing           |     10 | Proves mutation, malformed input, and stopping condition |
| Communication             |     10 | States assumptions, choices, and check results           |
| Filter binding stretch    |      5 | Prevents cursor reuse across filters                     |

Total: **100 points**.

## Completion signals

- 60 points: cursor pagination remains stable when a newer event is inserted.
- 85 points: malformed, repeated, and JSON request input has intentional JSON
  errors.
- 100 points: cursor filter binding is covered and explained.

## Reference direction

The reference patch:

1. parses single query values through `getAll()`;
2. decodes the final event from a cursor;
3. returns only events strictly after that event according to `compareEvents`;
4. creates the next cursor from the final returned event;
5. converts parse failures into `400` JSON errors;
6. records the selected `kind` in the cursor.

Apply the patch in a disposable copy:

```bash
git apply --unidiff-zero for-interviewer/reference.patch
pnpm check
pnpm exec tsc --project for-interviewer/tsconfig.json
pnpm exec vitest run --config for-interviewer/vitest.config.ts
```

## Feedback notes

| Time | Observation | Hint level | Keep or change |
| ---- | ----------- | ---------- | -------------- |
|      |             |            |                |
