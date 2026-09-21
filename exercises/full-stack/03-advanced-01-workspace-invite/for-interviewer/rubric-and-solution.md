# 📊 Rubric and reference solution

Keep this file private until the debrief.

## ⚖️ Scoring principles

- Score observable evidence, not confidence, speed, accent, or mannerisms.
- One or two normal navigator hints are compatible with a strong result.
- Core invitations are the expected completion point.
- Seat limits are strong completion; acceptance is optional.

## 🔢 Four-point scale

| Level | Meaning                                                   |
| ----- | --------------------------------------------------------- |
| 1     | No clear evidence yet, even after direct help             |
| 2     | Some progress; still needs direct implementation guidance |
| 3     | Expected performance with normal navigator hints          |
| 4     | Independent, well-prioritized, and thoroughly verified    |

## 📊 Weighted rubric

| Dimension                       | Weight | Expected level-three evidence                               |
| ------------------------------- | -----: | ----------------------------------------------------------- |
| Cold-start orientation          |    15% | Traces client, handler, repository, and detached reads      |
| Clarification and scope         |    10% | Confirms validation, matching, and duplicate behavior       |
| Incremental implementation      |    20% | Builds one end-to-end path before adding edges              |
| Testing and verification        |    15% | Adds success and rejection tests, then reruns checks        |
| Persistence discipline          |    10% | Proves fresh reads changed and rejection did not save       |
| Debugging                       |     5% | Forms a hypothesis from evidence and fixes the cause        |
| Communication and collaboration |     5% | Communicates at decisions and processes hints               |
| Cursor and tool judgment        |    10% | Delegates narrowly, reviews output, and verifies            |
| UI state and accessibility      |    10% | Uses roles or labels and tests pending, error, and disabled |

## ✅ Core acceptance criteria

- Invalid email returns `400 invalid_email`.
- Unknown workspaces return `404 workspace_not_found`.
- Existing members return `409 already_member`.
- Existing invitations return `409 already_invited`.
- A new invitation is persisted and returns `201` with the workspace.
- Rejections do not alter stored state.
- The client disables while pending, appends success, and retains input on error.

## 🪑 Seat-limit criteria

- Used seats equal members plus pending invitations.
- Duplicate-member and duplicate-invitation checks take precedence.
- The client shows seats left and disables at zero.

## ✅ Acceptance stretch criteria

- Unknown workspace and missing invitation return their documented `404` codes.
- Acceptance moves an invitation to members with one save.
- Acceptance does not free a seat.

## 🧭 Reference implementation

Apply [`reference.patch`](reference.patch) in a disposable copy:

```bash
git apply --unidiff-zero for-interviewer/reference.patch
pnpm check
pnpm exec tsc --project for-interviewer/tsconfig.json
pnpm exec vitest run --config for-interviewer/vitest.config.ts
```
