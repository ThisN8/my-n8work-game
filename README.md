# Network Ops: Night Shift

Practice systematic network troubleshooting as the operator of a fictional night-shift network operations center. Inspect evidence, choose a diagnosis and remediation, and learn why the decision works or conflicts with the observed state.

**Status: prototype; not release-verified.** The game has six authored incidents in three levels. Headless Edge passed all 35 browser checks and a six-site playthrough. Manual accessibility, independent source review and content validation remain open. See [verification](tests/verification.md) for the actual status.

## Run locally

From the repository root, start a static server with Python 3:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

On systems that use `python3`, substitute that command. Open <http://127.0.0.1:8000/> and keep the terminal running. Ctrl+C stops the server. The browser test runner is at <http://127.0.0.1:8000/tests/>. Serve over HTTP rather than opening the HTML file directly because the application loads modules and JSON.

## How to play

Each site awards an optional pixel-art field patch. Ping the affected path before the repair and ping it again afterward to earn it. Your collection lasts for the current shift.

Use **Packet probe** to select a test path and send a simulated ping. Repeat it after a repair to compare the replies in the probe log. Probes are free and count as neither attempts nor help.

Keep six sites online through a pixel-art night watch. Each repair lights a beacon. The sky advances with incident progress, reaching dawn after the final site. Read each briefing, inspect the path and evidence, open a device service panel, inspect its readings, and enter a VLAN, gateway address, or route to restore the link. Wrong decisions explain the conflict and allow retry; correct decisions enable Next. Help reveals a method, worked step, and solution, and the highest level used is reported separately from attempts and completion. Restart asks for confirmation; reload begins a fresh session. Unavailable incidents may be skipped, but the level and session remain incomplete. There are no points, lives, timer, or penalties.

## Model and sources

The exercise assumes a simplified, stable small-enterprise IPv4 network: displayed evidence and intended configuration are authoritative, components not identified as faulty are healthy, and each incident has one modeled root cause. It covers Ethernet access VLANs, ICMP, and static/default routing. It excludes IPv6, wireless, NAT, dynamic routing, convergence, packet loss, performance, and vendor-specific commands.

- [RFC 1812 §5.2.4.3](https://www.rfc-editor.org/rfc/rfc1812.html#section-5.2.4.3): route matching and forwarding.
- [RFC 1122 §3.3.1.1](https://www.rfc-editor.org/rfc/rfc1122.html#section-3.3.1.1): local and remote destination routing.
- [RFC 792, Echo or Echo Reply Message](https://www.rfc-editor.org/rfc/rfc792.html): ICMP echo.
- [Cisco Layer 2 Interfaces, Trunk and Access Ports and VLAN Traffic](https://www.cisco.com/c/en/us/td/docs/switches/datacenter/nexus9000/sw/7-x/interfaces/configuration/guide/b_Cisco_Nexus_9000_Series_NX-OS_Interfaces_Configuration_Guide_7x/configuring_layer_2_interfaces.html): access-port VLAN behavior.

The sources establish networking rules; the intended configurations and healthy-path conditions are fictional scenario premises. There is no account, backend, live-device connection, runtime AI, or persisted progress.

