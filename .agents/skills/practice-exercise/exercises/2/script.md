# 🎯 Practice: exercise 2

The shared `/practice-exercise` procedure loads this profile after the candidate
chooses Exercise 2. This file holds only the package, schedule, and gate content
for this drill. Post gate content verbatim.

## 📦 Package

- Directory `exercises/full-stack/03-advanced-01-workspace-invite/`, package name `pairing-interview-exercise-2`.
- Starter: seven passing server tests. The invitation handler already
  persists invitations and returns typed errors; the client form renders but
  its submit handler is the no-op gap.
- Start in a fresh copy; this drill does not build on earlier exercises.
- Candidate guide to show: `for-candidate/README.md`.
- Run `pnpm check`, then `pnpm dev`; the candidate may open and use
  `http://localhost:5173`, but never drive the browser for them.
- Editable paths are `src/client/`, `src/server/`, `src/shared/`,
  `test/client/`, and `test/server/`. The UI uses Tailwind and generated
  shadcn/ui primitives in `src/client/components/ui/`; use these primitives,
  do not edit them, and do not assess styling.
- Timer: `node ../../../.agents/skills/practice-exercise/scripts/practice-timer.mjs <command> --exercise 2`.
- Schedule: [`schedule.json`](schedule.json).

## ⏱️ Schedule

| Gate              | At    | Kind                | What you do                                           |
| ----------------- | ----- | ------------------- | ----------------------------------------------------- |
| `open`            | 0:00  | gate                | Post the opening; ask them to restate the user story  |
| `read`            | 2:00  | gate                | Quiet read; they run `pnpm test`                      |
| `orientation`     | 7:00  | gate                | Ask for the write-path explanation; post the probes   |
| `release-1`       | 10:00 | release             | Post Release 1; wait for two clarifying questions     |
| `implement`       | 12:00 | gate                | One line: implement the core in tested slices         |
| `checkpoint-core` | 28:00 | checkpoint          | Run `pnpm test`; coaching pause: one keep, one change |
| `release-2`       | 30:00 | conditional-release | Post Release 2 only if `checkpoint-core` was met      |
| stretch rule      | <36   | rule                | Post the stretch if Release 2 is green before 36:00   |
| `handoff`         | 39:00 | gate                | Stop editing; ask the five handoff questions          |
| `review`          | 42:00 | gate                | Offer `practice-grade-session`                        |
| `end`             | 50:00 | stop                | Close; offer grading again if declined                |

## 🗣️ Gate content

### ⏱️ `open` — 0:00

> ⏱️ 0:00 — We start. Restate the user story in one sentence. You have not
> seen this code before; the first minutes are for reading.

### ⏱️ `read` — 2:00

> ⏱️ 2:00 — Run `pnpm test`, then read quietly. Follow `InviteForm` through
> `src/client/api.ts`, `src/server/handle.ts`, and the repository. I will ask
> about it at 7:00.

### ⏱️ `orientation` — 7:00

> ⏱️ 7:00 — Explain the existing write path aloud or here, then answer:
>
> - Trace `InviteForm` → API client → `handle` → repository.
> - Where does request validation happen, and where do product rules live?
> - Where do errors become status codes?
> - If `save` is skipped, what does a later `findById` see?
> - What proves a write succeeded?
>
> Release 1 arrives at 10:00 whether or not orientation feels complete.

### 🚀 `release-1` — 10:00 (release)

> ⏱️ 10:00 — Release 1: invite a member.
>
> Client half: wire the email form. Disable the submit button while the request
> is pending. On success, show the returned invitation without reloading. On an
> error, show an inline message and retain the email input value.
>
> Server half: `POST /workspaces/:workspaceId/invitations` accepts `{ email }`.
> Invalid email returns `400 invalid_email`; an unknown workspace returns
> `404 workspace_not_found`; existing members and invitations return
> `409 already_member` and `409 already_invited`. Otherwise append the
> invitation, save once, and return `201` with the workspace.
>
> Email comparison is case-insensitive after trimming. Rejections must not
> save.
>
> Restate it, then ask me two clarifying questions before you start.

#### 💬 Clarifications (answer only when asked, one row per question)

