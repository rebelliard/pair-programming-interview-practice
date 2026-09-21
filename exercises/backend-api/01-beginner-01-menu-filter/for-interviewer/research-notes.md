# Research and design record

Research date: 2026-09-21.

## Exercise design

This is a small server-only exercise for a 45-minute warm-up. The defect is a
common JavaScript boundary mistake: query values are strings, so `"false"` is a
truthy value.

The exercise tests a practical sequence:

1. reproduce a concrete API contract failure;
2. add a regression that captures the reported input;
3. inspect request parsing and business logic;
4. make the smallest behavior change;
5. verify the other supported states.

## Deliberate constraints

- The Route Handler only delegates to `src/menu.ts`, so routing framework detail
  does not obscure the core reasoning.
- The factory uses Web `Request` and `Response.json`, which keeps tests fast and
  requires no running HTTP server.
- The starter test covers the missing parameter. Private acceptance covers the
  untested false branch.
- No UI or slides are present. The signal is API reasoning, tests, and
  explanation.

## Calibration

Expected completion is a focused parsing change plus a regression test.
Candidates do not need to introduce a general query parser, schema library, or
new endpoint. Assess the evidence of reasoning and verification rather than
typing speed.
