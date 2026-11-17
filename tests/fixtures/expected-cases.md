# Expected incident cases

These expectations are derived from the stated snapshots, independently of the evaluator. Content and source review has not yet been independently completed.

| Incident | Correct | Wrong | Basis |
| --- | --- | --- | --- |
| 1.1 | VLAN 10 on SW-01 Gi0/7 | Change the already-correct gateway | Access VLAN mismatch; [access ports](https://www.cisco.com/c/en/us/td/docs/switches/datacenter/nexus9000/sw/7-x/interfaces/configuration/guide/b_Cisco_Nexus_9000_Series_NX-OS_Interfaces_Configuration_Guide_7x/configuring_layer_2_interfaces.html), Trunk and Access Ports and VLAN Traffic |
| 1.2 | HOST-08 gateway 192.168.30.1 | Change the VLAN 30 port | Off-subnet 192.168.40.5 uses a gateway; [RFC 1122 §3.3.1.1](https://www.rfc-editor.org/rfc/rfc1122.html#section-3.3.1.1) |
| 2.1 | Route 192.168.40.0/24 via 10.0.0.2 | Change the responding gateway | No route matches; [RFC 1812 §5.2.4.3](https://www.rfc-editor.org/rfc/rfc1812.html#section-5.2.4.3) |
| 2.2 | HOST-10 port VLAN 20 | Replace the gateway | Expected/observed port mismatch; access-port source above |
| 3.1 | /24 next hop 10.0.0.2 | Change default | /24 is longest match; RFC 1812 §5.2.4.3 |
| 3.2 | HOST-11 port VLAN 50 | Change its correct gateway | Port mismatch; separate alert has no shared path; access-port source above |

Boundary: 192.168.40.255 matches 192.168.40.0/24 for prefix selection only; 192.168.41.0 selects /0. No route and no default yields no match. ICMP echo semantics: [RFC 792, Echo or Echo Reply Message](https://www.rfc-editor.org/rfc/rfc792.html).
