# 🎯 Practice: exercise 4

The shared `/practice-exercise` procedure loads this profile after the candidate
chooses Exercise 4. This file holds only the package, schedule, and gate content
for this drill. Post gate content verbatim.

The pin-before-change rule is the point of this drill. If the candidate edits
production code before a characterization test is green, say so once, at the
moment it happens, and log it with `--kind transition`. Do not stop them.

## 📦 Package

- Directory `exercises/full-stack/04-expert-01-session-lifecycle/`, package name `pairing-interview-exercise-4`.
- Starter: nine passing tests. `resume` is under-tested across source
  statuses.
- Start in a fresh copy; this drill does not build on earlier exercises.
- Candidate guide to show: `for-candidate/README.md`.
- Run `pnpm check`, then `pnpm dev`; the candidate may open and use
  `http://localhost:5173`, but never drive the browser for them.
- Editable paths are `src/client/`, `src/server/`, `src/shared/`,
  `test/client/`, and `test/server/`. The UI uses Tailwind and generated
  shadcn/ui primitives in `src/client/components/ui/`; use these primitives,
  do not edit them, and do not assess styling.
- Timer: `node ../../../.agents/skills/practice-exercise/scripts/practice-timer.mjs <command> --exercise 4`.
- Schedule: [`schedule.json`](schedule.json).

## ⏱️ Schedule

| Gate              | At    | Kind                | What you do                                              |
| ----------------- | ----- | ------------------- | -------------------------------------------------------- |
| `open`            | 0:00  | gate                | Post the opening; ask them to restate the user story     |
| `read`            | 2:00  | gate                | Quiet read; they run `pnpm test`                         |
| `orientation`     | 7:00  | gate                | Ask for the transition table from code and tests; probes |
| `release-1`       | 10:00 | release             | Post Release 1; wait for two clarifying questions        |
| `implement`       | 12:00 | gate                | One line: pin the row, flip the wrong cells, minimal fix |
| `checkpoint-core` | 28:00 | checkpoint          | Run `pnpm test`; coaching pause: one keep, one change    |
| `release-2`       | 30:00 | conditional-release | Post Release 2 only if `checkpoint-core` was met         |
| stretch rule      | <36   | rule                | Post the stretch if Release 2 is green before 36:00      |
| `handoff`         | 39:00 | gate                | Stop editing; ask the five handoff questions             |
| `review`          | 42:00 | gate                | Offer `practice-grade-session`                           |
| `end`             | 50:00 | stop                | Close; offer grading again if declined                   |

## 🗣️ Gate content

### ⏱️ `open` — 0:00

> ⏱️ 0:00 — We start. Restate the user story in one sentence. Today the rule
> is: pin what the code does before you change what it should do.

### ⏱️ `read` — 2:00

> ⏱️ 2:00 — Run `pnpm test`, then read quietly:
> `src/client/components/SessionControls.tsx`,
> `src/server/sessions/apply-command.ts`, `src/shared/transitions.ts`, and the
> client and server tests. I will ask for the transition table at 7:00.

### ⏱️ `orientation` — 7:00

> ⏱️ 7:00 — Draw the current transition table from the code and tests, then
> answer:
>
> - Which statuses and commands exist? Where are they listed?
> - Which client and server starter tests cover `resume`, and from which statuses?
> - Which commands share `isTerminal` on both client and server?
>
> Do not decide what the bug is yet. Only describe what the code does.
> Release 1 arrives at 10:00.

### 🚀 `release-1` — 10:00 (release)

> ⏱️ 10:00 — Release 1: resume from a stale tab.
>
> A facilitator kept a scheduled session open in a second tab. Pressing Resume
> there made the session live, although nobody had started it. Ended and
> cancelled sessions reject Resume as expected.
>
> #### 🔁 How to reproduce
>
> 1. Run `pnpm dev` and open `http://localhost:5173`.
> 2. Choose session `ses-scheduled` in the Session select.
> 3. Observe: "Resume" is enabled.
> 4. Click "Resume".
> 5. Observe: the status badge shows `live`.
> 6. Expected: "Resume" is disabled for scheduled and live; the server rejects with `invalid_transition`.
> 7. Optional: `curl -s -X POST localhost:5173/api/sessions/ses-scheduled/commands -H 'content-type: application/json' -d '{"command":"resume"}'` returns 200 today; expected 409.
>
> #### 🛠️ Task
>
> 1. Add one table-driven test that applies `resume` to each of the five
>    statuses and records what the code does today. On the client, pin which
>    buttons are enabled for each status. Run both green.
> 2. Compare each row with the product transition table.
> 3. Flip only expectations that disagree. Run the tests red.
> 4. Make the smallest production change that turns them green. Fix the resume
>    guard on the server `applyCommand` and in `SessionControls`.
> 5. Keep all nine starter tests green.
>
> Restate it, then ask me two clarifying questions before you start.

