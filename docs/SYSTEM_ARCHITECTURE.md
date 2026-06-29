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

*End of Sprint 3.*

---

# Sprint 4 — AI Platform, Knowledge & RAG, Performance, Observability & Reliability

*Continues SYSTEM_ARCHITECTURE.md — technical realization only.*

---

## Table of Contents — Sprint 4

20. [AI Platform Architecture](#20-ai-platform-architecture)
21. [Knowledge & RAG Architecture](#21-knowledge--rag-architecture)
22. [Performance Architecture](#22-performance-architecture)
23. [Observability & Reliability](#23-observability--reliability)
24. [Architecture Review — Sprint 4](#24-architecture-review--sprint-4)

---

## 20. AI Platform Architecture

The AI platform is a **governed intelligence plane** — separate from domain business rules, yet inseparable from professional workflows. It retrieves, reasons, drafts, and surfaces — never approves, publishes, or substitutes for professional judgment.

*Bounded context: AI & Intelligence. Aligns with Sprint 1 Section 3.7; AP-10, AP-11; PROJECT_BIBLE Part 4; MASTER_PRD AI Objectives AI-01 through AI-06.*

### 20.1 AI Platform Philosophy

| Principle | Architectural Expression |
|-----------|-------------------------|
| **Retrieval before generation** | Permission-filtered context assembled before model invocation (Core Principle 21) |
| **Assistive, not authoritative** | All outputs are proposals — status models enforce human disposition |
| **Model agnostic** | Provider substitution without domain rework (Core Principle 23) |
| **Tenant boundary sacred** | No cross-tenant retrieval, embedding, or inference |
| **Evidence mandatory** | Substantive outputs require citations — insufficient evidence yields explicit refusal |
| **Full interaction audit** | Prompt, context, output, disposition logged immutably |
| **No training on tenant data** | Customer data excluded from shared model training without consent (AP-11) |

```
Professional Request (authorized)
        ↓
Permission-Filtered Retrieval (RAG)
        ↓
Prompt Assembly (governed templates)
        ↓
Model Invocation (routed, budgeted)
        ↓
Citation Packaging + Confidence
        ↓
Human Disposition (accept / reject / edit)
        ↓
Immutable Interaction Record
```

### 20.2 AI Gateway

The AI Gateway is the **single ingress and egress control point** for all model interactions.

| Responsibility | Description |
|----------------|-------------|
| **Authentication binding** | Every request tied to authenticated identity and tenant context |
| **Authorization pre-check** | AI capability permitted for user, scope, and organization policy |
| **Rate and budget enforcement** | Token and request limits per tenant and user |
| **Provider routing** | Direct invocation to selected model endpoint |
| **Request sanitization** | Input validation; injection pattern detection |
| **Response validation** | Schema conformance; citation presence check for professional contexts |
| **Telemetry emission** | Latency, token usage, outcome — correlated trace |

No component bypasses the Gateway to reach model providers directly.

### 20.3 AI Orchestrator

The Orchestrator coordinates **multi-step AI workflows** without embedding business rules.

| Orchestration Pattern | Application |
|----------------------|-------------|
| **Retrieve-then-generate** | RAG retrieval → context assembly → generation |
| **Analyze-then-summarize** | Population scan → exception extraction → cited summary |
| **Classify-with-confidence** | Batch classification → confidence scoring → human review queue |
| **Multi-source synthesis** | Engagement data + knowledge + standards → unified cited response |

```
┌─────────────────────────────────────────────────────────────┐
│                    AI Orchestrator                           │
├─────────────────────────────────────────────────────────────┤
│  Intent Resolution → Retrieval Plan → Context Assembly       │
│         ↓                                                    │
│  Model Selection → Invocation → Output Parsing               │
│         ↓                                                    │
│  Citation Assembly → Confidence → Interaction Log            │
└─────────────────────────────────────────────────────────────┘
```

Orchestrator invokes Application Layer for **data access** — never reads domain stores directly.

### 20.4 LLM Provider Abstraction

| Abstraction Layer | Purpose |
|-------------------|---------|
| **Provider interface** | Uniform completion, embedding, and streaming contract |
| **Capability matrix** | Model features — context window, vision, structured output |
| **Configuration registry** | Approved models per organization policy |
| **Credential isolation** | Provider keys centralized — not per-tenant exposed |
| **Substitution** | Provider change requires configuration update only — not orchestration rewrite |

Supported provider categories: **frontier LLMs**, **embedding models**, **specialized extraction models** — all behind the same abstraction boundary.

### 20.5 Prompt Management

| Tier | Governance |
|------|------------|
| **Platform system prompts** | Operator-maintained — safety, citation, refusal behavior |
| **Capability prompts** | Per AI capability — Auditor analysis, Copilot, classification |
| **Organization overlays** | Firm tone, methodology references — within policy bounds |
| **Versioning** | Prompt versions recorded — linked to interaction audit |
| **No user-injectable system** | End users cannot override system-level instructions |

Prompts are **configuration artifacts** — versioned, auditable, and testable — not hardcoded strings scattered across modules.

### 20.6 Model Routing

| Routing Dimension | Decision Input |
|-------------------|----------------|
| **Task type** | Retrieval QA, long-form draft, classification, extraction |
| **Context size** | Document volume determines model context window selection |
| **Organization policy** | Approved model list and preferred provider |
| **Cost tier** | Standard vs. premium model per organization entitlement |
| **Latency requirement** | Interactive Copilot vs. background analysis job |
| **Fallback chain** | Primary → secondary → degraded mode |

Routing is **policy-driven** — not hardwired to a single vendor.

### 20.7 Conversation Context

| Context Type | Scope | Retention |
|--------------|-------|-----------|
| **Session context** | Current Copilot conversation | Session duration |
| **Engagement context** | Active engagement scope binding | Explicit user selection |
| **Entity context** | Company and period scope | Inherited from engagement |
| **Permission context** | Filter applied to all retrieval | Real-time — not cached beyond policy |
| **Prior turns** | Conversation history for continuity | Token-budget limited |

Context assembly **re-validates permissions** on each turn — prior authorized access does not imply continued access after revocation.

### 20.8 Token Budget Strategy

| Budget Scope | Control |
|--------------|---------|
| **Per request** | Maximum context + completion tokens per invocation |
| **Per user session** | Cumulative session ceiling |
| **Per organization** | Monthly or daily organizational allocation |
| **Per job type** | Background analysis higher budget than interactive query |
| **Truncation strategy** | Prioritize retrieved citations over conversation history when budget constrained |

Budget exhaustion yields **graceful degradation** — summarized context, async job offer, or explicit limit message — never silent truncation without disclosure.

### 20.9 Fallback Strategy

| Failure Mode | Fallback |
|--------------|----------|
| **Primary model unavailable** | Route to secondary approved model |
| **All models unavailable** | Return structured failure; preserve manual workflow path |
| **Retrieval empty** | "Insufficient evidence" response — no parametric generation for financial conclusions |
| **Timeout** | Partial result with continuation option or async job |
| **Citation validation failure** | Reject output; log incident; do not present to user |
| **Budget exceeded** | Defer to background job or request scope reduction |

Fallback never **fabricates** professional content to mask failure.

### 20.10 Human-in-the-Loop

| Stage | Platform Enforcement |
|-------|---------------------|
| **AI output presentation** | Visually distinguished as proposal — never approved state |
| **Acceptance action** | Explicit user action required to incorporate into engagement file |
| **Rejection** | Mandatory rationale capture for professional contexts |
| **Edit-then-accept** | Edited content attributed to editor — AI contribution preserved in audit |
| **Approval gates** | AI cannot trigger approval workflows — only humans |
| **Publication** | No AI path to published or signed-off status |

Human-in-the-loop is **structural** — enforced by status models, authorization, and UI semantics — not user discipline alone.

### 20.11 AI Governance

| Governance Plane | Responsibility |
|------------------|----------------|
| **Platform operator** | Model safety, infrastructure, provider agreements, abuse monitoring |
| **Organization** | AI enablement, model policy, usage boundaries, monitoring |
| **Workspace** | Methodology alignment, knowledge currency |
| **Engagement** | Scope boundary for retrieval and analysis |
| **Professional** | Accept/reject accountability for incorporated outputs |

| Control | Mechanism |
|---------|-----------|
| **Enablement toggle** | Organization can disable AI capabilities |
| **Model allowlist** | Only approved models invocable |
| **Usage dashboards** | Volume, acceptance rate, rejection patterns |
| **Interaction export** | Audit trail exportable for quality review |
| **Third-party data handling** | Provider agreements prohibit training on tenant data |

---

## 21. Knowledge & RAG Architecture

Retrieval-Augmented Generation is the **evidence backbone** of platform intelligence. RAG ensures AI outputs are grounded in permission-filtered, retrievable sources — not parametric model memory alone.

*Bounded contexts: Knowledge, Evidence & Documents, AI & Intelligence. Addresses Sprint 1 MC-04.*

### 21.1 Knowledge Repository

| Repository Class | Content | Scope |
|------------------|---------|-------|
| **Firm knowledge** | Methodology, memos, precedents, guidance | Organization / Workspace |
| **Standards knowledge** | IFRS, ISA, regulatory excerpts | Platform + Organization overlays |
| **Engagement knowledge** | Indexed evidence, working papers, financial data | Engagement |
| **Compliance packs** | Industry and jurisdiction templates | Workspace configuration |

```
┌─────────────────────────────────────────────────────────────┐
│                  Knowledge Repository                        │
├──────────────┬──────────────┬──────────────┬────────────────┤
│ Firm Guidance│  Standards   │  Engagement  │ Compliance     │
│  (governed)  │  (indexed)   │  Artifacts   │ Packs          │
└──────────────┴──────────────┴──────────────┴────────────────┘
         Metadata (transactional)  +  Content (storage + vectors)
```

Knowledge is a **governed asset** — versioned, permission-controlled, and linked to professional context.

### 21.2 Knowledge Ingestion Pipeline

```
Source Document → Authorization Check → Extract Text
        ↓
   Classify + Tag (sensitivity, domain, scope)
        ↓
   Chunk → Embed → Index (tenant-partitioned)
        ↓
   Metadata Record + Audit Event
```

| Ingestion Source | Trigger |
|------------------|---------|
| **Knowledge upload** | Administrator or authorized publisher |
| **Evidence indexing** | Evidence upload event — Sprint 3 Section 15.8 |
| **Standards update** | Platform operator content release |
| **Engagement artifact** | Working paper or report approval triggers re-index where policy requires |

Ingestion is **asynchronous** — interactive upload returns immediately; indexing progresses via background jobs.

### 21.3 Chunking Strategy

| Content Type | Chunking Approach |
|--------------|-------------------|
| **Narrative documents** | Semantic paragraph boundaries with overlap |
| **Financial tables** | Row or section preservation — tabular structure retained in metadata |
| **Standards text** | Paragraph and clause boundary alignment |
| **Working papers** | Section-level chunks linked to paper identifier |
| **Large evidence files** | Page or section chunks with source location metadata |

| Parameter | Rationale |
|-----------|-----------|
| **Overlap** | Context continuity across chunk boundaries |
| **Maximum chunk size** | Balanced for embedding quality and retrieval precision |
| **Metadata enrichment** | Source document, page, section, engagement, classification |

### 21.4 Embeddings

| Aspect | Architecture |
|--------|--------------|
| **Model** | Configurable embedding model via provider abstraction |
| **Dimension consistency** | Single embedding model per index partition |
| **Tenant isolation** | Embeddings stored in tenant-partitioned indexes — Sprint 2 SR-04 |
| **Re-embedding** | Triggered on model change or content version update |
| **No cross-tenant batches** | Embedding jobs scoped to single organization |

Embeddings are **derived artifacts** — regenerable from source content and metadata.

### 21.5 Vector Index

| Property | Architecture |
|----------|--------------|
| **Partitioning** | Per-organization index boundary — mandatory |
| **Sub-partitioning** | Engagement and knowledge domain filters |
| **Hybrid readiness** | Vector index paired with lexical index for hybrid search |
| **Access filter** | Pre-filter by permission scope before similarity search |
| **Index lifecycle** | Create on first ingestion; rebuild on model migration |

```
Query → Permission Filter → Vector Search (+ Lexical)
              ↓
        Ranked Chunks (scoped)
              ↓
        Context Assembly for Orchestrator
```

### 21.6 Semantic Search

| Capability | Application |
|------------|-------------|
| **Natural language query** | Copilot and knowledge module search |
| **Engagement evidence search** | Find relevant documents by meaning — not keyword only |
| **Similar precedent discovery** | Firm knowledge retrieval for comparable situations |
| **Standards discovery** | Relevant IFRS/ISA passages by topic |

Semantic search always applies **permission pre-filtering** — similarity never overrides authorization.

### 21.7 Hybrid Search

| Mode | When Used |
|------|-----------|
| **Vector only** | Conceptual and paraphrase queries |
| **Lexical only** | Exact account codes, reference numbers, entity identifiers |
| **Hybrid (default)** | Combined ranking — vector recall + lexical precision |
| **Reciprocal rank fusion** | Merge vector and lexical result sets |

Hybrid search addresses professional queries that combine **semantic intent** with **exact identifiers** — common in audit and financial contexts.

### 21.8 Citation Strategy

| Requirement | Architecture |
|-------------|--------------|
| **Mandatory for substantive outputs** | AI-02 — no uncited financial or audit assertions |
| **Chunk-to-source mapping** | Every retrieved chunk traces to source document and location |
| **Click-through navigation** | Citation links to source viewer with highlight |
| **Insufficient evidence** | Explicit refusal when retrieval returns no qualifying sources |
| **Citation in accepted artifacts** | Accepted AI content carries forward retrieval provenance |
| **Rejected output preservation** | Rejected outputs remain in audit trail with rationale |

```
Retrieved Chunks → Citation Assembly → Output Validation
                         ↓
              Citations Present? ──No──→ Reject / Regenerate / Refuse
                         │
                        Yes
                         ↓
                   Present to User
```

### 21.9 Knowledge Versioning

| Version Event | Behavior |
|---------------|----------|
| **New knowledge publish** | New version; prior marked superseded |
| **Standards update** | Deprecated guidance flagged; effective dating applied |
| **Evidence re-upload** | New object version; prior retained immutably |
| **Index alignment** | Re-index on version change; retrieval prefers current version |

Retrieval defaults to **current effective version** — historical versions accessible for audit reconstruction.

### 21.10 Knowledge Refresh

| Refresh Trigger | Action |
|-----------------|--------|
| **Content update** | Re-chunk and re-embed affected documents |
| **Permission change** | Index access metadata updated — no stale unauthorized retrieval |
| **Engagement closure** | Engagement index transitions to read-only |
| **Retention expiry** | Index entries removed per policy — source tombstone retained |
| **Model migration** | Full re-embedding scheduled per organization |
| **Scheduled validation** | Index integrity checks — orphaned chunk detection |

Refresh is **event-driven and scheduled** — index currency is an operational requirement, not best-effort.

---

## 22. Performance Architecture

Performance serves **professional workflow continuity** — slow systems erode trust and encourage unsafe workarounds. Correctness and security precede speed; within those constraints, latency is aggressively managed.

*Aligns with Sprint 1 Section 1.3 quality attributes; Section 4.5 streaming; Section 6.6 observability. Addresses Sprint 1 MC-06, AR-03, AR-06.*

### 22.1 Performance Philosophy

| Principle | Expression |
|-----------|------------|
| **Measure before optimize** | P50/P95/P99 targets per operation class |
| **Critical path first** | Engagement navigation, authorization, core reads prioritized |
| **Async by default for heavy work** | Import, export, AI analysis, indexing — Sprint 3 Section 15 |
| **Perceived performance** | Shell-first rendering; progressive disclosure |
| **Tenant fairness** | No single tenant monopolizes shared resources |
| **Graceful degradation** | Reduced functionality over failure — never incorrect data |

| Target Class | Architectural Target |
|--------------|---------------------|
| **Core reads** | P95 &lt; 500ms |
| **AI retrieval (interactive)** | P95 &lt; 5 seconds |
| **Background jobs** | Progress visible; no silent stall |
| **Realtime updates** | Sub-second delivery for notifications |

### 22.2 Caching Layers

```
┌─────────────────────────────────────────────────────────────┐
│  Client Cache     — Session-scoped UI state, static assets   │
├─────────────────────────────────────────────────────────────┤
│  Edge Cache       — Static content, CDN-distributed assets   │
├─────────────────────────────────────────────────────────────┤
│  Application Cache — Permission, config, read models         │
├─────────────────────────────────────────────────────────────┤
│  Data Cache       — Query results, computed aggregates       │
└─────────────────────────────────────────────────────────────┘
         All layers: tenant-prefixed keys — no cross-tenant hits
```

### 22.3 Server-side Caching

| Cache Target | Strategy | Invalidation |
|--------------|----------|--------------|
| **Permission resolution** | Short TTL + explicit invalidation on grant change — Sprint 2 SR-02 |
| **Organization configuration** | TTL with version key invalidation |
| **Read models** | Dashboard aggregates — event-driven invalidation |
| **Reference data** | Chart of accounts, templates — version-stamped |
| **AI retrieval results** | Very short TTL — permission-sensitive |

Server cache **never stores** customer financial content beyond policy-defined TTL without encryption and tenant isolation.

### 22.4 Client-side Caching

| Target | Strategy |
|--------|----------|
| **Static assets** | Long-lived cache with content hash invalidation |
| **Locale resources** | Version-stamped translation bundles |
| **Session UI state** | Disposable — server remains authoritative |
| **Professional data** | Minimal client retention — refetch on navigation |

Client-side caching of **professional data is intentionally limited** — stale financial state is unacceptable.

### 22.5 Edge Caching

| Content | Edge Treatment |
|---------|----------------|
| **Static assets** | CDN distribution — global edge |
| **Public marketing** | Edge cached where applicable |
| **Authenticated application** | No caching of personalized professional content at edge |
| **Signed storage URLs** | Short TTL — not edge-cacheable |

Edge caching applies to **non-personalized, non-professional** content only.

### 22.6 Realtime Architecture

| Channel | Use | Transport |
|---------|-----|-----------|
| **Notifications** | Review assignments, approvals — Sprint 3 Section 17 | Managed realtime service |
| **Job progress** | Import, export, AI analysis status | Tenant-scoped channel |
| **Dashboard refresh** | Procedure completion, finding updates | Scoped broadcast |
| **Collaborative presence** | Concurrent editing awareness | Engagement-scoped |

Realtime delivers **events** — never authoritative state mutation on client. Aligns with Sprint 1 Section 5.8.

### 22.7 Streaming

| Stream Type | Application |
|-------------|-------------|
| **Page streaming** | Server Components progressive render — Sprint 1 Section 4.5 |
| **AI response streaming** | Token-by-token Copilot output with citation assembly at completion |
| **Large list virtualization** | Incremental data load for evidence and transaction lists |
| **Export progress** | Phase and percentage streaming to initiator |

Streaming improves **perceived latency** without compromising authorization checks at stream initiation.

### 22.8 Lazy Loading

| Pattern | Application |
|---------|-------------|
| **Route-based code splitting** | Load module bundles on navigation |
| **Component lazy load** | Heavy editors and chart libraries on demand |
| **Data lazy load** | Pagination and cursor-based fetching for large collections |
| **Image lazy load** | Evidence thumbnails loaded on viewport entry |

Lazy loading is **default** for document-heavy and data-dense professional views.

### 22.9 Background Refresh

| Pattern | Application |
|---------|-------------|
| **Stale-while-revalidate** | Dashboard read models serve cached aggregate while refreshing |
| **Prefetch** | Anticipated navigation targets prefetched after idle |
| **Periodic revalidation** | Configuration and permission cache background refresh |
| **Optimistic UI** | Limited to non-financial, reversible interactions only |

Financial and approval state **never** uses optimistic update — server confirmation required.

### 22.10 Scalability Patterns

| Pattern | Application |
|---------|-------------|
| **Stateless application tier** | Horizontal scaling without session affinity |
| **Read replicas** | Read-heavy queries directed to replica — strong consistency for writes |
| **Async offload** | Heavy processing to worker pool — Sprint 3 Section 15 |
| **Tenant fair queuing** | Per-organization concurrency limits |
| **Partitioned indexes** | Vector and search indexes per tenant |
| **Connection pooling** | Database connection efficiency at scale |
| **Extraction readiness** | AI pipeline and workers independently scalable — Sprint 1 Section 2.2 |

---

## 23. Observability & Reliability

Observability transforms the platform from **hopefully correct** to **demonstrably operable**. Reliability ensures professional work survives failure without data loss or silent corruption.

*Extends Sprint 1 Sections 6.2, 6.6–6.8. Addresses Sprint 1 MC-05, TG-03.*

### 23.1 Logging Strategy

| Log Tier | Content | Retention |
|----------|---------|-----------|
| **Platform audit log** | Professional and security actions — immutable |
| **Application log** | Use case execution, authorization, errors |
| **AI interaction log** | Prompt, retrieval, output, disposition |
| **Infrastructure log** | Database, storage, worker, provider calls |
| **Integration log** | ERP sync, webhook delivery |

| Property | Requirement |
|----------|-------------|
| **Structured** | JSON with correlation identifier, tenant, user, timestamp |
| **Correlated** | Single trace across layers |
| **Content-safe** | No customer financial data in log payloads |
| **Immutable audit tier** | Non-deletable — Sprint 2 Section 12.2 |

### 23.2 Distributed Tracing

```
User Request → Edge → Application → Domain → Infrastructure
                              ↓
                         AI Gateway → Provider
                              ↓
                         Worker (async job)
```

| Trace Span | Captured Data |
|------------|---------------|
| **Request ingress** | Correlation identifier assigned |
| **Authorization** | Decision outcome — not sensitive policy detail |
| **Database operations** | Duration, operation class — not query content |
| **AI invocation** | Model, token count, latency, outcome |
| **Background job** | Job type, tenant, duration, retry count |

Tracing enables **latency attribution** — identifying whether slowness is retrieval, model, or data access.

### 23.3 Metrics

| Metric Domain | Examples |
|---------------|----------|
| **Request performance** | P50/P95/P99 latency per operation class |
| **Error rates** | 4xx/5xx by endpoint class; domain validation failures |
| **Queue health** | Depth, age, DLQ volume — Sprint 3 Section 15.5 |
| **AI operations** | Retrieval latency, citation rate, acceptance rate, token usage |
| **Tenant resources** | Storage, job concurrency, AI budget consumption |
| **Integration health** | Sync success rate, last successful sync age |
| **Business operations** | Import volume, export count — aggregated, non-content |

Metrics exclude **customer financial content** from labels and dimensions.

### 23.4 Health Checks

| Check Level | Scope | Consumer |
|-------------|-------|----------|
| **Liveness** | Process responsive | Orchestrator restart |
| **Readiness** | Database, storage, queue reachable | Traffic routing |
| **Dependency** | AI provider, email, integration connectivity | Degraded mode activation |
| **Deep synthetic** | End-to-end professional path per tier | SLA monitoring |

Unready dependencies trigger **graceful degradation** — not traffic to broken paths.

### 23.5 Monitoring

| Monitor Type | Focus |
|--------------|-------|
| **Infrastructure** | CPU, memory, connection pool, storage utilization |
| **Application** | Error spikes, latency regression, saturation |
| **Security** | Auth failures, cross-tenant access attempts, privilege escalation |
| **AI** | Hallucination indicators — uncited output rate, retrieval miss rate |
| **Compliance** | Audit log completeness, retention job success |
| **Tenant** | Per-organization health for enterprise support |

Monitoring feeds **operator dashboards** and **tenant administrator views** at appropriate scope.

### 23.6 Alerting

| Severity | Examples | Response |
|----------|----------|----------|
| **Critical** | Cross-tenant access attempt, audit log write failure, data corruption indicator | Immediate operator page |
| **High** | Error rate spike, DLQ threshold, AI provider outage | Operator alert within minutes |
| **Medium** | Queue backlog, latency regression, integration sync failure | Operator ticket |
| **Low** | Capacity trend, non-critical dependency degradation | Scheduled review |

Alerts are **actionable** — each maps to a runbook — not noise.

### 23.7 Error Tracking

| Error Class | Tracking |
|-------------|----------|
| **Application exceptions** | Stack trace, correlation, tenant — grouped by fingerprint |
| **AI failures** | Provider errors, citation validation failures, timeout |
| **Integration failures** | Connector errors with external system identifier |
| **User-visible errors** | Safe message logged with internal detail separated |

Error tracking supports **root cause analysis** without exposing internal detail to users.

### 23.8 Resilience

| Resilience Property | Architecture |
|---------------------|--------------|
| **Idempotency** | Critical operations safe to retry — Sprint 3 Section 16.8 |
| **Graceful degradation** | AI unavailable → manual workflow; realtime unavailable → polling |
| **Bulkhead isolation** | AI, import, and notification workers isolated |
| **Timeout discipline** | Every external call bounded |
| **Backpressure** | Queue depth triggers throttling — Sprint 3 Section 15.2 |
| **Data integrity** | Transactional writes; outbox for events |

### 23.9 Retry Strategy

| Layer | Retry Policy |
|-------|--------------|
| **Synchronous requests** | Limited retry for idempotent reads only |
| **Background jobs** | Exponential backoff with jitter — Sprint 3 Section 15.4 |
| **Event handlers** | Retry with DLQ — Sprint 3 Section 16.10 |
| **Integration sync** | Per-connector backoff respecting external limits |
| **AI provider** | Single retry on transient; fallback chain — Section 20.9 |
| **Notification delivery** | Provider retry with terminal bounce handling |

Retries are **never blind** — idempotency keys and deduplication mandatory for state-changing operations.

### 23.10 Circuit Breaker Philosophy

| Principle | Expression |
|-----------|------------|
| **Fail fast** | Open circuit stops hammering failing dependency |
| **Half-open probe** | Periodic test request before full restoration |
| **Fallback activation** | Degraded mode when circuit open — Section 20.9 |
| **Per-dependency** | AI provider, ERP connector, email — independent circuits |
| **Tenant visibility** | Integration circuit open surfaced to workspace administrator |

Circuit breakers protect **platform stability** and **external systems** from retry storms.

### 23.11 Disaster Recovery

| Aspect | Architecture |
|--------|--------------|
| **RPO (Recovery Point Objective)** | Maximum acceptable data loss — minutes for transactional; defined per tier |
| **RTO (Recovery Time Objective)** | Maximum acceptable downtime — tiered by subscription |
| **Backup strategy** | Continuous database protection; object storage versioning |
| **Geographic redundancy** | Multi-AZ within region — multi-region future |
| **Restore testing** | Periodic validated restore exercises |
| **Runbook** | Documented recovery procedures per failure scenario |

DR addresses **platform continuity** — customer export portability addresses tenant-level recovery.

### 23.12 High Availability

```
                    ┌─────────────┐
                    │   Load      │
                    │  Balancer   │
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌────────────┐  ┌────────────┐  ┌────────────┐
    │ App Instance│  │ App Instance│  │ App Instance│
    └──────┬─────┘  └──────┬─────┘  └──────┬─────┘
           └───────────────┼───────────────┘
                           ▼
              ┌────────────────────────┐
              │  Primary DB (failover)  │
              │  Object Storage         │
              │  Queue / Workers        │
              └────────────────────────┘
```

| HA Component | Posture |
|--------------|---------|
| **Application tier** | Multi-instance; stateless; rolling deployment |
| **Database** | Managed failover; automated backup |
| **Object storage** | Platform-managed durability |
| **Workers** | Multi-instance consumer pool |
| **AI provider** | Multi-provider fallback — Section 20.9 |
| **Target availability** | ≥ 99.9% enterprise tier — PROJECT_BIBLE Section 8 |

---

## 24. Architecture Review — Sprint 4

Consistency review of Sprint 4 against Sprints 1–3, PROJECT_BIBLE, and MASTER_PRD. Previous sections not modified.

### 24.1 Sprint 1–3 Consistency

| Prior Element | Sprint 4 Alignment |
|---------------|-------------------|
| Sprint 1 Section 3.7 AI Layer | Section 20 — full platform architecture |
| Sprint 1 AP-10 AI boundary | Sections 20.10, 21.8 — human disposition and citations |
| Sprint 1 AP-11 No training | Section 20.1, 20.11 |
| Sprint 1 Section 4.5 Streaming | Section 22.7 |
| Sprint 1 Section 6.6 Observability | Section 23 — expanded |
| Sprint 1 MC-04 AI architecture | Sections 20, 21 — addressed |
| Sprint 1 MC-05 DR / HA | Section 23.11–23.12 — addressed |
| Sprint 1 MC-06 Caching | Section 22.2–22.5 — addressed |
| Sprint 1 AR-03 AI latency | Sections 22.7, 22.9, 20.9 |
| Sprint 1 AR-06 Read models | Section 22.3, 22.9 |
| Sprint 2 SR-04 AI partition | Section 21.4, 21.5 |
| Sprint 2 AI interaction log | Section 23.1 |
| Sprint 3 Section 15.8 AI jobs | Section 20.6 routing — interactive vs background |
| Sprint 3 SC-01 worker saturation | Section 22.10 bulkhead pattern |
| Sprint 3 FI-02 CMEK | Section 24.7 — future |
| Sprint 3 FI-05 malware scanning | Section 24.7 — future |

### 24.2 Constitutional Alignment

| Rule / Objective | Sprint 4 Expression |
|------------------|---------------------|
| Core Principle 21 — Retrieval before generation | Sections 20.1, 21 |
| Core Principle 22 — AI interactions logged | Sections 20.11, 23.1 |
| Core Principle 23 — Model agnosticism | Section 20.4 |
| Core Principle 25 — No training on tenant data | Sections 20.1, 20.11 |
| AI-02 — Evidence citation | Section 21.8 |
| AI-04 — Retrieval P95 &lt; 5s | Section 22.1 |
| AI-05 — No autonomous sign-off | Section 20.10 |
| PROJECT_BIBLE Part 4 AI governance | Section 20.11 |
| PROJECT_BIBLE Part 4 human-in-the-loop | Section 20.10 |

### 24.3 AI Risks

| ID | Risk | Severity | Mitigation |
|----|------|----------|------------|
| **AI-01** | Hallucinated financial figures in cited output | Critical | Citation validation; insufficient-evidence refusal; human disposition |
| **AI-02** | Cross-tenant retrieval via embedding search | Critical | Tenant-partitioned indexes; pre-filter authorization |
| **AI-03** | Prompt injection via uploaded evidence | High | Retrieval boundaries; output validation; sanitization |
| **AI-04** | Model version drift changing behavior | High | Model versioning; regression evaluation on change |
| **AI-05** | Over-reliance — professionals accept without review | Medium | Rejection logging; UI distinction; quality monitoring |
| **AI-06** | Token budget exhaustion mid-engagement analysis | Medium | Graceful degradation; async job escalation |
| **AI-07** | Stale knowledge index producing outdated guidance | High | Knowledge refresh pipeline; version preference rules |

### 24.4 Performance Risks

| ID | Risk | Severity | Mitigation |
|----|------|----------|------------|
| **PF-01** | Permission cache staleness causing unauthorized AI retrieval | Critical | Short TTL; invalidation on grant change; re-validation per turn |
| **PF-02** | Large engagement vector search latency | High | Hybrid search; engagement sub-partitioning; async analysis default |
| **PF-03** | Dashboard read model staleness misleading status | Medium | Event-driven invalidation; freshness indicator in UI |
| **PF-04** | Cache key collision across tenants | Critical | Mandatory tenant prefix on all cache keys |
| **PF-05** | Cold-start latency on infrequent modules | Medium | Prefetch; route-based splitting; warm instances |

### 24.5 Reliability Risks

| ID | Risk | Severity | Mitigation |
|----|------|----------|------------|
| **RL-01** | AI provider outage blocking professional workflows | High | Fallback chain; manual workflow path; circuit breaker |
| **RL-02** | Background job loss on worker crash | High | Checkpointing; at-least-once delivery; idempotent handlers |
| **RL-03** | Database failover during approval transaction | Critical | ACID transactions; outbox replay; saga compensation |
| **RL-04** | Observability gap — AI interaction not logged | Critical | Gateway mandatory path; audit completeness monitoring |
| **RL-05** | Restore drill failure undiscovered until incident | High | Periodic tested restore; documented RPO/RTO |

### 24.6 Operational Risks

| ID | Risk | Severity | Mitigation |
|----|------|----------|------------|
| **OP-01** | Alert fatigue reducing incident response | Medium | Severity discipline; actionable alerts only |
| **OP-02** | Insufficient tenant-level visibility for enterprise support | Medium | Per-tenant health dashboards; dedicated support views |
| **OP-03** | AI cost overrun per organization | Medium | Token budgets; usage dashboards; organizational caps |
| **OP-04** | Index rebuild impacting production retrieval | High | Background re-embedding; blue-green index swap |
| **OP-05** | Runbook gaps for AI provider failure | Medium | Documented fallback procedures; synthetic monitoring |

### 24.7 Future Improvements

| ID | Improvement | Target |
|----|-------------|--------|
| **FI-09** | Multi-region active-active deployment | Long-term — Sprint 1 MC-08 |
| **FI-10** | Customer-managed encryption keys for AI context | Enterprise tier |
| **FI-11** | Offline-tolerant fieldwork architecture | Sprint 5 — MC-07 |
| **FI-12** | AI output regression test suite per model change | Near-term |
| **FI-13** | Synthetic monitoring for critical professional workflows | Near-term — Sprint 1 FI-03 |
| **FI-14** | Chaos engineering for resilience validation | Medium-term — Sprint 1 FI-04 |
| **FI-15** | Performance budget per bounded context | Near-term — Sprint 1 FI-05 |
| **FI-16** | Content-aware malware scanning on uploads | Near-term — Sprint 3 FI-05 |
| **FI-17** | Fine-tuned domain models with tenant consent | Long-term |
| **FI-18** | SIEM integration for enterprise observability | Medium-term — Sprint 2 FSI-06 |

### 24.8 Architecture Maturity Assessment

| Domain | Maturity Level | Assessment |
|--------|----------------|------------|
| **AI platform architecture** | Defined | Gateway, orchestrator, governance, and human-in-the-loop specified |
| **Knowledge & RAG** | Defined | Full pipeline from ingestion through citation — tenant isolation enforced |
| **Performance architecture** | Defined | Caching, streaming, lazy loading, and scalability patterns specified |
| **Observability** | Defined | Logging, tracing, metrics, alerting — extends Sprint 1 foundation |
| **Reliability & HA** | Defined | Retry, circuit breaker, DR, and HA posture documented |
| **Cross-sprint coherence** | Strong | AI, async, events, storage, and security threads align |
| **Enterprise readiness** | Advancing | AI governance and observability enterprise-grade; multi-region and offline deferred |
| **Implementation readiness** | High | Sprints 1–4 provide complete platform architecture foundation |

### 24.9 Review Conclusion

SYSTEM_ARCHITECTURE Sprint 4 completes the **intelligence and operability layer** — how AI is governed and grounded, how knowledge is retrieved and cited, how performance is managed, and how the platform is observed and kept reliable. It is consistent with Sprints 1–3 and constitutional AI requirements. AI-01 through AI-07, PF-01 through PF-05, RL-01 through RL-05, and OP-01 through OP-05 guide implementation. Sprints 1–4 collectively define a production-grade enterprise architecture for the audit, IFRS reporting, and financial intelligence platform.

---

## Document Control — Sprint 4

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.4.0 | 2026-06-30 | Chief Software Architect | Sprint 4 — AI Platform, Knowledge & RAG, Performance, Observability & Reliability; Architecture Review Sprint 4 |

---

*End of Sprint 4.*

---

# Sprint 5 — Infrastructure, Deployment, DevOps & Final Review

*Final sprint — completes SYSTEM_ARCHITECTURE.md.*

---

## Table of Contents — Sprint 5

25. [Infrastructure Architecture](#25-infrastructure-architecture)
26. [Deployment Architecture](#26-deployment-architecture)
27. [DevOps & CI/CD Architecture](#27-devops--cicd-architecture)
28. [Scalability & Enterprise Operations](#28-scalability--enterprise-operations)
29. [Architecture Decision Records (ADR)](#29-architecture-decision-records-adr)
30. [Final Architecture Review](#30-final-architecture-review)

---

## 25. Infrastructure Architecture

Infrastructure is the **physical and logical foundation** on which the modular monolith operates. Every tier is designed for tenant isolation, operational visibility, and evolution without re-platforming.

*Aligns with Sprint 1 Sections 5.1–5.7; Sprint 2 Section 9; Sprint 3 Section 14; Sprint 4 Section 23. Addresses Sprint 1 MC-05, MC-08.*

### 25.1 Cloud Philosophy

| Principle | Expression |
|-----------|------------|
| **Managed over self-operated** | Prefer managed services for database, storage, auth, and edge — operational burden on platform team minimized |
| **Cloud-agnostic domain** | Domain and Application layers independent of vendor — Infrastructure abstracts persistence |
| **Secure by default** | Private networking, encryption, least-privilege service accounts |
| **Single region first** | Production in primary region; multi-region as enterprise evolution — not day-one complexity |
| **Infrastructure as configuration** | All environments reproducible from version-controlled definitions |
| **No pet servers** | Stateless compute; immutable deployments |

The platform targets **globally deployable SaaS** — initial deployment in a primary cloud region with architecture readiness for regional expansion and data residency.

### 25.2 Compute Strategy

| Compute Tier | Workload | Scaling Model |
|--------------|----------|---------------|
| **Application runtime** | Next.js modular monolith — web and Server Actions | Horizontal — stateless instances |
| **Edge compute** | Webhook ingress, auth hooks, lightweight routing | Serverless — per-invocation |
| **Background workers** | Import, export, AI, indexing, notifications | Horizontal — queue-driven pool |
| **Scheduled jobs** | Cron maintenance, retention, health checks | Dedicated scheduler — limited concurrency |
| **AI inference** | Gateway-orchestrated model calls | Horizontal — bulkhead isolated from app tier |

```
                    ┌─────────────────┐
                    │  Load Balancer  │
                    └────────┬────────┘
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ App Pod  │  │ App Pod  │  │ App Pod  │  ← Stateless
        └────┬─────┘  └────┬─────┘  └────┬─────┘
             └─────────────┼─────────────┘
                           ▼
        ┌──────────────────────────────────────┐
        │  Worker Pool  │  Edge  │  Scheduler │
        └──────────────────────────────────────┘
```

Compute instances carry **no tenant-affinitized state** — tenant context injected per request or job.

### 25.3 Network Topology

```
┌─────────────────────────────────────────────────────────────────┐
│                        Public Internet                           │
└────────────────────────────┬────────────────────────────────────┘
                             │ TLS 1.2+
                    ┌────────▼────────┐
                    │  CDN / WAF      │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Load Balancer  │
                    └────────┬────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                     Application Subnet (Private)                 │
│   App Instances  ·  Workers  ·  Edge Functions                 │
└────────────────────────────┬────────────────────────────────────┘
                             │ Private connectivity only
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Database    │    │ Object Store │    │  Queue       │
│  (Private)   │    │  (Private)   │    │  (Private)   │
└──────────────┘    └──────────────┘    └──────────────┘
```

| Network Control | Application |
|-----------------|-------------|
| **TLS termination** | At load balancer and CDN edge |
| **Private subnets** | Database, storage, queue — no public endpoints |
| **Egress control** | Outbound restricted to approved destinations — AI providers, email, ERP |
| **WAF** | OWASP rule sets; rate limiting at edge |
| **DDoS protection** | Edge mitigation before application tier |

### 25.4 Edge Layer

| Component | Role |
|-----------|------|
| **CDN** | Static asset distribution; global edge caching — Sprint 4 Section 22.5 |
| **WAF** | Threat filtering; bot management |
| **Edge functions** | Webhook ingress, auth hooks, OAuth callbacks — Sprint 1 Section 5.4 |
| **TLS** | Certificate management; HSTS enforcement |

Edge layer is **thin** — validates, routes, and delegates. No domain logic at edge.

### 25.5 Application Layer

| Property | Architecture |
|----------|--------------|
| **Deployment unit** | Single modular monolith artifact — Sprint 1 Section 2.1 |
| **Statelessness** | Session tokens validated per request — no sticky sessions required |
| **Health endpoints** | Liveness and readiness probes — Sprint 4 Section 23.4 |
| **Graceful shutdown** | In-flight requests complete before instance termination |
| **Resource limits** | CPU and memory bounded per instance class |

### 25.6 Database Layer

| Property | Architecture |
|----------|--------------|
| **Engine** | Managed PostgreSQL — Sprint 1 Section 5.3 |
| **Connectivity** | Private network only; connection pooling at application tier |
| **High availability** | Managed failover within availability zone group |
| **Backups** | Continuous protection; point-in-time recovery |
| **Extensions** | Full-text search, vector embeddings — Sprint 4 Section 21 |
| **Defense in depth** | Row-level security — Sprint 2 Section 9.7 |

Database schema and migration details are documented in a separate data architecture artifact.

### 25.7 Storage Layer

| Tier | Infrastructure |
|------|----------------|
| **Object storage** | Managed buckets — organization-scoped policies — Sprint 3 Section 14 |
| **Hot / warm / cold** | Lifecycle transitions per retention — Sprint 3 Section 14.12 |
| **Backup** | Cross-region backup replication for disaster recovery |
| **Encryption** | Platform-managed keys default; CMEK readiness — Sprint 4 FI-10 |

### 25.8 Private vs Public Services

| Service Class | Exposure | Examples |
|---------------|----------|----------|
| **Public ingress** | Internet-facing via TLS | Application, CDN static assets |
| **Partner ingress** | Authenticated external | Webhook endpoints, SSO federation |
| **Private internal** | Application subnet only | Database, queue, object storage API |
| **Outbound only** | No inbound | AI provider, transactional email, ERP connectors |
| **Operator access** | VPN or bastion — break-glass | Platform administration, incident response |

No customer data store has a **public endpoint**.

### 25.9 Environment Isolation

| Isolation Plane | Mechanism |
|-----------------|-----------|
| **Account separation** | Non-production and production in distinct cloud accounts or projects |
| **Network separation** | Distinct VPC per environment — no cross-environment routing |
| **Data separation** | No production data in non-production environments |
| **Credential separation** | Distinct secrets per environment |
| **Configuration separation** | Environment-specific parameter sets |

Developers and testers **never** access production customer data in lower environments.

### 25.10 Disaster Isolation

| Isolation Boundary | Purpose |
|--------------------|---------|
| **Availability zone** | Survive single-AZ failure within region |
| **Region** | Survive regional outage — backup restore to secondary region |
| **Tenant** | Failure or compromise in one organization does not affect others |
| **Worker bulkhead** | Runaway job in one queue class does not exhaust all compute |
| **AI provider** | Provider outage isolated via fallback — Sprint 4 Section 20.9 |

Disaster isolation ensures **blast radius containment** at every tier.

---

## 26. Deployment Architecture

Deployment architecture governs **how software moves safely** from development to production — with rollback capability and environment integrity.

*Aligns with PROJECT_BIBLE roadmap (CI/CD foundation); MASTER_PRD OPS-06, deployment frequency KPI.*

### 26.1 Development Environment

| Aspect | Architecture |
|--------|--------------|
| **Purpose** | Individual developer integration and local verification |
| **Data** | Synthetic or anonymized fixtures — no production data |
| **Dependencies** | Local or shared development service instances |
| **Deployment** | Developer-controlled; hot reload for rapid iteration |
| **Observability** | Local logging; optional trace export to shared collector |

Development environment validates **code correctness** — not production scale or security posture.

### 26.2 Testing Environment

| Aspect | Architecture |
|--------|--------------|
| **Purpose** | Automated test execution; integration verification |
| **Data** | Seeded test datasets; tenant isolation test fixtures |
| **Deployment** | CI-triggered on every merge to integration branch |
| **Scope** | Unit, integration, contract, security scan, tenant isolation tests |
| **Parity** | Service topology mirrors staging — scaled down |

Testing environment is the **quality gate** before promotion.

### 26.3 Staging Environment

| Aspect | Architecture |
|--------|--------------|
| **Purpose** | Pre-production validation; UAT; release candidate verification |
| **Data** | Anonymized production-like volume datasets |
| **Deployment** | Promotion from tested artifact — not rebuilt |
| **Parity** | Production-equivalent configuration; production-scale subset |
| **Access** | Restricted — product, QA, and operator roles |

Staging is the **final verification** before production promotion.

### 26.4 Production Environment

| Aspect | Architecture |
|--------|--------------|
| **Purpose** | Customer-facing platform operation |
| **Data** | Live tenant data — full governance and audit controls |
| **Deployment** | Governed promotion only — Section 26.8 |
| **Availability** | ≥ 99.9% enterprise tier — Sprint 4 Section 23.12 |
| **Change control** | Release governance — Section 27.10 |
| **Monitoring** | Full observability stack — Sprint 4 Section 23 |

### 26.5 Release Strategy

| Release Type | Cadence | Scope |
|--------------|---------|-------|
| **Standard release** | Weekly low-risk cadence — MASTER_PRD deployment KPI | Features, fixes, configuration |
| **Hotfix release** | As needed | Critical security or data integrity fixes |
| **Configuration release** | Independent of code | Organization templates, compliance packs |
| **Infrastructure release** | Scheduled maintenance windows | Platform upgrades, scaling changes |

```
Develop → Test (CI) → Stage (RC) → Production (Governed)
              ↑                         │
              └──── Rollback if needed ─┘
```

### 26.6 Blue-Green Readiness

| Capability | Architecture |
|------------|--------------|
| **Dual environment slots** | Production traffic routable to active or standby deployment |
| **Artifact immutability** | Tested artifact promoted — not rebuilt at switch |
| **Database compatibility** | Forward-compatible migrations applied before switch |
| **Switch mechanism** | Load balancer traffic shift — near-instant |
| **Validation** | Standby slot health-checked before traffic switch |
| **Initial posture** | Rolling deployment day one; blue-green activated when scale demands |

Blue-green is **architectural readiness** — not mandatory for initial launch volume.

### 26.7 Canary Readiness

| Capability | Architecture |
|------------|--------------|
| **Traffic splitting** | Percentage of requests routed to new version |
| **Metric gates** | Error rate, latency, and business health monitored during canary |
| **Automatic rollback** | Canary aborted on threshold breach |
| **Tenant targeting** | Optional canary limited to internal or pilot organizations |
| **Initial posture** | Feature flags for gradual rollout — Section 26.5; full canary when traffic volume justifies |

### 26.8 Rollback Strategy

| Rollback Trigger | Action |
|------------------|--------|
| **Health check failure** | Automatic traffic revert to prior deployment |
| **Error rate spike** | Operator-initiated or automated rollback |
| **Data migration failure** | Halt promotion; restore from pre-migration checkpoint |
| **Customer-impacting defect** | Hotfix or full version revert |

| Rollback Constraint | Rule |
|---------------------|------|
| **Schema compatibility** | Migrations must be backward-compatible or reversible |
| **Artifact retention** | Prior N production artifacts retained for rapid revert |
| **Audit** | Rollback events logged with actor and reason |
| **Target** | Rollback rate &lt; 2% — MASTER_PRD release KPI |

### 26.9 Environment Promotion

| Promotion Step | Gate |
|----------------|------|
| **Dev → Test** | Automated on merge — CI pipeline |
| **Test → Staging** | All automated gates pass; release candidate tagged |
| **Staging → Production** | Manual approval; staging soak period; change window |
| **Artifact integrity** | Same immutable artifact promoted — not rebuilt |
| **Configuration promotion** | Environment-specific overlays applied at deploy |

Promotion is **forward-only** for artifacts — rollback uses prior artifact, not re-promotion from lower environment.

---

## 27. DevOps & CI/CD Architecture

DevOps architecture ensures **repeatable, auditable, secure delivery** — compatible with enterprise procurement and SOC 2 evidence requirements.

*Addresses Sprint 1 FI-01, FI-02, FI-06; Sprint 2 Section 11.4 secrets.*

### 27.1 Repository Strategy

| Aspect | Architecture |
|--------|--------------|
| **Monorepo** | Single repository — modular monolith with bounded context packages |
| **Ownership** | CODEOWNERS per bounded context — review routing |
| **Documentation** | Constitutional and architecture docs co-located |
| **Artifact separation** | Infrastructure definitions in dedicated paths |
| **Dependency management** | Centralized lockfile; automated vulnerability scanning |

### 27.2 Branching Strategy

| Branch | Purpose |
|--------|---------|
| **Main** | Production-ready integration branch — always deployable to staging |
| **Feature branches** | Short-lived; bounded context scope |
| **Release branches** | Optional — for release stabilization when needed |
| **Hotfix branches** | Critical production fixes — fast-track to production |

```
Feature Branch → Pull Request → Main → CI → Staging → Production
                     ↑
              Review + Gates
```

Main branch is **protected** — direct commits prohibited; required reviews enforced.

### 27.3 Continuous Integration

| CI Stage | Verification |
|----------|--------------|
| **Build** | Compile; type check; lint |
| **Unit tests** | Domain logic — isolated from infrastructure |
| **Integration tests** | Application use cases with test infrastructure |
| **Contract tests** | Inter-context event and interface compatibility |
| **Security scan** | Dependency vulnerabilities; static analysis |
| **Boundary check** | Package dependency rules enforced — Sprint 1 AR-01 |
| **Artifact publish** | Immutable deployable artifact versioned and stored |

CI runs on **every pull request** and on merge to main.

### 27.4 Continuous Delivery

| Aspect | Architecture |
|--------|--------------|
| **Staging delivery** | Automatic on main merge — after CI gates |
| **Production delivery** | Manual approval gate — Section 27.5 |
| **Deployment automation** | Pipeline-driven — no manual server configuration |
| **Configuration injection** | Environment secrets and parameters at deploy time |
| **Smoke tests** | Post-deploy synthetic health verification |

### 27.5 Deployment Gates

| Gate | Requirement |
|------|-------------|
| **CI green** | All automated checks pass |
| **Staging soak** | Minimum period on staging without critical defects |
| **Security review** | Required for authentication, authorization, and encryption changes |
| **Architecture review** | Required for cross-context boundary changes — Section 29 |
| **Operator approval** | Production deployment authorized by designated approver |
| **Change window** | Production changes during approved maintenance windows except hotfix |

### 27.6 Automated Quality Gates

| Gate | Threshold |
|------|-----------|
| **Test coverage** | Domain logic coverage minimum enforced |
| **Lint and type safety** | Zero blocking violations |
| **Performance regression** | Key operation latency within budget — Sprint 4 FI-15 |
| **Tenant isolation tests** | Cross-tenant access attempts must fail |
| **AI citation compliance** | Automated check for citation presence in test fixtures |

### 27.7 Security Gates

| Gate | Verification |
|------|--------------|
| **Dependency audit** | No critical unmitigated vulnerabilities |
| **Secret scanning** | No credentials in source |
| **SAST** | Static application security analysis |
| **RLS policy review** | Mandatory for new tenant-scoped tables — Sprint 2 SR-01 |
| **Container scan** | Deployable artifact vulnerability scan |

Security gates are **blocking** — not advisory.

### 27.8 Infrastructure as Code Philosophy

| Principle | Expression |
|-----------|------------|
| **Declarative** | Infrastructure defined in version-controlled configuration |
| **Reproducible** | Any environment recreatable from definitions |
| **Reviewed** | Infrastructure changes via pull request — same as application |
| **Drift detection** | Periodic comparison of live state vs. declared state |
| **Modular** | Environment, network, compute, and data layers separately defined |
| **No manual console** | Production changes through pipeline only |

### 27.9 Secrets Management

| Secret Class | Management |
|--------------|------------|
| **Application secrets** | Managed secret store — injected at deploy |
| **Database credentials** | Platform-managed rotation |
| **Integration credentials** | Per-workspace encrypted storage — Sprint 2 Section 11.4 |
| **AI provider keys** | Centralized — not in application configuration |
| **CI/CD secrets** | Pipeline secret store — scoped per environment |

| Rule | Enforcement |
|------|-------------|
| **No secrets in source** | Scanning gate blocks commit |
| **Least exposure** | Secrets accessible only to consuming service identity |
| **Rotation** | Supported without downtime where possible |
| **Audit** | Secret access logged |

### 27.10 Release Governance

| Governance Element | Mechanism |
|--------------------|-----------|
| **Release notes** | Customer-visible changes documented per release |
| **Change advisory** | Breaking changes communicated in advance |
| **Rollback plan** | Documented for every production release |
| **SOC 2 evidence** | Deployment logs, approvals, and test results retained |
| **Feature flags** | Gradual rollout decoupled from deployment — Sprint 1 Section 6.5 |
| **Emergency process** | Hotfix path with expedited gates — post-incident review mandatory |

---

## 28. Scalability & Enterprise Operations

Scalability and operations architecture ensures the platform **grows with customer demand** without compromising isolation, performance, or cost discipline.

*Extends Sprint 4 Sections 22.10, 23; Sprint 3 Section 15.*

### 28.1 Horizontal Scaling

| Component | Scaling Trigger | Mechanism |
|-----------|-----------------|-----------|
| **Application tier** | Request latency or CPU saturation | Add instances behind load balancer |
| **Background workers** | Queue depth or job age | Add worker instances |
| **AI inference** | Token throughput or latency | Dedicated AI worker pool expansion |
| **Read replicas** | Read query saturation | Add database read replicas |

Horizontal scaling is the **primary scaling strategy** — vertical scaling is supplementary.

### 28.2 Vertical Scaling

| Component | When Applied |
|-----------|--------------|
| **Database primary** | Connection or compute ceiling reached — before read replica split |
| **Worker memory** | Large import or export jobs require increased instance class |
| **AI context windows** | Long-document analysis requiring larger memory |

Vertical scaling is **bounded** — horizontal scaling preferred at sustained load.

### 28.3 Database Scaling Readiness

| Strategy | Application |
|----------|-------------|
| **Read replicas** | Dashboard and reporting queries offloaded |
| **Connection pooling** | Efficient connection use at application tier |
| **Query optimization** | Index governance per bounded context |
| **Partitioning readiness** | Large tables partitionable by organization |
| **Strong write consistency** | Financial and approval writes remain on primary |

Read scaling does not compromise **write consistency** for authoritative state.

### 28.4 Storage Scaling

| Strategy | Application |
|----------|-------------|
| **Object storage elasticity** | Platform-managed — no capacity planning required |
| **Lifecycle tiering** | Hot → warm → cold — Sprint 3 Section 14.12 |
| **Egress management** | Export job batching; CDN for static assets |
| **Per-tenant quotas** | Storage limits per organization subscription tier |

### 28.5 Queue Scaling

| Strategy | Application |
|----------|-------------|
| **Worker pool autoscaling** | Scale on queue depth — Sprint 3 Section 15.2 |
| **Priority lanes** | Critical jobs isolated from bulk processing |
| **Per-tenant fairness** | Concurrency limits prevent monopolization |
| **DLQ monitoring** | Scale does not mask failure — Sprint 3 Section 15.5 |

### 28.6 AI Scaling

| Strategy | Application |
|----------|-------------|
| **Dedicated worker pool** | AI jobs bulkhead-isolated from application tier |
| **Token budget governance** | Per-organization caps — Sprint 4 Section 20.8 |
| **Model routing** | Cost-efficient models for bulk; premium for interactive |
| **Index partitioning** | Per-tenant vector indexes — Sprint 4 Section 21.5 |
| **Provider fallback** | Multi-provider capacity — Sprint 4 Section 20.9 |
| **Async default** | Large analysis as background jobs — Sprint 3 Section 15.8 |

### 28.7 Monitoring Operations

| Operation | Cadence |
|-----------|---------|
| **Dashboard review** | Operator daily review of platform health |
| **SLA tracking** | Availability and latency against tier commitments |
| **Capacity planning** | Monthly trend review — storage, compute, AI cost |
| **Tenant health** | Enterprise customer dedicated monitoring |
| **Audit log completeness** | Automated verification — Sprint 2 Section 12.2 |
| **Synthetic workflows** | Critical professional path checks — Sprint 4 FI-13 |

### 28.8 Incident Response

```
Detect → Triage → Contain → Resolve → Communicate → Review
   ↑         ↑         ↑
Alerting  Runbook  Rollback / Failover
```

| Severity | Response Target | Examples |
|----------|-----------------|----------|
| **SEV-1** | Immediate — all hands | Cross-tenant data exposure, platform down, data corruption |
| **SEV-2** | &lt; 1 hour | Authentication failure, AI provider outage, integration failure at scale |
| **SEV-3** | &lt; 4 hours | Degraded performance, single-tenant issue, non-critical feature failure |
| **SEV-4** | Next business day | Minor defect, cosmetic issue |

| Post-Incident | Requirement |
|---------------|-------------|
| **Root cause analysis** | Documented within 5 business days for SEV-1/2 |
| **Customer communication** | Status page and direct notification for SEV-1/2 |
| **Remediation tracking** | Action items tracked to closure |
| **SOC 2 evidence** | Incident records retained |

### 28.9 Cost Optimization

| Lever | Application |
|-------|-------------|
| **Right-sizing** | Instance classes matched to actual utilization |
| **Autoscaling bounds** | Maximum instance caps prevent runaway cost |
| **Storage lifecycle** | Cold tier for archived engagements |
| **AI token budgets** | Organizational caps and model routing |
| **Reserved capacity** | Committed use for predictable baseline load |
| **Idle resource cleanup** | Temporary staging expiration — Sprint 3 Section 14.7 |
| **Per-tenant cost visibility** | Storage, compute, and AI usage attributed per organization |

Cost optimization **never** compromises tenant isolation or audit log retention.

### 28.10 Business Continuity

| Capability | Architecture |
|------------|--------------|
| **RPO / RTO** | Tiered by subscription — Sprint 4 Section 23.11 |
| **Backup and restore** | Tested annually — MASTER_PRD DR KPI |
| **Geographic redundancy** | Multi-AZ day one; multi-region roadmap — Sprint 4 FI-09 |
| **Customer data export** | Full organizational export — business continuity for customer |
| **Offline fieldwork readiness** | Architecture anticipates intermittent connectivity — bounded sync model for future activation |
| **Communication plan** | Status page; customer notification procedures |

Business continuity addresses **both platform survival and customer data portability**.

---

## 29. Architecture Decision Records (ADR)

Architecture Decision Records provide **durable rationale** for significant structural choices — enabling future teams to understand why the platform is built as it is.

*Addresses Sprint 1 FI-01; establishes ongoing governance for architecture evolution.*

### 29.1 Purpose

| Objective | Description |
|-----------|-------------|
| **Capture context** | Problem, constraints, and forces at decision time |
| **Document alternatives** | Options considered and rejected |
| **Record decision** | Chosen approach with rationale |
| **Enable review** | Future teams assess whether decision remains valid |
| **Support compliance** | SOC 2 and ISO evidence of governed change process |
| **Prevent re-litigation** | Settled decisions not reopened without formal supersession |

ADRs are **architecture artifacts** — not implementation tickets.

### 29.2 ADR Lifecycle

```
Proposed → Under Review → Accepted → Active
                              ↓
                         Superseded → Archived
                              ↓
                          Rejected
```

| State | Meaning |
|-------|---------|
| **Proposed** | Draft decision awaiting review |
| **Under Review** | Architecture review in progress |
| **Accepted** | Decision approved — not yet implemented |
| **Active** | Decision implemented and in effect |
| **Superseded** | Replaced by newer ADR — link maintained |
| **Rejected** | Alternative chosen — rationale preserved |
| **Archived** | No longer relevant — historical reference |

### 29.3 Approval Process

| Decision Scope | Approver |
|----------------|----------|
| **Bounded context boundary change** | Chief Software Architect |
| **Technology substitution** | Chief Software Architect + affected team lead |
| **Security architecture change** | Chief Security Architect |
| **AI architecture change** | Chief AI Architect |
| **Infrastructure topology change** | Chief Cloud Architect |
| **Cross-cutting principle change** | Architecture review board |

Significant decisions require **written ADR before implementation** — not retroactive documentation.

### 29.4 Change Management

| Change Type | Process |
|-------------|---------|
| **New ADR** | Propose → review → accept → implement |
| **Supersede ADR** | New ADR references superseded; old marked superseded |
| **Emergency change** | Implement with expedited ADR within 5 business days |
| **Constitutional conflict** | ADR cannot override PROJECT_BIBLE — escalate to product governance |

ADRs are stored **alongside architecture documentation** — version-controlled and searchable.

### 29.5 Architecture Governance

| Governance Body | Responsibility |
|-----------------|----------------|
| **Architecture review board** | Quarterly review of active ADRs and risk register |
| **Release architecture gate** | Cross-context changes reviewed per release — Section 27.5 |
| **Conformance checks** | Dependency boundary and tenant isolation verified in CI |
| **Principle compliance** | New features assessed against AP-01 through AP-15 |
| **Risk register** | Sprint review risks tracked to resolution or acceptance |

```
Feature Proposal → Principle Check → ADR (if structural) → Implementation → Conformance Verify
```

### 29.6 Technical Debt Management

| Category | Management |
|----------|------------|
| **Architectural debt** | Tracked in risk register; ADR supersession when addressed |
| **Boundary erosion** | CI dependency checks; periodic audit — Sprint 1 AR-01 |
| **Deferred capabilities** | MC and FI items from sprint reviews tracked in roadmap — Section 30.5 |
| **Remediation allocation** | Minimum capacity reserved per sprint for debt reduction |
| **Debt visibility** | Architecture review board reviews debt quarterly |

Technical debt is **managed, not ignored** — explicit tracking prevents silent accumulation.

---

## 30. Final Architecture Review

Comprehensive review of **SYSTEM_ARCHITECTURE Sprints 1–5** against PROJECT_BIBLE, MASTER_PRD, and enterprise platform requirements. Previous sections not modified.

### 30.1 Architecture Completeness Assessment

| Domain | Sprint | Sections | Status |
|--------|--------|----------|--------|
| **Vision and principles** | 1 | §1 | Complete |
| **Platform and layers** | 1 | §2–3 | Complete |
| **Frontend** | 1 | §4 | Complete |
| **Backend foundation** | 1 | §5 | Complete |
| **Cross-cutting** | 1 | §6 | Complete |
| **Identity** | 2 | §8 | Complete |
| **Multi-tenancy** | 2 | §9 | Complete |
| **Authorization** | 2 | §10 | Complete |
| **Security** | 2 | §11 | Complete |
| **Audit and compliance** | 2 | §12 | Complete |
| **Storage** | 3 | §14 | Complete |
| **Background processing** | 3 | §15 | Complete |
| **Event-driven** | 3 | §16 | Complete |
| **Notifications** | 3 | §17 | Complete |
| **Integration** | 3 | §18 | Complete |
| **AI platform** | 4 | §20 | Complete |
| **Knowledge and RAG** | 4 | §21 | Complete |
| **Performance** | 4 | §22 | Complete |
| **Observability and reliability** | 4 | §23 | Complete |
| **Infrastructure** | 5 | §25 | Complete |
| **Deployment** | 5 | §26 | Complete |
| **DevOps and CI/CD** | 5 | §27 | Complete |
| **Scalability and operations** | 5 | §28 | Complete |
| **Architecture governance** | 5 | §29 | Complete |

| Deferred to Separate Artifacts | Rationale |
|--------------------------------|-----------|
| **Data architecture** | Entity model, RLS patterns, migrations — implementation detail |
| **API contracts** | Internal and external boundaries — contract specification |
| **Digital signature integration** | Export trust chain — Sprint 1 TG-04 |
| **Plugin sandbox** | Extension ecosystem — Sprint 1 FI-07 |

SYSTEM_ARCHITECTURE is **architecturally complete** for platform engineering commencement.

### 30.2 Enterprise Readiness Assessment

| Capability | Status | Evidence |
|------------|--------|----------|
| **Multi-tenant isolation** | Ready | §9, §11, §14, §25 |
| **Enterprise SSO and MFA** | Ready | §8 |
| **RBAC with SoD** | Ready | §10 |
| **Immutable audit trail** | Ready | §12, §23 |
| **Evidence immutability** | Ready | §14 |
| **AI governance and human-in-the-loop** | Ready | §20 |
| **Evidence-first RAG** | Ready | §21 |
| **ERP integration framework** | Ready (phased) | §18 |
| **HA and DR posture** | Ready | §23, §25, §28 |
| **CI/CD and release governance** | Ready | §26, §27 |
| **SOC 2 / ISO / GDPR readiness** | Ready (architecture) | §12 — operational evidence collection pending |
| **Multi-region data residency** | Roadmap | §28.10, §30.5 |
| **Offline fieldwork** | Roadmap | §28.10 |
| **CMEK** | Roadmap | §30.5 |
| **99.9% availability SLA** | Ready (architecture) | §23, §25 — operational validation pending |

Enterprise readiness is **architecture-complete** — operational validation and certification are implementation-phase activities.

### 30.3 Consistency Review

| Cross-Cutting Thread | Consistency |
|----------------------|-------------|
| **Tenant context propagation** | §9.10 → §15.1 → §16 → §20.2 → §25.2 — consistent |
| **Idempotency** | §15.4 → §16.8 → §23.9 — consistent |
| **Immutability** | §14.4 → §12.2 → §20.10 — consistent |
| **Least privilege** | §10.7 → §20.2 → §21.6 — consistent |
| **Defense in depth** | §11.2 → §9.7 → §25.3 — consistent |
| **Observability** | §6.6 → §23 → §28.7 — consistent |
| **Async processing** | §5.5 → §15 → §22.1 — consistent |
| **AI boundary** | §3.7 → §20 → §21 — consistent |
| **Modular monolith evolution** | §2.1 → §2.2 → §25.2 → §28.1 — consistent |

No architectural contradictions identified across Sprints 1–5.

### 30.4 Remaining Risks

| ID | Risk | Severity | Owner | Mitigation Path |
|----|------|----------|-------|-----------------|
| **RR-01** | RLS policy gaps on new tables | Critical | Engineering | Mandatory review gate — §27.7 |
| **RR-02** | Cross-tenant AI retrieval | Critical | AI Platform | Partitioned indexes — §21.5 |
| **RR-03** | Modular monolith boundary erosion | High | Architecture | CI boundary checks — §27.3 |
| **RR-04** | Supabase vendor concentration | Medium | Infrastructure | Domain abstraction — §25.1 |
| **RR-05** | AI hallucination in professional context | Critical | AI Platform | Citation validation — §21.8 |
| **RR-06** | Production data in lower environments | High | DevOps | Environment isolation — §25.9 |
| **RR-07** | Multi-region not yet implemented | Medium | Infrastructure | Roadmap — §30.5 |
| **RR-08** | Offline fieldwork not yet implemented | Low | Product | Roadmap — §30.5 |
| **RR-09** | Digital signature trust chain incomplete | Medium | Export | Separate artifact — TG-04 |
| **RR-10** | SOC 2 operational evidence gap | Medium | Operations | CI/CD and incident evidence — §27 |

### 30.5 Future Architecture Roadmap

| Horizon | Initiative | Driver |
|---------|------------|--------|
| **Near term (0–6 months)** | Synthetic monitoring for professional workflows | FI-13 |
| **Near term** | AI output regression suite per model change | FI-12 |
| **Near term** | Performance budgets per bounded context | FI-15 |
| **Near term** | Malware scanning on uploads | FI-16 |
| **Near term** | SCIM automated provisioning | Sprint 2 FSI-03 |
| **Medium term (6–18 months)** | Multi-region deployment with data residency | FI-09, MC-08 |
| **Medium term** | Integration SDK and certification program | Sprint 3 FI-06 |
| **Medium term** | External message broker extraction | Sprint 3 FI-01 |
| **Medium term** | SIEM integration for enterprise customers | FI-18 |
| **Medium term** | Chaos engineering program | FI-14 |
| **Long term (18+ months)** | Selective microservice extraction | §2.2 |
| **Long term** | Offline-tolerant fieldwork sync | FI-11, MC-07 |
| **Long term** | Customer-managed encryption keys | FI-10, FSI-02 |
| **Long term** | Plugin and extension sandbox | FI-07 |
| **Long term** | Fine-tuned domain models with consent | FI-17 |

### 30.6 Architecture Maturity Score

Scoring against enterprise SaaS architecture completeness (1–5 scale):

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Domain architecture** | 5 | DDD bounded contexts, layers, principles fully defined |
| **Security and identity** | 5 | Zero Trust, IAM, RBAC, tenant isolation comprehensive |
| **Data and storage** | 4 | Storage architecture complete; data model in separate artifact |
| **AI and intelligence** | 5 | Platform, RAG, governance, human-in-the-loop complete |
| **Integration** | 4 | Framework complete; connector certification pending |
| **Operations and DevOps** | 5 | CI/CD, deployment, observability, incident response defined |
| **Scalability and reliability** | 4 | Patterns defined; multi-region and chaos engineering on roadmap |
| **Governance** | 5 | ADR process, release governance, risk register established |

**Overall Architecture Maturity Score: 4.6 / 5.0**

The platform architecture is **enterprise-grade and implementation-ready**. Remaining gaps are operational validation, phased connector delivery, and long-horizon capabilities — not foundational architectural deficiencies.

### 30.7 Release Recommendation

| Assessment | Recommendation |
|------------|----------------|
| **Architectural completeness** | SYSTEM_ARCHITECTURE v1.0 — **approved for release** as authoritative technical architecture |
| **Implementation commencement** | **Approved** — engineering may proceed against Sprints 1–5 |
| **Prerequisite artifacts** | Data architecture and API contracts should proceed in parallel — not blocking foundation work |
| **First production milestone** | Foundation release — tenancy, IAM, financial import, core engagement workflow |
| **Enterprise tier gating** | SSO, MFA, HA validation, and DR drill required before enterprise SLA commitment |
| **AI capability gating** | Citation validation and interaction logging operational before AI feature GA |
| **Governance activation** | ADR process active from first structural decision — Section 29 |

```
PROJECT_BIBLE (constitutional)
        ↓
MASTER_PRD (product specification)
        ↓
SYSTEM_ARCHITECTURE v1.0 (technical realization)  ← APPROVED
        ↓
Data Architecture · API Contracts · Implementation
```

### 30.8 Final Conclusion

SYSTEM_ARCHITECTURE Sprints 1–5 collectively define a **production-grade, multi-tenant, AI-native enterprise platform** for audit, IFRS reporting, and financial intelligence. The architecture is:

- **Constitutionally aligned** with PROJECT_BIBLE Parts 1–15
- **Product-aligned** with MASTER_PRD Parts 1–17
- **Internally consistent** across thirty sections and five sprints
- **Enterprise-ready** in security, tenancy, auditability, AI governance, and operational maturity
- **Evolution-ready** through modular monolith boundaries, event contracts, and ADR governance

The architecture fulfills the constitutional mandate: *a world-class platform worthy of professional reputation, regulatory trust, and global deployment.*

---

## Document Control — Sprint 5 (Final)

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-06-30 | Chief Enterprise Architect | Sprint 5 — Infrastructure, Deployment, DevOps, Scalability, ADR, Final Review; SYSTEM_ARCHITECTURE v1.0 release |

---

## SYSTEM_ARCHITECTURE — Complete Table of Contents

| § | Section | Sprint |
|---|---------|--------|
| 1 | Architecture Vision | 1 |
| 2 | Platform Architecture | 1 |
| 3 | Application Layers | 1 |
| 4 | Frontend Architecture | 1 |
| 5 | Backend Architecture | 1 |
| 6 | Cross-cutting Architecture | 1 |
| 7 | Architecture Review — Sprint 1 | 1 |
| 8 | Identity Architecture | 2 |
| 9 | Multi-Tenant Architecture | 2 |
| 10 | Authorization Architecture | 2 |
| 11 | Security Architecture | 2 |
| 12 | Audit & Compliance Architecture | 2 |
| 13 | Architecture Review — Sprint 2 | 2 |
| 14 | Storage Architecture | 3 |
| 15 | Background Processing Architecture | 3 |
| 16 | Event-Driven Architecture | 3 |
| 17 | Notification Architecture | 3 |
| 18 | Integration Architecture | 3 |
| 19 | Architecture Review — Sprint 3 | 3 |
| 20 | AI Platform Architecture | 4 |
| 21 | Knowledge & RAG Architecture | 4 |
| 22 | Performance Architecture | 4 |
| 23 | Observability & Reliability | 4 |
| 24 | Architecture Review — Sprint 4 | 4 |
| 25 | Infrastructure Architecture | 5 |
| 26 | Deployment Architecture | 5 |
| 27 | DevOps & CI/CD Architecture | 5 |
| 28 | Scalability & Enterprise Operations | 5 |
| 29 | Architecture Decision Records | 5 |
| 30 | Final Architecture Review | 5 |

---

*End of SYSTEM_ARCHITECTURE v1.0. Document complete.*




