---
marp: true
theme: default
paginate: true
title: Pair-programming practice
---

# 🧩 Pair-programming practice

## Support-ticket queue

Today you explain the starting code, then we build on it together. You drive. I
navigate.

---

# 🗺️ Today's shape

| Time         | Focus                                   |
| ------------ | --------------------------------------- |
| 0–2 min      | Rules and roles                         |
| 2–9 min      | Starting-code walkthrough and questions |
| 9–11 min     | Run the checks together                 |
| 11–12:30 min | Brief coaching pause                    |
| 12:30–39 min | Build one or two product changes        |
| 39–42 min    | Summarize the work                      |
| 42–50 min    | Debrief together                        |

Later requirements are optional. A clear, tested partial solution is a good
outcome.

---

# 🤝🏽 How we will pair

- You control the editor and terminal.
- I answer product questions and act as the navigator.
- Ask for a hint when it would help.
- I may ask what you expect before a command or edit.
- We will make trade-offs together when time is short.

Hints are a normal part of the session.

---

# 🧠 Quiet thinking is welcome

You do not need to narrate every keystroke.

Please share:

- what you are trying to learn;
- decisions and trade-offs;
- what you expect a command or test to show;
- what changed when an assumption was wrong.

You can say:

> I am going quiet for a minute. I will summarize after I run this.

---

# 🤖 Tool agreement

Cursor is allowed here. Live, I also need to follow the decision.

Before an AI request:

1. Tell me what you think.
2. Name the task you want to delegate.
3. Say how you will verify the result.

Afterward, review every change and keep only code you can explain.

Manual work is also a valid choice.

---

# ✅ What a useful session looks like

- Explain the starting code in a clear order.
- Clarify behavior before coding.
- Follow an existing code path.
- Work in small increments.
- Run focused tests as you go.
- Form a hypothesis before debugging.
- Use suggestions and hints thoughtfully.
- Finish with a clear summary.

Completion is useful, but it is not the only signal.

---

<!--
PRESENTER NOTE
Stop here before the timer begins. Confirm screen sharing, then hand over.
Let the candidate lead for about five minutes, then ask two or three probes
from the playbook. Do not reveal later slides yet.
-->

# ▶️ Starting-code walkthrough

Take about five minutes. Show the code and the test run.

1. How does `GET /tickets` reach `queryTickets`?
2. How does the client priority control reach `GET /tickets`?
3. Which array does Recent activity sort, and who else renders it?
4. What does the client widget-order regression protect?
5. What would you check before changing this path?

I will ask a few questions afterward. Then we run the checks together.

---

<!--
PRESENTER NOTE
Reveal at 11:00, after the checks. Keep this pause to 90 seconds. Give one
strength and one behavioral adjustment. Do not reveal implementation details.
-->

# 💬 Brief coaching pause

We will step out of interview mode for 90 seconds.

- One behavior to keep.
- One adjustment for the live coding.

Then we return to pairing.

---

<!--
PRESENTER NOTE
Reveal at 12:30. The candidate already knows this code; the quiet read may be
short. Offer it anyway.
-->

# 🔍 Product request: Search

Add a controlled `Search` input that sends `q` to `GET /tickets`.

- Match `title` or `requester`.
- Match without case sensitivity.
- Ignore leading and trailing spaces.
- Missing or blank `q` means no search.
- Keep existing priority filtering and ordering.
- No match returns `200` with an empty ticket list.

Ask any product questions before you start.

---

<!--
PRESENTER NOTE
Reveal at 29:00 only if search is substantially working. Otherwise keep this
slide hidden and help the candidate finish search.
-->

# 👁️ Product request: Visibility

Add an `Include resolved` checkbox. Resolved tickets should be hidden by
default.

`includeResolved=true` should include them.

Search, priority, and visibility must work together.

---

<!--
PRESENTER NOTE
Reveal only if visibility is green before 35:00. This is a stretch task, not an
expected completion point.
-->

# ⏳ Optional stretch: Queue order

Within the same priority:

> Show the least recently updated ticket first.

Priority remains the first ordering rule.

---

<!--
PRESENTER NOTE
Reveal at 39:00. Stop implementation even if work remains.
-->

# 📝 Handoff

Please give a short engineering handoff:

1. What works?
2. What checks pass?
3. What assumptions did you make?
4. What remains uncovered?
5. What would you do next?

---

<!--
PRESENTER NOTE
Reveal at 42:00. Interview mode is now over. Tie at least one observation to
the walkthrough.
-->

# 💬 Debrief

## Start with your view

- What went well in this session?
- What would you change?

Then we will review:

- two strengths;
- two focused adjustments;
- a few edge cases;
- one next practice drill.

---

# 🙌🏽 Thank you

The purpose of this session is practice, not a verdict.

Keep the useful habits. Choose one small behavior to practice next.
