# 💬 Characterization-first pairing advice

## 💡 Core message

This session rewards restraint. Even when the bug looks obvious, first create a
small test that proves what the code does. Then change the test to the product
rule, observe red, and make the smallest production change.

## 🗺️ Separate “is” from “should”

Use:

**Observe → pin → compare → change expectation → fix**

1. Observe the current result.
2. Write an assertion that passes against it.
3. Compare that result with the product table.
4. Change only disagreeing expectations.
5. Run red before editing production.
6. Make the smallest fix and rerun the full suite.

Useful phrase:

> I think I see the defect, but I will first pin this row as the code behaves
> today. Then I will compare it with the product table.

## 📋 Table-driven tests

Tables are useful when the product itself is a matrix:

- keep the input status explicit;
- keep the command explicit;
- compare whole result objects;
- hardcode expected legal cells from the product table;
- do not derive test expectations from the production transition table.

A test generated from the same table as the implementation proves very little.

On the client, characterize **which buttons are enabled** for each status
before you change production. Query the control by role and name:

```ts
screen.getByRole('button', { name: 'Resume' });
```

Use `userEvent.setup()`, await every click or select, and wait for the badge
text with `findByText` or `waitFor`. Do not assert on class names.

## 🧪 Testing Library

- Query by role, label, or visible text instead of implementation details.
- Create `userEvent` with `userEvent.setup()` and await each interaction.
- Await visible state with `findBy...` or `waitFor` before asserting an async
  result.
- Assert pending and disabled states with `toBeDisabled()`.
- Reach for `Button`, `Badge`, `NativeSelect`, `Label`, and `Alert` from
  `components/ui` instead of styling anything.

## 🤝🏽 Collaboration

- Share your hypothesis before changing code.
- Ask whether a surprising transition is legal or merely harmless.
- Restate a hint as a changed mental model.
- Explain why a narrow fix is enough.
- Invite the interviewer before broad refactoring.

> The helper is correct for cancellation but too broad for resume. I will fix
> the resume guard rather than change the shared definition of terminal.

## 🐛 Debugging

Use:

**Expected cell → observed cell → guard that selected it**

> The scheduled-resume cell returns success but should reject. I will trace
> only the resume branch and the predicate it reuses.

If a table has many failures, start with the first unexpected cell. One wrong
guard can explain several rows.

When the UI and the server disagree, pin both. A button can be enabled while
the API rejects, or both can accept an illegal cell.

## 🤖 Cursor and AI

AI is allowed. Keep requests bounded and make the evidence visible. Real
interview policies vary, so confirm the policy before an actual interview.

Use:

**Decide → Delegate → Inspect → Verify**

Before a request, state your current understanding, name the bounded task, and
say how you will verify the result. Afterward, inspect every changed hunk,
reject unrequested scope, and run the relevant test. Manual work is also a
valid choice.

Good uses include:

- generating the skeleton of a table-driven test;
- tracing which commands share a helper;
- reviewing a focused change for unrequested behavior.

Good bounded prompts:

> Generate only an `it.each` skeleton for these five statuses and the resume
> command. Do not edit production code or decide expected results.

> Review this one-branch fix against the product table. Identify any other
> command whose behavior changes.

Reject suggestions that introduce a state-machine framework, classes, events,
persistence, or timestamps that this session did not ask for.

🎙️ Optional: dictate prompts with a tool such as [Vowen](https://vowen.ai).
Spoken prompts tend to be fuller than typed ones, and the interviewer hears how
you brief an assistant. Practice the hotkey before the session and read the
transcript before sending it.

## ⏱️ Time pressure

Prioritize:

1. focused characterization test;
2. red desired expectation;
3. smallest fix;
4. focused and full checks;
5. handoff.

Skip structural refactoring when the core is not green.

## 📝 Closing

> I pinned X as current behavior, changed Y to match the product table, and
> fixed Z without changing other commands. These tests are green. The broader
> refactor remains, and I would approach it behind the full matrix.
