# 📚 Research and design record

Research date: 2026-09-20.

This file keeps the reasoning behind the exercise. The candidate does not need
it during the warm-up.

## 🔬 Method

The review used two stages:

1. GPT Sol, Claude Fable, and Claude Opus each produced an independent proposal
   for the advice and another for the coding drill.
2. Two new Claude Fable evaluators checked the proposals, verified important
   sources, challenged weak claims, and made separate final calls.

The final design is not an average. It keeps the strongest supported ideas and
the smallest realistic exercise.

## 🤝🏽 Shared findings

- A pairing interview measures the working process as well as the result.
- Structured narration helps; constant narration does not.
- A short quiet reading period can reduce cognitive load.
- Tests should follow each useful increment, not wait until the end.
- AI policy must be confirmed because policies differ.
- When AI is allowed, the candidate should decide first, delegate narrowly,
  inspect the output, and verify it.
- A small change in an existing codebase is a better default for this practice
  than an algorithm puzzle.

## ⚖️ Final calls

### 🧩 Exercise

The support-ticket queue won because it has the smallest codebase, a clear
bug-first entry point, familiar product behavior, and no specialist domain
knowledge.

### 🔁 Format: warm-up plus live follow-ups

The regression is the at-home warm-up: small, bounded, forces reading the
code, and produces something to walk through. The candidate writes the failing
test. Search and later product work stay in the live Exercise 1 session.

Rejected: making search the warm-up. It would leave only later rules for the
live session, and it would move the richest live evidence to an unobserved
setting.

### ⏱️ Duration: 45 minutes (2026-09-21)

The budget moved from 60–90 minutes to 45. One bug, one test, one fix on a
small codebase fits 45 minutes, matches the timed solo drill
`practice-exercise` profile 0, and keeps the warm-up shorter than the 50-minute
live exercises. Take-home use keeps the same budget.

## 🧭 Design decisions

| Decision                    | Reason                                             |
| --------------------------- | -------------------------------------------------- |
| Existing TypeScript service | Practice reading and improving code                |
| Bug as the warm-up          | Give the candidate a concrete, bounded start alone |
| Candidate writes the test   | A real warm-up gives a task, not a test            |
| Copy-before-sort as the fix | Smallest change that restores the contract         |
| AI allowed but not required | Practice tool judgment, not usage frequency        |

## 📚 Research basis

### 🤝🏽 Pairing and practical interviews

- [Thoughtworks](https://www.thoughtworks.com/en-us/insights/blog/what-expect-pair-programming-interview)
  supports communication, teamwork, testing, and considered partial progress.
- The Guardian's [exercise repository](https://github.com/guardian/coding-exercises)
  and [remote process](https://github.com/guardian/coding-exercises/blob/main/PROCESS_REMOTE.md)
  support 45–60-minute driver-and-navigator work, prepared starters, transparent
  AI use, and graduated hints.

### 🤖 AI policy and judgment

- [Canva's candidate guide](https://www.canva.dev/blog/engineering/yes-you-can-use-ai-in-our-interviews/)
  and [interviewer guide](https://www.canva.dev/blog/engineering/ai-interview-success/)
  support bounded delegation, critical review, and ownership.

## ⚠️ Claims excluded or softened

- **“Five mocks double the pass rate.”** Interviewing.io reports an
  observational association. The advice keeps repeated practice and drops the
  causal claim.
- **“Think aloud continuously.”** The evidence supports sharing decisions, not
  narrating every keystroke.

## 🚧 Scope and limits

- The warm-up is calibrated for a developing product engineer working alone.
- It does not assess system design, operations, or live pairing. Those belong
  to the Exercise 1 session.
- One take-home sample is noisy. Use the rubric to choose practice targets,
  not to label the engineer.

## 🧩 Full-stack revision

The warm-up now uses a React 19 + Vite client with a small server handler in
the same package. The planted bug moved from `queryTickets` mutating
`repository.listAll()` to `RecentActivity` calling `tickets.sort()` during
render on the array held in `App` state. `TicketQueue` renders that array as
it receives it, so the Priority queue loses priority order once Recent
activity has sorted it in place. Tests use an in-memory transport, so one
Testing Library test exercises UI, API, and repository without a network.
Tailwind v4 and generated shadcn/ui primitives provide the available controls
without making styling part of the drill. `GET /api/tickets` stays correct and
is the optional `curl` proof that the server is not the cause.
