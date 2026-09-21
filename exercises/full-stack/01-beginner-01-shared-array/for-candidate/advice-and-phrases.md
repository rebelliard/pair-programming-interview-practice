# 💬 Warm-up advice

## 💡 Core message

The warm-up is done without an audience. Optimize for a change you can defend,
not for an impressive one. One bug, one failing test, one small fix: that is
the whole task, and there is no hidden trick.

The live session starts from a clean Exercise 1 package of this same service.
You will not continue in this working copy, but you will already know the code
better than anyone in the room, because you traced it here. The pairing
playbook for the live session arrives with the Exercise 1 guide; you do not
need it now.

## ✅ Do and avoid

| ✅ Do                                               | Because                                              |
| --------------------------------------------------- | ---------------------------------------------------- |
| Write the failing test before the fix               | That is the skill the warm-up practices              |
| Keep the diff to the task                           | Unrelated changes hide the learning                  |
| Note what AI did and what you checked               | Honest, specific answers about AI use are a strength |
| Run the full check, not only the new test           | Formatting and types are part of "done"              |
| Write down one idea you chose not to do             | It gives you a ready answer for "what next?"         |
| Rehearse explaining the mutation in a few sentences | The interviewer will ask what you learned            |

❌ Avoid:

- refactoring the surrounding code "while you are there";
- hiding a hard part by weakening or deleting a test;
- a fix you accepted from AI but cannot explain;
- polishing the code past midnight instead of resting before the live session.

## 🐛 Debugging

Use:

**Name → Diagnose → Fix → Verify**

1. Describe the observed mismatch: the Priority queue follows Recent activity
   dates instead of the server's priority order.
2. Correct the mental model: find where a read changes shared data.
3. Choose the smallest diagnostic: a Testing Library test that renders `<App>`
   and reads the Priority queue rows.
4. Make one focused change.
5. Rerun the new test and the full check.

If you are stuck for more than a few minutes, write down your current theory
and what you would check next, then check it. Working out of a stuck moment is
the skill, not avoiding it.

## 🧪 Testing Library

The regression belongs in a client test (`test/client/*.test.tsx`). Query the
page the way a person uses it:

- Query by role, label, or visible text instead of implementation details.
  The Priority queue is a `region` named "Priority queue"; row titles are
  `cell`s.
- Create `userEvent` with `userEvent.setup()` when you interact; await each
  interaction.
- Await visible state with `findBy...` or `waitFor` before asserting an async
  result. The tickets load after render, so wait for a known cell before you
  read the table.
- Do not assert on class names or computed styles. Styling is not assessed;
  reuse the existing `Card`, `Table`, `Badge`, and `NativeSelect` primitives
  from `src/client/components/ui/`.

A useful shape:

> Render `<App>` with the in-memory API. Wait for the rows. Assert that the
> first cell of each Priority queue row matches the server order.

## 🤖 Cursor and AI

AI is allowed in the warm-up. Use it freely, but keep the diff to the task and
be able to explain every line you keep. Expect the question “what did AI do,
and what did you check?” A specific answer is a strength; a vague one is not.

Use:

**Decide → Delegate → Inspect → Verify**

- Decide what you want before you prompt; form your own theory of the bug
  first.
- Delegate a bounded task: trace a path, draft a test for a behavior you have
  already named, review a change.
- Inspect every changed hunk and reject scope you did not ask for.
- Verify by running the test yourself.

Example read-only prompt:

> Do not edit. Trace how the Priority queue and Recent activity share ticket
> data, identify where the data could be changed on the way, and cite the
> files.

❌ Avoid asking AI to “fix the bug”, trusting a generated test because it is
green, and letting it delete or skip existing tests.

🎙️ Optional: dictate prompts with a tool such as [Vowen](https://vowen.ai).
Spoken prompts tend to be fuller than typed ones. If you plan to dictate in the
live session, this is the place to practice the hotkey.

## 🎒 What you bring to the live session

Not the code. Bring:

- a few sentences on the mutation, the test that proved it, and the copy;
- a note of what AI did and what you verified;
- one idea you chose not to do.

The live session opens with a short walkthrough of the Exercise 1 starting
code, which already includes the accepted fix. Knowing this service is the
preparation.
