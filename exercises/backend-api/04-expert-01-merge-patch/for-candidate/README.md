# 🩹 Candidate guide: merge-patch API

⏱️ 50 minutes.

This is an API-only Next.js exercise. Start by recording current behavior in a
test. Then compare the evidence with the requested API behavior and make the
smallest safe change.

## 🎯 User story

> As a profile editor, I want a partial profile update to preserve unrelated
> nested fields and remove fields I explicitly clear, so I can edit one value
> without overwriting my other settings.

## 🐛 The problem

`PATCH /api/profiles/:id` currently applies an object update at one level.
That looks plausible for a simple field, but nested profile updates can lose
existing data. A `null` value is also stored as data instead of clearing a
field.

### 🔁 How to reproduce

1. Run `pnpm test` and record what the starter tests prove.
2. Run `pnpm dev` and keep the printed local URL.
3. Read `src/profiles/profiles-route.ts` and its tests.
4. Send this request, using your local URL:

```bash
curl -sS -X PATCH http://localhost:3000/api/profiles/pro-1 \
  -H 'content-type: application/json' \
  --data '{"contact":{"address":{"city":"Paris"}}}'
```

5. Observe that the returned `contact` only has the submitted nested data.
6. Repeat with `{"contact":{"phone":null}}` and observe that `null` is
   returned as data.

## 🧭 Your path

1. 🛠️ Run the starter tests before changing production code.
2. 🗺️ Map the API route, factory, store, and profile shape.
3. 🧪 Add a focused characterization test for one nested update and one
   clear operation. Keep it green first.
4. 📋 Compare those observations with the product behavior below.
5. 🔴 Change only mismatching expectations and show the failure.
6. 🩹 Make the smallest fix that restores the requested behavior.
7. 📝 Finish with an engineering handoff.

## 📋 Product behavior

For a JSON object patch:

- merge nested objects recursively;
- a `null` member removes that member from its containing object;
- arrays and scalar values replace the existing value;
- an empty object patch changes nothing.

A request must not mutate data when its resulting profile is invalid. The
service contract also uses `application/merge-patch+json` for merge-patch
requests.

## 🗺️ Codebase map

- `app/api/profiles/[id]/route.ts` is the Next.js route boundary.
- `src/profiles/profiles-route.ts` creates the HTTP handlers.
- `src/profiles/profile-store.ts` provides the in-memory seeded profile.
- `src/profiles/types.ts` defines the API data shape.
- `test/` holds starter behavior tests.

The route files only expose HTTP methods. Keep API behavior in `src/`.

## 🤝🏽 Working agreement

- You drive; the interviewer navigates.
- Quiet reading and coding are welcome.
- Separate what the code does from what the product needs.
- Keep the change small before considering a refactor.
- Explain the request and response behavior you are validating.
- 🤖 AI is allowed. See [`advice-and-phrases.md`](advice-and-phrases.md).

## 📝 Handoff

Explain:

1. what current behavior you pinned;
2. which expected behavior you changed and why;
3. how your merge and deletion behavior works;
4. which checks pass;
5. what you would do next with more time.
