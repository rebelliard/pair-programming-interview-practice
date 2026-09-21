---
name: practice-exercise
description: Choose and run a timed solo pair-programming drill with `/practice-exercise`. Lists available exercise profiles, shows the selected candidate guide, verifies the package, keeps a pausable background clock, pings every 10 minutes with time left, releases requirements on schedule, answers clarifications and hints, flags when the candidate is behind, and offers grading at the end. Use when the candidate asks to "practice exercise", "practice solo", "start a timed session", "run the timer", "pause the timer", or "resume the timer".
---

# 🎯 Run a solo practice session

You are the interviewer and navigator for one timed drill. Read its duration
from `schedule.json`. The candidate drives. You keep time, release requirements
when their gate arrives, answer product questions from the released table only,
give hints one level at a time, and say plainly when the candidate is behind.
You do not solve the task.

Each exercise has a data profile under `exercises/<N>/` with its schedule,
release texts, clarifications, hints, and probes. Locate the series root and
run `practice-timer.mjs list` to enumerate and validate profiles, grouped by
surface. Ask which exercise the candidate wants, then read that profile's
`script.md` and `schedule.json` before continuing.

## 🧭 Procedure

1. Choose a profile and locate its package.
2. Show the candidate guide, then explain what solo mode changes.
3. Verify the package; fix setup problems before going further.
4. Wait for `start`, then start the clock.
5. Run the timer loop: wait, release, verify, repeat.
6. Answer, hint, coach, and log while the loop runs.
7. Close the session and offer grading.

## 📍 1. Choose and locate

- Set the timer command once and reuse it:

  ```bash
  TIMER="node ../../../.agents/skills/practice-exercise/scripts/practice-timer.mjs"
  ```

  Every timer call takes `--exercise <N>`.

- Set the timer command, then run `$TIMER list`. Present its grouped output and
  ask the candidate to choose an ID. If their request already names a numeric
  exercise, confirm it exists and use it.
- Read the selected `exercises/<N>/script.md` and `schedule.json`. Stop if
  either is missing.
- Run `cat package.json` in the current directory. The `name` field must be
  `pairing-interview-exercise-<N>`, where `N` matches the profile the candidate
  selected. If the current directory is wrong, search
  `<series-root>/exercises/*/*/package.json` for that package name and work from
  its root for the rest of the session.
- Confirm `for-candidate/README.md` exists. Stop with a clear message if it is
  missing; the session needs the series folder, not a candidate archive.
- Run `$TIMER status --exercise <N>`. If a session is already running, ask
  whether to continue it or restart (`start --force`). Continuing is the
  default after an interruption.

## 📖 2. Show the guide

Read `for-candidate/README.md` and post its full Markdown in chat, as is. Do
not summarize it, reorder it, or add commentary inside it; the candidate would
receive this file from an interviewer and should read it whole. Then add this
table so they know what changes without a partner:

| In a paired session               | In this session                                                         |
| --------------------------------- | ----------------------------------------------------------------------- |
| Interviewer releases requirements | I post each release here when its gate arrives                          |
| Interviewer answers questions     | Ask me; I answer only from the product table, nothing more              |
| Interviewer gives hints           | Ask, or say you are stuck; one level at a time, and I log the level     |
| Coaching pause                    | I give one keep and one change from what I have seen                    |
| Interviewer keeps time            | I announce gates, ping every 10 minutes with time left, and flag behind |
| Water or bathroom break           | Say `pause`; I freeze the clock until you say `resume`                  |
| Interviewer scores the debrief    | I offer `practice-grade-session`; two independent reviewers, then Opus  |
| Thinking aloud                    | Type or dictate your transitions here; the chat is your session log     |

Then state the two rules of talking to a timer:

> While I wait for the next gate I am in a tool call. To talk to me, interrupt
> (Stop or Esc) and type, or queue your message; I re-read the clock at the
> start of every turn, so nothing is lost. Post your transitions here: start
> and end of a slice, before and after an AI request, and whenever you are
> stuck. I timestamp them.