#### 💬 Clarifications (answer only when asked, one row per question)

| Question                                       | Product answer                                      |
| ---------------------------------------------- | --------------------------------------------------- |
| Is resume on live a harmless no-op?            | No; reject so a stale UI can refresh                |
| Must core pin all 25 cells?                    | No; pin only the five-cell resume row               |
| Keep the characterization test after flipping? | Yes; rename it as the regression test               |
| Change the error shape?                        | No                                                  |
| Should other commands change?                  | No                                                  |
| Fix `isTerminal`?                              | The helper is correct for cancel; inspect its reuse |
| Add timestamps or idempotency?                 | No                                                  |
| What should the client test?                   | Query `Resume` by role and pin when it is enabled.  |
| Which server path owns the rule?               | `src/server/sessions/apply-command.ts`.             |

#### 💡 Hints (one level at a time; log the level)

1. Which starter client and server tests cover resume, and from which statuses?
2. Pin all five server resume sources as the code behaves today. On the
   client, pin `Resume` with a role query for each source status.
3. Which rows disagree with the product table?
4. How many statuses may resume? How many does this guard allow in
   `applyCommand` and `SessionControls`?

### ⏱️ `implement` — 12:00

> ⏱️ 12:00 — Pin the row on both layers, flip the wrong cells, make the
> minimal fix. Post a line at each of those three steps.

### ⏱️ `checkpoint-core` — 28:00 (checkpoint, verify `pnpm test`)

Run `pnpm test`. Post:

> ⏱️ 28:00 — Checkpoint. `pnpm test`: <result>.
>
> Coach hat on, two minutes. Keep: <one observed behavior>. Change:
> <one observed behavior>. Coach hat off at 30:00.

Log the coaching with `--kind coaching`. Mark `met` when both layers have the
resume row pinned, the two wrong cells went red and then green, and the nine
starter tests still pass. If not, give the cut:

> Suggested cut: get the five-row server characterization and the client Resume
> enabled-state test green as the code is today, then flip only the two
> disagreeing cells. Release 2 stays closed until the core is green.

### 🚀 `release-2` — 30:00 (conditional on `checkpoint-core`)

If met:

> ⏱️ 30:00 — Release 2: one source of legality.
>
> Add `canApply(status, command): boolean` in `src/shared/transitions.ts`.
>
> Hardcode the eight legal cells from the product table. Make `applyCommand`
> and `SessionControls` consult it. Keep the exhaustive command switch only for
> choosing the target status.
>
> Add a test for all 25 cells. Do not derive expected results from the
> implementation table.
>
> A stale tab must recover:
>
> #### 🔁 How to reproduce
>
> 1. Open `ses-live` in two browser tabs.
> 2. In tab A click "End"; status shows `ended`.
> 3. In tab B (still `live`) click "Pause".
> 4. Observe: nothing changes in tab B; the server returned 409.
> 5. Expected: tab B shows "That action is no longer valid" and refreshes to `ended`.
>
> On `invalid_transition` the client shows that inline `Alert` and refetches
> `GET /api/sessions/:id` so the badge shows the real status.

If not met:

> ⏱️ 30:00 — We use the remaining implementation time to finish Release 1
> cleanly. That is a normal outcome.

#### 💡 Hints for Release 2

1. Where does each command decide legality today on the client and server?
2. What maps a command to its legal source statuses in
   `src/shared/transitions.ts`?
3. After legality is centralized, what does the switch still decide? On a 409,
   how can `SessionControls` show `Alert` and refetch the session?
4. Does the 25-cell test oracle come from product rules or production data?

### ⏱️ Stretch rule — only if Release 2 is green before 36:00

Record `met --gate release-2` when the candidate shows the 25-cell test green.
If the rule opens:

> ⏱️ <clock> — Optional stretch: reopen.
>
> Add command `reopen`: only `ended → live` is legal.
>
> Add it to `COMMANDS` first, run type-check, and follow the exhaustive errors.
> Every other source rejects. Existing cancel behavior stays unchanged. A
> Reopen button appears and is enabled only from `ended`.

### ⏱️ `handoff` — 39:00

> ⏱️ 39:00 — Stop editing. Give me the handoff:
>
> 1. Which behavior did you pin?
> 2. Which expectations changed, and why?
> 3. What was the smallest production fix?
> 4. Which checks pass?
> 5. What remains, and what would you do next?

### ⏱️ `review` — 42:00

> ⏱️ 42:00 — Implementation is over. Want me to grade this session now? Before
> we do, two questions to answer aloud: what did pinning current behavior add
> when the bug looked visible? Why was changing `isTerminal` the wrong fix?

### ⏱️ `end` — 50:00

> ⏱️ 50:00 — Time. Say `grade` when you want the debrief.

## ➡️ Next

This is the last drill in the full-stack surface. After grading, reread the "Two
priorities" from all four scorecards and rehearse the two that recur.
