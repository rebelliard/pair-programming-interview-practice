---
marp: true
theme: default
paginate: true
title: Pair-programming practice — webhook delivery
---

# 📡 Pair-programming practice

## Webhook delivery

You drive. I navigate.

---

# 🗺️ Today's shape

| Time      | Focus                           |
| --------- | ------------------------------- |
| 0–10 min  | Agreement, tests, and code read |
| 10–28 min | First product request           |
| 28–30 min | Brief coaching pause            |
| 30–39 min | Extension or finish core        |
| 39–42 min | Engineering handoff             |
| 42–50 min | Debrief together                |

---

# 🤝🏽 How we will pair

- You control the editor and terminal.
- Quiet reading and coding are welcome.
- Explain decisions and expected outcomes.
- Ask product and technical questions.
- AI is allowed with a bounded task and verification plan.

---

<!--
PRESENTER NOTE
Reveal at minute 2.
-->

# 🗺️ Explore the starter

1. Run the tests.
2. Trace the Deliveries page and API client.
3. Find the handler and delivery repository.
4. Find request construction and classification.
5. Explain one attempt after a 503.

---

<!--
PRESENTER NOTE
Reveal at minute 10.
-->

# 🔁 Product request: reliable delivery

Client half:

- Retry is disabled while it is pending.
- Double-click sends one request.
- Send `idempotency-key: event.id`.
- Update the row and ignore a response after unmount.

Server half:

- Keep the existing retry route and one-attempt delivery behavior.

#### 🔁 How to reproduce

1. Run `pnpm dev` and open `http://localhost:5173`.
2. Find row `dlv-2` (status "Exhausted").
3. Double-click "Retry".
4. Observe: the attempt count rises by two and the dev server log prints two
   `POST /api/deliveries/dlv-2/retry` lines.
5. Expected: one request, button disabled while it is in flight.
6. Optional: `curl -s -X POST localhost:5173/api/deliveries/dlv-2/retry -i |
head -1` twice shows two `200` responses with no `idempotency-key` sent.

---

# 💬 Brief coaching pause

- One behavior to keep.
- One adjustment for the remaining work.

---

<!--
PRESENTER NOTE
Reveal when the client half substantially works.
-->

# ⏱️ Product request: `Retry-After`

Server half:

- Retry `retryable` outcomes up to `maxAttempts`.
- Sleep `baseDelayMs * 2 ** (n - 1)` only before a later attempt.
- Send `idempotency-key: event.id` on the outbound webhook request and reuse it.
- For HTTP 429 only, digits-only `retry-after` means seconds × 1000.
- Missing or malformed values use the computed delay.

Client half: render the returned delivery row.

---

# ✅ Optional stretch: already delivered

- Treat HTTP 409 as `already_delivered`.
- Add it to both unions.
- Stop without sleep.
- Render an "Already delivered" badge.

---

# 📝 Handoff

1. What works?
2. Which calls and delays prove it?
3. What assumptions did you make?
4. What remains?
5. What would you do next?

---

# 💬 Debrief

- What went well?
- What would you change?
- Where was the easiest off-by-one error?
- What does the stable key protect at the receiver?

---

# 🙌🏽 Thank you

The purpose is practice, not a verdict.
