# 🔥 Warm-up task

⏱️ 45 minutes.

## 🛠️ Technical setup

From [`01-beginner-01-shared-array/`](../), run:

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm dev
```

✅ Confirm that four tests pass, the type-check succeeds, and
`http://localhost:5173` loads before you change anything.

## 🗂️ The codebase

A small full-stack TypeScript app lists support tickets for a queue view:

- [`src/client/`](../src/client/) is the React application and the API client.
  [`src/client/App.tsx`](../src/client/App.tsx) renders the Priority queue and
  Recent activity from the same fetched array.
- [`src/server/`](../src/server/) is the request handler, ticket query, and
  in-memory repository.
- [`src/shared/`](../src/shared/) holds types used by both sides.
- [`src/client/components/ui/`](../src/client/components/ui/) contains generated
  shadcn/ui primitives. Use them; do not edit them.
- [`test/`](../test/) contains passing Vitest tests and shared fixtures.

Styling is not assessed; reuse the existing components.

## 🐛 Bug report

> Opening the priority queue changes the order of tickets in another widget
> that reads from the same array. The queue itself should stay in the server's
> priority order.

#### 🔁 How to reproduce

1. `pnpm dev`, open `http://localhost:5173`.
2. Look at the "Priority queue" card with "Priority" set to "All priorities".
3. Observe: "Cannot export quarterly report" (normal) is listed above "Payment processor recovered" (urgent); the rows follow the "Updated" dates of "Recent activity", not priority.
4. Expected: urgent rows first, then high, normal, low, in the order the server returns.
5. Optional: `curl -s localhost:5173/api/tickets` returns `ticket-2, ticket-6, ticket-3, ...` (priority order), so the server is not the cause.

## 🎯 Your task

1. Reproduce the bug with a test in [`test/`](../test/) that fails before your
   fix and passes after it. Render `<App>`, wait for the rows, and assert that
   the Priority queue first cells equal the server order.
2. Fix the bug without changing the intended output of `GET /tickets` or of
   Recent activity.
3. Keep all existing tests passing.

## 📏 Rules

- ✅ Change only what the bug requires. Do not add features or refactor other
  code. The live session uses a clean copy of this service with the accepted
  fix already in.
- ✅ Cursor or another AI assistant is allowed. You must be able to explain
  every line you keep and to say what the assistant did for you.
- 🚫 Do not remove, skip, or weaken existing tests.
- ✅ Run `pnpm check` before you stop. Formatting, type-checking, and tests
  must pass.

## 🎒 After you stop

- [ ] A few sentences on the mutation, the test that proved it, and the copy.
- [ ] A note of what AI did and what you verified.
- [ ] Leave this working copy at home.

🚫 Do not prepare slides. The live walkthrough is of the Exercise 1 starting
code, not of this diff.
