# 📚 Research and design record

Research date: 2026-09-20.

This file keeps the reasoning behind the exercise. The candidate does not need
it during the session.

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

### 💬 Coaching

The proposals ranged from end-only feedback to three fixed interruptions. The
final format uses one planned 90-second pause, one optional rescue for deadlock
or distress, normal in-role hints, and an eight-minute debrief. This gives the
candidate one chance to apply feedback without fragmenting the session.

### 🧩 Exercise

The review compared:

- **Support-ticket queue:** mutation bug, search, visibility, and ordering.
- **Invite a teammate:** membership, seat limits, expiry, and refresh.
- **Promo codes:** threshold discounts, stacking, and money rounding.

The support queue won because it has the smallest codebase, a clear bug-first
entry point, familiar product behavior, and no specialist domain knowledge.

The invite drill packed too many state and time concepts into one increment.
The promo drill was larger, and money policy added avoidable cognitive load.
Both remain useful second-session variants.

### 🔁 Format update: warm-up plus live follow-ups

After the first version, the candidate learned the real format: boilerplate and
a warm-up task sent one day ahead, then live follow-up tasks. The stack is
TypeScript and AI is allowed in the warm-up. The mock was adapted as follows.

| Change                                    | Reason                                                                            |
| ----------------------------------------- | --------------------------------------------------------------------------------- |
| The regression became the at-home warm-up | Small, bounded, forces reading the code, and produces something to walk through   |
| The candidate writes the failing test     | A real warm-up gives a task, not a test; it also gives the walkthrough more depth |
| The live session opens with a walkthrough | Matches the real format; presenting one's own change is now the first impression  |
| Search stayed live                        | Implementing through the HTTP and domain boundary under observation is the core   |
| Visibility gate moved from 31:00 to 29:00 | The live coding window starts at 12:30 instead of 16:30                           |
| Coaching pause moved to after the checks  | Feedback on the walkthrough can be applied to the live coding that follows        |
| Two AI modes documented                   | At-home use is free but owned; live use is announced and verified                 |
| Contingency for an unfinished warm-up     | The old bug-first flow remains available with the visibility extension dropped    |

Rejected: making search the warm-up. It would leave only the visibility rule
and the stretch for the live session, and it would move the richest live
evidence to an unobserved setting.

## 🧭 Design decisions

| Decision                    | Reason                                             |
| --------------------------- | -------------------------------------------------- |
| Existing TypeScript service | Practice reading and improving code                |
| About 150–200 source lines  | Permit orientation within a few minutes            |
| Bug as the warm-up          | Give the candidate a concrete, bounded start alone |
| Walkthrough opens the live  | Mirror the real format and practice presenting     |
| Search as the core feature  | Cover routing, normalization, filtering, and tests |
| Visibility as an extension  | Add a realistic rule without enlarging the core    |
| Ordering as stretch         | Gather extra evidence without making it required   |
| AI allowed but not required | Practice tool judgment, not usage frequency        |
| Feedback inside 50 minutes  | Fit the available session                          |

## 📚 Research basis

### 🤝🏽 Pairing and practical interviews

