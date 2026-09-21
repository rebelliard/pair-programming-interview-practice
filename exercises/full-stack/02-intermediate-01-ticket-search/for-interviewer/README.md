# 🎬 Facilitator playbook

## 🎯 Purpose

Run the first live pairing drill from this package. It already contains the
accepted warm-up fix and regression test. The candidate orients themselves in
that baseline, then implements the live requests.

Always start from a clean candidate copy of `02-intermediate-01-ticket-search`. The optional
[`01-beginner-01-shared-array`](../../01-beginner-01-shared-array/for-interviewer/README.md) is
debugging practice on the same service; it is not an entry path. Do not
continue in a warm-up working copy.

The mock should show how the candidate:

- understands a small product problem;
- navigates unfamiliar code;
- explains the starting behavior and regression contract;
- works incrementally with a navigator;
- tests behavior;
- uses Cursor without outsourcing judgment during the live work.

Focus on the evidence above. Typing speed, constant narration, senior
architecture, and completion of every extension are outside this exercise.

## 🧭 Your path

1. 📅 **Before the session:** verify this package and prepare the candidate
   archive (below).
2. 🌙 **Evening before:** optional diff review, deck and notes ready (below).
3. 🎬 **Live session:** follow the agenda; use
   [`slides/deck.md`](slides/deck.md) for shared context and this playbook for
   probes, hints, and releases.
4. 📊 **Debrief:** score with
   [`rubric-and-solution.md`](rubric-and-solution.md).

Reference material: [`slides/README.md`](slides/README.md) for the reveal plan,
[`research-notes.md`](research-notes.md) for the design rationale,
[`acceptance/`](acceptance/) and [`reference.patch`](reference.patch) for the
completed solution.

Styling is not assessed; reuse the existing components.

🧑🏽‍💻 No interviewer available? The candidate can run this drill alone by
asking their agent for `/practice-exercise`, then choosing Exercise 1
([`practice-exercise`](../../../../.agents/skills/practice-exercise/SKILL.md)). The
skill shows the candidate guide, verifies the package, keeps a background clock,
releases the same requirements on schedule, and offers
[`practice-grade-session`](../../../../.agents/skills/practice-grade-session/SKILL.md)
at the end. That skill interviews the candidate, then runs two independent
reviewers and an Opus validator. The gated content lives in the skill, outside
the package, so the candidate archive stays clean.

## 📅 Before the session

1. Send the candidate archive below. The optional warm-up is separate
   preparation; it is not required and it is not the live starting copy.
2. From [`02-intermediate-01-ticket-search/`](../), run the starter:

   ```bash
   pnpm install --frozen-lockfile
   pnpm check
   ```

3. Confirm that five tests pass, including the client regression that keeps
   the Priority queue in server order after Recent activity renders.
4. Verify that
   `pnpm exec vitest run --config for-interviewer/vitest.config.ts` fails
   against the starter.
5. Keep [`for-interviewer/`](./) private.

Prepare the candidate archive from [`02-intermediate-01-ticket-search/`](../):

```bash
tar \
  --exclude='./node_modules' \
  --exclude='./dist' \
  --exclude='./for-interviewer' \
  -czf ../02-intermediate-01-ticket-search-candidate.tar.gz .
```

Inspect the archive before the session:

- ✅ It must contain [`for-candidate/`](../for-candidate/), [`src/`](../src/), [`test/`](../test/), and the root tooling
  files.
- 🚫 It must not contain [`for-interviewer/`](./).

## 🌙 The evening before

Optional: if the candidate completed the warm-up, ask them to send that diff
(`git diff` or a branch). If they do, read it in five minutes to learn how they
reasoned. Do not comment on it before the session, and do not continue in that
copy.

Whether or not you saw a warm-up diff, prepare:

1. [`slides/README.md`](slides/README.md), then [`slides/deck.md`](slides/deck.md) open in presenter mode;
2. this playbook on a private screen;
3. a clean candidate copy of `02-intermediate-01-ticket-search` without [`for-interviewer/`](./);
4. timestamped notes with columns for observation, hint level, and rubric
   dimension.

Use that clean copy for the live session.

## 🖥️ Slide deck

The deck covers the opening agreement, the walkthrough prompt, the coaching
pause, timed task releases, handoff, and debrief. Stop on “Your walkthrough”
before the candidate starts. Later slides contain requirements and must stay
hidden until their release gates.

## 🗣️ Opening script

