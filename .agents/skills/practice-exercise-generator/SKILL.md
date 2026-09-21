---
name: practice-exercise-generator
description: Generate, create, or add a new pairing practice exercise with `/practice-exercise-generator`. Asks for seniority, surface, and an optional practice focus, researches and presents current stack options, then creates the portable package, candidate and interviewer materials, schedule, private acceptance suite, reference patch, grading metadata, and a profile for the shared `/practice-exercise` skill.
---

# Generate a pairing exercise

Create one independent live exercise. When creating a new surface, you may also
create that surface's one warm-up. Read the current series, this skill's
[formula](references/formula.md), [model routing](references/model-routing.md),
[research protocol](references/research-protocol.md), and
[generation checklist](references/generation-checklist.md) before writing.
Do not add a second warm-up to an existing surface or change existing exercise
packages.

## Procedure

1. **Preflight.** Confirm a clean, accounted-for worktree and read every existing
   package under `exercises/<surface>/` and
   `practice-exercise/exercises/N/{script.md,schedule.json}` profile. Inspect
   runtime model availability; it is authoritative.
2. **Core intake.** Send exactly one message:

   > Reply with the required answers and any default overrides:
   >
   > 1. Seniority — required: `beginner`, `intermediate`, `advanced`, or `expert`.
   > 2. Surface/type — default `full-stack`: `full-stack`, `frontend-only`,
   >    `backend/API`, `CLI`, `data/SQL`, `platform/DevOps`, `mobile`, or `other`
   >    plus a short description.
   > 3. Task shape — default: planner selects `feature`, `bug/debugging`,
   >    `characterization-refactor`, `performance`, or `other`.
   > 4. Live-pairing length — default 50 minutes. A new surface may include one
   >    45-minute warm-up when requested.
   > 5. Business domain — default: planner chooses an unused domain after reading
   >    all existing exercises.
   > 6. Implementer model — choose from these exposed concrete Grok, Terra, or
   >    Sonnet slugs: `<available slugs>`.
   > 7. Practice focus or constraint — optional. Name a weakness, behavior, or
   >    topic you want the exercise to enforce or include, for example shared-data
   >    mutation, async race conditions, accessibility, error handling,
   >    transaction boundaries, test-first debugging, or keeping changes narrowly
   >    scoped. Reply `skip` for no preference.

   Do not offer `inherit`, invent slugs, silently substitute models, or override
   a user-fixed choice. Treat a selected practice focus as a design constraint
   for the planner, acceptance criteria, and rubric—not as optional flavor text.
   Keep it achievable for the selected seniority and session length. If the user
   replies `skip`, let the planner choose based on series gaps and current trends.

3. **Research and choose the stack.** After core intake, perform fresh generic
   external research using the protocol. For the selected surface, present three
   to five current, compatible stack options with one-line adoption evidence,
   portability/testing trade-offs, the test runner and exact local test command,
   and a recommendation. Reject any option that cannot run deterministic tests
   locally. Always include the nearest current-series option, such as React +
   Vite + Tailwind + shadcn/ui for a web UI. Ask the user to select one; `go`
   accepts the recommendation. If the user already fixed the stack, preserve it
   and use research only to flag compatibility or maintenance risks.
4. **Plan.** Use a fresh, read-only high-reasoning planner to write a design
   specification from the confirmed stack and core intake. The plan must include
   the candidate-facing test command and one or two passing starter example tests
   that exercise real behavior in the chosen stack; use two when the exercise has
   distinct relevant layers, such as UI and API. Ask the user to confirm that
   plan unless they said “just build”. Ask only a few additional questions when
   they materially improve the exercise plan.
5. **Allocate.** Scan package directories, profile directories, and package
   names. Allocate the positive profile/package ID `N` as the current maximum
   plus one. Use `kind` metadata to locate the surface warm-up; allocate a new
   `warm-up` only when this is the first package in its surface. Map the chosen
   seniority to `01-beginner`, `02-intermediate`, `03-advanced`, or `04-expert`.
   Normalize the selected surface to a stable lowercase kebab-case directory
   name. Under `exercises/<surface>/`, allocate that difficulty's sequence as
   its current maximum plus one, zero-pad it to two digits, then create
   `<difficulty>-<sequence>-<short-description>/`. Immediately before writing,
   re-scan and assert that the package directory, profile directory, and
   `pairing-interview-exercise-N` name are unused. Create the package and profile
   directories as the first implementation slice. On a collision, increment and
   recheck up to three times; then stop. Never inspect timer temporary state or
   hide a cross-branch collision.
6. **Delegate.** Route a distinct concrete Grok, Terra, or Sonnet implementer as
   the model-routing rules require. Give one writer one slice at a time:
   starter/skeleton; acceptance; reference patch; docs; profile/schedule/grading
   metadata; registration. Each result is `complete`, `partial`, `blocked`, or
   `failed`; it must not push. Verify actual output independently. Send only one
   corrected packet for a broken slice, then stop.
7. **Verify and hand off.** Run every checklist item, review the diff, stage only
   owned files, and make the logical commit. Report evidence, model lanes, research
   sources, and any stop condition. The implementer never pushes; the orchestrator
   follows the active environment's Git, push, and pull-request policy.

Stop for dirty or unaccounted-for work, a missing/disappeared model lane, an
unsupported research delta, an unresolved collision, or any failed artifact gate.
If no implementer lane exists, ask whether to use orchestrator-labelled
`no-delegation` or abort. If no planner lane exists, stop and ask. Cross-runtime
delegation needs explicit approval.
