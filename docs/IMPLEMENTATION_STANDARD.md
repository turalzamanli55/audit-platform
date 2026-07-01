# Implementation Standard

## Document Purpose

This document is the **engineering constitution of the audit platform**. It defines how software is implemented — the standards, patterns, and disciplines that govern every line of code, every module, and every contribution to the repository.

All developers, AI agents, and contributors must treat this document as mandatory for implementation decisions.

This document does **not** redefine:

| Document | Governs |
|----------|---------|
| [PROJECT_BIBLE.md](./PROJECT_BIBLE.md) | Why the product exists — constitutional product intent |
| [MASTER_PRD.md](./MASTER_PRD.md) | What the product must do — product requirements |
| [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) | How the system is structured — technical architecture |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | How the product looks and behaves — visual and interaction standards |

This document governs **how software is written** within the boundaries established by those authoritative sources.

## Status

| Field | Value |
|-------|-------|
| Document | Implementation Standard |
| Version | 0.4.0 |
| Parts Complete | 1–4 |
| Status | Draft — Parts 1–4 Complete |
| Last Updated | 2026-06-30 |
| Owner | Chief Software Architect / Engineering Excellence Director |
| Authority | Subordinate to [PROJECT_BIBLE.md](./PROJECT_BIBLE.md) and [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) · Informed by [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) |

## Table of Contents

### Part 1 — Engineering Philosophy

