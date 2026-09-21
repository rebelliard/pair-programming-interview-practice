# 🤝🏽 Candidate guide: exercise 1

⏱️ 50 minutes.

## 🎯 User story

> As a support agent, I want to find relevant tickets by title or requester, so
> I can reach the right customer issue quickly without losing the queue's
> existing priority behavior.

### 📨 The request

You will extend `GET /tickets` with this search behavior.

## 🧭 Your path

1. Run `pnpm check` from this package. Five tests pass before you change code.
2. Read [`advice-and-phrases.md`](advice-and-phrases.md) for pairing and AI
   guidance.
3. Trace the current ticket path before choosing where to work.

## 🛠️ Before you start

Install dependencies if needed, then run:

```bash
pnpm check
pnpm dev
```

Open `http://localhost:5173`. The app shows the priority queue and recent
activity. The existing priority control is a useful starting point for tracing
how a client input reaches the server.

## 🗺️ Codebase map

- `src/client/` contains the React application and the API client.
- `src/server/` contains the request handler, ticket query, and in-memory
  repository.
- `src/shared/` contains types used by both client and server.
- `src/client/components/ui/` contains generated shadcn/ui primitives. Use
  them; do not edit them.
- `test/` contains server and client checks that use the in-memory transport.

Styling is not assessed; reuse the existing components.

## 🤝🏽 Working agreement

- You drive; the interviewer navigates.
- Quiet thinking is allowed.
- Explain decisions, discoveries, and expected outcomes rather than every
  keystroke.
- Ask product or technical questions whenever the answer could change the
  implementation.
- A tested, explained partial solution is better than rushed completion.

Useful phrases:

> Can I take a minute to read this quietly, then explain how I understand it?

> I am going quiet for a minute to write this. I will run it and summarize.

> I have been stuck for about two minutes. My current theory is X, and I would
> check Y next. Would you steer me?

Hints are a normal part of pairing. What matters is how you use them.

🤖 AI is allowed in this mock. Use it deliberately and remain responsible for
every change you keep.

## 🔁 Compact working loop

Use **Goal → Options → Choice → Check**:

1. State the goal.
2. Make the smallest useful change.
3. Run a focused check.
4. Explain the result.
5. Choose the next slice.

## 📝 Closing summary

Say:

> This behavior works and these checks pass. I assumed X. I did not cover Y.
> Before production, my next step would be Z.

📖 See [`advice-and-phrases.md`](advice-and-phrases.md) for the full playbook.
