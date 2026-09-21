# 💬 Pairing advice and phrasebook

## 💡 Core message

This is a pairing session, not an exam. The task is small on purpose, and the
interviewer is on your side: they want to see how you work with another
engineer, not how fast you type. You already do the things a strong session
needs every week at work:

- ✅ understand a well-scoped product problem;
- ✅ collaborate with another engineer;
- ✅ make incremental progress;
- ✅ test meaningful behavior;
- ✅ recover calmly when something surprises you;
- ✅ use tools without letting them make your decisions.

Nobody finishes everything, and nobody is expected to. A partial solution that
is tested and explained is a good outcome. A hint is a normal part of pairing,
not a mark against you. Getting stuck for a moment and working out of it
together is one of the most useful things the interviewer can see.

## 🎯 What the session practices

| Area           | Expected behavior                                                     |
| -------------- | --------------------------------------------------------------------- |
| Walkthrough    | Explain your starting code path and the regression contract clearly   |
| Requirements   | Restate the behavior and ask questions that change the implementation |
| Navigation     | Trace an existing path before creating a new one                      |
| Implementation | Work in small, readable increments                                    |
| Testing        | Run early, add a focused test, and inspect failures                   |
| Collaboration  | Communicate at decisions and use hints constructively                 |
| Tool judgment  | Choose AI or manual work deliberately and verify the result           |

## 🎤 The walkthrough

Open the live session with a short, ordered presentation of this package. The
interviewer wants to see that you understand the starting code.

1. **Path:** how the Priority control reaches `queryTickets`.
2. **Contract:** what the client widget-order regression protects.
3. **Implementation:** why `RecentActivity` copies before sorting.
4. **Verification:** which checks pass before you make changes.
5. **Next:** where the new behavior is likely to belong.

Opening phrase:

> I will take about five minutes. First the request path, then the shared
> client-state contract, then why Recent activity copies before it sorts. Stop
> me at any point.

Handling questions:

> Good question. I chose X because Y. The alternative was Z, which I rejected
> because W.

> I am not certain. My guess is X; I would confirm it by checking Y.

Show the test run live rather than describing it.

## 📋 Advice table

| Situation    | ✅ Useful behavior                                        | 💬 Example phrase                                                                 | ❌ Avoid                                |
| ------------ | --------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------- |
| Walkthrough  | Present in a fixed order and show the test run            | “First the request path, then the contract, then why we copy.”                    | Reading the files line by line          |
| New request  | Ask for a short quiet read, then restate                  | “Can I read for a minute, then explain my understanding?”                         | Coding immediately                      |
| Ambiguity    | Ask two or three questions that change the implementation | “Should blank input be ignored or rejected?”                                      | Asking permission for every detail      |
| Planning     | Name two or three small slices                            | “First I will trace the path, then make one behavior work, then test a boundary.” | Designing a complete architecture       |
| Quiet work   | Announce the quiet window and summarize afterward         | “I will write this quietly, then run it and summarize.”                           | Long unexplained silence                |
| Decision     | Use Goal → Options → Choice → Check                       | “I choose X because Y; I expect Z.”                                               | Narrating keystrokes                    |
| Failure      | State evidence and form one hypothesis                    | “I expected three results and got four. I will inspect the filter conditions.”    | Random edits                            |
| Stuck        | Ask for a steer after about two minutes                   | “My theory is X; would you steer me?”                                             | Spinning silently                       |
| Hint         | Restate what changed in the mental model                  | “That means validation happens earlier. I will trace the caller again.”           | Blind compliance or defensiveness       |
| Testing      | Run a focused test after each coherent slice              | “The happy path passes; now I will test blank input.”                             | Deferring all testing                   |
| AI use       | Decide, delegate, inspect, verify                         | “I will ask for tests only, then select and run the relevant cases.”              | “Solve this task”                       |
| AI output    | Read every hunk and reject scope creep                    | “This changes the public API, so I am rejecting that part.”                       | Accepting a large unread diff           |
| Scope choice | Cut optional scope and finish green                       | “I will finish this slice and describe the extension.”                            | Starting another refactor               |
| Closing      | State what works, assumptions, gaps, and next step        | “This passes; I assumed X; Y remains; next I would do Z.”                         | Apologizing for unfinished stretch work |

## 🗣️ Thinking aloud

Think aloud at transitions, not continuously.

Use:

**Goal → Options → Choice → Check**

> The goal is to understand the failing behavior. I can inspect the
> implementation first or start from the test output. I will start from the
> test, then trace the data flow. I expect that to identify the smallest safe
> change.

Useful narration points:

1. start of a slice;
2. end of a slice;
3. after roughly two minutes stuck;
4. before an AI request;
5. after AI output.

It is acceptable to work quietly:

> I am going quiet for a minute to write this. I will summarize after I run it.

## ❓ Clarifying requirements

Ask questions that change code or priorities:

