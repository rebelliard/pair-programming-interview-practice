# Pairing advice

## A compact loop

1. State the behavior you want to protect.
2. Trace the smallest path that controls it.
3. Make one change.
4. Run the closest check.
5. Summarize the result and choose the next step.

## Useful phrases

> I want to confirm the sort direction and tie-break rule before I choose the
> cursor shape.

> I think an offset moves when a new item is inserted. I will prove that with
> the existing store before I change the handler.

> I will make the successful path work first, then add validation at the
> request boundary.

> I have an assumption about malformed input. Can we confirm the expected HTTP
> response before I implement it?

> I am going quiet for a minute to write this, then I will run a focused test
> and explain the result.

## AI use

AI is allowed in this mock when the interviewer agrees. Keep ownership of each
change: inspect generated code, explain why it is correct, and verify it with
the supplied checks.
