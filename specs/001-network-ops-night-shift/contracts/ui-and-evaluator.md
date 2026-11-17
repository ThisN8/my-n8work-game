# UI and Evaluator Contracts

## Evaluation

`evaluate(validatedIncident, selectedChoiceId)` returns `{ status, expected, reasonCode, evidence }` with status `correct`, `incorrect`, `invalid-input`, or `content-error`. The function is deterministic and side-effect free. An absent choice is invalid input; unknown choice or broken validated input is content error. `expected` is the canonical diagnosis and repair when safely derivable, otherwise null. `reasonCode` and structured evidence support accurate explanations; the UI cannot override the result using authored labels. Equivalent structured repairs with the same diagnosis are correct.

Validation precedes grading. A round with an unsupported tie, insufficient evidence, inconsistent state, multiple modeled faults or multiple distinct repairs becomes unavailable; Submit is disabled, an explanation identifies an authoring problem, and Skip is available. Separate unrecoverable document load errors from identifiable round errors as defined in [data-model.md](../data-model.md).

## Learner interaction

Briefing precedes each level. Incident screens show an alert, text-equivalent path, expected/observed evidence, test results, paired choices, Submit, progressive Help, and Restart. Feedback persists as readable text and is announced; correct feedback enables Next. Invalid input does not count. Unavailable slots show an explanation and Skip; skipping cannot count as a correct answer. Level and final summaries separately show solved counts, valid attempts, highest help used, and unavailable skips; incomplete levels and sessions are explicitly labeled.

All controls have accessible names, visible keyboard focus, and predictable order. Focus moves to the new view heading or feedback after transitions. Essential diagrams have equivalent text; no essential state uses color or motion alone. Reduced-motion settings do not delay information or interaction, and narrow layouts keep controls accessible.
