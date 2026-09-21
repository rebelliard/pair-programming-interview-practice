# 📨 Candidate guide: exercise 2

⏱️ 50 minutes.

## 🎯 User story

> As a workspace administrator, I want to invite a teammate by email, so they
> can join my workspace without an operations engineer changing the data
> manually.

### 📨 The request

The workspace page already shows members and pending invitations. Connect the
email form to the existing server write path so an administrator can send an
invitation and see the result.

## 🧭 Your path

1. Run `pnpm check` from this package. Seven server tests pass before you
   change code.
2. Read [`advice-and-phrases.md`](advice-and-phrases.md).
3. Trace the current request path before choosing where to work.

## 🛠️ Before you start

Install dependencies if needed, then run:

```bash
pnpm check
pnpm dev
```

Open `http://localhost:5173`. The app shows the `ws-acme` workspace, its
members, and its pending invitations.

## 🗺️ Codebase map

- `src/client/` contains the React application and API client.
- `src/server/` contains the request handler, workspace logic, and in-memory
  repository.
- `src/shared/` contains types used by both client and server.
- `src/client/components/ui/` contains generated shadcn/ui primitives. Use
  them; do not edit them.
- `test/` contains server checks and fixtures with an in-memory transport.

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

🤖 AI is allowed in this mock. Use it deliberately and remain responsible for
every change you keep.

## 📝 Closing summary

Say:

> This behavior works and these checks pass. I assumed X. I did not cover Y.
> Before production, my next step would be Z.
