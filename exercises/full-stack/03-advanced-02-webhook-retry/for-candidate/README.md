# 📡 Candidate guide: exercise 3

⏱️ 50 minutes.

## 🎯 User story

> As an integration customer, I want to retry presentation-ended webhooks from
> the delivery page, so temporary partner failures do not make analytics events
> disappear.

### 📨 The request

Build a safe retry flow for webhook deliveries. The page should show each
delivery and its result, and the server should make delivery attempts
predictable.

## 🧭 Your path

1. Run `pnpm check` from this package. Eight tests pass before you change code.
2. Read [`advice-and-phrases.md`](advice-and-phrases.md) for pairing and AI
   guidance.
3. Trace one delivery from the page through the API and back before choosing
   where to work.

## 🛠️ Before you start

Install dependencies if needed, then run:

```bash
pnpm check
pnpm dev
```

Open `http://localhost:5173`. The app shows the deliveries table.

## 🗺️ Codebase map

- `src/client/` contains the React application and API client.
- `src/server/` contains the request handler, delivery repository, and webhook
  delivery code.
- `src/shared/` contains types used by both client and server.
- `src/client/components/ui/` contains generated shadcn/ui primitives. Use
  them; do not edit them.
- `test/` contains server and client checks that use the in-memory transport.
- `src/server/seed.ts` scripts the fake webhook responses by event ID so the
  dev server works offline.

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
