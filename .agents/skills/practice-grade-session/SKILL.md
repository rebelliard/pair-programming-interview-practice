---
name: practice-grade-session
description: Grade a completed pair-programming practice session from any numbered exercise in the practice series. Use when the candidate says "/practice-grade-session", "grade my session", "score me", "self-review", "assess my exercise", "debrief", or accepts grading at the end of a `/practice-exercise` session. Gathers artifacts, interviews the candidate, then runs two independent high-reasoning reviewers from different families (Claude Opus and GPT Sol) and an Opus validator that writes the scorecard.
---

# 🎯 Grade a practice session

You are the interviewer during the debrief. You gather evidence and interview
the candidate. You do not score the rubric yourself when independent reviewers
can run. Two high-reasoning models from different families score the same
packet without seeing each other; a fresh Claude Opus validator resolves
disagreements and writes the scorecard. You do not fix code.

The candidate ran this session for their own benefit. Some rubric dimensions
(what they said aloud, when they asked, which hints they opened, how they used
AI) leave no trace in the repository. You fill that gap by asking them. Say
this once, at the start of the interview step:

> Some of these dimensions I cannot see from your files. I will ask you about
> them. Honest answers are the only ones that help you here.

## 🧭 Procedure

1. Locate the exercise and confirm the private materials exist.
2. Collect artifacts and run the checks.
3. Split the rubric into artifact-scored and needs-candidate dimensions.
4. Interview the candidate, one question at a time.
5. Launch two independent reviewers (Claude Opus and GPT Sol).
6. Launch a fresh Opus validator on both reviews.
7. Deliver the validator's scorecard, the lessons, and two priorities.

Do every step. Do not skip the interview because the code looks good; the
behavioral dimensions carry 25–35% of the weight in every rubric. Do not skip
the committee because you already have an impression; that impression is the
bias the two reviewers exist to catch. Do not score, teach, or write the
scorecard before the validator returns, unless the fallback in
[`references/committee.md`](references/committee.md) applies.

## 📍 1. Locate

- Read `package.json`. The `name` field is
  `pairing-interview-exercise-<N>` and must match
  `/^pairing-interview-exercise-\d+$/`. Packages live under
  `<series-root>/exercises/<surface>/`; use the selected profile's `kind`
  metadata to identify a warm-up and grade it like any numbered exercise.
- Confirm `for-interviewer/rubric-and-solution.md`,
  `for-interviewer/acceptance/`, and `for-interviewer/reference.patch` exist.
  If they do not, stop and say that grading needs the private folder from the
  series, not the candidate archive.
- If `/practice-exercise` ran the session, read its timer log first:

  ```bash
  node ../../../.agents/skills/practice-exercise/scripts/practice-timer.mjs log --exercise <N>
  ```

  It holds, with session timestamps, every gate fired, every checkpoint met
  or missed, hint levels given, clarifications answered, AI delegations, and
  the candidate's posted transitions. Treat it as primary evidence for the
  timeline, hints, and tool-judgment dimensions. The chat that ran the
  session is evidence too; reread it. If the command reports no session,
  continue without it.

- Otherwise ask the candidate:
  - which releases they opened (core, extension, stretch) and at what minute;
  - where their running log or recording transcript is, if any. Read it if
    given. Treat it as primary evidence for the behavioral dimensions.

## 📦 2. Collect artifacts and run checks

Run from the package root. Record raw output; you will cite it.

```bash
git status --short
git diff --stat
git diff
pnpm check
```

If the working copy is not a git repository, ask the candidate which files they
changed and read those files whole.

Then run the private acceptance suite using one of these paths:

1. When `for-interviewer/grading.json` exists, read and validate it before
   executing any command. Its schema is:

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

   Require `schemaVersion` to be exactly `1`, a nonempty `releases` array,
   unique release IDs, and nonempty text labels. `vitestConfig` is required;
   `typecheckConfig` is optional. Every present config path must be a normalized
   repo-relative path below `for-interviewer/`, with no `..` segment or absolute
   path, and must name an existing file. Every `filter` must match
   `^[a-z0-9-]+\.acceptance$`. Release order is grading order.

   Construct invocations; never execute metadata text:

   ```bash
   pnpm exec tsc --project <typecheckConfig>
   pnpm exec vitest run --config <vitestConfig> <filter>
   ```

   Run the optional TypeScript invocation first, then one Vitest invocation per
   release in listed order. Stop on invalid metadata.

