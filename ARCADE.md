---
# ARCADE SUBMISSION — fill this file in, commit it to the ROOT of your game repository as ARCADE.md,
# then send John your GitHub URL. Everything between the two --- lines is machine-read.
#
# INSTRUCTIONS FOR THE BUILD AGENT (the coding agent that built this game):
#  1. You were there. Fill every field from your own session, your files and your tool list.
#  2. Do NOT invent. If something was not recorded or you do not know it, write "unknown".
#     A truthful "unknown" is better than a confident guess. Never estimate tokens or cost.
#  3. Ask the human ONLY for the fields marked (HUMAN): name, location, links, consent, first-project.
#  4. Keep strings on one line, quote any value containing a colon. Lists use [a, b, c] or "- item".
#  5. Do not put secrets, API keys, tokens, private URLs or file paths from the human's machine here.
#  6. Run the game once yourself and confirm the Runtime section is correct before you finish.
#  7. Then fill in the three short prose sections below the frontmatter. Plain language, no hype.
arcade_version: 1

game:
  title: "Network Ops: Night Shift"
  slug: "network-ops-night-shift"
  tagline: "Keep a pixel-art outpost online until dawn."
  summary: "Work through six incidents by probing network paths and repairing switch ports, host gateways and router entries. Compare the same probe before and after a repair to earn a field patch."
  topics: ["IPv4", "VLANs", "Static routing", "ICMP", "Troubleshooting"]
  category: "network-fundamentals"
  skill_level: "beginner"
  play_minutes: "unknown"
  levels: 3
  card_image: "unknown"
  card_image_alt: "unknown"
  repo: "https://github.com/ThisN8/my-n8work-game"
  repo_path: ""
  license: "unknown"

creator:                     # (HUMAN) ask the human for every field here
  name: "unknown"
  github: "unknown"
  location: "unknown"
  organization: "unknown"
  links: []
  first_spec_project: "unknown"
  workshop: "NAF AC6"
  consent_to_publish: false

build:                       # the BUILD environment — what made the game
  started: "unknown"
  finished: "unknown"
  wall_time: "unknown"
  spec_driven:
    framework: "GitHub Spec Kit"
    framework_version: "1.4.1"
    artifacts: [".specify/memory/constitution.md", "specs/001-network-ops-night-shift/spec.md", "specs/001-network-ops-night-shift/plan.md", "specs/001-network-ops-night-shift/tasks.md", "specs/001-network-ops-night-shift/research.md", "specs/001-network-ops-night-shift/data-model.md", "specs/001-network-ops-night-shift/quickstart.md", "specs/001-network-ops-night-shift/contracts/ui-and-evaluator.md", "specs/001-network-ops-night-shift/checklists/requirements.md"]
    task_count: 30
    loops_or_phases: 6
  model: "gpt-6.2-astra"
  helper_models: ["unknown"]
  harness: "Codex"
  harness_version: "unknown"
  mcp_servers: []
  rag_and_sources: ["Requirements for IP Version 4 Routers (rfc1812, 5.2.4.3) https://www.rfc-editor.org/rfc/rfc1812.html#section-5.2.4.3", "Requirements for Internet Hosts (rfc1122, 3.3.1.1\u20133.3.1.2) https://www.rfc-editor.org/rfc/rfc1122.html#section-3.3.1.1", "Internet Control Message Protocol (rfc792, Echo or Echo Reply Message) https://www.rfc-editor.org/rfc/rfc792.html", "Cisco Layer 2 Interfaces (vlan, Trunk and Access Ports and VLAN Traffic) https://www.cisco.com/c/en/us/td/docs/switches/datacenter/nexus9000/sw/7-x/interfaces/configuration/guide/b_Cisco_Nexus_9000_Series_NX-OS_Interfaces_Configuration_Guide_7x/configuring_layer_2_interfaces.html", "MDN: Using modules on the web (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules/Modules_on_the_web)", "W3C WAI-ARIA 1.2: Live Region Attributes (https://www.w3.org/TR/wai-aria-1.2/#attrs_liveregions)", "StarterKit/CONSTITUTION.md", "StarterKit/SPEC.md", "StarterKit/PLAN.md", "StarterKit/README.md", ".specify/memory/constitution.md", "specs/001-network-ops-night-shift/spec.md", "specs/001-network-ops-night-shift/plan.md", "specs/001-network-ops-night-shift/tasks.md", "specs/001-network-ops-night-shift/research.md", "specs/001-network-ops-night-shift/data-model.md", "specs/001-network-ops-night-shift/quickstart.md", "specs/001-network-ops-night-shift/contracts/ui-and-evaluator.md", "specs/001-network-ops-night-shift/checklists/requirements.md", "README.md", "tests/verification.md", "tests/fixtures/expected-cases.md", ".specify/init-options.json", ".specify/templates/constitution-template.md", ".specify/templates/spec-template.md", ".specify/templates/plan-template.md", ".specify/templates/tasks-template.md", ".agents/skills/speckit-constitution/SKILL.md", ".agents/skills/speckit-specify/SKILL.md", ".agents/skills/speckit-clarify/SKILL.md", ".agents/skills/speckit-plan/SKILL.md", ".agents/skills/speckit-tasks/SKILL.md", ".agents/skills/speckit-analyze/SKILL.md", ".agents/skills/speckit-implement/SKILL.md"]
  skills_and_plugins: ["speckit-constitution", "speckit-specify", "speckit-clarify", "speckit-plan", "speckit-tasks", "speckit-analyze", "speckit-implement"]
  other_tools: ["PowerShell", "Git", "Python 3 http.server", "Microsoft Edge (headless)", "Browser test runner", "Codex web search", "Codex shell and patch tools", "Codex research sub-agent", "JavaScript isolate"]
  human_prompts: "unknown"
  usage:                     # ONLY if measured by the harness. Otherwise leave "unknown"
    input_tokens: "unknown"
    output_tokens: "unknown"
    cost_note: "unknown"
  ai_generated_assets: ["Codex-authored canvas pixel art, CSS switch rack and pixel field patches"]

