# 🎯 Practice: exercise 3

The shared `/practice-exercise` procedure loads this profile after the candidate
chooses Exercise 3. This file holds only the package, schedule, and gate content
for this drill. Post gate content verbatim.

## 📦 Package

- Directory `exercises/full-stack/03-advanced-02-webhook-retry/`, package name `pairing-interview-exercise-3`.
- Starter: eight passing tests. `deliverEvent` sends once and gives up after
  one temporary failure.
- Start in a fresh copy; this drill does not build on earlier exercises.
- Candidate guide to show: `for-candidate/README.md`.
- Run `pnpm check`, then `pnpm dev`; the candidate may open and use
  `http://localhost:5173`, but never drive the browser for them.
- Editable paths are `src/client/`, `src/server/`, `src/shared/`,
  `test/client/`, and `test/server/`. The UI uses Tailwind and generated
  shadcn/ui primitives in `src/client/components/ui/`; use these primitives,
  do not edit them, and do not assess styling.
- Timer: `node ../../../.agents/skills/practice-exercise/scripts/practice-timer.mjs <command> --exercise 3`.
- Schedule: [`schedule.json`](schedule.json).

## ⏱️ Schedule

| Gate              | At    | Kind                | What you do                                            |
| ----------------- | ----- | ------------------- | ------------------------------------------------------ |
| `open`            | 0:00  | gate                | Post the opening; ask them to restate the user story   |
| `read`            | 2:00  | gate                | Quiet read; they run `pnpm test`                       |
| `orientation`     | 7:00  | gate                | Ask for the delivery-path explanation; post the probes |
| `release-1`       | 10:00 | release             | Post Release 1; wait for two clarifying questions      |
| `implement`       | 12:00 | gate                | One line: implement the core in tested slices          |
| `checkpoint-core` | 28:00 | checkpoint          | Run `pnpm test`; coaching pause: one keep, one change  |
| `release-2`       | 30:00 | conditional-release | Post Release 2 only if `checkpoint-core` was met       |
| stretch rule      | <36   | rule                | Post the stretch if Release 2 is green before 36:00    |
| `handoff`         | 39:00 | gate                | Stop editing; ask the five handoff questions           |
| `review`          | 42:00 | gate                | Offer `practice-grade-session`                         |
| `end`             | 50:00 | stop                | Close; offer grading again if declined                 |

## 🗣️ Gate content

### ⏱️ `open` — 0:00

> ⏱️ 0:00 — We start. Restate the user story in one sentence. You have not
> seen this code before; the first minutes are for reading.

### ⏱️ `read` — 2:00

> ⏱️ 2:00 — Run `pnpm test`, then read quietly. Follow `Deliveries` through
> `src/client/api.ts`, `src/server/handle.ts`, request construction, and the
> delivery result. I will ask about it at 7:00.

### ⏱️ `orientation` — 7:00

> ⏱️ 7:00 — Explain the existing delivery path aloud or here, then answer:
>
> - Trace `Deliveries` → `createApi` → `handle` → `buildRequest` → client
>   `send` → `classifyAttempt` → `deliverEvent`.
> - Where are temporary outcomes defined?
> - What happens today after a `503`?
> - What do the fake client and the fake sleeper record?
> - What happens if the fake script is exhausted?
>
> Release 1 arrives at 10:00 whether or not orientation feels complete.

### 🚀 `release-1` — 10:00 (release)

> ⏱️ 10:00 — Release 1: reliable delivery.
>
> Make the client half of Retry single-flight: disable the clicked Retry button
> while it is pending, send one request for a double click, use the lowercase
> `idempotency-key` header with value `event.id`, update the row from the
> response, and ignore a response after unmount.
>
> The server half already accepts the retry route and returns the replacement
> delivery. Keep the starter server behavior to one attempt.
>
> #### 🔁 How to reproduce
>
> 1. Run `pnpm dev` and open `http://localhost:5173`.
> 2. Find row `dlv-2` (status "Exhausted").
> 3. Double-click "Retry".
> 4. Observe: the attempt count rises by two and the dev server log prints two
>    `POST /api/deliveries/dlv-2/retry` lines.
> 5. Expected: one request, button disabled while it is in flight.
> 6. Optional: `curl -s -X POST localhost:5173/api/deliveries/dlv-2/retry -i |
head -1` twice shows two `200` responses with no `idempotency-key` sent.
>
> Restate it, then ask me two clarifying questions before you start.

