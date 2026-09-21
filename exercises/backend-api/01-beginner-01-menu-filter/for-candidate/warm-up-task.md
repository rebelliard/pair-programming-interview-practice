# Warm-up task

Budget: 45 minutes.

## Bug report

> A customer selects the non-vegetarian menu filter, but receives vegetarian
> dishes instead.

The menu API supports an optional `vegetarian` query parameter. The expected
contract is:

- no parameter returns every dish;
- `vegetarian=true` returns vegetarian dishes;
- `vegetarian=false` returns non-vegetarian dishes.

## Reproduction

1. From this package, run `pnpm dev`.
2. In a second terminal, request the unfiltered menu:

   ```bash
   curl -s http://localhost:3000/api/menu
   ```

3. Request vegetarian dishes:

   ```bash
   curl -s 'http://localhost:3000/api/menu?vegetarian=true'
   ```

4. Request non-vegetarian dishes:

   ```bash
   curl -s 'http://localhost:3000/api/menu?vegetarian=false'
   ```

5. Observe that the last response contains vegetarian dishes. It should contain
   only non-vegetarian dishes.

## Your task

1. Add a regression test in `test/` that fails before the fix and proves the
   `vegetarian=false` contract.
2. Make the smallest change that fixes the defect.
3. Preserve the behavior for an absent parameter and `vegetarian=true`.
4. Run `pnpm check` before you stop.

## Advice

- Begin with the request path: Route Handler, then the response factory.
- Treat query parameters as strings. Check the value you received instead of
  assuming a non-empty string means `true`.
- Make the test fail first. Use it to describe the expected response before you
  edit production code.
- Keep the Route Handler thin. The behavior belongs in the factory under
  `src/`.
- AI is allowed. Ask narrowly, review every line, and be ready to explain what
  you retained.

Do not prepare slides. Bring a short explanation of the bug, the regression,
and the final behavior.