- Which existing behavior must remain unchanged?
- Can this operation be repeated safely?
- Which failures should the caller handle?
- Which behavior is explicitly out of scope?
- Which requirement is essential if time runs short?

Then state remaining assumptions and move:

> I will assume IDs are unique because the type and fixtures treat them that
> way. I will flag that assumption if the implementation depends on it.

## 🐛 Debugging

Use:

**Name → Diagnose → Fix → Verify**

1. Describe the observed mismatch.
2. Correct the mental model.
3. Choose the smallest diagnostic.
4. Make one focused change.
5. Rerun the failing case and relevant regression suite.

Useful phrases:

> That result contradicts my assumption. Before editing, I will trace where the
> unexpected value changes.

> I introduced that regression. I will return to the last green state and apply
> the missing constraint.

> I do not remember this API exactly. I will inspect the type or documentation
> instead of guessing.

## 🧪 Testing Library

- Query by role, label, or visible text instead of implementation details.
- Create `userEvent` with `userEvent.setup()` and await each interaction.
- Await visible state with `findBy...` or `waitFor` before asserting an async
  result.
- Reach for `Input`, `Label`, `Checkbox`, and `Empty` from `components/ui`
  instead of styling anything.

## 🤝🏽 Collaboration

Treat the interviewer as a navigator:

- invite input at decisions and discoveries;
- process suggestions rather than merely obeying them;
- disagree with a reason and a test;
- ask for help before a small block becomes a long stall;
- summarize often enough that the interviewer can rejoin.

Useful phrases:

> I see a trade-off between keeping this local and extracting a helper. The
> local version is enough for one call site, so I will avoid the abstraction.

> Your suggestion removes the special case. My concern is that it also changes
> X. Shall we verify that behavior before adopting it?

> That hint changes how I understand the data flow. Let me restate it before I
> continue.

## 🤖 Cursor and AI

AI is allowed in this practice session. Real interview policies range from
prohibited to expected, so confirm the policy before an actual interview. Not
using AI is acceptable when manual work is faster or safer.

Expect the question “what did AI do, and what did you check?” A specific answer
is a strength. A vague one is not.

### 🧾 Live protocol

Before a request:

1. State your own understanding.
2. Name the bounded task you are delegating.
3. Say how you will verify the answer.

After the response:

1. Read every changed hunk.
2. Reject scope you did not request.
3. Explain every line you retain.
4. Run the relevant test immediately.

### 🧭 Show judgment

Use:

**Decide → Delegate → Inspect → Verify**

| Cursor behavior    | Good signal                                                |
| ------------------ | ---------------------------------------------------------- |
| Ask mode           | Read-only orientation followed by checking the cited code  |
| Precise context    | One or two relevant files rather than the whole repository |
| Tab                | Partial acceptance or rejection of a suggestion            |
| Inline Edit        | A local mechanical change with a clear expected result     |
| Agent              | A bounded multi-file task with explicit constraints        |
| Plan Mode          | Only for genuinely ambiguous multi-file work               |
| Diff review        | Explain every retained hunk and reject unrequested scope   |
| Checkpoint restore | Abandon a wrong direction instead of patching complexity   |

Example read-only prompt:

> Do not edit. Trace how this request reaches the domain function, identify the
> closest tests, and cite the relevant files.

Example bounded edit prompt:

> Add focused tests for the behavior we just agreed. Do not change production
> code or add dependencies. I will review each assertion and run the tests.

### 🎙️ Speak your prompts (optional)

If you are about to prompt, consider dictating instead of typing. Free tools
such as [Vowen](https://vowen.ai) (Mac and Windows, runs on-device) let you
hold a key, speak, and drop the text at your cursor. Spoken prompts are usually
fuller than typed ones, the interviewer hears how you brief an assistant, and
your eyes stay on the code.

- ✅ practice at home first, including the hotkey and filler-word cleanup;
- ✅ read the transcribed prompt before you send it;
- ✅ say “I am dictating this prompt” the first time so the interviewer knows;
- ❌ do not install or configure a new tool during the session;
- ❌ do not let dictation replace the decide → delegate → inspect → verify loop.

### 🚫 AI anti-patterns

Canva's interviewer guidance gives three memorable failure modes:

- **AI Showcase:** demonstrating features instead of solving the task;
- **Feature Marathon:** accepting output quickly to add more scope;
- **Hands-Off:** treating AI as the decision-maker.

❌ Also avoid:

- prompting before forming an opinion;
- accepting code that cannot be explained;
- trusting generated tests because they are green;
- allowing deleted or skipped tests;
- adding unfamiliar dependencies without need;
- silently prompting while the interviewer loses context.

## 📝 Closing

When the interviewer calls the handoff, stop editing and give a factual recap:

> This behavior works and these checks pass. I assumed X. I did not cover Y.
> Before production, my next step would be Z.

Do not apologize for unfinished optional work. Ask one or two prepared
questions, then leave the debrief with one behavior to keep and one to
practice; write both down.
