# 🩹 Facilitator playbook: merge-patch API

## 🎯 Purpose

Run a characterization-first API maintenance drill. The candidate must first
make the shallow-update behavior observable, then repair the merge semantics
without widening the API or adding dependencies.

This session measures:

- isolating HTTP boundaries from the implementation;
- distinguishing observed behavior from the desired contract;
- implementing recursive object merge and deletion semantics;
- preserving array and scalar replacement behavior;
- validating an assembled value before atomically storing it.

Private evidence lives in [`acceptance/`](acceptance/),
[`reference.patch`](reference.patch), and [`grading.json`](grading.json).
Do not include them in the candidate archive.

## 🧭 Before the session

From this exercise directory, install dependencies only if the environment
needs them. Then run:

```bash
pnpm format && pnpm typecheck && pnpm exec vitest run
pnpm exec tsc --project for-interviewer/tsconfig.json
pnpm exec vitest run --config for-interviewer/vitest.config.ts
```

Expected starter state:

- the four starter behavior tests pass;
- core acceptance is red because nested object siblings are lost and null is
  stored;
- extension acceptance is red because the starter accepts `application/json`
  and stores invalid patches;
- stretch acceptance is red because it does not advertise merge-patch support.

Prepare a candidate-safe archive:

```bash
tar \
  --exclude='./node_modules' \
  --exclude='./.next' \
  --exclude='./for-interviewer' \
  -czf ../04-expert-01-merge-patch-candidate.tar.gz .
```

## 🗣️ Opening script

> This is pairing practice, not a quiz. Today we will capture what the service
> does before changing it. You drive and I navigate. A focused change with
> evidence is more valuable than a broad rewrite.
>
> Cursor is allowed. State the bounded task you want help with and how you will
> verify the result.

## 🗺️ Orientation: minutes 2–10

Ask the candidate to:

1. run the starter tests;
2. trace the Next route into the `src` factory;
3. identify the seeded document and its nested objects;
4. explain what `Object.assign` does to a nested member;
5. name one example that would distinguish replacement from recursive merge.

Do not confirm the defect before minute 10.

## 🩹 Release 1: nested profile edit

> A profile editor changed only a city. The API response no longer contained
> the profile email, phone, or address country. Clearing a phone number also
> returned `null` instead of removing the member.

### 🔁 How to reproduce

1. Start the local service with `pnpm dev`.
2. Send a PATCH for `pro-1` with
   `{"contact":{"address":{"city":"Paris"}}}`.
3. Observe that `contact` now contains only the submitted address fragment.
4. Send `{"contact":{"phone":null}}`.
5. Observe that `null` is stored instead of deleting `phone`.

### 🛠️ Task

1. Add one test that records the current result for a nested city update and
   one test that records the current result for clearing `phone`. Keep them
   green.
2. Compare the observations with the product behavior in the candidate guide.
3. Flip only the disagreeing expectations and show them red.
4. Implement RFC 7396-style member semantics: object recursion, `null`
   deletion, scalar replacement, array replacement, and empty-object no-op.
5. Keep the route file as an HTTP-only delegate to the `src` factory.

Clarifications:

| Question                                   | Product answer                                                                              |
| ------------------------------------------ | ------------------------------------------------------------------------------------------- |
| Should arrays merge by index?              | No. An array replaces the old array.                                                        |
| Is `null` stored as an application value?  | No. In an object patch it deletes that member.                                              |
| Must an empty object allocate new data?    | No. Its observable result is a no-op.                                                       |
| Do we need a database?                     | No. Preserve the in-memory store.                                                           |
| Can the candidate add a library?           | No. The required behavior is small enough to implement locally.                             |
| Must the root PATCH document be an object? | The profile endpoint accepts an object patch; other final documents are not valid profiles. |

Core success is one small merge function, used before the store write, with
all starter and core tests green.

## 📦 Release 2: explicit media type and atomic validation

Release only after core is green:

> Clients must use `application/merge-patch+json`. Before a result is saved,
> validate the complete merged profile. If it is invalid, return 422 and leave
> the stored profile exactly as it was.

Use these contract decisions:

- any media type other than `application/merge-patch+json` returns `415` with
  `{ "error": "unsupported_media_type" }`;
- a malformed JSON body returns `400` with `{ "error": "invalid_json" }`;
- an invalid final profile returns `422` with `{ "error": "invalid_profile" }`;
- `displayName`, `contact.email`, address city/country, preferences, and tags
  must remain valid after merging;
- test atomicity with a patch that changes a valid field and makes email
  invalid in the same request.

The important distinction: merge-patch computes one candidate document first.
Validation judges that candidate as a whole. Do not validate or persist each
member while walking the patch; that can leave a partial update when a later
member fails.

## 📡 Optional stretch: capability discovery

Release only if extension is green by minute 36:

> Add `OPTIONS /api/profiles/:id` with status `204`,
> `Allow: GET, PATCH, OPTIONS`, and
> `Accept-Patch: application/merge-patch+json`.

Keep the Next route a delegate. The factory owns the new method.

## ⏱️ Exact agenda

| Time        | Activity                         | Mode         |
| ----------- | -------------------------------- | ------------ |
| 0:00–2:00   | Roles and AI agreement           | 🎯 Interview |
| 2:00–7:00   | Quiet read and baseline tests    | 🎯 Interview |
| 7:00–10:00  | Trace the route and data shape   | 🎯 Interview |
| 10:00–12:00 | Release the bug                  | 🎯 Interview |
| 12:00–28:00 | Characterize, flip, and fix core | 🎯 Interview |
| 28:00–30:00 | Evidence-based coaching pause    | 💬 Coaching  |
| 30:00–39:00 | Media type and atomic validation | 🎯 Interview |
| 39:00–42:00 | Engineering handoff              | 🎯 Interview |
| 42:00–50:00 | Debrief and score                | 💬 Coaching  |

## 🪜 Hint ladders

### Core

1. “What does the current assignment do to `contact`?”
2. “Which JSON value type should recurse?”
3. “Where must the delete happen: before or after a nested merge?”
4. “What should happen when the new value is an array?”

### Atomic validation

1. “Can you construct the full candidate profile without saving it?”
2. “What request proves that two changes are not partly applied?”
3. “Which value should validation inspect: the patch or the merged profile?”

### Stretch

1. “Which HTTP method advertises available methods?”
2. “Which response header tells a client the accepted patch format?”

## 🧭 Debrief

Ask:

- What did the characterization test contribute beyond the visible bug?
- Why must an array replace rather than recursively merge?
- Why does validation run after merge but before store replacement?
- What was the smallest safe boundary for this change?

Use [`rubric-and-solution.md`](rubric-and-solution.md) and
[`grading.json`](grading.json) for the private score.
