# 📡 Facilitator playbook: exercise 3

## 🎯 Purpose

Run a full-stack, 50-minute pairing drill on safe webhook delivery. The
candidate traces a delivery from the React table through the API handler and
then makes the client retry flow safe and the server delivery behavior bounded.

Focus on evidence of navigation, incremental implementation, deterministic
tests, accessible UI state, and judgment. Typing speed and completion of every
extension are outside this exercise.

Styling is not assessed; reuse the existing components.

## 🧭 Your path

1. Verify the starter and prepare a candidate-safe archive.
2. Present [`slides/deck.md`](slides/deck.md) from a private screen.
3. Let the candidate trace the delivery row, API client, handler, repository,
   and webhook boundary.
4. Release requirements one at a time.
5. Debrief with [`rubric-and-solution.md`](rubric-and-solution.md).

Private evidence lives in [`acceptance/`](acceptance/) and
[`reference.patch`](reference.patch).

## 🛠️ Before the session

From `03-advanced-02-webhook-retry/`, run:

```bash
pnpm install --frozen-lockfile
pnpm check
```

Confirm that eight starter tests pass: six server tests and two client tests.
The private acceptance suite should collect and fail on behavior against the
starter.

Prepare the candidate archive:

```bash
tar \
  --exclude='./node_modules' \
  --exclude='./dist' \
  --exclude='./for-interviewer' \
  -czf ../03-advanced-02-webhook-retry-candidate.tar.gz .
```

The dev server uses an offline scripted webhook client. Its real sleeper caps
each wait at `baseDelayMs`; starter delivery makes only one attempt and never
sleeps.

## 🗺️ Orientation: minutes 2–10

Ask the candidate to run the starter checks, then trace:

1. `Deliveries` in `src/client/App.tsx`;
2. `createApi` and `fetchTransport`;
3. `handle` and the in-memory delivery repository;
4. `buildRequest`, `classifyAttempt`, and `deliverEvent`;
5. the fake client and recording sleeper in `test/fixtures.ts`.

Ask what happens after one `503`, how the page updates, and how a test can
observe one request without waiting.

## 🔁 Release 1: reliable retry

Reveal at minute 10:

> Make the client half of Retry single-flight: disable the clicked Retry button
> while it is pending, send one request for a double click, use the lowercase
> `idempotency-key` header with value `event.id`, update the row from the
> response, and ignore a response after unmount.
>
> The server half already accepts the retry route and returns the replacement
> delivery. Keep the starter server behavior to one attempt.

#### 🔁 How to reproduce

1. Run `pnpm dev` and open `http://localhost:5173`.
2. Find row `dlv-2` (status "Exhausted").
3. Double-click "Retry".
4. Observe: the attempt count rises by two and the dev server log prints two
   `POST /api/deliveries/dlv-2/retry` lines.
5. Expected: one request, button disabled while it is in flight.
6. Optional: `curl -s -X POST localhost:5173/api/deliveries/dlv-2/retry -i |
head -1` twice shows two `200` responses with no `idempotency-key` sent.

Clarify that requests have no pending state, idempotency header, or abort
handling in the starter. A deferred transport is the smallest UI test tool.

## 💬 Coaching pause: minutes 28–30

Give one observable keep and one adjustment:

> Coach hat on. Keep doing X. For the remaining work, change Y. Coach hat off.

## ⏱️ Release 2: bounded webhook delivery

Release at minute 30 when the client flow is substantially working:

> Make the server half retry `retryable` outcomes up to `maxAttempts` total.
> Before retry number `n`, use the injected sleeper with
> `baseDelayMs * 2 ** (n - 1)`. Do not sleep before the first attempt or after
> the last. Build the outbound webhook request with lowercase
> `idempotency-key: event.id` and keep that request identical across attempts.
>
> On HTTP 429 only, a digits-only lowercase `retry-after` value means seconds
> and replaces that computed delay after multiplication by 1000. Missing,
> empty, fractional, spaced, and nonnumeric values use the computed delay.

The client continues to render the response returned by the server. Do not add
real timers to tests.

When behind, finish the client single-flight path before cutting the server
extension. In the server work, cut `retry-after` and stretch before bounded
retries, stopping behavior, and recorded delays.

## ✅ Optional stretch: already delivered

Release only if bounded retries and `retry-after` are green before minute 36:

> Treat HTTP 409 as `already_delivered` in both unions. Stop immediately with
> no sleep and render a distinct "Already delivered" badge.

## ⏱️ Exact 50-minute agenda

| Time        | Activity                                   | Mode         |
| ----------- | ------------------------------------------ | ------------ |
| 0:00–2:00   | Roles, AI agreement, quiet-time permission | 🎯 Interview |
| 2:00–7:00   | Quiet read and baseline tests              | 🎯 Interview |
| 7:00–10:00  | Explain the existing delivery path         | 🎯 Interview |
| 10:00–12:00 | Release and clarify reliable retry         | 🎯 Interview |
| 12:00–28:00 | Implement the client path in tested slices | 🎯 Interview |
| 28:00–30:00 | One keep and one adjustment                | 💬 Coaching  |
| 30:00–39:00 | Bounded delivery, or finish client core    | 🎯 Interview |
| 39:00–42:00 | Engineering handoff                        | 🎯 Interview |
| 42:00–50:00 | Structured debrief                         | 💬 Coaching  |

## 🪜 Hint ladders

### 🔁 Reliable retry

1. “What observable state identifies the request that is in flight?”
2. “Where should the idempotency key enter the typed request?”
3. “How can a deferred promise prove that two clicks make one call?”

### ⏱️ Bounded delivery

1. “Which function already knows whether a response is worth repeating?”
2. “What bounds the loop, and which failed attempt is last allowed to sleep?”
3. “What should the recording sleeper contain for three attempts?”

## 🧭 Debrief

Ask which fake proved each side effect, what double-click race the pending
state prevents, and where the easiest retry off-by-one error appeared.

## ➡️ After the session

- [ ] Score with [`rubric-and-solution.md`](rubric-and-solution.md).
- [ ] Record one behavior to keep and one to practice.
- [ ] Keep private materials out of the candidate archive.