> This is pairing practice, not a quiz. First you will walk me through the
> starting code for about five minutes; I will ask a few questions. Then you
> drive and I navigate on one or two follow-up requests to the same code. Ask
> me product or technical questions whenever they help. Quiet reading and
> coding are fine; explain decisions and summarize after quiet periods. Hints
> are normal.
>
> Cursor is allowed live. Before using it, tell me what you expect it to do and
> how you will verify the result. You remain responsible for every line you
> keep.
>
> After the walkthrough I will pause the interview for 90 seconds and give one
> coaching adjustment. The last eight minutes are a debrief.

## 🔥 Part 1: Starting-code walkthrough

The candidate already has the accepted client and server baseline in this
package. The client fetches tickets and renders the server order in the
Priority queue. `RecentActivity` sorts a copy of that same fetched array so it
cannot change what `TicketQueue` renders. A client regression protects both
widget orders. On the server, `queryTickets` also copies before its priority
sort. The candidate's job in these minutes is to explain the full path and the
client boundary, not to present a home fix.

### 🎤 Minutes 2:00–9:00: candidate presents

Let the candidate lead. Offer one quiet minute to trace the request path
first. Then ask two or three probes:

| ❓ Probe                                                                   | ✅ Good evidence                                                          |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| “Trace the client control through `GET /tickets` to the domain query.”     | Finds the client API, HTTP handler, query function, repository, and tests |
| “Which array does `RecentActivity` sort, and who else renders that array?” | Finds the shared `tickets` state and both widget consumers                |
| “What does the client regression protect?”                                 | Names both Priority queue order and Recent activity order                 |
| “Why must the copy happen in `RecentActivity`, not only on the server?”    | Explains that the render-path mutation happens after the fetch            |

The copy must stay at the client sort boundary. Changing only
`queryTickets` or the repository does not prevent `RecentActivity` from
mutating the array already held in React state.

### ✅ Minutes 9:00–11:00: verify together

Ask the candidate to run `pnpm check` in this package. Watch for:

- [ ] all tests green, including the client widget-order regression;
- [ ] no removed, skipped, or weakened tests;
- [ ] no unrelated pre-session changes;
- [ ] formatting and type-checking passing.

If these conditions are not met, restore a clean `02-intermediate-01-ticket-search` copy and confirm
that its five tests pass before releasing search.

## 🚀 Part 2: Live follow-ups

### 🔍 Release 1: Search

Release at minute 12:30, after the coaching pause:

> Agents need to find tickets quickly. On the client, add a controlled
> `Search` input that sends `q`. On the server, extend `GET /tickets` and the
> ticket query.
>
> - Match `title` or `requester`.
> - Match case-insensitively.
> - Ignore leading and trailing spaces.
> - Missing or blank `q` means no search.
> - Existing priority filtering and ordering must continue to work.
> - No match returns `200` with an empty ticket list.

Questions to answer when asked:

| Question                                | Product answer                                 |
| --------------------------------------- | ---------------------------------------------- |
| Is this fuzzy search?                   | No, substring matching is enough.              |
| Does search replace priority filtering? | No, the filters combine using AND.             |
| Should search mutate ticket text?       | No. Normalize only for comparison.             |
| Is pagination needed?                   | No.                                            |
| Where should matching live?             | The HTTP layer parses; `queryTickets` matches. |

Passing Release 1 is the expected completion point for this session.

Because the candidate already knows the code, expect the quiet read to be
shorter than in a cold-start session. Still offer it.

### 👁️ Release 2: Resolved-ticket visibility

Release at minute 29 only when search is substantially working:

> On the client, add an `Include resolved` checkbox. On the server, resolved
> tickets should be hidden by default and `includeResolved=true` should include
> them.

Clarifications:

- only the literal string `"true"` enables the option;
- search and priority still combine with visibility;
- a successful query with no results returns an empty list;
- changing the expected ticket set can require updating an existing test.

If Release 1 is not working, do not release this requirement. Say:

> We will use the remaining implementation time to finish search cleanly. That
> is a normal outcome for this exercise.

When behind, cut the visibility server rule and the sorting stretch before
cutting the client search path. A working controlled input through the HTTP and
query layers gives the most useful evidence.

### ⏳ Optional stretch: Oldest ticket first

Release only if Release 2 is green before minute 35:

> Within the same priority, show the least recently updated ticket first.

Priority remains the primary ordering. Earlier `updatedAt` values come first
when priorities tie.

## ⏱️ Exact 50-minute agenda

