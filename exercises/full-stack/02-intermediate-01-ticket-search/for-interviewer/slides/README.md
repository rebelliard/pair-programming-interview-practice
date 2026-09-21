# 🖥️ Slide-deck guide

Use [`deck.md`](deck.md) to set expectations, stage the exercise, and reveal requirements
at the right time. Keep this folder private from the candidate.

The deck uses standard Markdown with Marp front matter and `---` slide
separators. You can present it with:

- the Marp extension for VS Code;
- Marp CLI or Marp Web;
- any Markdown viewer that supports slide separators;
- a normal Markdown preview, advancing one heading at a time.

No application screenshot is included. The deck presents the real React client
and server structure, including the UI controls introduced by each product
request.

## 🗺️ Reveal plan

The bug report is not in the deck. Exercise 1 already contains the accepted
fix and regression test. Open with a short starting-code walkthrough of this
package.

| Slide                                            | When to show it                                | Candidate-safe before the timer? |
| ------------------------------------------------ | ---------------------------------------------- | -------------------------------- |
| Title through “What a useful session looks like” | Before minute 0                                | ✅ Yes                           |
| “Your walkthrough”                               | Minute 2                                       | ✅ Yes                           |
| Coaching pause                                   | Minute 11, after the checks                    | 🚫 No                            |
| Search request                                   | Minute 12:30                                   | 🚫 No                            |
| Visibility request                               | Minute 29, only if search is working           | 🚫 No                            |
| Ordering stretch                                 | Before minute 35 only when visibility is green | 🚫 No                            |
| Handoff                                          | Minute 39                                      | 🚫 No                            |
| Debrief                                          | Minute 42                                      | 🚫 No                            |

## 🎬 Before presenting

1. Open the deck in presenter mode.
2. Confirm that speaker comments are not visible on the shared screen.
3. Stop on “Your walkthrough” before the candidate starts.
4. Keep the facilitator playbook open on a private screen, with the walkthrough
   probe table visible.
5. Use the playbook for probes, clarifications, and hints; use the deck only for
   shared context and requirement releases.

## 🤝🏽 Facilitation tips

- Let the candidate lead the walkthrough. Offer one quiet minute to trace the
  code first. Ask probes after, not during.
- Read task slides as written to keep the practice consistent.
- Pause after each reveal and invite questions.
- Do not advance to an extension only because the timer reached its gate.
- If the candidate is still working on search, keep later slides hidden.
- Keep the 90-second coaching slide behavioral. Do not disclose the solution.
- End implementation at minute 39 so the candidate can practice a handoff.

## 🛠️ Optional customization

You can change the title or company-neutral wording without changing the
exercise. Avoid adding:

- solution hints to opening slides;
- hidden edge cases;
- scoring language;
- claims that AI is allowed in the real interview.

The real interview policy must come from the recruiter or interviewer.
