# Network Ops: Night Shift · First playable specification

## The pitch

**Keep a pixel-art network alive through the night by inspecting operational evidence, diagnosing faults, and choosing the remediation that restores connectivity.**

The player is the network operator on the night shift in a fictional small enterprise network operations center. Each round shows an incident alert, a small network topology, relevant device state, and connectivity observations and asks the player to choose a paired diagnosis and remediation. A correct decision resolves the incident, restores the affected part of the network, and explains why the remediation works; an incorrect decision leaves the incident active and explains which evidence conflicts with the decision. The session summary is reached after all incidents are solved or unavailable incidents are skipped; any skip leaves the affected level and session incomplete.

## Who this is for

- **Learner:** networking learners who understand basic IP networking but have limited experience systematically troubleshooting faults.
- **Assumed knowledge:** recognize IPv4 addresses and subnet masks, understand that switches connect hosts within a LAN, routers provide paths between networks, VLANs separate Layer 2 networks, and ping success or failure provides limited connectivity evidence.
- **What the briefing teaches:** distinguish an observed symptom from a root cause; inspect evidence from the affected host outward; identify the first point where expected state and observed state differ; select a remediation that addresses that difference rather than merely a downstream symptom.
- **Why interaction helps:** novice troubleshooters can jump from a conspicuous symptom, such as a failed ping, directly to a familiar fix. The game makes visible that the same symptom can have different causes and that a valid diagnosis must account for all supplied evidence.
- **Session target:** 5–10 minutes for a first playthrough, with unlimited thinking time.

## Learning outcomes and evidence

| ID | After playing, the learner can… | The game asks them to… | Evidence of success |
| --- | --- | --- | --- |
| LO1 | Identify a network fault from direct operational evidence | Compare expected and observed interface, addressing, VLAN, route, and reachability state and select the fault | Correctly identifies and remediates a fault where the decisive evidence is shown directly |
| LO2 | Diagnose a root cause by correlating evidence from multiple points in a network path | Compare host, switch, router, and reachability observations before selecting a diagnosis and remediation | Chooses the remediation consistent with all relevant observations rather than one isolated symptom |
| LO3 | Distinguish a root cause from plausible symptoms and irrelevant observations | Evaluate competing explanations for a connectivity failure and choose the remediation that corrects the earliest demonstrated fault | Rejects at least one plausible symptom-level fix and resolves an incident containing non-causal evidence |

## The technical model

