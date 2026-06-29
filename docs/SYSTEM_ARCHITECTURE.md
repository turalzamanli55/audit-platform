# System Architecture

**Technical realization of the audit, IFRS reporting, and financial intelligence platform.**

| Attribute | Value |
|-----------|-------|
| **Status** | Sprint 1 — Foundation |
| **Authority** | [PROJECT_BIBLE.md](./PROJECT_BIBLE.md) (constitutional) · [MASTER_PRD.md](./MASTER_PRD.md) (product specification) |
| **Scope** | How the platform is built — not what it does |

This document defines **technical architecture only**. Business workflows, product requirements, user interface specifications, database schemas, API contracts, and implementation code are documented elsewhere.

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1.0 | 2026-06-30 | Chief Software Architect | Sprint 1 — Architecture Vision through Cross-cutting Architecture |

---

## Table of Contents — Sprint 1

1. [Architecture Vision](#1-architecture-vision)
2. [Platform Architecture](#2-platform-architecture)
3. [Application Layers](#3-application-layers)
4. [Frontend Architecture](#4-frontend-architecture)
5. [Backend Architecture](#5-backend-architecture)
6. [Cross-cutting Architecture](#6-cross-cutting-architecture)
7. [Architecture Review — Sprint 1](#7-architecture-review--sprint-1)

---

## 1. Architecture Vision

### 1.1 Mission

Engineer a **production-grade, multi-tenant, globally deployable SaaS platform** that realizes the constitutional intent of PROJECT_BIBLE and the executable specification of MASTER_PRD — with security, traceability, and professional accountability embedded in every structural decision.

The architecture exists to:

- Support thousands of concurrent users and high document volumes per tenant
- Enforce strict tenant isolation and least-privilege access at every tier
- Embed AI as a first-class capability without compromising human accountability
- Preserve end-to-end traceability from published outputs to source evidence
- Enable long-term evolution without re-platforming at growth inflection points

### 1.2 Architecture Philosophy

| Principle | Architectural Expression |
|-----------|-------------------------|
| **Correctness over convenience** | When principles conflict, security, auditability, and data integrity take precedence |
| **Complexity in architecture, clarity at the surface** | Sophisticated capability delivered through progressive, role-appropriate experiences |
| **AI-native, not AI-bolted** | Intelligence embedded in domain workflows through a dedicated AI layer — not a peripheral chat widget |
| **Evidence-first intelligence** | Retrieval and permission-filtered context precede generation; citations are structural requirements |
| **Configuration over hardcoding** | Methodology, templates, and rules expressed as governed configuration — not immutable code paths |
| **Longevity over trends** | Technology choices favor maintainability, standards alignment, and enterprise operability |
| **Defense in depth** | Security applied at network, application, data, and operational layers |

### 1.3 Quality Attributes

Quality attributes are **non-functional requirements** that govern architectural decisions. They map to PROJECT_BIBLE Part 6 Section 32.

| Attribute | Architectural Priority | Target Posture |
|-----------|---------------------|----------------|
| **Security** | Critical | Zero cross-tenant leakage; encryption in transit and at rest; MFA for elevated roles |
| **Auditability** | Critical | Immutable platform audit log; AI interactions fully recorded |
| **Reliability** | Critical | Data integrity preserved; idempotent critical operations; verified recovery |
| **Consistency** | High | Strong consistency for financial data and approval state |
| **Traceability** | High | Unbroken lineage chain across modules — architectural invariant |
| **Scalability** | High | Horizontal scaling; stateless application tier; async heavy processing |
| **Performance** | High | Core reads &lt; 500ms P95; AI retrieval &lt; 5s P95 (PROJECT_BIBLE Section 8) |
| **Availability** | High | Enterprise SLA posture; graceful degradation |
| **Maintainability** | High | Modular structure; acyclic dependencies; documented boundaries |
| **Configurability** | High | Firm methodology and templates as versioned configuration |
| **Observability** | High | Structured logging, metrics, tracing with correlation |
| **Internationalization** | Required | Four launch locales without structural rework |
| **Accessibility** | Required | WCAG 2.1 AA architectural compliance |
| **Resilience** | Required | Circuit breakers; retry with backoff; defined RPO/RTO |

```
Security · Auditability · Reliability
              ↓
    Consistency · Traceability
              ↓
  Scalability · Performance · Availability
              ↓
Maintainability · Observability · Configurability
              ↓
   Internationalization · Accessibility · Resilience
```

### 1.4 Long-term Evolution

| Horizon | Architectural Direction |
|---------|------------------------|
| **Near term** | Modular monolith on managed cloud foundation; single deployable unit with strict internal boundaries |
| **Medium term** | Extract high-load or independently scaling capabilities (AI processing, import/export, background jobs) into dedicated workers |
| **Long term** | Selective service extraction where bounded contexts justify independent deployment — without breaking contracts |
| **Continuous** | Industry compliance packs, regional modules, integration plugins attach through published contracts |
| **AI evolution** | Model-agnostic AI layer supports provider substitution without domain rework (PROJECT_BIBLE Core Principle 23) |

Evolution favors **extract when proven necessary** — not premature distribution.

### 1.5 Architecture Principles

Derived from PROJECT_BIBLE Part 6 Section 28 and Core Principles (Part 1, Section 5).

| # | Principle | Rule |
|---|-----------|------|
| **AP-01** | Domain-Driven Design | Structure mirrors professional domains — audit, financial reporting, governance, knowledge, intelligence |
| **AP-02** | Modular Monolith First | Single deployable application with enforced module boundaries — not an undifferentiated monolith |
| **AP-03** | Layered Dependencies | Dependencies flow inward — domain independent of infrastructure and presentation |
| **AP-04** | Separation of Concerns | Authentication ≠ authorization; AI orchestration ≠ business rules; import ≠ reporting |
| **AP-05** | Single Responsibility | Each module has one reason to change |
| **AP-06** | High Cohesion, Low Coupling | Related logic colocated; cross-module interaction through contracts and events only |
| **AP-07** | Tenant Isolation | Organization boundary enforced at every data and compute access path |
| **AP-08** | Contract-Based Integration | No cross-boundary internal calls; no shared mutable state across domains |
| **AP-09** | Immutable Audit Trail | Platform events non-repudiable — users cannot alter governance history |
| **AP-10** | AI Boundary Discipline | AI reads through permission filters; writes only through draft and finding mechanisms |
| **AP-11** | No Training on Tenant Data | Customer data excluded from shared model training without explicit consent |
| **AP-12** | Configuration over Code | Professional rules expressed as versioned, auditable configuration |
| **AP-13** | Testability by Design | Domain logic isolated from infrastructure for deterministic verification |
| **AP-14** | Observability by Default | Every significant operation emits structured telemetry |
| **AP-15** | Anti-Monolith Rules | No circular dependencies; no god-services; no bypassing contracts |

---

## 2. Platform Architecture

### 2.1 Monolith vs Modular Monolith

| Approach | Decision | Rationale |
|----------|----------|-----------|
| **Distributed microservices (day one)** | Rejected | Operational complexity disproportionate to current scale; cross-domain transactions require strong consistency |
| **Undifferentiated monolith** | Rejected | Unmaintainable at enterprise scale; violates domain isolation |
| **Modular monolith** | **Adopted** | Single deployment unit with enforced bounded contexts, package boundaries, and contract-based communication |

The modular monolith delivers:

- Simpler operations and debugging during foundation phase
- ACID transactions across tightly coupled domains (financial data ↔ audit)
- Clear extraction points when independent scaling is justified
- Alignment with team structure during initial delivery

### 2.2 Future Microservice Readiness

The architecture **anticipates** service extraction without **requiring** it prematurely.

| Readiness Mechanism | Purpose |
|---------------------|---------|
| **Bounded contexts** | Natural service boundaries pre-defined |
| **Contract-first interaction** | Modules communicate through interfaces and events — not shared tables |
| **Stateless application tier** | Horizontal scaling without session affinity |
| **Async processing isolation** | Heavy workloads already separated into workers |
| **Tenant context propagation** | Organization identifier flows through all execution paths |
| **Idempotent operations** | Safe retry enables distributed execution later |

**Extraction candidates** (when metrics justify): AI inference pipeline, document processing, import/export generation, notification delivery.

### 2.3 Domain-Driven Design

Software structure aligns with **professional domains** served by the platform (PROJECT_BIBLE Part 6 Section 28).

| DDD Element | Application |
|-------------|-------------|
| **Ubiquitous language** | Domain terms from PROJECT_BIBLE and MASTER_PRD used consistently in code organization |
| **Bounded contexts** | Independently evolvable domains with explicit boundaries |
| **Aggregates** | Consistency boundaries for tenant-scoped entities (engagement, trial balance, working paper) |
| **Domain events** | State changes published for cross-context reactions (approval completed, import validated) |
| **Anti-corruption layers** | Integration adapters isolate external systems from domain models |

### 2.4 Bounded Contexts

Mapped from PROJECT_BIBLE Part 6 platform domains (Section 29).

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Tenancy & Administration                          │
│         (Organization · Workspace · Subscription · Entitlements)       │
├──────────────┬──────────────┬──────────────┬────────────────────────┤
│   Identity   │  Financial   │    IFRS      │       Assurance         │
│   & Access   │    Data      │  Reporting   │        (Audit)          │
├──────────────┴──────────────┴──────────────┴────────────────────────┤
│  Evidence & Documents  │  Governance & Approvals  │  Findings         │
├────────────────────────┴────────────────────────┴─────────────────────┤
│              Knowledge  ·  AI & Intelligence  ·  Export               │
├─────────────────────────────────────────────────────────────────────┤
│                      Integration                                       │
└─────────────────────────────────────────────────────────────────────┘
```

| Bounded Context | Owns | Does Not Own |
|-----------------|------|--------------|
| **Tenancy & Administration** | Organization hierarchy, workspaces, entitlements, policies | Professional workflow execution |
| **Identity & Access** | Authentication, sessions, credential lifecycle | Authorization policy (delegated to domain contexts) |
| **Financial Data** | Import, trial balance, general ledger, validation | IFRS presentation, audit conclusions |
| **IFRS Reporting** | Classification, statements, notes composition | Audit evidence, opinion issuance |
| **Assurance (Audit)** | Engagements, planning, procedures, working papers, lead sheets | Financial statement publication |
| **Evidence & Documents** | Storage, indexing, linkage, retention metadata | Business conclusions |
| **Governance & Approvals** | Review, approval, sign-off, decision history | Domain-specific business rules |
| **Findings** | Finding lifecycle, deficiencies, remediation tracking | Opinion text generation |
| **Knowledge** | Firm knowledge lifecycle, indexing, retrieval | Client engagement data |
| **AI & Intelligence** | Retrieval, analysis orchestration, copilot, interaction logging | Autonomous professional decisions |
| **Export** | Format generation, distribution logging, metadata embedding | Source artifact mutation |
| **Integration** | External system connectivity, adapter orchestration | Domain business rule execution |

### 2.5 Layered Architecture

```
┌─────────────────────────────────────────┐
│           Presentation Layer             │  Next.js · React
├─────────────────────────────────────────┤
│           Application Layer              │  Use cases · orchestration
├─────────────────────────────────────────┤
│             Domain Layer                 │  Business rules · invariants
├─────────────────────────────────────────┤
│          Infrastructure Layer            │  Supabase · persistence · messaging
├─────────────────────────────────────────┤
│     Shared · AI · Integration Layers      │  Cross-cutting capabilities
└─────────────────────────────────────────┘

        Dependency direction: downward only
        Domain Layer depends on nothing outward
```

### 2.6 Dependency Rules

| Rule | Description |
|------|-------------|
| **DR-01** | Presentation depends on Application — never on Infrastructure or Domain internals |
| **DR-02** | Application orchestrates Domain and invokes Infrastructure through interfaces |
| **DR-03** | Domain depends on no outer layer — pure business logic and invariants |
| **DR-04** | Infrastructure implements interfaces defined by Application or Domain |
| **DR-05** | Shared Layer provides primitives — does not contain domain rules |
| **DR-06** | AI Layer reads through Application contracts — does not bypass Domain |
| **DR-07** | Integration Layer adapts external systems — does not embed domain logic |
| **DR-08** | No circular dependencies between packages or modules |
| **DR-09** | Cross-context communication through published contracts or domain events only |

### 2.7 Package Boundaries

Package structure mirrors bounded contexts. Each package contains its own application and domain subdivisions.

| Package | Internal Structure |
|---------|-------------------|
| `{context}/domain` | Entities, value objects, domain services, invariants |
| `{context}/application` | Use cases, command/query handlers, orchestration |
| `{context}/infrastructure` | Repository implementations, external adapters (context-scoped) |
| `{context}/presentation` | Route handlers, server actions, view models (where context-specific) |

**Forbidden:**

- Direct import of another context's `domain` internals
- Shared database access across context repositories
- God-packages accumulating unrelated capabilities

---

## 3. Application Layers

### 3.1 Layer Overview

| Layer | Primary Responsibility |
|-------|------------------------|
| **Presentation** | User-facing rendering, interaction, and request initiation |
| **Application** | Use case orchestration, transaction boundaries, authorization enforcement |
| **Domain** | Business rules, invariants, and professional workflow state machines |
| **Infrastructure** | Persistence, messaging, external system connectivity |
| **Shared** | Cross-cutting primitives — tenancy context, versioning, audit logging |
| **AI** | Retrieval, inference orchestration, citation assembly, interaction logging |
| **Integration** | ERP, identity provider, and document system adapters |

### 3.2 Presentation Layer

| Aspect | Definition |
|--------|------------|
| **Responsibilities** | Render UI; capture user intent; invoke application use cases; enforce client-side accessibility and locale; display loading and error states |
| **Allowed dependencies** | Application Layer contracts; Shared Layer presentation utilities; design system components |
| **Forbidden dependencies** | Domain entities directly; Infrastructure implementations; database clients; AI provider SDKs; cross-context domain packages |

Presentation is **thin** — no business rule execution.

### 3.3 Application Layer

| Aspect | Definition |
|--------|------------|
| **Responsibilities** | Orchestrate use cases; enforce authorization and tenant scope; manage transaction boundaries; translate between presentation DTOs and domain operations; publish domain events |
| **Allowed dependencies** | Domain Layer; Infrastructure interfaces (injected); Shared Layer services; AI Layer orchestration contracts |
| **Forbidden dependencies** | Presentation components; concrete Infrastructure implementations (depend on abstractions); direct cross-context domain access |

Application is the **coordination tier** — where permissions are enforced before domain invocation.

### 3.4 Domain Layer

| Aspect | Definition |
|--------|------------|
| **Responsibilities** | Encode business invariants; enforce state machines (engagement lifecycle, approval gates); validate professional rules; raise domain events; remain persistence-agnostic |
| **Allowed dependencies** | Other domain constructs within same bounded context; Shared Layer value primitives only |
| **Forbidden dependencies** | Presentation; Application orchestration; Infrastructure; AI providers; Integration adapters; any framework-specific types |

Domain is the **authoritative center** — stable across UI and infrastructure changes.

### 3.5 Infrastructure Layer

| Aspect | Definition |
|--------|------------|
| **Responsibilities** | Implement repository interfaces; manage persistence; execute background jobs; interact with Supabase services; handle file storage; deliver notifications; implement caching |
| **Allowed dependencies** | Domain and Application interfaces being implemented; Shared Layer; vendor SDKs (Supabase, storage) |
| **Forbidden dependencies** | Presentation; business rule logic; cross-context domain models |

Infrastructure is **replaceable** — swappable without domain changes.

### 3.6 Shared Layer

| Aspect | Definition |
|--------|------------|
| **Responsibilities** | Tenancy context propagation; correlation identifiers; clock abstraction; versioning primitives; platform audit log emission; common error types; feature flag access |
| **Allowed dependencies** | Minimal external libraries only — no domain-specific logic |
| **Forbidden dependencies** | Any bounded context domain package; Presentation |

Shared provides **horizontal primitives** — not a dumping ground for business logic.

### 3.7 AI Layer

| Aspect | Definition |
|--------|------------|
| **Responsibilities** | Permission-filtered retrieval; prompt assembly; model invocation orchestration; citation packaging; confidence scoring; interaction logging; draft and finding output structuring |
| **Allowed dependencies** | Application contracts for data access; Shared Layer logging; model provider abstractions |
| **Forbidden dependencies** | Direct mutation of approved domain state; bypassing authorization; Presentation; unsandboxed cross-tenant data access |

AI Layer implements PROJECT_BIBLE evidence-first and human-validation architecture (Part 4).

### 3.8 Integration Layer

| Aspect | Definition |
|--------|------------|
| **Responsibilities** | External system adapters; webhook ingestion; ERP connectivity; identity federation bridges; anti-corruption translation between external and domain models |
| **Allowed dependencies** | Application Layer entry points; Infrastructure messaging; Shared Layer |
| **Forbidden dependencies** | Domain rule execution; direct presentation rendering; cross-tenant data routing |

Integration **delivers and receives data** — domain platforms validate and govern.

### 3.9 Layer Dependency Matrix

| Layer → Depends on | Presentation | Application | Domain | Infrastructure | Shared | AI | Integration |
|--------------------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Presentation** | — | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ |
| **Application** | ✗ | — | ✓ | ✓ (iface) | ✓ | ✓ | ✓ |
| **Domain** | ✗ | ✗ | — | ✗ | ✓ (primitives) | ✗ | ✗ |
| **Infrastructure** | ✗ | ✗ | ✗ (iface only) | — | ✓ | ✗ | ✓ |
| **Shared** | ✗ | ✗ | ✗ | ✗ | — | ✗ | ✗ |
| **AI** | ✗ | ✓ | ✗ | ✓ (iface) | ✓ | — | ✗ |
| **Integration** | ✗ | ✓ | ✗ | ✓ | ✓ | ✗ | — |

---

## 4. Frontend Architecture

### 4.1 Technology Foundation

| Technology | Role |
|------------|------|
| **Next.js** | Full-stack React framework — routing, server rendering, API boundary |
| **React** | Component model for professional UI composition |
| **App Router** | File-system routing with layout hierarchy and nested boundaries |

### 4.2 App Router

| Aspect | Architectural Use |
|--------|-------------------|
| **Route groups** | Separate authenticated application, client portal, and administration surfaces |
| **Layouts** | Shared shell — navigation, tenancy context, locale, permission gates |
| **Parallel routes** | Independent loading of dashboard panels where beneficial |
| **Intercepting routes** | Modal overlays for review and approval without losing list context |

Route structure mirrors **bounded contexts** — not arbitrary screen grouping.

### 4.3 Server Components

| Aspect | Architectural Use |
|--------|-------------------|
| **Default rendering** | Server Components as default — minimize client JavaScript |
| **Data fetching** | Initial page data resolved on server with tenant and permission context |
| **Security** | Sensitive data and authorization checks remain server-side |
| **Composition** | Server-rendered shells with targeted client interactivity |

Server Components enforce **permission-before-render** — data never sent to unauthorized clients.

### 4.4 Client Components

| Aspect | Architectural Use |
|--------|-------------------|
| **Interactivity** | Forms, editors, drag-and-drop, real-time collaboration indicators |
| **Boundaries** | Client islands within server-rendered pages — not full-page client rendering |
| **Minimal scope** | Client bundle limited to components requiring browser APIs or rich interaction |

### 4.5 Streaming

| Aspect | Architectural Use |
|--------|-------------------|
| **Progressive rendering** | Dashboard and document-heavy views stream sections as data resolves |
| **Perceived performance** | Critical shell renders immediately; secondary panels follow |
| **AI responses** | Long-running AI analysis streams partial results with citations |

### 4.6 Suspense

| Aspect | Architectural Use |
|--------|-------------------|
| **Loading boundaries** | Declarative loading states per section — not full-page spinners |
| **Error isolation** | Failed panel does not block entire engagement view |
| **Nested suspense** | Hierarchical loading for complex dashboards |

### 4.7 Server Actions

| Aspect | Architectural Use |
|--------|-------------------|
| **Mutations** | Form submissions and state changes invoke Application Layer use cases |
| **Authorization** | Every action re-validates session, tenant scope, and permissions server-side |
| **Validation** | Input validated at application boundary before domain invocation |
| **No direct domain bypass** | Server Actions route through Application Layer — not raw infrastructure |

Server Actions are **not a replacement** for authorization middleware — both are required.

### 4.8 Internationalization

| Aspect | Architectural Use |
|--------|-------------------|
| **Locale routing** | Locale prefix or cookie-based resolution — Azerbaijani, English, Russian, Turkish |
| **Server-side translation** | Labels and messages resolved on server for initial render |
| **Locale-aware formatting** | Dates, numbers, currencies formatted per user locale |
| **RTL readiness** | Layout architecture supports future right-to-left locales |
| **Separation** | Translation resources isolated from component logic |

Aligns with PROJECT_BIBLE Core Principle 31 and Part 7 localization architecture.

### 4.9 Responsive Architecture

| Aspect | Architectural Use |
|--------|-------------------|
| **Breakpoints** | Desktop-first for professional workflows; tablet support for review |
| **Adaptive layouts** | Dashboard grids reflow; tables degrade to card views on narrow screens |
| **Touch targets** | Fieldwork scenarios consider tablet interaction |
| **Offline readiness** | Architecture anticipates intermittent connectivity — detailed in future sprint |

### 4.10 Component Organization

```
src/
├── app/                    # App Router — routes and layouts
├── components/
│   ├── ui/                 # Design system primitives
│   ├── patterns/           # Cross-module interaction patterns (approval, review notes)
│   └── modules/            # Context-scoped feature components
│       ├── assurance/
│       ├── financial/
│       ├── reporting/
│       └── governance/
├── lib/                    # Shared frontend utilities
└── i18n/                   # Locale resources
```

| Tier | Responsibility |
|------|----------------|
| **ui** | Stateless primitives — buttons, inputs, tables, dialogs |
| **patterns** | Reusable professional interaction patterns (approval panel, version comparison) |
| **modules** | Feature-specific composition — depends on patterns and ui only |

### 4.11 State Management Philosophy

| State Type | Strategy |
|------------|----------|
| **Server state** | Fetched on server; revalidated on mutation — source of truth is backend |
| **URL state** | Filters, pagination, selected entity — shareable and bookmarkable |
| **Form state** | Local to client component during editing; submitted via Server Actions |
| **Ephemeral UI state** | Component-local — modals, expand/collapse, selection highlights |
| **Real-time state** | Supabase Realtime subscriptions for notifications and collaborative indicators |
| **Global client store** | Avoided except for truly cross-cutting ephemeral UI — prefer server authority |

**Principle:** The server is the source of truth for professional data. Client state is disposable.

---

## 5. Backend Architecture

### 5.1 Technology Foundation

| Technology | Role |
|------------|------|
| **Supabase** | Managed backend platform — database, auth, storage, realtime, edge compute |
| **PostgreSQL** | Primary transactional data store — ACID, row-level security, extensions |
| **Edge Functions** | Lightweight request handlers for webhooks, auth hooks, and integration ingress |
| **Background Workers** | Long-running and high-volume asynchronous processing |

### 5.2 Supabase

| Capability | Architectural Use |
|------------|-------------------|
| **Auth** | Identity provider integration; session management; MFA hooks |
| **Database** | PostgreSQL with tenant-scoped row-level security policies |
| **Storage** | Evidence and document object storage with access policies |
| **Realtime** | Live notifications, dashboard updates, collaborative presence |
| **Edge Functions** | Stateless request handlers at the edge — not domain logic hosts |

Supabase is **infrastructure** — business rules remain in the Application and Domain layers.

### 5.3 PostgreSQL

| Aspect | Architectural Use |
|--------|-------------------|
| **Transactional integrity** | ACID for financial data, approval state, and cross-entity operations |
| **Row-Level Security** | Tenant isolation enforced at database layer — defense in depth |
| **Extensions** | Full-text search, vector embeddings for knowledge retrieval |
| **Migrations** | Version-controlled schema evolution — owned per bounded context |
| **Strong consistency** | Primary store for authoritative state |

Database design details are documented in a separate data architecture artifact — not in this document.

### 5.4 Edge Functions

| Use Case | Characteristic |
|----------|----------------|
| **Webhook receivers** | External system event ingress |
| **Auth lifecycle hooks** | Post-authentication tenant context injection |
| **Lightweight transforms** | Request validation and routing — not business orchestration |
| **Integration callbacks** | OAuth and federation handshakes |

Edge Functions are **thin** — delegate to Application Layer for business decisions.

### 5.5 Background Workers

| Workload Type | Examples |
|---------------|----------|
| **Import processing** | Large file parsing, validation, staging |
| **Report generation** | PDF, DOCX, Excel, XBRL composition |
| **AI analysis** | Population analysis, anomaly detection, completion review |
| **Indexing** | Document and knowledge embedding |
| **Retention** | Scheduled archival and policy enforcement |
| **Notification dispatch** | Email and batch alert delivery |

| Property | Requirement |
|----------|-------------|
| **Asynchronous** | Never block interactive requests |
| **Idempotent** | Safe retry on failure |
| **Progress reporting** | Job status visible to initiating user |
| **Tenant-scoped** | Every job carries organization context |
| **Failure visibility** | Dead-letter handling with operator alerting |

### 5.6 Cron Jobs

| Schedule Type | Examples |
|---------------|----------|
| **Periodic maintenance** | Session cleanup, expired invitation removal |
| **Deadline alerts** | Overdue procedure and remediation notifications |
| **Retention enforcement** | Archive transitions per policy |
| **Health aggregation** | Synthetic check execution |

Cron jobs invoke Application Layer scheduled use cases — not raw SQL mutations.

### 5.7 Storage

| Bucket Class | Content |
|--------------|---------|
| **Evidence originals** | Immutable uploaded documents — write-once semantics |
| **Generated exports** | Approved report exports with metadata |
| **Temporary staging** | Import processing intermediates — lifecycle-managed |
| **Branding assets** | Organization logos and templates |

| Property | Requirement |
|----------|-------------|
| **Access policies** | Engagement-scoped and role-gated |
| **Immutability** | Evidence originals cannot be overwritten (PROJECT_BIBLE AE-02) |
| **Integrity** | Content hashing for tamper detection |
| **Tenant isolation** | Bucket policies enforce organization boundary |

### 5.8 Realtime

| Channel | Use |
|---------|-----|
| **Notifications** | Review assignments, approval requests, alerts |
| **Dashboard refresh** | Procedure completion, finding status changes |
| **Collaborative indicators** | Presence and concurrent editing awareness |
| **Job progress** | Background task status updates |

Realtime delivers **events** — never mutates authoritative state on the client.

### 5.9 Event-driven Services

| Pattern | Application |
|---------|-------------|
| **Domain events** | State changes published within bounded context (approval completed, import validated) |
| **Integration events** | Cross-context reactions through async handlers |
| **Outbox pattern** | Reliable event delivery alongside transactional writes |
| **Event schema versioning** | Backward-compatible event contracts |

```
Domain Action → Persist State → Publish Event (outbox)
                                      ↓
                              Event Handler(s)
                                      ↓
                    Notification · Indexing · Cross-context Update
```

Event handlers are **idempotent** and **tenant-aware**.

### 5.10 Integration Services

| Integration Class | Pattern |
|-------------------|---------|
| **ERP / accounting** | Scheduled and on-demand data extraction via adapters |
| **Identity (SSO)** | SAML/OIDC federation through Supabase Auth |
| **Document systems** | Governed import/export bridges |
| **Email** | Transactional delivery for notifications |
| **AI providers** | Model invocation through AI Layer abstraction |

Integration Services implement **anti-corruption layers** — external models never enter domain directly.

---

## 6. Cross-cutting Architecture

### 6.1 Configuration

| Configuration Tier | Scope | Governance |
|--------------------|-------|------------|
| **Platform** | Operator-managed — feature availability, rate limits | Platform administration |
| **Organization** | Security policies, retention, branding, export rules | Organization Owner |
| **Workspace** | Methodology templates, compliance packs | Workspace Administrator |
| **Engagement** | Materiality, framework, team | Audit Manager |

| Principle | Application |
|-----------|-------------|
| **Versioned** | Configuration changes create version records |
| **Effective dating** | Changes apply from defined dates |
| **Auditable** | Who changed what, when — logged |
| **Hierarchical override** | Lower scopes inherit unless explicitly overridden |

### 6.2 Logging

| Log Category | Content |
|--------------|---------|
| **Platform audit log** | User actions, approvals, exports, AI dispositions — immutable |
| **Application log** | Use case execution, authorization decisions, errors |
| **Infrastructure log** | Database, storage, worker execution |
| **Security log** | Authentication events, permission denials, anomaly indicators |
| **AI interaction log** | Prompts, retrievals, outputs, accept/reject — full traceability |

| Property | Requirement |
|----------|-------------|
| **Structured** | JSON with correlation identifier, tenant, user, timestamp |
| **Immutable** | Audit logs cannot be altered or deleted by users |
| **Correlated** | Single request traceable across layers |
| **Retention** | Per organization policy and regulatory minimum |

### 6.3 Error Handling

| Error Class | Handling |
|-------------|----------|
| **Validation** | User-actionable message; no internal detail exposed |
| **Authorization** | Generic denial — no information leakage about resource existence |
| **Business rule violation** | Domain-specific professional message |
| **Infrastructure** | Retry where appropriate; graceful degradation; operator alert |
| **AI failure** | Fallback to manual workflow; never silent failure |

| Principle | Application |
|-----------|-------------|
| **Fail closed** | Authorization and tenant checks fail to deny — not permit |
| **No silent swallow** | Errors logged with correlation context |
| **User-safe messages** | Internal stack traces never reach client |

### 6.4 Validation

| Validation Tier | Responsibility |
|-----------------|----------------|
| **Presentation** | Format, required fields — UX convenience only |
| **Application** | Authorization, tenant scope, input completeness |
| **Domain** | Business invariants, state machine guards, professional rules |

Presentation validation is **never sufficient alone** — Application and Domain always validate.

### 6.5 Feature Flags

| Purpose | Architectural Use |
|---------|-------------------|
| **Gradual rollout** | Controlled exposure of new capabilities |
| **Tenant targeting** | Enable features per organization or workspace |
| **Kill switch** | Disable capability without deployment |

| Constraint | Rule |
|------------|------|
| **Not architecture** | Feature flags control rollout — do not substitute for module boundaries (PROJECT_BIBLE Section 30.12) |
| **Auditable** | Flag state changes logged |
| **Default safe** | Flags default to off for new capabilities |

### 6.6 Observability

| Pillar | Implementation |
|--------|----------------|
| **Metrics** | Request latency, error rates, queue depth, tenant resource usage |
| **Traces** | Distributed tracing across Server Actions, workers, and AI calls |
| **Logs** | Structured, correlated — see Section 6.2 |
| **Dashboards** | Operator and tenant health views |
| **Alerting** | SLA breach, error spike, queue backlog, security anomaly |

### 6.7 Telemetry

| Telemetry Type | Collection |
|----------------|------------|
| **Performance** | P50/P95/P99 latency per operation class |
| **Usage** | Feature adoption, module utilization — privacy-respecting |
| **AI** | Retrieval latency, citation rate, acceptance rate |
| **Business operations** | Import volume, export count, engagement activity — aggregated |

Telemetry excludes **customer financial content** from analytics pipelines unless explicitly consented.

### 6.8 Health Checks

| Check Level | Scope |
|-------------|-------|
| **Liveness** | Application process responsive |
| **Readiness** | Database, storage, and critical dependencies reachable |
| **Deep health** | Synthetic transaction per tenant tier — scheduled |
| **Dependency** | External integration connectivity status |

Health endpoints support **orchestrator deployment** and **status page** integration.

---

## 7. Architecture Review — Sprint 1

Consistency review of SYSTEM_ARCHITECTURE Sprint 1 against PROJECT_BIBLE (Parts 1–15) and MASTER_PRD (Parts 1–17). Constitutional and product documents not modified.

### 7.1 Constitutional Alignment

| Area | Status | Notes |
|------|--------|-------|
| Multi-tenant isolation (ORG-01) | Aligned | RLS, tenant context, package boundaries |
| AI-native architecture (Part 1) | Aligned | Dedicated AI Layer with boundary discipline |
| Evidence-first AI (Part 4) | Aligned | AI Layer responsibilities |
| Traceability chain (Part 3 §16) | Aligned | Architectural invariant AP-09 |
| Layered architecture (Part 6 §28) | Aligned | Section 3 dependency rules |
| Platform domains (Part 6 §29) | Aligned | Bounded contexts Section 2.4 |
| Anti-monolith rules (Part 6 §30.12) | Aligned | AP-15, package boundaries |
| Quality attributes (Part 6 §32) | Aligned | Section 1.3 |
| Core Principles 1–35 | Aligned | Architecture Principles Section 1.5 |
| Export governance (EXP-01–05) | Aligned | Export bounded context; future sprint detail |

### 7.2 MASTER_PRD Alignment

| Area | Status |
|------|--------|
| Multi-tenant product model (Part 2) | Bounded context: Tenancy & Administration |
| IAM and RBAC (Part 3) | Identity & Access context; Application Layer enforcement |
| Engagement-scoped permissions (Part 4) | Tenant context propagation |
| Financial → Reporting → Audit flow (Parts 5–11) | Context dependency rules |
| AI Auditor & Copilot (Part 13) | AI Layer |
| Governance & Approvals (Part 14) | Governance context; Shared services |
| Export (Part 17) | Export context; background workers |
| Executive Reporting (Part 16) | Presentation + Application read models |

### 7.3 Architecture Risks

| ID | Risk | Severity | Mitigation Direction |
|----|------|----------|---------------------|
| **AR-01** | Modular monolith boundary erosion over time | High | Enforce package lint rules; architecture review gate for cross-context imports |
| **AR-02** | RLS alone insufficient for complex engagement permissions | High | Application Layer authorization as primary gate; RLS as defense in depth |
| **AR-03** | AI latency degrades professional workflows | Medium | Async analysis default; streaming responses; background workers |
| **AR-04** | Supabase vendor concentration | Medium | Domain/Infrastructure separation enables persistence abstraction |
| **AR-05** | Large document volumes per engagement | Medium | Storage tiering; background indexing; pagination architecture |
| **AR-06** | Strong consistency vs. analytics performance | Medium | Read models for dashboards; explicit eventual consistency labeling |
| **AR-07** | Cross-context transactions (financial adjustment → audit invalidation) | Medium | Saga orchestration in Application Layer; idempotent compensations |

### 7.4 Missing Concepts (Future Sprints)

| ID | Concept | Recommended Sprint |
|----|---------|-------------------|
| **MC-01** | Data architecture — entity model, RLS policy patterns, migration strategy | Sprint 2 |
| **MC-02** | Security architecture — threat model, encryption, secrets management | Sprint 2 |
| **MC-03** | API and contract architecture — internal and external boundaries | Sprint 2 |
| **MC-04** | AI architecture — RAG pipeline, model routing, embedding strategy | Sprint 3 |
| **MC-05** | Deployment topology — environments, CI/CD, disaster recovery | Sprint 3 |
| **MC-06** | Caching strategy — invalidation, tenant isolation | Sprint 3 |
| **MC-07** | Offline-tolerant fieldwork architecture (Core Principle 34) | Sprint 4 |
| **MC-08** | Multi-region and data residency | Sprint 4 |

### 7.5 Technical Gaps

| ID | Gap | Impact |
|----|-----|--------|
| **TG-01** | No contract schema for inter-context domain events | Cross-team integration friction |
| **TG-02** | Read model strategy for executive dashboards undefined | Performance risk at scale |
| **TG-03** | Job orchestration platform selection not finalized | Worker reliability TBD |
| **TG-04** | Digital signature integration architecture deferred | Export trust chain incomplete |
| **TG-05** | ABAC policy engine readiness referenced but not specified | Future authorization complexity |

### 7.6 Future Improvements

| ID | Improvement |
|----|-------------|
| **FI-01** | Architecture Decision Records (ADR) process for significant structural choices |
| **FI-02** | Automated dependency boundary enforcement in CI pipeline |
| **FI-03** | Synthetic monitoring for critical professional workflows |
| **FI-04** | Chaos engineering for resilience validation |
| **FI-05** | Performance budget per bounded context |
| **FI-06** | Architecture conformance reviews per release |
| **FI-07** | Plugin/extension sandbox architecture (PROJECT_BIBLE §30.10) |

### 7.7 Review Conclusion

SYSTEM_ARCHITECTURE Sprint 1 is **consistent with PROJECT_BIBLE and MASTER_PRD**. It defines a modular monolith with DDD bounded contexts, strict layered dependencies, Next.js/Supabase technology alignment, and cross-cutting concerns appropriate for an enterprise audit and IFRS reporting platform. AR-01 through AR-07, MC-01 through MC-08, and FI-01 through FI-07 guide subsequent architecture sprints.

---

*End of Sprint 1.*

---

# Sprint 2 — Identity, Tenancy, Authorization, Security & Compliance

*Continues SYSTEM_ARCHITECTURE.md — technical realization only.*

---

## Table of Contents — Sprint 2

8. [Identity Architecture](#8-identity-architecture)
9. [Multi-Tenant Architecture](#9-multi-tenant-architecture)
10. [Authorization Architecture](#10-authorization-architecture)
11. [Security Architecture](#11-security-architecture)
12. [Audit & Compliance Architecture](#12-audit--compliance-architecture)
13. [Architecture Review — Sprint 2](#13-architecture-review--sprint-2)

---

## 8. Identity Architecture

Identity is the **root of trust** for all platform access. Every authentication event, authorization decision, and audit record binds to an individual identity.

*Aligns with PROJECT_BIBLE Part 5 Sections 23–24; MASTER_PRD Part 3 Section 11; Sprint 1 Identity & Access bounded context.*

### 8.1 Identity Model

```
┌─────────────────────────────────────────────────────────────┐
│                    PLATFORM IDENTITY PLANE                     │
├─────────────────────────────────────────────────────────────┤
│  Human Identity        │  Service Identity  │  Federation     │
│  (User account)        │  (Integration)     │  (SSO subject)  │
├─────────────────────────────────────────────────────────────┤
│  Organization Membership (exactly one per user)              │
│  Workspace Role Bindings (many)                              │
│  Engagement Assignments (many)                               │
└─────────────────────────────────────────────────────────────┘
```

| Identity Type | Description | Attribution |
|---------------|-------------|-------------|
| **Human user** | Individual professional or client user — one account per person | All professional actions |
| **Service identity** | Integration and background worker credentials | Machine actions with scoped capability |
| **Federated identity** | SSO subject mapped to platform user | Enterprise IdP as authoritative source |
| **System identity** | Platform-internal automated processes | Triggering user recorded where applicable |

| Property | Requirement |
|----------|-------------|
| **Uniqueness** | One active account per email per organization |
| **No shared accounts** | Shared credentials prohibited |
| **Persistence** | Deactivated identities preserved for attribution — not hard-deleted |
| **Separation** | Platform operator identities separated from customer professional identities |

### 8.2 Authentication Strategy

Authentication verifies **who** is requesting access. It does not grant permissions.

| Method | Use Case | Priority |
|--------|----------|----------|
| **Enterprise SSO (SAML/OIDC)** | Large firms and corporate deployments | Preferred for enterprise |
| **Email + password** | Smaller firms; fallback when SSO unavailable | Supported |
| **MFA** | Elevated roles and sensitive operations | Mandatory where policy requires |
| **Invitation-based onboarding** | Controlled provisioning | Default for new users |

| Flow Stage | Architectural Control |
|------------|----------------------|
| **Credential presentation** | TLS-terminated; rate-limited |
| **Identity verification** | Supabase Auth or federated IdP |
| **Organization resolution** | Membership bound before session issuance |
| **MFA challenge** | When policy or step-up requires |
| **Session issuance** | Signed tokens with tenant and scope claims |
| **Audit** | Success and failure logged immutably |

**Fail closed:** Authentication failure never grants partial or anonymous access.

### 8.3 Authorization Strategy

Authorization is **separate from authentication** and evaluated on every protected action.

| Layer | Responsibility |
|-------|----------------|
| **Application Layer** | Primary authorization gate — role, scope, capability evaluation |
| **Domain Layer** | Business rule gates (separation of duties, state machine guards) |
| **Data Layer** | Row-level security as defense in depth — not primary policy engine |
| **AI Layer** | Permission-filtered retrieval scoped to invoking user |

Authorization decisions use **current permission state** — not stale session caches beyond defined policy limits.

### 8.4 Session Management

| Control | Architectural Behavior |
|---------|------------------------|
| **Inactivity timeout** | Configurable per organization — conservative default |
| **Absolute session limit** | Maximum duration regardless of activity |
| **Secure renewal** | Token rotation without credential re-exposure |
| **Logout** | Immediate invalidation of all session tokens |
| **Concurrent sessions** | Configurable limit per user |
| **Deactivation** | All sessions terminated on account deactivation |
| **Security events** | Password change, MFA reset, lockout terminate all sessions |
| **Step-up** | Sensitive operations may require fresh authentication within session |

Sessions are **server-authoritative** — client-held tokens are validated on every request.

### 8.5 Device Trust

Device trust is **readiness architecture** for attribute-based policies and sensitive operation gating.

| Trust Level | Characteristics | Policy Effect |
|-------------|-----------------|---------------|
| **Trusted** | MDM-enrolled or organization-verified device | Full access per role |
| **Registered** | User-registered known device | Standard access |
| **Untrusted** | New or unrecognized device | MFA challenge; export/approval/admin restricted |

| Capability | Description |
|------------|-------------|
| **Device registration** | User registers device with verification |
| **Trust evaluation** | Device posture evaluated at session creation and step-up |
| **ABAC attribute** | Device trust level available for future policy rules |
| **Revocation** | Device trust revocable by user or administrator |

### 8.6 Multi-Factor Authentication

| Aspect | Architecture |
|--------|--------------|
| **Methods** | TOTP authenticator, hardware security keys, SSO-enforced MFA |
| **Mandatory roles** | Organization Owner, Workspace Administrator, Engagement Partner (minimum) |
| **Organization extension** | Additional roles configurable per organization policy |
| **Step-up MFA** | Export, approval, administration may require fresh challenge |
| **SSO delegation** | MFA enforced by IdP for federated users |
| **Recovery** | Secure, audited alternative verification — not bypass |

MFA is **foundational** — not retrofitted.

### 8.7 Password Policies

| Policy Element | Architecture |
|----------------|--------------|
| **Strength** | Minimum length and complexity per organization policy |
| **History** | Reuse prevention |
| **Breach detection** | Compromised credential rejection |
| **Rotation** | Compromise-triggered mandatory; avoid counterproductive forced rotation when MFA present |
| **SSO preference** | Password auth discouraged where enterprise SSO available |
| **Storage** | Hashed credentials — never plaintext |

### 8.8 Account Recovery

| Flow | Control |
|------|---------|
| **Password reset** | Time-limited single-use token; verified email channel |
| **MFA recovery** | Alternative verification with enhanced audit |
| **SSO users** | Directed to identity provider — platform does not manage SSO credentials |
| **Session invalidation** | All sessions terminated on successful recovery |
| **Rate limiting** | Recovery requests throttled |
| **Audit** | Request, completion, and failure logged |

### 8.9 Enterprise Identity

| Capability | Architecture |
|------------|--------------|
| **SSO (SAML/OIDC)** | Customer IdP as authoritative identity source |
| **Just-in-time provisioning** | User created on first SSO login within organization |
| **SCIM readiness** | Architecture supports automated provisioning/deprovisioning |
| **Identity lifecycle** | Provision, modify, deactivate governed with audit trail |
| **Federation mapping** | IdP subject bound to platform user — unique per organization |
| **Operator separation** | Platform administration identities isolated from tenant users |

Enterprise identity is a **requirement** for large-firm deployment — not optional convenience.

---

## 9. Multi-Tenant Architecture

Multi-tenancy is the **foundational isolation boundary** of the platform. Cross-tenant data leakage is a zero-tolerance event.

*Aligns with PROJECT_BIBLE Part 5 Section 24.6–24.8; MASTER_PRD Part 2 Section 6; Sprint 1 AP-07.*

### 9.1 Hierarchy Model

```
Platform (vendor-operated)
    └── Organization (subscription / tenant root)
            └── Workspace (operational subdivision)
                    └── Company (legal reporting entity)
                            └── Engagement (assurance container)
                                    └── Artifacts (data, documents, workflows)
```

| Level | Isolation Role |
|-------|----------------|
| **Platform** | Shared runtime; zero customer data commingling in shared services |
| **Organization** | Primary tenant boundary — subscription, policies, billing |
| **Workspace** | Client confidentiality boundary; methodology scope |
| **Company** | Legal entity data anchor |
| **Engagement** | Professional work container; team-scoped access |

### 9.2 Platform

| Aspect | Architecture |
|--------|--------------|
| **Role** | Vendor-operated SaaS environment hosting all organizations |
| **Isolation** | Organizations strictly separated — no cross-tenant operations for customer users |
| **Shared services** | Authentication, AI orchestration, notification — tenant context required |
| **Operator access** | Platform administration subject to enhanced controls and logging |

### 9.3 Organization

| Aspect | Architecture |
|--------|--------------|
| **Role** | Top-level customer tenant — subscription and policy boundary |
| **Data ownership** | Customer owns all organization data |
| **Identity scope** | Users belong to exactly one organization |
| **Configuration** | Security, retention, MFA, branding at organization level |
| **Ceiling** | Maximum permissions any user can hold within organization |

### 9.4 Workspace

| Aspect | Architecture |
|--------|--------------|
| **Role** | Operational subdivision — firm office, business unit, client portal |
| **Isolation** | Client workspaces isolated from other client workspaces |
| **Methodology** | Templates and compliance packs at workspace level |
| **Administration** | Workspace Administrators bounded to assigned workspaces |
| **Narrowing** | Permissions may restrict below organization ceiling |

### 9.5 Company

| Aspect | Architecture |
|--------|--------------|
| **Role** | Legal reporting entity — financial data anchor |
| **Scope** | Trial balance, statements, periods tied to company |
| **Access** | Entity-scoped permissions within workspace |
| **Uniqueness** | Legal identity unique within workspace |

### 9.6 Engagement

| Aspect | Architecture |
|--------|--------------|
| **Role** | Assurance work container — team, procedures, working papers |
| **Scope** | Narrowest professional access boundary for audit work |
| **Team** | Engagement-scoped role assignments |
| **Containment** | Engagements belong to one workspace |

### 9.7 Isolation Model

Defense in depth across four isolation planes:

```
┌─────────────────────────────────────────────────────────────┐
│  Application Isolation  — Authorization on every action    │
├─────────────────────────────────────────────────────────────┤
│  API Isolation          — Tenant context on every request    │
├─────────────────────────────────────────────────────────────┤
│  Data Isolation         — Row-level security + scoped repos  │
├─────────────────────────────────────────────────────────────┤
│  Storage Isolation      — Bucket policies per organization   │
└─────────────────────────────────────────────────────────────┘
```

| Plane | Mechanism |
|-------|-----------|
| **Application** | Permission evaluation before domain invocation |
| **Request** | Organization identifier mandatory on all execution paths |
| **Database** | Row-level security policies on tenant-scoped tables |
| **Storage** | Object policies scoped to organization and engagement |
| **AI retrieval** | Permission-filtered context — no cross-tenant embedding search |
| **Cache** | Tenant-prefixed cache keys — no cross-tenant cache hits |
| **Background jobs** | Organization context propagated and validated |

### 9.8 Tenant Boundaries

| Boundary | Rule |
|----------|------|
| **ORG-01** | No organization accesses another organization's data |
| **Data queries** | Every query includes organization filter — enforced at multiple layers |
| **Cross-tenant references** | Prohibited in application logic |
| **Shared resources** | Only non-customer content (platform config, public knowledge) |
| **Analytics** | Aggregated and pseudonymized — no client-identifiable cross-tenant analytics |
| **AI training** | No tenant data in shared models without explicit consent |

### 9.9 Data Ownership

| Data Class | Owner | Platform Role |
|------------|-------|---------------|
| **Customer professional data** | Organization (customer) | Custodian — processing per contract |
| **Platform audit logs** | Shared accountability | Immutable operator + customer access |
| **Firm knowledge** | Organization | Hosted and indexed by platform |
| **Configuration** | Organization | Versioned and auditable |
| **Export packages** | Organization | Generated on authorized request |

Data portability is an architectural requirement — organizations must be able to export their data.

### 9.10 Tenant Context

Tenant context is a **mandatory execution primitive** propagated through all layers.

| Context Element | Propagation |
|-----------------|-------------|
| **Organization identifier** | Every request, job, and AI retrieval |
| **Workspace scope** | Where workspace-bound operation |
| **Engagement scope** | Where engagement-bound operation |
| **User identity** | Actor for authorization and audit |
| **Correlation identifier** | Request tracing across layers |

```
Request → Extract Identity → Resolve Organization → Validate Membership
    → Attach Context → Authorize → Execute → Audit (with context)
```

Context is established **once per request** at the application boundary — not re-derived inconsistently downstream.

### 9.11 Cross-Tenant Protection

| Control | Description |
|---------|-------------|
| **Mandatory tenant filter** | All data access paths require organization context |
| **Integration tests** | Cross-tenant access attempts must fail |
| **Monitoring** | Anomaly detection for cross-tenant access patterns |
| **Operator access** | Break-glass procedures with enhanced logging |
| **AI boundary** | Retrieval indexes partitioned by tenant |
| **Incident response** | Zero-tolerance classification for cross-tenant events |

---

## 10. Authorization Architecture

Authorization determines **what** an authenticated identity may do, where, and on which objects.

*Aligns with PROJECT_BIBLE Part 5 Sections 24.3–24.5, 24.14; MASTER_PRD Part 3 Sections 11, 14.*

### 10.1 RBAC

Role-Based Access Control is the **primary authorization model**.

| Element | Definition |
|---------|------------|
| **Role** | Named professional or administrative function |
| **Capability** | Permission on module or object type — read, create, edit, review, approve, export, administer, configure |
| **Scope** | Organizational boundary — organization, workspace, engagement, entity |
| **Binding** | Role + Capability + Scope = effective permission |

```
Effective Permission = Role ∩ Capability ∩ Scope ∩ Policy Rules
```

Canonical roles are defined in MASTER_PRD — custom roles configurable within platform capability boundaries.

### 10.2 Future ABAC Readiness

Architecture supports **Attribute-Based Access Control** evolution without disrupting RBAC.

| Attribute Category | Examples |
|--------------------|----------|
| **User** | Role, department, clearance, engagement assignment |
| **Resource** | Entity, engagement, data classification, sensitivity |
| **Environment** | Time, device trust, geographic location |
| **Action** | Read, export, approve, AI query |

| Design Pattern | Purpose |
|----------------|---------|
| **Policy evaluation layer** | Pluggable between authentication and authorization |
| **Attribute providers** | Device trust, time, resource metadata injectors |
| **RBAC as baseline** | ABAC complements — does not replace — role definitions |
| **Deny overrides** | Explicit deny takes precedence |

Example future policy: *Financial Controller may export only assigned entities during business hours from trusted devices.*

### 10.3 Permission Resolution

```
Authenticated Identity
        ↓
Organization Membership Valid?
        ↓
Role Bindings at Scope
        ↓
Capability Required for Action?
        ↓
Separation of Duties Check
        ↓
Resource-Level Policy (engagement, entity)
        ↓
ALLOW / DENY
```

| Resolution Rule | Description |
|-----------------|-------------|
| **Deny by default** | Unspecified access denied |
| **Narrowest scope wins** | Engagement restriction overrides organization grant |
| **Cannot widen downward** | Lower scope cannot exceed higher scope grant |
| **Real-time** | Permission changes effective on next protected action |
| **Cached carefully** | Permission cache TTL bounded; invalidation on grant change |

### 10.4 Role Inheritance

| Level | Inheritance Behavior |
|-------|---------------------|
| **Organization** | Sets permission ceiling for user |
| **Workspace** | May restrict — never expand beyond organization |
| **Engagement** | Team role assignment — narrowest professional scope |
| **Entity / section** | Fieldwork assignment — granular read/write |

**No automatic write inheritance** — each level requires explicit assignment.

### 10.5 Temporary Permissions

| Aspect | Architecture |
|--------|--------------|
| **Time-bound grants** | Explicit expiry timestamp mandatory |
| **Justification** | Reason recorded in audit log |
| **Scope limited** | Cannot exceed assigner's own permissions |
| **Revocation** | Immediate revocation supported |
| **Use cases** | Cover absence, specialist access, emergency review |
| **Approval** | Elevated grants may require administrator approval |

Temporary permissions **auto-expire** — no silent permanence.

### 10.6 Delegated Administration

| Delegation Type | Supported | Architecture |
|-----------------|-----------|--------------|
| **Workspace administration** | Yes | Organization Owner delegates workspace admin rights |
| **User provisioning** | Yes | Scoped to assigned workspaces |
| **Professional approval** | No | Approvals are personal accountability — not delegatable |
| **Partner absence** | Role reassignment | Another Partner explicitly assigned |

Delegation is **administrative** — not professional accountability transfer.

### 10.7 Least Privilege

| Enforcement Point | Mechanism |
|-------------------|-----------|
| **Default roles** | Minimal capability — elevation explicit |
| **Engagement assignment** | Access only assigned engagements |
| **Client isolation** | Client users see only client-scoped data |
| **AI retrieval** | Invoking user's permission boundary |
| **Integration credentials** | Minimum necessary scope |
| **Temporary elevation** | Time-bound with audit |

Least privilege is **structural** — not policy-document-only.

### 10.8 Separation of Duties

| Conflict | Architectural Enforcement |
|----------|--------------------------|
| **Preparer ≠ sole reviewer** | Same user cannot be sole final reviewer of own work |
| **Conflicting roles** | Blocked on same engagement without policy exception |
| **Approval personal** | Cannot delegate professional approval |
| **Exception** | Documented waiver with elevated authorization and audit |

SoD rules evaluated at **authorization layer** and **domain state machines**.

---

## 11. Security Architecture

Security is a **precondition for existence** — not a feature. The platform is designed to the standard of regulated financial infrastructure.

*Aligns with PROJECT_BIBLE Part 5 Section 23; Sprint 1 quality attributes.*

### 11.1 Zero Trust

No user, device, service, or network location is trusted by default.

| Principle | Application |
|-----------|-------------|
| **Never trust, always verify** | Every request authenticated and authorized |
| **Assume breach** | Blast radius limited by tenant isolation and least privilege |
| **Explicit authorization** | No implicit access from network position |
| **Continuous validation** | Session integrity throughout activity |
| **Micro-segmentation** | Organization, workspace, engagement boundaries independent |

Zero Trust applies to **humans, services, integrations, and AI retrieval**.

### 11.2 Defense in Depth

```
┌─────────────────────────────────────────────────────────────┐
│  Operational Security  — Monitoring, incident response, SDLC │
├─────────────────────────────────────────────────────────────┤
│  Application Security  — RBAC, validation, audit logs       │
├─────────────────────────────────────────────────────────────┤
│  Data Security         — Encryption, classification          │
├─────────────────────────────────────────────────────────────┤
│  Identity Security     — Auth, MFA, session control           │
├─────────────────────────────────────────────────────────────┤
│  Infrastructure Security — Network, hardening, WAF           │
└─────────────────────────────────────────────────────────────┘
```

No single control is sufficient. Failure of one layer does not compromise the system.

### 11.3 Encryption Strategy

| Data State | Strategy |
|------------|----------|
| **In transit** | TLS 1.2+ for all client and service communication |
| **At rest** | Database and object storage encryption — platform-managed keys |
| **Application-level** | Sensitive fields optionally encrypted before persistence |
| **Backups** | Encrypted backup storage |
| **Key management** | Managed key service — rotation supported |
| **Customer-managed keys** | Readiness for enterprise key custody (future) |

Encryption is **enabled by default** — not opt-in for sensitive data.

### 11.4 Secrets Management

| Secret Type | Management |
|-------------|------------|
| **Database credentials** | Managed by platform — not in application config |
| **API keys (integrations)** | Encrypted storage; rotation supported |
| **AI provider credentials** | Centralized — not per-tenant exposed |
| **Signing keys** | Managed key service with rotation |
| **Application secrets** | Environment-injected — never in source control |

| Principle | Rule |
|-----------|------|
| **No hardcoded secrets** | Prohibited in codebase |
| **Least exposure** | Secrets accessible only to consuming service |
| **Rotation** | Supported without downtime where possible |
| **Audit** | Secret access logged |

### 11.5 Security Headers

| Header Category | Purpose |
|-----------------|---------|
| **Content Security Policy** | Restrict script and resource origins |
| **HSTS** | Enforce HTTPS |
| **X-Frame-Options / frame-ancestors** | Clickjacking prevention |
| **X-Content-Type-Options** | MIME sniffing prevention |
| **Referrer-Policy** | Limit referrer leakage |
| **Permissions-Policy** | Restrict browser feature access |

Security headers applied at **edge and application** layers.

### 11.6 Rate Limiting

| Target | Purpose |
|--------|---------|
| **Authentication endpoints** | Brute force prevention |
| **Password recovery** | Abuse prevention |
| **API requests** | Per-identity and per-organization throttling |
| **AI queries** | Cost and abuse control |
| **Export operations** | Mass extraction prevention |
| **Invitation flows** | Spam prevention |

Rate limits are **tenant-aware** where applicable — preventing one tenant from affecting others.

### 11.7 Input Validation

| Tier | Responsibility |
|------|----------------|
| **Edge** | Request size limits; content type validation |
| **Application** | Schema validation; authorization before processing |
| **Domain** | Business invariant enforcement |

| Threat Mitigation | Approach |
|-------------------|----------|
| **Injection** | Parameterized data access; no dynamic query construction from user input |
| **XSS** | Output encoding; CSP; server-first rendering |
| **CSRF** | Token validation on state-changing operations |
| **File upload** | Type validation; size limits; malware scanning readiness |
| **Deserialization** | Strict schema validation |

Presentation validation is **never sufficient alone**.

### 11.8 Threat Protection

| Threat Category | Control |
|-----------------|---------|
| **Account takeover** | MFA, lockout, breach detection, session management |
| **Data exfiltration** | Export permissions, rate limits, audit logging |
| **Privilege escalation** | Least privilege, SoD, authorization on every action |
| **Cross-tenant access** | Multi-layer isolation, monitoring |
| **AI prompt injection** | Permission-filtered retrieval; output validation |
| **Insider threat** | Audit logging, operator access controls |
| **DDoS** | Edge protection; rate limiting |

### 11.9 OWASP Philosophy

OWASP Top 10 categories inform **secure development lifecycle** requirements:

| Category | Architectural Response |
|----------|------------------------|
| **Broken access control** | RBAC + application authorization + RLS defense in depth |
| **Cryptographic failures** | Encryption strategy; no sensitive data in logs |
| **Injection** | Parameterized access; input validation |
| **Insecure design** | Threat modeling per bounded context |
| **Security misconfiguration** | Secure by default; configuration governance |
| **Vulnerable components** | Dependency scanning; patch management |
| **Authentication failures** | MFA, session management, lockout |
| **Software/data integrity** | Immutable audit logs; artifact versioning |
| **Logging failures** | Comprehensive structured logging |
| **SSRF** | Restricted outbound integration patterns |

OWASP alignment is **continuous** — not a one-time checklist.

---

## 12. Audit & Compliance Architecture

The platform's own audit trail must meet the **same rigor** expected of engagement documentation.

*Aligns with PROJECT_BIBLE Part 5 Sections 25–27; Sprint 1 Section 6.2 logging.*

### 12.1 Audit Logs

| Log Store | Content | Mutability |
|-----------|---------|------------|
| **Platform audit log** | Authentication, authorization, professional actions, exports, AI | Immutable |
| **Application log** | Operational diagnostics | Rotating |
| **Security log** | Threat indicators, denials | Immutable retention |
| **Compliance log** | Control operation evidence | Long retention |

Audit log storage is **logically separated** from operational data.

### 12.2 Immutable Events

| Property | Requirement |
|----------|-------------|
| **Append-only** | Events added — never modified |
| **Non-deletable** | No user can delete audit history |
| **Tamper-evident** | Integrity mechanisms detect unauthorized alteration |
| **Non-repudiation** | Actor, timestamp, outcome recorded (TRC-05) |

| Unconditionally Auditable | Cannot Be Disabled |
|---------------------------|-------------------|
| Authentication | Yes |
| Authorization changes | Yes |
| Financial data mutations | Yes |
| Professional artifact changes | Yes |
| Report approval and export | Yes |
| AI interactions | Yes |
| Administrative actions | Yes |

### 12.3 Compliance Logging

Compliance logging produces **control operation evidence** for customer and platform audits.

| Control Domain | Logged Evidence |
|----------------|-----------------|
| **Access control** | Grants, denials, role changes |
| **Change management** | Configuration versions, effective dates |
| **Data handling** | Import, export, retention actions |
| **AI governance** | Retrievals, outputs, dispositions |
| **Incident response** | Security events and resolutions |

### 12.4 Monitoring

| Monitor Type | Purpose |
|--------------|---------|
| **Security monitoring** | Failed auth, privilege escalation attempts, cross-tenant anomalies |
| **Compliance monitoring** | Control drift, policy violations |
| **Operational monitoring** | Availability, performance, error rates |
| **AI monitoring** | Retrieval scope violations, uncited outputs |

Alerts route to **operator and organization administrator** channels per severity.

### 12.5 Data Governance

| Principle | Architecture |
|-----------|--------------|
| **Classification** | Data tagged by sensitivity and domain |
| **Lineage** | Traceability chain preserved architecturally |
| **Minimization** | Collect only necessary professional data |
| **Purpose limitation** | Processing scoped to declared purposes |
| **Ownership** | Customer owns organization data |

### 12.6 Retention

| Retention Class | Governance |
|-----------------|------------|
| **Engagement artifacts** | Per organization policy and regulatory minimum |
| **Platform audit logs** | Extended beyond engagement retention where required |
| **Financial data** | Configurable per organization |
| **Deleted user identity** | Attribution preserved; PII minimized per request |
| **Backup retention** | Aligned with recovery objectives |

Retention policies are **organization-configurable** within regulatory minimums.

### 12.7 Legal Hold

| Aspect | Architecture |
|--------|--------------|
| **Trigger** | Organization administrator or legal process |
| **Effect** | Suspends deletion and archive for scoped artifacts |
| **Scope** | Engagement, entity, or organization level |
| **Audit** | Hold placement and release logged |
| **Override** | Retention deletion blocked while hold active |

### 12.8 Privacy

| Principle | Architecture |
|-----------|--------------|
| **Privacy by design** | Embedded — not checkbox compliance |
| **Tenant data sovereignty** | No training on tenant data without consent |
| **Pseudonymization** | Analytics do not expose client-identifiable information |
| **Transparency** | Processing documented; user-informed |
| **Professional confidentiality** | Exceeds legal minimums where profession requires |

### 12.9 GDPR Readiness

| Principle | Architectural Support |
|-----------|----------------------|
| **Lawfulness and transparency** | Documented processing purposes |
| **Purpose limitation** | Scoped data processing |
| **Data minimization** | Architecture avoids unnecessary collection |
| **Accuracy** | Correction workflows |
| **Storage limitation** | Retention with deletion on expiry |
| **Integrity and confidentiality** | Security architecture |
| **Accountability** | Immutable audit model |
| **Data subject rights** | Access, rectification, erasure request handling architecture |

Platform **enables** GDPR compliance — customer remains controller for client data.

### 12.10 SOC 2 Readiness

| Trust Service Criteria | Architectural Control |
|------------------------|----------------------|
| **Security** | Zero Trust, defense in depth, monitoring |
| **Availability** | SLA architecture, health checks, DR readiness |
| **Processing integrity** | Validation workflows, idempotent operations |
| **Confidentiality** | Tenant isolation, encryption, access control |
| **Privacy** | Privacy by design, GDPR readiness |

SOC 2 Type II requires **operational evidence** over time — architecture enables control operation logging.

### 12.11 ISO 27001 Readiness

| ISO Domain | Architectural Alignment |
|------------|------------------------|
| **Information security policies** | Organization-configurable security policies |
| **Access control** | IAM architecture (Sprint 2 Section 8) |
| **Cryptography** | Encryption strategy |
| **Operations security** | Monitoring, logging, change management |
| **Supplier relationships** | Third-party AI and infrastructure governance |
| **Incident management** | Security monitoring and response architecture |
| **Business continuity** | DR architecture (future sprint) |

ISO 27001 alignment positions the platform for **information security management system** evidence.

---

## 13. Architecture Review — Sprint 2

Consistency review of Sprint 2 against Sprint 1, PROJECT_BIBLE (Parts 5–6), and MASTER_PRD (Parts 2–3). Previous sections not modified.

### 13.1 Sprint 1 Consistency

| Sprint 1 Element | Sprint 2 Alignment |
|------------------|-------------------|
| AP-07 Tenant isolation | Section 9 — full isolation model |
| AP-10 AI boundary | Section 9.7 AI retrieval partition |
| AP-11 No training on tenant data | Section 9.8, 12.8 |
| Identity & Access bounded context | Section 8 |
| Tenancy & Administration context | Section 9 |
| Application Layer authorization | Section 10.3 |
| RLS defense in depth | Sections 9.7, 11.2 |
| MC-02 Security architecture | Addressed — Section 11 |
| TG-05 ABAC readiness | Addressed — Section 10.2 |
| Immutable audit log (Section 6.2) | Section 12.2 |

### 13.2 Constitutional Alignment

| Area | Status |
|------|--------|
| PROJECT_BIBLE Part 5 Security Philosophy | Aligned — Section 11 |
| PROJECT_BIBLE Part 5 IAM | Aligned — Sections 8, 10 |
| PROJECT_BIBLE Part 5 Auditability | Aligned — Section 12 |
| PROJECT_BIBLE Part 5 Compliance | Aligned — Section 12.9–12.11 |
| ORG-01 Tenancy isolation | Aligned — Section 9 |
| USR-05 MFA elevated roles | Aligned — Section 8.6 |
| AI-04 Scope boundary | Aligned — Sections 9.7, 10.7 |
| TRC-05 Non-repudiation | Aligned — Section 12.2 |

### 13.3 Security Risks

| ID | Risk | Severity | Mitigation |
|----|------|----------|------------|
| **SR-01** | RLS policy gaps on new tables | Critical | Mandatory RLS review gate; automated policy tests |
| **SR-02** | Permission cache staleness after revocation | High | Short TTL; explicit invalidation on grant change |
| **SR-03** | SSO misconfiguration exposing wrong tenant | High | Organization binding validation on federation |
| **SR-04** | AI retrieval cross-tenant embedding leakage | Critical | Tenant-partitioned vector indexes |
| **SR-05** | Break-glass operator access abuse | High | Enhanced logging; time-bound; dual control |
| **SR-06** | Session fixation or token theft | Medium | Secure token rotation; binding; short-lived tokens |
| **SR-07** | Insufficient step-up for export operations | High | MFA step-up on export per EXP-03 |

### 13.4 Architecture Risks

| ID | Risk | Severity | Mitigation |
|----|------|----------|------------|
| **AR-08** | Tenant context not propagated to all background jobs | Critical | Mandatory context middleware on workers |
| **AR-09** | ABAC complexity without policy management UI | Medium | Defer ABAC policies; RBAC sufficient initially |
| **AR-10** | Multi-workspace user permission explosion | Medium | Permission resolution optimization; caching with invalidation |
| **AR-11** | Legal hold conflicts with retention automation | Medium | Hold check before any deletion operation |
| **AR-12** | Compliance log volume at enterprise scale | Medium | Tiered storage; archival strategy (Sprint 3) |

### 13.5 Future Security Improvements

| ID | Improvement | Target Sprint |
|----|-------------|---------------|
| **FSI-01** | Formal threat modeling per bounded context | Sprint 3 |
| **FSI-02** | Customer-managed encryption keys (CMEK) | Sprint 4 |
| **FSI-03** | SCIM automated provisioning | Sprint 3 |
| **FSI-04** | Hardware security key enforcement option | Sprint 3 |
| **FSI-05** | Continuous access certification workflows | Sprint 4 |
| **FSI-06** | SIEM integration for enterprise customers | Sprint 4 |
| **FSI-07** | Penetration testing automation in CI | Sprint 3 |
| **FSI-08** | Data loss prevention on export | Sprint 4 |

### 13.6 Enterprise Readiness

| Capability | Sprint 2 Status | Gap |
|------------|-----------------|-----|
| **Enterprise SSO** | Architected — Section 8.9 | IdP certification matrix pending |
| **MFA for elevated roles** | Architected — Section 8.6 | — |
| **Tenant isolation** | Architected — Section 9 | Automated verification suite pending |
| **SOC 2 readiness** | Architected — Section 12.10 | Operational evidence collection pending |
| **ISO 27001 readiness** | Architected — Section 12.11 | ISMS documentation pending |
| **GDPR readiness** | Architected — Section 12.9 | DSR workflow detail pending |
| **ABAC readiness** | Architected — Section 10.2 | Policy engine selection pending |
| **Device trust** | Readiness — Section 8.5 | MDM integration pending |
| **Audit log export** | Architected — Section 12.1 | Format specification pending |
| **Legal hold** | Architected — Section 12.7 | — |

### 13.7 Review Conclusion

SYSTEM_ARCHITECTURE Sprint 2 is **consistent with Sprint 1, PROJECT_BIBLE, and MASTER_PRD**. It defines identity, multi-tenant isolation, authorization, security, and compliance architecture appropriate for an enterprise audit and IFRS reporting platform. SR-01 through SR-07, AR-08 through AR-12, and FSI-01 through FSI-08 guide subsequent architecture sprints.

---

## Document Control — Sprint 2

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.2.0 | 2026-06-30 | Chief Software Architect | Sprint 2 — Identity, Tenancy, Authorization, Security & Compliance; Architecture Review Sprint 2 |

---

*End of Sprint 2.*

---

# Sprint 3 — Storage, Async Processing, Events, Notifications & Integration

*Continues SYSTEM_ARCHITECTURE.md — technical realization only.*

---

## Table of Contents — Sprint 3

14. [Storage Architecture](#14-storage-architecture)
15. [Background Processing Architecture](#15-background-processing-architecture)
16. [Event-Driven Architecture](#16-event-driven-architecture)
17. [Notification Architecture](#17-notification-architecture)
18. [Integration Architecture](#18-integration-architecture)
19. [Architecture Review — Sprint 3](#19-architecture-review--sprint-3)

---

## 14. Storage Architecture

Object storage is the **durability plane** for professional artifacts that exceed relational store suitability — documents, evidence originals, generated reports, and transient processing payloads. Metadata and lineage remain authoritative in the transactional store; storage holds bytes with governed access.

*Bounded context: Evidence & Documents, Export. Aligns with Sprint 1 Section 5.7; Sprint 2 Sections 9.7, 11.3, 12.6–12.7; PROJECT_BIBLE Core Principles 3, 6; AE-02, FD-01.*

### 14.1 Storage Philosophy

| Principle | Architectural Expression |
|-----------|-------------------------|
| **Metadata in database, bytes in object store** | Relational store owns index, lineage, permissions; object store owns content |
| **Tenant isolation first** | Every object scoped to organization; engagement-scoped where professional context requires |
| **Immutability for evidence** | Original uploads write-once — never overwritten (AE-02) |
| **Source preservation** | Imported files retained alongside derived representations (FD-01) |
| **Integrity by design** | Content hashing at ingest; verification on sensitive access |
| **Lifecycle governance** | Transitions driven by policy — not ad hoc deletion |
| **No generic file share** | Storage serves audit and reporting workflows — not commodity drive semantics |

```
Professional Action
        ↓
Authorization + Tenant Context
        ↓
Metadata Record (transactional store)
        ↓
Object Write / Read (object store)
        ↓
Audit Event (immutable log)
```

### 14.2 Object Storage

| Aspect | Architecture |
|--------|--------------|
| **Foundation** | Managed object storage with organization-scoped access policies |
| **Addressing** | Opaque object keys — no predictable cross-tenant enumeration |
| **Access model** | Short-lived signed access for authorized retrieval; direct public access prohibited |
| **Replication** | Platform-managed durability within deployment region |
| **Encryption** | At-rest encryption default; in-transit TLS mandatory |

Object storage is **infrastructure** — authorization decisions occur in Application Layer before signed URL issuance or proxy retrieval.

### 14.3 Document Storage

| Document Class | Scope | Mutability |
|----------------|-------|------------|
| **Working paper attachments** | Engagement | Versioned — prior versions retained |
| **Methodology templates** | Workspace / Organization | Versioned configuration artifacts |
| **Client correspondence** | Engagement | Immutable after finalization |
| **Knowledge articles** | Organization / Workspace | Versioned with effective dating |

Documents carry **classification metadata** — sensitivity, source type, engagement linkage — stored authoritatively outside the object payload.

### 14.4 Evidence Storage

Evidence storage enforces **professional integrity** requirements beyond general document storage.

| Requirement | Architecture |
|-------------|--------------|
| **Write-once originals** | Initial upload immutable — supersession creates new object, retains prior |
| **Engagement containment** | Evidence objects bound to engagement scope |
| **Client-provided flag** | Source attribution recorded at ingest |
| **Hash verification** | Integrity check on access for inspection readiness |
| **Linkage index** | Bidirectional references to working papers and procedures in transactional store |
| **No hard delete** | Archive transition only — linkage history preserved |

```
Upload → Hash → Immutable Original Object
                    ↓
              Metadata + Linkage Index
                    ↓
         Review → Approve → Reference in Conclusion
                    ↓
              Archive (read-only)
```

### 14.5 Report Storage

| Report Class | Lifecycle | Access |
|--------------|-----------|--------|
| **Draft compositions** | Mutable until approval gate | Engagement team |
| **Approved statements** | Immutable snapshot at approval | Role-gated read |
| **Generated exports** | Immutable at generation | Export permission + MFA step-up where required |
| **Regulatory packages** | Immutable with embedded provenance metadata | Elevated export controls |

Approved reports are **point-in-time artifacts** — subsequent edits create new versions; prior approved states remain retrievable.

### 14.6 Image Storage

| Use Case | Treatment |
|----------|-----------|
| **Organization branding** | Organization-scoped; lower sensitivity |
| **Scanned evidence** | Evidence storage rules apply |
| **Chart and diagram exports** | Linked to source report version |
| **User avatars** | User-scoped; separate from engagement evidence |

Images embedded in professional artifacts retain **lineage to parent artifact version**.

### 14.7 Temporary Storage

| Staging Class | Purpose | Lifecycle |
|---------------|---------|-----------|
| **Import intermediates** | Parsed file staging during validation | Auto-expire after job completion or failure timeout |
| **Export assembly** | Multi-part report composition | Delete after delivery or expiry |
| **Upload resumption** | Large file chunk assembly | Expire on completion or abandonment |
| **AI processing scratch** | Transient extraction payloads | Purge after job — not indexed for retrieval |

Temporary objects reside in **dedicated staging namespaces** with aggressive lifecycle expiration — never mixed with evidence or approved report namespaces.

### 14.8 Archive Storage

| Aspect | Architecture |
|--------|--------------|
| **Trigger** | Engagement closure, retention policy transition, administrator archive action |
| **Effect** | Read-only at application layer; storage tier may transition to lower-cost class |
| **Legal hold** | Archive transition blocked or suspended while hold active |
| **Retrieval** | Authorized inspection and export — not interactive editing |
| **Cross-tier** | Hot → warm → cold progression per organization retention schedule |

Archive is a **state**, not deletion. Archived content remains discoverable through metadata index.

### 14.9 Storage Lifecycle

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Active  │ →  │ Versioned│ →  │ Approved │ →  │ Archived │ →  │ Retained │
│  (draft) │    │ (working)│    │(immutable)│   │(read-only)│   │(policy end)│
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
     │               │                │                │                │
     └───────────────┴────────────────┴────────────────┴────────────────┘
                              Legal Hold may suspend any transition
```

| Transition | Governance |
|------------|------------|
| **Active → Versioned** | User save or auto-save creates version record |
| **Working → Approved** | Approval workflow gate — snapshot object created |
| **Approved → Archived** | Engagement closure or retention policy |
| **Archived → Purged** | Only after retention expiry and no legal hold — metadata tombstone retained |

Lifecycle transitions emit **domain events** and **audit log entries**.

### 14.10 Storage Security

| Control | Application |
|---------|-------------|
| **Tenant isolation** | Organization-scoped bucket policies — Sprint 2 Section 9.7 |
| **Authorization gate** | Application Layer validates permission before any retrieval |
| **Signed access** | Time-limited, scope-bound access tokens for direct retrieval |
| **Encryption** | At-rest and in-transit — Sprint 2 Section 11.3 |
| **Malware readiness** | Upload scanning architecture for untrusted ingress |
| **Export controls** | Step-up authentication for bulk evidence and report export |
| **Operator access** | Break-glass with enhanced audit — no standing broad access |

### 14.11 Storage Versioning

| Versioning Model | Applies To |
|------------------|------------|
| **Immutable original + superseding upload** | Evidence re-upload |
| **Sequential version chain** | Working papers, templates, draft reports |
| **Approval snapshot** | Point-in-time frozen copy at approval event |
| **Import version chain** | Each import submission preserved (FD-01) |

Version metadata records **actor, timestamp, change reason, and parent version** — enabling diff and historical reconstruction.

### 14.12 Retention Strategy

| Tier | Storage Class | Retention Driver |
|------|---------------|------------------|
| **Hot** | Active engagement artifacts | Engagement in progress |
| **Warm** | Closed engagement file | Organization retention policy |
| **Cold** | Long-term archive | Regulatory minimum + firm policy |
| **Compliance** | Audit logs, export records | Extended beyond engagement — Sprint 2 Section 12.6 |

Retention enforcement is **automated** via scheduled lifecycle jobs — with legal hold and organization policy precedence. Addresses Sprint 2 risk AR-12 through explicit tiered storage model.

---

## 15. Background Processing Architecture

Interactive requests serve **immediate professional actions**. Background processing serves **volume, duration, and reliability** requirements that must never block the user interface.

*Bounded contexts: Financial Data, Export, AI & Intelligence, Evidence & Documents. Aligns with Sprint 1 Sections 5.5–5.6; Sprint 2 Section 9.10 tenant context.*

### 15.1 Background Jobs

| Job Category | Initiator | Characteristic |
|--------------|-----------|----------------|
| **User-initiated** | Professional action triggers async work | Progress visible to initiator |
| **System-initiated** | Domain event or schedule triggers work | Operator visibility on failure |
| **Integration-initiated** | External webhook or poll triggers ingestion | Idempotent processing mandatory |

Every job carries **organization context, correlation identifier, and initiating actor** — propagated from enqueue through completion.

### 15.2 Queue Philosophy

| Principle | Expression |
|-----------|------------|
| **Decouple request from execution** | API accepts work; worker performs work |
| **At-least-once delivery** | Jobs may be delivered more than once — handlers must be idempotent |
| **Tenant fairness** | Per-organization concurrency limits prevent noisy-neighbor starvation |
| **Visibility** | Job state queryable by authorized initiator |
| **Failure isolation** | One job failure does not corrupt unrelated jobs |

```
User Action → Enqueue Job (with tenant context)
                    ↓
              Priority Queue
                    ↓
              Worker Pool (tenant-aware)
                    ↓
         Success → Event + Notification
         Failure → Retry → DLQ
```

### 15.3 Job Priorities

| Priority | Workload Examples | Scheduling Posture |
|----------|-------------------|-------------------|
| **Critical** | Security-triggered session termination, legal hold enforcement | Immediate — dedicated lane |
| **High** | User-waiting export preview, approval-dependent generation | Next available worker |
| **Standard** | Import validation, indexing, notification dispatch | Fair-queued per tenant |
| **Low** | Embedding generation, analytics aggregation, retention sweeps | Backfill when capacity available |
| **Deferred** | Non-urgent maintenance, batch reindex | Off-peak scheduling |

Priority prevents **bulk import or AI batch** from starving interactive export or notification delivery.

### 15.4 Retry Strategy

| Failure Class | Retry Behavior |
|---------------|----------------|
| **Transient infrastructure** | Exponential backoff with jitter; capped attempts |
| **Rate-limited external** | Respect provider retry-after; extended backoff |
| **Validation failure** | No retry — terminal failure with user-actionable message |
| **Authorization failure** | No retry — security event logged |
| **Partial import failure** | Row-level failure recorded; job completes with error summary |

| Parameter | Posture |
|-----------|---------|
| **Maximum attempts** | Configurable per job type |
| **Backoff** | Exponential with jitter — prevents thundering herd |
| **Idempotency key** | Required for financial posting, export, integration sync |

### 15.5 Dead Letter Queue

| Aspect | Architecture |
|--------|--------------|
| **Purpose** | Capture jobs exhausted of retries for investigation |
| **Visibility** | Operator dashboard; organization administrator for tenant-scoped failures |
| **Replay** | Manual or automated replay after root cause resolution |
| **Alerting** | Operator notification on DLQ threshold breach |
| **Audit** | DLQ admission, investigation, and replay logged |

DLQ is **not a graveyard** — it is an operational accountability mechanism.

### 15.6 Long Running Jobs

| Characteristic | Architecture |
|----------------|--------------|
| **Checkpointing** | Progress persisted — resumable after worker failure |
| **Heartbeat** | Stale job detection and reassignment |
| **Timeout** | Maximum duration per job type — prevents runaway execution |
| **Cancellation** | User or administrator may cancel in-flight job where safe |
| **Progress reporting** | Percentage or phase reporting via realtime channel |

Long-running jobs include large imports, full engagement export packages, and population-wide AI analysis.

### 15.7 Report Generation Jobs

| Phase | Processing |
|-------|------------|
| **Composition** | Assemble approved content from transactional store |
| **Rendering** | Transform to target format (PDF, DOCX, Excel, XBRL readiness) |
| **Provenance embedding** | Attach metadata linking to source versions |
| **Storage** | Write immutable output to report storage namespace |
| **Notification** | Alert initiator on completion or failure |

Report generation is **idempotent** — duplicate job with same export request produces single deliverable.

### 15.8 AI Processing Jobs

| Workload | Isolation |
|----------|-----------|
| **Document indexing** | Tenant-partitioned embedding pipeline |
| **Population analysis** | Engagement-scoped data only |
| **Anomaly detection** | Read-only domain data; draft output only |
| **Completion review** | Batch procedure assessment |

AI jobs enforce **permission boundary of initiating user** at retrieval time — not elevated service credentials. Addresses Sprint 2 risk SR-04 through partitioned processing.

### 15.9 Import Jobs

| Stage | Processing |
|-------|------------|
| **Ingest** | Store original file immutably |
| **Parse** | Format detection and structural extraction |
| **Validate** | Business rule validation against entity and period |
| **Stage** | Validated rows staged for user review |
| **Commit** | User-authorized posting to authoritative financial data |

Import jobs preserve **source file immutability** regardless of validation outcome.

### 15.10 Notification Jobs

Notification dispatch is **decoupled** from domain event handlers — see Section 17. Background workers deliver batched and individual notifications without blocking event processing.

### 15.11 Scheduling Strategy

| Schedule Type | Examples | Invocation |
|---------------|----------|------------|
| **Cron — platform** | Session cleanup, expired invitation removal | Platform operator governed |
| **Cron — organization** | Retention enforcement, deadline alerts | Organization policy driven |
| **Event-triggered** | Import complete → notify reviewer | Domain event handler enqueues |
| **Deferred retry** | Failed integration poll | Backoff scheduler |

Scheduled jobs invoke **Application Layer use cases** — not direct storage or database mutations bypassing domain rules.

---

## 16. Event-Driven Architecture

Events are the **nervous system** of the modular monolith — enabling loose coupling between bounded contexts while preserving transactional integrity within each context.

*Aligns with Sprint 1 Sections 2.3, 5.9, AP-06, AP-08; PROJECT_BIBLE Core Principle 18 (idempotency).*

### 16.1 Architecture Philosophy

| Principle | Expression |
|-----------|------------|
| **Events announce facts** | Events describe what happened — not commands to other contexts |
| **Single writer** | Only owning bounded context mutates aggregate state |
| **React, don't reach** | Cross-context effects via event handlers — not cross-boundary direct calls |
| **Transactional outbox** | Events published atomically with state change |
| **Eventually consistent across contexts** | Strong consistency within aggregate; eventual across handlers |

The modular monolith uses **in-process event dispatch** initially — with contract design enabling future external message bus extraction.

### 16.2 Domain Events

Domain events originate **within a bounded context** when aggregate state changes.

| Example Event | Owning Context | Fact Announced |
|---------------|----------------|----------------|
| **ImportValidated** | Financial Data | Import passed validation — ready for review |
| **EvidenceApproved** | Evidence & Documents | Evidence item approved for conclusion reference |
| **ApprovalCompleted** | Governance & Approvals | Approval gate satisfied |
| **EngagementClosed** | Assurance (Audit) | Engagement transitioned to closed state |
| **ExportGenerated** | Export | Deliverable produced and stored |

Domain events carry **tenant context, aggregate identifier, version, correlation identifier, and timestamp**.

### 16.3 Application Events

Application events represent **use case completion** at the Application Layer boundary — may compose multiple domain events.

| Distinction | Domain Event | Application Event |
|-------------|--------------|-------------------|
| **Origin** | Aggregate state change | Use case orchestration |
| **Granularity** | Single aggregate fact | May span multiple aggregates |
| **Consumers** | Cross-context handlers | Presentation, notifications, metrics |

### 16.4 Integration Events

Integration events cross the **platform boundary** — inbound from external systems or outbound to webhooks.

| Direction | Example | Handling |
|-----------|---------|----------|
| **Inbound** | ERP trial balance available | Edge ingress → validate → enqueue import job |
| **Outbound** | Engagement closed | Notify customer webhook subscribers |
| **Inbound** | Identity provider user deactivated | Federation hook → session termination |

Integration events pass through **anti-corruption layers** — external payloads never enter domain models directly.

### 16.5 Event Bus

```
┌─────────────────────────────────────────────────────────────┐
│                    In-Process Event Bus                      │
│         (future extraction: external message broker)         │
├─────────────────────────────────────────────────────────────┤
│  Publisher (bounded context)  →  Outbox  →  Dispatcher     │
├─────────────────────────────────────────────────────────────┤
│  Handlers: Notification · Indexing · Integration · Metrics   │
└─────────────────────────────────────────────────────────────┘
```

| Property | Initial Architecture | Evolution Path |
|----------|---------------------|----------------|
| **Transport** | In-process dispatch | External broker when scale requires |
| **Durability** | Transactional outbox | Broker persistence on extraction |
| **Ordering** | Per-aggregate ordering guarantee | Partition key on extraction |
| **Schema** | Versioned event contracts | Backward-compatible evolution |

### 16.6 Publish / Subscribe

| Pattern | Application |
|---------|-------------|
| **Single publisher, multiple subscribers** | ApprovalCompleted → notification, audit log, dashboard refresh |
| **Selective subscription** | Handlers register for event types they own |
| **No broadcast to presentation** | UI receives derived notifications — not raw domain events |
| **Handler isolation** | Handler failure does not roll back originating transaction |

Subscribers **never mutate the publishing context's aggregates**.

### 16.7 Event Ordering

| Scope | Guarantee |
|-------|-----------|
| **Within aggregate** | Events processed in emission order |
| **Across aggregates** | No global ordering guarantee |
| **Per tenant partition** | Ordering preserved for related aggregate chain where causally linked |
| **Integration ingress** | Sequence numbers or timestamps for reconciliation |

Consumers requiring strict ordering subscribe to **single partition key** — typically aggregate identifier.

### 16.8 Idempotency

| Mechanism | Application |
|-----------|-------------|
| **Event identifier** | Unique per emitted event — duplicate delivery detected |
| **Handler idempotency store** | Processed event IDs recorded per handler |
| **Business idempotency key** | Import, export, integration sync keyed by client request identifier |
| **Outbox deduplication** | Single emission per transactional state change |

Idempotency is **mandatory** for handlers affecting financial state, exports, and external notifications.

### 16.9 Event Replay

| Scenario | Approach |
|----------|----------|
| **Handler bug fix** | Replay events from stored outbox or event log from checkpoint |
| **New handler registration** | Historical replay for indexing or analytics — scoped by tenant |
| **Disaster recovery** | Rebuild read models from event store and transactional state |
| **Governance** | Replay operations audited; tenant-scoped authorization |

Replay is an **operator-governed** capability — not available to tenant users.

### 16.10 Failure Handling

```
Event Emitted → Handler Invoked
                    ↓
              Success → Acknowledge
              Failure → Retry (with backoff)
                    ↓
              Exhausted → DLQ + Alert
                    ↓
              Originating transaction NOT rolled back
```

| Rule | Rationale |
|------|-----------|
| **Handler failure isolated** | Source transaction committed — eventual consistency |
| **Retry with backoff** | Transient failures self-heal |
| **Poison message quarantine** | DLQ prevents infinite retry loops |
| **Compensating actions** | Explicit sagas for multi-step cross-context workflows where required |

---

## 17. Notification Architecture

Notifications deliver **timely awareness** of professional actions requiring attention — without becoming a distraction or a security bypass.

*Aligns with MASTER_PRD Section 12.9; Sprint 1 Section 5.8 Realtime; Sprint 2 Section 8.4 session model.*

### 17.1 In-App Notifications

| Aspect | Architecture |
|--------|--------------|
| **Delivery** | Realtime channel to authenticated session |
| **Persistence** | Notification inbox with read/unread state |
| **Deep linking** | Notification navigates to originating object |
| **Scope** | User-scoped — never cross-user within tenant |
| **Retention** | Configurable inbox retention per organization |

In-app notifications are the **primary channel** — always enabled for professional workflow events.

### 17.2 Email Notifications

| Aspect | Architecture |
|--------|--------------|
| **Provider** | Transactional email service — platform-managed |
| **Branding** | Organization logo and sender name per organization policy |
| **Content** | Template-rendered — no sensitive data in subject lines |
| **Security events** | Non-disableable — invitation, lockout, password change |
| **Digest mode** | Immediate, daily, or weekly aggregation per user preference |

Email is **asynchronous** — dispatched via notification jobs.

### 17.3 Push Notifications (Future)

| Aspect | Readiness Architecture |
|--------|------------------------|
| **Mobile client** | Device token registration per user |
| **Payload** | Minimal — deep link to in-app destination |
| **Opt-in** | User and organization policy governed |
| **Security** | No sensitive content in push payload |

Push channel is **architecturally reserved** — provider abstraction supports future activation without notification model rework.

### 17.4 SMS Readiness (Future)

| Aspect | Readiness Architecture |
|--------|------------------------|
| **Use cases** | MFA delivery, critical security alerts |
| **Provider abstraction** | SMS gateway behind notification service interface |
| **Regulatory** | Opt-in and regional compliance considerations |
| **Cost control** | Rate limiting and organization policy gates |

SMS is **not day-one** — architecture accommodates without hard dependency.

### 17.5 Notification Preferences

| Category | User Configurable | Organization Override |
|----------|-------------------|----------------------|
| **Review assignments** | Channel and digest | Minimum for compliance roles |
| **Approval requests** | Channel and digest | — |
| **Engagement status** | Channel and digest | — |
| **Security events** | Not disableable | Enforced |
| **Marketing** | Not applicable | B2B platform — no marketing notifications |

Preferences stored per user; **security notifications bypass** user opt-out.

### 17.6 Templates

| Template Tier | Governance |
|---------------|------------|
| **Platform base** | Operator-maintained — localization ready |
| **Organization override** | Branding injection — logo, footer, sender |
| **Workspace** | Limited customization where product permits |

Templates are **versioned** — changes effective forward; prior sent notifications retain sent content record.

### 17.7 Delivery Tracking

| State | Meaning |
|-------|---------|
| **Queued** | Job enqueued for dispatch |
| **Sent** | Provider accepted |
| **Delivered** | Provider confirmed delivery (where supported) |
| **Failed** | Provider rejection — retry eligible |
| **Bounced** | Invalid recipient — user record flagged |

Delivery state visible to **administrators for security notifications**; general delivery metrics aggregated for operations.

### 17.8 Retry Strategy

| Failure Type | Behavior |
|--------------|----------|
| **Provider transient** | Retry with backoff — up to policy limit |
| **Invalid address** | Terminal — administrator alert for security notifications |
| **Rate limited** | Respect provider limits; defer to digest |
| **User deactivated** | Suppress — no delivery to deactivated accounts |

Notification retry is **independent** of originating domain event — duplicate notification prevented by idempotency key.

### 17.9 Notification Audit

| Audited Event | Retention |
|---------------|-----------|
| **Notification generated** | Actor, recipient, type, object reference |
| **Channel selected** | Preference and policy applied |
| **Delivery outcome** | Sent, failed, bounced |
| **Security notification** | Extended retention |

Notification audit supports **security investigation** and **professional accountability** — who was informed and when.

---

## 18. Integration Architecture

Integration connects the platform to **customer systems of record** — ERP, accounting, and document ecosystems — without compromising domain integrity or tenant isolation.

*Bounded context: Integration. Aligns with PROJECT_BIBLE non-goal (not an ERP); MASTER_PRD Part 5 Financial Data Import; ENT-05.*

### 18.1 Integration Philosophy

| Principle | Expression |
|-----------|------------|
| **Consume, don't compete** | Platform ingests ERP data — does not replace ERP |
| **Anti-corruption layer** | External models translated at boundary — never enter domain |
| **Source preservation** | Original extracts immutable alongside normalized data |
| **Workspace scope** | Integration connections configured per workspace |
| **Idempotent sync** | Safe retry without duplicate posting |
| **Human authorization** | Automated feeds stage for review — not silent posting |
| **Certification path** | Connectors validated against platform integration standards |

```
External System → Ingress (Edge) → Anti-Corruption Layer
                                        ↓
                              Staging / Import Job
                                        ↓
                              Validation → User Review → Domain Post
```

### 18.2 REST Integrations

| Pattern | Application |
|---------|-------------|
| **Outbound pull** | Scheduled or on-demand extraction from customer REST endpoints |
| **Credential storage** | Encrypted per-connection secrets — Sprint 2 Section 11.4 |
| **Pagination** | Cursor or offset handling for large datasets |
| **Rate respect** | Customer system limits honored with backoff |
| **Error mapping** | External errors translated to professional-actionable messages |

REST is the **default integration protocol** for ERP and accounting system connectivity.

### 18.3 Webhook Strategy

| Direction | Architecture |
|-----------|--------------|
| **Inbound webhooks** | Edge ingress validates signature, tenant binding, and payload schema |
| **Outbound webhooks** | Customer-registered endpoints notified on platform events |
| **Retry** | Outbound delivery with exponential backoff and DLQ |
| **Subscription governance** | Workspace administrator registers endpoints |
| **Security** | HMAC signature verification; TLS required |

Webhooks are **integration events** — thin ingress, heavy processing in workers.

### 18.4 ERP Connectors

ERP connectors are **adapter implementations** behind a unified integration contract.

| Connector Capability | Contract |
|---------------------|----------|
| **Authentication** | OAuth, API key, or certificate — per ERP |
| **Entity discovery** | Chart of accounts, periods, entities |
| **Trial balance extraction** | Period-scoped financial data pull |
| **General ledger extraction** | Transaction-level detail where supported |
| **Incremental sync** | Change detection since last successful sync |
| **Health check** | Connection test and last-sync status |

Connectors produce **normalized staging payloads** — domain posting occurs only after validation and authorization.

### 18.5 SAP

| Aspect | Architecture |
|--------|--------------|
| **Deployment models** | S/4HANA Cloud, on-premise via secure connectivity |
| **Data scope** | Trial balance, GL extract, chart of accounts |
| **Extraction** | REST/OData and file-based export profiles |
| **Mapping** | ERP account to platform classification mapping — workspace configuration |
| **Maturity** | File import day one; API connector medium-term |

### 18.6 Oracle

| Aspect | Architecture |
|--------|--------------|
| **Products** | Oracle Fusion Cloud, E-Business Suite export profiles |
| **Data scope** | Trial balance, GL, subsidiary balances |
| **Extraction** | REST API and structured file export |
| **Multi-entity** | Legal entity and ledger dimension mapping |
| **Maturity** | File import day one; API connector medium-term |

### 18.7 Microsoft Dynamics

| Aspect | Architecture |
|--------|--------------|
| **Products** | Dynamics 365 Finance, Business Central |
| **Data scope** | Trial balance, GL transactions, dimensions |
| **Extraction** | OData API and Excel export profiles |
| **Dimension mapping** | Department, project, cost center alignment |
| **Maturity** | File import day one; API connector medium-term |

### 18.8 1C

| Aspect | Architecture |
|--------|--------------|
| **Market** | Primary CIS and Eastern European deployments |
| **Data scope** | Trial balance, account analysis exports |
| **Extraction** | Structured file export profiles (native 1C export formats) |
| **Localization** | Currency and chart of accounts alignment for regional standards |
| **Maturity** | File import day one; API connector per regional demand |

### 18.9 QuickBooks

| Aspect | Architecture |
|--------|--------------|
| **Products** | QuickBooks Online |
| **Data scope** | Trial balance, account list, transaction summary |
| **Extraction** | OAuth-connected API and report export |
| **Segment** | Small and mid-market practices |
| **Maturity** | API connector near-term priority for SMB segment |

### 18.10 Xero

| Aspect | Architecture |
|--------|--------------|
| **Products** | Xero cloud accounting |
| **Data scope** | Trial balance, chart of accounts, journals |
| **Extraction** | OAuth-connected API |
| **Segment** | International SMB and mid-market |
| **Maturity** | API connector near-term priority |

### 18.11 Future Integration SDK

| Capability | Purpose |
|------------|---------|
| **Certified partner SDK** | Third-party connector development against published contracts |
| **Sandbox environment** | Partner testing without production tenant access |
| **Certification program** | Validation of security, idempotency, and error handling |
| **Marketplace** | Certified connectors discoverable per organization |
| **Extension points** | Webhook subscriptions, custom field mapping, staging hooks |

SDK enables **ecosystem growth** without platform team building every connector.

### 18.12 API Gateway Philosophy

| Principle | Expression |
|-----------|------------|
| **Single ingress** | All external traffic through governed gateway layer |
| **Authentication first** | No unauthenticated domain access |
| **Tenant binding** | Organization context established at ingress |
| **Rate limiting** | Per-tenant and per-integration throttling — Sprint 2 Section 11.6 |
| **Request validation** | Schema validation before Application Layer |
| **Observability** | Correlation identifier assigned at edge |
| **Thin edge** | Gateway routes and validates — does not host domain logic |

Gateway is the **trust boundary** between external systems and the modular monolith.

---

## 19. Architecture Review — Sprint 3

Consistency review of Sprint 3 against Sprints 1–2, PROJECT_BIBLE, and MASTER_PRD. Previous sections not modified.

### 19.1 Sprint 1–2 Consistency

| Prior Sprint Element | Sprint 3 Alignment |
|---------------------|-------------------|
| Sprint 1 Section 5.5 Background Workers | Section 15 — full processing architecture |
| Sprint 1 Section 5.7 Storage | Section 14 — expanded storage taxonomy |
| Sprint 1 Section 5.9 Event-driven Services | Section 16 — complete event model |
| Sprint 1 Section 5.10 Integration Services | Section 18 — connector and gateway architecture |
| Sprint 1 AP-06 Events only cross boundaries | Section 16.1 — reinforced |
| Sprint 1 AP-08 Contract-based integration | Section 18.1 — anti-corruption layers |
| Sprint 2 Section 9.7 Storage isolation | Section 14.10 |
| Sprint 2 Section 11.3 Encryption | Section 14.10 |
| Sprint 2 Section 12.6 Retention | Section 14.12 |
| Sprint 2 AR-08 Tenant context in jobs | Section 15.1 — mandatory propagation |
| Sprint 2 AR-12 Tiered storage | Section 14.8, 14.12 — addressed |
| Sprint 2 SR-04 AI partition | Section 15.8 — tenant-scoped AI jobs |
| Sprint 2 FSI-01 Threat modeling | Section 19.5 — scheduled |

### 19.2 Constitutional Alignment

| Rule / Principle | Sprint 3 Expression |
|------------------|---------------------|
| Core Principle 3 — Nothing permanently deleted | Section 14.9 — archive not delete |
| Core Principle 6 — Source data sacred | Sections 14.4, 15.9, 18.1 |
| Core Principle 18 — Idempotency | Sections 15.4, 16.8 |
| AE-02 Evidence immutability | Section 14.4 |
| FD-01 Source preservation | Sections 14.4, 15.9 |
| Not an ERP | Section 18.1 |
| Export completeness | Sections 14.5, 15.7 |
| ENT-05 ERP integration | Section 18.4–18.10 |

### 19.3 Storage Risks

| ID | Risk | Severity | Mitigation |
|----|------|----------|------------|
| **ST-01** | Evidence object overwrite despite immutability policy | Critical | Write-once bucket policy; application-level rejection; hash verification |
| **ST-02** | Signed URL leakage enabling unauthorized download | High | Short TTL; scope-bound tokens; audit on issuance |
| **ST-03** | Temporary staging objects not expired — data accumulation | Medium | Aggressive lifecycle rules; monitoring on staging volume |
| **ST-04** | Archive tier transition corrupting retrieval performance | Medium | Retrieval SLA monitoring; rehydration procedures |
| **ST-05** | Cross-tenant object key collision or misrouting | Critical | Organization prefix mandatory; integration tests |
| **ST-06** | Legal hold not blocking lifecycle automation | High | Hold check in all lifecycle transition jobs |

### 19.4 Integration Risks

| ID | Risk | Severity | Mitigation |
|----|------|----------|------------|
| **IN-01** | ERP schema drift breaking connectors | High | Versioned connector profiles; health monitoring |
| **IN-02** | Duplicate financial posting on integration retry | Critical | Idempotency keys; staging before commit |
| **IN-03** | Compromised integration credentials exposing ERP | Critical | Encrypted secrets; rotation; least-scope OAuth |
| **IN-04** | Webhook signature bypass | High | Mandatory HMAC validation; replay protection |
| **IN-05** | Customer ERP rate limiting causing sync starvation | Medium | Per-connector backoff; fair scheduling |
| **IN-06** | Anti-corruption layer bypass — raw ERP data in domain | Critical | Architecture review gate; no direct domain injection |

### 19.5 Event Risks

| ID | Risk | Severity | Mitigation |
|----|------|----------|------------|
| **EV-01** | Outbox failure — state committed but event not published | High | Outbox polling with retry; monitoring on lag |
| **EV-02** | Handler non-idempotency causing duplicate side effects | Critical | Processed-event store; business idempotency keys |
| **EV-03** | Event ordering violation corrupting read models | Medium | Per-aggregate partition ordering |
| **EV-04** | Cross-tenant event misrouting | Critical | Tenant context validation on every handler |
| **EV-05** | Poison event blocking handler queue | Medium | DLQ quarantine; per-handler isolation |

### 19.6 Scalability Risks

| ID | Risk | Severity | Mitigation |
|----|------|----------|------------|
| **SC-01** | Single worker pool saturation at enterprise import volume | High | Priority lanes; horizontal worker scaling |
| **SC-02** | Notification burst overwhelming email provider | Medium | Per-tenant rate limits; digest aggregation |
| **SC-03** | Event handler fan-out latency on approval chains | Medium | Async handlers; no synchronous handler chains |
| **SC-04** | Storage egress costs at large engagement export | Medium | Tiered retrieval; export job batching |
| **SC-05** | In-process event bus limiting extraction readiness | Low | Contract-first design; outbox enables broker migration |

### 19.7 Future Improvements

| ID | Improvement | Target |
|----|-------------|--------|
| **FI-01** | External message broker extraction for event bus | When handler volume exceeds in-process capacity |
| **FI-02** | Customer-managed encryption keys for storage | Sprint 4 — FSI-02 continuity |
| **FI-03** | Real-time ERP streaming sync (change data capture) | Medium-term |
| **FI-04** | Multi-region storage replication for data residency | Long-term |
| **FI-05** | Content-aware malware scanning on all uploads | Sprint 4 |
| **FI-06** | Integration SDK and certification program launch | Medium-term |
| **FI-07** | Push notification channel activation | When mobile client available |
| **FI-08** | Event sourcing for selected read models | When audit reconstruction demands justify |

### 19.8 Architecture Maturity Assessment

| Domain | Maturity Level | Assessment |
|--------|----------------|------------|
| **Storage architecture** | Defined | Full taxonomy, lifecycle, security, and retention — ready for data architecture detail |
| **Background processing** | Defined | Queue, priority, retry, DLQ, and job categories specified |
| **Event-driven architecture** | Defined | Outbox, idempotency, and handler isolation — extraction-ready contracts |
| **Notification architecture** | Defined | Multi-channel with future readiness — email and in-app day one |
| **Integration architecture** | Defined (phased) | File import day one; API connectors phased per ERP |
| **Cross-cutting consistency** | Strong | Tenant context, immutability, and idempotency thread through all Sprint 3 domains |
| **Enterprise readiness** | Advancing | Storage tiering and integration framework address Sprint 2 gaps; connector certification pending |

### 19.9 Review Conclusion

SYSTEM_ARCHITECTURE Sprint 3 completes the **infrastructure behavior layer** — how artifacts are stored, how work is processed asynchronously, how contexts communicate, how users are notified, and how external systems connect. It is consistent with Sprints 1–2 and constitutional requirements. ST-01 through ST-06, IN-01 through IN-06, EV-01 through EV-05, and SC-01 through SC-05 guide implementation and subsequent architecture sprints.

---

## Document Control — Sprint 3

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.3.0 | 2026-06-30 | Chief Software Architect | Sprint 3 — Storage, Background Processing, Events, Notifications & Integration; Architecture Review Sprint 3 |

---

*End of Sprint 3. Await further instruction for Sprint 4.*


