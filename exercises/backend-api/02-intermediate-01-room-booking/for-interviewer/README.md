# Facilitator playbook: room booking

## Purpose

This 50-minute, feature-only intermediate exercise evaluates how a candidate
traces a small Next.js API, asks useful questions, delivers a narrow vertical
slice, and verifies it. The starter is deliberately green but does not
implement the released booking behavior.

Keep this directory private. Send the candidate a copy without
`for-interviewer/`:

```bash
tar \
  --exclude='./node_modules' \
  --exclude='./.next' \
  --exclude='./coverage' \
  --exclude='./for-interviewer' \
  -czf ../02-intermediate-01-room-booking-candidate.tar.gz .
```

Before the session, run:

```bash
pnpm check
pnpm test:interviewer
pnpm typecheck:interviewer
```

The starter tests must pass. The private acceptance tests must fail before the
candidate implements the feature. Apply `reference.patch` only to verify the
exercise package, never to a candidate copy.

Read [`research-notes.md`](research-notes.md) before facilitating. Use
[`slides/deck.md`](slides/deck.md) with the reveal plan in
[`slides/README.md`](slides/README.md). Grade only with
[`rubric-and-solution.md`](rubric-and-solution.md).

## Schedule

| Time        | Activity                                                       |
| ----------- | -------------------------------------------------------------- |
| 0:00–3:00   | Explain roles, quiet time, and deliberate AI use.              |
| 3:00–8:00   | Ask the candidate to trace the route, factory, and repository. |
| 8:00–10:00  | Run the green starter tests together.                          |
| 10:00–12:00 | Give one specific, behavioral coaching point.                  |
| 12:00–29:00 | Release Core and pair on the vertical slice.                   |
| 29:00–38:00 | Release Extension only when Core is substantially working.     |
| 38:00–42:00 | Release Stretch only when Extension is green.                  |
| 42:00–50:00 | Handoff, evidence-based feedback, and scoring.                 |

If Core is not working at minute 29, do not release Extension. Help the
candidate finish one coherent slice instead.

## Release groups

### Core — release at 12:00

> Add `POST /api/bookings`. A booking reserves a room for a start and end
> time. A room cannot have overlapping reservations. Consecutive reservations
> are allowed. Return the right successful HTTP response and enough information
> for a client to find the new booking.

Clarify only when asked:

- bookings for different rooms do not conflict;
- intervals use timestamps;
- an end exactly equal to another booking's start is allowed;
- persistence can remain in memory.

Expected evidence: the candidate reads the route-to-factory path, adds focused
coverage, and demonstrates a success, a collision, and the boundary case.

### Extension — release after Core

> Make malformed request data distinguishable from a valid request that cannot
> be accepted because the room is already booked. Use JSON API responses. Do
> not add a validation library.

Expected evidence: explicit request-shape checks, a domain conflict rule, and
separate client-meaningful error responses.

### Stretch — release after Extension

> Support deleting a booking by ID. After deletion, that room interval should
> be available again.

Expected evidence: routing context is handled deliberately, deletion preserves
the domain rule, and the success response suits a deletion.

## Hint ladder

Use the lowest useful hint, then wait.

1. “What is the smallest request and expected response you can make work?”
2. “Where does the Next route hand control to application code?”
3. “How would you describe an overlap using the two interval boundaries?”
4. “Try comparing each start against the other end; equality is the boundary
   case.”

For validation:

1. “Which failures are about the shape of the input?”
2. “Which failure can happen only after you look at existing bookings?”
3. “What should an API consumer learn from the status code?”

Do not show the private tests or reference patch.

## Debrief prompts

- What did you choose as the smallest safe slice?
- Which assumption would you confirm before production?
- What did the tests prove, and what did they not prove?
- If you had ten more minutes, what would you improve?

Record observed behavior and the highest hint level. Do not score typing speed,
constant narration, or use of AI by itself.