1. [Engineering Vision](#1-engineering-vision)
2. [Engineering Principles](#2-engineering-principles)
3. [Project Structure](#3-project-structure)
4. [Naming Standards](#4-naming-standards)

### Part 2 — Next.js & TypeScript Standards

5. [Next.js Philosophy](#5-nextjs-philosophy)
6. [TypeScript Standards](#6-typescript-standards)
7. [React Standards](#7-react-standards)

### Part 3 — Server Implementation

8. [Server Components](#8-server-components)
9. [Client Components](#9-client-components)
10. [Server Actions](#10-server-actions)

### Part 4 — Data Access

11. [Repository Pattern](#11-repository-pattern)
12. [Database Standards](#12-database-standards)
13. [Service Layer](#13-service-layer)
14. [Error Handling](#14-error-handling)

### Future Parts (Planned)

- Part 5 — Security, Authentication & Authorization
- Part 6 — Testing, Quality Assurance & CI
- Part 7 — Observability, Logging & Operations
- Part 8 — AI Implementation Standards
- Part 9 — Performance, Caching & Resilience
- Part 10 — Governance, Review & Evolution

---

# Part 1 — Engineering Philosophy

## 1. Engineering Vision

### Excellence as a Requirement

Engineering excellence is not an aspiration — it is a **product requirement**. The audit platform serves regulated professionals whose work carries legal, ethical, and financial consequences. The code that supports that work must be as rigorous as the profession it serves.

Engineering excellence means:

- Code that is readable by the next engineer — not just the author
- Systems that scale from a single practice to an international firm without re-platforming
- Failures that are contained, observable, and recoverable — not catastrophic and silent
- Security that is structural — not bolted on before release
- Performance that is designed in — not patched in after complaints

### Long-Term Maintainability

This platform will exist for decades. Every implementation decision must be evaluated against a ten-year horizon.

Maintainability requires:

| Dimension | Standard |
|-----------|----------|
| Readability | Code explains intent without requiring author presence |
| Modularity | Changes are localized — modifications do not cascade unpredictably |
| Testability | Behavior is verifiable without full system deployment |
| Documentation | Non-obvious decisions are documented at the point of code |
| Consistency | Patterns established once are followed everywhere |
| Deprecation | Legacy patterns have migration paths — they are not abandoned in place |

Code written for today's sprint must not become tomorrow's technical debt without explicit acknowledgment.

### Enterprise Scalability

Scalability is not only about handling more users. It is about handling more **tenants, data, modules, integrations, and locales** without architectural collapse.

| Scale Dimension | Engineering Response |
|-----------------|---------------------|
| Users | Stateless application tier; horizontal scaling |
| Tenants | Strict isolation at every data access path |
| Data volume | Pagination, virtual scrolling, server-side processing |
| Feature surface | Modular boundaries prevent cross-domain coupling |
| Geographic distribution | Locale-aware from foundation — not retrofitted |
| Integration count | Contract-based boundaries — not direct coupling |

### Reliability

Reliability means the platform behaves correctly under expected and unexpected conditions.

| Reliability Property | Implementation Requirement |
|---------------------|---------------------------|
| Data integrity | Transactions, optimistic locking, idempotent mutations |
| Fault containment | Errors do not cascade across tenant or module boundaries |
| Graceful degradation | Partial failure does not collapse entire workflows |
| Recovery | Operations are retryable where safe; failures are auditable |
| Consistency | Financial and approval state changes are strongly consistent |

### Developer Happiness

Developer happiness is a **business asset**. Happy engineers write better software, stay longer, and onboard faster.

Developer happiness is achieved through:

- Clear standards that eliminate bikeshedding
- Predictable project structure that reduces navigation friction
- Type safety that catches errors at compile time
- Tooling that automates quality enforcement
- Documentation that answers questions before they are asked
- Respect for engineer time — no unnecessary ceremony, no hero culture

### Business Continuity

The platform must support uninterrupted professional work. Engineering decisions must not create single points of failure — in code, in data, or in process.

| Continuity Concern | Engineering Standard |
|--------------------|---------------------|
| Deployment | Zero-downtime deployments; backward-compatible migrations |
| Data loss | No destructive operations without confirmation and audit trail |
| Vendor dependency | Abstractions over external services — substitution possible |
| Key personnel | Codebase comprehensible without tribal knowledge |
| Incident response | Observable systems with correlation IDs and structured logs |

### Professional Software Craftsmanship

Craftsmanship is the discipline of writing software with care — as a professional accountant prepares a working paper with precision, an engineer implements a feature with intention.

Craftsmanship manifests as:

- Every function has a clear purpose
- Every module has a clear boundary
- Every error has a clear taxonomy
- Every mutation has a clear audit trail
- Every security boundary is explicit — never assumed

---

## 2. Engineering Principles

The following principles govern all implementation decisions. When principles conflict, higher-priority principles in SYSTEM_ARCHITECTURE quality attributes take precedence: security, auditability, and reliability before convenience.

### Code Quality

| # | Principle | Explanation |
|---|-----------|-------------|
| 1 | **Readability over cleverness** | Code is read far more than written. Prefer explicit, boring code over compact, clever code. |
| 2 | **Explicit over implicit** | Behavior, dependencies, and side effects must be visible — not hidden in conventions or magic. |
| 3 | **Composition over duplication** | Reuse through composition of small units — not copy-paste or inheritance hierarchies. |
| 4 | **Predictability over shortcuts** | Consistent patterns beat one-off solutions — even when shortcuts appear faster. |
| 5 | **Small focused modules** | Each file and module does one thing well. Files exceeding manageable size are decomposed. |
| 6 | **Single responsibility** | Each function, class, and module has one reason to change. |
| 7 | **High cohesion, low coupling** | Related logic is colocated. Unrelated modules interact through defined contracts only. |
| 8 | **Fail safely** | Errors default to denial, rollback, or graceful degradation — never silent corruption. |
| 9 | **Defensive at boundaries** | Validate all external input. Never trust client-supplied identifiers, permissions, or tenant context. |
| 10 | **No dead code** | Unused code is removed. Commented-out code is not committed. |

### Security & Trust

| # | Principle | Explanation |
|---|-----------|-------------|
| 11 | **Security first** | Security is designed in — not audited in after implementation. |
| 12 | **Least privilege** | Every operation uses the minimum permission required — not elevated service access by default. |
| 13 | **Tenant isolation** | Organization boundary enforced at every data access path — no exceptions. |
| 14 | **Never trust the client** | Authorization, validation, and tenant resolution occur server-side — always. |
| 15 | **Secrets never in code** | Credentials exist only in environment configuration — never in source control. |
| 16 | **Audit everything significant** | Mutations, access changes, and AI interactions produce audit records. |

### Architecture Alignment

| # | Principle | Explanation |
|---|-----------|-------------|
| 17 | **Architecture is frozen** | Extend within boundaries — do not redesign without architectural approval. |
| 18 | **Layered dependencies** | Dependencies flow inward: presentation → application → domain → infrastructure. |
| 19 | **Contract-based integration** | Cross-module communication through defined interfaces — not direct internal imports. |
| 20 | **Domain-driven structure** | Code organization mirrors professional domains — audit, reporting, intelligence, governance. |
| 21 | **Modular monolith discipline** | Single deployable unit with enforced internal boundaries — not an undifferentiated monolith. |
| 22 | **Configuration over hardcoding** | Business rules, templates, and thresholds are configurable — not embedded in code paths. |

### Data & State

| # | Principle | Explanation |
|---|-----------|-------------|
| 23 | **Missing data is not exceptional** | Absent records return null or empty collections — repositories do not throw for missing rows. |
| 24 | **Strong typing everywhere** | All data crossing boundaries is typed — database, API, action, and component props. |
| 25 | **Immutable by default** | Data structures are not mutated in place unless performance requires it — and then explicitly. |
| 26 | **Single source of truth** | Each piece of state has one authoritative owner — not duplicated across layers. |
| 27 | **Optimistic locking for mutations** | Concurrent updates detected via version fields — not last-write-wins. |
| 28 | **Soft delete over hard delete** | Records are archived with audit metadata — hard delete only for explicit GDPR or policy requirements. |

### Performance & Operations

| # | Principle | Explanation |
|---|-----------|-------------|
| 29 | **Performance by design** | Data fetching, rendering, and caching are considered at design time — not profiled in after launch. |
| 30 | **Server-first rendering** | Default to server rendering — client rendering only where interaction requires it. |
| 31 | **Observability by default** | Structured logging, correlation IDs, and error context on every significant operation. |
| 32 | **Idempotent mutations** | Critical operations safe to retry — duplicate submissions do not corrupt state. |
| 33 | **Async for heavy work** | Long-running operations — imports, AI processing, report generation — execute asynchronously. |

### Developer Experience

| # | Principle | Explanation |
|---|-----------|-------------|
| 34 | **TypeScript strict mode** | Strict compiler options enabled — no exceptions without documented justification. |
| 35 | **Linting is mandatory** | Code that fails lint checks is not merged — no suppression without review. |
| 36 | **Consistent naming** | Naming conventions are uniform across the entire codebase — no regional dialects. |
| 37 | **Colocate related code** | Tests, types, and utilities live near the code they support — not in distant directories. |
| 38 | **Document non-obvious decisions** | Comments explain why — not what. Architecture decisions are recorded. |

### Product Alignment

| # | Principle | Explanation |
|---|-----------|-------------|
| 39 | **Design system compliance** | UI implementation conforms to DESIGN_SYSTEM — no ad-hoc visual decisions. |
| 40 | **Accessibility by default** | Accessible implementation is the default — not a retrofit task. |
| 41 | **Internationalization by default** | User-facing strings are externalized — hardcoded prose is forbidden in components. |
| 42 | **AI accountability** | AI outputs are labeled, cited, logged, and require human validation — never silently applied. |

---

## 3. Project Structure

### Organization Philosophy

Project structure is the **physical expression of architecture**. Folder layout must make boundaries visible, dependencies directional, and navigation intuitive. A developer joining the project should understand where code belongs before writing a line.

Structure follows **bounded context** — each domain area is self-contained with explicit integration points.

### Top-Level Organization

| Directory | Purpose |
|-----------|---------|
| Application routes | Page composition, layouts, route handlers — presentation entry points |
| Components | Reusable UI — organized by domain and primitives |
| Configuration | Static application configuration — routes, site, feature flags |
| Constants | Immutable application-wide values |
| Internationalization | Locale definitions, dictionaries, resolution |
| Libraries | Application logic — auth, actions, audit, errors, health, security, supabase |
| Providers | Client-side context providers |
| Repositories | Data access layer — one repository per aggregate |
| Types | Shared type definitions — domain, database, API |
| Utilities | Pure helper functions — no business logic |

### Modules and Bounded Contexts

| Bounded Context | Contains |
|-----------------|----------|
| Identity & Access | Authentication, authorization, session, tenant context |
| Organization | Organizations, workspaces, memberships, roles, permissions |
| Audit (future) | Engagements, workpapers, evidence, review |
| Reporting (future) | Financial statements, disclosures, consolidation |
| Intelligence (future) | Analytics, anomaly detection, AI orchestration |
| Governance | Audit logging, settings, compliance |

Each bounded context owns its repositories, actions, types, and components. Cross-context imports flow through published interfaces — not internal modules.

### Shared Libraries

Shared libraries contain **cross-cutting capability** used by multiple bounded contexts:

| Library | Responsibility |
|---------|----------------|
| Authentication | Session resolution, permission checks, tenant bootstrap |
| Actions | Server action infrastructure — validation, authorization, result wrapping |
| Audit | Audit event emission |
| Errors | Error taxonomy and normalization |
| Logger | Structured logging with context |
| Security | Security utilities and hardening |
| Supabase | Client factories — server, browser, middleware, service |
| Health | Runtime and dependency health checks |

Shared libraries must not contain domain-specific business rules.

### Configuration

| Configuration Type | Location Philosophy |
|--------------------|---------------------|
| Route definitions | Centralized auth and navigation configuration |
| Site metadata | Site name, cookie names, locale defaults |
| Feature flags | Environment-driven — not hardcoded |
| Dashboard navigation | Server-safe configuration — never in client-only modules |

Configuration is declarative. Configuration modules must be importable from Server Components without client boundary violations.

### Utilities

Utilities are **pure functions** with no side effects, no I/O, and no business logic:

| Utility Category | Examples |
|------------------|----------|
| Data transformation | Date formatting, slug generation, pagination |
| Validation helpers | Input sanitization patterns |
| Result normalization | Database result unwrapping |
| Identifiers | UUID generation |

If a function requires database access, authentication, or business rules — it is not a utility.

### Infrastructure

Infrastructure code wraps external systems:

| Infrastructure | Responsibility |
|----------------|----------------|
| Database client | Supabase client creation and configuration |
| Middleware | Request processing, locale, auth gate |
| Migrations | Schema evolution — versioned, reversible where possible |
| Seed data | Reference data bootstrap |

Infrastructure does not contain business logic.

### Domain Separation

| Layer | May Import From | Must Not Import From |
|-------|-----------------|----------------------|
| Routes / Pages | Components, libraries, repositories, types, config | Client-only modules in Server Components |
| Components (server) | Libraries, types, config | Client components, browser APIs |
| Components (client) | Providers, hooks, types, config | Server-only modules |
| Actions | Repositories, libraries, types | Components, UI |
| Repositories | Infrastructure, types, utilities | Components, actions, UI |
| Types | Other types only | Everything else |

### Dependency Direction

Dependencies flow **inward and downward**:

```
Routes → Actions → Repositories → Infrastructure
Routes → Components → Providers
Routes → Libraries (auth, audit)
All layers → Types, Utilities, Config
```

Circular dependencies are forbidden. If two modules require each other, extract shared contract to types or a neutral library.

---

## 4. Naming Standards

### Naming Philosophy

Names are the primary documentation mechanism in code. A well-named entity communicates purpose, scope, and responsibility without requiring comment.

Names are **descriptive, consistent, and searchable**. Abbreviations are avoided except for universally understood terms — ID, URL, API.

### Folders

| Rule | Standard |
|------|----------|
| Case | Lowercase with hyphens for multi-word route segments; lowercase single words otherwise |
| Plurality | Plural for collections — repositories, components, actions, types |
| Depth | Maximum four levels of nesting before reconsidering structure |
| Grouping | Route groups in parentheses — not part of URL |
| Co-location | Related files grouped by feature — not by file type alone |

### Files

| File Type | Convention |
|-----------|------------|
| React component | kebab-case matching exported component name |
| Server module | kebab-case descriptive of responsibility |
| Type definition file | kebab-case or domain name |
| Index barrel | index — re-exports only, no logic |
| Test file | Same name as source with test suffix |
| Migration | Timestamped sequential identifier with descriptive slug |

One primary export per file for components and repositories. Barrel files re-export — they do not implement.

### Components

| Rule | Standard |
|------|----------|
| Case | PascalCase for component names |
| Prefix | No generic prefixes — descriptive noun or noun-phrase |
| Suffix | Role suffix where helpful — Form, Guard, Provider, Shell, Card |
| Client marker | Client components declare client directive at file top — not in name |
| Specificity | OrganizationSwitcher — not Switcher |

### Hooks

| Rule | Standard |
|------|----------|
| Prefix | use — mandatory |
| Case | camelCase after use prefix |
| Scope | One hook per file |
| Naming | useTenant, useAuth — match provider or domain concept |

### Providers

| Rule | Standard |
|------|----------|
| Suffix | Provider — mandatory |
| Export | Provider component and corresponding use hook |
| Naming | AuthProvider, TenantProvider — domain concept |

### Repositories

| Rule | Standard |
|------|----------|
| Suffix | Repository — mandatory |
| Case | PascalCase class name |
| File | kebab-case with -repository suffix |
| Methods | findById, listByOrganization, create, update, softDelete — verb-first |
| Return types | Nullable for single-record lookups; empty array for list lookups |

### Actions

| Rule | Standard |
|------|----------|
| Suffix | Action — mandatory for server actions |
| Case | camelCase export name |
| File | kebab-case in domain-grouped directory |
| Naming | createOrganizationAction — verb + entity + Action |
| Wrappers | authenticatedAction, publicAction — infrastructure wrappers |

### Utilities

| Rule | Standard |
|------|----------|
| Case | camelCase function names |
| File | kebab-case descriptive of category |
| Naming | Verb-first — formatDate, normalizeResult, generateUuid |
| Purity | No side effects — name reflects transformation |

### Types

| Rule | Standard |
|------|----------|
| Interfaces / Types | PascalCase |
| Suffix | Descriptive — SessionUser, TenantBootstrap, RepositoryContext |
| Input types | Suffix with Input — CreateOrganizationInput |
| Result types | Suffix with Result — CreateOrganizationResult |
| Enums | PascalCase name; PascalCase or UPPER_SNAKE members |
| Database types | Generated from schema — not manually duplicated |

### Constants

| Rule | Standard |
|------|----------|
| Case | UPPER_SNAKE_CASE for true constants |
| Grouping | Exported from domain constant modules — not scattered |
| Immutability | as const for object constants |
| Naming | Domain-prefixed — AUTH_ROUTES, PLATFORM_ROLE_SLUGS |

### Environment Variables

| Rule | Standard |
|------|----------|
| Case | UPPER_SNAKE_CASE |
| Prefix | NEXT_PUBLIC_ only for client-safe values |
| Validation | Validated at startup — not read ad hoc without validation |
| Documentation | Every variable documented in deployment guide |
| Secrets | Never logged, never committed, never exposed to client |

### Database Entities

| Rule | Standard |
|------|----------|
| Tables | snake_case plural — organizations, audit_logs |
| Columns | snake_case — organization_id, created_at, deleted_at |
| Primary keys | id — UUID |
| Foreign keys | referenced_table_singular_id — organization_id |
| Timestamps | created_at, updated_at — mandatory |
| Soft delete | deleted_at, deleted_by — nullable |
| Versioning | version — integer, incremented on mutation |
| Indexes | idx_table_column — descriptive |
| RLS policies | Descriptive name reflecting rule intent |

---

# Part 2 — Next.js & TypeScript Standards

## 5. Next.js Philosophy

### Server-First

Next.js App Router enables a **server-first** application architecture. The default rendering and data-fetching strategy is server-side. Client rendering is the exception — reserved for interactivity.

| Server-First Benefit | Application |
|---------------------|-------------|
| Security | Sensitive logic and credentials never reach the browser |
| Performance | HTML streamed to client — faster first meaningful paint |
| SEO | Content rendered server-side where public |
| Bundle size | Less JavaScript shipped to client |
| Data access | Direct database access from server — no API layer duplication |

### App Router

| Standard | Application |
|----------|-------------|
| Routing | File-system routing under locale-prefixed application directory |
| Route groups | Organize without affecting URL — protected, guest groupings |
| Dynamic segments | Bracket notation for locale and entity identifiers |
| Parallel routes | Reserved for future dashboard panel composition |
| Intercepting routes | Reserved for modal-over-list patterns |

### Streaming

| Standard | Application |
|----------|-------------|
| Suspense | Wrap async server components in suspense boundaries |
| Loading UI | loading boundary files provide skeleton states — not spinners |
| Progressive | Page shell streams first — data sections follow |
| Error isolation | Suspense boundaries contain failures — not entire page |

### Layouts

| Layout Level | Responsibility |
|--------------|----------------|
| Root | HTML shell, global providers, locale validation |
| Protected | Authentication guard, tenant provider, application shell |
| Module | Module-specific navigation and context |
| Page | Page-specific wrapper only when necessary |

Layouts compose downward. A layout must not duplicate logic available in a parent layout.

### Loading Boundaries

| Standard | Application |
|----------|-------------|
| File | loading file per route segment where fetch latency is noticeable |
| Content | Skeleton matching page structure — per DESIGN_SYSTEM |
| Scope | Route segment — not entire application |
| Spinner | Last resort — skeleton preferred |

### Error Boundaries

| Standard | Application |
|----------|-------------|
| File | error file per route segment |
| Recovery | Retry action provided |
| Logging | Error logged server-side with correlation ID |
| User message | Calm, informative — per DESIGN_SYSTEM error experience |
| not-found | Dedicated not-found boundary — renders UI, does not recurse |

### Parallel Routes Readiness

Architecture reserves parallel routes for:

- Dashboard panel composition — list + detail simultaneously
- Modal interceptors — entity detail over list
- Multi-panel audit workspaces

Implementation deferred until module development — structure must not preclude adoption.

### Server Actions

Server Actions are the **primary mutation mechanism** — not REST API routes for internal application mutations.

| Standard | Application |
|----------|-------------|
| Location | Grouped in actions library by domain |
| Invocation | Called from client components and forms |
| Return type | Uniform result wrapper — success or typed error |
| Validation | Server-side validation on every action — never trust client |
| Authorization | Authenticated action wrappers enforce identity and permission |

API routes reserved for webhooks, external integrations, and auth callbacks — not internal CRUD.

---

## 6. TypeScript Standards

### Strict Typing

TypeScript strict mode is **mandatory** without exception.

| Compiler Option | Requirement |
|-----------------|-------------|
| strict | Enabled |
| noImplicitAny | Enabled |
| strictNullChecks | Enabled |
| noUncheckedIndexedAccess | Enabled where compatible |
| exactOptionalPropertyTypes | Target — adopt incrementally |

Type safety is a quality gate — not a suggestion.

### No Any

| Rule | Standard |
|------|----------|
| any | Forbidden in production code |
| unknown | Used for untyped external input — narrowed before use |
| Suppression | Type suppression comments require review justification |
| Third-party gaps | Wrapped in typed adapter — not propagated as any |

### No Unsafe Casting

| Rule | Standard |
|------|----------|
| as casts | Forbidden unless narrowing from unknown after validation |
| Type assertions | Replaced by type guards, schema validation, or parsing |
| Database results | Typed via generated schema types |
| URL parameters | Validated and narrowed — not cast to domain types |

### No Non-Null Assertions

| Rule | Standard |
|------|----------|
| ! operator | Forbidden |
| Optional chaining | Used for nullable access — ?. and ?? |
| Null checks | Explicit guards before access |
| Defaults | Sensible defaults via nullish coalescing |

### Utility Types

| Utility | Use Case |
|---------|----------|
| Pick, Omit | Deriving input types from entity types |
| Partial | Update operations — optional fields |
| Readonly | Immutable configuration and constants |
| Record | Typed dictionaries with known keys |
| Extract, Exclude | Union narrowing |
| ReturnType, Parameters | Inferring from functions — sparingly |

Utility types reduce duplication — they do not obscure intent.

### Domain Types

| Type Category | Location |
|---------------|----------|
| Database entities | Generated from Supabase schema |
| Session and auth | Auth types module |
| Tenant context | Tenant types module |
| Repository context | Context types module |
| Action input/output | Co-located with action or in types module |

Domain types are the contract between layers. They are not duplicated.

### DTO Philosophy

Data Transfer Objects define **boundaries between layers**:

| Boundary | DTO Purpose |
|----------|-------------|
| Action input | Validated user submission shape |
| Action result | Success payload or error |
| Repository input | Create and update shapes — Pick from entity |
| API response | External-facing shape — never raw database entity |

DTOs are explicit types — not inferred from loose objects.

### Result Types

All operations that can fail return **discriminated result types**:

| Variant | Shape |
|---------|-------|
| Success | success true with typed data payload |
| Failure | success false with typed error |

Exceptions are not thrown across layer boundaries for expected failure conditions. Exceptions are for exceptional infrastructure failure.

### Null Handling

| Context | Standard |
|---------|----------|
| Repository find | Returns null for missing single record |
| Repository list | Returns empty array — never null |
| Optional fields | Typed as T or null — not T or undefined or null interchangeably |
| Session user | Null when unauthenticated — not thrown |
| Tenant context | Degrades to empty — does not throw on missing org |

### Error Modeling

| Error Category | Type | Thrown or Returned |
|----------------|------|-------------------|
| Validation | ValidationError | Returned in action result |
| Authorization | AuthorizationError | Returned in action result |
| Not found | NotFoundError | Returned or null — not thrown in repositories |
| Conflict | ConflictError | Returned in action result — version mismatch |
| Database | DatabaseError | Thrown — infrastructure failure |
| Unknown | Normalized to ApplicationError | Logged and returned safely |

---

## 7. React Standards

### Composition

| Principle | Application |
|-----------|-------------|
| Component composition | Complex UI built from simple components — not monolithic components |
| Children prop | Containers accept children — layout components are composable |
| Render props | Avoided — prefer composition and hooks |
| Higher-order components | Avoided — prefer hooks and composition |

### Hooks

| Rule | Standard |
|------|----------|
| Rules of hooks | Never conditional — always at top level |
| Custom hooks | Extract reusable stateful logic — one hook per file |
| Server vs client | Hooks only in client components — never in server components |
| Dependencies | Effect dependencies explicit and complete — lint enforced |

### State Ownership

| State Type | Owner |
|------------|-------|
| Server data | Server — fetched in Server Components, passed as props |
| URL state | URL search params — filters, pagination, selected ID |
| Form state | Client component local state or form library |
| Global auth | AuthProvider — initialized from server session |
| Global tenant | TenantProvider — initialized from server bootstrap |
| UI ephemeral | Local component state — modals, toggles, hover |

State is lifted only when genuinely shared. Prop drilling beyond two levels triggers context or composition reconsideration — not automatic context.

### Context Usage

| Rule | Standard |
|------|----------|
| Scope | Context for truly global state — auth, tenant, theme, locale |
| Performance | Context split by concern — not one mega-context |
| Provider key | Remount providers when server identity changes — after login, onboarding |
| Optional access | useOptional pattern for guards that work inside and outside provider |
| Server data | Context initialized from server props — not fetched client-side on mount |

### Memoization Philosophy

| Rule | Standard |
|------|----------|
| Default | No memoization — optimize only when measured |
| useMemo | Expensive computations only — not object literals for props |
| useCallback | Stable references for effect dependencies — not premature |
| React.memo | Components with expensive render and stable props — measured first |
| Principle | Readability over premature optimization |

### Rendering Rules

| Rule | Standard |
|------|----------|
| Server default | Components are Server Components unless interactivity required |
| Client directive | Only when using hooks, events, browser APIs, or state |
| No server imports in client | Never import server-only modules in client components |
| No client constants in server | Shared constants in server-safe modules — config directory |
| Async server components | Async allowed in Server Components — await data directly |

### Component Responsibilities

| Component Type | Responsibility |
|----------------|----------------|
| Page | Route entry — fetches data, composes layout, passes to presentation |
| Layout | Structural wrapper — navigation, guards, providers |
| Feature component | Domain UI — dashboard, onboarding, auth forms |
| Primitive component | Design system building blocks — button, input, card |
| Guard component | Access control — route, permission, role, onboarding |
| Provider component | Context distribution — auth, tenant, theme |

Components do not fetch data in client components. Components do not contain business logic. Components do not access repositories directly.

---

# Part 3 — Server Implementation

## 8. Server Components

### Responsibilities

Server Components are responsible for:

| Responsibility | Detail |
|----------------|--------|
| Data fetching | Direct database access via repositories and libraries |
| Authorization check | Verify user and permissions before rendering sensitive content |
| Layout composition | Assemble page structure from child components |
| Metadata | Page title, description, Open Graph |
| Initial state | Pass serialized data to client components as props |
| Streaming | Yield content progressively via Suspense |

Server Components are not responsible for interactivity, state, or browser APIs.

### Data Loading

| Rule | Standard |
|------|----------|
| Colocation | Data fetched in the page or layout that needs it — not globally |
| Parallel | Independent fetches use parallel awaiting — not sequential |
| Waterfall avoidance | Child data requirements anticipated — fetch at parent when needed |
| Error handling | Try/catch with graceful fallback — never unhandled throw to error boundary for expected conditions |
| Null safety | Every nullable value handled — no assumption that org, workspace, or user exists |
| Tenant context | Resolved server-side — passed to providers as bootstrap |

### Composition

| Rule | Standard |
|------|----------|
| Client boundaries | Client components are leaves — not parents of Server Components |
| Props | Only serializable props passed to client components |
| Children | Server Components may wrap client components with server-rendered children |
| Imports | Server-safe config and types — never from client modules |

### Caching Philosophy

| Data Type | Caching Strategy |
|-----------|------------------|
| User-specific | No static cache — dynamic rendering |
| Tenant-specific | No cross-tenant cache — dynamic rendering |
| Public reference | Static generation or ISR where appropriate |
| Dictionary/i18n | Cached per locale — rebuild on deploy |
| Health checks | Never cached |

Caching must never leak data across tenants or users.

### Security

| Rule | Standard |
|------|----------|
| Secrets | Never referenced in components — only in server libraries |
| Service role | Service client only in server actions and repositories — never in components directly |
| Output encoding | User content escaped by default — dangerouslySetInnerHTML forbidden without sanitization |
| Permission gating | Sensitive UI sections gated server-side — not only client-side guards |

---

## 9. Client Components

### Minimal Usage

Client components are used **only when necessary**:

| Requires Client | Does Not Require Client |
|-----------------|------------------------|
| Event handlers — onClick, onSubmit | Static display of server-fetched data |
| useState, useEffect, useRef | Layout composition |
| Browser APIs — localStorage, window | Conditional rendering from server props |
| Animations and transitions | Links and navigation |
| Third-party client libraries | Formatted text and tables from server data |

When in doubt, implement as Server Component first.

### Interaction Only

Client components own **user interaction logic**:

| Interaction | Client Responsibility |
|-------------|----------------------|
| Form submission | Invoke server action, handle result, display errors |
| Optimistic UI | Temporary state during action execution |
| Navigation | router.push, router.refresh after mutation |
| Toggle, expand | Local UI state |
| Drag and drop | Future — client only |

### State

| Rule | Standard |
|------|----------|
| Initialization | From server props — not client fetch on mount |
| Sync | Provider key or prop sync when server refreshes |
| Persistence | URL or server — not localStorage for authoritative state |
| Minimization | Minimum state for interaction — derive everything else |

### Animations

| Rule | Standard |
|------|----------|
| Scope | Micro-interactions only — per DESIGN_SYSTEM |
| Library | Consistent animation approach — not mixed libraries |
| Reduced motion | Respect prefers-reduced-motion |
| Performance | GPU-accelerated properties only — transform, opacity |

### Accessibility

| Rule | Standard |
|------|----------|
| Keyboard | All interactions keyboard accessible |
| ARIA | Correct roles and labels on interactive elements |
| Focus | Focus management on modal open/close |
| Live regions | Dynamic content updates announced |

Client components must meet DESIGN_SYSTEM accessibility standards.

---

## 10. Server Actions

### Action Philosophy

Server Actions are the **secure mutation boundary** between client interaction and server-side business logic.

| Principle | Application |
|-----------|-------------|
| Single purpose | One action per operation — not generic CRUD |
| Thin orchestration | Action validates, authorizes, delegates to repository or service |
| Uniform result | Every action returns typed result wrapper |
| Auditable | Significant mutations emit audit events |
| Idempotent | Safe to retry where business rules allow |

### Validation

| Layer | Responsibility |
|-------|----------------|
| Input shape | TypeScript type enforced at call site |
| Business validation | Server-side rules — required fields, format, constraints |
| Schema validation | Structured validation library for complex input |
| Sanitization | Trim strings, normalize email, reject unexpected fields |

Client-side validation is for UX — server validation is authoritative.

### Authorization

| Check | When |
|-------|------|
| Authentication | Every action except explicit public actions |
| Permission codes | Before domain mutations |
| Tenant context | Organization and workspace scope verified |
| Role requirements | Elevated operations require role check |
| Resource ownership | User can only mutate resources within their tenant |

Authorization failure returns typed error — not thrown exception to client.

### Logging

| Event | Logged |
|-------|--------|
| Action invocation | Module name, user ID, correlation ID |
| Success | Duration, resource affected |
| Failure | Error type, message, stack — server only |
| Authorization denial | User ID, attempted action, resource |

Sensitive data never logged — passwords, tokens, PII.

### Error Handling

| Error Type | Action Response |
|------------|-----------------|
| Validation | success false, validation error with field messages |
| Authorization | success false, authorization error — no resource detail leak |
| Not found | success false, not found error |
| Conflict | success false, conflict error with version detail |
| Infrastructure | success false, generic error — detailed error logged server-side |

Unexpected exceptions caught by action wrapper — normalized to safe client response.

### Result Handling

| Rule | Standard |
|------|----------|
| Discriminated union | Caller checks success before accessing data |
| Client handling | Form displays field errors; toast for success; alert for failure |
| No throw to client | Actions do not throw — they return results |
| Type safety | Result type exported alongside action |

### Idempotency

| Operation | Idempotency Strategy |
|-----------|---------------------|
| Create with unique constraint | Return existing on conflict — or clear error |
| Update with version | Reject stale version — not silent overwrite |
| Delete | Soft delete idempotent — second delete returns not found |
| Toggle | Set explicit target state — not flip |

Idempotency keys reserved for future payment and external integration actions.

---

# Part 4 — Data Access

## 11. Repository Pattern

### Responsibilities

Repositories are the **sole gateway** to persistent data within a bounded context.

| Responsibility | Detail |
|----------------|--------|
| Query execution | All database queries for an aggregate |
| Mapping | Database rows to domain types |
| Filter application | Active record filter — soft delete exclusion |
| Context enforcement | Tenant and user context applied to queries |
| Error normalization | Database errors wrapped in typed DatabaseError |

Repositories do not contain business orchestration. Repositories do not call other bounded context repositories directly — orchestration belongs in actions or services.

### Boundaries

| Rule | Standard |
|------|----------|
| One repository per aggregate | OrganizationRepository, WorkspaceRepository — not GenericRepository |
| No UI imports | Repositories are server-only |
| No action imports | Repositories do not call actions |
| Client injection | Supabase client injected via constructor — testable |
| Context injection | RepositoryContext carries userId and tenant resolution state |

### Query Ownership

| Query Type | Owner |
|------------|-------|
| Single record by ID | Repository findById |
| Single record by unique field | Repository findBySlug, findByCode |
| List by parent | Repository listByOrganization |
| List for current user | Repository with RLS — not application-side filtering alone |
| Aggregation | Repository or dedicated query module — not in action |
| Search | Repository with full-text or dedicated search service |

### Error Handling

| Condition | Repository Behavior |
|-----------|---------------------|
| No row on maybeSingle | Return null — not throw |
| Empty list | Return empty array — not null |
| Database error | Throw DatabaseError — infrastructure failure |
| Not found on mutation | requireRow throws NotFoundError — expected on update/delete miss |
| Version mismatch | Returns null on update — action maps to ConflictError |

Missing data is not exceptional. Infrastructure failure is exceptional.

### Transactions

| Rule | Standard |
|------|----------|
| Scope | Multi-table mutations in single transaction |
| Owner | Service layer or action orchestrates transaction — not repository internally |
| Rollback | Any failure rolls back entire transaction |
| Isolation | Default PostgreSQL isolation — explicit when needed |

### Optimistic Locking

| Rule | Standard |
|------|----------|
| Version column | Integer incremented on every update |
| Update query | Includes version in WHERE clause |
| Mismatch | Returns null — caller maps to conflict |
| Client responsibility | Pass expected version from last read |

---

## 12. Database Standards

### Supabase

| Standard | Application |
|----------|-------------|
| Client types | Generated from schema — maintained in types module |
| Server client | Cookie-aware — for authenticated user context |
| Service client | Elevated — only in server actions requiring bypass |
| Browser client | Auth operations only — not data mutations |
| Middleware client | Session refresh and route protection |
| RLS | Primary authorization mechanism at database layer |

### PostgreSQL

| Standard | Application |
|----------|-------------|
| UUID primary keys | All tables — gen_random_uuid |
| Timestamps | created_at, updated_at — automatic |
| Soft delete | deleted_at, deleted_by — nullable |
| Versioning | version integer — optimistic locking |
| Foreign keys | Enforced with ON DELETE restrictions — not CASCADE for tenant data |
| Constraints | CHECK constraints for enums and status fields |
| Comments | Table and column comments for domain documentation |

### Row Level Security

| Rule | Standard |
|------|----------|
| Default | RLS enabled on every tenant table — no exceptions |
| Policy | Organization membership determines access |
| Service role | Bypasses RLS — used only in controlled server contexts |
| Testing | RLS policies tested — cross-tenant access must fail |
| New tables | RLS policies written in same migration as table creation |

### Soft Delete

| Rule | Standard |
|------|----------|
| Implementation | deleted_at timestamp — null means active |
| Queries | applyActiveFilter on all read queries — is deleted_at null |
| Audit | deleted_by records who performed deletion |
| Restore | Explicit restore operation — not undelete by nulling |
| Hard delete | Only for GDPR erasure — separate documented process |

### Audit

| Rule | Standard |
|------|----------|
| Table | audit_logs — append-only |
| Fields | action, resource_type, resource_id, user_id, organization_id, metadata, timestamp |
| Emission | Significant mutations emit audit events from actions |
| Immutability | Audit records never updated or deleted |
| AI events | AI interactions logged with model, input scope, output hash |

### Versioning

| Rule | Standard |
|------|----------|
| Entity version | version column per mutable table |
| Increment | On every successful update |
| Schema version | Migrations versioned sequentially — timestamp prefix |
| Seed version | Seed data idempotent — safe to re-run |

### Indexes

| Rule | Standard |
|------|----------|
| Foreign keys | Indexed automatically — verified in migration |
| Query patterns | Indexes match repository query patterns |
| Composite | Multi-column indexes for common filter combinations |
| Partial | Partial indexes for active records — where deleted_at is null |
| Review | Index additions reviewed — no speculative indexes |

### Migrations

| Rule | Standard |
|------|----------|
| Version control | Every schema change in migration file |
| Naming | Timestamp descriptive slug |
| Reversibility | Down migration where safe — documented when not reversible |
| Idempotency | Migrations safe to apply once — not re-run |
| RLS with table | Policies in same migration as table |
| Seed separation | Reference data in seed — not in migrations |
| Review | Migration reviewed for RLS, indexes, and constraints before merge |

---

## 13. Service Layer

### Business Orchestration

The service layer coordinates **multi-step business operations** that span repositories, external systems, or async processing.

| Orchestration Type | Service Responsibility |
|--------------------|----------------------|
| Onboarding | Create organization, membership, settings, cookies, audit — atomically |
| Provisioning | Default roles, permissions, workspace setup |
| Import | Validate, transform, bulk insert, report results |
| AI pipeline | Retrieve context, invoke model, validate output, log interaction |
| Report generation | Query, template, render, store, notify |

Actions delegate to services when orchestration exceeds single-repository scope.

### Repository Composition

| Rule | Standard |
|------|----------|
| Services compose repositories | Not the reverse |
| Transaction boundary | Service owns transaction when multiple repositories involved |
| Context propagation | RepositoryContext passed to all repositories in orchestration |
| Error aggregation | Service maps repository errors to business results |

### External Services

| Rule | Standard |
|------|----------|
| Abstraction | External service behind interface — not direct SDK in action |
| Timeout | All external calls have defined timeout |
| Retry | Retry with backoff for transient failures — not for mutations |
| Circuit breaker | Fail fast when external service degraded |
| Fallback | Graceful degradation — AI unavailable returns clear error |
| Secrets | API keys from environment — injected, not imported |

### AI Boundaries

| Rule | Standard |
|------|----------|
| Orchestration | AI service layer — not in components or repositories |
| Context retrieval | Permission-filtered data retrieved before model invocation |
| Output validation | AI response validated before presentation or storage |
| Logging | Full interaction logged — input scope, model, output |
| Human gate | AI output not persisted as authoritative without explicit user acceptance |
| Provider abstraction | Model provider swappable — domain code independent of vendor |

---

## 14. Error Handling

### Error Taxonomy

| Category | Type | Recoverable | User Message |
|----------|------|-------------|--------------|
| Validation | ValidationError | Yes | Specific field or rule message |
| Authorization | AuthorizationError | Yes | Permission denied — no resource leak |
| Not found | NotFoundError | Yes | Resource not found |
| Conflict | ConflictError | Yes | Version conflict — refresh and retry |
| Business rule | BusinessError | Yes | Domain-specific message |
| Database | DatabaseError | No | Generic — logged in detail |
| Infrastructure | InfrastructureError | No | Generic — logged in detail |
| Unknown | Normalized ApplicationError | No | Generic — logged in detail |

### Recoverable Errors

Errors the user or system can correct:

| Error | Recovery Path |
|-------|---------------|
| Validation | Fix input and resubmit |
| Authorization | Request access or switch context |
| Not found | Navigate away or create resource |
| Conflict | Refresh data and retry |
| Rate limit | Wait and retry |

Recoverable errors return in action result — never thrown across boundary.

### Fatal Errors

Errors requiring operator intervention:

| Error | Response |
|-------|----------|
| Database connection failure | Log, alert, generic user message |
| External service unavailable | Log, degrade gracefully, user notification |
| Unhandled exception | Catch at action boundary, log with stack, generic user message |

Fatal errors are logged with full context — user sees calm, non-technical message per DESIGN_SYSTEM.

### Validation Errors

| Rule | Standard |
|------|----------|
| Field-level | Map to specific fields — array of field message pairs |
| Form-level | Summary at top when multiple fields |
| Code | Machine-readable error code — for i18n |
| Message | Human-readable — professional tone |

### Authorization Errors

| Rule | Standard |
|------|----------|
| Message | Generic — "Permission denied" |
| Detail | No leak of resource existence or other user data |
| Log | Full detail server-side — user, action, resource |
| HTTP | 403 for routes — not 404 to hide existence |

### Infrastructure Errors

| Rule | Standard |
|------|----------|
| Catch | At action and route handler boundary |
| Log | Correlation ID, stack trace, request context |
| User | "Something went wrong" with retry — not stack trace |
| Alert | Operator notification for sustained failures |

### Business Errors

| Rule | Standard |
|------|----------|
| Domain-specific | Engagement already signed off, period closed |
| Recoverable | User understands what happened and what to do |
| Code | Machine-readable for client handling |
| Audit | Business rule violations logged when security-relevant |

### Logging

| Level | Use |
|-------|-----|
| debug | Development diagnostics — not production default |
| info | Significant operations — action success, login |
| warn | Recoverable anomalies — retry succeeded, deprecated usage |
| error | Failures requiring attention — validation of infrastructure |
| fatal | System integrity threatened — alert immediately |

All logs structured — JSON with correlation ID, user ID, organization ID, module.

### User Messages

| Rule | Standard |
|------|----------|
| Tone | Calm, professional, actionable — per DESIGN_SYSTEM |
| Content | What happened and what to do — not error codes |
| i18n | User messages externalized — translatable |
| Technical detail | Never in user message — in logs only |
| Reference ID | Support reference for fatal errors — not internal codes |

---

## Document Control

| Field | Value |
|-------|-------|
| Document | Implementation Standard |
| Version | 0.4.0 |
| Parts Complete | 1–4 |
| Status | Draft — Parts 1–4 Complete |
| Last Updated | 2026-06-30 |
| Change Summary | Initial release — Part 1 (Engineering Philosophy), Part 2 (Next.js & TypeScript), Part 3 (Server Implementation), Part 4 (Data Access) |
| Author | Chief Software Architect / Engineering Excellence Director |
| Next Planned | Part 5 — Security, Authentication & Authorization |

### Revision History

| Version | Date | Changes |
|---------|------|---------|
| 0.4.0 | 2026-06-30 | Parts 1–4 — Engineering Philosophy through Data Access |

---

**Parts 1–4 are complete. Await next instruction.**

---

*End of Parts 1–4*

---

# Part 5 — Security, Authentication & Authorization

## 15. Security Philosophy

### Security as a Product Feature

Security is not an infrastructure afterthought. It is a **product capability** that regulated professionals depend upon to protect client data, maintain professional privilege, and satisfy regulatory obligations.

A platform that leaks tenant data, permits unauthorized sign-off, or conceals security failures is not merely buggy — it is professionally unusable. Security quality is measured in the same way as audit quality: by what was prevented, what was detected, and what can be demonstrated after the fact.

### Zero Trust

The platform assumes **no implicit trust** at any layer:

| Assumption Rejected | Implementation Response |
|---------------------|------------------------|
| Internal network is safe | Every request authenticated and authorized |
| Client-supplied context is valid | Tenant, organization, and permissions resolved server-side |
| Database access is sufficient | Application-layer authorization precedes every mutation |
| Service role is default | Elevated access is explicit, scoped, and audited |
| Prior session remains valid | Session validity re-verified on sensitive operations |

Zero trust does not mean zero usability. It means trust is earned on every request through verification — not granted by network position or prior authentication alone.

### Defense in Depth

Security controls are layered. Failure of one layer must not collapse the entire security posture.

| Layer | Control |
|-------|---------|
| Edge | TLS, rate limiting, request validation |
| Middleware | Session verification, route classification, locale and tracing headers |
| Application | Authentication, authorization, input validation, output encoding |
| Action | Permission checks, tenant scope, idempotency, audit emission |
| Repository | Context enforcement, active-record filters |
| Database | Row-level security, constraints, foreign keys |
| Operational | Secrets management, access logging, incident response |

No single layer is sufficient. RLS is defense in depth — not a substitute for application authorization.

### Least Privilege

Every operation, user, service account, and database connection uses the **minimum permission required**:

| Actor | Privilege Standard |
|-------|-------------------|
| End user | Scoped to organization membership and assigned roles |
| Repository (user client) | Subject to RLS — no elevated bypass |
| Server action | Validates permissions before invoking service or repository |
| Service client | Used only where RLS bypass is architecturally required — provisioning, bootstrap |
| Admin operations | Separate permission path — explicit audit for every action |
| Background worker | Scoped service identity per job type — not global admin |

Elevated access is the exception. Its use is logged, justified, and reviewable.

### Secure by Default

| Default | Standard |
|---------|----------|
| Authentication required | Protected routes deny unauthenticated access |
| Authorization required | Mutations require explicit permission — not open by omission |
| RLS enabled | Every tenant table — no unprotected tables in production |
| Cookies | HttpOnly, Secure, SameSite — session cookies never accessible to scripts |
| Errors | Generic client messages — detailed errors server-side only |
| CORS | Restricted to known origins — not wildcard in production |
| New features | Secure implementation path — not "secure later" |

### Fail Closed

When security state is ambiguous, the platform **denies access** — not grants it.

| Ambiguous Condition | Response |
|-------------------|----------|
| Session invalid or expired | Unauthenticated — redirect to login |
| Permission resolution fails | Deny — not permit with empty permissions |
| Tenant context unresolved | Redirect to onboarding or deny mutation |
| RLS policy error | Deny query — log infrastructure error |
| Token refresh failure | Terminate session — require re-authentication |
| Service unavailable | Deny — not serve cached privileged data |

Fail closed applies to authorization, not availability of public content. Public routes remain accessible without authentication by explicit classification.

### Defense Layers

Defense layers are independently testable:

| Layer | Verification Method |
|-------|---------------------|
| Route access | Middleware classification and integration tests |
| Action authorization | Unit and integration tests per permission |
| Repository scoping | Query tests with multiple tenant contexts |
| RLS | Cross-tenant access tests — must fail |
| Audit | Event emission verification on sensitive operations |

### Security Reviews

| Review Type | When |
|-------------|------|
| Feature security review | Before merge of auth, permission, or data access changes |
| Threat modeling | New modules and external integrations |
| Dependency audit | Continuous — critical vulnerabilities block release |
| Penetration test | Annual — or before major enterprise release |
| RLS policy review | Every migration touching tenant tables |

Security findings at critical severity block release until remediated or explicitly accepted with documented risk.

### Secrets Management

| Rule | Standard |
|------|----------|
| Storage | Environment variables or managed secrets service — never source control |
| Rotation | Supported without code change — documented rotation procedure |
| Scope | Secrets scoped per environment — production secrets never in development |
| Logging | Secrets never logged, echoed, or returned in errors |
| Client exposure | Only NEXT_PUBLIC_ prefixed values client-accessible — validated at build |
| Service role | Server-only — never bundled in client JavaScript |

### Professional Responsibility

Security implementation supports **professional accountability**:

- Audit trail immutability for governance events
- Sign-off and approval actions require authenticated, authorized, identified users
- AI outputs cannot bypass human validation for authoritative records
- Session and access changes are logged with actor identity
- Data export and deletion require elevated permission and audit

---

## 16. Authentication Standards

### Supabase Auth

| Standard | Application |
|----------|-------------|
| Provider | Supabase Auth as sole identity provider for credentials flow |
| User identity | Supabase auth.users — application profiles linked by user ID |
| Server verification | getUser on server — not getSession alone for authorization decisions |
| Client usage | Browser client for sign-in, sign-out, password flows only |
| Middleware | Session refresh and cookie propagation on every request |
| Email templates | Configured in Supabase — branded per organization policy (future) |

### Sessions

| Standard | Application |
|----------|-------------|
| Session source | Supabase session — server-resolved for rendering and actions |
| Session user | Enriched with tenant, roles, and permissions from application layer |
| Fallback | Auth user mapped to minimal session user when DB resolution fails — never null authenticated |
| Loading state | Explicit loading session state — not ambiguous unauthenticated |
| Sync | Provider remount on server identity change — after login, logout, onboarding |

### Cookies

| Cookie Type | Standard |
|-------------|----------|
| Session | Managed by Supabase SSR — HttpOnly, Secure in production |
| Locale | Non-sensitive — persisted preference |
| Organization | Tenant preference — validated against membership on use |
| Workspace | Tenant preference — validated against workspace access on use |
| Naming | Centralized in site configuration — not ad hoc cookie names |
| Validation | Cookie values validated server-side — never trusted as authorization proof alone |

### Refresh Tokens

| Standard | Application |
|----------|-------------|
| Handling | Managed by Supabase SSR middleware — not manually parsed in application code |
| Rotation | Supabase default rotation policy — not disabled |
| Failure | Failed refresh terminates session — user re-authenticates |
| Exposure | Refresh tokens never exposed to client JavaScript |

### Password Recovery

| Standard | Application |
|----------|-------------|
| Flow | Forgot password → email link → reset password page |
| Token | Single-use, time-limited — Supabase managed |
| Validation | Password strength requirements on reset |
| Error | Generic response on forgot password — no email enumeration |
| Audit | Password reset events logged as security events |
| Redirect | Safe internal redirect only — validated callback paths |

### Email Verification

| Standard | Application |
|----------|-------------|
| Requirement | Configurable per organization policy — enabled by default for new registrations |
| Flow | Register → verification email → callback → session established |
| Resend | Rate-limited resend action — audited |
| Unverified | Unverified users restricted from protected operations — per policy |
| Callback | Auth callback route exchanges code — redirects via safe internal path |

### MFA Readiness

| Standard | Application |
|----------|-------------|
| Architecture | Authentication flow supports MFA enrollment without routing redesign |
| Supabase | TOTP via Supabase Auth — enabled when product requires |
| Enforcement | Organization policy may require MFA — checked at login |
| Recovery | Backup codes and admin recovery — documented before enforcement |
| Session | MFA verification required for sensitive operations — step-up auth (future) |
| Audit | MFA enrollment, disable, and failure logged |

### SSO Readiness

| Standard | Application |
|----------|-------------|
| Protocol | SAML and OIDC via Supabase Auth — enterprise SSO path |
| Tenant mapping | SSO identity mapped to organization — not global account |
| Provisioning | JIT provisioning or invite-only — organization policy |
| Fallback | Break-glass local admin access — documented |
| Session | SSO sessions subject to same application session enrichment |

### Device Trust

| Standard | Application |
|----------|-------------|
| Session list | User can view active sessions — future enhancement |
| Revocation | Sign out all devices — supported via Supabase |
| New device | Login notification — future enhancement |
| Fingerprinting | No invasive device fingerprinting — privacy by design |

### Session Expiration

| Standard | Application |
|----------|-------------|
| Idle timeout | Configurable per organization — enforced server-side |
| Absolute timeout | Maximum session lifetime — enforced regardless of activity |
| Sensitive operations | Re-authentication for elevated actions — step-up (future) |
| Expiry UX | Calm redirect to login with return URL — not cryptic error |

### Secure Logout

| Standard | Application |
|----------|-------------|
| Server action | Sign-out action invalidates Supabase session |
| Client state | Auth provider reset to unauthenticated |
| Cookies | Tenant preference cookies cleared or preserved per policy — session always cleared |
| Redirect | Public landing or login — not protected route |
| Audit | Logout event logged |

---

## 17. Authorization Standards

### RBAC

Role-Based Access Control is the **primary authorization model**:

| Concept | Implementation |
|---------|----------------|
| Role | Named collection of permissions — platform and organization scoped |
| Permission | Atomic capability — resource.action code |
| Assignment | Role assigned via membership — organization or workspace scope |
| Inheritance | Organization membership implies organization-scoped permissions; workspace membership adds workspace-scoped permissions |
| Platform roles | System-defined roles — Organization Owner, Workspace Admin, etc. |
| Custom roles | Organization-defined roles (future) — same permission machinery |

Authorization checks permission codes — not role names alone — except where role slug is explicitly required.

### ABAC Readiness

Attribute-Based Access Control extensions are architecturally reserved:

| Attribute Dimension | Future Use |
|--------------------|------------|
| Engagement assignment | User can access only assigned engagements |
| Entity relationship | Access scoped to client entity hierarchy |
| Data classification | Restricted fields by clearance level |
| Temporal | Access limited to active engagement period |
| Geographic | Data residency constraints |

RBAC remains default. ABAC rules compose with RBAC — not replace it. Permission resolution interface supports attribute predicates without breaking existing checks.

### Permission Resolution

| Step | Responsibility |
|------|----------------|
| 1 | Resolve authenticated user |
| 2 | Load active memberships for user |
| 3 | Resolve organization from preferences and memberships |
| 4 | Resolve workspace within organization |
| 5 | Collect role IDs from scoped memberships |
| 6 | Resolve permission codes from role_permissions |
| 7 | Return sorted deduplicated permission code set |

Permission resolution never throws for missing role or permission records — degrades gracefully with logging.

### Role Resolution

| Standard | Application |
|----------|-------------|
| Role slugs | Collected from resolved roles — for role-guard components |
| Missing role | Skipped — not fatal to tenant resolution |
| Platform roles | Resolved from seed data — slug is stable contract |
| Multiple roles | Union of permissions — not intersection |

### Tenant Resolution

| Context | Resolution Source |
|---------|-------------------|
| Organization | Cookie preference validated against memberships — fallback to first membership |
| Workspace | Cookie preference validated against organization workspaces — fallback to first accessible |
| Session | Organization and workspace IDs embedded in session user after resolution |
| Bootstrap | Tenant bootstrap aggregates organizations, workspaces, permissions for providers |

Unresolved tenant context redirects to onboarding — does not throw in layout rendering.

### Organization Context

| Standard | Application |
|----------|-------------|
| Required for | All protected domain operations |
| Source | Resolved membership — not client-supplied ID alone |
| Switch | Organization switch action validates membership — sets cookie — refreshes context |
| Guard | Onboarding guard enforces organization existence before dashboard access |

### Workspace Context

| Standard | Application |
|----------|-------------|
| Required for | Workspace-scoped operations |
| Optional for | Organization-scoped operations — workspace may be null |
| Switch | Workspace switch validates access within current organization |
| Default | First accessible workspace when preference invalid |

### Company Context

| Standard | Application |
|----------|-------------|
| Status | Reserved for audit module — company-scoped engagements |
| Resolution | Company ID from engagement context — not global cookie (future) |
| Permissions | Company-scoped permissions extend workspace permissions (future) |

### Permission Caching

| Rule | Standard |
|------|----------|
| Request scope | Permissions resolved per server request — not cached across users |
| Client cache | Tenant provider holds bootstrap permissions — refreshed on navigation |
| Invalidation | Permission changes take effect on next request — not delayed |
| No long-lived cache | Permissions never cached in CDN or edge — user-specific |
| Stale session | Client guards merge tenant bootstrap and session permissions |

### Security Validation

| Check Point | Validation |
|-------------|------------|
| Middleware | Route classification — guest, public, protected |
| Layout | Protected route guard — session authenticated |
| Server action | Authenticated action wrapper — user ID and permission check |
| Repository | RLS enforces tenant — application passes correct client |
| Permission guard | UI gate — server permissions preferred over client session alone |
| API route | Same authorization as actions — not weaker |

Client-side guards are UX — not security. Server always re-validates.

---

## 18. RLS Standards

### Policy Philosophy

Row-Level Security is the **database-layer enforcement** of tenant isolation. It exists because application bugs happen — RLS prevents cross-tenant data exposure when application checks fail.

RLS is necessary but not sufficient. Application authorization remains primary for complex engagement-level permissions.

### Policies

| Rule | Standard |
|------|----------|
| Every tenant table | RLS enabled — no exceptions |
| Policy naming | Descriptive — reflects intent — membership_select, organization_member_update |
| Operation coverage | SELECT, INSERT, UPDATE, DELETE — each explicitly policy-controlled |
| Default deny | No policy means no access — not open access |
| Service role | Bypasses RLS — used only in controlled server contexts |
| Documentation | Policy intent commented in migration |

### Tenant Isolation

| Isolation Rule | Implementation |
|----------------|----------------|
| Organization boundary | Rows accessible only to organization members |
| Membership proof | auth.uid() matched against memberships.user_id |
| Active membership | status active and deleted_at null |
| Workspace scope | Workspace-scoped rows additionally require workspace membership |
| Cross-organization | Query returning zero rows — not error — for unauthorized access |

### Service Role

| Rule | Standard |
|------|----------|
| Usage | Provisioning, bootstrap, admin operations, background jobs |
| Never client | Service role key never in browser or NEXT_PUBLIC_ |
| Audit | Service role mutations emit audit events with acting user ID in metadata |
| Scope | Service operations still validate business rules in application — not unrestricted |
| Repository | Service client injected explicitly — not default repository client |

### Admin Operations

| Rule | Standard |
|------|----------|
| Permission | Requires platform or organization admin permission codes |
| Elevation | Admin actions use authenticated action with explicit permission check |
| RLS | Admin may use service role — with audit |
| Separation | Admin UI separated from practitioner UI — permission-gated |

### Cross-Tenant Protection

| Test | Requirement |
|------|-------------|
| User A cannot read User B organization | Verified in integration tests |
| Manipulated organization ID | Returns empty or denied — not other tenant data |
| Manipulated cookie | Validated against membership — invalid cookie ignored |
| SQL injection | Parameterized queries only — ORM/client enforced |

Cross-tenant access attempts are logged as security events.

### Soft Delete

| Rule | Standard |
|------|----------|
| RLS and soft delete | Policies exclude deleted_at not null rows for standard users |
| Admin restore | Separate policy or service role for restore operations |
| Hard delete | Separate documented policy — GDPR erasure only |

### Audit Logging

| Rule | Standard |
|------|----------|
| audit_logs table | Append-only — RLS permits insert for authenticated, read for authorized |
| Immutability | No UPDATE or DELETE policies on audit_logs for application roles |
| Service insert | Audit emission may use service role — with user context in row |

### Testing

| Test Type | Coverage |
|-----------|----------|
| Positive | Member accesses own organization data |
| Negative | Non-member receives zero rows |
| Cross-tenant | Explicit attempt with foreign organization ID |
| Service role | Verifies bypass only in server test environment |
| Soft delete | Deleted rows invisible to standard policies |

RLS tests run in CI against migrated test database — not mocked.

### Migration Safety

| Rule | Standard |
|------|----------|
| RLS with table | Policies created in same migration as table |
| Policy change | Reviewed for broadening — narrowing preferred |
| Breaking change | Documented — deployment order: migration before application |
| Rollback | Down migration drops policies before table — or documented manual step |
| Seed data | Seed respects RLS or uses service role in seed script only |

---

# Part 6 — UI Implementation Standards

## 19. Component Implementation

### Implementation Philosophy

UI implementation translates [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) into working interfaces. Implementation does not reinterpret design — it **executes** design system specifications with engineering precision.

Every component implementation must be: accessible, responsive, localizable, theme-aware, and consistent with the design token system (future technical tokens reference DESIGN_SYSTEM semantic roles).

### Buttons

| Standard | Application |
|----------|-------------|
| Variants | Primary, secondary, ghost, danger — per DESIGN_SYSTEM §18 |
| Hierarchy | One primary per view — enforced at page level |
| States | Default, hover, focus, active, disabled, loading — all implemented |
| Loading | Spinner inline — button disabled during action |
| Accessibility | Accessible name, keyboard activation, focus visible |
| Implementation | Primitive component — not raw HTML button in feature code |

### Inputs

| Standard | Application |
|----------|-------------|
| Label | Always associated — htmlFor and id |
| Error | aria-invalid and aria-describedby linking to error message |
| Types | Appropriate input type — email, password, number, date |
| States | Default, focus, error, disabled, read-only |
| Implementation | Primitive input component — consistent styling |

### Cards

| Standard | Application |
|----------|-------------|
| Structure | Surface level 1 — padding per spacing system |
| Interactive | Hover elevation only when card is clickable |
| Composition | Header, body, footer slots — optional |
| Nesting | Maximum one level — per DESIGN_SYSTEM |

### Tables

| Standard | Application |
|----------|-------------|
| Implementation | Dedicated data table component — not HTML table in feature code |
| Loading | Skeleton rows — not spinner |
| Empty | Empty state component — per DESIGN_SYSTEM §40 |
| Density | Comfortable, standard, compact modes |
| Accessibility | Column headers, keyboard navigation, aria-sort |
| Responsive | Card list fallback on mobile — per DESIGN_SYSTEM §27 |

### Charts

| Standard | Application |
|----------|-------------|
| Library | Consistent chart library — one platform choice |
| Accessibility | Data table alternative — always available |
| Loading | Skeleton matching chart dimensions |
| Empty | Message when no data — not blank canvas |
| Theme | Light and dark mode color tokens |

### Dialogs

| Standard | Application |
|----------|-------------|
| Focus trap | Focus contained — returns on close |
| Escape | Closes non-destructive dialogs |
| Destructive | Explicit confirmation — cancel is default focus |
| Accessibility | role dialog, aria-labelledby, aria-modal |
| Backdrop | Scrim with click-outside dismiss — except destructive |

### Forms

| Standard | Application |
|----------|-------------|
| Structure | Logical groups with legends — per DESIGN_SYSTEM §20 |
| Validation | Server authoritative — client for UX only |
| Error summary | Multiple errors — linked field list |
| Submit | Loading state on submit button — prevent double submit |
| Keyboard | Full keyboard navigation — tab order preserved |

### Navigation

| Standard | Application |
|----------|-------------|
| Sidebar | Server-safe nav config — not imported from client modules |
| Active state | Visible on current route |
| Keyboard | Navigable via keyboard |
| Mobile | Collapsed navigation — bottom or hamburger |
| Breadcrumb | Server-rendered where depth warrants |

### Dashboards

| Standard | Application |
|----------|-------------|
| KPI cards | Dedicated stat component — trend, status, delta |
| Role-aware | Server resolves visible widgets by permission |
| Loading | Per-widget skeleton — not full-page spinner |
| Grid | Responsive grid — per layout system |

### Settings

| Standard | Application |
|----------|-------------|
| Grouping | Section headers — searchable |
| Dangerous | Confirmation for destructive settings |
| Save | Explicit save or immediate apply — per setting type — consistent within section |
| Permission | Settings pages gated by permission codes |

### Empty States

| Standard | Application |
|----------|-------------|
| Component | Reusable empty state shell — icon, title, description, action |
| Context | Message specific to entity type — not generic |
| Action | Primary action when applicable |
| Tone | Opportunity — not error — per DESIGN_SYSTEM |

### Loading States

| Standard | Application |
|----------|-------------|
| Route | loading.tsx skeleton per route segment |
| Component | Skeleton matching content shape |
| Inline | Button loading spinner — table skeleton rows |
| Avoid | Full-page spinner as primary pattern — per DESIGN_SYSTEM §31 |
| Suspense | Boundaries around async server components |

### Error States

| Standard | Application |
|----------|-------------|
| Route | error.tsx with retry — per route segment |
| Form | Inline field errors — form summary |
| Toast | Non-blocking errors — persistent until dismissed |
| Tone | Calm, actionable — per DESIGN_SYSTEM §41 |
| Reference | Support ID for fatal errors — logged server-side |

### AI Components

| Standard | Application |
|----------|-------------|
| Labeling | AI-generated content visually distinguished |
| Confidence | Confidence indicator visible |
| Citations | Citation links to source — per DESIGN_SYSTEM §37 |
| Loading | Streaming or staged progress — scope described |
| Validation | Accept, edit, reject workflow — before persistence |
| Feedback | Thumbs up/down or report — per DESIGN_SYSTEM |
| Guard | AI output never rendered as authoritative without human validation state |

---

## 20. State Management

### State Classification

| State Type | Owner | Mechanism |
|------------|-------|-----------|
| Server state | Server | Server Components fetch — pass as props |
| URL state | URL | Search params — filters, pagination, selected ID |
| Client global | Provider | Auth, tenant, theme, locale, notifications |
| Form state | Client component | Local state or form library |
| Temporary UI | Client component | useState — modals, toggles, hover |
| Cache | Server | Request-scoped — not cross-request user cache |

### Server State

| Rule | Standard |
|------|----------|
| Fetch location | Server Component, layout, or page — not useEffect |
| Freshness | router.refresh after mutation — re-fetches server components |
| Serialization | Only serializable data to client — Dates as ISO strings |
| Null safety | Defensive defaults — empty arrays, null objects handled |
| Tenant | Bootstrap fetched server-side — passed to TenantProvider |

### Client State

| Rule | Standard |
|------|----------|
| Minimize | Client state only for interaction — not duplicate of server state |
| Initialization | From server props — not client fetch on mount |
| Provider sync | Key-based remount when server identity changes |
| No authoritative data | Client state is never source of truth for permissions or tenant |

### URL State

| Rule | Standard |
|------|----------|
| Use for | Filters, sort, pagination, selected tab, search query |
| Shareable | URL reflects state — copy link restores view |
| Validation | Parse and validate search params — coerce to typed values |
| Defaults | Omit default values from URL — reduce noise |

### Form State

| Rule | Standard |
|------|----------|
| Local | Form inputs managed in client component |
| Submission | Server action — not client API call |
| Errors | Action result mapped to fields |
| Dirty tracking | Warn on navigate away — unsaved changes (future) |
| Reset | Reset on successful submit — or navigate away |

### Temporary State

| Rule | Standard |
|------|----------|
| Scope | Component-local — not lifted unless shared |
| Examples | Dropdown open, modal visible, accordion expanded |
| Cleanup | Reset on unmount — no leaked timers or subscriptions |

### Context Rules

| Rule | Standard |
|------|----------|
| Split contexts | Auth, tenant, theme separate — not monolithic AppContext |
| Optional hooks | useTenantOptional for guards spanning provider boundary |
| No server data fetch | Providers do not fetch — receive initial from server |
| Performance | Context value memoized — stable references where possible |

### Caching

| Cache | Rule |
|-------|------|
| Next.js fetch cache | User-specific data: no-store or dynamic |
| Static assets | Immutable cache headers |
| i18n dictionaries | Build-time or per-locale cache |
| Permission data | Per-request resolution — not edge-cached |
| Client SWR/React Query | Not default — server-first architecture |

### Optimistic Updates

| Rule | Standard |
|------|----------|
| When | High-confidence, reversible UI feedback during action |
| Revert | On action failure — restore prior state with notification |
| Scope | UI state only — not authoritative until server confirms |
| Audit | Authoritative state only after server success |

### Synchronization

| Event | Synchronization |
|-------|-----------------|
| Login | router.push + router.refresh — provider remount |
| Logout | signOut action + redirect + refresh |
| Onboarding complete | router.refresh — tenant provider remount |
| Tenant switch | switch action + set cookie + refresh |
| Permission change | Next navigation refresh — no stale client permission |

---

## 21. Forms & Validation

### Implementation Rules

| Rule | Standard |
|------|----------|
| Server action | All form submissions via server actions |
| Method | POST via action prop — not client fetch |
| Client component | Form component is client — page may be server |
| Double submit | Disabled submit during pending transition |
| Field names | Stable name attributes — map to action input |

### Validation Layers

| Layer | Responsibility | Authoritative |
|-------|----------------|-------------|
| HTML | type, required, min, max — basic UX | No |
| Client | Format hints, immediate feedback | No |
| Action | Schema validation, business rules | Yes |
| Database | Constraints, unique indexes | Yes — as backstop |

### Error Propagation

| Source | Target |
|--------|--------|
| Field validation | Inline below field — aria-describedby |
| Multiple fields | Error summary at form top — links to fields |
| Non-field error | Alert at form top |
| Action failure | Map error code to i18n message |
| Unexpected | Generic message — detailed log server-side |

### Autosave

| Standard | Application |
|----------|-------------|
| Trigger | Debounced server action — long-form content |
| Indicator | Subtle saved status — per DESIGN_SYSTEM |
| Conflict | Notify if server version advanced — offer refresh |
| Scope | Text content, drafts — not trivial toggles |

### Wizard Implementation

| Standard | Application |
|----------|-------------|
| Steps | Client state tracks step — server validates each step |
| Back | Previous step preserves entered data |
| Progress | Step indicator — per DESIGN_SYSTEM |
| Final submit | Server action on completion — summary step for high-stakes |
| Partial save | Draft action per step — for long wizards (future) |

### Accessibility

| Standard | Application |
|----------|-------------|
| Labels | Visible labels — not placeholder-only |
| Required | aria-required or explicit required indicator |
| Errors | aria-invalid, role alert for summary |
| Focus | First error focused on submit failure |
| Keyboard | Full operability — per DESIGN_SYSTEM §20 |

### Localization

| Standard | Application |
|----------|-------------|
| Labels | From i18n dictionary — not hardcoded |
| Errors | Error codes mapped to locale messages |
| Format | Date and number inputs respect locale |
| Validation messages | Translated — parameterized for field names |

---

## 22. Performance Standards

### Rendering

| Standard | Target |
|----------|--------|
| Server-first | Majority of HTML server-rendered |
| Client JS | Minimal client bundle per route |
| Streaming | Suspense for independent async sections |
| Dynamic | User-specific routes marked dynamic — not incorrectly static |
| Static | Public marketing pages static where possible |

### Lazy Loading

| Asset | Strategy |
|-------|----------|
| Heavy client components | Dynamic import with loading fallback |
| Charts | Load chart library on dashboard routes only |
| AI panel | Load on first AI interaction |
| Routes | Automatic code splitting per route — App Router default |

### Streaming

| Pattern | Application |
|---------|-------------|
| Page shell | Layout streams immediately |
| Data sections | Suspense boundaries per independent fetch |
| Skeleton | loading UI inside Suspense |
| Error | error boundary per segment — not whole app |

### Virtualization

| Context | Standard |
|---------|----------|
| Large tables | Virtual scroll over 1000 rows — per DESIGN_SYSTEM §27 |
| Lists | Virtualize long infinite-scroll lists |
| Fixed row height | Required for virtual scroll accuracy |

### Memoization

| Rule | Standard |
|------|----------|
| Default | No memoization |
| Measure | Profile before memoizing |
| Expensive compute | useMemo when measured necessary |
| Stable callbacks | useCallback for effect deps — not for props by default |

### Bundle Size

| Rule | Standard |
|------|----------|
| Analyze | Bundle analyzer on release candidates |
| Import discipline | Import only needed exports — not entire libraries |
| Server-only | server-only package marker — prevent client bundling |
| Client islands | Client components as small leaves |

### Images

| Standard | Application |
|----------|-------------|
| Component | Next.js Image — optimized formats |
| Sizing | Explicit dimensions — prevent layout shift |
| Priority | Above-fold images prioritized |
| SVG | Inline for icons — sprite or component library |

### Fonts

| Standard | Application |
|----------|-------------|
| Loading | next/font — no layout shift |
| Subset | Latin and required scripts — per locale |
| Display | swap — visible text during load |

### Caching

| Data | Cache Policy |
|------|--------------|
| User dashboard | Dynamic — no CDN cache |
| Public pages | Static or ISR |
| API health | Short TTL — not user data |
| Assets | Immutable long cache |

### Database Queries

| Standard | Target |
|----------|--------|
| N+1 | Avoid — batch or join in repository |
| Pagination | Server-side for large sets |
| Select | Select only needed columns — not select star in list views |
| Indexes | Queries match indexed columns |
| P95 read | Under 500ms for core reads — per PROJECT_BIBLE |
| Connection | Pooled — not per-query connection |

---

# Part 7 — Observability, Performance & Operations

## 23. Logging Standards

### Structured Logging

| Requirement | Standard |
|-------------|----------|
| Format | JSON structured logs — not printf debugging in production |
| Fields | timestamp, level, message, module, correlationId, userId, organizationId |
| Levels | debug, info, warn, error, fatal — per Part 4 §14 |
| Production default | info — debug disabled |
| Context | Request context attached via async context or middleware |

### Correlation IDs

| Rule | Standard |
|------|----------|
| Generation | UUID per request — middleware |
| Propagation | x-correlation-id header — client to server to database logs |
| Action logging | Every server action logs correlation ID |
| Audit | Audit events include correlation ID in metadata |
| Support | User-facing error reference maps to correlation ID |

### Request IDs

| Rule | Standard |
|------|----------|
| Alias | x-request-id may mirror correlation ID — consistent per request |
| Tracing | Request ID links logs across services — future distributed tracing |
| Response | Returned in response headers — for client support reports |

### Sensitive Data

| Never Logged | Alternative |
|--------------|-------------|
| Passwords | Log event type only — password_reset_requested |
| Tokens | Log token type — not value |
| Session cookies | Omitted entirely |
| PII bulk | Redact or hash — log user ID not email in bulk operations |
| Financial amounts | Log in audit — not debug logs |

### Audit Logs

| Requirement | Standard |
|-------------|----------|
| Storage | audit_logs table — append-only |
| Emission | emitAuditEvent from actions — significant mutations |
| Fields | action, resourceType, resourceId, userId, organizationId, metadata |
| Immutability | No update or delete |
| Retention | Per organization policy — documented |

### Business Logs

| Event | Logged |
|-------|--------|
| Organization created | info + audit |
| Workspace created | info + audit |
| Tenant switch | info |
| Sign-in success | info — security log |
| Sign-in failure | warn — security log — no password |
| Permission denied | warn — security log |

### Error Logs

| Requirement | Standard |
|-------------|----------|
| Stack trace | Server-side only — error level |
| Context | correlationId, userId, action, input shape — not values |
| Classification | Error type — Validation, Authorization, Database |
| Alerting | error rate threshold triggers alert — per monitoring §24 |

### AI Logs

| Requirement | Standard |
|-------------|----------|
| Interaction | Model, input scope hash, output hash, duration, userId |
| Not logged | Full prompt with PII in debug — production |
| Citations | Citation sources logged — auditable |
| Failure | Model error, timeout, rate limit — with correlation ID |
| Retention | Per engagement archive policy |

---

## 24. Monitoring Standards

### Health Checks

| Endpoint | Checks |
|----------|--------|
| Liveness | Application process running |
| Readiness | Database connectivity, Supabase reachability |
| Deep health | Migration version, seed completeness — admin only |
| Response | Structured JSON — status, checks, version |
| Orchestration | Used by deployment platform — Vercel, future k8s |

### Metrics

| Metric Category | Examples |
|-----------------|----------|
| Request | Count, latency P50/P95/P99, error rate |
| Action | Per-module action success and failure rates |
| Database | Query duration, connection pool utilization |
| Auth | Login success, failure, session refresh failure |
| Business | Organizations created, active users — per tenant aggregate |
| AI | Invocation count, latency, error rate, token usage |

### Tracing

| Standard | Application |
|----------|-------------|
| Request span | Middleware to action to repository |
| Correlation | Trace ID matches correlation ID |
| Sampling | 100% errors — sampled success in production |
| External calls | Supabase, AI provider spans — latency attributed |

### Alerts

| Condition | Severity |
|-----------|----------|
| Error rate spike | Critical |
| Database unreachable | Critical |
| Auth failure spike | Warning — possible attack |
| P95 latency breach | Warning |
| Disk or storage threshold | Warning |
| Certificate expiry | Warning — automated renewal preferred |

### Error Reporting

| Standard | Application |
|----------|-------------|
| Aggregation | Error tracking service — grouped by stack and route |
| PII scrubbing | Automatic before transmission |
| Release mapping | Errors tagged with deployment version |
| Triage | Critical errors paged — warnings in dashboard |

### Performance Monitoring

| Standard | Target |
|----------|--------|
| Core Web Vitals | LCP, INP, CLS — monitored in production |
| Server P95 | Core reads under 500ms |
| Action P95 | Mutations under 1s excluding AI |
| AI P95 | Retrieval under 5s — per PROJECT_BIBLE |

### Business Monitoring

| Metric | Purpose |
|--------|---------|
| Active organizations | Growth and churn signal |
| Onboarding completion | Funnel health |
| Failed provisioning | Seed or role configuration issues |
| Audit event volume | Activity baseline — anomaly detection |

---

## 25. Runtime Quality Gates

### Mandatory Gates Before Merge

All pull requests must pass **every applicable gate** before merge to main. No gate is optional for production-bound code.

### Lint

| Gate | Standard |
|------|----------|
| Tool | ESLint — project configuration |
| Result | Zero errors — warnings reviewed |
| Rules | React hooks, import boundaries, accessibility plugin where configured |
| Suppression | Requires review comment — not silent disable |

### Build

| Gate | Standard |
|------|----------|
| Command | Production build — full compilation |
| Result | Zero errors |
| TypeScript | Compiled as part of build |
| Routes | All routes generate without failure |

### Type Check

| Gate | Standard |
|------|----------|
| Strict | TypeScript strict mode — zero errors |
| Generated types | Supabase types current with migrations |
| No any | Zero any in changed files |

### Architecture Validation

| Check | Standard |
|-------|----------|
| Dependency direction | No repository imports in components |
| Server/client boundary | No server-only imports in client modules |
| Bounded context | Cross-context through published interfaces |
| Frozen architecture | No unauthorized structural redesign |
| Service role | Not exposed to client bundle |

### Design Validation

| Check | Standard |
|-------|----------|
| Design system | New UI uses primitive components |
| Accessibility | Focus, labels, contrast — per DESIGN_SYSTEM |
| Empty/loading/error | All three states defined |
| i18n | No hardcoded user-facing strings in changed files |
| Nav config | Server-safe — not from client modules in layouts |

### Runtime Validation

| Check | Standard |
|-------|----------|
| Smoke | Critical paths manually or E2E verified |
| Auth flows | Login, logout, register, callback — no regression |
| Onboarding | Organization and workspace creation |
| Tenant | Context resolves — no server component throw |
| Middleware | Route classification correct |

### Security Validation

| Check | Standard |
|-------|----------|
| Authorization | New actions have permission checks |
| RLS | New tables have policies in migration |
| Input validation | All action inputs validated server-side |
| Secrets | No secrets in diff |
| Dependencies | No critical vulnerabilities |

### Accessibility Validation

| Check | Standard |
|-------|----------|
| Keyboard | New interactive flows keyboard operable |
| Labels | Form fields labeled |
| Focus | Focus visible — not suppressed |
| Automated | axe or equivalent on changed routes — where configured |

### Production Validation

| Check | When |
|-------|------|
| Preview deploy | Vercel preview — smoke test |
| Environment | Production env vars documented — not committed |
| Migration | Applied to staging before production |
| Rollback plan | Documented for breaking changes |

---

## 26. Deployment Standards

### Development

| Standard | Application |
|----------|-------------|
| Local env | .env.local — gitignored |
| Supabase | Local or linked dev project |
| Seed | Seed applied after migration |
| Hot reload | Next.js dev server — not production simulation |

### Testing

| Standard | Application |
|----------|-------------|
| Environment | Dedicated test Supabase project or local |
| Data | Isolated — not production data |
| RLS | RLS tests run against real policies |
| CI | Gates in §25 run on every PR |

### Staging

| Standard | Application |
|----------|-------------|
| Parity | Production-like configuration — smaller scale |
| Migrations | Applied before application deploy |
| Smoke | Full auth and onboarding smoke after deploy |
| Access | Restricted — not public |

### Production

| Standard | Application |
|----------|-------------|
| Platform | Vercel — per SYSTEM_ARCHITECTURE |
| Branch | main — protected |
| Deploy | Automatic on merge — or manual approval gate |
| Migrations | Applied before or atomically with deploy — documented order |
| Zero downtime | Backward-compatible migrations — expand before contract |

### Rollback

| Scenario | Response |
|----------|----------|
| Application bug | Redeploy previous Vercel deployment |
| Migration failure | Do not deploy application — fix forward migration |
| Breaking migration | Rollback migration if down script exists — restore backup if not |
| Data corruption | Restore from backup — incident response §27 |

### Feature Flags

| Standard | Application |
|----------|-------------|
| Mechanism | Environment variable or feature flag service — not hardcoded |
| Default | Off in production until ready |
| Scope | Per-organization flags — future |
| Removal | Flag removed after full rollout — not permanent cruft |

### Environment Variables

| Standard | Application |
|----------|-------------|
| Documentation | DEPLOYMENT_GUIDE lists every variable |
| Validation | Startup validation — fail fast on missing required |
| Separation | Distinct values per environment — never shared secrets |
| Public | NEXT_PUBLIC_ prefix only for client-safe values |

### Secrets

| Standard | Application |
|----------|-------------|
| Storage | Vercel environment secrets — or managed vault |
| Rotation | Procedure documented — no code change required |
| Access | Least privilege — CI has deploy secrets only |
| Audit | Secret access logged by platform |

### Release Notes

| Standard | Application |
|----------|-------------|
| Content | User-visible changes, migration requirements, breaking changes |
| Audience | Internal team — customer-facing separately |
| Migration | Explicit callout when manual steps required |

---

## 27. Operational Readiness

### Incident Response

| Phase | Action |
|-------|--------|
| Detection | Alert or user report — correlation ID captured |
| Triage | Severity classification — P1 data breach, P2 outage, P3 degradation |
| Communication | Status update — internal immediately, customers per policy |
| Mitigation | Rollback, feature flag disable, hotfix |
| Resolution | Root cause identified — fix deployed |
| Postmortem | Required for P1 and P2 — blameless |

### Disaster Recovery

| Metric | Target |
|--------|--------|
| RPO | Recovery Point Objective — documented per data class |
| RTO | Recovery Time Objective — documented per service tier |
| Backup | Automated database backups — Supabase managed |
| Restore | Restore procedure tested quarterly |
| Geographic | Multi-region — future — documented in architecture |

### Backups

| Data | Backup |
|------|--------|
| Database | Automated daily — point-in-time recovery |
| Audit logs | Included in database backup — immutable |
| File storage | Object storage replication — per Supabase/storage config |
| Configuration | Infrastructure as code — version controlled |

### Migration Safety

| Rule | Standard |
|------|----------|
| Review | Two-person review for production migrations |
| Staging first | Always applied to staging before production |
| Backward compatible | Add column nullable before backfill — expand-contract pattern |
| Downtime | Avoid locking migrations — schedule off-peak if unavoidable |
| Verification | Post-migration health check |

### Database Rollback

| Scenario | Procedure |
|----------|-----------|
| Reversible migration | Run down migration — verify staging first |
| Irreversible migration | Forward fix — not rollback |
| Data loss risk | Backup before migration — restore if failed |

### Business Continuity

| Concern | Mitigation |
|---------|------------|
| Platform outage | Status page, communication template |
| Supabase outage | Degraded mode — read cached where safe — no write |
| AI provider outage | AI features unavailable — core platform functional |
| Key personnel | Runbooks — not single-person dependencies |

### Postmortems

| Requirement | Standard |
|-------------|----------|
| Trigger | P1, P2, security incident, data integrity event |
| Format | Timeline, root cause, impact, action items |
| Blameless | Focus on systems — not individuals |
| Follow-up | Action items tracked to completion |
| Share | Engineering team — patterns feed into standards updates |

---

## Document Control

| Field | Value |
|-------|-------|
| Document | Implementation Standard |
| Version | 0.7.0 |
| Parts Complete | 1–7 |
| Status | Draft — Parts 1–7 Complete |
| Last Updated | 2026-06-30 |
| Change Summary | Added Part 5 (Security, Authentication & Authorization), Part 6 (UI Implementation Standards), Part 7 (Observability, Performance & Operations) |
| Author | Chief Software Architect / Engineering Excellence Director |
| Next Planned | Part 8 — Testing, AI Implementation & Governance |

### Revision History

| Version | Date | Changes |
|---------|------|---------|
| 0.4.0 | 2026-06-30 | Parts 1–4 — Engineering Philosophy through Data Access |
| 0.7.0 | 2026-06-30 | Parts 5–7 — Security & Auth, UI Implementation, Observability & Operations |

---

**Parts 5–7 are complete. Await next instruction.**

---

*End of Parts 5–7*

---

# Part 8 — Testing & Quality Engineering

## 28. Testing Philosophy

### Testing as Engineering Responsibility

Testing is not a phase at the end of development. It is a **continuous engineering responsibility** owned by every contributor who writes or modifies code. Quality is not delegated to a QA department alone — engineers build verifiable systems from the first line.

In a regulated professional platform, defects are not merely inconvenient. Incorrect permissions, missing audit events, cross-tenant data exposure, or silently wrong AI output can undermine professional accountability and client trust. Testing exists to make failure modes visible before they reach production.

### Quality Ownership

| Role | Ownership |
|------|-----------|
| Author | Tests for code they introduce or modify — mandatory |
| Reviewer | Verifies test adequacy before approval |
| Team | Collective responsibility for regression suite health |
| QA | Exploratory testing, release validation, accessibility audit coordination |
| Architecture | Defines what must be tested at each layer — this document |

Untested critical paths are incomplete work — not merge-ready work.

### Prevent Defects

Testing strategy prioritizes **prevention over detection**:

| Prevention Mechanism | Purpose |
|---------------------|---------|
| TypeScript strict mode | Catch type errors at compile time |
| Lint rules | Enforce patterns that prevent common bugs |
| Architecture boundaries | Prevent unauthorized cross-layer access |
| Code review | Human verification of logic and security |
| Automated tests | Executable specifications of behavior |

Tests document intended behavior. When behavior changes intentionally, tests change with it — not silently ignored.

### Confidence Over Coverage

Coverage percentage is a **diagnostic metric** — not a quality target. The goal is confidence that critical paths work correctly.

| Priority | Test Focus |
|----------|------------|
| Critical | Authentication, authorization, tenant isolation, audit emission, financial mutations |
| High | Server actions, repositories, permission resolution, onboarding |
| Medium | UI component behavior, form validation, navigation |
| Lower | Pure utilities, formatting helpers — when logic is non-trivial |

100% line coverage with no security tests is worthless. Targeted tests on high-risk paths are essential.

### Regression Prevention

Every bug fixed in production must result in a **regression test** — unless technically infeasible with documented justification.

| Regression Type | Prevention |
|-----------------|------------|
| Authorization bypass | Permission test added |
| Cross-tenant leak | RLS integration test added |
| Runtime crash | Null-safety or boundary test added |
| UI regression | Visual or component test where stable |
| AI behavior | Golden output or citation validation test |

The regression suite grows with the product — it is a living asset.

### Risk-Based Testing

Testing effort scales with **risk classification**:

| Risk Level | Characteristics | Testing Requirement |
|------------|-----------------|---------------------|
| Critical | Security, data integrity, audit, sign-off | Integration + E2E + manual review |
| High | Tenant mutations, permission changes | Integration + action tests |
| Medium | UI workflows, form submission | Component + action tests |
| Low | Display-only, static content | Smoke verification |

Risk classification is explicit in pull request description for significant changes.

### Enterprise Reliability

Enterprise reliability requires tests that simulate **real operating conditions**:

- Multi-tenant contexts — not single-tenant happy path only
- Missing data — null organization, empty memberships, deleted roles
- Concurrent updates — version conflict handling
- Permission denial — not only permission grant
- Infrastructure failure — graceful degradation paths

Happy-path-only testing is insufficient for enterprise software.

### Professional Accountability

Tests must verify accountability requirements:

- Audit events emitted on significant mutations
- AI outputs require validation before persistence
- Sign-off actions require authorized user
- Soft delete preserves record with deleted metadata
- Error messages do not leak sensitive information

Testing supports the same accountability standards the product imposes on its users.

---

## 29. Testing Standards

### Unit Tests

| Attribute | Standard |
|-----------|----------|
| Scope | Pure functions, utilities, permission logic, validation, mappers |
| Isolation | No database, no network, no filesystem |
| Speed | Milliseconds per test — full unit suite under one minute |
| Naming | Describes behavior — not implementation detail |
| Responsibility | Author of the unit |

Unit tests verify logic correctness in isolation.

### Integration Tests

| Attribute | Standard |
|-----------|----------|
| Scope | Repositories against test database, action + repository chains, auth resolution |
| Database | Real PostgreSQL with migrations applied — not mocked query client |
| Isolation | Per-test transaction rollback or dedicated test data cleanup |
| Tenant | Multiple tenant fixtures — cross-tenant negative cases |
| Responsibility | Author of integration boundary |

Integration tests verify components work together correctly.

### Component Tests

| Attribute | Standard |
|-----------|----------|
| Scope | UI components — rendering, interaction, accessibility |
| Environment | DOM test environment — not full browser unless E2E |
| Server components | Tested via composition integration — not isolated in JSDOM where inappropriate |
| Client components | User event simulation — keyboard and pointer |
| Responsibility | Author of component |

Component tests verify UI behavior matches design system interaction standards.

### Repository Tests

| Attribute | Standard |
|-----------|----------|
| Scope | Every repository method — find, list, create, update, softDelete |
| Missing data | findById returns null — does not throw |
| List empty | Returns empty array — not null |
| Version conflict | Update with stale version returns null or conflict |
| Active filter | Soft-deleted records excluded from reads |
| Responsibility | Author of repository |

Repository tests are integration tests against real database with RLS enabled.

### Server Action Tests

| Attribute | Standard |
|-----------|----------|
| Scope | Validation, authorization, success path, error paths |
| Auth mock | Authenticated and unauthenticated contexts |
| Permission | Granted and denied permission cases |
| Result shape | success true and false variants |
| Audit | Verify audit emission on significant actions |
| Responsibility | Author of action |

Server action tests verify the secure mutation boundary.

### Authentication Tests

| Attribute | Standard |
|-----------|----------|
| Scope | Sign-in, sign-out, register, password reset, callback, session resolution |
| Session | Authenticated session returns enriched user — never null user with authenticated status |
| Expired | Expired session treated as unauthenticated |
| Callback | Safe redirect validation — reject external URLs |
| Responsibility | Identity module owner |

### Authorization Tests

| Attribute | Standard |
|-----------|----------|
| Scope | Permission resolution, role assignment, permission guards, action authorization |
| Union | Multiple roles produce union of permissions |
| Missing role | Graceful degradation — not throw |
| Denied | Authorization error — not silent success |
| Client vs server | Server enforcement verified — client guard is not tested as security |
| Responsibility | Identity module owner |

### RLS Validation

| Attribute | Standard |
|-----------|----------|
| Scope | Every tenant table policy |
| Positive | Member accesses own organization data |
| Negative | Non-member receives zero rows |
| Manipulation | Foreign organization ID in query returns nothing |
| Service role | Bypass only in designated server contexts — verified in tests |
| Responsibility | Migration author + security review |

RLS validation is mandatory for every migration adding tenant tables.

### Accessibility Tests

| Attribute | Standard |
|-----------|----------|
| Scope | Critical user flows — auth, onboarding, dashboard |
| Automated | axe or equivalent on changed routes in CI |
| Keyboard | Tab order and focus trap verification for modals |
| Labels | Form fields have associated labels |
| Responsibility | Author + QA review |

### Performance Tests

| Attribute | Standard |
|-----------|----------|
| Scope | Repository list queries, dashboard load, large table render |
| Threshold | Core reads P95 under 500ms — per PROJECT_BIBLE |
| Regression | Performance benchmark on release candidates — alert on regression |
| Load | Load testing before major releases — documented capacity |
| Responsibility | Performance owner per module |

### Security Tests

| Attribute | Standard |
|-----------|----------|
| Scope | OWASP top ten relevant vectors — injection, auth bypass, IDOR |
| Cross-tenant | Explicit IDOR attempts in integration suite |
| Input | Malformed and oversized input to actions |
| Headers | Security headers present on responses |
| Dependencies | Vulnerability scan in CI — critical blocks merge |
| Responsibility | Security review for auth and data changes |

### End-to-End Tests

| Attribute | Standard |
|-----------|----------|
| Scope | Critical journeys — register, verify, login, onboard, dashboard, logout |
| Environment | Staging or dedicated E2E environment — not production |
| Browser | Real browser automation — Playwright or equivalent |
| Data | Isolated E2E tenant — cleaned between runs |
| Stability | No flaky tests in main suite — quarantine and fix |
| Responsibility | Team — maintained as shared asset |

E2E tests verify the system works as users experience it.

### Regression Tests

| Attribute | Standard |
|-----------|----------|
| Trigger | Every production bug fix |
| Location | Nearest appropriate layer — unit, integration, or E2E |
| CI | Full regression suite on every PR to main |
| Failure | Blocks merge — not skipped without ticket |
| Responsibility | Author of fix |

---

## 30. Runtime Validation

### Mandatory Pre-Release Verification

Every feature must be **runtime verified** before release — build success alone is insufficient. Runtime validation confirms the feature operates correctly in an environment resembling production.

### Verification Checklist

| Area | Verification Requirement |
|------|-------------------------|
| **Server Components** | Render without throw — nullable data handled |
| **Client Components** | Hydrate without mismatch — no server/client import violations |
| **Hydration** | No hydration warnings in browser console |
| **Loading states** | Skeleton displays — not blank screen |
| **Error boundaries** | Error UI renders — retry functional |
| **Routing** | All routes resolve — no 404 for valid paths |
| **Authentication** | Login, logout, session refresh functional |
| **Authorization** | Permission denied for unauthorized user |
| **Database integration** | Migrations applied — seed data present |
| **Tenant isolation** | User cannot access foreign organization data |
| **Performance** | No perceptible lag on core path |
| **Production deployment** | Preview or staging deploy verified before production |

### Server Components

| Check | Standard |
|-------|----------|
| Null safety | No assumption that organization, workspace, user, or permissions exist |
| Import boundary | No imports from client-only modules |
| Data fetch | Errors caught — graceful fallback |
| Streaming | Suspense boundaries render skeleton — not hang |

### Client Components

| Check | Standard |
|-------|----------|
| Interactivity | Events fire correctly after hydration |
| State sync | Provider reflects server state after refresh |
| Import boundary | No server-only imports |
| Bundle | No server secrets in client bundle |

### Hydration

| Check | Standard |
|-------|----------|
| Markup match | Server HTML matches client first render |
| Date/time | No locale mismatch between server and client |
| Random values | No Math.random or Date.now in render without suppression strategy |
| Browser APIs | Not accessed during initial render |

### Loading States

| Check | Standard |
|-------|----------|
| Route loading | loading boundary file present where fetch is slow |
| Skeleton | Matches content layout |
| No infinite load | Loading resolves or errors — not permanent spinner |

### Error Boundaries

| Check | Standard |
|-------|----------|
| error.tsx | Present for protected route segments |
| not-found | Renders UI — does not recurse notFound |
| Recovery | Retry or navigation path available |

### Routing

| Check | Standard |
|-------|----------|
| Middleware | Guest, public, protected classification correct |
| Locale | All routes locale-prefixed |
| Redirect | No redirect loops |
| Deep link | Direct URL access works — not only client navigation |

### Authentication

| Check | Standard |
|-------|----------|
| Full flow | Register, verify, login, logout, password reset |
| Session | Server session matches client after login |
| Callback | Auth callback lands on correct destination |
| Expired | Expired session redirects to login |

### Authorization

| Check | Standard |
|-------|----------|
| Permission guard | Denies unauthorized UI sections |
| Action | Returns authorization error — not success |
| Onboarding | User without org redirected to onboarding |

### Database Integration

| Check | Standard |
|-------|----------|
| Migrations | Applied to target environment |
| Seed | Roles and permissions present |
| RLS | Policies active — verified with test user |

### Tenant Isolation

| Check | Standard |
|-------|----------|
| Switch org | Context updates — data scoped correctly |
| Foreign ID | Manipulated ID does not expose other tenant |
| Cookie | Invalid org cookie ignored — membership validated |

### Performance

| Check | Standard |
|-------|----------|
| First paint | Acceptable on staging — no multi-second blank |
| Navigation | Client navigation responsive |
| Large list | Pagination or virtual scroll functional |

### Production Deployment

| Check | Standard |
|-------|----------|
| Preview | Vercel preview smoke tested |
| Env vars | All required variables set in production |
| Health | Health endpoint returns ready |
| Rollback | Previous deployment identifiable for rollback |

---

## 31. Release Quality Gates

### Release Requirements

No release to production proceeds unless **every applicable gate** passes. Waivers require documented approval from engineering leadership and explicit risk acceptance.

### Code Quality Gates

| Gate | Requirement |
|------|-------------|
| No lint errors | ESLint zero errors on main |
| No build errors | Production build succeeds |
| No type errors | TypeScript strict — zero errors |
| No runtime exceptions | Smoke suite passes — no unhandled throws on critical paths |

### Quality Assurance Gates

| Gate | Requirement |
|------|-------------|
| No accessibility regressions | Automated axe pass — manual review for significant UI |
| No security regressions | Security tests pass — no critical dependency vulnerabilities |
| Regression suite | Full CI green |
| E2E critical paths | Auth and onboarding pass |

### Compliance Gates

| Gate | Requirement |
|------|-------------|
| Architecture compliance | No frozen architecture violations |
| Design compliance | DESIGN_SYSTEM adherence for UI changes |
| Implementation compliance | This document — Parts relevant to change |
| RLS | New tables have policies — tested |

### Process Gates

| Gate | Requirement |
|------|-------------|
| Documentation updated | Migration docs, env vars, operational notes — when applicable |
| Review approved | Minimum one approved review — two for security and migrations |
| Release notes | Prepared for significant releases |
| Migration order | Database migration applied before or with deploy — documented |

### Release Authority

| Release Type | Approval |
|--------------|----------|
| Standard | CI green + review approved |
| Migration | + DBA or architect review |
| Security | + Security review |
| Breaking | + Product and customer communication plan |

---

# Part 9 — AI Implementation Standards

## 32. AI Engineering Philosophy

### AI as Engineering Capability

Artificial intelligence is an **engineering capability** — not a product marketing label. AI features are implemented with the same rigor as authentication, authorization, and data access: typed interfaces, error handling, observability, testing, and governance.

AI code lives in dedicated service boundaries — not scattered across UI components and repositories.

### Human-in-the-Loop

| Principle | Implementation |
|-----------|----------------|
| AI proposes | Outputs presented for review — not auto-applied |
| Human accepts | Explicit user action required to persist AI content |
| Human edits | Edited AI content tracked — original preserved in audit |
| Human rejects | Rejection logged — feedback captured |
| No autonomous sign-off | AI cannot complete professional approval actions |

Human-in-the-loop is permanent — not a temporary limitation until models improve.

### Explainability

| Requirement | Standard |
|-------------|----------|
| Scope disclosure | User sees what data AI analyzed |
| Reasoning | Rationale available on request |
| Confidence | Confidence level visible on all outputs |
| Limitations | Known limitations disclosed — not hidden |
| Model identity | Model name and version accessible in settings or output metadata |

### Traceability

| Requirement | Standard |
|-------------|----------|
| Input log | Input scope recorded — not full PII in production logs |
| Output log | Output hash or structured record stored |
| Citations | Source references stored with output |
| User action | Accept, edit, reject recorded with user ID |
| Engagement link | AI interaction linked to engagement context |

Traceability supports professional defensibility and regulatory review.

### Observability

| Requirement | Standard |
|-------------|----------|
| Latency | Every invocation timed and logged |
| Errors | Model errors, timeouts, rate limits — classified and alerted |
| Usage | Token or cost metrics per organization — future billing |
| Quality | Feedback signals aggregated — thumbs up/down |

### Model Independence

| Principle | Implementation |
|-----------|----------------|
| Provider abstraction | AI service interface — not direct vendor SDK in domain code |
| Swappable models | Model identifier configuration — not hardcoded |
| Capability flags | Feature detects model capability — degrades gracefully |
| No vendor lock-in in domain | Domain types independent of provider response shape |

### Deterministic Fallbacks

| Condition | Fallback |
|-----------|----------|
| Model unavailable | Clear error — manual workflow continues |
| Low confidence | Warning — user must validate |
| Timeout | Retry once — then fail with message |
| Rate limit | Queue or defer — notify user |
| Invalid output | Reject — do not present as valid |

Non-deterministic AI never blocks deterministic core functionality.

### Professional Accountability

AI implementation preserves the accountability chain defined in PROJECT_BIBLE:

- AI does not replace professional judgment
- AI outputs are evidence-assisted — not evidence itself
- Citations link to retrievable source material
- AI cannot modify locked or signed-off records
- AI interactions are auditable for the life of the engagement

---

## 33. AI Coding Standards

### Prompt Management

| Standard | Application |
|----------|-------------|
| Storage | Prompts in version-controlled templates — not inline strings scattered in code |
| Versioning | Prompt template version tracked — linked to AI log |
| Parameterization | Variable injection typed — not string concatenation with raw user input |
| Review | Prompt changes require review — behavior change risk |
| Separation | System prompt, context, user message — distinct layers |
| Testing | Golden tests for critical prompts — expected structure validation |

### Model Abstraction

| Standard | Application |
|----------|-------------|
| Interface | AIModelProvider interface — complete, generate, stream methods |
| Configuration | Model ID from environment — per environment and feature |
| Capability | Model capabilities queried — context window, streaming, JSON mode |
| Response mapping | Provider response mapped to domain AIResult type |

### Provider Abstraction

| Standard | Application |
|----------|-------------|
| Single entry | AIService as facade — domain calls service not provider |
| Adapter | One adapter per provider — OpenAI, Anthropic, etc. |
| Secrets | API keys server-only — environment injected |
| Timeout | Configurable per operation type |
| Circuit breaker | Open after sustained failures — fail fast |

### Streaming

| Standard | Application |
|----------|-------------|
| Server | Stream from server action or route — not client direct to provider |
| Client | Incremental UI update — per DESIGN_SYSTEM AI loading |
| Cancellation | User can cancel long stream — abort controller |
| Complete | Stream end triggers review UI — not auto-save |
| Error mid-stream | Partial output marked incomplete — user decides |

### Retry Policies

| Condition | Retry |
|-----------|-------|
| Transient network | Exponential backoff — max three attempts |
| Rate limit | Respect Retry-After — queue |
| Model overload | Backoff — notify user |
| Invalid response | No retry — log and fail |
| Timeout | One retry — then fail |

### Fallbacks

| Feature | Fallback |
|---------|----------|
| AI summary | Manual read of source document |
| AI search | Keyword search |
| AI draft | Empty editor — user writes |
| AI risk score | Manual risk assessment workflow |

Fallback path always available — AI enhancement never sole path.

### Confidence Handling

| Level | Implementation |
|-------|----------------|
| High | Display with standard AI label |
| Medium | Additional review prompt |
| Low | Warning banner — manual validation required |
| None | Decline to answer — explain insufficient data |

Confidence from model or post-processing — always surfaced.

### Context Management

| Standard | Application |
|----------|-------------|
| Retrieval | Permission-filtered retrieval before generation |
| Scope | Context scope logged — user visible |
| Limit | Context window management — truncate with priority ranking |
| Freshness | Stale context indicator — data as of timestamp |
| Exclusion | Sensitive fields excluded from context — configuration |

### Conversation State

| Standard | Application |
|----------|-------------|
| Storage | Conversation history per engagement or session — database |
| Isolation | Conversations tenant-scoped — RLS enforced |
| Retention | Per engagement archive policy |
| Reset | User can start new conversation — explicit action |

### Rate Limiting

| Standard | Application |
|----------|-------------|
| Per user | Prevent abuse — configurable limits |
| Per organization | Fair usage — plan-based limits future |
| Response | 429 with clear message — retry guidance |
| Bypass | None for end users — service accounts only internally |

### Cost Awareness

| Standard | Application |
|----------|-------------|
| Logging | Token usage logged per invocation |
| Aggregation | Per-organization usage metrics |
| Alerts | Unusual usage spike — alert operations |
| Optimization | Context minimization — retrieve only necessary data |
| Budget | Organization budget caps — future enforcement |

---

## 34. AI Safety Standards

### Hallucination Mitigation

| Control | Implementation |
|---------|----------------|
| Grounding | Retrieval-augmented generation — context before generation |
| Citation requirement | Claims must cite source — uncited marked as inference |
| Validation | Post-generation schema validation where structured output required |
| Refusal | Model instructed to decline when insufficient evidence |
| Human review | High-stakes outputs require explicit acceptance |

### Citation Enforcement

| Rule | Standard |
|------|----------|
| Mandatory | Factual claims about engagement data require citation |
| Format | Structured citation — document, section, location |
| Verification | Citation links resolve to actual source — not 404 |
| Missing | Output without required citations rejected — not displayed |
| Audit | Citations stored with output record |

### Data Privacy

| Rule | Standard |
|------|----------|
| Minimization | Minimum necessary context sent to model |
| PII | PII excluded or redacted per policy — not in prompts by default |
| Training | Customer data not used for model training — contractual and configuration |
| Retention | Provider retention policies documented — zero retention where available |
| Cross-tenant | Context never spans organizations — retrieval scoped |

### Tenant Isolation

| Rule | Standard |
|------|----------|
| Retrieval | Same RLS and permission filters as application queries |
| Storage | AI outputs stored with organization_id — RLS enforced |
| Conversation | Conversations scoped to tenant |
| Service | AI service receives acting user context — not global access |

### Prompt Injection Resistance

| Control | Implementation |
|---------|----------------|
| Separation | System instructions separated from user content |
| Sanitization | User content treated as data — not instructions |
| Validation | Output validated against expected schema — reject anomalous |
| Privilege | AI service has no elevated permissions beyond acting user |
| Logging | Injection attempts logged — security monitoring |

### Sensitive Information

| Rule | Standard |
|------|----------|
| Exclusion list | Configurable fields never included in AI context |
| Detection | Post-generation scan for patterns — SSN, account numbers — redact or block |
| Display | Sensitive AI output masked in logs |
| Export | AI output export subject to same permission as source data |

### Auditability

| Event | Logged |
|-------|--------|
| AI invocation | User, model, scope, timestamp, correlation ID |
| Output generated | Hash, citation count, confidence |
| User acceptance | User ID, timestamp, modifications |
| User rejection | User ID, reason if provided |
| Error | Error type, no sensitive payload |

### Human Approval

| Output Type | Approval Required |
|-------------|-------------------|
| Working paper draft | Yes — before save |
| Disclosure text | Yes — before inclusion in statement |
| Risk assessment | Yes — before recording |
| Search summary | Display only — no persistence without action |
| Administrative suggestion | Yes — before application |

Approval is explicit server action — not implicit UI dismiss.

---

## 35. AI Operational Standards

### Monitoring

| Metric | Monitored |
|--------|-----------|
| Invocation rate | Per feature, per organization |
| Error rate | By error type |
| Latency | P50, P95, P99 |
| Confidence distribution | Low confidence rate — quality signal |
| Citation rate | Outputs with valid citations |
| User acceptance rate | Accepted vs rejected |

### Metrics

| Category | Dashboard |
|----------|-----------|
| Operational | Latency, errors, availability |
| Business | Usage per tenant, feature adoption |
| Cost | Token usage, cost per organization |
| Quality | Rejection rate, feedback scores |

### Latency

| Operation | Target |
|-----------|--------|
| Retrieval | Under 2s P95 |
| Generation start | First token under 3s P95 |
| Full response | Under 30s for standard — progress indicator beyond 5s |
| Timeout | Configurable — default 60s |

### Costs

| Control | Standard |
|---------|----------|
| Tracking | Per-invocation cost estimation logged |
| Reporting | Monthly organization usage report — future |
| Alert | Cost anomaly detection |
| Optimization | Model selection by task complexity — not largest model for all tasks |

### Availability

| Standard | Application |
|----------|-------------|
| SLA | AI features degrade gracefully — core platform available if AI down |
| Health | AI provider health in deep health check |
| Failover | Secondary provider — future — configuration-driven |
| Status | User notification when AI degraded |

### Model Versioning

| Standard | Application |
|----------|-------------|
| Pin | Production model version pinned — not floating latest |
| Upgrade | Model upgrade tested in staging — regression suite |
| Log | Model version in every AI log entry |
| Rollback | Previous model version restorable via configuration |

### Knowledge Refresh

| Standard | Application |
|----------|-------------|
| Embeddings | Re-indexed on document update — event-driven |
| Staleness | Retrieval results include document version timestamp |
| Invalidation | Cache invalidated on source mutation |

### Incident Response

| Scenario | Response |
|----------|----------|
| Provider outage | Disable AI features — banner notification |
| Quality degradation | Rollback model version — investigate prompts |
| Data leak suspicion | Disable AI — incident response — per §27 |
| Injection attack | Block pattern — security review — prompt hardening |

---

# Part 10 — Engineering Governance

## 36. Documentation Standards

### Documentation Philosophy

Documentation is part of the deliverable — not overhead. Undocumented systems cannot be operated, audited, extended, or safely modified by engineers who did not author the original code.

Documentation lives in version control alongside code — not in wikis that drift from reality.

### Architecture Decisions

| Requirement | Standard |
|-------------|------------|
| Significant decisions | Architecture Decision Record — context, decision, consequences |
| Location | docs/ or adjacent ADR directory |
| When | New patterns, technology choices, boundary changes |
| Frozen architecture | Deviations documented before implementation |

### Feature Documentation

| Requirement | Standard |
|-------------|------------|
| Significant features | Brief in pull request — behavior, permissions, audit events |
| User-facing | MASTER_PRD updated when product behavior changes |
| Configuration | New environment variables in DEPLOYMENT_GUIDE |

### Migration Documentation

| Requirement | Standard |
|-------------|------------|
| Every migration | Comment header — purpose, tables affected, RLS added |
| Breaking | Explicit breaking change note — deployment order |
| Rollback | Down migration or manual rollback procedure |
| Seed changes | Documented in seed file header |

### API Documentation

| Requirement | Standard |
|-------------|------------|
| External API | OpenAPI or equivalent — when external API exposed |
| Server actions | Input and result types — TypeScript as documentation |
| Webhooks | Payload schema documented — versioning policy |

### Database Documentation

| Requirement | Standard |
|-------------|------------|
| Schema | Table and column comments in migrations |
| ERD | Maintained for major domain expansions |
| RLS | Policy intent documented in migration |
| Types | Generated types committed — reflect schema |

### Operational Documentation

| Requirement | Standard |
|-------------|------------|
| Deployment | DEPLOYMENT_GUIDE current |
| Incident | Runbooks for critical failure modes |
| Secrets | Rotation procedure documented |
| Health | Health check interpretation documented |

### AI Documentation

| Requirement | Standard |
|-------------|------------|
| Prompts | Template purpose and version documented |
| Models | Model selection rationale per feature |
| Safety | Data handling and retention documented |
| Fallback | Fallback behavior documented per AI feature |

---

## 37. Code Review Standards

### Review Philosophy

Code review is a **quality gate and knowledge transfer mechanism** — not an approval formality. Every change to main is reviewed by at least one engineer who did not author the change — except emergency hotfix with post-review.

### Mandatory Review Criteria

| Criterion | Reviewer Verifies |
|-----------|-------------------|
| **Architecture** | Respects frozen architecture — correct layer, no boundary violations |
| **Security** | Authorization, input validation, no secrets, RLS for new tables |
| **Performance** | No obvious N+1, unnecessary client bundle, appropriate caching |
| **Accessibility** | Labels, focus, keyboard — for UI changes |
| **Maintainability** | Readable, appropriately scoped, no unnecessary abstraction |
| **Readability** | Naming clear, logic followable, comments explain why |
| **Testing** | Adequate tests for risk level — regression for bug fixes |
| **Observability** | Logging, correlation ID, audit events where required |
| **Documentation** | Migration docs, env vars, ADR if architectural |
| **Design compliance** | UI matches DESIGN_SYSTEM — states, accessibility, i18n |

### Review Process

| Step | Standard |
|------|----------|
| Author | Self-review, CI green, description complete |
| Reviewer | Comments within one business day — blocking issues explicit |
| Author | Address or discuss all comments |
| Approval | Explicit approval — not silence |
| Merge | Squash or merge per team policy — clean history |

### Blocking Issues

| Issue | Blocks Merge |
|-------|--------------|
| Security vulnerability | Always |
| Cross-tenant data risk | Always |
| Missing RLS on tenant table | Always |
| No tests on critical path change | Always |
| Architecture violation | Always — or ADR approved |
| Broken CI | Always |

### Reviewer Responsibility

Reviewers are accountable for what they approve. "LGTM" without verification of security and architecture is insufficient for significant changes.

---

## 38. Engineering Governance

### Ownership

| Asset | Owner |
|-------|-------|
| Implementation Standard | Chief Software Architect — stewardship |
| Architecture | Architecture team — SYSTEM_ARCHITECTURE |
| Design implementation | Engineering + Design — DESIGN_SYSTEM compliance |
| Security | Security architect — policy exceptions |
| AI implementation | AI platform architect — AI standards |
| Quality | Engineering excellence — gates and CI |
| Documentation | Authors — stewards per module |

### Decision Process

| Decision Type | Process |
|---------------|---------|
| Implementation pattern | This document — extend if gap |
| Architecture change | ADR + architect approval |
| Security exception | Documented risk acceptance + security approval |
| Dependency addition | License review + bundle impact |
| Breaking change | Product + engineering leadership approval |

### Technical Debt

| Principle | Application |
|-----------|-------------|
| Acknowledged | Technical debt tracked — ticket with rationale |
| Intentional | Debt taken consciously — not accidental |
| Serviced | Debt budget per sprint — not infinite accumulation |
| Documented | TODO without ticket forbidden in main |
| Payment | Refactoring PRs linked to debt tickets |

### Versioning

| Artifact | Versioning |
|----------|------------|
| Implementation Standard | Semantic — major on breaking standard change |
| API | Semantic versioning when external |
| Database | Sequential migrations — timestamped |
| Application | Release tags — semantic optional |

### Deprecation

| Rule | Standard |
|------|----------|
| Notice | Deprecated patterns documented — timeline stated |
| Migration guide | How to migrate — before removal |
| Dual support | Old and new coexist during migration period |
| Removal | Only after migration complete — not silent break |

### Backwards Compatibility

| Layer | Standard |
|-------|----------|
| Database | Expand-contract — additive first |
| Actions | Result shape additive — not removing fields without version |
| API | Versioned endpoints — deprecation period |
| Configuration | New env vars with defaults — not removing without notice |

### Change Management

| Change | Management |
|--------|------------|
| Standard | PR + review + CI |
| Migration | Staging first + review |
| Breaking | Communication plan + coordinated deploy |
| Emergency | Hotfix process — post-review within 24 hours |

### Long-Term Maintainability

| Practice | Purpose |
|----------|---------|
| Standards evolution | This document updated when patterns mature |
| Retrospectives | Engineering retros feed standards updates |
| Onboarding | New engineers read Parts 1–10 — mandatory |
| Agent compliance | AI agents instructed to follow this document — AGENTS.md reference |
| Quarterly review | Standards reviewed against codebase reality — gaps closed |

---

## 39. Final Engineering Review

### Consistency Review Across Parts 1–10

This section confirms internal consistency across the complete Implementation Standard v1.0 and alignment with authoritative platform documents.

### Part-by-Part Consistency Confirmation

| Part | Theme | Consistency Status |
|------|-------|-------------------|
| Part 1 — Engineering Philosophy | Vision, principles, structure, naming | ✓ Foundational standards for all parts |
| Part 2 — Next.js & TypeScript | Server-first, strict typing, React rules | ✓ Implements Part 1 in frontend stack |
| Part 3 — Server Implementation | Server/client/actions boundaries | ✓ Enforces Part 1 security and architecture |
| Part 4 — Data Access | Repositories, database, errors | ✓ Implements SYSTEM_ARCHITECTURE data layer |
| Part 5 — Security & Auth | Zero trust, RBAC, RLS | ✓ Defense in depth across all layers |
| Part 6 — UI Implementation | Components, state, forms, performance | ✓ Implements DESIGN_SYSTEM in code |
| Part 7 — Observability & Operations | Logging, monitoring, deployment | ✓ Operationalizes Part 1 reliability |
| Part 8 — Testing & Quality | Philosophy, standards, release gates | ✓ Verifies Parts 1–7 enforcement |
| Part 9 — AI Implementation | Safety, coding, operations | ✓ Implements PROJECT_BIBLE AI accountability |
| Part 10 — Governance | Documentation, review, evolution | ✓ Makes Parts 1–9 enforceable |

**No internal contradictions identified across Parts 1–10.**

### Alignment with PROJECT_BIBLE

| PROJECT_BIBLE Principle | IMPLEMENTATION_STANDARD Expression |
|-------------------------|-----------------------------------|
| Restore time to professional judgment | Server-first, keyboard-first, AI assist not replace |
| AI-native architecture | Part 9 — dedicated AI standards with human-in-the-loop |
| Professional accountability | Audit logging, AI approval, sign-off enforcement |
| Enterprise-grade maturity | Quality gates, governance, operational readiness |
| Globally deployable | i18n standards, localization in forms and errors |
| Traceability | Audit logs, AI traceability, correlation IDs |
| Security and tenant isolation | Parts 5, 8 — RLS, authorization tests, cross-tenant validation |

**Aligned. No contradictions.**

### Alignment with MASTER_PRD

| MASTER_PRD Domain | IMPLEMENTATION_STANDARD Support |
|-------------------|--------------------------------|
| Audit module | Repository pattern, table standards, testing levels |
| IFRS Reporting | Data integrity, versioning, audit trail |
| Financial Intelligence | AI standards Part 9, chart implementation §19 |
| Multi-tenant | Tenant resolution, RLS, isolation tests |
| Role-based access | RBAC §17, permission tests §29 |
| Release quality | Release gates §31 |

**Aligned. No contradictions.**

### Alignment with SYSTEM_ARCHITECTURE

| SYSTEM_ARCHITECTURE Principle | IMPLEMENTATION_STANDARD Expression |
|-------------------------------|-----------------------------------|
| Modular monolith | Project structure §3, bounded contexts |
| Layered dependencies | Dependency direction §3, architecture validation §25 |
| RLS defense in depth | Part 5 §18 — application auth primary, RLS secondary |
| Observability by default | Part 7 §23–24 |
| AI-native layer | Part 9 — service abstraction, provider independence |
| Evidence-first intelligence | AI citations §34, retrieval before generation §33 |
| Contract-based integration | Repository and action boundaries |

**Aligned. No contradictions.**

### Alignment with DESIGN_SYSTEM

| DESIGN_SYSTEM Domain | IMPLEMENTATION_STANDARD Expression |
|----------------------|-----------------------------------|
| Component specifications | §19 — implementation of each component category |
| State and interaction | §20, §21 — state management and forms |
| Accessibility | §35 Part 5, §29 accessibility tests, §25 gates |
| AI UX | §19 AI components, Part 9 — engineering backing |
| Loading and error | §19, §30 runtime validation |
| Motion and feedback | Client component standards §9, §19 |

**Aligned. No contradictions.**

### Editorial Recommendations

The following recommendations are noted for future maintenance — they are opportunities for refinement, not contradictions:

| # | Recommendation | Rationale |
|---|----------------|-----------|
| 1 | Add quantitative test coverage targets per risk tier | Part 8 defines philosophy — numeric thresholds may be set at CI configuration time |
| 2 | Cross-reference DESIGN_SYSTEM section numbers when design doc sections change | Maintain bidirectional traceability between design and implementation |
| 3 | Expand E2E suite definition as audit module ships | Part 8 E2E scope will grow with domain workflows |
| 4 | Document AI provider selection criteria when vendor chosen | Part 9 references abstraction — concrete provider ADR pending |
| 5 | Schedule first external security penetration test before enterprise GA | Part 5 references annual pentest — calendar not yet set |
| 6 | Merge or supersede CODING_STANDARDS.md placeholder | Avoid duplicate/conflicting guidance — point to this document |
| 7 | Update AGENTS.md to reference IMPLEMENTATION_STANDARD v1.0 | Ensure AI agents receive mandatory instruction |
| 8 | Add performance benchmark baseline numbers to CI | Part 7 and §22 reference targets — automated regression pending |

### Constitutional Status

This document — **Implementation Standard v1.0.0** — is hereby confirmed as the **authoritative engineering implementation constitution** for the audit platform.

All future code, tests, reviews, deployments, and AI implementations must conform to this document.

Deviations require documented justification and approval per Section 38.

---

## Document Control

| Field | Value |
|-------|-------|
| Document | Implementation Standard |
| Version | **1.0.0** |
| Parts Complete | 1–10 (Complete) |
| Status | **COMPLETE** |
| Last Updated | 2026-06-30 |
| Change Summary | Added Part 8 (Testing & Quality Engineering), Part 9 (AI Implementation Standards), Part 10 (Engineering Governance). Final engineering review completed. Document elevated to authoritative engineering implementation constitution. |
| Author | Chief Software Architect / Engineering Excellence Director |
| Authority | Subordinate to [PROJECT_BIBLE.md](./PROJECT_BIBLE.md) and [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) · Informed by [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) and [MASTER_PRD.md](./MASTER_PRD.md) |
| Enforcement | Mandatory for all developers, AI agents, reviewers, and contributors |

### Revision History

| Version | Date | Changes |
|---------|------|---------|
| 0.4.0 | 2026-06-30 | Parts 1–4 — Engineering Philosophy through Data Access |
| 0.7.0 | 2026-06-30 | Parts 5–7 — Security & Auth, UI Implementation, Observability & Operations |
| 1.0.0 | 2026-06-30 | Parts 8–10 — Testing & Quality, AI Implementation, Engineering Governance. **Document complete.** |

---

**Implementation Standard v1.0.0 is complete. This document is the authoritative engineering implementation constitution for the platform.**

---

*End of Implementation Standard v1.0.0*
