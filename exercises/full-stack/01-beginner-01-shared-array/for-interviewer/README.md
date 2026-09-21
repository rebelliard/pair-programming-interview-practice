# 🔒 Interviewer guide: one-time warm-up

Keep this folder private.

## 🧭 Your path

1. 🧪 **Verify** the starter and the reference patch (below).
2. 📦 **Prepare and inspect** the candidate package (below).
3. 📨 **Send it** one full day before the live session, with the message below.
4. 🌙 **Evening before, optional:** ask for the candidate's warm-up diff to
   learn how they reasoned. Do not continue in that copy.
5. ➡️ **Start the live session** from a clean
   [02-intermediate-01-ticket-search candidate package](../../02-intermediate-01-ticket-search/for-interviewer/README.md).

This warm-up has two runs. Before a real interview it is the optional
take-home. As practice it is a 45-minute solo drill: the candidate asks their
agent for `/practice-exercise`, then chooses Exercise 0
([`../../../../.agents/skills/practice-exercise/SKILL.md`](../../../../.agents/skills/practice-exercise/SKILL.md)).
The skill shows the guide, verifies the package, keeps the clock, and offers
`practice-grade-session`
([`../../../../.agents/skills/practice-grade-session/SKILL.md`](../../../../.agents/skills/practice-grade-session/SKILL.md)).
The gated script lives in the skill, outside the package, so the candidate
archive stays clean.

## 🎯 Purpose

Send this warm-up once, one full day before
[`02-intermediate-01-ticket-search`](../../02-intermediate-01-ticket-search/for-interviewer/README.md), or run it as the
first solo drill of the series. It tests whether the candidate can read a small
full-stack TypeScript app, reproduce a render-path mutation with a Testing
Library test, make a focused fix, verify it, and explain any AI assistance. The
live session still starts from the Exercise 1 package; do not continue in this
working copy.

Styling is not assessed; reuse the existing components.

## 📦 Prepare the candidate package

From [`01-beginner-01-shared-array/`](../):

```bash
tar \
  --exclude='./node_modules' \
  --exclude='./dist' \
  --exclude='./for-interviewer' \
  -czf ../01-beginner-01-shared-array-candidate.tar.gz .
```

Inspect it before sending:

```bash
tar -tzf ../01-beginner-01-shared-array-candidate.tar.gz
```

- ✅ It must contain [`for-candidate/`](../for-candidate/), [`src/`](../src/), [`test/`](../test/), and the root tooling
  files.
- 🚫 It must not contain [`for-interviewer/`](./).

Send this message:

> Start with [`for-candidate/README.md`](../for-candidate/README.md), then complete
> [`for-candidate/warm-up-task.md`](../for-candidate/warm-up-task.md). Budget 45 minutes. AI is allowed. The
> live session starts from a clean Exercise 1 package; this warm-up is so you already know the service.

## 🐛 Expected defect

#### 🔁 How to reproduce

1. `pnpm dev`, open `http://localhost:5173`.
2. Look at the "Priority queue" card with "Priority" set to "All priorities".
3. Observe: "Cannot export quarterly report" (normal) is listed above "Payment processor recovered" (urgent); the rows follow the "Updated" dates of "Recent activity", not priority.
4. Expected: urgent rows first, then high, normal, low, in the order the server returns.
5. Optional: `curl -s localhost:5173/api/tickets` returns `ticket-2, ticket-6, ticket-3, ...` (priority order), so the server is not the cause.

## ✅ Expected result

The bug is caused by `Array.prototype.sort()` mutating the shared `tickets`
array inside `RecentActivity` during render. `TicketQueue` then renders the
mutated most-recent order instead of the server's priority order. A minimal
fix copies before sorting: `[...tickets].sort(compareByMostRecent)`. The
server `queryTickets` path already copies; do not treat a server change as the
fix.

The candidate should add a red-first regression that renders `<App>`, waits
for the rows, and asserts that the Priority queue first cells equal the
server order:

