# 🤝🏽 Pairing advice and AI protocol

## 🧭 Useful phrases

- “I will first prove the current result with one request and one test.”
- “This expectation describes observation; I will keep it green before I
  compare it to the requested contract.”
- “This field is an object, so I want to verify whether the update recurses or
  replaces it.”
- “Before I change storage, I want to know whether the candidate result is
  valid.”
- “I will keep arrays as replacement values and avoid merging by index.”
- “I am done with this slice; I will rerun the focused test and the starter
  suite.”

## 🤖 AI protocol

AI can help with a bounded task. Before using it:

1. State the narrow problem you want help with.
2. State how you will verify the output.
3. Inspect generated code before applying it.
4. Reject new libraries, persistence layers, or broad rewrites that do not
   serve the task.

Good prompt:

> Explain, without code, how a JSON Merge Patch treats nested objects, arrays,
> scalar values, and null members. I will compare it with my existing tests.

Avoid asking an assistant to solve the whole exercise or to infer product
requirements from a failing test.
