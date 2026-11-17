# Quickstart and Validation

These instructions describe the planned implementation; the files and tests are not yet present. Run from the repository root after implementation, with Python 3 and a modern browser.

```powershell
py -m http.server 8000 --bind 127.0.0.1
```

Use `python3 -m http.server 8000 --bind 127.0.0.1` where `py` is unavailable. Open `http://127.0.0.1:8000/` for the game and `http://127.0.0.1:8000/tests/` for the planned browser test runner. Stop the server with Ctrl+C. The runner must show a nonzero test count, totals, and failed case IDs; zero tests is a failure.

1. In a fresh session, inspect the first briefing. Submit the wrong gateway decision for HOST-07 and verify the specific explanation, unchanged completion, and one attempt. Submit the VLAN 10 repair; verify a second attempt, resolution, explanation, and Next. Repeated Submit must not add progress.
2. For each incident, check independently recorded correct and plausible wrong cases from `StarterKit/SPEC.md`, including longest-prefix boundaries. Review source sections, assumptions, all briefings, hints, and explanations separately from the evaluator. Record reviewer and results.
3. Exercise all three help levels, level and final summaries, restart cancel and confirmation, and reload. Verify attempts and assistance are distinct, and help alone never completes an incident.
4. Supply a test fixture with one identifiable invalid incident; verify the explanation and Skip, zero attempts/completion for it, continued play, and incomplete level and session summaries. Test first, middle, and final slots. An unreadable document or missing slot ordering must show a load error instead of guessing a skip target.
5. Complete the full core flow using keyboard only and record browser and results. Check visible focus, announced text feedback, textual topology, a narrow window, and reduced-motion settings. Test a subpath if hosting is used.

Record each acceptance criterion as pass, fail, or not run with date, environment, and evidence in the README or linked verification note. The target first playthrough is 5–10 minutes, measured without imposing a timer. See [data model](data-model.md) and [contract](contracts/ui-and-evaluator.md).
