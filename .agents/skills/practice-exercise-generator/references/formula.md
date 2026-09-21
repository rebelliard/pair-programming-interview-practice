# Exercise formula

## Package and learning shape

- Allocate a positive numeric `N`; mirror the nearest compatible existing
  package under `exercises/<surface>/`. Use the numeric ID for the package name
  and practice profile. Place the package in
  `<difficulty>-<sequence>-<short-description>/`, where difficulty is
  `01-beginner`, `02-intermediate`, `03-advanced`, or `04-expert`, and sequence
  is zero-padded to two digits within that surface and difficulty. Normalize
  the surface and short description to lowercase kebab-case. It must be
  portable, standalone, and use pinned local configuration and dependencies
  only—never Mentimeter runtime packages.
- Full-stack is the default and copies the current React 19, Vite, in-package
  API, Vitest, Testing Library, Tailwind, and shadcn shape. Non-full-stack
  surfaces copy the nearest compatible portable TypeScript package and omit a
  layer only when the planner explains why.
- Task shape determines the work: a feature has no declared defect and says so
  explicitly; bug/debugging, characterization-refactor, and performance work
  state numbered reproduction steps for every declared defect.
- Keep the core achievable in the time gate. Existing reference-patch sizes are
  a warning signal, never a quota. A surface may have at most one warm-up.
- If the user selects a practice focus or constraint, make it observable in the
  task, acceptance criteria, and rubric. Do not merely mention it in prose or
  add unrelated complexity. If they skip it, choose a focus from series gaps
  and current research.
- Calibrate by seniority: beginner uses obvious local behavior and more
  scaffolding; intermediate has one thin end-to-end core; advanced adds an
  async/boundary failure and extension; expert uses characterization, ambiguous
  state, or system invariants. Never create difficulty through trick wording or
  volume.

## Stack selection

Choose the stack only after fresh research scoped to the selected surface.
Present three to five complete options rather than isolated libraries: name the
runtime/language, framework, UI/styling layer when relevant, API approach, test
runner, exact local test command, and package manager. Each option states:

- current adoption evidence and source tier;
- fit for the selected surface and task shape;
- portability, setup, browser/runtime, and testing trade-offs; and
- whether its dependencies comply with the repository supply-chain policy.

Always include the nearest current-series option. For a web UI or full-stack
exercise, that is React 19 + Vite + TypeScript + Tailwind + shadcn/ui, with an
in-package API handler and Vitest/Testing Library. Research may recommend
another current option, but popularity is not enough on its own: prefer stacks
that install predictably, fit the session, and support deterministic local
tests. Record the shortlist, sources, recommendation, selected stack, and
rationale in `research-notes.md`.

For `backend-api`, the nearest current-series option is Next.js App Router Route
Handlers with Vitest.

The series defaults to portable TypeScript and Vitest. If the user selects a
non-TypeScript stack, stop before planning and describe the required package,
grading-metadata, and validation changes. Continue only after explicit approval;
do not silently force it into the TypeScript/Vitest contract.

## Required generated artifacts

Create `exercises/<surface>/<difficulty>-<sequence>-<short-description>/` with:

- candidate README and advice;
- a package-local test command documented in the candidate README;
- one or two passing starter example tests that exercise real behavior in the
  selected stack, using two when distinct relevant layers need examples;
- interviewer README, rubric, research notes, and slides;
- private acceptance grouped as `core`, `extension`, and `stretch` when each
  applies;
- interviewer Vitest and TypeScript configuration;
- a zero-context `for-interviewer/reference.patch`;
- `for-interviewer/grading.json`; and
- a matching
  `practice-exercise/exercises/N/{script.md,schedule.json}` profile.

`exercises/<surface>/README.md` gets one sequence row. Create that file when
the surface is new, and add one root Practice index link to it. Self practice
continues through the single `/practice-exercise` skill. The candidate archive
excludes every private file.

Starter checks and every documented candidate test command must be green. The
starter examples must assert meaningful domain, API, or UI behavior—not only
imports, rendering without assertions, or framework setup. Each released
acceptance group must be red for the intended behavior—not because of imports
or configuration. The reference patch must apply to a disposable starter copy
and make all relevant checks green. State numbered reproduction steps for every
declared defect; say explicitly that the exercise is feature-only when none
exists.

## Grading and safety

The private rubric uses levels 1–4 and weights that total exactly 100. Keep
release order, clarifications, hints, and probes structured and equivalent
across candidates. Use psychologically safe wording; do not infer ability from
pairing discomfort, silence, accent, speed, or nervousness.

Generated `for-interviewer/grading.json` has this schema:

```json
{
  "schemaVersion": 1,
  "typecheckConfig": "for-interviewer/tsconfig.json",
  "vitestConfig": "for-interviewer/vitest.config.ts",
  "releases": [
    {
      "id": "core",
      "label": "Release 1: …",
      "filter": "core.acceptance"
    }
  ]
}
```

`schemaVersion` is exactly `1`; `releases` is nonempty with unique IDs; and
release order is grading order. `typecheckConfig` is optional and, when present,
is a normalized repo-relative path below `for-interviewer/`, with no `..` or
absolute path, and names an existing file. `vitestConfig` is required with the
same restrictions and must exist. Each nonempty label has a filter matching
`^[a-z0-9-]+\.acceptance$`. The grader constructs the package-local TypeScript
and Vitest invocations itself; metadata never contains executable shell text.
