---
marp: true
theme: default
paginate: true
title: Pair-programming practice — workspace invitations
---

# 📨 Pair-programming practice

## Workspace invitations

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
- Explain decisions, discoveries, and expected outcomes.
- Ask product and technical questions.

---

# 🗺️ Explore the starter

1. Run the tests.
2. Trace one write from handler to repository.
3. Explain what makes a repository change durable.

---

# 📨 Product request: invite a member

Client half: wire the form and show pending, success, and error states.

Server half: add `POST /workspaces/:workspaceId/invitations`.

1. Invalid email → `400 invalid_email`
2. Unknown workspace → `404 workspace_not_found`
3. Existing member → `409 already_member`
4. Existing invitation → `409 already_invited`
5. Otherwise append, save, and return `201`

---

# 💬 Brief coaching pause

- One behavior to keep.
- One adjustment for the remaining work.

---

# 🪑 Product request: seat limit

Used seats are:

> `members.length + invitations.length`

Client half: show seats left and disable at zero.

Server half: after duplicate checks, return `409 seat_limit_reached`.

---

# ✅ Optional stretch: accept

Client half: add an Accept button for every invitation.

Server half: add `POST /workspaces/:workspaceId/members`.

---

# 📝 Handoff

1. What works?
2. Which checks pass?
3. What assumptions did you make?
4. What remains?
5. What would you do next?

---

# 💬 Debrief

- What went well?
- What would you change?
- Which fresh read proves persistence?

---

# 🙌🏽 Thank you

The purpose is practice, not a verdict.
