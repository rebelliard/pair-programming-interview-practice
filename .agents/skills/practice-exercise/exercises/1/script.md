# 🎯 Practice: exercise 1

The shared `/practice-exercise` procedure loads this profile after the candidate chooses Exercise 1. This file holds only the package, schedule, and gate content for this drill. Post gate content verbatim; it is the interviewer's script.

## 📦 Package

- Directory `exercises/full-stack/02-intermediate-01-ticket-search/`, package name `pairing-interview-exercise-1`.
- Starter: five passing tests, including the client regression that keeps the
  Priority queue in server order after Recent activity renders. Always start
  in this package. Do not continue from a warm-up working copy.
- Candidate guide to show: `for-candidate/README.md`.
- Run `pnpm check`, then `pnpm dev`; the candidate may open and use
  `http://localhost:5173`, but never drive the browser for them.
- Editable paths are `src/client/`, `src/server/`, `src/shared/`,
  `test/client/`, and `test/server/`. The UI uses Tailwind and generated
  shadcn/ui primitives in `src/client/components/ui/`; use these primitives,
  do not edit them, and do not assess styling.
- Timer: `node ../../../.agents/skills/practice-exercise/scripts/practice-timer.mjs <command> --exercise 1`.
- Schedule: [`schedule.json`](schedule.json).

## ⏱️ Schedule

| Gate                | At    | Kind                | What you do                                          |
| ------------------- | ----- | ------------------- | ---------------------------------------------------- |
| `open`              | 0:00  | gate                | Post the opening; ask them to restate the user story |
| `walkthrough`       | 2:00  | gate                | Ask for the starting-code walkthrough; listen        |
| `probes`            | 7:00  | gate                | Post the walkthrough probes                          |
| `checks`            | 9:00  | checkpoint          | Run `pnpm check`; expect five green tests            |
| `coaching`          | 11:00 | gate                | 90-second coaching pause: one keep, one change       |
| `release-1`         | 12:30 | release             | Post Release 1; wait for two clarifying questions    |
| `implement`         | 14:00 | gate                | One line: implement in tested slices                 |
| `checkpoint-search` | 27:00 | checkpoint          | Run `pnpm test`; ask for the data-flow explanation   |
| `release-2`         | 29:00 | conditional-release | Post Release 2 only if `checkpoint-search` was met   |
| stretch rule        | <35   | rule                | Post the stretch if Release 2 is green before 35:00  |
| `handoff`           | 39:00 | gate                | Stop editing; ask the five handoff questions         |
| `review`            | 42:00 | gate                | Offer `practice-grade-session`                       |
| `end`               | 50:00 | stop                | Close; offer grading again if declined               |

## 🗣️ Gate content

### ⏱️ `open` — 0:00

> ⏱️ 0:00 — We start. Restate the user story in one sentence. We work in this
> `02-intermediate-01-ticket-search` package.

### ⏱️ `walkthrough` — 2:00

> ⏱️ 2:00 — Walk me through the starting code for about five minutes. Trace
> the priority control through the API client, `GET /tickets`,
> `queryTickets`, and the client widget-order regression. I will ask questions
> at 7:00.

### ⏱️ `probes` — 7:00

> ⏱️ 7:00 — Answer these aloud or here, briefly:
>
> - How does the client priority control reach `queryTickets`?
> - Which array does `RecentActivity` sort, and who else renders that array?
> - What two orders does the client regression protect?
> - Why must the copy happen at the client sort boundary?

### ⏱️ `checks` — 9:00 (checkpoint, verify `pnpm check`)

Run `pnpm check` from the package root. Post:

> ⏱️ 9:00 — Checks. `pnpm check`: <result>. Five tests should be green,
> including the regression test.

Mark `met` when it is green. If it is not, say what fails and that this
package must be green before search. Restore a clean `02-intermediate-01-ticket-search` copy if the
working tree does not run.

### ⏱️ `coaching` — 11:00

> ⏱️ 11:00 — Coach hat on, 90 seconds. Keep: <one observed behavior>. Change
> for the coding part: <one observed behavior>. Coach hat off at 12:30.

Log both with `--kind coaching`. If you have seen nothing to coach yet, ask
the candidate for their own keep and change and log those.

### 🚀 `release-1` — 12:30 (release)