Production login unavailable, Payment processor recovered, Invoice contains
the wrong address, Team member cannot upload a logo, Cannot export quarterly
report, Reset an archived workspace, Dashboard loads slowly, Change
notification language.

## 🎬 45-minute practice agenda

Use this agenda when the candidate runs `/practice-exercise` and chooses
Exercise 0. The skill posts the gated script; keep this playbook for
orientation, probes, and debrief.

### 🗣️ Orientation

This is the warm-up on a 45-minute clock: one bug, one failing test, one fix.
AI is allowed; log each request. The candidate restates the user story, then
walks the render path. They write the client regression before they edit
`src/`. After the drill they start Exercise 1 from a clean copy.

### 🎤 Walkthrough probes

| Probe                                                                                       | Good evidence                                                                  |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Which data do `TicketQueue` and `RecentActivity` each receive, and where does it come from? | Both widgets receive the same `tickets` array from `App` state after the fetch |
| What order does the server return, and what order should each widget show?                  | Server and Priority queue: priority order; Recent activity: most recent first  |
| What do the four existing tests cover, and what do they not cover?                          | Server query and list path; no client widget-order assertion                   |

| Clock       | What happens                                                         |
| ----------- | -------------------------------------------------------------------- |
| 0:00–2:00   | Opening; restate the user story                                      |
| 2:00–6:00   | Render-path walkthrough                                              |
| 6:00–8:00   | Walkthrough probes                                                   |
| 8:00–9:30   | `pnpm check` together (four tests, bug still present)                |
| 9:30–11:00  | Coaching pause                                                       |
| 11:00–22:00 | Restate observed vs expected, clarify, write the failing client test |
| 22:00–32:00 | Smallest fix; five tests green                                       |
| 32:00–36:00 | Verify and explain the mutation                                      |
| 36:00–39:00 | Handoff; stop editing                                                |
| 39:00–45:00 | Debrief and grading offer                                            |

### 🧭 Debrief

- Was your test red before the fix? What did the failure say?
- Why can a copy in `queryTickets` or the repository not fix the Priority
  queue?
- What did AI do for you, and what did you verify yourself?
- What is one thing you chose not to do?

## 🪜 Hint ladder

Wait briefly before escalating. Record the highest level used if you later
discuss the warm-up.

### Test

1. Which existing file already builds an in-memory transport for tests, and how
   do the server tests use it?
2. How does a person find the Priority queue on the page? Query the region by
   its name, then its rows and first cells.
3. Render `<App>` with `createApi(createInMemoryTransport())`, await a known
   cell such as `ticket-2`, then compare the Priority queue first cells with
   the server order.

### Fix

1. “What exactly changed according to the failing assertion?”
2. “Which line touches the array that both widgets receive from `App` state?”
3. “Does `sort()` return an independent array?”
4. “`sort()` mutates. Copy the array before sorting.”

## 🧪 Verify the reference patch

Use a disposable copy:

```bash
cp -R 01-beginner-01-shared-array /tmp/01-beginner-01-shared-array
cd /tmp/01-beginner-01-shared-array
git apply --unidiff-zero for-interviewer/reference.patch
pnpm install --frozen-lockfile
pnpm check
pnpm exec tsc --project for-interviewer/tsconfig.json
pnpm exec vitest run --config for-interviewer/vitest.config.ts
```

✅ The starter has four passing tests. The patched reference has five. The
acceptance config fails against the starter (assertion on Priority queue
order) and passes after the patch.

## ➡️ What's next

Once the package is sent, move to the
[02-intermediate-01-ticket-search facilitator playbook](../../02-intermediate-01-ticket-search/for-interviewer/README.md).
Send the Exercise 1 candidate archive for the live session. After a solo run,
run `/practice-exercise` again and choose Exercise 1 from a clean `02-intermediate-01-ticket-search`
copy. Do not continue in the warm-up working copy. The candidate-facing task
text lives in [`for-candidate/warm-up-task.md`](../for-candidate/warm-up-task.md);
do not edit it between sending and the session.
