# Research: Network Ops: Night Shift

**Date:** 2026-11-17  
**Status:** Planning decisions recorded; scenario and implementation verification remain release work.

## Decision: Model forwarding with longest-prefix selection

**Rationale:** For the supported single-route result, select the longest matching destination prefix; a /0 default is used only if no more specific entry matches. Reject unsupported equal-length ties rather than silently choosing one. The router must discard a packet if no route remains. [RFC 1812 §5.2.4.3](https://www.rfc-editor.org/rfc/rfc1812.html#section-5.2.4.3) specifies matching, longest-match pruning, and no-route behavior. The test for 192.168.40.255 is a prefix-selection test only and must not imply successful delivery to that subnet's broadcast address.

**Alternatives considered:** Choosing an authored route solely by ID or label would conceal mistakes; simulating equal-cost multipath, dynamic routing, or convergence exceeds the declared model.

## Decision: Diagnose only from authored authoritative evidence

**Rationale:** A ping uses ICMP echo and echo reply; its failure alone does not establish a unique root cause. [RFC 792, Echo or Echo Reply Message](https://www.rfc-editor.org/rfc/rfc792.html) describes the exchange. [RFC 1122 §3.3.1.1–3.3.1.2](https://www.rfc-editor.org/rfc/rfc1122.html#section-3.3.1.1) distinguishes local destinations from those forwarded through a gateway. [Cisco, Trunk and Access Ports and VLAN Traffic](https://www.cisco.com/c/en/us/td/docs/switches/datacenter/nexus9000/sw/7-x/interfaces/configuration/guide/b_Cisco_Nexus_9000_Series_NX-OS_Interfaces_Configuration_Guide_7x/configuring_layer_2_interfaces.html) describes access-port VLAN membership. Each incident must show its intended configuration and sufficient supporting observations; intent and healthy-component assumptions are authored premises, not facts proven by these references.

**Alternatives considered:** Grading from a ping result alone would overstate what the evidence proves. A full packet simulator would add unsupported protocol behavior and risk exceeding the workshop scope.

## Decision: Isolate invalid incidents and preserve incomplete progress

**Rationale:** The clarified specification permits skipping an unavailable incident without an attempt or completion. Validate each incident independently when the containing content can be safely parsed and ordered; mark its level and session incomplete. A file-wide parse failure or missing order/identity prevents safely identifying an incident to skip, so show a loading/content error and retry rather than inventing records. Do not grade invalid content.

**Alternatives considered:** Blocking the entire session for one identifiable invalid incident contradicts the accepted clarification. Treating a skip as a solve falsely reports mastery.

## Decision: Static, dependency-free browser application

**Rationale:** The constitution requires deterministic authored content, no backend or runtime model, and independently reviewable rules. Native HTML, CSS, JavaScript modules and local data meet those constraints. Serve static files over local HTTP for development: module loading and fetch can fail under `file://` because of browser origin rules ([MDN, Using modules on the web](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules/Modules_on_the_web)). Use relative paths for subpath hosting. No external service decides an answer.

**Alternatives considered:** A framework, bundler, backend, or runtime AI adds dependencies without a required benefit for six authored incidents.

## Decision: Native, text-first interactions

**Rationale:** Use semantic controls and keyboard focus, text equivalents for diagrams, a live region for feedback, and reduced-motion behavior. Live regions are intended for updates that occur while focus may be elsewhere ([WAI-ARIA 1.2, Live Region Attributes](https://www.w3.org/TR/wai-aria-1.2/#attrs_liveregions)). Actual keyboard, assistive-technology, narrow-window, and reduced-motion playthroughs remain required; these design choices are not a certification.

**Alternatives considered:** Color-only diagrams, pointer-only controls, and animation-dependent feedback fail the constitution's access requirements.

## Verification limitations and release gates

- Incident 1.2 must explicitly identify an off-subnet destination and failed reachability, plus the intended and observed default gateways and the healthy local path. A wrong default gateway does not explain failure to reach a destination on the host's own subnet; the present starter row does not name the destination. Do not ship an explanation that says changing the default gateway repairs an on-subnet gateway ping.
- For all six incidents, independently review displayed topology, configured and intended values, reachability assumptions, accepted and rejected decisions, and explanatory prose against source sections. The starter cases are drafts, not evidence that this review has occurred. The route next hops must be demonstrably reachable and return-path assumptions explicit where relevant.
- The constitution's simplifications and single-root-cause premise are required for the diagnosis; a standards citation does not prove that a particular fictional configuration is intended or that every alternative is impossible.
- Tests must use independently documented expected outcomes, include correct, wrong, ambiguous, boundary, skip, and duplicate-submit cases, and verify the authoring-error path. Record human review and browser checks as pass, fail, or not run; none has been executed by this planning research.