| Time        | Activity                                         | Mode         |
| ----------- | ------------------------------------------------ | ------------ |
| 0:00–2:00   | Opening, roles, AI policy, quiet-time permission | 🎯 Interview |
| 2:00–9:00   | Candidate walkthrough of the starting code       | 🎯 Interview |
| 9:00–11:00  | Run the checks together; one design question     | 🎯 Interview |
| 11:00–12:30 | One strength and one adjustment                  | 💬 Coaching  |
| 12:30–14:00 | Release and clarify search                       | 🎯 Interview |
| 14:00–27:00 | Implement search in small tested slices          | 🎯 Interview |
| 27:00–29:00 | Verify search and explain the data flow          | 🎯 Interview |
| 29:00–39:00 | Visibility extension, or finish search           | 🎯 Interview |
| 39:00–42:00 | Candidate recap, risks, and next steps           | 🎯 Interview |
| 42:00–50:00 | Structured debrief                               | 💬 Coaching  |

## 💬 Coaching policy

Use one fixed 90-second pause after the walkthrough. Keep it behavioral:

> Coach hat on. Keep doing X. For the next part, change Y. Coach hat off.

Examples:

- “Your walkthrough had a clear order. Next, state the expected test result
  before each command.”
- “You answered the AI question specifically. Next, announce AI requests the
  same way live.”
- “You explained the fix well. Next, finish the smallest end-to-end path before
  refactoring.”

Do not reveal implementation details during this pause.

One additional 60-second rescue is allowed only when:

- there has been no progress for three minutes after a level-three hint; or
- the candidate enters a visible self-critical or anxious spiral.

Give one next action, then return to interviewer mode.

## ⚖️ Authentic intervention versus coaching

| ✅ Authentic pairing intervention     | 🚫 Out-of-role coaching                      |
| ------------------------------------- | -------------------------------------------- |
| Ask a walkthrough probe               | Explain how interviewers score the behavior  |
| Answer a requirement question         | Teach a debugging technique they do not know |
| Ask for the candidate's hypothesis    | Reveal the bug or dictate a design           |
| Give a graduated hint                 | Comment on nervousness or pacing             |
| Correct a trivial typo or import path | Reassure them with a performance verdict     |
| Announce remaining time               | Rewrite their code                           |
| Ask them to explain AI output         | Critique the warm-up before the session      |

Authentic interventions are part of the simulation. Coaching interventions are
announced, brief, and excluded from the evidence used to score the preceding
work.

## 🪜 Hint ladders

Wait briefly before escalating. Record the highest level used.

### 🐛 Regression (only if the warm-up is finished live)

1. “What exactly changed according to the failing assertion?”
2. “Which line touches the array owned by the repository?”
3. “Does `sort()` return an independent array?”
4. “`sort()` mutates. Copy the array before sorting.”

### 🔍 Search

1. “What is the smallest end-to-end behavior you can make green?”
2. “How does `priority` travel from the request to the query function?”
3. “Can you normalize the query once before filtering?”
4. Show the shape of `q?.trim().toLowerCase() ?? ""`.

### 👁️ Visibility

1. “What should happen when the parameter is absent?”
2. “Which string values should count as true?”
3. “Where should the product visibility rule live?”

### ⏳ Sorting stretch

1. “Where does ordering live today?”
2. “What should the comparator return when priorities tie?”
3. “How will you compare the timestamps?”

## 🤖 Cursor prompt

At the start of Release 1, ask:

> At home you could use Cursor however you liked. Live, choose one bounded point
> in this feature where it could help. Tell me what you will delegate and how
> you will verify it. You may also explain why manual work is the better
> choice.

✅ Good evidence includes:

- read-only code-path exploration;
- a narrowly scoped edit using known files;
- focused test-case generation followed by human selection;
- rejecting an over-broad change;
- running tests immediately after accepting an edit.

Do not score frequency of AI use, at home or live. Score whether the candidate
can say what the tool did and what they verified.

## 🧭 Eight-minute debrief

1. **42:00–43:30 — Self-assessment**
   - “What went well?”
   - “What would you change?”
2. **43:30–47:00 — Evidence**
   - two strengths;
   - two adjustments;
   - each tied to a timestamped observation, including one from the walkthrough.
3. **47:00–48:30 — Edge cases**
   - reveal two or three missed cases;
   - explain the stretch direction if it was not reached.
4. **48:30–50:00 — Next drill**
   - agree on one measurable practice task;
   - preserve only one or two priorities.

Avoid personality feedback such as “you seemed nervous.” Prefer observable
feedback such as “at minute 22, you changed three files before rerunning the
focused test.”

## ➡️ After the session

- [ ] Complete the note template in
      [`rubric-and-solution.md`](rubric-and-solution.md) while the session is
      fresh.
- [ ] Record the two lowest rubric dimensions; they choose the next drill.
- [ ] Send the candidate the one keep and one change you agreed on.

The next live session is
[`03-advanced-01-workspace-invite/for-interviewer/README.md`](../../03-advanced-01-workspace-invite/for-interviewer/README.md).
It is a cold start without a new warm-up; see the
[series README](../../../../README.md).
