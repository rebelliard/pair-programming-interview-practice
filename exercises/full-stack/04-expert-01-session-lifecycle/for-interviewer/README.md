# 🔄 Facilitator playbook: exercise 4

## 🎯 Purpose

Run a characterization-first lifecycle drill. The candidate must pin current
behavior before fixing a narrow transition bug, then optionally centralize
legality behind the tests and recover a stale tab.

This session measures:

- separating observed behavior from desired behavior;
- choosing a focused characterization slice;
- isolating an over-broad lifecycle guard on the client and the server;
- making the smallest safe fix;
- refactoring only after behavior is protected.

Styling is not assessed; reuse the existing components.

## 🧭 Your path

1. 🛠️ Verify the starter and prepare a candidate-safe archive.
2. 🖥️ Read [`slides/README.md`](slides/README.md), then present
   [`slides/deck.md`](slides/deck.md).
3. 📋 Let the candidate reconstruct the transition table.
4. 🔄 Release the bug and enforce pin-before-change.
5. 📊 Debrief with
   [`rubric-and-solution.md`](rubric-and-solution.md).

Private evidence lives in [`acceptance/`](acceptance/) and
[`reference.patch`](reference.patch).

## 🛠️ Before the session

From [`04-expert-01-session-lifecycle/`](../), run:

```bash
pnpm install --frozen-lockfile
pnpm check
```

✅ Confirm that nine starter tests pass (seven server, two client).

The core acceptance file should run and fail on the two missing resume
rejections and on Resume remaining enabled for scheduled and live.

Prepare the candidate archive:

```bash
tar \
  --exclude='./node_modules' \
  --exclude='./dist' \
  --exclude='./for-interviewer' \
  -czf ../04-expert-01-session-lifecycle-candidate.tar.gz .
```

## 🗣️ Opening script

> This is pairing practice, not a quiz. Today we will pin current behavior in a
> test before changing production code.
>
> You drive and I navigate. Quiet work and hints are normal. A focused,
> well-proven fix is a good outcome.
>
> Cursor is allowed. State your current view, the bounded task, and how you will
> verify its output.

## 🗺️ Orientation: minutes 2–10

Ask the candidate to:

1. run the starter tests;
2. open the app and inspect the Session select;
3. inspect the status and command arrays;
4. draw the transition table from code and tests;
5. identify which statuses the resume tests cover;
6. note that resume and cancel share `isTerminal` on both the client and the
   server.

Do not confirm the bug before minute 10.

## 🔄 Release 1: resume from a stale tab

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

Clarifications:

| Question                                       | Product answer                                      |
| ---------------------------------------------- | --------------------------------------------------- |
| Is resume on live a harmless no-op?            | No; reject so a stale UI can refresh                |
| Must core pin all 25 cells?                    | No; pin only the five-cell resume row               |
| Keep the characterization test after flipping? | Yes; rename it as the regression test               |
| Change the error shape?                        | No                                                  |
| Should other commands change?                  | No                                                  |
| Fix `isTerminal`?                              | The helper is correct for cancel; inspect its reuse |
| Add timestamps or idempotency?                 | No                                                  |

Expected completion is the focused row, red proof, minimal fix on both layers,
and a green suite.

When behind, cut the client characterization before the server resume row. Keep
the smallest production fix on both sides if the bug is visible in the UI.

## 💬 Coaching pause: minutes 28–30

Give one evidence-based keep and one adjustment:

- “You pinned the current row before editing. Keep that discipline.”
- “You found two wrong cells. Next, change only those expectations.”
- “You chose a one-guard fix. Next, rerun other commands before refactoring.”

## 📋 Release 2: one source of legality

Release only when core is green:

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

When behind, cut the `canApply` refactor before cutting stale-tab recovery. A
working inline message plus refetch is more useful than a table-only helper.
Cut the stretch first.

## ♻️ Optional stretch: reopen

Release only if the extension is green before minute 36:

> Add command `reopen`: only `ended → live` is legal.
>
> Add it to `COMMANDS` first, run type-check, and follow the exhaustive errors.
> Every other source rejects. Existing cancel behavior stays unchanged. A
> Reopen button appears and is enabled only from `ended`.

## ⏱️ Exact agenda

| Time        | Activity                                    | Mode         |
| ----------- | ------------------------------------------- | ------------ |
| 0:00–2:00   | Roles, AI agreement, pin-before-change rule | 🎯 Interview |
| 2:00–7:00   | Quiet read and baseline tests               | 🎯 Interview |
| 7:00–10:00  | Reconstruct transitions from code and tests | 🎯 Interview |
| 10:00–12:00 | Bug report and clarifications               | 🎯 Interview |
| 12:00–28:00 | Pin row, flip expectations, minimal fix     | 🎯 Interview |
| 28:00–30:00 | One keep and one adjustment                 | 💬 Coaching  |
| 30:00–39:00 | Centralize legality, or finish core         | 🎯 Interview |
| 39:00–42:00 | Engineering handoff                         | 🎯 Interview |
| 42:00–50:00 | Structured debrief                          | 💬 Coaching  |

## 🪜 Hint ladders

### Core

1. “Which starter test covers resume, and from which statuses?”
2. “Pin all five resume sources as the code behaves today.”
3. “Which rows disagree with the product table?”
4. “How many statuses may resume? How many does this guard allow?”

### Central legality

1. “Where does each command decide legality today?”
2. “What maps a command to its legal source statuses?”
3. “After legality is centralized, what does the switch still decide?”
4. “Does the test oracle come from product rules or production data?”

### Stale tab

1. “What does the client do with a 409 today?”
2. “How can the UI learn the real status after a rejection?”
3. “Which inline component already exposes `role='alert'`?”

### Reopen

1. “Add the command to the union and type-check first.”
2. “Which legality entry and target branch are missing?”

## 🤖 AI prompt

> Choose one bounded task, such as generating the five-row test skeleton.
> Explain how you will verify it. Reject state-machine libraries, classes, or
> features not in the release.

## 🧭 Debrief

Ask:

- What did pinning current behavior add when the bug looked visible?
- Which two cells were wrong?
- Why was changing the shared helper wrong?
- How did the full matrix protect the refactor?
- What would you preserve from the full four-session series?

## ➡️ After the session

- [ ] Score with
      [`rubric-and-solution.md`](rubric-and-solution.md).
- [ ] Record one behavior to keep and one to practice.
- [ ] Keep private materials out of the candidate archive.
