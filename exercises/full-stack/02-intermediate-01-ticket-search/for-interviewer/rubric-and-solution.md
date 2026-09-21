# 📊 Rubric and reference solution

Keep this file private from the candidate until the debrief.

## ⚖️ Scoring principles

- Score observable evidence, not confidence, accent, speed, or nervous mannerisms.
- One or two normal hints are compatible with a strong result at this level.
- Reaching the optional sorting requirement is not necessary.
- Record a timestamped example for every score.
- Treat the result as one practice signal, not a hiring verdict.

## 🔢 Four-point scale

| Level | Meaning                                                   |
| ----- | --------------------------------------------------------- |
| 1     | No clear evidence yet, even after direct help             |
| 2     | Some progress; still needs direct implementation guidance |
| 3     | Expected performance with normal navigator hints          |
| 4     | Independent, well-prioritized, and thoroughly verified    |

## 📊 Weighted rubric

| Dimension                       | Weight | Expected level-three evidence                                                    |
| ------------------------------- | -----: | -------------------------------------------------------------------------------- |
| Baseline and walkthrough        |    15% | Gives an ordered walkthrough and answers probes with reasons                     |
| Clarification and scope         |    10% | Restates the behavior and asks about blank input or defaults                     |
| Codebase navigation             |     5% | Traces the existing priority path through client, route, and domain              |
| Incremental implementation      |    20% | Makes focused changes and keeps the relevant checks green                        |
| Testing and verification        |    15% | Writes a meaningful search test and verifies regressions                         |
| Diagnosis and debugging         |     5% | Explains the mutation contract or debugs a live mismatch from evidence           |
| UI state and accessibility      |    10% | Uses labelled controls and verifies visible state through user interaction       |
| Communication and collaboration |    10% | Communicates at decisions and processes hints constructively                     |
| Cursor and tool judgment        |    10% | Delegates narrowly, explains retained output, and verifies it during the session |

Use the weights only to compare practice sessions. A useful target is level
three in most areas, with no level one in walkthrough, implementation, or
collaboration. Do not classify the person from one score. Use the two lowest
dimensions to choose the next practice drill.

Score only evidence from the baseline walkthrough and live work in this
package. Do not reduce a score because the optional warm-up was not assigned.

Styling is not assessed; reuse the existing components.

## 🏁 Expected completion by level

| Progress                                                           | Interpretation            |
| ------------------------------------------------------------------ | ------------------------- |
| Starter checks pass and the candidate can explain the baseline     | Expected preparation      |
| Walkthrough is ordered and gives reasons for the existing contract | Expected first impression |
| Search works in domain and HTTP layers with one test               | Expected live completion  |
| Resolved visibility works and combines with search                 | Strong completion         |
| Oldest-first tie-breaking also works                               | Stretch completion        |

## ✅ Core acceptance criteria

### 🐛 Baseline regression

- Querying tickets does not change repository order.
- Existing displayed ordering remains correct.
- The candidate can explain that the copy prevents `sort()` from mutating
  repository-owned data.
- `pnpm check` passes on the submitted state.

### 🎤 Walkthrough

- Follows a recognizable order.
- Shows the test run rather than describing it.
- Answers probes with a reason and, where relevant, a rejected alternative.
- Traces the request path, explains the regression contract, and identifies
  where the new behavior is likely to belong.

### 🔍 Search

- `q` travels from `listTickets` to `queryTickets`.
- Search matches `title` or `requester`.
- Search is case-insensitive.
- Leading and trailing spaces are ignored.
- Missing and whitespace-only queries apply no search filter.
- Priority and search combine using AND.
- No match returns `200` with an empty ticket list.
- At least one candidate-written test proves meaningful search behavior.

### 👁️ Resolved visibility

- Resolved tickets are hidden by default.
- Only `includeResolved=true` includes them.
- Search and priority still combine with visibility.
- Existing tests are updated only where the product requirement changes their
  expected ticket set.

### ⏳ Sorting stretch

- Priority remains the first ordering key.
- Earlier `updatedAt` values come first when priorities tie.
- Sorting remains non-mutating.

## 🕵️ Hidden edge cases

Use these for observation and feedback, not as undisclosed gotchas.

1. `q="  PRIYA "` matches requester `"Priya Natarajan"`.
2. `q=""` and `q="   "` behave like no query.
3. Search and priority combine using AND.
4. A matching resolved ticket remains hidden by default.
5. `includeResolved=true` exposes that matching ticket.
6. `includeResolved=false`, `1`, or `yes` does not expose resolved tickets.
7. No search result is `200` with `[]`, not `404`.
8. Repository order remains unchanged after every query path.
9. Same-priority tickets are oldest first in the stretch behavior.
10. Exact timestamp ties may preserve input order.

## 🧭 Reference implementation direction

### 🏷️ Types

Extend `QueryOptions`:

```typescript
export interface QueryOptions {
  includeResolved?: boolean;
  priority?: Priority;
  q?: string;
}
```

### 🖥️ Client

Keep `Search` controlled and send its value as `q` through the typed API
client. Use `Input` and `Label` for search, `Checkbox` and `Label` for
`Include resolved`, and the existing `Empty` state when the response has no
tickets. Each filter change fetches the new list; the priority queue renders
the returned order.

### ⚙️ Query function

1. Normalize the query once.
2. Copy the repository array.
3. Filter visibility.
4. Filter priority.
5. Filter title or requester when the normalized query is non-empty.
6. Sort by priority and then timestamp.

Conceptually:

```typescript
const normalizedQuery = options.q?.trim().toLowerCase() ?? '';

return [...repository.listAll()]
  .filter((ticket) => options.includeResolved || ticket.status !== 'resolved')
  .filter((ticket) => options.priority === undefined || ticket.priority === options.priority)
  .filter(
    (ticket) =>
      normalizedQuery === '' ||
      ticket.title.toLowerCase().includes(normalizedQuery) ||
      ticket.requester.toLowerCase().includes(normalizedQuery),
  )
  .sort(compareByPriority);
```

The final comparator returns the priority difference first, then:

```typescript
Date.parse(left.updatedAt) - Date.parse(right.updatedAt);
```

### 🌐 HTTP layer

Delegate product behavior to the query function:

```typescript
queryTickets(repository, {
  includeResolved: request.query.includeResolved === 'true',
  priority,
  q: request.query.q,
});
```

## 📎 Reference files

[`for-interviewer/reference.patch`](reference.patch) contains the complete reference change.

In a disposable copy:

```bash
git apply --unidiff-zero for-interviewer/reference.patch
pnpm check
pnpm exec tsc --project for-interviewer/tsconfig.json
pnpm exec vitest run --config for-interviewer/vitest.config.ts
```

The acceptance tests intentionally fail against the starter and pass against
the reference implementation.

## 📝 Feedback note template

| Time | Observation | Hint level | Dimension | Keep or change |
| ---- | ----------- | ---------: | --------- | -------------- |
|      |             |            |           |                |

✅ Good feedback:

> At 21:10 you ran the focused test before touching the route. Keep that
> verification loop.

> In the walkthrough you identified that Recent activity and the Priority
> queue share one client array, then kept the defensive copy at the client
> sort boundary. Keep making that boundary reasoning visible.

❌ Weak feedback:

> You seemed confident.

The first statement is observable and repeatable. The second is subjective and
not actionable.
