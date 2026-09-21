# Generation checklist

## Slices and ownership

Use one writer and one packet at a time:

1. starter/skeleton;
2. acceptance;
3. reference patch;
4. docs;
5. profile, schedule, and grading metadata;
6. registration.

Re-scan numeric and difficulty-sequence allocation immediately before the first
slice writes `exercises/<surface>/<difficulty>-<sequence>-<description>/` and
`practice-exercise/exercises/N/`. The orchestrator verifies actual output after
each slice. If a slice fails, send one corrected packet with evidence; stop if
it remains broken.

## Artifact gates

- The starter is green after at most one retry.
- The candidate README names the exact package-local test command, the command
  exits zero on the starter, and one or two starter example tests assert real
  behavior in the chosen stack. Use two examples when distinct relevant layers
  need coverage.
- Every released acceptance group is behaviorally red against the starter.
- The reference patch applies in a disposable copy and then makes package checks,
  typecheck, and all release commands green.
- Rubric weights total 100, declared defects have numbered reproductions, and
  feature-only work says so explicitly.
- `grading.json` validates its version, config paths, release IDs, filters,
  labels, and package/profile/README ID consistency.
- A selected practice focus is observable in the task, acceptance criteria, and
  rubric; if the user skipped it, research notes record the planner-selected
  focus and rationale.
- Research notes contain source URLs, access dates, tiers, claims, the researched
  stack shortlist, the confirmed stack and rationale, and selected model
  lanes/slugs.
- Package configuration, candidate setup, acceptance commands, and grading
  metadata all use the confirmed stack. Candidate archives contain no private
  files.

Stop on an unaccounted dirty worktree, unresolved collision after three scans,
missing model lane, unsupported research delta, starter that remains red,
starter-green acceptance, unappliable/non-green patch, non-100 rubric, missing
defect reproduction, or an install that cannot produce a lockfile. Roll back by
reverting or deleting only the generated package, profile, and surface README row; never
hide writes.

## Required validation

Install from the repository root, then run the remaining commands from the
generated package:

```bash
pnpm install
pnpm check
pnpm test # default stack; use the documented equivalent for an approved stack
pnpm build # when the package exposes a build
pnpm dev   # smoke when the package exposes a dev server
pnpm exec tsc --project for-interviewer/tsconfig.json # when present
```

Run the exact command documented in the candidate README. Record the names and
passing output of the one or two starter example tests.

For each grading release, prove the starter fails through the intended
behavioral assertion, then apply `for-interviewer/reference.patch` in a
disposable copy and run every release command green.

Smoke the timer using a temporary state directory and the generated numeric ID:

```bash
state_dir="$(mktemp -d)"
export PRACTICE_EXERCISE_DIR="$state_dir"
node ../../../.agents/skills/practice-exercise/scripts/practice-timer.mjs list
node ../../../.agents/skills/practice-exercise/scripts/practice-timer.mjs start --exercise N
node ../../../.agents/skills/practice-exercise/scripts/practice-timer.mjs fire --exercise N --gate open
node ../../../.agents/skills/practice-exercise/scripts/practice-timer.mjs met --exercise N --gate <first-checkpoint-id>
node ../../../.agents/skills/practice-exercise/scripts/practice-timer.mjs log --exercise N
node ../../../.agents/skills/practice-exercise/scripts/practice-timer.mjs stop --exercise N
node ../../../.agents/skills/practice-exercise/scripts/practice-timer.mjs reset --exercise N --force
rm -rf "$state_dir"
```

From the generated package, format TypeScript and JSON with Biome:

```bash
pnpm format
```

Also check the `grading.json` schema, source metadata, reproduction parity, ID
consistency, candidate archive privacy, and no private links in candidate docs.