| Question                                  | Product answer                                                 |
| ----------------------------------------- | -------------------------------------------------------------- |
| Should whitespace or case be normalized?  | Yes. Trim and compare case-insensitively.                      |
| Is full email-format validation required? | No. A non-empty string containing `@` is enough.               |
| Return the invitation or workspace?       | The updated workspace.                                         |
| Where does the client show an error?      | In `src/client/App.tsx`, with the existing `Alert` primitive.  |
| Where do product rules live?              | `src/server/handlers.ts`; `src/server/handle.ts` routes to it. |
| Can we add a validation library?          | No new dependencies.                                           |
| Does `seatLimit` apply now?               | Not yet. Do not enforce it in Release 1.                       |
| Which duplicate check comes first?        | Member, then invitation.                                       |
| Must rejection avoid `save`?              | Yes.                                                           |

#### 💡 Hints (one level at a time; log the level)

1. In `src/client/App.tsx`, what state can disable the existing `Button` and
   retain the controlled `Input` value after an error?
2. In `src/client/api.ts`, what result shape can let the form distinguish
   success from an error? In `src/server/handlers.ts`, where does the status
   code belong?
3. Which `test/client/` interaction proves the pending and error states, and
   which `test/server/` fresh read proves the invitation was saved?
4. Trim and lower-case for comparison; load, check members, check invitations,
   append, then `save`.

### ⏱️ `implement` — 12:00

> ⏱️ 12:00 — Implement the core in tested slices. Post a line when a slice
> starts and when it is green. A fresh repository read is the proof of a
> server write; on the client, query the form by label or role.

### ⏱️ `checkpoint-core` — 28:00 (checkpoint, verify `pnpm test`)

Run `pnpm test`. Post:

> ⏱️ 28:00 — Checkpoint. `pnpm test`: <result>.
>
> Coach hat on, two minutes. Keep: <one observed behavior>. Change:
> <one observed behavior>. Coach hat off at 30:00.

Log the coaching with `--kind coaching`. Mark `met` when the form has pending,
success, and error states, the server success and duplicate checks work, and
tests prove the UI state plus a fresh repository read. If not, give the cut:

> Suggested cut: finish the form success state, its pending `Button`, and one
> server success path with a fresh-read test. Leave remaining rejections for
> handoff. Release 2 stays closed until the core is green.

### 🚀 `release-2` — 30:00 (conditional on `checkpoint-core`)

If met:

> ⏱️ 30:00 — Release 2: seat limit.
>
> Client half: show a `Seats left` badge and disable the form when no seats
> remain.
>
> Server half: used seats are `members.length + invitations.length`. After
> duplicate member and invitation checks, return `409 seat_limit_reached` when
> used seats are greater than or equal to `seatLimit`. Rejections do not save.

If not met:

> ⏱️ 30:00 — We use the remaining implementation time to finish Release 1
> cleanly. That is a normal outcome.

#### 💡 Hints for Release 2

1. Which two arrays represent used seats, and which existing `Badge` can show
   the client result?
2. Where must the seat check sit in `src/server/handlers.ts` so a duplicate
   member keeps its code?
3. Compute remaining seats from the returned workspace. Add
   `seat_limit_reached` to the server error union and test the disabled form.

### ⏱️ Stretch rule — only if Release 2 is green before 36:00

Record `met --gate release-2` when the candidate shows the seat limit green.
If the rule opens:

> ⏱️ <clock> — Optional stretch: accept an invitation.
>
> Client half: add an accessible Accept button for each invitation and update
> both lists from the returned workspace.
>
> Server half: `POST /workspaces/:workspaceId/members` accepts `{ email }`.
> It returns `404 workspace_not_found` or `404 invitation_not_found`; otherwise
> moves the invitation to members, saves once, and returns `200`.
>
> Acceptance does not free a seat.

### ⏱️ `handoff` — 39:00

> ⏱️ 39:00 — Stop editing. Give me the handoff:
>
> 1. What works?
> 2. Which checks pass?
> 3. Which assumptions did you make?
> 4. What remains?
> 5. What would you do next?

### ⏱️ `review` — 42:00

> ⏱️ 42:00 — Implementation is over. Want me to grade this session now? Before
> we do, one question to answer aloud: what would change if two processes
> invited the final available seat at the same time against a real database?

### ⏱️ `end` — 50:00

> ⏱️ 50:00 — Time. Say `grade` when you want the debrief.

## ➡️ Next

After grading, run `/practice-exercise` again and choose Exercise 3, an outbound
webhook boundary with injected fakes.
