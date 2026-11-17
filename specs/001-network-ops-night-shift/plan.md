# Implementation Plan: Network Ops: Night Shift

**Branch**: `001-network-ops-night-shift` (Spec Kit feature identifier; no branch created) | **Date**: 2026-11-17 | **Spec**: [spec.md](spec.md)

**Input**: `specs/001-network-ops-night-shift/spec.md`; concrete cases and curriculum in `StarterKit/SPEC.md`.

## Summary

Build a self-contained, six-incident browser game where learners inspect network evidence, submit a paired diagnosis and remediation, and receive specific feedback. Authored structured snapshots feed a deterministic evaluator; session state tracks attempts, help, completions, and skipped unavailable incidents. Preserve the clarified ability to skip an invalid incident without grading it or claiming completion.

## Technical Context

**Language/Version**: HTML5, CSS, browser-native JavaScript modules (modern evergreen browsers).

**Primary Dependencies**: None at runtime; semantic HTML, browser DOM, optional inline SVG.

**Storage**: Authored JSON and in-memory session state; reload clears progress.

**Testing**: Dependency-free browser test runner, independent domain fixtures, and recorded manual interaction and source reviews.

**Target Platform**: Modern desktop browsers, typical laptop and narrow windows; static local HTTP serving or static hosting under a subpath.

**Project Type**: Static single-page educational game.

**Performance Goals**: Feedback and controls are immediately available without waiting for animations; target observed first playthrough 5–10 minutes with no timer. No unsupported numeric latency target is imposed.

**Constraints**: No backend, account, live device, runtime AI, external grading service, or persistence. Use relative paths; no required network after static assets load. 60-minute workshop budget is a scope target, not a waiver of checks.

**Scale/Scope**: One learner/session; three ordered levels, two authored incidents each; four supported discrepancy types.

## Constitution Check

| Principle | Design gate | Before / after design |
| --- | --- | --- |
| C1 Technical truth | Derive results from validated snapshots and documented rules; independently review all cases, source sections, briefings, and explanations; never grade invalid content. | Pass / Pass, subject to release evidence |
| C2 Decision learning | Brief each level, explain correct and wrong decisions, expose method, worked step, then solution. | Pass / Pass |
| C3 Honest progress | Count valid submissions once; separately record help, completions, and skips; require confirmation for reset. | Pass / Pass |
| C4 Access | Keyboard, focus, labels, text equivalents, narrow layout, reduced motion, and manual evidence required. | Pass / Pass, subject to actual checks |
| C5 Self-contained | Static authored content and local deterministic evaluation; no runtime service. | Pass / Pass |
| C6 Separation | Structured content, pure domain evaluator, separate UI and state; add a trial incident using data and checks only. | Pass / Pass, subject to demonstration |
| C7 Demonstrated done | Record actual pass/fail/not-run results, source review, fresh-start playthrough and runnable README; explicitly revise scope if needed. | Pass / Pass, subject to actual checks |

No constitution exception is proposed. Pass means the design addresses each gate, not that implementation or review has occurred.

## Project Structure

### Documentation (this feature)

```text
specs/001-network-ops-night-shift/
  spec.md  plan.md  research.md  data-model.md  quickstart.md
  contracts/ui-and-evaluator.md
  checklists/requirements.md
  tasks.md                     # future $speckit-tasks output
```

### Source Code (repository root, planned)

```text
index.html          # semantic shell
style.css           # layout, focus, reduced motion
main.js             # load and initialize
engine/rules.js     # pure domain evaluator
engine/content.js   # global and per-incident validation
engine/state.js     # transitions, attempts, help, skips
engine/feedback.js  # evidence-based explanations
ui/render.js        # views and text equivalents
ui/controls.js      # interactions and focus
data/levels.json    # editable curriculum, structured snapshots and sources
tests/index.html    # visible dependency-free runner
tests/rules.test.js, state.test.js, content.test.js
README.md           # actual instructions and recorded evidence
```

**Structure Decision**: Single static project; separate content, rules, state, and presentation, combining view modules if this simplifies the implementation without violating boundaries. See [data-model.md](data-model.md) and [contracts](contracts/ui-and-evaluator.md).

## Implementation approach

1. Hand-review expected correct, wrong, and prefix-boundary results independently of code; implement pure evaluation for access VLAN, host gateway, missing route, and incorrect selected-route next hop. Derive repairs from validated evidence, not choice positions or authored answer keys.
2. Implement one complete round, with briefing, labeled evidence, paired choices, invalid input, explanation, retry, success, and explicit Next.
3. Add six reviewed incidents, progressive help and session summaries. For incident 1.2, explicitly show an off-subnet destination and failed reachability, the intended and observed gateways, and a healthy local path; a wrong default gateway does not explain failure to reach an on-subnet destination. Validate each addressable incident independently; when invalid, display an authoring error and Skip. Skip records no attempt or completion; later rounds remain playable and affected level/session summaries say incomplete. A file that cannot be parsed or has no reliable level/round structure instead shows a load error and retry, since no safe ordered incident slots can be identified.
4. Complete keyboard, focus, live feedback, textual topology, responsive layout and reduced-motion work. Confirm restart/cancel, duplicate-submit protection, and all states including unavailable first, middle, and final incidents.
5. Record actual evidence, document local run/test commands, and perform a fresh-start and keyboard-only playthrough. Test static hosting under a subpath if publishing is undertaken.

See [quickstart.md](quickstart.md) for validation. Do not infer success from this plan; generated application files and tests do not exist yet.

## Complexity Tracking

No constitution violations or exceptions identified. Global structural failures remain load errors; recoverable incident-level faults are isolated to satisfy the skip decision without guessing missing ordering.
