# 🎯 Practice: exercise 0 (warm-up)

The shared `/practice-exercise` procedure loads this profile after the candidate chooses Exercise 0. This file holds only the package, schedule, and gate content for this drill. Post gate content verbatim; it is the interviewer's script.

## 📦 Package

- Directory `exercises/full-stack/01-beginner-01-shared-array/`, package name `pairing-interview-exercise-0`.
- Starter: four passing server tests. `test/client/` does not exist yet; the
  candidate creates it. The planted bug is present and is described in the
  candidate guide; there is no hidden release.
- Candidate guide to show: `for-candidate/README.md`, then
  `for-candidate/warm-up-task.md`. The task text lives there.
- AI is allowed, as in the take-home version. Bounded delegations to you are
  part of the drill; log each with `--kind ai`.
- Run `pnpm check`, then `pnpm dev`; the candidate may open and use
  `http://localhost:5173`, but never drive the browser for them.
- Editable paths are `src/client/`, `src/server/`, `src/shared/`,
  `test/client/`, and `test/server/`. The UI uses Tailwind and generated
  shadcn/ui primitives in `src/client/components/ui/`; use these primitives,
  do not edit them, and do not assess styling.
- Timer: `node ../../../.agents/skills/practice-exercise/scripts/practice-timer.mjs <command> --exercise 0`.
- Schedule: [`schedule.json`](schedule.json).
- After this drill the candidate moves to a clean `02-intermediate-01-ticket-search` copy; never
  continue from this working copy.

## ⏱️ Schedule

| Gate               | At    | Kind       | What you do                                             |
| ------------------ | ----- | ---------- | ------------------------------------------------------- |
| `open`             | 0:00  | gate       | Post the opening; ask them to restate the user story    |
| `walkthrough`      | 2:00  | gate       | Ask for the render-path walkthrough; listen             |
| `probes`           | 6:00  | gate       | Post the walkthrough probes                             |
| `checks`           | 8:00  | checkpoint | Run `pnpm check`; expect four green server tests        |
| `coaching`         | 9:30  | gate       | 90-second coaching pause: one keep, one change          |
| `implement`        | 11:00 | gate       | Start the task; failing client test before `src/`       |
| `checkpoint-red`   | 22:00 | checkpoint | Run `pnpm test`; a red Priority-queue regression exists |
| `checkpoint-green` | 32:00 | checkpoint | Run `pnpm check`; expect five green tests including it  |
| `handoff`          | 36:00 | gate       | Stop editing; ask the five handoff questions            |
| `review`           | 39:00 | gate       | Offer `practice-grade-session`                          |
| `end`              | 45:00 | stop       | Close; offer grading again if declined                  |

## 🗣️ Gate content

### ⏱️ `open` — 0:00

> ⏱️ 0:00 — We start. This is the warm-up on a 45-minute clock: one bug, one
> failing test, one fix. Restate the user story in one sentence. We work in this
> `01-beginner-01-shared-array` package. AI is allowed; announce each request so I can
> log it.

### ⏱️ `walkthrough` — 2:00

> ⏱️ 2:00 — Walk me through the starting code for about four minutes. Trace a
> ticket from `src/server/tickets/ticket-repository.ts` through `queryTickets`,
> the handler, `src/client/api.ts`, and `App` state into both widgets. I will
> ask questions at 6:00.

### ⏱️ `probes` — 6:00

> ⏱️ 6:00 — Answer these aloud or here, briefly:
>
> - Which data do `TicketQueue` and `RecentActivity` each receive, and where
>   does it come from?
> - What order does the server return, and what order should each widget show?
> - What do the four existing tests cover, and what do they not cover?

### ⏱️ `checks` — 8:00 (checkpoint, verify `pnpm check`)

Run `pnpm check` from the package root. Post:

> ⏱️ 8:00 — Checks. `pnpm check`: <result>. Four server tests should be green;
> there is no client test yet, and the bug is still present.

Mark `met` when it is green. If it is not, say what fails and that this package
must be green before the regression. Restore a clean `01-beginner-01-shared-array` copy
if the working tree does not run.

