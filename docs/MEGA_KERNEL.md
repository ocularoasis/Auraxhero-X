# Auraxhero X — Mega Kernel

This document records the bridge strategy for the current repository. It is engineering documentation, not public product copy.

## Strategy

Auraxhero X is not being clean-slate rebuilt. The existing Kernel, extracted source, control-plane primitives, public experience, provenance, evaluation, economy, observability, registry, and CI are treated as reusable material.

The preferred change order is:

**PATCH → ADAPT → WRAP → CONNECT → HARDEN → TEST → VERIFY**

Replacement is reserved for cases where an existing implementation cannot safely or coherently serve the intended contract.

## System boundary

```text
HUMAN / MACHINE ENTRY
        ↓
EXPERIENCE / MACHINE CONTRACT
        ↓
ROUTE / TRANSPORT
        ↓
SECURITY CONTROL PLANE
        ↓
IDENTITY → AUTHENTICATION → AUTHORIZATION → POLICY
        ↓
CAPABILITY SCOPE → EXECUTION
        ↓
DOMAIN SERVICES
        ↓
STATE → PROVENANCE → EVALUATION → OBSERVABILITY
        ↓
ECONOMIC CONTROL → SETTLEMENT → RECONCILIATION
        ↓
GOVERNANCE → REVOCATION → RECOVERY
```

The public experience consumes this system. It does not explain its private machinery.

## Wrapper boundary

```text
AURAXHERO DOMAIN CONTRACT
        ↓
PROVIDER-NEUTRAL ADAPTER
        ↓
EXTERNAL PROVIDER
```

External providers may change without forcing domain semantics to change. Existing provider-specific code should be placed behind these contracts rather than duplicated.

## Human authority

Human identities are distinct from permissions. At minimum the system can represent user, customer, developer, partner, provider, staff, operations, security, finance, accounting, legal, admin, and founder roles. Machine, agent, and service identities are separate from human identities.

Founder authority is not a URL, email-only backdoor, frontend flag, localStorage value, or model decision. It is an authenticated identity plus an explicit founder authorization grant and scope.

Staff, operations, security, finance, accounting, legal, admin, and founder capabilities remain separately bounded.

## Security

Security sits between transport and protected capability execution.

```text
IDENTITY
→ AUTHENTICATION
→ AUTHORIZATION
→ POLICY
→ SCOPE
→ EXECUTION
→ OBSERVABILITY
→ AUDIT
→ REVOCATION
→ RECOVERY
```

Defensive intelligence follows:

```text
EVENT → INDICATOR → INCIDENT → EVIDENCE → PATTERN → DEFENSIVE CONTROL
```

Evidence collection must be lawful, proportionate, privacy-aware, and useful for legitimate investigation. No retaliation is part of the system.

## Capability and agent kernel

Capabilities, services, APIs, tools, agents, workflows, products, and resources are distinct concepts with explicit relationships.

Agents are bounded identities. They receive explicit capability, data, tool, resource, rate, and budget scopes. AI never becomes the authority source.

## Artifact memory

Historical and experimental material is preserved rather than casually deleted.

```text
IDEA → HYPOTHESIS → RESEARCHED → PROTOTYPE → REPRODUCIBLE
→ EVALUATED → HARDENED → CANDIDATE → APPROVED → PRODUCTION
→ MONITORED → DEPRECATED → ARCHIVED
```

A currently unnecessary artifact can retain future value. Deferred evaluation is not rejection.

**One man's trash is another man's repository.**

## Economics

The economic domain is protocol-neutral above settlement. x402 is a preferred machine-commerce rail where appropriate, not the entire economic model.

```text
OPPORTUNITY → CAPABILITY → OFFER → PRICE → AUTHORIZATION
→ PAYMENT → SETTLEMENT → RECONCILIATION → REVENUE EVIDENCE
```

No simulated revenue, balances, customers, transactions, or settlement claims are production truth.

## Public experience

Public principle:

**VISIBLE: VALUE**  
**INVISIBLE: MACHINERY**  
**OPTIONAL: COMMERCE**

Public surfaces should communicate usefulness, capability, outcomes, trust, interoperability, and legitimate opportunities. Private security, governance, economic algorithms, agent topology, internal scoring, and operational details stay behind authorization boundaries.

## Production test

A passing build is necessary but insufficient. The kernel is healthy only when each implemented capability has a traceable route from entry to authorization, execution, state, provenance, observability, and recovery as applicable.

Unconnected external dependencies are classified honestly as `NOT_CONFIGURED` or `BLOCKED_ON_ENVIRONMENT`, never as successful production integrations.
