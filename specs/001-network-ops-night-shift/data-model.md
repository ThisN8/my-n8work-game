# Data Model: Network Ops: Night Shift

## Authored content

- **Content document**: `schemaVersion`, source records, and three ordered levels. Global shape must identify unique levels and two ordered, stable incident slots per level; if it cannot, no safe skip target exists and loading fails.
- **Source**: unique ID, title, URL, section, and supported claim. Source IDs used by briefings, incidents, and hints must resolve; human review establishes whether prose and claims agree.
- **Level**: unique ID, title, difficulty, learning outcome, briefing with a distinct worked example, source IDs, two ordered incident slots.
- **Incident slot**: stable unique ID and either a validated incident or an unavailable result with a safe error description. Broken optional or incident-specific fields invalidate only that identifiable slot. Duplicate slot IDs or missing ordering invalidate the containing document, since progress cannot be assigned reliably.
- **Incident**: alert, labeled topology and text equivalent, affected path, intended and observed states, reachability observations, one modeled fault, choices, three ordered help entries, and source IDs. Supported fault families: access VLAN, host gateway, missing route, selected-route next-hop mismatch.
- **Evidence**: device/port identities, valid IPv4 addresses, canonical network/prefix pairs (prefix 0–32), expected and observed VLAN IDs (1–4094), route/next-hop information, and test outcomes as applicable. State authoring premises explicitly, including intended path and healthy components. Declared evidence must be sufficient to establish one root cause and repair within the supported model.
- **Choice**: unique ID within incident; diagnosis kind and action `(kind, target, value)`, plus readable label. Different choices with equivalent diagnosis and repair are accepted. No text or position acts as an answer key.

## Validation and evaluation

Reject missing fields, invalid IPv4 or prefixes, noncanonical networks, invalid VLANs, unknown targets or sources, inconsistent modeled evidence, unsupported route ties, multiple faults, and zero or multiple distinct supported repairs. Prose is reviewed by a person; structured solution references must agree with computed results. If consistency or uniqueness cannot be established by the limited model, do not grade that incident. Check route matches by destination prefix, select the unique longest match, and use /0 as default. Never infer a fault from ping failure alone. See [contract](contracts/ui-and-evaluator.md) for result shape and source premises.

## Session state and transitions

- **Session**: current level/slot/view; per-incident attempt count, highest help level (0–3), status (`unsolved`, `solved`, `unavailable`, or `skipped`), and any error; no persistence.
- Start → briefing → unsolved or unavailable. Empty input leaves state unchanged; valid incorrect increments attempts and stays unsolved; valid correct increments attempts once and marks solved. Subsequent submits have no effect. Help increases the highest revealed level without submission or completion.
- Solved → Next; unavailable → Skip → skipped, with zero new attempts and no completion. Both advance to the next ordered slot, or the level summary after its final slot. A level is complete iff both incidents are solved. Summary Next enters the next briefing, or the final session summary. Session is complete iff all six incidents are solved; any skipped slot makes it incomplete.
- Restart requires confirmation; cancellation preserves every field, confirmation resets all state and returns to the first briefing. Reload starts fresh.
