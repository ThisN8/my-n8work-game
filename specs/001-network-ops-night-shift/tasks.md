# Tasks: Network Ops: Night Shift

**Input**: `specs/001-network-ops-night-shift/` design documents and `StarterKit/SPEC.md` incident cases.

**Organization**: Tasks are ordered by shared foundation, user story, then cross-cutting release evidence. All three stories are P1. The constitution and specification require independently recorded expected results and acceptance verification; tests below are required evidence, not a claim that checks have passed.

## Phase 1: Setup

- [X] T001 Create the semantic static page shell and relative module entry point in `index.html` and `main.js`.
- [X] T002 [P] Create the dependency-free browser test runner in `tests/index.html`; report totals and failed case IDs, and treat zero discovered tests as failure.
- [X] T003 [P] Establish baseline layout and visible focus styles in `style.css` without external runtime dependencies.

## Phase 2: Foundational prerequisites

- [X] T004 Record independently reasoned correct, plausible-wrong, and prefix-boundary expected results for all six incidents in `tests/fixtures/expected-cases.md`, citing rule sections and marking source review status honestly; for incident 1.2 specify an off-subnet destination, failed reachability, intended/observed gateways, and healthy local path.
- [X] T005 Define editable content structure in `data/levels.json`: document `schemaVersion`, unique sources with title, URL, section and claim; three ordered unique levels each with two ordered unique incident slots, title, difficulty, learning outcome, briefing and source IDs.
- [ ] T006 Implement global and per-incident validation in `engine/content.js`: valid IPv4 addresses, canonical network/prefix pairs (prefix 0–32), VLAN IDs (1–4094), unique IDs, required evidence, source references, choices, and three ordered help entries; isolate identifiable invalid slots and return a load error for unreadable documents or unreliable slot identity/order.
- [X] T007 Implement initial session model in `engine/state.js`: current level/slot/view and per-incident attempts, highest help level (0–3), status (`unsolved`, `solved`, `unavailable`, or `skipped`), and error; keep all state in memory.
- [ ] T008 Connect content loading, validation, loading failure and retry in `main.js`; use relative URLs and never grade an invalid incident.

## Phase 3: User Story 1 — Diagnose an incident (P1)

**Goal**: Show a briefing and evidence, accept a diagnosis and repair, and explain correct and wrong decisions.

**Independent test**: In a fresh session submit no choice, then the wrong gateway and correct VLAN 10 choices for HOST-07; verify guidance, evidence-specific feedback, retry, correct completion, and Next.

- [X] T009 [P] [US1] Add independent correct, wrong, equivalent-choice, empty-input, route prefix boundary and no-route cases to `tests/rules.test.js` using `tests/fixtures/expected-cases.md` rather than evaluator-generated expectations.
- [ ] T010 [P] [US1] Add invalid-address, duplicate-ID, inconsistent-evidence, ambiguous-repair, missing-source, unsupported-tie, and unrecoverable-document cases to `tests/content.test.js`.
- [X] T011 [US1] Populate the first incident in `data/levels.json` with the HOST-07 topology, expected/observed VLAN and gateway, reachability observations, combined choices, distinct worked briefing, ordered help and source records.
- [ ] T012 [US1] Implement pure `evaluate(validatedIncident, selectedChoiceId)` in `engine/rules.js`, deriving the unique diagnosis and repair for VLAN, gateway, missing-route and selected-route-next-hop faults; select the longest matching prefix with /0 default, reject unsupported ties, and return status, expected result, reason code and structured evidence.
- [ ] T013 [US1] Enforce `data-model.md` incident constraints in `engine/content.js`: a single modeled root cause, sufficient intended/observed evidence and reachable intended path, valid targets, no distinct competing repairs, and structured solution agreement; reject unsupported or unprovable cases instead of guessing.
- [ ] T014 [P] [US1] Generate evidence-based correct and choice-specific wrong explanations with a useful next step in `engine/feedback.js`; do not let authored labels override evaluator reasoning.
- [X] T015 [US1] Render the briefing, incident alert, textual topology, displayed evidence, paired choices, submission guidance, persistent feedback and healthy state in `ui/render.js`.
- [X] T016 [US1] Wire selection, valid and empty submission, retry, correct resolution and explicit Next in `ui/controls.js` and `engine/state.js`; count valid submissions once and prevent repeat awards after success.
- [ ] T017 [US1] Run the first-incident and domain/content checks via `tests/index.html` and record observed pass/fail/not-run evidence in `tests/verification.md`.

## Phase 4: User Story 2 — Use assistance and complete the shift (P1)

**Goal**: Support the full six-round session, progressive help, safe restart, honest summaries, and unavailable-incident skipping.

**Independent test**: With a validated incident fixture, use all three help levels, exercise wrong/correct and duplicate submissions, skip unavailable first/middle/final slots, reach summaries, and cancel/confirm restart.

