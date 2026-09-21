---
marp: true
theme: default
paginate: true
title: Pair-programming practice — session lifecycle
---

# 🔄 Pair-programming practice

## Session lifecycle

Today we repair and reshape a pure state machine.

You drive. I navigate.

---

# 🗺️ Today's shape

| Time      | Focus                                  |
| --------- | -------------------------------------- |
| 0–10 min  | Agreement, tests, and transition table |
| 10–28 min | Characterize and fix                   |
| 28–30 min | Brief coaching pause                   |
| 30–39 min | Refactor or finish core                |
| 39–42 min | Engineering handoff                    |
| 42–50 min | Debrief together                       |

---

# 🤝🏽 How we will pair

- Pin current behavior before editing production.
- Separate what the code does from what it should do.
- Change only disagreeing expectations.
- Make the smallest fix before refactoring.
- Quiet work, hints, and partial completion are normal.
- AI requests stay bounded and reviewable.

---

<!--
PRESENTER NOTE
Stop here before the timer. Reveal at minute 2.
-->

# 🗺️ Explore the starter

1. Run the tests.
2. Read the statuses and commands.
3. Draw the transition table.
4. Find which statuses the resume tests cover.
5. Find commands that share a guard.

Do not edit production yet.

---

<!--
PRESENTER NOTE
Reveal at minute 10.
-->

# 🔄 Bug report: stale tab

A scheduled session remained open in a second tab.

Pressing **Resume** made it live although nobody started it.

Ended and cancelled sessions already reject Resume.

#### 🔁 How to reproduce

1. Run `pnpm dev` and open `http://localhost:5173`.
2. Choose session `ses-scheduled` in the Session select.
3. Observe: "Resume" is enabled.
4. Click "Resume".
5. Observe: the status badge shows `live`.
6. Expected: "Resume" is disabled for scheduled and live; the server rejects with `invalid_transition`.
7. Optional: `curl -s -X POST localhost:5173/api/sessions/ses-scheduled/commands -H 'content-type: application/json' -d '{"command":"resume"}'` returns 200 today; expected 409.

### 🛠️ Task

1. Pin the five-status resume row as it behaves today.
2. Compare it with the product table.
3. Flip only wrong expectations and show red.
4. Make the smallest fix.

---

<!--
PRESENTER NOTE
Pause around minute 28.
-->

# 💬 Brief coaching pause

- One behavior to keep.
- One adjustment for the remaining work.

Then we return to pairing.

---

<!--
PRESENTER NOTE
Reveal only when core is green.
-->

# 📋 Product request: one source of legality

Add `canApply(status, command): boolean`.

- Make every command consult it.
- Keep the exhaustive switch for target status only.
- Test all 25 cells.
- Hardcode the eight legal cells from the product table.
- Do not derive test expectations from production data.

Runtime behavior must not change, except a stale tab must recover:

#### 🔁 How to reproduce

1. Open `ses-live` in two browser tabs.
2. In tab A click "End"; status shows `ended`.
3. In tab B (still `live`) click "Pause".
4. Observe: nothing changes in tab B; the server returned 409.
5. Expected: tab B shows "That action is no longer valid" and refreshes to `ended`.

---

<!--
PRESENTER NOTE
Optional. Reveal only when the extension is green before minute 36.
-->

# ♻️ Optional stretch: reopen

Add command `reopen`.

- Only `ended → live` is legal.
- Every other source rejects.
- Add the command to the union first.
- Follow exhaustive type errors.
- Existing cancel behavior stays unchanged.

---

<!--
PRESENTER NOTE
Reveal at minute 39 and stop implementation.
-->

# 📝 Handoff

1. What behavior did you pin?
2. Which expectations changed?
3. What was the smallest fix?
4. Which checks pass?
5. What remains?

---

<!--
PRESENTER NOTE
Reveal at minute 42.
-->

# 💬 Debrief

- What did characterization add?
- Why was changing the shared helper wrong?
- How did the matrix protect the refactor?
- What habit from the series will you keep?

---

# 🙌🏽 Thank you

The purpose is practice, not a verdict.