- **Rule being taught:** diagnose connectivity problems by comparing the intended network state with the supplied operational evidence along the relevant path. The accepted remediation must correct the demonstrated root cause and must not depend on assumptions unsupported by the challenge. A failed connectivity test establishes that communication failed; it does not by itself establish why it failed.
- **Context:** a simplified, vendor-neutral small enterprise IPv4 network using Ethernet, IPv4, ICMP, access VLANs, directly connected routes, and static/default routes.
- **Assumptions:** each round is a stable snapshot. Evidence displayed by the challenge is authoritative. Correctly configured components remain correct for the duration of the round. Links, devices, addressing, VLAN membership, and routes not identified by the evidence as faulty behave as described in the briefing. Exactly one modeled root cause explains each v1 incident.
- **Excluded behavior:** IPv6, dynamic routing protocols, STP faults, trunk negotiation, wireless, NAT/PAT, DNS, DHCP behavior, ACLs/firewalls, asymmetric routing, transient convergence, intermittent links, congestion, packet loss, latency troubleshooting, device hardware failure, and vendor-specific command syntax.
- **Authoritative references:** [RFC 1812 §5.2.4.3](https://www.rfc-editor.org/rfc/rfc1812.html#section-5.2.4.3) describes longest-prefix forwarding and the default route; [RFC 792, Echo or Echo Reply Message](https://www.rfc-editor.org/rfc/rfc792.html) describes ICMP echo and reply; [Cisco's Layer 2 interface guide, Trunk and Access Ports and VLAN Traffic](https://www.cisco.com/c/en/us/td/docs/switches/datacenter/nexus9000/sw/7-x/interfaces/configuration/guide/b_Cisco_Nexus_9000_Series_NX-OS_Interfaces_Configuration_Guide_7x/configuring_layer_2_interfaces.html) describes access ports and VLAN traffic. The access-port model here excludes voice VLANs and trunks. References support the networking rules; incident-specific intended states and single-fault assumptions are authored premises, not claims established by those sources. Review every shipped explanation before release.

These boundaries are stated to the learner in plain language: Night Shift shows a simplified, stable network snapshot. Diagnose only from the evidence on screen. There is one modeled root cause per incident, and nothing changes while you investigate.

If author data admits more than one distinct remediation, that incident is unavailable for grading until the ambiguity is removed. Multiple choices that express the same structured repair are equivalent and are accepted.

## The repeatable game loop

1. **Brief:** introduce one concept, its terms, and a worked example different from the challenge.
2. **Inspect:** show incident alert, compact topology, device/host observations, and connectivity results with all decision-relevant values visible.
3. **Choose:** the player selects one combined diagnosis-and-remediation choice and explicitly submits the decision.
4. **Explain:** display the result, the relevant values, and the rule that connects them.
5. **Retry or advance:** a wrong answer leaves the round playable; a correct answer enables Next.
6. **Reflect:** the level summary shows completed rounds, valid attempts, and assistance used.

**Worked interaction:** The operations console reports:

INCIDENT 01: WORKSTATION OFFLINE
 HOST-07 cannot reach its gateway.

The player sees:

Plain Text
HOST-07
IPv4: 192.168.10.27/24
Gateway: 192.168.10.1
 
Connection:
HOST-07 → SW-01 Gi0/7
 
Expected access VLAN: 10
Observed access VLAN: 20
 
Test:
HOST-07 → 192.168.10.1
Result: FAILED

Available diagnoses include:

HOST-07 is assigned to the wrong access VLAN.
HOST-07 has the wrong default gateway.
The router needs a new default route.

A plausible wrong move is “Change HOST-07's default gateway.”

Feedback:

Incident still active. HOST-07 already shows the expected gateway, 192.168.10.1. Changing a value that matches the intended state does not explain the observed mismatch. Compare the switch port's expected and observed VLAN.

The correct move is “Restore SW-01 Gi0/7 to access VLAN 10.”

Feedback:

Incident resolved. HOST-07 belongs to the 192.168.10.0/24 network and its switch port is expected to be in VLAN 10. The observed port state was VLAN 20. Restoring the port to VLAN 10 corrects the demonstrated mismatch and restores the modeled path to the gateway.

The affected link changes from an alert state to a healthy state and the workstation's incident indicator clears.

## Required stories and acceptance criteria

### US1 · Make and understand a decision — P1

As a learner, I want to apply the rule to visible evidence and understand the result.

- **AC1:** Given a fresh session, when I start, then I see the first briefing before answering a challenge.
- **AC2:** Given Incident 01 where HOST-07 has 192.168.10.27/24, gateway 192.168.10.1, expected access VLAN 10, and observed access VLAN 20, when I submit “Restore SW-01 Gi0/7 to access VLAN 10,” then the incident is marked resolved, the affected connection changes to its healthy state, and an explanation identifies the expected/observed VLAN mismatch as the root cause.
- **AC3:** Given that challenge, when I submit “Change HOST-07's default gateway,” then feedback states that the displayed gateway already matches the intended value, identifies changing a correct value as the mistake, completion stays unchanged, and I can retry.
- **AC4:** Given no diagnosis/remediation selection, when I submit, then guidance asks me to select an action and attempts/completion remain unchanged.

### US2 · Learn from help and finish the game — P1

As a learner, I want help when stuck and a clear view of my progress.

- **AC5:** The first help action reveals a method hint; the second reveals a worked step; the third reveals the solution. Record each highest help level reached per round; none submits or completes the round. Reopening help does not create another assistance event.
- **AC6:** Each valid submission counts as one attempt until the round is solved. Correct submission completes it once; repeated submission after success has no effect.
- **AC7:** A level completes after both of its rounds are solved. Next opens the following round or level; the final round opens a session summary.
- **AC8:** Restart asks for confirmation, then clears the current session and returns to the first briefing. Cancel preserves the session.

### US3 · Play with accessible controls — P1

As a keyboard user, I want to inspect the challenge, choose, submit, get help, and advance without a mouse.

- **AC9:** All core controls have visible focus and accessible names; keyboard interaction reaches every core action.
- **AC10:** Correct/incorrect feedback includes text, remains available to read, and is announced to assistive technology. Motion can be reduced without losing information.

## Version-one content

Default: **three levels, two rounds per level, six rounds total**. Use one new example per round and the same core mechanic throughout. Change these counts and AC7 together if you choose a smaller scope.

| Level | New concept | Prerequisite | Misconception to expose |
| --- | --- | --- | --- |
| 1 First Alerts | Identify a fault from a direct expected-versus-observed mismatch | Basic IPv4, switch, router, and VLAN concepts| Treating a failed ping as evidence that an arbitrary familiar component must be broken |
| 2 Path Correlation | Correlate host, switch, and router observations | Level 1 | Blaming a healthy component because it is near a failed ping |
| 3 Signal and Noise | Distinguish demonstrated root cause from a symptom or irrelevant evidence | Level 2 | Changing a route that is already selected, or treating unrelated evidence as causal |

**Progression:** sequential on first playthrough; retry without penalty. Completion requires a correct submission in every round. Hints remain available. No points, lives, timer, leaderboard, or streak mechanic in v1.

**Session behavior:** progress is held for the current page session; reload starts again. Saving across reloads is a stretch feature and must be specified before it is added.

## Cases the implementation must satisfy

Each row specifies one authored incident; all other path components are explicitly healthy, and each route next hop shown is reachable. The displayed intended state, observations, topology, choices, and tests must make these premises visible. Each choice pairs the stated diagnosis with its action. The wrong choice is rejected with the reason below; all six correct and wrong cases are required independent test fixtures.

| Round | Evidence and intended state | Correct decision | Plausible wrong decision and feedback |
| --- | --- | --- | --- |
| 1.1 | HOST-07 192.168.10.27/24, gateway 192.168.10.1; SW-01 port expected VLAN 10, observed 20; gateway ping fails | Port VLAN mismatch; set VLAN 10 | Change gateway: it already equals the intended 192.168.10.1. |
| 1.2 | HOST-08 192.168.30.8/24, expected gateway 192.168.30.1, observed 192.168.30.254; port and gateway interface are healthy; local gateway ping succeeds and off-subnet 192.168.40.5 fails; intended remaining path and return route are healthy | Gateway mismatch; set 192.168.30.1 | Change port VLAN: observed and expected VLAN 30 match. |
| 2.1 | HOST-09 192.168.10.9/24 reaches gateway 192.168.10.1; destination 192.168.40.5 fails; R1 has no matching route or default, intended route 192.168.40.0/24 via 10.0.0.2 | Missing route; install that route | Change host gateway: successful gateway ping and matching configuration support the local path. |
| 2.2 | HOST-10 192.168.20.10/24 has expected gateway 192.168.20.1; switch port expected VLAN 20, observed 30; another host on VLAN 20 reaches the gateway; HOST-10 cannot | Port VLAN mismatch; set VLAN 20 | Replace router gateway: the other host reaches it, and the port mismatch is direct evidence. |
| 3.1 | Destination 192.168.40.5; R1 has 0.0.0.0/0 via 10.0.0.1 and 192.168.40.0/24 via 10.0.0.3; intended next hop for the /24 is 10.0.0.2 | Wrong specific-route next hop; change /24 next hop to 10.0.0.2 | Change default route: /24 is the more specific match and is selected for this destination. |
| 3.2 | HOST-11 192.168.50.11/24, gateway 192.168.50.1 as intended; port expected VLAN 50, observed 60; unrelated HOST-12 has a failed ping on a separate network with no shared path | Port VLAN mismatch; set VLAN 50 | Change HOST-11 gateway: it matches the intended gateway; the other alert is unrelated. |

Boundary fixtures: with destination 192.168.40.255, the /24 in round 3.1 still matches as a prefix comparison (the fixture tests route selection only, not delivery to a broadcast address); destination 192.168.41.0 does not match that /24 and selects the default. With no matching route and no default, forwarding has no route; a default route is not a match if absent. Equal-length competing routes, incomplete evidence, inconsistent expected/observed values, multiple independent mismatches, unknown choice IDs, and multiple equally valid remediations are unsupported author data and must never be graded. Empty selection is invalid input, not an attempt. RFC 1812 §5.2.4.3 supports the route cases; the sources above support the other modeled behavior.

## Experience direction

- **Visual metaphor:** a pixel-inspired night-shift operations console with a labeled network path and incident indicators.
- **One memorable moment:** the affected connection changes from alert to healthy after a correct remediation, with a textual resolved label.
- **Always visible:** topology text, relevant addresses, expected and observed values, tests, choices, and feedback; dense evidence may scroll in a labeled region.
- **Feedback voice:** patient and specific; explain the observed choice before offering the next step.
- **Layout:** challenge first, action next, explanation beside or below it. Don't hide technical values behind hover-only interactions.

## Non-goals

No user accounts, multiplayer, backend, live infrastructure access, runtime AI, leaderboard, or level editor. No simulation of excluded protocols or behaviors listed in the technical model. Visual polish must fit the existing mechanic.

## Release evidence

All required acceptance criteria must have a recorded result. All six rounds and their explanations must be checked against the references. A teammate must complete the core flow using only the keyboard. The README must describe implemented behavior, exact run/test commands, and any remaining limits. Target a first playthrough of 5–10 minutes; verify with a timed observation without imposing a timer on the player.

---

