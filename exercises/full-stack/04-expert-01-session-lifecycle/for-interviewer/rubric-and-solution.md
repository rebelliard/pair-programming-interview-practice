# 📊 Rubric and reference solution

Keep this file private until the debrief.

## ⚖️ Scoring principles

- Score observable evidence, not speed or confidence.
- Pin-before-change is the main skill, even when the bug is visible.
- Core completion is expected.
- Centralized legality is strong completion; reopen is optional.
- Record a timestamped example for each score.

Styling is not assessed; reuse the existing components.

## 🔢 Four-point scale

| Level | Meaning                                                   |
| ----- | --------------------------------------------------------- |
| 1     | No clear evidence yet, even after direct help             |
| 2     | Some progress; still needs direct implementation guidance |
| 3     | Expected performance with normal navigator hints          |
| 4     | Independent, well-prioritized, and thoroughly verified    |

## 📊 Weighted rubric

| Dimension                    | Weight | Expected level-three evidence                                 |
| ---------------------------- | -----: | ------------------------------------------------------------- |
| Cold-start orientation       |    15% | Reconstructs transitions and notices the shared guard         |
| Characterization discipline  |    15% | Pins resume row green, flips only wrong cells, then shows red |
| Clarification and scope      |    10% | Confirms live resume rejects and only resume changes          |
| Smallest correct fix         |    15% | Changes one guard without changing other commands             |
| Testing and verification     |    10% | Compares whole results, protects input, reruns focused/full   |
| Behavior-preserving refactor |    10% | Centralizes legality and proves all 25 cells independently    |
| UI state and accessibility   |    10% | Queries by role or label and checks enabled, error, and badge |
| Communication                |     5% | Explains observed versus desired behavior                     |
| Cursor and tool judgment     |    10% | Delegates narrowly and rejects unrequested architecture       |

## 🏁 Expected completion

| Progress                                      | Interpretation           |
| --------------------------------------------- | ------------------------ |
| Reconstructs the table and finds test gaps    | Expected orientation     |
| Pins resume row, flips two cells, fixes guard | Expected live completion |
| `canApply` and independent 25-cell test pass  | Strong completion        |
| `reopen` is exhaustive and isolated           | Stretch completion       |

## ✅ Core acceptance

- Scheduled resume rejects.
- Live resume rejects.
- Paused resume succeeds to live.
- Ended and cancelled resume reject.
- Rejections preserve the original input.
- Start, pause, end, and cancel legal paths remain unchanged.
- Error shape remains `invalid_transition` with source and command.
- Resume is disabled unless the session is paused.

## 📋 Refactor acceptance

Eight legal cells:

1. scheduled → start → live;
2. scheduled → cancel → cancelled;
3. live → pause → paused;
4. live → end → ended;
5. live → cancel → cancelled;
6. paused → resume → live;
7. paused → end → ended;
8. paused → cancel → cancelled.

All other status × command cells reject. `canApply` and `applyCommand` must
agree, while the test oracle stays independent from production data.

On `invalid_transition` the client shows "That action is no longer valid" and
refetches the session so the badge matches the server.

## ♻️ Stretch acceptance

- ended → reopen → live;
- every other reopen source rejects;
- cancel from ended remains rejected;
- the command switch stays exhaustive;
- Reopen is enabled only from ended.

## 🧭 Reference direction

Core:

```typescript
case 'resume':
  if (session.status !== 'paused') {
    return invalidTransition(session, command);
  }
```

Refactor:

```typescript
const legalSources: Record<Command, readonly SessionStatus[]> = {
  start: ['scheduled'],
  pause: ['live'],
  resume: ['paused'],
  end: ['live', 'paused'],
  cancel: ['scheduled', 'live', 'paused'],
};
```

`applyCommand` rejects first with `canApply`, then exhaustively maps commands to
target statuses.

The stretch adds `reopen: ['ended']` and a `case 'reopen'` returning live.

Apply [`reference.patch`](reference.patch) in a disposable copy:

```bash
git apply --unidiff-zero for-interviewer/reference.patch
pnpm check
pnpm exec tsc --project for-interviewer/tsconfig.json
pnpm exec vitest run --config for-interviewer/vitest.config.ts
```

## 📝 Feedback notes

| Time | Observation | Hint level | Dimension | Keep or change |
| ---- | ----------- | ---------: | --------- | -------------- |
|      |             |            |           |                |

✅ Useful:

> At 17:20, you kept the current-behavior table green before flipping the two
> product mismatches. Keep separating evidence from intent.

> At 32:10, you rejected a generated state-machine class and kept the refactor
> to one legality function.

❌ Avoid:

> You seemed comfortable with the code.