- [ ] T018 [P] [US2] Add transition cases for attempt counting, help 0–3, duplicate submission, level/final summaries, restart/cancel, reload, and skipped first/middle/final invalid slots to `tests/state.test.js`.
- [X] T019 [US2] Add the remaining five incident snapshots and three level briefings to `data/levels.json` from `StarterKit/SPEC.md`, including explicit off-subnet evidence for 1.2, intended paths, healthy components, reachable next hops and return-path assumptions; include source IDs, choices and progressive help.
- [X] T020 [US2] Extend `engine/state.js` for method hint → worked step → solution, highest assistance level, ordered progression, two-solved-incident level completion, confirmed restart, and fresh reload.
- [X] T021 [US2] Implement unavailable-slot Skip in `engine/state.js` and `ui/controls.js`: no attempt or completion, advance to the next slot or summary, and keep the affected level and final session incomplete; preserve global load-error behavior when slots cannot be identified.
- [X] T022 [US2] Render help, unavailable explanation and Skip, confirmation, level summaries and final session summary in `ui/render.js`, separately showing solved incidents, valid attempts, highest help, skipped incidents and incomplete status.
- [ ] T023 [US2] Run `tests/state.test.js` through `tests/index.html` and validate complete and skipped sessions plus restart and reload; record actual results in `tests/verification.md`.

## Phase 5: User Story 3 — Play with accessible controls (P1)

**Goal**: Make the complete core flow usable by keyboard, assistive technology, and at narrow widths with reduced motion.

**Independent test**: Complete a representative round using keyboard alone, verify announced text feedback and text-equivalent topology, then repeat at a narrow width with reduced motion.

- [X] T024 [P] [US3] Implement responsive layout, readable labels, visible focus, scrollable labeled evidence and `prefers-reduced-motion` handling in `style.css` without delaying feedback or hiding controls.
- [ ] T025 [US3] Add semantic accessible names, text-equivalent diagrams, persistent live-region feedback, and predictable focus movement to new views or feedback in `index.html`, `ui/render.js` and `ui/controls.js`.
- [ ] T026 [US3] Perform a keyboard-only full-session playthrough plus assistive-technology feedback, narrow-window and reduced-motion checks; record browser, viewport, environment, and actual results in `tests/verification.md`.

## Phase 6: Polish and cross-cutting evidence

- [ ] T027 Independently review all six incidents, briefings, help and explanations against cited source sections and fictional path premises; document reviewer, correct/wrong/boundary outcomes, and any failures in `tests/verification.md`.
- [ ] T028 Demonstrate content/logic separation by adding a trial incident using only an authored-data change and corresponding checks, tracing its evaluation without modifying `engine/rules.js`; document the experiment and remove the trial from shipped `data/levels.json` after verification.
- [ ] T029 Run the complete `specs/001-network-ops-night-shift/quickstart.md` checks, including a fresh-start playthrough, optional subpath hosting if used, and observed 5–10 minute target; record each acceptance criterion as pass, fail, or not run in `tests/verification.md`.
- [ ] T030 Write `README.md` with actual run/test commands, model assumptions and exclusions, source references, controls, progress/reset/skip behavior, implemented scope and honest verification results; align any changed scope across `specs/001-network-ops-night-shift/spec.md` and `specs/001-network-ops-night-shift/plan.md`.

## Dependencies & Execution Order

- Phase 1 → Phase 2 → US1 → US2 → US3 → Phase 6. US2 integrates the round and state machinery from US1; US3 exercises the complete interaction. Each story's acceptance checks can use the indicated fixture or completed preceding increment.
- T004 supplies reviewed expected fixtures to T009 and the later source review; T005 precedes content validation and incident authoring. T012–T013 precede integration in T016. T019–T022 precede the full state and accessibility playthroughs.
- Tasks marked `[P]` have separate files and no dependency on another unfinished task within their parallel group. Integrate shared-file work sequentially.

### Parallel examples

- Setup: T002 and T003 can proceed together after T001.
- US1: T009 and T010 can be prepared together after T004–T008; T014 can proceed alongside T012–T013 once the result contract is understood, then integrate after both are complete.
- US2: T018 can be prepared while T019 is authored after US1; T020–T022 then integrate sequentially because they share session and UI files.
- US3: T024 can proceed independently of T025 after US2; T026 follows both.

## Implementation Strategy

Deliver setup, foundation and US1 as the first demonstrable slice, then validate it before expanding. This is an MVP checkpoint, not the complete first release: all three P1 stories, six reviewed incidents, and cross-cutting evidence remain required. Continue through US2, US3 and release checks; if the workshop budget is exceeded, explicitly change agreed scope and affected artifacts instead of silently dropping requirements.
