# 📊 Rubric and reference solution

Keep this file private until the debrief.

## ⚖️ Scoring principles

- Score observable evidence, not speed or confidence.
- Characterization before production change is the primary skill.
- Core completion is expected; extension and stretch show depth.
- Record a timestamped example for each score.

## 📊 Weighted rubric

| Dimension                       |  Points | Expected evidence                                                         |
| ------------------------------- | ------: | ------------------------------------------------------------------------- |
| Cold-start orientation          |      10 | Traces route delegation, store, and nested shape                          |
| Characterization discipline     |      20 | Pins current nested replacement and null storage green before flipping    |
| Contract interpretation         |      10 | Distinguishes object recursion, deletion, scalar replacement, and arrays  |
| Core implementation             |      20 | Produces a small RFC 7396-style merge with no mutation of input           |
| Testing and verification        |      10 | Tests nested siblings, deletion, array/scalar replacement, and no-op      |
| Media type handling             |      10 | Requires `application/merge-patch+json` with a focused 415 response       |
| Atomic validation               |      10 | Validates final document and proves rejected mixed patch does not persist |
| Communication and tool judgment |      10 | Explains evidence, scope, and bounded AI use                              |
| **Total**                       | **100** |                                                                           |

## 🏁 Expected completion

| Progress                                                        | Interpretation           |
| --------------------------------------------------------------- | ------------------------ |
| Identifies the shallow assignment and writes a characterization | Expected orientation     |
| Flips core expectations and safely merges nested objects        | Expected live completion |
| Adds media type enforcement and atomic validation               | Strong completion        |
| Adds OPTIONS and Accept-Patch                                   | Stretch completion       |

## ✅ Core acceptance

- Nested objects merge recursively.
- A null object member deletes that member.
- Arrays and scalar values replace old values.
- `{}` is an observable no-op.
- Starter behavior and core acceptance are green after the candidate updates
  their characterization expectations.

## 📦 Extension acceptance

- `application/merge-patch+json` succeeds.
- Other media types fail with `415` and the documented error body.
- The full merged result is validated before it is persisted.
- An invalid multi-member patch leaves all previous fields unchanged.

## 📡 Stretch acceptance

- OPTIONS returns `204`.
- `Allow` is `GET, PATCH, OPTIONS`.
- `Accept-Patch` is `application/merge-patch+json`.

## 🧭 Reference direction

Use a small recursive function with these cases:

```typescript
if (!isPlainObject(patch)) {
  return structuredClone(patch);
}

const result = isPlainObject(target) ? structuredClone(target) : {};
for (const [key, value] of Object.entries(patch)) {
  if (value === null) {
    delete result[key];
  } else {
    result[key] = mergePatch(result[key], value);
  }
}
```

The route should construct a candidate with the merge function, validate that
candidate, and call `store.replace` only after validation succeeds. The
reference accepts the RFC media type before parsing. It does not add a library,
database, generic schema framework, or route-specific logic to the Next file.

Apply [`reference.patch`](reference.patch) only in a disposable copy:

```bash
git apply --unidiff-zero for-interviewer/reference.patch
pnpm format && pnpm typecheck && pnpm exec vitest run
pnpm exec tsc --project for-interviewer/tsconfig.json
pnpm exec vitest run --config for-interviewer/vitest.config.ts
```

## 📝 Feedback notes

| Time | Observation | Hint level | Dimension | Keep or change |
| ---- | ----------- | ---------: | --------- | -------------- |
|      |             |            |           |                |
