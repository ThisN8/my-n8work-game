# Feature Specification: Network Ops: Night Shift

**Feature Branch**: Not assigned  
**Created**: 2026-11-17  
**Status**: Draft  
**Input**: The first playable troubleshooting game described in `StarterKit/SPEC.md` and governed by the project constitution.

## Clarifications

### Session 2026-11-17

- Q: If one incident has invalid or ambiguous content, how should the game handle the other incidents? → A: Allow the learner to skip the invalid incident, while showing the session as incomplete.

## User Scenarios & Testing

### User Story 1 - Diagnose an incident (Priority: P1)

As a networking learner, I inspect a network incident, choose a paired diagnosis and remediation, and receive an explanation so I can learn from the decision.

**Why this priority**: This is the core learning interaction.  
**Independent Test**: Start a fresh session and complete the first incident, including one incorrect and one correct decision.

**Acceptance Scenarios**:

1. **Given** a fresh session, **When** the learner starts, **Then** a briefing teaches the first concept before the first incident.
2. **Given** HOST-07 at 192.168.10.27/24 with gateway 192.168.10.1 and SW-01 Gi0/7 expected in VLAN 10 but observed in VLAN 20, **When** the learner chooses the port VLAN mismatch and restores VLAN 10, **Then** the incident resolves, the connection is labeled healthy, and the explanation identifies the mismatch.
3. **Given** that incident, **When** the learner chooses to change the gateway, **Then** feedback explains that 192.168.10.1 already matches the intended gateway, suggests comparing the port VLAN, leaves completion unchanged, and permits retry.
4. **Given** no selection, **When** the learner submits, **Then** guidance requests a selection and attempts and completion do not change.

### User Story 2 - Use assistance and complete the shift (Priority: P1)

As a learner, I want progressive help, safe retries, and clear progress so I can finish without mistaking assistance for independent mastery.

**Why this priority**: The full learning loop depends on support and honest progression.  
**Independent Test**: Use all help levels, submit an incorrect and correct decision, advance through the remaining rounds, and restart.

**Acceptance Scenarios**:

1. **Given** an unsolved round, **When** help is requested successively, **Then** it reveals a method hint, a worked step, and a solution in that order; the highest help level is recorded without submitting or completing the round.
2. **Given** an unsolved round, **When** a valid choice is submitted, **Then** one attempt is counted; after a correct submission, repeated submission changes neither attempts nor completion.
3. **Given** two solved rounds in a level, **When** the learner selects Next, **Then** the level summary shows completed rounds, valid attempts, and assistance; Next continues to the next briefing or, after the final level, the session summary.
4. **Given** any session, **When** restart is requested, **Then** confirmation is required; cancel preserves the session and confirmation clears progress and returns to the first briefing.
5. **Given** an unavailable incident, **When** the learner selects Skip, **Then** the game advances to the next incident or summary, records no attempt or completion for that incident, and identifies the affected level and session as incomplete.

### User Story 3 - Play with accessible controls (Priority: P1)

As a learner using a keyboard, assistive technology, or a narrow window, I can inspect evidence, make decisions, use help, and progress through the game.

**Why this priority**: Access is part of the core experience.  
**Independent Test**: Complete a round with keyboard alone, inspect feedback using assistive technology, and repeat at a narrow window with reduced motion.

**Acceptance Scenarios**:

1. **Given** any game view, **When** using a keyboard, **Then** every core action is reachable in understandable order with a visible focus indicator and readable name.
2. **Given** a submission, **When** feedback appears, **Then** it is expressed in text, remains readable, and is announced to assistive technology.
3. **Given** reduced motion or a narrow window, **When** playing, **Then** no information depends on animation or color, diagrams have text equivalents, and decision controls remain accessible.

### Edge Cases

- A repeated successful submission cannot award progress again; Next is an explicit action.
- Unsupported, incomplete, inconsistent, or ambiguous incident content is unavailable for grading and produces an authoring-error explanation without counting an attempt. The learner can skip it and continue; skipping never marks it or its level complete, and the final summary identifies the session as incomplete.
- Equivalent choices expressing the same diagnosis and repair are accepted; distinct equally valid repairs make the incident unavailable until ambiguity is resolved.
- Reload starts a fresh session. Help and retries carry no penalty. A failed ping alone does not identify a cause.
- For a route lookup, 192.168.40.255 matches 192.168.40.0/24 as a prefix comparison only; 192.168.41.0 does not and selects an available default. No matching route and no default means no route.