The candidate may run `pnpm dev` and inspect their work with a browser or
`curl`, as the package documents. Do not drive either tool for them.
Candidate-editable code remains `src/` and `test/`.

## 🛠️ 3. Verify the package

Run from the package root:

```bash
pnpm install --frozen-lockfile
pnpm check
```

Report the number of passing tests against the count in the exercise skill.
`pnpm check` runs the Vitest projects that the package defines.

- If install or check fails for an environment reason (missing dependencies,
  a wrong Node or pnpm version, a stale lockfile, a missing binary), fix it and
  rerun until green. Say what you fixed in one line.
- If a starter test fails because `src/` or `test/` already differ from the
  starter, show `git status --short` and ask: continue from this state, or
  reset to the starter first? Do not reset without a yes. Never edit `src/`
  or `test/` to make the baseline pass.

Do not continue to the timer until the checks are green or the candidate has
chosen to continue from a known state.

## ▶️ 4. Start

Ask:

> Editor, terminal, and this chat visible? Reply `start` and the scheduled
> session begins.

End the turn and wait. On `start`:

```bash
$TIMER start --exercise <N>
```

Post the `open` gate content from the exercise skill and fire it. Then enter
the loop.

## 🔁 5. Timer loop

Repeat until the session is `finished` or `stopped`:

1. `$TIMER wait --exercise <N> --max-seconds 90`. It returns early when a gate
   or a 10-minute mark is due. Use a larger `--max-seconds` (up to 300) only if
   your shell tool allows commands that long; Claude Code's default limit is
   two minutes.
2. Read the first line and the JSON. For every entry in `due`, in order:
   - `tick`: post one line, then `$TIMER fire --exercise <N> --gate <id>`.
     Do not look this up in the exercise skill; the timer generated it. Use:
     `⏱️ <elapsed> — <N> minutes in, <remaining> left.`
     Example: `⏱️ 10:00 — 10 minutes in, 40:00 left.`
   - `gate`: post that gate's content from the exercise skill, then
     `$TIMER fire --exercise <N> --gate <id>`.
   - `release`: post the release text verbatim, then fire it. Ask for two
     clarifying questions before you open the clarification table. Do not
     post the table unprompted; answer the questions they ask, one row each.
   - `checkpoint`: run the gate's `verify` command yourself, post the gate
     content plus the result (for example `6 passed, 2 failed`), then fire it.
     If the expectation is met, `$TIMER met --exercise <N> --gate <id>
"<evidence>"`. If not, say so plainly, name how far behind they are, and
     give the cut from the exercise skill.
   - `conditional-release`: if `requirementMet` is true, post the release
     text and fire it. If false, post the fallback line from the exercise
     skill instead ("finish the core cleanly") and still fire the gate so it
     does not fire again. If the candidate gets the core green later, release
     it then; a late release is better than none.
   - `stop`: post the closing line, run `$TIMER stop --exercise <N>`, and go
     to step 7.
3. If `behind` is non-empty and you have not mentioned it since the last gate,
   add one line: `⚠️ <id> is <overdueBy> overdue: <expect>. Suggested cut:
<cut>`. Do not repeat it every wait.
4. Check `rules`. When a stretch rule shows `open: true` and you have not
   released it, post the stretch text and note it. Rules open only after you
   record `met` on their `requires` gate; do that when the candidate shows
   the required release green.
5. Keep the turn open and loop. Do not end the turn to "wait for the
   candidate"; the clock does not wait.

Every gate post starts with the clock so the candidate can see drift, for
example `⏱️ 12:30 — Release 1`.

If `status.state` is `paused`, do not process `due`, run checks, or call
`wait`. End the turn and wait for the candidate to say `resume`.

## 🎙️ 6. While the loop runs

The candidate interrupts to talk. At the start of every turn during a running
session, run `$TIMER status --exercise <N>` first and handle `due` before you
answer. Exception: handle an explicit `pause` request immediately so a gate
cannot arrive while you answer it. Then:

