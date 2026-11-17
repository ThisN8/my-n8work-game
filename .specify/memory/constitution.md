<!--
Sync Impact Report
Version change: unversioned scaffold → 1.0.0 (initial project constitution)
Modified principles: template placeholders → C1–C7 from StarterKit/CONSTITUTION.md
Added sections: Core Principles, Technical Model and Release Scope, Development Workflow, Governance
Removed sections: unfilled template placeholders
Follow-up: TODO(RATIFICATION_DATE): confirm original adoption date; remove this report before commit.
-->
# Network Ops: Night Shift Constitution

## Core Principles

### C1 · Technical truth is a release requirement

The game MUST NOT reward a technically incorrect answer. Grading MUST be reproducible from a documented rule and challenge inputs. Unsupported or ambiguous content is an authoring error: explain that the challenge is unavailable and prevent grading it. Fiction and animation may illustrate a rule but MUST NOT change it. Record independent expected results for hand-checked correct, incorrect, and boundary cases, a source link and section for each networking rule, and review of all shipped briefings and explanations.

### C2 · Every round teaches through a decision

The player's main action MUST exercise the target skill. Introduce each concept before testing it and display the values needed to reason about the answer. Wrong answers MUST explain the specific mistake and a useful next step; correct answers MUST explain why they work. The learning sequence is direct fault identification, correlation across devices to determine root cause, and distinguishing root cause from symptoms while choosing a remediation. Hints MUST reveal a method first, then a worked step; worked solutions MUST be available and recorded as assistance, never independent mastery. A teammate MUST be able to connect each action to a learning outcome and explain learning from a deliberately wrong choice.

### C3 · Progress is honest and retry is safe

A round completes only on a valid, correct submission. Incorrect answers leave it available; empty or malformed submissions provide guidance without counting as a wrong attempt. Repeated Submit actions MUST NOT award progress twice. The first version has no lives, countdown, speed bonus, or penalty for hints and retries. Show completed rounds, attempts, and assistance separately; completion is not proof of independent mastery. The specification MUST define advancement, level completion, and session reset. Verify wrong answers, duplicate submissions, hints, completion, and reset against it.

### C4 · Access is part of the core game

All core actions MUST be keyboard usable with visible focus, readable labels, and understandable order. Explain success and failure in text as well as color and provide text equivalents for essential diagrams. Respect reduced-motion preferences; animation MUST NOT delay feedback or controls. Support typical laptop and narrow browser windows; dense data may scroll in a labeled container without hiding action buttons. Record keyboard-only, narrow-window, and reduced-motion checks actually performed; do not claim full accessibility certification.

### C5 · The first version is deterministic and self-contained

Ship authored content and deterministic domain logic without an account, backend, live device connection, runtime model, or API key. AI-generated development contributions receive the same review as other work. Runtime AI tutoring, generated questions, and free-text AI grading require an explicit constitution, specification, and verification change before implementation. Demonstrate play in a clean browser session using project static files without an external content service deciding answers.

### C6 · Content and logic can be reviewed separately

Store level content, hints, sources, and difficulty in editable data. Separate domain rules from rendering and progress tracking, and validate data before presenting a challenge. Feedback MUST agree with evaluator reasoning; an authored answer key MUST NOT silently override the rule engine. Adding a challenge using the existing mechanic MUST require only a data change and its checks, not a new scoring path or screen implementation. Demonstrate by inspecting level data, tracing an answer, and adding a trial challenge without changing the engine.

### C7 · Done is demonstrated

Ship only agreed scope. Requirements, plan, tasks, and README MUST describe the same game. A feature is complete only when its acceptance criteria pass and actual status is recorded; a screenshot, task checkbox, or assertion of completion is insufficient. Reduce scope explicitly when time is short; fix incorrect teaching and broken core interactions before visual effects. Keep failed and untested checks visible. Provide reproducible run and test commands, recorded verification results, a fresh-start playthrough, and a README another attendee can follow.

## Technical Model and Release Scope

The first release uses one core mechanic, three short levels, a browser, and a 60-minute workshop build. Change the budget only by updating agreed scope. The model is a simplified small enterprise IPv4 network using vendor-neutral Ethernet, IPv4, ICMP, VLAN, and static/default-routing concepts. Device configurations and displayed operational state are authoritative snapshots; links not identified as failed are operational; displayed addressing is correct unless explicitly identified as the fault. Exclude IPv6, dynamic routing, wireless, NAT, convergence behavior, packet loss, performance troubleshooting, vendor-specific syntax, and failures absent from the supplied evidence. State simplifications in briefings and the README wherever they affect player conclusions.

## Development Workflow

Specify the learner outcomes, supported model, acceptance criteria, and independent cases before building. Plan and tasks MUST preserve these principles. Review domain cases and source references, then demonstrate the core interaction, accessibility checks, and fresh-start playthrough. Record pass, fail, or not-run results honestly, and update the README to reflect actual behavior. Resolve scope changes explicitly across affected artifacts.

## Governance

This constitution governs project practices and takes precedence over conflicting plans or implementation choices. Material changes require a recorded reason, updates to the affected specification and plan, and a rerun of analysis. Resolve conflicts openly; do not weaken a principle merely to make an implementation pass. Review changes and releases for compliance against each applicable principle and its evidence. Version governance changes semantically: MAJOR for incompatible removals or redefinitions, MINOR for added principles or materially expanded guidance, and PATCH for clarifications or wording fixes.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): confirm original adoption date | **Last Amended**: 2026-11-17
