# 💬 Cold-start pairing advice

## 💡 Core message

This is a pairing session, not an exam. The useful signal is how you turn an
unfamiliar problem into small, verified steps with another engineer.

## 🗺️ First five minutes

1. Read [`README.md`](README.md) and the file map.
2. Run the existing tests.
3. Trace one client action through the API client, server handler, and
   repository.
4. Find a test that proves persistence.
5. Summarize the path before editing.

> I will trace one request from the form to the repository. Then I will
> summarize what owns validation, product rules, and persistence.

## 🧩 Build one slice at a time

Use:

**Goal → smallest behavior → focused test → result**

For the form, use Testing Library queries by role or label, create a
`userEvent` instance for each test, and await the visible result with
`findBy...` or `waitFor`. Test the pending disabled state, successful list
update, and rejection message instead of implementation details.

Reuse the generated shadcn/ui primitives. Do not spend time creating custom
styling.

## 🐛 Debugging

Use:

**Name → Diagnose → Fix → Verify**

> I expected the fresh read to include my change, but only the returned object
> changed. I will inspect where this path calls `save()`.

> The response code is wrong while the domain result is correct. I will inspect
> the handler mapping before changing the command.

Change one hypothesis at a time. Rerun the smallest relevant test, then the
full package check.

## 🤖 Cursor and AI

Use:

**Decide → Delegate → Inspect → Verify**

Before a request:

1. State your current understanding.
2. Name the bounded task you want to delegate.
3. Say how you will verify the result.

Avoid accepting new dependencies, unrequested validation, or code you cannot
explain.

## 📝 Closing

Use a factual handoff:

> The happy path and these rejection paths work. A fresh repository read proves
> the write is durable. I assumed X. Y remains. Next I would add Z and rerun the
> full check.
