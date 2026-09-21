---
marp: true
theme: default
paginate: true
title: Pair-programming practice — merge-patch API
---

# 🩹 Pair-programming practice

## Merge-patch API

You drive. I navigate.

---

# 🗺️ Today's shape

| Time      | Focus                                 |
| --------- | ------------------------------------- |
| 0–10 min  | Agreement, tests, and route mapping   |
| 10–28 min | Characterize and repair core behavior |
| 28–30 min | Brief coaching pause                  |
| 30–39 min | Media type and atomic validation      |
| 39–42 min | Engineering handoff                   |
| 42–50 min | Debrief together                      |

---

# 🤝🏽 How we will pair

- Pin current behavior before editing production.
- Separate what the service does from what it should do.
- Change only expectations that disagree.
- Make the smallest fix before refactoring.
- Quiet work, hints, and partial completion are normal.
- AI requests stay bounded and reviewable.

---

<!--
PRESENTER NOTE
Reveal at minute 2.
-->

# 🗺️ Explore the starter

1. Run the starter tests.
2. Trace the Next route to the factory.
3. Inspect the seeded profile shape.
4. Find how PATCH changes the profile.
5. Name a request that distinguishes shallow replacement from a recursive merge.

Do not edit production yet.

---

<!--
PRESENTER NOTE
Reveal at minute 10.
-->

# 🩹 Bug report: profile edit loses fields

A profile editor changed only a city. The response no longer contained the
profile email, phone, or address country.

Clearing a phone number returned `null` instead of removing the member.

### 🛠️ Task

1. Pin current behavior for a nested update and a clear operation.
2. Compare it with the product contract.
3. Flip only wrong expectations and show red.
4. Make the smallest safe fix.

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

# 📦 Product request: media type and atomic validation

- Require `application/merge-patch+json`.
- Merge the whole candidate profile before validation.
- Return 422 for an invalid final profile.
- Do not persist any member from a rejected request.

One invalid field must not leave earlier fields saved.

---

<!--
PRESENTER NOTE
Optional. Reveal only when extension is green before minute 36.
-->

# 📡 Optional stretch: capability discovery

Add OPTIONS to the profile endpoint.

- Status 204
- `Allow: GET, PATCH, OPTIONS`
- `Accept-Patch: application/merge-patch+json`

Keep Next route files as delegates.

---

<!--
PRESENTER NOTE
Reveal at minute 39 and stop implementation.
-->

# 📝 Handoff

1. What behavior did you pin?
2. Which expectations changed?
3. How does the merge work?
4. Which checks pass?
5. What remains?

---

<!--
PRESENTER NOTE
Reveal at minute 42.
-->

# 💬 Debrief

- What did characterization add?
- Why do arrays replace?
- Why validate only after merge?
- What boundary kept the fix small?

---

# 🙌🏽 Thank you

The purpose is practice, not a verdict.
