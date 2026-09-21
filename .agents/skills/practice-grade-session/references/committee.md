# 🧑‍⚖️ Independent scoring committee

The parent agent interviews and gathers facts. It does not score. Two
independent high-reasoning reviewers score the same packet without seeing each
other. A fresh Claude Opus validator reads both reviews, resolves
disagreements against the evidence, and writes the scorecard the candidate
sees.

## 🎛️ Model routing

Inspect the `Task` tool's `available_subagent_models` list for this turn. Pick
the first slug that is actually listed. Do not invent slugs. Do not pass
`inherit`. Do not use Fable, Composer, Grok, Gemini, GLM, or Kimi as a grader.

**Lane A — Claude family** (high reasoning):

1. `claude-opus-5-thinking-xhigh`
2. `claude-opus-5-thinking-high`
3. `claude-opus-5-thinking-max`
4. `claude-sonnet-5-thinking-xhigh`
5. `claude-sonnet-5-thinking-high`

**Lane B — GPT family** (high reasoning, different provider):

1. `gpt-5.6-sol-xhigh`
2. `gpt-5.6-sol-high`
3. `gpt-5.6-sol-max`
4. `gpt-5.6-terra-xhigh`
5. `gpt-5.6-terra-high`

**Validator — Claude Opus**, a new `Task`, never a resume of Lane A:

1. `claude-opus-5-thinking-xhigh`
2. `claude-opus-5-thinking-high`
3. `claude-opus-5-thinking-max`

If no Opus slug exists, use the Lane A fallback list and label the validator
`heuristic substitution`. Skip `*-fast`, `*-low`, and `*-medium` unless no
higher slug exists for that family.

If Lane B cannot be filled, run Lane A alone, then still run the Opus
validator on that single review. Record the missing lane.

If `Task` is unavailable, or no listed slug matches either family, the parent
scores the session itself using the reviewer prompt's rules and the
validator's scorecard shape, and labels the scorecard `single-reader`. Do not
fake a committee.

## 📦 Packet

The parent writes one Markdown packet and pastes the same text into both
reviewer prompts. Facts only. Exclude the parent's opinions, draft scores,
excuses, and any mention of another reviewer.

Include:

- exercise number and package root path;
- releases the candidate opened;
- summaries for every Vitest project the package defines from `pnpm check`,
  plus private acceptance summaries (test names, pass / fail, not the test
  bodies);
- `git status --short` and the full `git diff`;
- the timer log, if any;
- interview questions and answers, close to verbatim;
- absolute paths to `for-interviewer/rubric-and-solution.md`,
  `for-interviewer/reference.patch`, `for-interviewer/README.md`, and the
  changed `src/` and `test/` files.

Tell each reviewer to read those files themselves. Do not summarize the
rubric for them.

## 🚀 Launch reviewers

In **one** parent turn, launch two `Task` calls:

| Field           | Lane A                         | Lane B               |
| --------------- | ------------------------------ | -------------------- |
| `description`   | `Opus session scorer`          | `Sol session scorer` |
| `subagent_type` | `generalPurpose`               | `generalPurpose`     |
| `model`         | Lane A slug                    | Lane B slug          |
| `environment`   | `local`                        | `local`              |
| Background      | wait for both (not background) | wait for both        |

Give each the reviewer prompt below plus the packet. Do not resume either
agent. Do not show one output to the other.

If a lane returns empty or errors, record it and continue with the lane that
worked.

## 🧑‍⚖️ Reviewer prompt

Paste this as the `prompt`, then the packet.

> You are an independent interviewer scoring a completed pair-programming
> practice session. You are the only scorer. Nobody else is scoring this. Do
> not mention other reviewers. Do not edit files. Do not run formatters. You
> may read files named in the packet.
>
> Read the rubric and the reference patch at the paths in the packet. Use
> that rubric's own scale and dimension names. Score only releases the
> candidate opened.
>
> Rules:
>
> - Evidence first. A file and line, a test name, a log timestamp, or a
>   quoted answer. Level 3 needs corroboration from an artifact or log;
>   self-report alone caps a dimension at one step below the rubric's top.
> - Do not score AI frequency, typing speed, narration volume, or
>   nervousness.
> - An unopened extension is not a failure.
> - Never treat "I would have…" as evidence.
> - Failed acceptance tests in an opened release are missed edge cases.
> - Score UI evidence from Testing Library output and the diff, not screenshots the packet does not contain.
>
> Return only this Markdown, nothing else:
>
> ```markdown
> # Independent review
>
> Model: <the model you are>
>
> ## Scores
>
> | Dimension | Level | Weight | Evidence | Source |
> | --------- | ----: | -----: | -------- | ------ |
>
> Weighted total: <x.x> / <rubric max>
>
> ## Reference comparison
>
> - Difference: … → trade-off \| mistake \| equivalent, because …
> - Missed edge cases (opened releases): …
> - Next release direction (if not reached): …
>
> ## Draft lessons
>
> One lesson (What happened / Why it matters / The better move / How to
> spot it next time) for every failed opened acceptance test, every
> `mistake`, and every dimension at the rubric's bottom two levels.
>
> ## Limits
>
> What you could not see.
> ```

## ✅ Validator prompt

After both reviewers finish, launch one new `Task` (do not resume a reviewer):

| Field           | Value                  |
| --------------- | ---------------------- |
| `description`   | `Opus score validator` |
| `subagent_type` | `generalPurpose`       |
| `model`         | Validator slug         |
| `environment`   | `local`                |

Paste this as the `prompt`, then the packet, then both reviews in full,
labeled with their model slugs.

> You are the lead interviewer for this debrief. Two independent reviewers
> already scored the same packet. They did not see each other. Your job is to
> validate, not to average.
>
> Do not edit files. You may re-read files named in the packet. Do not
> interview the candidate again.
>
> For every dimension:
>
> 1. If both reviewers agree, keep that level unless the cited evidence
>    clearly does not support it. If you override an agreement, say why.
> 2. If they disagree, re-check the cited artifact, log line, or answer
>    yourself and pick one level. Do not split the difference (no 1.5).
> 3. Prefer the reviewer whose evidence is specific (path, test name,
>    timestamp, quote). Downgrade a level that rests only on a plausible
>    story.
>
> Then write the candidate-facing scorecard in the shape from
> `practice-grade-session/SKILL.md` (Two priorities, One keep, Scores,
> Reference comparison, Lessons with all four parts, Overall feedback,
> Optional follow-up drill). Add this section after Scores:
>
> ```markdown
> ## Reviewers
>
> Independent: <lane A model> · <lane B model>
> Validator: <your model>
>
> | Dimension | A | B | Validated | Resolution |
> ```
>
> Fill `Resolution` only where A and B differed, in one sentence. If a lane
> is missing, say so and score from the remaining review plus the packet.
>
> Be direct and kind. Do not soften a level to protect feelings. Do not
> reveal acceptance test bodies; name tests and the behavior they prove.
>
> Return only the scorecard Markdown.
