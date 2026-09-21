# 🔬 Exercise 3 design notes

## 🎯 Goal

Practice reliable presentation-ended webhook delivery without real networking
or nondeterministic waits. The exercise uses scripted responses and a recording
sleeper so each observable effect has a narrow test.

## ✅ Decision

Keep the domain sequence small:

```text
build request → send → classify response → report
```

The client renders deliveries and calls a typed retry API. The server owns the
in-memory repository and delivery behavior. This separates async UI safety from
bounded retry mechanics while preserving one end-to-end request path.

## ✂️ Scope cuts

- no real HTTP, queue, worker, persistence, jitter, cap, or authentication;
- no retry date parsing;
- no background polling;
- no custom visual design beyond the generated primitives.

## 🧭 Full-stack revision

The original outbound-boundary drill became a React and Vite package. The
starter now makes one delivery attempt and leaves the Retry button unprotected.
The first request demonstrates single-flight UI state and idempotency; the
second demonstrates bounded server retries and `retry-after`; 409 handling
remains a stretch.