## Requirements

### Functional Requirements

- **FR-001**: The game MUST present three sequential levels of two distinct incidents each, using one decision mechanic, with a briefing before each level.
- **FR-002**: Each incident MUST display its alert, text-equivalent topology, relevant host and device observations, intended values, and connectivity tests needed to reach a unique supported decision.
- **FR-003**: The learner MUST select and explicitly submit a combined diagnosis and remediation.
- **FR-004**: A valid correct submission MUST resolve the round once, explain the evidence and rule, show a textual healthy state, and enable Next; an incorrect submission MUST explain the conflict and a next step and allow retry.
- **FR-005**: Empty or malformed input MUST provide guidance without incrementing attempts; valid submissions before resolution each count once.
- **FR-006**: Help MUST reveal a method, worked step, and solution in that order, record the highest level reached per round, and never itself complete a round.
- **FR-007**: A level completes only after both rounds are solved; explicit Next after its last round opens its summary, then the next level or final session summary. An unavailable round may be skipped to continue; skipped rounds, their levels, and the session remain incomplete. Summaries MUST separately report completion, attempts, assistance, and skipped unavailable rounds.
- **FR-008**: Restart MUST require confirmation; cancel preserves progress and confirmation clears the session. Reload starts fresh.
- **FR-009**: Grading MUST follow documented networking rules and displayed incident evidence; invalid or ambiguous authored content MUST be unavailable for grading with a visible explanation and a Skip action that does not count as an attempt or completion.
- **FR-010**: Controls MUST support keyboard use, visible focus, accessible names, text feedback announced to assistive technology, diagram text equivalents, narrow windows, and reduced motion without delaying controls or feedback.
- **FR-011**: The game MUST use authored, deterministic content and operate without accounts, live devices, or a service that decides answers. No lives, points, countdown, speed bonus, leaderboard, or penalty for assistance or retry is included.
- **FR-012**: The learner MUST be told the simplified stable-snapshot model and its assumptions before applying them; all six incidents and their explanations MUST be reviewed against documented sources before release.

### Key Entities

- **Level**: A concept briefing and two ordered incidents, with its learning outcome and summary.
- **Incident**: An alert, topology, observations, intended state, connectivity tests, decisions, help, and references describing one modeled root cause.
- **Decision**: A diagnosis paired with a proposed remediation; its correctness follows from the incident evidence.
- **Session progress**: Current position, completed incidents, valid attempts, and highest assistance level reached per incident.

## Success Criteria

### Measurable Outcomes

- **SC-001**: All six incidents accept the independently reviewed correct decision and reject their documented plausible wrong decision with relevant feedback.
- **SC-002**: A learner can finish all three levels in a target 5–10 minute first playthrough, measured by observation, without an imposed time limit.
- **SC-003**: A teammate completes the full core flow using only a keyboard; all required controls, focus states, feedback, and diagram equivalents are available.
- **SC-004**: In each of six rounds, help can reach the solution without marking the round complete, and summaries distinguish assistance from attempts and completion.
- **SC-005**: Every required acceptance scenario has a recorded pass, fail, or not-run result; all six incident explanations receive source review before release.

## Assumptions

- Learners know basic IPv4 addressing, subnet masks, switches, routers, VLANs, and the limited meaning of ping results.
- Each incident is a stable authoritative snapshot with exactly one modeled root cause; components not identified as faulty are healthy, and addressing is correct unless explicitly identified as the fault.
- The model covers vendor-neutral Ethernet, IPv4, ICMP, access VLANs, and static/default routing. IPv6, dynamic routing, wireless, NAT, DNS, DHCP, ACLs, convergence, loss, performance, and vendor-specific command behavior are outside scope.
- Content is self-contained. The first release has no multiplayer, runtime AI, live infrastructure access, level editor, or progress persistence across reloads.
- The six incident cases, learning outcomes, references, and visual direction in `StarterKit/SPEC.md` define this feature's acceptance evidence. Their technical premises must be made visible to the learner, and the cases must be independently reviewed before release.
