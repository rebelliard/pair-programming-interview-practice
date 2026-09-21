# 🔄 Candidate guide: exercise 4

⏱️ 50 minutes.

In this session, pin current behavior in a test before changing production
code. Then change only expectations that disagree with the product table.

## 🎯 User story

> As a facilitator using more than one browser tab, I want stale session
> actions to respect the lifecycle rules, so a session cannot become live
> without a valid start or resume transition.

### 🐛 The problem

The starter's tests do not cover every source state for `resume`. You will
first pin that command's current behavior across all statuses, compare it with
the product table, turn only the mismatches red, and make the smallest fix.
Any structural refactor comes after the regression is green.

The same over-broad guard is visible in the UI: Resume is enabled for more
statuses than the product table allows.

#### 🔁 How to reproduce

1. Run `pnpm dev` and open `http://localhost:5173`.
2. Choose session `ses-scheduled` in the Session select.
3. Observe: "Resume" is enabled.
4. Click "Resume".
5. Observe: the status badge shows `live`.
6. Expected: "Resume" is disabled for scheduled and live; the server rejects with `invalid_transition`.
7. Optional: `curl -s -X POST localhost:5173/api/sessions/ses-scheduled/commands -H 'content-type: application/json' -d '{"command":"resume"}'` returns 200 today; expected 409.

## 🧭 Your path

1. 🛠️ **Check the package:** `pnpm check` from this package. Nine tests pass
   before you change anything.
2. 🖥️ **Open the app:** `pnpm dev` serves `http://localhost:5173`.
3. 🗺️ **Read the lifecycle code and tests** on the client and the server.
4. 📋 **Draw the current transition table.**
5. 🤝🏽 **Pair live** with the interviewer.
6. 📝 **Finish with an engineering handoff.**

📖 Pairing advice and the AI policy:
[`advice-and-phrases.md`](advice-and-phrases.md).

## 🛠️ Before you start

Install dependencies if needed, then run:

```bash
pnpm check
pnpm dev
```

Open `http://localhost:5173`. The app lists seeded sessions. Pick one in the
Session select and use Start, Pause, Resume, End, and Cancel. Styling is not
assessed; reuse the existing components.

## 🗺️ Codebase map

- `src/client/` contains the React application, the API client, and session
  controls.
- `src/server/` contains the request handler, `applyCommand`, and the in-memory
  session repository.
- `src/shared/` contains statuses, commands, results, and `isTerminal`.
- `src/client/components/ui/` contains generated shadcn/ui primitives. Use
  them; do not edit them.
- `test/` contains server and client checks that use the in-memory transport.

Styling is not assessed; reuse the existing components.

## 📋 Product transition table

| From        | `start` | `pause` | `resume` | `end`  | `cancel`  |
| ----------- | ------- | ------- | -------- | ------ | --------- |
| `scheduled` | live    | reject  | reject   | reject | cancelled |
| `live`      | reject  | paused  | reject   | ended  | cancelled |
| `paused`    | reject  | reject  | live     | ended  | cancelled |
| `ended`     | reject  | reject  | reject   | reject | reject    |
| `cancelled` | reject  | reject  | reject   | reject | reject    |

A rejection returns `invalid_transition` with the original status and command.
A successful transition returns a new session object. Inputs are never
mutated.

## 🤝🏽 Working agreement

- You drive; the interviewer navigates.
- Quiet reading and coding are welcome.
- Record observed behavior before changing production code.
- Separate “what the code does” from “what the product should do.”
- Make the smallest fix first. Refactor only behind green tests.
- Hints and partial completion are normal.
- 🤖 AI is allowed. The protocol is in
  [`advice-and-phrases.md`](advice-and-phrases.md).

## 📝 Handoff

Explain:

1. which behavior you pinned;
2. which expectations changed and why;
3. the smallest production fix;
4. the checks that pass;
5. what remains and what you would do next.