runtime:                     # what someone needs to PLAY the finished game
  kind: "static-web"
  stack: ["HTML", "CSS", "JavaScript ES modules", "Canvas 2D", "JSON"]
  start: "python -m http.server 8000 --bind 127.0.0.1"
  url_after_start: "http://127.0.0.1:8000/"
  hosted_url: ""
  static_root: "."
  requires_install: false
  requires_network: false
  requires_api_key: false
  uses_ai_at_runtime: false
  browsers: ["Microsoft Edge (headless on Windows)"]
  accessibility: "Native controls, visible focus, text equivalents and reduced-motion styles are implemented. Manual keyboard-only, screen-reader and narrow-window playthroughs remain unverified."
  save_state: "In memory for one page session. Reload or confirmed restart clears progress."

verification:
  tests: "Start the local server and open /tests/ and /tests/night-watch.html in a browser."
  tests_passing: 35
  facts_sourced_from: ["Requirements for IP Version 4 Routers (rfc1812, 5.2.4.3) https://www.rfc-editor.org/rfc/rfc1812.html#section-5.2.4.3", "Requirements for Internet Hosts (rfc1122, 3.3.1.1\u20133.3.1.2) https://www.rfc-editor.org/rfc/rfc1122.html#section-3.3.1.1", "Internet Control Message Protocol (rfc792, Echo or Echo Reply Message) https://www.rfc-editor.org/rfc/rfc792.html", "Cisco Layer 2 Interfaces (vlan, Trunk and Access Ports and VLAN Traffic) https://www.cisco.com/c/en/us/td/docs/switches/datacenter/nexus9000/sw/7-x/interfaces/configuration/guide/b_Cisco_Nexus_9000_Series_NX-OS_Interfaces_Configuration_Guide_7x/configuring_layer_2_interfaces.html"]
  known_limits: ["Six authored incidents across three levels in a stable IPv4 snapshot with one modeled root cause per incident.", "Probes simulate authored path outcomes. No live devices, dynamic routing, NAT, wireless, intermittent loss or convergence.", "Human timing and independent review of all explanations remain unverified. The design target is 5-10 minutes."]
---

## In one paragraph

Night Shift puts you on call for a small outpost from midnight to dawn. Follow a workstation cable into an eight-port rack, inspect the link light and compare its VLAN with the work order. Send a ping before and after the repair to see whether service returns. The game is aimed at learners who already recognize an IPv4 address, a switch port and a default gateway.

## How it was built

The workshop starter kit supplied the constitution, first playable specification and plan. The team adopted the constitution in Spec Kit, wrote the feature specification and clarified how a learner could skip a broken incident while keeping the session incomplete. Planning produced the research notes, data model, interface contract and quickstart. The six task phases followed. Cross-artifact analysis was reported in the conversation. The research helper's exact model ID and the earlier implementation model ID are unknown. The later session reported the model listed above. No MCP server calls were recorded during the build.

The first prototype played like a console quiz. The creator asked for a pixel survival game, which led to an outpost that lights up as the player repairs devices. Device settings, packet probes and an inspectable switch rack followed. Early sandboxed browser runs failed during graphics initialization. Headless Edge later ran against a local Python HTTP server and completed the six-site playthrough. The Arcade verification reran that playthrough and the separate browser suite, which passed all 35 checks.

## What we'd tell the next builder

- Write down the expected repair and a plausible wrong repair before writing the evaluator.
- Build one playable scene early enough for the creator to judge whether it feels like the intended game.
- Exercise the real controls from a fresh browser session and record which checks still need a human.