2. Otherwise, use the existing-package fallback. Run
   `pnpm exec tsc --project for-interviewer/tsconfig.json` only when that
   config exists. List `for-interviewer/acceptance/`, take the prefix before
   `.acceptance.test.` from every acceptance filename, and deduplicate groups.
   Order `core`, `extension`, `stretch`, then all remaining groups
   alphabetically. Run one command for each group:

   ```bash
   pnpm exec vitest run --config for-interviewer/vitest.config.ts <group>.acceptance
   ```

   The shared prefix catches both `.ts` and `.tsx` acceptance files.

Group results by release. Failures in a release the candidate did not open are
expected and are not evidence against them. Failures in a release they did open
are missed edge cases; list each by test name.

Record the `pnpm check` summaries for every Vitest project the package defines.
Include each summary in the evidence packet, even when a project has no
candidate-written test.

Read `for-interviewer/rubric-and-solution.md` completely: scoring principles,
the four-point scale, the weighted rubric, acceptance criteria, hidden edge
cases, and the reference direction.

## 🔀 3. Split the rubric

For each rubric dimension, decide what the artifacts can prove and what only
the candidate can tell you. Use this default mapping; adjust to the exercise's
own dimension names.

| Dimension family                                     | Artifacts show                                                                                           | Needs the candidate                                                        |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Orientation / walkthrough                            | Nothing                                                                                                  | What they traced, in what order, what they got wrong at first              |
| Clarification and scope                              | Whether the diff stays inside the released contract                                                      | Which questions they wrote down before opening the clarification table     |
| Incremental implementation                           | Diff size, commit or save order if available, which slices exist                                         | Whether checks were rerun between slices; what they did when a slice broke |
| Testing and verification                             | Test files, assertions, whether tests compare whole results                                              | Whether the test was red before the fix; what they ran and when            |
| Persistence / boundary / characterization discipline | Whether tests prove a fresh read, recorded delays, or a pinned row                                       | Whether the discipline was deliberate or accidental                        |
| UI state and accessibility                           | Testing Library role or label queries, pending disabled controls, inline errors, and stale-state refresh | How the candidate chose and verified the user-visible state                |
| Debugging                                            | The fix itself                                                                                           | The hypothesis they held, what evidence changed it, hint levels opened     |
| Communication                                        | Log or recording only                                                                                    | Everything, if there is no log                                             |
| Cursor and tool judgment                             | Sometimes: generated-looking code, unrequested abstractions                                              | What they delegated, what they rejected, what they verified afterward      |

## 🎤 4. Interview

Ask one question at a time. Wait for the answer. Do not lead, do not suggest
the good answer, and do not react with a verdict between questions. Skip
questions the log already answers; say which log line answered them.

Always cover these five calibration topics first. Check the artifacts and the
current chat before each one, and adapt the wording to what you already know.

1. **Timeline.** "Walk me through the session in order, with rough minutes.
   Where did you lose time, and what was the most challenging part?"
2. **Hints.** Each release has a numbered hint ladder, from the gentlest nudge
   (1) to the most direct (3 or 4). If the timer log lists `note(hint …)`
   entries, you already know the levels; confirm them rather than ask: "The
   log shows hint 2 on Release 1 at 19:40. What were you stuck on, and what
   did the hint change?" Otherwise ask: "For each release, which hint levels
   did you receive, if any?" If they received none, ask what they did the
   first time they were stuck for more than two minutes.
3. **AI use.** If the coding happened in this same chat, or the timer log has
   `note(ai …)` entries, you already have the evidence: reread what they asked
   for, what you produced, and what they kept or changed. Then confirm rather
   than ask cold, for example: "You asked me for a test skeleton and a handler
   branch. Which parts did you keep as written, and what did you change or
   reject?" If the coding happened elsewhere, ask: "What did you use AI for,
   exactly? What did it produce that you rejected?" Score judgment, not
   frequency.
4. **Tests.** First check the diff for new or changed test files.
   - If they wrote tests: "Which test did you write first, and did you see it
     fail before the fix?"
   - If they wrote none: "You did not add a test. Was that a choice or a time
     issue? Did a test matter for this task, and why? With ten more minutes,
     which behavior would you have covered first, and how?" A clear answer here
     still earns partial credit for testing judgment; the missing test caps the
     level.