- [Thoughtworks](https://www.thoughtworks.com/en-us/insights/blog/what-expect-pair-programming-interview)
  supports communication, teamwork, testing, and considered partial progress.
- The Guardian's [exercise repository](https://github.com/guardian/coding-exercises)
  and [remote process](https://github.com/guardian/coding-exercises/blob/main/PROCESS_REMOTE.md)
  support 45–60-minute driver-and-navigator work, prepared starters, transparent
  AI use, and graduated hints.
- [Shopify](https://shopify.engineering/nail-your-technical-shopify-interview),
  [CZI](https://chanzuckerberg.com/wp-content/uploads/sites/8/2025/02/Engineering-Interview-Guide.pdf),
  [Microsoft](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing),
  and [Square](https://developer.squareup.com/blog/ace-the-square-pairing-interview/)
  corroborate early execution, clarification, testing, time management, and
  preferring sound partial progress to rushed completion.

These are employer accounts, not universal formats. Shopify and Square describe
older or longer processes; only their durable principles are used.

### 🤖 AI policy and judgment

- [Canva's candidate guide](https://www.canva.dev/blog/engineering/yes-you-can-use-ai-in-our-interviews/)
  and [interviewer guide](https://www.canva.dev/blog/engineering/ai-interview-success/)
  support bounded delegation, critical review, ownership, and the AI Showcase,
  Feature Marathon, and Hands-Off warnings.
- [Cerebras](https://www.cerebras.ai/blog/hiring-engineers-for-an-ai-native-world)
  and [Omnea](https://www.omnea.co/resource/ai-in-our-programming-interviews)
  support understanding before delegation, shared planning, early execution,
  and a verification loop.
- [Anthropic](https://www.anthropic.com/candidate-ai-guidance),
  [Datadog](https://careers.datadoghq.com/candidate-experience/interviewing-at-datadog-ai-guidelines/),
  and [Meta](https://www.metacareers.com/hiring-process/) show the policy range:
  prohibited unless stated, allowed only in named rounds, or limited to an
  authorized hosted tool.

Policies can change. Confirm the current rule with the recruiter.

### 🛠️ Tools and review

- Cursor documents [Ask mode](https://cursor.com/help/ai-features/ask-mode),
  [Inline Edit](https://cursor.com/help/ai-features/inline-edit),
  [Plan Mode](https://cursor.com/docs/agent/plan-mode), and
  [scoped prompting](https://cursor.com/docs/agent/prompting).
- [GitHub's AI-code review guide](https://docs.github.com/en/copilot/tutorials/review-ai-generated-code)
  supports checking intent, tests, dependencies, constraints, and deleted or
  skipped tests.

Cursor tactics apply only when the candidate controls the IDE. The general
pattern—decide, delegate, inspect, verify—also applies to hosted tools.

### 🧠 Stress and structured assessment

- [Behroozi et al., ESEC/FSE 2020](https://dl.acm.org/doi/10.1145/3368089.3409712)
  supports a quiet start and retrospective summaries. Its 48-student,
  whiteboard study used a non-interactive observer; it does not prove that
  pairing halves performance.
- [Google re:Work](https://rework.withgoogle.com/intl/en/guides/a-guide-to-structured-interviewing-for-better-hiring-practices)
  supports consistent questions, evidence notes, and anchored rubrics.

## ⚠️ Claims excluded or softened

- **“Five mocks double the pass rate.”** Interviewing.io reports an
  observational association from self-selected platform data. The advice keeps
  repeated practice and drops the causal claim.
- **“Say ‘I am excited’ to perform better.”** A direct replication found more
  self-reported excitement but no improvement in observer-rated performance.
- **“AI makes experienced developers slower.”** METR marked the often-cited
  2025 result out of date; newer evidence was weak and directionally different.
- **DORA's AI findings.** They concern organizational delivery systems, not
  individual interview performance.
- **“Think aloud continuously.”** The evidence supports sharing decisions, not
  narrating every keystroke.

## 🚧 Scope and limits

- The exercise is calibrated for a developing product engineer.
- It does not assess system design, operations, multi-day autonomy, or
  cross-team influence.
- One 50-minute sample is noisy. Use the rubric to choose practice targets, not
  to label the engineer.
- If the target interview is algorithmic, use a separate drill for that format.

## 🧩 Full-stack revision

The exercise now uses a React 19 + Vite client with a small server handler in
the same package. Tests use an in-memory transport, so client interaction can
exercise the API and repository without a network dependency. Tailwind v4 and
generated shadcn/ui primitives provide the available controls without making
styling part of the drill. Search is frontend-first: the controlled input is
the first visible path, then the request reaches server-side matching.
