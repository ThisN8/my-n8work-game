# Network Ops: Night Shift · Implementation plan

## Build target

Implement the specification for Network Ops: Night Shift within the 60-minute workshop build block. This is a plan, not a claim of implementation. First deliver one complete round with correct grading, explanatory feedback, retry, and advance. Then add content and polish through the same implementation.

**Hardest behavior to get right:** independently derive the unique supported mismatch and its repair from structured evidence, including longest-prefix selection, while rejecting ambiguous author data and preventing duplicate progress.

**First evidence we'll check:** round 1.1: expected VLAN 10 versus observed 20 makes restoring SW-01's port to VLAN 10 correct; changing the already-correct gateway is wrong.

## Constitution check

- C1/C6: derive answers from validated evidence and structured actions; review each source, fixture, briefing, and explanation independently. Reject unsupported or ambiguous content.
- C2/C3: brief before each level, provide method hint, worked step, then solution, count valid attempts and assistance separately, and advance only after correct submission and explicit Next.
- C4: keyboard, focus, text equivalents, narrow layout, and reduced motion are release checks.
- C5: static authored data and local deterministic logic only; no account, service, or runtime AI.
- C7: record actual results and align the README and tasks with scope. If time runs out, explicitly revise scope rather than silently omit checks.

These gates remain applicable after design; no exceptions are proposed.

## Stack and serving

- Semantic HTML, CSS, and native JavaScript modules. No framework, bundler, backend, or runtime model.
- DOM controls plus SVG only where a diagram helps teach the concept. No rendering dependency by default. If choosing Three.js or another library, record its version, loading strategy, reason, and accessible alternative here before implementation.
- `data/levels.json` for authored content; load it over HTTP using a relative URL.
- In-memory session state. Reload starts a fresh session, as specified. No persistence in v1.
- Static hosting, including a repository subpath such as GitHub Pages. Use relative asset paths and case-correct filenames.

Preview from the repository root after implementation creates `index.html`:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open **http://127.0.0.1:8000**. On Windows use `py` in place of `python3`. Native modules and JSON fetching need a web server; opening the HTML with `file://` is not the supported run path. [MDN reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).

## Proposed files and responsibilities

```text
index.html                   Semantic page shell and module entry point
style.css                    Layout, focus, feedback states, reduced motion
main.js                      Load → validate → start; render loading/errors
engine/
  rules.js                   Pure domain evaluation; no DOM or progress changes
  content.js                 Validate authored level data and source references
  state.js                   Session transitions, attempts, completion, restart
  feedback.js                Explain structured evaluation results
ui/
  render.js                  Briefing, challenge, feedback, and summary views
  controls.js                Input events and keyboard/focus behavior
data/
  levels.json                Briefings, challenges, hints, source records
tests/
  index.html                 Browser test runner with visible pass/fail summary
  rules.test.js              Independent expected results from the specification
  state.test.js              Attempts, assistance, duplicate submit, progression
  content.test.js            Invalid/missing/ambiguous authored data
README.md                    Actual run instructions, behavior, and evidence
```

Use `data/` and `tests/` at the root alongside `engine/` and `ui/`. Keep modules small enough to understand; combine view files if separate files add no value.

## Data contract

Define one document containing `schemaVersion`, `sources`, and `levels`. Each level has a unique ID, title, learning outcome, briefing, source IDs, and ordered rounds. Each round has a unique ID, domain-specific challenge, stable choice IDs where applicable, and ordered hints.

**Domain fields:** Each round has a topology and observations as structured endpoint/device IDs, IPv4 addresses, prefixes (0–32), expected and observed values, and reachability results. Supported discrepancy types are access VLAN (integer 1–4094), host gateway (IPv4 address), missing route, and wrong selected-route next hop. Route entries contain canonical network/prefix and next-hop IPv4; a missing route case includes the intended route. Every incident identifies its destination, intended path and healthy components so the single-fault premise is checkable. The content also supplies human-readable evidence labels, a method hint, a worked step, a worked solution, choices, and source IDs. Display all values used for grading.

**Choice representation:** one stable choice ID per combined diagnosis and remediation, with a structured action `{kind, targetId, value}` and a diagnosis kind. For a route, value contains the canonical prefix and next hop; for a VLAN or gateway it is the intended VLAN or IPv4 address. Text is presentation only. Different IDs with identical supported corrective actions are equivalent and accepted; a mismatched diagnosis or action is wrong.

**Validation rules:** reject missing fields, duplicate IDs, invalid IPv4/prefix/VLAN values, noncanonical route prefixes, missing source records, inaccessible intended next hops, inconsistent reachability or evidence, unsupported discrepancy types, equal-length route ties, multiple mismatches, no valid repair, or multiple distinct valid repairs. Validate structured solution data against the computed result and manually review prose hints and explanations; authored labels or answer keys do not override it. Reject a choice pointing to an unknown target. An unknown submitted choice ID is a content error; an absent selection is invalid input. If uniqueness or consistency cannot be established within this deliberately limited model, reject the round instead of guessing.

The loader validates the content file before starting. If an individual incident is invalid but its ordered slot is identifiable, show a useful incident error and allow Skip without an attempt or completion; the affected level and session remain incomplete. If the document cannot be parsed or its incident slots cannot be identified reliably, show a load error and retry. Briefings and hints reference source records with a title, URL, section, and supported claim. Fixed wording and per-level content live in data; numeric reasoning may be assembled from evaluator results.

