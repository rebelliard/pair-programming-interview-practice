# 🔬 Exercise 4 design notes

## 🎯 Goal

Close the series with pure lifecycle reasoning. The candidate must
characterize behavior before changing it, make one narrow fix, and refactor
only behind a complete safety net.

## 🤝🏽 Design panel

Three independent proposals:

| Proposal | Lifecycle and bug                                          |
| -------- | ---------------------------------------------------------- |
| Sol      | Template review resubmission retains a stale decision      |
| Fable    | Session resume accepts scheduled and live states           |
| Grok     | Paused webinar fails to auto-end at the scheduled boundary |

A separate Fable review chose a synthesis: Fable's resume-guard bug in a
focused, honest characterization flow with no time semantics.

## ✅ Decision

Use a pure `applyCommand` state machine:

- core pins only the five-cell resume row;
- two rows change from observed success to desired rejection;
- the production fix is one guard;
- the extension centralizes all 25 legality cells;
- the stretch adds one command through exhaustive types.

## ✂️ Scope cuts

- no clock, timestamps, date arithmetic, or expiry;
- no partly false bug report;
- no full matrix requirement in core;
- no discriminated-union object model;
- no property-absence assertions;
- no state-machine framework, classes, persistence, HTTP, or events.

## 🗺️ Completed series

| Exercise | Primary flavor                                         |
| -------- | ------------------------------------------------------ |
| 0        | Isolated regression reproduction                       |
| 1        | Familiar read-path composition                         |
| 2        | Cold async command and mocked persistence              |
| 3        | Outbound retries and idempotency                       |
| 4        | Characterization-first lifecycle fix and safe refactor |

The last drill measures judgment and restraint rather than another boundary.

## 🧩 Full-stack revision

The exercise now uses a React 19 + Vite client with a small server handler in
the same package. Tests use an in-memory transport, so client interaction can
exercise the API and repository without a network dependency. Tailwind v4 and
generated shadcn/ui primitives provide the available controls without making
styling part of the drill.

The planted bug is now visible on both sides: `applyCommand` and
`SessionControls` reuse `isTerminal` for `resume`, so Resume is enabled and
accepted from `scheduled` and `live`. Release 1 still pins, flips, and makes
the smallest guard fix. Release 2 adds `canApply` as one source of legality and
recovers a stale tab with an inline `Alert` plus a refetch. Stretch still adds
`reopen` through exhaustive types, now with a sixth button.
