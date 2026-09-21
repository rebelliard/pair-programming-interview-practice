# 🔥 Candidate guide: one-time warm-up

⏱️ 45 minutes. One bug, one test, one fix.

## 🎯 User story

> As a support agent using more than one ticket widget, I want opening the
> priority queue to leave the ticket order unchanged, so another widget does not
> unexpectedly reorder.

### 🐛 The problem

The app fetches tickets once and renders two widgets from the same array: a
**Priority queue** that should keep the server's priority order, and **Recent
activity** that should show the most recently updated tickets first.

- **Observed:** after the page loads, the Priority queue lists "Cannot export
  quarterly report" (normal) above "Payment processor recovered" (urgent). The
  rows follow the "Updated" dates of Recent activity, not priority.
- **Expected:** urgent rows first, then high, normal, low, in the order the
  server returns.
- **Where to look:** the React client in
  [`src/client/App.tsx`](../src/client/App.tsx), the API client in
  [`src/client/api.ts`](../src/client/api.ts), and the server query in
  [`src/server/tickets/query-tickets.ts`](../src/server/tickets/query-tickets.ts).
  Something along the render path modifies data it should only read.

#### 🔁 How to reproduce

1. `pnpm dev`, open `http://localhost:5173`.
2. Look at the "Priority queue" card with "Priority" set to "All priorities".
3. Observe: "Cannot export quarterly report" (normal) is listed above "Payment processor recovered" (urgent); the rows follow the "Updated" dates of "Recent activity", not priority.
4. Expected: urgent rows first, then high, normal, low, in the order the server returns.
5. Optional: `curl -s localhost:5173/api/tickets` returns `ticket-2, ticket-6, ticket-3, ...` (priority order), so the server is not the cause.

The existing tests pass because none of them checks the Priority queue after
Recent activity renders. Your task is to reproduce the regression with a test
that fails today, make the smallest fix, and keep the intended output of both
widgets. The full bug report and technical setup are in
[`warm-up-task.md`](warm-up-task.md).

## 🧭 Your path

1. 🤝🏽 **Read the working agreement** below.
2. 🎯 **Do the task:** [`warm-up-task.md`](warm-up-task.md). It includes the
   technical setup and is the main event.
3. ✅ **Run the pre-session checklist** (below).
4. 🎤 **Bring a short explanation of what you learned** to the live session.

📖 Optional reading at any point:
[`advice-and-phrases.md`](advice-and-phrases.md), short advice for the warm-up
and for using AI on it.

## 🗺️ Codebase map

- `src/client/` contains the React application and the API client.
- `src/server/` contains the request handler, ticket query, and in-memory
  repository.
- `src/shared/` contains types used by both client and server.
- `src/client/components/ui/` contains generated shadcn/ui primitives. Use
  them; do not edit them.
- `test/` contains server and client checks that use the in-memory transport.

Styling is not assessed; reuse the existing components.

Open `http://localhost:5173` after `pnpm dev`. The app shows the priority queue
and recent activity on one page.

## 🤝🏽 Working agreement

- Work the way you normally would. You may read, search, run commands, and use
  AI.
- You own the final change. Understand every line you keep and verify the
  result yourself.
- Keep the change focused on the reported bug. Clear, tested code matters more
  than adding extra scope.
- Getting stuck briefly is normal. Use the tests and code as evidence, change
  one thing at a time, and keep moving.
- Stop after 45 minutes. If something remains, write down what you
  would try next.
- The interviewer is on your side. The live session starts from a clean
  Exercise 1 package with the accepted fix already in; knowing this service is
  the preparation you bring.

🤖 AI is allowed. You own the result: keep a short note of what you asked for,
review every retained line, and be ready to explain what you verified. The full
policy is in [`advice-and-phrases.md`](advice-and-phrases.md).

## ✅ Before the live session

- [ ] Run `pnpm check`; formatting, types, and tests are green.
- [ ] Be ready to explain the mutation and the copy in a few sentences.
- [ ] Leave this working copy at home. The live session starts from a clean
      Exercise 1 package that already includes this fix.

## ➡️ What's next

The live session, `02-intermediate-01-ticket-search`, starts from a fresh copy of that package. You
will walk through the starting code for about five minutes, then extend the
same service with one or two product requests. Completing this warm-up means
you already know the request path.

Your interviewer shares the live-session guide,
[`02-intermediate-01-ticket-search/for-candidate/README.md`](../../02-intermediate-01-ticket-search/for-candidate/README.md),
when the session starts. You do not need it before then.
