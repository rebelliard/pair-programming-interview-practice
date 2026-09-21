# 📨 Facilitator playbook: exercise 2

## 🎯 Purpose

Run a cold-start pairing drill on a workspace write path. The candidate traces
the client, handler, domain logic, and detached in-memory repository before
adding a small full-stack behavior.

Styling is not assessed; reuse the existing components.

## 🛠️ Before the session

From `03-advanced-01-workspace-invite/`, run:

```bash
pnpm install --frozen-lockfile
pnpm check
```

Confirm that seven starter tests pass: seven server tests and no client tests.
The private core acceptance tests should fail by assertion against the starter.

Prepare the candidate archive:

```bash
tar \
  --exclude='./node_modules' \
  --exclude='./dist' \
  --exclude='./for-interviewer' \
  -czf ../03-advanced-01-workspace-invite-candidate.tar.gz .
```

## 🧭 Orientation: minutes 2–10

Ask the candidate to:

1. run `pnpm test`;
2. trace `InviteForm` → API client → `handle` → repository;
3. explain why a fresh `findById` proves a durable write.

## 📨 Release 1: invite a member

Release at minute 10:

> Client half: wire the email form. Disable the submit button while the request
> is pending. On success, show the returned invitation without reloading. On an
> error, show an inline message and retain the email input value.
>
> Server half: `POST /workspaces/:workspaceId/invitations` accepts `{ email }`.
> Invalid email returns `400 invalid_email`; an unknown workspace returns
> `404 workspace_not_found`; existing members and invitations return
> `409 already_member` and `409 already_invited`. Otherwise append the
> invitation, save once, and return `201` with the workspace.

Email comparison is case-insensitive after trimming. Rejections must not save.

## 💬 Coaching pause: minutes 28–30

Give one observed behavior to keep and one adjustment. Do not reveal a solution.

## 🪑 Release 2: seat limit

Release at minute 30 only when the core path is substantially working:

> Client half: show a `Seats left` badge and disable the form when no seats
> remain.
>
> Server half: used seats are `members.length + invitations.length`. After
> duplicate member and invitation checks, return `409 seat_limit_reached` when
> used seats are greater than or equal to `seatLimit`. Rejections do not save.

When behind, cut the seat-limit server rule and the stretch before cutting the
client form path.

## ✅ Optional stretch: accept an invitation

Release only if the seat limit is green before minute 36:

> Client half: add an accessible Accept button for each invitation and update
> both lists from the returned workspace.
>
> Server half: `POST /workspaces/:workspaceId/members` accepts `{ email }`.
> It returns `404 workspace_not_found` or `404 invitation_not_found`; otherwise
> moves the invitation to members, saves once, and returns `200`.

Acceptance does not free a seat.

## ⏱️ Exact agenda

| Time        | Activity                                   | Mode         |
| ----------- | ------------------------------------------ | ------------ |
| 0:00–2:00   | Roles, AI agreement, quiet-time permission | 🎯 Interview |
| 2:00–7:00   | Quiet read and baseline tests              | 🎯 Interview |
| 7:00–10:00  | Explain the existing write path            | 🎯 Interview |
| 10:00–12:00 | Release and clarify invitations            | 🎯 Interview |
| 12:00–28:00 | Implement core in tested slices            | 🎯 Interview |
| 28:00–30:00 | One keep and one adjustment                | 💬 Coaching  |
| 30:00–39:00 | Seat limit, or finish the core             | 🎯 Interview |
| 39:00–42:00 | Engineering handoff                        | 🎯 Interview |
| 42:00–50:00 | Structured debrief                         | 💬 Coaching  |

## 📝 After the session

Score with [`rubric-and-solution.md`](rubric-and-solution.md). Keep
[`acceptance/`](acceptance/) and [`reference.patch`](reference.patch) private.