5. **Stuck moment.** "What did you say aloud or write at the moment you were
   most stuck? What got you moving again?"

Then ask the exercise-specific probes from the facilitator playbook
(`for-interviewer/README.md`, sections "Orientation", "Walkthrough probes",
and "Debrief"). Pick the three that the artifacts left most open.

Cross-check answers against artifacts. If an answer and the artifacts
disagree, say so plainly and without judgment, for example:

> You said the test was red first. The client test only queried the Retry
> button by text, so it did not prove the button was disabled while pending.
> The server test asserted the result but not the fresh stored workspace. Walk
> me through what you saw.

A candidate who corrects themselves here is showing exactly the skill the
rubric wants; keep the corrected account in the packet.

## 🕵️ 5. Independent reviewers

Follow [`references/committee.md`](references/committee.md). Assemble the
packet from steps one through four. Do not add your own scores or a predicted
total.

Launch the two reviewers in the same turn, different model families, high
reasoning: Claude Opus in one lane, GPT Sol in the other. Same packet. No
shared context. They read the rubric and the reference themselves.

Tell the candidate, once:

> Two independent reviewers will score this packet. I will bring back a
> validated scorecard.

Wait for both. Do not start teaching from a partial return.

## ✅ 6. Opus validator

Follow the validator section of
[`references/committee.md`](references/committee.md). Launch a **new** Claude
Opus `Task` with the packet plus both reviews. Do not resume a reviewer. Do
not validate in this parent turn if Opus is available as a subagent — even
when you yourself are Opus, a fresh context is the point.

The validator:

- keeps agreements that the evidence supports;
- re-checks disagreements against the artifact or quote, then picks one
  level (no averages);
- writes every lesson (four parts), overall feedback, and the follow-up
  drill;
- returns the candidate-facing scorecard Markdown, including the Reviewers
  table.

If `Task` cannot run, or neither family has a listed slug, fall back to
single-reader scoring: you perform Score, Compare, and Teach yourself using
the rules inside the reviewer prompt, and label the scorecard
`single-reader`. Say so once.

## 📝 7. Deliver the scorecard

Post the validator's scorecard. Fill the canvas or artifact from it; do not
re-score. If the surface is chat, post that Markdown as is.

### 🧭 Choose the surface

The content is the same everywhere. The surface depends on where you run:

| You are running in                                    | Deliver as                                                        |
| ----------------------------------------------------- | ----------------------------------------------------------------- |
| Cursor desktop or IDE (canvas support available)      | A Cursor canvas, plus a short chat summary with the canvas link   |
| Cursor Cloud agent                                    | Chat Markdown. Do not create a canvas; the user is not in the IDE |
| Claude with artifacts (claude.ai, Claude desktop app) | A React artifact, plus a short chat summary                       |
| Claude Code terminal, or any other agent              | Chat Markdown                                                     |

How to tell: your system prompt names the client. "You are running as a CLOUD
AGENT" means Cursor Cloud. If a `/canvas` command or a `cursor/canvas` SDK is
available, you are in Cursor desktop. If you can emit
`application/vnd.ant.react` artifacts, you are in Claude with artifacts. When
unsure, use chat; it is never wrong.

The chat summary that accompanies a canvas or artifact is the top of the
Markdown shape below, down to and including "One keep", plus the link.

### 🖼️ Cursor canvas

Start from
[`references/scorecard.canvas.tsx`](references/scorecard.canvas.tsx). It
type-checks against the `cursor/canvas` SDK and already contains every section
in the right order. Replace the inline data with this session's evidence,
including `committee` (actual slugs, `mode`, disagreements); keep the
structure. On fallback set `mode` to `"single-reader"`. Follow the `/canvas`
command's rules for the file path, the title pragma, and the single-file
constraint.

Charts, in order of preference:

1. A horizontal `BarChart` of rubric level per dimension, `yMin={0}`,
   `yMax={3}`, with a `referenceLines` entry at the expected level. This is
   the default and is in the template. The SDK has no radar chart; do not
   hand-roll one in SVG.
2. If the candidate's log holds scorecards from earlier exercises, add a
   `LineChart` of weighted totals across exercises 1–N, titled "Weighted total
   by exercise (0–3)".

Every chart needs a title naming the metric, the 0–3 scale in the title or
axis, and a one-line source caption. No emojis, gradients, or shadows in the
canvas; those are chat conventions, not canvas conventions.

