# Auraxhero X — Five Operating Systems

## Purpose

Auraxhero X is operated as one product with five distinct operating systems (OS):

1. **Frontend OS** — human and machine experience.
2. **Backend OS** — authoritative application and data execution plane.
3. **Mid OS** — orchestration, workflow, agents, evaluation, routing, and translation between intent and execution.
4. **Management OS** — operational control, resources, risk, service health, economics, compliance, and incident handling.
5. **Executive OS** — founder-level governance, capital authority, strategic direction, exceptions, and final human decisions.

These are separate control surfaces, not five copies of the same dashboard. Each OS has suites, permissions, inputs, outputs, audit requirements, and a defined command relationship.

## Command hierarchy

```text
EXECUTIVE OS
    |
    +--> MANAGEMENT OS
            |
            +--> MID OS
                    |
                    +--> BACKEND OS
                            |
                            +--> FRONTEND OS
```

Authority flows downward. Evidence, telemetry, receipts, exceptions, and escalation flow upward. No lower OS may silently grant authority to itself or to another lower layer.

**AI has capability, not authority.** Agents may propose, discover, compose, test, execute bounded tasks, and report evidence only within explicit policy and authorization envelopes.

## OS contracts

### Frontend OS
Owns what people and machines can see and interact with.

Suites:
- Experience Suite: navigation, pages, forms, accessibility, responsive surfaces.
- Identity Suite: sign-in, session state, account recovery, MFA/passkeys when enabled.
- Capability Suite: discoverable capabilities and machine-readable interfaces.
- Commerce Surface Suite: legitimate offers, service selection, receipts, payment handoff.
- Communication Suite: messages, notifications, status, feedback.
- Trust Suite: verification state, provenance, receipts, policy notices.
- Help Suite: guidance, search, contextual assistance.
- Observability Surface Suite: user-safe status, errors, recovery paths.

Rule: the Frontend never becomes the source of truth for identity, authorization, payment, security, or capability state.

### Backend OS
Owns authoritative state and protected execution.

Suites:
- Identity/Session Suite.
- Authorization and Policy Suite.
- Domain State Suite.
- Data Access/RLS Suite.
- Event and Receipt Suite.
- Service Execution Suite.
- Economic Ledger/Settlement Adapter Suite.
- Security and Abuse-Control Suite.
- Notification/Communication Adapter Suite.
- Storage/Artifact Suite.
- Audit Suite.
- Recovery/Idempotency Suite.

Every meaningful operation follows:
`REQUEST → AUTHENTICATE → AUTHORIZE → POLICY → DOMAIN SERVICE → STATE → EVENT → AUDIT → FEEDBACK → RECOVERY`.

### Mid OS
Owns coordination between capabilities without becoming an authority bypass.

Suites:
- Intent Translation Suite.
- Discovery/Composition Suite.
- Workflow Orchestration Suite.
- Agent Runtime Suite.
- Agent Registry/Health Suite.
- Evaluation/Skeptic Suite.
- Routing/Resource Optimization Suite.
- Provenance/Lineage Suite.
- Experiment/Simulation Suite.
- Human Signal Suite.
- Opportunity/Market Signal Suite.
- Machine-to-Machine Protocol Suite.

Agent lifecycle:
`DISCOVER → HYPOTHESIZE → CRITIQUE → TEST → VERIFY → REQUEST AUTHORITY → EXECUTE → REPORT → LEARN`.

The Mid OS cannot promote experimental work into production merely because an agent believes it is useful.

### Management OS
Owns operation of the machine.

Suites:
- Operations Command Suite.
- Service/Capability Lifecycle Suite.
- Resource and Compute Suite.
- Economic Operations Suite.
- Security Operations Suite.
- Incident Response Suite.
- Compliance/Legal Evidence Suite.
- Reliability/SRE Suite.
- Deployment/Release Suite.
- Vendor/Provider/Integration Suite.
- Data Governance Suite.
- Artifact Repository/Maintenance Yard Suite.
- Quality/Evaluation Suite.
- Continuity/Backup/Rollback Suite.

Management may stop, quarantine, disable, rollback, or escalate bounded system components according to policy. It does not supersede Executive authority on reserved founder decisions.

### Executive OS
Owns the small human handle on the enormous machine.

Suites:
- Founder Cockpit.
- Strategy and Mission Suite.
- Capital/Revenue Oversight Suite.
- Governance and Policy Suite.
- Risk/Exception Suite.
- Security Escalation Suite.
- Legal/Counsel Coordination Suite.
- Major Deployment/Change Approval Suite.
- Organizational Authority Suite.
- System Kill/Shutdown Suite.
- Audit and Evidence Vault.
- Long-Horizon/Scenario Suite.

Executive OS shows evidence, decisions, unresolved exceptions, economic truth, system health, and material risks. It must not manufacture metrics or imply that forecasts are actuals.

## Suites must have chain-of-command metadata

Every suite, service, agent, route, job, and critical workflow should declare:

- owner OS
- parent suite
- command authority
- permitted callers
- permitted targets
- required authentication
- required authorization
- policy requirements
- data classification
- inputs/outputs
- dependencies
- state owner
- events emitted
- audit requirements
- rollback/recovery method
- health status
- lifecycle state
- escalation target
- kill/disable mechanism

## Separation of concerns

Frontend OS asks: **What does the user or machine need to do?**

Backend OS asks: **What is actually true and what may execute?**

Mid OS asks: **How should authorized capabilities be composed and coordinated?**

Management OS asks: **Is the system operating correctly, safely, economically, and continuously?**

Executive OS asks: **What should the organization authorize, fund, stop, change, or pursue?**

## Economic chain

```text
NEED / DEMAND
  -> FRONTEND OS
  -> MID OS discovery/composition
  -> BACKEND OS authorization/execution
  -> MANAGEMENT OS monitoring/reconciliation
  -> EXECUTIVE OS economic/governance oversight
```

Forecasts, simulations, proposed revenue, and hypothetical opportunity are never stored or displayed as actual revenue. Actual settlement requires a real transaction/receipt/ledger event.

## Artifact conservation

The Workshop lives primarily in Mid OS. The Factory promotes only verified artifacts. The Management OS owns lifecycle and repository operations. Executive OS can reserve strategic artifacts or authorize exceptional promotion.

Nothing is casually deleted. Unneeded artifacts become `DEFERRED`, `ARCHIVED`, or `REJECTED` with reasons and provenance. A retained artifact may later be resynthesized into a new candidate, which must pass evaluation again.

## Security handle

```text
PUBLIC / MACHINE
      ↓
FRONTEND OS
      ↓
BACKEND SECURITY CONTROL
      ↓
MID / MANAGEMENT POLICY
      ↓
AUTHORIZED HUMAN
      ↓
EXECUTIVE RESERVED AUTHORITY
```

Security telemetry is defensive and lawful. No retaliation, unauthorized access, credential exposure, or destructive action is permitted.

## Build rule

Do not build five ornamental dashboards. Build five cooperating operating systems with real boundaries, shared contracts, and a strict chain of command.

**BUILD THE SYSTEM. DO NOT WRITE A DESCRIPTION OF THE SYSTEM.**

Production status is always evidence-based: `UNKNOWN` is valid until proven otherwise.