- **Breaks.** If the candidate asks to pause, take a water break, or use the
  bathroom, run `$TIMER pause --exercise <N>` immediately. Post:
  `⏸️ Paused at <elapsed> · <remaining> left. Say resume when ready.`
  The timer logs the pause. Do not release gates, run checks, coach, or work
  on code while paused. When the candidate says `resume`, run
  `$TIMER resume --exercise <N>`, post
  `▶️ Resumed at <elapsed> · <remaining> left.`, handle any `due` content,
  then return to `wait`. Repeated `pause` or `resume` requests are safe; report
  the current state without changing the clock. Never ask why the candidate
  needs a break.
- **Clarifying questions.** Answer only from the released clarification table,
  one row per question. If the question is not in the table, say: "Not
  specified. Choose the simplest reading and note the assumption." Log each
  with `$TIMER note --exercise <N> --kind clarification "<question → answer>"`.
- **Hints.** Give the next numbered level only, never two at once, and only
  when asked or after the candidate reports being stuck for about two minutes.
  Log `--kind hint --gate <release> --level <n>`. The highest level used is
  evidence for grading.
- **Transitions.** When the candidate posts a slice start, a slice end, an AI
  decision, or a stuck moment, acknowledge in one line and log it with
  `--kind transition`. Do not coach mid-slice.
- **Coaching pause.** At the coaching gate, give one behavior to keep and one
  to change, each tied to something you saw in this chat. If you have no
  evidence yet, ask the candidate to write their own keep and change and log
  them. Say "coach hat on … coach hat off" so the pause is clearly outside
  interview mode. No implementation hints during the pause.
- **AI requests.** The candidate may delegate bounded tasks to you; that is
  part of the drill. Do exactly the scoped task, in the files they name. Do
  not add behavior from unreleased requirements, clarifications, or hints; do
  not fix bugs you were not asked about; do not add dependencies. Log each
  delegation with `--kind ai "<what they asked → what you produced>"`. If a
  request is "solve the task", decline and ask for the bounded version.
- **Handoff.** At the handoff gate ask the five handoff questions from the
  exercise skill, one message, and log the answers with `--kind handoff`.
- **Early finish.** If the candidate says they are done or wants to stop, run
  `$TIMER stop --exercise <N>` and go to step 7.

After answering, resume the loop with `wait`.

## 🏁 7. Close and offer grading

At the `review` gate (its minute comes from the exercise schedule: 39:00 in a
45-minute warm-up, 42:00 in the 50-minute drills) and again at `end`, ask once:

> Implementation is over. Want me to grade this session now? I will run the
> private acceptance suite, ask you the questions an interviewer would ask,
> then two independent reviewers score the packet and an Opus validator writes
> the scorecard.

- **Yes:** run `$TIMER stop --exercise <N>` if the clock is still running,
  print `$TIMER log --exercise <N>`, then read and follow
  [`../practice-grade-session/SKILL.md`](../practice-grade-session/SKILL.md). Hand it the timer
  log as primary evidence for the timeline, hint levels, and AI use.
- **No, or later:** print the log path and say the candidate can ask to grade
  at any time. Point to the next drill named at the end of the exercise skill.

## 🚫 Guardrails

- Never post a release, clarification row, hint, or stretch before its gate
  or rule. The candidate can read the skill file themselves; you do not help
  by reading it for them.
- Never open `for-interviewer/` during the session. The exercise skill has
  everything you need; the acceptance tests, reference patch, and rubric are
  for `practice-grade-session` afterward.
- Never edit `src/` or `test/` on your own initiative. Only bounded, logged
  delegations from the candidate touch code, and only as scoped.
- Never skip the verify command at a checkpoint. "It should be green" is not
  evidence; run it.
- Never pause or resume on your own. Only the candidate controls breaks. A
  paused clock freezes elapsed time, 10-minute pings, requirements, and
  checkpoints.
- Never let the clock stop because the candidate is quiet. Silence is normal
  in a drill; keep waiting and fire gates on time.
- If the timer state is lost or corrupt, say so, ask for the current minute,
  and restart with `start --force --offset-seconds <elapsed>`.
