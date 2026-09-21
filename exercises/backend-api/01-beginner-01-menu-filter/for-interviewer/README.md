# Interviewer guide: menu filter warm-up

Keep this folder private.

## Purpose

This 45-minute API-only warm-up checks whether a candidate can trace a small
request path, write a regression, distinguish string query values, and make a
focused server-side fix.

The candidate package includes `app/`, `src/`, `test/`, tooling files, and
`for-candidate/`. Exclude this `for-interviewer/` folder when sharing it.

## Expected defect

`src/menu.ts` treats any non-empty `vegetarian` query value as true. Therefore
`vegetarian=false` incorrectly returns vegetarian dishes.

The correct contract is:

- no parameter: all dishes;
- `vegetarian=true`: vegetarian dishes;
- `vegetarian=false`: non-vegetarian dishes.

## Expected result

The candidate should first add a regression test, then make the factory
distinguish the two supported string values. The Next.js Route Handler should
remain a thin delegation layer.

## Verify the reference

Use a disposable copy of this package:

```bash
git apply --unidiff-zero for-interviewer/reference.patch
pnpm check
pnpm exec tsc --project for-interviewer/tsconfig.json
pnpm exec vitest run --config for-interviewer/vitest.config.ts
```

The public starter test passes before the patch. The private acceptance suite
fails before the patch and passes after it.

## Hint ladder

1. What type does `URLSearchParams.get()` return?
2. Is `"false"` an empty string?
3. Which supported query values must the response factory distinguish?
4. Keep the Route Handler unchanged; make the factory interpret the value.

## Debrief prompts

- Which assertion was red before you changed the production code?
- Why does a truthiness check not express this API contract?
- What happens when the parameter is absent?
- What did you ask AI to do, and what did you verify yourself?

Use [the rubric](rubric-and-solution.md) to discuss evidence, not speed or
confidence.