### 🖼️ Claude artifact

Start from
[`references/scorecard-artifact.jsx`](references/scorecard-artifact.jsx). It
uses recharts, which artifacts provide, and renders the rubric as a
`RadarChart` with two series: "Expected" (a flat ring at level 2) and "This
session". Keep the radius axis domain at `[0, 3]`. If the radar looks cramped
with the exercise's dimension names, shorten the labels in `radarData` only;
keep the full names in the table. Check the preview before sending; recharts
is not type-checked here.

### 💬 Chat Markdown

Use the shape below as is. For the chart, add one fixed-width block after
"Scores" so the profile is still visible at a glance:

```text
Orientation      ██████████░░░░░  2 / 3
Clarification    █████░░░░░░░░░░  1 / 3
Testing          █████░░░░░░░░░░  1 / 3
Expected level   ██████████░░░░░  2 / 3
```

Five blocks per level; pad names to the longest dimension.

### 📄 Markdown shape

Keep the part before "Lessons" under one screen.

```markdown
# Scorecard: exercise <N>

Releases reached: core ✅ | extension ⬜ | stretch ⬜
Private acceptance: core 9/9 · extension 1/4 (not opened) · stretch n/a
`pnpm check`: ✅

## Two priorities

1. <dimension>: <one observable behavior to practice, tied to evidence>
2. <dimension>: <one observable behavior to practice, tied to evidence>

## One keep

<one observable behavior that worked, tied to evidence>

## Scores

| Dimension | Level | Weight | Evidence | Source        |
| --------- | ----: | -----: | -------- | ------------- |
| ...       |     2 |    20% | ...      | artifact      |
| ...       |     1 |    10% | ...      | self-reported |

Weighted total: <x.x> / 3

## Reviewers

Independent: <lane A model> · <lane B model>
Validator: <opus model>

| Dimension |   A |   B | Validated | Resolution                                     |
| --------- | --: | --: | --------: | ---------------------------------------------- |
| ...       |   2 |   2 |         2 |                                                |
| ...       |   1 |   2 |         1 | <one sentence on the evidence that decided it> |

## Reference comparison

- Difference: ... → trade-off | mistake | equivalent, because ...
- Missed edge cases (opened releases): ...
- Next release direction (if not reached): ...

## Lessons

### 1. <short title of the miss>

- What happened: ...
- Why it matters: ...
- The better move: <snippet or reference lines, then one sentence on why>
- How to spot it next time: <trigger → action>

### 2. ...

## Overall feedback

<three to five sentences to the candidate, evidence-backed, direct, warm>

## Optional follow-up drill (15 minutes, untimed)

<one concrete correction to do now in this working copy>

## Appendix: interview answers

<question → answer, verbatim or close>
```

For an exercise with one release, such as exercise 0, put that release's label
from `grading.json` alone on the `Releases reached` line.

Whatever the surface, offer to append the Markdown version to the candidate's
running log file so the series history stays in one place. If they accept,
append; do not write it inside the exercise package.

End with the smallest existing numeric exercise profile whose ID is greater
than the current exercise **and has the same `surface` metadata**, via
`/practice-exercise` from a fresh package copy. Tell the candidate which ID to
choose. If none exists, offer `/practice-exercise-generator`.

## 🚫 Guardrails

- Never edit `src/` or `test/`. Teaching means showing the better move and
  explaining it; the candidate types the correction in the follow-up drill.
  If asked to apply a fix for them, decline and point to the lesson and the
  reference patch.
- Never show one reviewer's scores to the other. Never resume a reviewer as
  the validator. Never average two levels into a split score.
- Never score in the parent turn when the committee can run. Your impression
  from the interview is not the scorecard.
- Every lesson needs all four parts. A list of failed test names is a
  scoreboard, not teaching.
- Never soften a level to protect feelings. Evidence-based and kind are
  compatible: state the observation, not a personality judgment.
- Never reveal acceptance test bodies or the reference patch to the candidate
  before delivering the scorecard; they may want to rerun the session later.
- Never treat "I would have..." as evidence. Ask what they did.
- If there is no log and no recording, say once that the communication score
  rests entirely on self-report, then proceed.
- Do not score visual styling or Tailwind utility choices. A hand edit under
  `src/client/components/ui/` is scope drift, not an implementation credit.