### ⏱️ `coaching` — 9:30

> ⏱️ 9:30 — Coach hat on, 90 seconds. Keep: <one observed behavior>. Change for
> the coding part: <one observed behavior>. Coach hat off at 11:00.

Log both with `--kind coaching`. If you have seen nothing to coach yet, ask the
candidate for their own keep and change and log those.

### ⏱️ `implement` — 11:00

> ⏱️ 11:00 — Start the task. The bug report in your guide is the whole request;
> nothing else is coming. Restate observed versus expected in one sentence, ask
> me up to two clarifying questions, then write the failing client test before
> you touch `src/`. Post a line when the test is red and when it is green.

#### 💬 Clarifications (answer only when asked, one row per question)

| Question                                                    | Product answer                                               |
| ----------------------------------------------------------- | ------------------------------------------------------------ |
| Is the Recent activity order part of the contract too?      | Yes. Both widgets keep their intended order.                 |
| Where must the regression test live?                        | A client test in `test/client/` that renders `<App>`.        |
| May I change `GET /tickets` or the server query?            | Their output must not change. Where you fix it is your call. |
| May I add a dependency or edit `src/client/components/ui/`? | No.                                                          |
| Is styling assessed?                                        | No.                                                          |
| May I use AI?                                               | Yes. Delegate bounded tasks to me; I log each one.           |

#### 💡 Hints, test (one level at a time; log `--gate implement --level n`)

1. Which existing file already builds an in-memory transport for tests, and how
   do the server tests use it?
2. How does a person find the Priority queue on the page? Query the region by
   its name, then its rows and first cells.
3. Render `<App>` with `createApi(createInMemoryTransport())`, await a known
   cell such as `ticket-2`, then compare the Priority queue first cells with
   the server order.

#### 💡 Hints, fix (one level at a time; log `--gate implement --level n`)

1. “What exactly changed according to the failing assertion?”
2. “Which line touches the array that both widgets receive from `App` state?”
3. “Does `sort()` return an independent array?”
4. “`sort()` mutates. Copy the array before sorting.”

### ⏱️ `checkpoint-red` — 22:00 (checkpoint, verify `pnpm test`)

Run `pnpm test`. Post:

> ⏱️ 22:00 — Checkpoint. `pnpm test`: <result>. Show me the failing assertion
> and tell me what it proves.

Mark `met` when a candidate test in `test/client/` asserts the Priority queue
order and fails on the starter, or already passes with the fix in and the chat
shows it was red first. If not, say how far behind they are and give the cut:

> Suggested cut: assert only the Priority queue first cells; leave the Recent
> activity assertion for later. The test must exist and be red before you edit
> `src/`.

### ⏱️ `checkpoint-green` — 32:00 (checkpoint, verify `pnpm check`)

Run `pnpm check`. Post:

> ⏱️ 32:00 — Checkpoint. `pnpm check`: <result>. Five tests should be green,
> including your regression. Explain the mutation and the fix in two or three
> sentences.

Mark `met` when it is green with five tests. If not, say how far behind they
are and give the cut:

> Suggested cut: keep the diff to the new test and the smallest change that
> makes it green. No refactor, no new features.

### ⏱️ `handoff` — 36:00

> ⏱️ 36:00 — Stop editing. Give me the handoff:
>
> 1. What works?
> 2. Which checks pass?
> 3. Which assumptions did you make?
> 4. What remains?
> 5. What would you do next?

### ⏱️ `review` — 39:00

> ⏱️ 39:00 — Implementation is over. Want me to grade this session now? I run
> the private acceptance suite, ask you what an interviewer would ask, and
> explain each miss.

### ⏱️ `end` — 45:00

> ⏱️ 45:00 — Time. Well done for staying on the clock. Say `grade` when you
> want the debrief.

## ➡️ Next

After grading, run `/practice-exercise` again and choose Exercise 1 from a clean
`02-intermediate-01-ticket-search` copy, which already contains the accepted fix and its regression
test. Do not continue in this warm-up working copy.
