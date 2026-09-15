# Auraxhero X architecture

This document is repository-level engineering documentation. It is not public product copy and must never be rendered by the public experience.

## Boundary model

```text
PUBLIC EXPERIENCE / MACHINE INTERFACE
        |
        v
ROUTE / TRANSPORT
        |
        v
SECURITY CONTROL PLANE
  identity -> authentication -> authorization -> policy
  capability scope -> execution -> audit -> recovery
        |
        v
DOMAIN SERVICES
  discovery -> registry -> evaluation -> provenance -> economy
        |
        v
STATE / ADAPTERS / INFRASTRUCTURE
  database, queues, settlement, external providers, compute
```

The front end is an experience layer. It presents useful outcomes and public contracts. It does not contain authority, private scoring, internal topology, operational secrets, or governance machinery.

Routes are transport. They should not become the business logic layer.

The control plane is the mandatory boundary between transport and protected capability. It resolves identity through an explicit provider, applies policy, executes the authorized operation, and records an audit outcome.

Domain services own capability semantics. They must not depend on React or public-page components.

Infrastructure is an adapter concern. A real database, settlement provider, authentication provider, or external service must be verified before the system claims that integration is live.

## Current truth

- The historical Kernel 0.2 artifact is preserved.
- Kernel 0.3 establishes a canonical Next.js source tree without promoting sensitive historical artifacts.
- The public capability registry is intentionally empty until a capability is actually published.
- Authentication is an explicit unconfigured provider boundary; the founder surface is therefore not publicly reachable.
- The public capability endpoint is routed through identity resolution and the security control plane even though public discovery itself requires no authenticated identity.
- No public page should describe internal architecture, private inventory, security intelligence, economic algorithms, or founder controls.

## Promotion rule

A prototype is not production merely because code exists. A capability requires evidence, reproducibility, evaluation, security review, provenance, governance approval where applicable, and an observable production path before it is represented as published capability.
