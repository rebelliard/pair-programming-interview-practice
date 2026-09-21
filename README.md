# 🧩 Pair-programming practice series

TypeScript exercises for pair-programming interviews where an agent plays your interviewer — keeps the clock, releases requirements on schedule, gives staged hints, then grades the session — each one a working app with a candidate guide and private interviewer materials.

## 🎬 Pair sessions

Live exercises run as pair-programming interviews.

Ask an agent [`/practice-exercise`](.agents/skills/practice-exercise/SKILL.md) to pick a live exercise.

### 📁 Package

Each exercise package is laid out the same way — for example
[`01-beginner-01-shared-array`](exercises/full-stack/01-beginner-01-shared-array/):

- **For the candidate:** [`for-candidate/`](exercises/full-stack/01-beginner-01-shared-array/for-candidate/) and the rest of the package
- **For a human interviewer:** playbook, rubric, slides, and acceptance tests in
  [`for-interviewer/`](exercises/full-stack/01-beginner-01-shared-array/for-interviewer/) — keep that folder private

## 👨🏽‍💻 Self practice

Ask an agent:

- [`/practice-exercise`](.agents/skills/practice-exercise/SKILL.md) — timed solo drill: clock, gated requirements, hints, and coaching
- [`/practice-grade-session`](.agents/skills/practice-grade-session/SKILL.md) — debrief and scorecard after a session

### 🧪 Generate a new exercise

[`/practice-exercise-generator`](.agents/skills/practice-exercise-generator/SKILL.md) adds a live drill — or a new surface's one warm-up. You pick seniority, surface, and optional focus; it researches the stack and wires the package into the two skills above.

## 📇 Practice index

- [Full-stack](exercises/full-stack/)
- [Backend API](exercises/backend-api/)

## 🧱 Layout and setup

- Surfaces live under [`exercises/`](exercises/)
- Each surface is ordered by difficulty, then sequence

**Initial stacks**

- Full-stack: React, Vite, in-package API, Vitest, Testing Library
- Backend API: Next.js App Router route handlers, Vitest

<sub>💡 Generated drills can pick a different stack.</sub>

**Setup**

- Repo root: `pnpm install`
- Each package: `pnpm check` and `pnpm dev`
