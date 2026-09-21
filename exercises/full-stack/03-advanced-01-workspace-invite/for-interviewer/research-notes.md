# 🔬 Exercise 2 design notes

## 🎯 Design goal

Exercise 2 measures cold-start navigation through an asynchronous workspace
write path. The invitation story makes validation, typed outcomes, persistence,
and no-write rejection behavior visible in a small package.

## ✅ Decision

Use workspace invitations because the candidate can trace:

```text
form → API client → handler → detached repository value → save
```

The starter includes an existing create-workspace command so the candidate can
compare a complete write path before implementing the requested behavior.

## ✂️ Scope cuts

- Validation requires only non-empty text containing `@`.
- Matching trims and compares email case-insensitively.
- There are no permissions, expiry, revocation, normalization rules beyond the
  comparison, or concurrent-write implementation.
- Seat limits and invitation acceptance are later requirements.

## 🧩 Full-stack revision

The exercise is a portable React 19 and Vite package with a transport-agnostic
server handler. Tests use the in-memory transport so client assertions exercise
the same route and repository path as the app. Tailwind and generated
shadcn/ui primitives supply accessible structural components without making
visual styling part of the assessment.
