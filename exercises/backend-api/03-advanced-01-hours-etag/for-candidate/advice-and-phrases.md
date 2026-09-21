# Candidate advice and phrases

## Useful moves

- Trace one GET request before editing.
- State which representation the ETag protects.
- Test a matching validator before adding parsing rules.
- Keep a `304` response body empty.
- Read the current value before checking an update precondition.

## Useful phrases

> I will first make the read path observable, then reuse that validator for
> updates.

> I am treating an ETag as a validator for one serialized representation. Can I
> confirm that object key order should not change it?

> Before I add more parsing, I want to prove the exact header match and confirm
> the 304 has no body.

> I have a partial result. The next risk is stale writes, so I will verify the
> current ETag before saving.
