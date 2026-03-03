# Network Segmentation Review

## Network Architecture
{{network_architecture}}
<!-- Describe or paste: network topology diagrams, VLAN layout, VPC/VNet design,
     zone descriptions, IP addressing scheme -->

## Firewall Rules / Security Groups
{{firewall_rules}}
<!-- Paste: firewall rule sets, security group configurations, ACLs,
     or describe current segmentation boundaries -->

## Environment Details
- **Network type**: {{network_type}}
<!-- e.g., On-premises, Cloud (AWS/Azure/GCP), Hybrid, Multi-cloud -->
- **Key network zones**: {{network_zones}}
<!-- e.g., DMZ, Internal, Database, Management, PCI CDE, IoT/OT -->
- **Number of VLANs/subnets**: {{vlan_count}}

## Critical Assets
{{critical_assets}}
<!-- List high-value systems that require strong isolation:
     - Databases, domain controllers, key management, backup systems -->

## Current Segmentation Tools
- **Firewalls**: {{firewalls}}
- **SDN/micro-segmentation**: {{sdn_tools}}
- **NAC**: {{nac_solution}}

## Compliance Requirements
{{compliance_requirements}}
<!-- e.g., PCI-DSS CDE isolation, HIPAA ePHI segmentation, ICS/OT Purdue model -->

## Known Concerns
{{known_concerns}}
<!-- Specific lateral movement risks, recent incidents, or audit findings -->