Do not invent a universal quiz schema that discards the domain's real structure. Adapt the [worked example's plan](https://github.com/automateyournetwork/NAF_AC6/blob/main/WORKSHOP/LAB/Examples/PrefixQuest/PLAN.md) only if it fits your game.

## Domain evaluation contract

```text
evaluate(challenge, answer) → {
  status: "correct" | "incorrect" | "invalid-input" | "content-error",
  expected: domain-specific canonical result, or null,
  reasonCode: stable identifier for the rule/misconception,
  evidence: structured values used to explain the decision
}
```

- This is a pure function: same inputs, same result; no DOM, timer, network, random choice, or score changes.
- Compute the result by validating the snapshot, comparing the supported expected and observed fields along the supplied affected path, and requiring exactly one actionable discrepancy. For a route incident, select the unique matching installed route with the longest prefix for the destination; /0 matches all IPv4 destinations. No matching route yields a missing-route discrepancy only when the specified intended route matches the destination. A selected route whose next hop differs from its stated intended next hop yields a wrong-next-hop discrepancy. Derive the canonical diagnosis and repair from that discrepancy, then compare both structured parts of the submitted choice. Do not infer a fault from a failed ping alone. The UI must not choose the correct answer by position, label, or animation destination.
- Distinguish a learner's incorrect decision from invalid input and broken authored content.
- Define accepted equivalent answers and reject unsupported ambiguity explicitly.
- Expected answers in tests come from independently reviewed cases. Don't calculate them by calling the same evaluator being tested.

**Feedback example:** round 1.1, changing the gateway yields `healthy_value_changed`: “Incident still active. HOST-07 already shows the expected gateway, 192.168.10.1. Changing a value that matches the intended state does not explain the observed mismatch. Compare the switch port's expected and observed VLAN.” Feedback for each other wrong choice must identify the conflicting evidence and a useful next step.

## Session transitions

```text
loading → briefing → awaiting-answer
                     ├─ invalid input → guidance → awaiting-answer
                     ├─ incorrect → feedback → retry same round
                     └─ correct → feedback → Next → next round/briefing/summary
invalid incident → unavailable explanation → Skip → next incident or summary (incomplete)
unrecoverable loading/content failure → error screen → retry loading
confirmed Restart → fresh first briefing
```

The state module owns attempts, assistance, completed round IDs, current round, and current view. Selection and hints do not submit an answer. Count valid submissions only while a round is unsolved. Disable Submit after success; guard in state logic as well. Advance only through explicit Next. Restart requires confirmation; cancellation changes nothing.

## Interaction and visual direction

Translate the pixel-inspired night-shift operations console into a compact challenge area, labeled controls, and a persistent explanation area. Use a clear type hierarchy and one consistent visual language. On success the affected link changes from alert to healthy with an accompanying text label; motion is optional and never delays feedback.

Use native controls where possible, move focus deliberately after screen changes, and announce feedback through a live region. Respect `prefers-reduced-motion`. Display textual values alongside diagrams. A learner must not need animation, color vision, pointer precision, or hover to reason about the answer.

## Implementation order

| Slice | Deliverable | Evidence before the next slice |
| --- | --- | --- |
| 1 · Prove the rule | Pure evaluator plus the spec's correct/wrong/boundary cases | Expected results pass independently of the UI |
| 2 · Complete one round | Briefing, challenge, feedback, retry, Next | One correct and one wrong path work in the browser |
| 3 · Add the curriculum | All scoped levels, validation, hints, session summary | Each shipped round agrees with its reviewed cases |
| 4 · Make it usable | Keyboard/focus, reduced motion, narrow layout, clear error states | Manual checks are recorded |
| 5 · Package the result | README, screenshot if available, optional hosting | Another attendee can run and explain the game |

Generate `tasks.md` from these slices and the actual acceptance criteria. Do not create a large task tree for hypothetical stretch features.

## Verification and reporting

Implement a dependency-free browser test runner at `tests/index.html` that imports the pure modules, runs all assertions, and shows totals plus failed case IDs. It must report zero discovered tests as failure. Open **http://127.0.0.1:8000/tests/** after starting the same server.

| Check | What must be established |
| --- | --- |
| Domain cases | Correct, plausible wrong, and boundary outcomes for the supported model |
| Input/content failures | Invalid submissions do not consume attempts; malformed content cannot be graded |
| State transitions | Retry, hints, duplicate submission, level completion, final summary, restart/cancel |
| Source review | Each briefing and explanation agrees with the cited technical rule |
| Browser playthrough | Fresh start to summary, keyboard-only core actions, readable feedback |
| Layout/motion | Typical laptop, narrow viewport, reduced motion |
| Hosting, if used | Assets and data load under the published repository path |

For each required acceptance criterion, record **pass / fail / not run**, the date, environment, and evidence in the README or a linked verification note. The test runner checks code behavior; a human still reviews the teaching content and actual interaction.

## Scope controls

No persistence, multiplayer, runtime AI, procedural scenario generator, editor, or audio in v1. If time runs short, propose the smallest coherent reduction to the specification and update the tasks. Do not hide skipped checks or silently weaken correctness.