> ⏱️ 12:30 — Release 1: search.
>
> Agents need to find tickets quickly. On the client, add a controlled
> `Search` input that sends `q`. On the server, extend `GET /tickets` and the
> ticket query.
>
> - Match `title` or `requester`.
> - Match case-insensitively.
> - Ignore leading and trailing spaces.
> - Missing or blank `q` means no search.
> - Existing priority filtering and ordering must continue to work.
> - No match returns `200` with an empty ticket list.
>
> Restate it, then ask me two clarifying questions before you start.

#### 💬 Clarifications (answer only when asked, one row per question)

| Question                                | Product answer                                                                |
| --------------------------------------- | ----------------------------------------------------------------------------- |
| Is this fuzzy search?                   | No, substring matching is enough.                                             |
| Does search replace priority filtering? | No, the filters combine using AND.                                            |
| Should search mutate ticket text?       | No. Normalize only for comparison.                                            |
| Is pagination needed?                   | No.                                                                           |
| Where is the client control?            | Add a labelled controlled `Input` in `src/client/App.tsx`.                    |
| Where should matching live?             | `src/server/handle.ts` parses; `src/server/tickets/query-tickets.ts` matches. |

#### 💡 Hints (one level at a time; log the level)

1. What is the smallest end-to-end behavior you can make green? Start with a
   controlled `Input`, then make one `test/client/app.test.tsx` assertion.
2. How does `priority` travel through `src/client/api.ts`,
   `src/server/handle.ts`, and `src/server/tickets/query-tickets.ts`?
3. Can the server normalize `q` once before filtering? Keep the client value
   unchanged.
4. The query shape is `q?.trim().toLowerCase() ?? ""`; test the client control
   by role or label and the server match with a focused test.

### ⏱️ `implement` — 14:00

> ⏱️ 14:00 — Implement in tested slices. Post a line when a slice starts and
> when it is green.

### ⏱️ `checkpoint-search` — 27:00 (checkpoint, verify `pnpm test`)

Run `pnpm test`. Post:

> ⏱️ 27:00 — Checkpoint. `pnpm test`: <result>. Explain the data flow from
> the request to the filtered list in two or three sentences.

Mark `met` when search works end to end with at least one candidate-written
test. If not, say how far behind they are and give the cut:

> Suggested cut: finish the controlled input through the HTTP parse and domain
> match with one client or server test. Release 2 stays closed until search is
> green.

### 🚀 `release-2` — 29:00 (conditional on `checkpoint-search`)

If met:

> ⏱️ 29:00 — Release 2: resolved-ticket visibility.
>
> On the client, add an `Include resolved` checkbox. On the server, resolved
> tickets should be hidden by default and `includeResolved=true` should include
> them.

If not met:

> ⏱️ 29:00 — We use the remaining implementation time to finish search
> cleanly. That is a normal outcome for this exercise.

#### 💡 Hints for Release 2

1. What should the `Checkbox` show before the candidate changes it, and what
   should happen when the query parameter is absent?
2. Which string values should count as true? The server accepts only the
   literal `"true"`.
3. Trace the checkbox through `src/client/api.ts` to
   `src/server/tickets/query-tickets.ts`. Test that search, priority, and
   visibility still combine.

### ⏱️ Stretch rule — only if Release 2 is green before 35:00

Record `met --gate release-2` when the candidate shows visibility green. If
the rule opens:

> ⏱️ <clock> — Optional stretch: oldest ticket first. Within the same
> priority, show the least recently updated ticket first. Priority remains
> the primary ordering; earlier `updatedAt` values come first when priorities
> tie.

Hints: where does ordering live in
`src/server/tickets/query-tickets.ts`; what should the comparator return when
priorities tie; how will you compare timestamps without changing the client
rendering?

### ⏱️ `handoff` — 39:00

> ⏱️ 39:00 — Stop editing. Give me the handoff:
>
> 1. What works?
> 2. Which checks pass?
> 3. Which assumptions did you make?
> 4. What remains?
> 5. What would you do next?

### ⏱️ `review` — 42:00

> ⏱️ 42:00 — Implementation is over. Want me to grade this session now? I run
> the private acceptance suite, ask you what an interviewer would ask, and
> explain each miss.

### ⏱️ `end` — 50:00

> ⏱️ 50:00 — Time. Well done for staying on the clock. Say `grade` when you
> want the debrief.

## ➡️ Next

After grading, run `/practice-exercise` again and choose Exercise 2, a cold
start on a different service.
