# Model routing

Inspect the current runtime's exposed concrete model slugs immediately before
selection. Availability is authoritative: never invent a name, use `inherit`,
or silently substitute a model.

| Lane        | Eligible family order         | Work                                                    |
| ----------- | ----------------------------- | ------------------------------------------------------- |
| Planner     | Opus → Sol → Fable → Astrabut | Fresh, read-only design specification; no package files |
| Implementer | Grok → Terra → Sonnet         | One assigned implementation slice at a time             |

The planner and implementer must use different concrete slugs and should use
different families. The user may select an implementer only from currently
exposed concrete Grok, Terra, or Sonnet slugs. Record both exact slugs and lanes
in generated `for-interviewer/research-notes.md`.

If a selected model disappears, stop and ask. If no planner lane is exposed,
stop and ask. If no implementer lane is exposed, ask whether to proceed as
`no-delegation` under the orchestrator label or abort. Do not use cross-runtime
delegation without explicit approval.

The orchestrator scopes the work, assigns a single writer, independently
verifies every output, and owns Git. An implementer returns one of `complete`,
`partial`, `blocked`, or `failed` and never pushes. The planner does not write
package files.