#### 💬 Clarifications (answer only when asked, one row per question)

| Question                                    | Product answer                                             |
| ------------------------------------------- | ---------------------------------------------------------- |
| Does the client disable every Retry button? | No. Disable only the clicked delivery while it is pending. |
| May a double click create two transports?   | No. One transport call only.                               |
| Where does the key enter the request?       | `src/client/api.ts`; use exactly `event.id`.               |
| What happens after unmount?                 | Ignore the response.                                       |
| Should Release 1 change server retries?     | No. Keep the starter one-attempt server behavior.          |
| What test tool proves the race?             | A deferred transport in `test/client/app.test.tsx`.        |

#### 💡 Hints (one level at a time; log the level)

1. What observable state in `src/client/App.tsx` identifies the request that
   is in flight?
2. Where should the idempotency key enter the typed request in
   `src/client/api.ts`?
3. How can a deferred promise in `test/client/app.test.tsx` prove that two
   clicks make one call?

### ⏱️ `implement` — 12:00

> ⏱️ 12:00 — Implement the core in tested slices. Post a line when a slice
> starts and when it is green. Assert on the client transport calls and pending
> state, not on wall-clock time.

### ⏱️ `checkpoint-core` — 28:00 (checkpoint, verify `pnpm test`)

Run `pnpm test`. Post:

> ⏱️ 28:00 — Checkpoint. `pnpm test`: <result>.
>
> Coach hat on, two minutes. Keep: <one observed behavior>. Change:
> <one observed behavior>. Coach hat off at 30:00.

Log the coaching with `--kind coaching`. Mark `met` when Retry is single-flight,
one transport call occurs on double-click, the clicked button is disabled while
pending, the header is stable, and a client test proves it. If not, give the
cut:

> Suggested cut: get the pending state, one transport call, and one deferred
> transport test green. Leave unmount handling for the handoff if necessary.
> Release 2 stays closed until the core is green.

### 🚀 `release-2` — 30:00 (conditional on `checkpoint-core`)

If met:

> ⏱️ 30:00 — Release 2: `Retry-After`.
>
> Make the server half retry `retryable` outcomes up to `maxAttempts` total.
> Before retry number `n`, use the injected sleeper with
> `baseDelayMs * 2 ** (n - 1)`. Do not sleep before the first attempt or after
> the last. Build the outbound webhook request with lowercase
> `idempotency-key: event.id` and keep that request identical across attempts.
>
> On HTTP 429 only, a digits-only lowercase `retry-after` value means seconds
> and replaces that computed delay after multiplication by 1000. Missing,
> empty, fractional, spaced, and nonnumeric values use the computed delay.
>
> The client continues to render the response returned by the server. Do not
> add real timers to tests.

If not met:

> ⏱️ 30:00 — We use the remaining implementation time to finish Release 1
> cleanly. That is a normal outcome.

#### 💡 Hints for Release 2

1. Which function already knows whether a response is worth repeating?
2. What bounds the loop, and which failed attempt is the last allowed to
   sleep?
3. What should the recording sleeper contain for three attempts? Test the
   server in `test/server/deliver-event.test.ts` and keep the client rendering
   the returned delivery.

### ⏱️ Stretch rule — only if Release 2 is green before 36:00

Record `met --gate release-2` when the candidate shows `Retry-After` green.
If the rule opens:

> ⏱️ <clock> — Optional stretch: already delivered.
>
> Treat HTTP 409 as `already_delivered` in both unions. Stop immediately with
> no sleep and render a distinct "Already delivered" badge.

### ⏱️ `handoff` — 39:00

> ⏱️ 39:00 — Stop editing. Give me the handoff:
>
> 1. What works?
> 2. Which calls and delays do your tests prove?
> 3. Which assumptions did you make?
> 4. What remains?
> 5. What would you do next?

### ⏱️ `review` — 42:00

> ⏱️ 42:00 — Implementation is over. Want me to grade this session now? Before
> we do, one question to answer aloud: what does an idempotency key provide if
> the partner processed a request but the response was lost?

### ⏱️ `end` — 50:00

> ⏱️ 50:00 — Time. Say `grade` when you want the debrief.

## ➡️ Next

After grading, run `/practice-exercise` again and choose Exercise 4,
characterization before change in a session-lifecycle module.
