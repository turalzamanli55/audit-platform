# Master Implementation Template

## Document Purpose

This document is the **mandatory execution standard for every feature** implemented on the audit platform. It defines how work is planned, validated, implemented, verified, audited, scored, and released.

All developers, reviewers, AI agents, and contributors must follow this template **before, during, and after** every feature implementation — regardless of scope.

This document does **not** replace authoritative source documents. It **operationalizes** them into a repeatable execution workflow.

| Document | Role in This Template |
|----------|----------------------|
| [PROJECT_BIBLE.md](./PROJECT_BIBLE.md) | Constitutional intent — why the product exists |
| [MASTER_PRD.md](./MASTER_PRD.md) | Product requirements — what the feature must do |
| [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) | Technical structure — how the system is organized |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Visual and interaction standards — how the feature must look and behave |
| [IMPLEMENTATION_STANDARD.md](./IMPLEMENTATION_STANDARD.md) | Engineering patterns — how code is written |

**Hierarchy:** If implementation conflicts with any authoritative document, **STOP**, explain the conflict, and wait for approval. Do not modify authoritative documentation to resolve conflicts.

---

## Status

| Field | Value |
|-------|-------|
| Document | Master Implementation Template |
| Version | 1.0.0 |
| Status | Complete |
| Last Updated | 2026-06-30 |
| Owner | Chief Software Architect / Engineering Excellence Director |
| Enforcement | Mandatory for every feature, sprint, and AI agent task |

---

## Table of Contents

1. [Feature Execution Overview](#1-feature-execution-overview)
2. [Mandatory Pre-Implementation Quality Gate](#2-mandatory-pre-implementation-quality-gate)
3. [Authoritative Document Validation](#3-authoritative-document-validation)
4. [Implementation Rules](#4-implementation-rules)
5. [Engineering Principles](#5-engineering-principles)
6. [Design Requirements](#6-design-requirements)
7. [Implementation Phases](#7-implementation-phases)
8. [Quality Gates](#8-quality-gates)
9. [Engineering Audit](#9-engineering-audit)
10. [Engineering Scorecard](#10-engineering-scorecard)
11. [Production Readiness](#11-production-readiness)
12. [Final Verdict](#12-final-verdict)
13. [Implementation Report Template](#13-implementation-report-template)

---

## 1. Feature Execution Overview

Every feature follows the same execution arc:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 0 — PRE-IMPLEMENTATION                                         │
│  Read authoritative docs → Validate scope → Quality gate → Approve plan │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 1 — IMPLEMENTATION                                               │
│  Extend architecture only → Reuse abstractions → Implement → Test       │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 2 — VERIFICATION                                                 │
│  Lint → Build → TypeScript → Tests → Runtime → Security → Accessibility │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 3 — ENGINEERING AUDIT & SCORECARD                                │
│  Architecture self-review → Compliance tables → Score → Verdict         │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 4 — DELIVERY                                                     │
│  Implementation report → Production readiness → Release decision        │
└─────────────────────────────────────────────────────────────────────────┘
```

**Rule:** No feature is complete without passing Phase 2 verification, Phase 3 audit, and documenting Phase 4 deliverables.

---

## 2. Mandatory Pre-Implementation Quality Gate

**Before writing any code**, complete every item below. If any item fails, resolve it before implementation begins.

| # | Gate | Requirement |
|---|------|-------------|
| 1 | **Review existing implementation** | Read relevant code, patterns, and prior feature work in the repository |
| 2 | **Reuse before creating** | Confirm no existing abstraction already solves the problem |
| 3 | **Never duplicate architecture** | Extend frozen architecture — do not redesign layers, boundaries, or flows |
| 4 | **Never duplicate types** | Use existing domain types, database types, and shared projections |
| 5 | **Never duplicate repositories** | Extend existing repositories — do not create parallel data access paths |
| 6 | **Never duplicate actions** | Use existing server actions — do not create parallel mutation surfaces |
| 7 | **Never duplicate validation** | Call existing validation functions — do not reimplement business rules |
| 8 | **Never create client/server boundary violations** | Server-only modules stay server-side; client modules never import them |
| 9 | **Extend, do not replace** | If an existing abstraction solves the problem, extend it instead of replacing it |
| 10 | **Architecture self-review planned** | Schedule explicit self-review before reporting completion |

### Pre-Implementation Checklist

- [ ] Feature scope defined and bounded (what is in / out of scope)
- [ ] All five authoritative documents reviewed for relevant sections
- [ ] Existing repository, action, component, and validation patterns identified
- [ ] Database impact assessed (migration required or JSONB extension preferred)
- [ ] Permission codes identified (no hardcoded role names)
- [ ] Audit events identified (if mutations occur)
- [ ] i18n impact assessed (all user-facing strings externalized)
- [ ] UI scope assessed (presentation components vs pages vs forms)
- [ ] Test strategy defined
- [ ] Conflicts with authoritative docs resolved or escalated

**Stop condition:** If scope requires modifying frozen architecture, repositories, or authoritative documentation without approval — **STOP and wait**.

---

## 3. Authoritative Document Validation

Validate the feature against all five authoritative documents before and after implementation.

### 3.1 PROJECT_BIBLE Alignment

| Check | Question |
|-------|----------|
| Constitutional fit | Does this feature serve professional judgment, traceability, or accountability? |
| AI accountability | If AI is involved, is human-in-the-loop preserved? |
| Non-goals | Is the feature within scope discipline — not a prohibited capability? |
| Enterprise maturity | Does implementation meet enterprise-grade expectations? |

### 3.2 MASTER_PRD Alignment

| Check | Question |
|-------|----------|
| Module requirements | Are all PRD acceptance criteria for this module addressed or explicitly deferred? |
| Business validations | Are validation rules (e.g. CO-V01–CO-V12) implemented or documented as limitations? |
| Permissions | Are capability permissions used — not role names? |
| Lifecycle | Are state transitions correct (create, update, archive, restore)? |
| Audit | Are significant mutations auditable? |

### 3.3 SYSTEM_ARCHITECTURE Alignment

| Check | Question |
|-------|----------|
| Layer placement | Is code in the correct layer (route, component, action, repository)? |
| Dependency direction | Do dependencies flow inward — not across boundaries incorrectly? |
| Tenant isolation | Is organization/workspace context enforced at every data path? |
| RLS compatibility | Do database changes include RLS policies for tenant-scoped tables? |
| Modular monolith | Does the feature respect bounded context boundaries? |
| Frozen architecture | Is the change an extension — not a redesign? |

### 3.4 DESIGN_SYSTEM Alignment

| Check | Question |
|-------|----------|
| Visual language | Calm, minimal, precise — not ERP/Material/Bootstrap aesthetic |
| Hierarchy | Clear typography, spacing, and visual weight |
| States | Loading, empty, and error states defined |
| Accessibility | Keyboard, focus, labels, ARIA, semantic HTML |
| Responsive | Desktop-first with adaptive layouts — no duplicated components |
| i18n | No hardcoded user-facing prose |
| Anti-patterns | None of DESIGN_SYSTEM Section 7 anti-patterns present |

### 3.5 IMPLEMENTATION_STANDARD Alignment

| Check | Question |
|-------|----------|
| Server-first | Default to Server Components; client only where interaction requires |
| Repository pattern | Data access through repositories — not direct Supabase in UI |
| Server actions | Mutations through actions with Result types — no thrown errors to client |
| Error handling | Normalized errors; operational vs programmer errors distinguished |
| TypeScript strict | Zero type errors; no unjustified `any` |
| Naming | Follows project naming conventions |
| Tests | Adequate coverage for risk level |

### Validation Outcome Table

| Document | Status | Notes |
|----------|--------|-------|
| PROJECT_BIBLE.md | ☐ Compliant ☐ Conflict ☐ N/A | |
| MASTER_PRD.md | ☐ Compliant ☐ Conflict ☐ N/A | |
| SYSTEM_ARCHITECTURE.md | ☐ Compliant ☐ Conflict ☐ N/A | |
| DESIGN_SYSTEM.md | ☐ Compliant ☐ Conflict ☐ N/A | |
| IMPLEMENTATION_STANDARD.md | ☐ Compliant ☐ Conflict ☐ N/A | |

**Conflict protocol:** Document the conflict precisely. Do not modify authoritative documents. Wait for architectural approval.

---

## 4. Implementation Rules

### 4.1 Scope Discipline

| Rule | Standard |
|------|----------|
| Implement only what is requested | No scope creep, no "helpful" extras |
| Stop at defined boundary | If task says "foundation only" — no UI, no pages, no forms |
| Minimal diff | Smallest correct change that solves the problem |
| No unrelated changes | Do not refactor, reformat, or fix unrelated code |

### 4.2 Architecture Rules

| Rule | Standard |
|------|----------|
| Repositories | All database access through `repositories/` — extend, do not duplicate |
| Server actions | All mutations through `lib/actions/` — extend, do not duplicate |
| Validation | Business rules in `lib/` domain modules — call existing validators |
| Types | Shared types in `types/` — projections only where needed for serialization |
| Components | Reusable UI in `components/` — domain-organized |
| Configuration | Server-safe config in `config/` — never import client modules in layouts |
| Audit | Significant events through `emitAuditEvent` — register in `AUDIT_ACTIONS` |
| Permissions | Permission codes only — never hardcode role slugs in business logic |

### 4.3 Security Rules

| Rule | Standard |
|------|----------|
| Server-side authorization | Every action validates permissions and tenant context |
| Workspace ownership | Mutations verify resource belongs to active workspace |
| Optimistic locking | Version conflicts return `ConflictError` — not silent overwrite |
| Input validation | All action inputs validated server-side — never trust client |
| Tenant isolation | Cross-workspace and cross-organization access blocked |
| RLS | New tenant tables have RLS policies in migration |
| Secrets | Never commit credentials, API keys, or `.env` values |

### 4.4 Client/Server Boundary Rules

| Layer | May Import | Must Not Import |
|-------|-----------|-----------------|
| Server Components | Libraries, types, config, repositories (via loaders) | Client-only modules, browser APIs |
| Client Components | Providers, hooks, types, config (server-safe) | `server-only` modules, repositories |
| Server actions | Repositories, validation, audit, auth | Client components |
| Repositories | Supabase client, types, domain helpers | UI components, actions |

### 4.5 Database Rules

| Rule | Standard |
|------|----------|
| Migration discipline | Create migrations only when absolutely necessary |
| JSONB preference | Extend settings JSONB before adding columns when PRD allows |
| Backward compatibility | Preserve existing data and behavior |
| Soft delete | Use `deleted_at` — not hard delete for business entities |
| Uniqueness | Enforce at database level where business rules require |
| Generated types | Update `types/supabase.ts` when schema changes |

---

## 5. Engineering Principles

These principles govern every implementation decision. When principles conflict, **security, auditability, and reliability** take precedence over convenience.

### 5.1 Code Quality

| Principle | Application |
|-----------|-------------|
| Readability over cleverness | Explicit, boring code beats compact clever code |
| Explicit over implicit | Behavior, dependencies, and side effects are visible |
| Composition over duplication | Reuse through composition — not copy-paste |
| Small focused modules | Each file does one thing well |
| Single responsibility | One reason to change per function, class, module |
| High cohesion, low coupling | Related logic colocated; unrelated modules interact through contracts |
| Fail safely | Errors default to denial, rollback, or graceful degradation |
| Defensive at boundaries | Validate all external input |
| No dead code | Remove unused code; no commented-out commits |

### 5.2 Security & Trust

| Principle | Application |
|-----------|-------------|
| Security first | Designed in — not audited in after implementation |
| Least privilege | Minimum permission required for every operation |
| Tenant isolation | Organization boundary at every data access path |
| Never trust the client | Authorization and validation server-side always |
| Audit everything significant | Mutations and access changes produce audit records |

### 5.3 Architecture Alignment

| Principle | Application |
|-----------|-------------|
| Architecture is frozen | Extend within boundaries — no redesign without approval |
| Layered dependencies | presentation → application → domain → infrastructure |
| Contract-based integration | Cross-module through defined interfaces |
| Domain-driven structure | Code mirrors professional domains |
| Configuration over hardcoding | Business rules configurable — not embedded in code paths |

### 5.4 Data & State

| Principle | Application |
|-----------|-------------|
| Missing data is not exceptional | `null` / `[]` — repositories do not throw for missing rows |
| Strong typing everywhere | All boundary crossings typed |
| Single source of truth | One authoritative owner per piece of state |
| Optimistic locking | Version fields on concurrent mutations |
| Soft delete over hard delete | Archive with audit metadata |

### 5.5 Performance & Operations

| Principle | Application |
|-----------|-------------|
| Server-first rendering | Client rendering only where interaction requires |
| Observability by default | Structured logging, correlation IDs, error context |
| Idempotent mutations | Safe to retry where appropriate |
| Performance by design | Consider fetching, rendering, caching at design time |

### 5.6 Product Alignment

| Principle | Application |
|-----------|-------------|
| Design system compliance | UI conforms to DESIGN_SYSTEM |
| Accessibility by default | Not a retrofit task |
| Internationalization by default | User-facing strings externalized |
| AI accountability | AI outputs labeled, cited, logged, human-validated |

---

## 6. Design Requirements

Every feature with user interface must meet these design requirements. Reference [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for full specifications.

### 6.1 Visual Standard

| Requirement | Standard |
|-------------|----------|
| Aesthetic | Apple Human Interface inspired — Linear, Stripe, Notion, Arc Browser quality |
| Forbidden aesthetics | Material UI, Bootstrap, ERP, Windows legacy patterns |
| Whitespace | Generous — elements breathe; 8px spacing scale |
| Borders | Minimal — subtle `border-border/50` or lighter |
| Shadows | Restrained — `shadow-xs` to `shadow-md` for elevation only |
| Typography | `tracking-tight` headings; clear hierarchy; readable body text |
| Color | Semantic only — not decorative; never color alone for status |
| Alignment | Mathematically aligned — no rough edges |

### 6.2 Interaction Standard

| Requirement | Standard |
|-------------|----------|
| Calm transitions | `duration-200` to `duration-300` — purposeful, not gratuitous |
| Hover feedback | Subtle elevation or opacity — not jarring |
| Keyboard support | All interactive flows keyboard operable |
| Focus management | Visible focus rings — never suppressed |
| Loading | Skeleton screens matching content layout — not blank white |
| Empty states | Explain what is empty and what action is available |
| Error states | Calm, actionable — not alarming without cause |
| Destructive actions | Deliberate — confirmation where consequences are significant |

### 6.3 Responsive Standard

| Requirement | Standard |
|-------------|----------|
| Approach | Desktop-first, perfect on laptop |
| Tablet | Fully usable — not degraded desktop |
| Mobile | Adaptive layouts — not separate duplicate components |
| Touch targets | Minimum 44px where touch applies |

### 6.4 Accessibility Standard

| Requirement | Standard |
|-------------|----------|
| Standard | WCAG 2.1 AA |
| Semantic HTML | Correct elements — not div-only interfaces |
| ARIA | Where semantic HTML insufficient — not as replacement |
| Labels | All form fields labeled — `sr-only` acceptable |
| Screen readers | Status changes announced where appropriate |
| Keyboard | Tab order logical; arrow keys where list patterns apply |

### 6.5 Component Reuse

| Requirement | Standard |
|-------------|----------|
| Primitives | Use `components/ui/` primitives — Button, Input, Card, Alert |
| Domain components | Use domain component libraries — extend, do not duplicate |
| Wizards | Use `components/wizard/` shell for multi-step flows |
| Shells | Use layout shells for loading, error, empty states |

### 6.6 Anti-Pattern Prohibition

Reject any design resembling DESIGN_SYSTEM Section 7 anti-patterns:

- Excel-like grids as primary UI
- Dashboard widget overload
- Excessive color or visual noise
- Giant single-page forms
- Hidden critical actions
- Modal stacking
- Raw data dumps without hierarchy
- System internals exposed to users
- Legacy ERP navigation patterns

---

## 7. Implementation Phases

### Phase 0 — Analysis (Before Code)

1. Read feature specification and authoritative documents
2. Complete Pre-Implementation Quality Gate (Section 2)
3. Complete Authoritative Document Validation (Section 3)
4. Identify files to create, modify, and explicitly not touch
5. Document architectural decisions and deferrals
6. Obtain approval if scope touches frozen architecture

### Phase 1 — Implementation (During Code)

1. Database changes (if required) — migration, seed, types
2. Domain layer — types, validation extensions, loaders (not duplicate validators)
3. Repository extensions (if required) — complete methods per IMPLEMENTATION_STANDARD
4. Server actions (if required) — permission, audit, Result type
5. Presentation components — reuse primitives and domain components
6. Pages and routes — Server Components, metadata, loading/error/not-found
7. i18n — all four locales updated
8. Tests — unit tests for validation, repository, actions per risk level

### Phase 2 — Verification (After Code)

Run every applicable gate in Section 8. All must pass before audit.

### Phase 3 — Engineering Audit (Before Report)

Complete Section 9 audit and Section 10 scorecard.

### Phase 4 — Delivery (Completion)

Produce Section 13 implementation report with Section 12 final verdict.

---

## 8. Quality Gates

All applicable gates must pass before a feature is reported complete. No gate is optional for production-bound code.

### 8.1 Automated Gates (Mandatory)

| Gate | Command / Check | Pass Criteria |
|------|-----------------|---------------|
| **Lint** | `npm run lint` | Zero errors; warnings reviewed |
| **Build** | `npm run build` | Zero errors; all routes generate |
| **TypeScript** | Part of build | Strict mode — zero errors in changed files |
| **Tests** | `npm run test` | All tests pass; new tests for new behavior |

### 8.2 Architecture Validation

| Check | Pass Criteria |
|-------|---------------|
| Dependency direction | No repository imports in components |
| Server/client boundary | No `server-only` imports in client modules |
| Bounded context | Cross-context through published interfaces only |
| Frozen architecture | No unauthorized structural redesign |
| Service role | Service client not exposed to client bundle |
| No duplication | No parallel repositories, actions, validators, or types |

### 8.3 Design Validation

| Check | Pass Criteria |
|-------|---------------|
| Design system | New UI uses primitives and domain components |
| States | Loading, empty, error defined for all async views |
| i18n | No hardcoded user-facing strings in changed files |
| Accessibility | Focus, labels, keyboard — per DESIGN_SYSTEM |
| Responsive | Adaptive layouts — no unnecessary duplicate components |
| Anti-patterns | None from DESIGN_SYSTEM Section 7 |

### 8.4 Security Validation

| Check | Pass Criteria |
|-------|---------------|
| Authorization | New actions have permission checks |
| Workspace ownership | Mutations verify resource workspace |
| Tenant isolation | Cross-tenant access blocked |
| RLS | New tables have policies in migration |
| Input validation | All action inputs validated server-side |
| Optimistic locking | Version conflicts handled |
| Secrets | No secrets in diff |

### 8.5 Runtime Validation

| Check | Pass Criteria |
|-------|---------------|
| Server Components | Render without throw; nullable data handled |
| Client Components | Hydrate without mismatch |
| Loading states | `loading.tsx` or skeleton — not blank screen |
| Error boundaries | `error.tsx` renders; retry available |
| Not found | `not-found.tsx` renders for invalid routes |
| Routing | All routes resolve; locale-prefixed |
| Auth flows | No regression on login, logout, callback |
| Feature smoke | Critical path manually verified |

### 8.6 Accessibility Validation

| Check | Pass Criteria |
|-------|---------------|
| Keyboard | New interactive flows keyboard operable |
| Labels | Form fields labeled |
| Focus | Focus visible — not suppressed |
| Status | Color not sole indicator — icon/label accompany |
| Automated | axe or equivalent on changed routes — where configured |

### 8.7 Gate Summary Table

| Gate | Status | Evidence |
|------|--------|----------|
| Lint | ☐ Pass ☐ Fail | |
| Build | ☐ Pass ☐ Fail | |
| TypeScript | ☐ Pass ☐ Fail | |
| Tests | ☐ Pass ☐ Fail ☐ N/A | |
| Architecture | ☐ Pass ☐ Fail | |
| Design | ☐ Pass ☐ Fail ☐ N/A | |
| Security | ☐ Pass ☐ Fail | |
| Runtime | ☐ Pass ☐ Fail | |
| Accessibility | ☐ Pass ☐ Fail ☐ N/A | |

---

## 9. Engineering Audit

Perform an explicit architecture self-review before reporting completion. This audit is **mandatory** — not optional documentation.

### 9.1 Scope Audit

| Question | Answer |
|----------|--------|
| Was only the requested scope implemented? | |
| Was anything implemented out of scope? | |
| Were explicit exclusions respected (no UI, no CRUD, etc.)? | |
| Were authoritative documents modified? (Must be: No) | |

### 9.2 Reuse Audit

| Question | Answer |
|----------|--------|
| Were existing components reused? | |
| Were existing repositories used — not duplicated? | |
| Were existing actions used — not duplicated? | |
| Were existing validators called — not reimplemented? | |
| Were existing types extended — not duplicated? | |

### 9.3 Layer Audit

| Layer | Correct Placement? | Violations |
|-------|-------------------|------------|
| Routes / pages | | |
| Components | | |
| Server actions | | |
| Repositories | | |
| Domain / validation | | |
| Types | | |
| i18n | | |
| Database | | |

### 9.4 Security Audit

| Check | Pass? | Notes |
|-------|-------|-------|
| Permission codes used (not role names) | | |
| Server-side authorization on all mutations | | |
| Workspace ownership validated | | |
| Tenant isolation preserved | | |
| RLS compatible | | |
| Optimistic locking enforced | | |
| Audit events emitted for significant mutations | | |
| No secrets in code | | |

### 9.5 Data Audit

| Check | Pass? | Notes |
|-------|-------|-------|
| No direct Supabase queries in UI | | |
| Repository methods follow IMPLEMENTATION_STANDARD | | |
| Missing rows return null/[] — not throw | | |
| Settings JSONB preferred over schema churn | | |
| Migrations backward compatible | | |
| Generated types updated | | |

### 9.6 UI Audit (if applicable)

| Check | Pass? | Notes |
|-------|-------|-------|
| DESIGN_SYSTEM compliance | | |
| Loading / empty / error states | | |
| i18n complete (all locales) | | |
| Keyboard accessible | | |
| Responsive without duplicate components | | |
| No anti-patterns | | |

### 9.7 Test Audit

| Check | Pass? | Notes |
|-------|-------|-------|
| Tests added for new behavior | | |
| Validation rules tested | | |
| Permission enforcement tested | | |
| Workspace isolation tested | | |
| Tests pass in CI | | |

### 9.8 Technical Debt & Limitations

| Item | Type | Recommendation |
|------|------|----------------|
| | Known limitation / Technical debt / Deferred | |

---

## 10. Engineering Scorecard

Score each dimension **before** final verdict. Minimum passing score: **80/100** with no Critical dimension below **6/10**.

| # | Dimension | Weight | Score (0–10) | Weighted | Notes |
|---|-----------|--------|--------------|----------|-------|
| 1 | **Authoritative compliance** | 15% | | | Alignment with all five source documents |
| 2 | **Architecture integrity** | 15% | | | Frozen architecture, layers, boundaries |
| 3 | **Reuse & DRY** | 10% | | | No duplicated repos, actions, types, validation |
| 4 | **Security & tenant isolation** | 15% | | | Permissions, RLS, ownership, audit |
| 5 | **Code quality & typing** | 10% | | | Readability, strict TypeScript, conventions |
| 6 | **Design & accessibility** | 10% | | | DESIGN_SYSTEM, states, i18n, a11y |
| 7 | **Testing adequacy** | 10% | | | Coverage appropriate to risk |
| 8 | **Runtime reliability** | 10% | | | Error handling, loading, no throws to client |
| 9 | **Documentation & report** | 5% | | | Implementation report complete and accurate |
| | **TOTAL** | 100% | | **/100** | |

### Score Interpretation

| Score | Verdict |
|-------|---------|
| 90–100 | **Exemplary** — sets platform standard |
| 80–89 | **Pass** — production-ready with minor notes |
| 70–79 | **Conditional** — merge with documented remediation plan |
| Below 70 | **Fail** — do not report complete; remediate and re-audit |

### Critical Dimension Failures

These dimensions **cannot** score below 6/10 regardless of total score:

- Authoritative compliance
- Architecture integrity
- Security & tenant isolation

---

## 11. Production Readiness

A feature is production-ready only when all applicable items are satisfied.

### 11.1 Code Readiness

| Item | Status |
|------|--------|
| All quality gates pass (Section 8) | ☐ |
| No known Critical or High security issues | ☐ |
| No unhandled exceptions on critical paths | ☐ |
| Error messages user-safe — not stack traces | ☐ |
| Feature flags off by default (if applicable) | ☐ |

### 11.2 Database Readiness

| Item | Status |
|------|--------|
| Migration tested locally | ☐ |
| Migration applied to staging (if applicable) | ☐ |
| RLS policies verified | ☐ |
| Seed data updated (if permissions/roles added) | ☐ |
| Rollback plan documented (if breaking) | ☐ |

### 11.3 Operational Readiness

| Item | Status |
|------|--------|
| Audit events registered and verified | ☐ |
| Permissions seeded and assigned to roles | ☐ |
| Environment variables documented (if new) | ☐ |
| No new secrets in repository | ☐ |
| Logging adequate for troubleshooting | ☐ |

### 11.4 User Readiness

| Item | Status |
|------|--------|
| i18n complete for all supported locales | ☐ |
| Loading, empty, error states user-tested | ☐ |
| Keyboard navigation verified | ☐ |
| Mobile/tablet layout verified (if UI) | ☐ |

### 11.5 Release Readiness Checklist

| Item | Status |
|------|--------|
| Implementation report complete (Section 13) | ☐ |
| Engineering audit complete (Section 9) | ☐ |
| Scorecard ≥ 80/100 (Section 10) | ☐ |
| Known limitations documented | ☐ |
| Next-phase recommendations documented | ☐ |
| Review approved (if required) | ☐ |

---

## 12. Final Verdict

Complete this section at the end of every feature implementation.

### Feature Identification

| Field | Value |
|-------|-------|
| Feature ID | e.g. FEATURE-001B Part 3 |
| Feature name | |
| Implementer | |
| Date | |
| Branch / PR | |

### Verdict

| Verdict | Select One |
|---------|------------|
| ☐ **APPROVED — Complete** | All gates pass; score ≥ 80; production-ready |
| ☐ **APPROVED — Complete with limitations** | Shippable; documented limitations accepted |
| ☐ **CONDITIONAL — Remediation required** | Core delivered; specific items must be resolved |
| ☐ **REJECTED — Not complete** | Gates failed or critical dimensions below threshold |

### Summary

_One paragraph: what was delivered, compliance status, and readiness._

### Gate Results

| Gate | Result |
|------|--------|
| Lint | |
| Build | |
| TypeScript | |
| Tests | |
| Architecture validation | |
| Design compliance | |
| Security validation | |
| Runtime validation | |

### Score

| Total Score | /100 |
|-------------|------|
| Critical dimensions all ≥ 6 | ☐ Yes ☐ No |

### Sign-Off

| Role | Name | Date | Approval |
|------|------|------|----------|
| Implementer | | | ☐ |
| Reviewer (if applicable) | | | ☐ |

---

## 13. Implementation Report Template

Every feature must produce an implementation report using this template.

### Report Header

```markdown
# [FEATURE-ID] — [Feature Name] Implementation Report

## Summary
[1–3 sentences: what was delivered and why]

## Files Created
| File | Purpose |
|------|---------|

## Files Modified
| File | Change |
|------|--------|

## Database Changes
[None / migration name / JSONB extensions]

## Architecture Compliance
| Check | Status | Notes |
|-------|--------|-------|

## Design Compliance
| Check | Status | Notes |
|-------|--------|-------|

## Security Validation
| Control | Implementation |
|---------|----------------|

## Tests
| Suite | Coverage |
|-------|----------|

## Quality Gates
| Gate | Result |
|------|--------|

## Runtime Validation
[What was manually verified]

## Engineering Scorecard
[Copy from Section 10]

## Known Limitations
| Limitation | Impact | Planned resolution |
|------------|--------|-------------------|

## Technical Debt
| Item | Recommendation |
|------|----------------|

## Recommendations for Next Phase
[Specific, actionable next steps]

## Final Verdict
[Copy from Section 12]
```

### Required Report Sections

Every report must include:

1. Files created and modified
2. Database changes (or explicit "none")
3. Repository methods (if applicable)
4. Server actions (if applicable)
5. Audit events (if applicable)
6. Permission enforcement
7. Security validation
8. Tests
9. Architecture compliance
10. Design compliance (if UI)
11. Runtime validation
12. Known limitations
13. Technical debt
14. Recommendations for next phase
15. Final verdict

---

## Document Control

| Field | Value |
|-------|-------|
| Document | Master Implementation Template |
| Version | 1.0.0 |
| Status | **COMPLETE** |
| Last Updated | 2026-06-30 |
| Owner | Chief Software Architect / Engineering Excellence Director |
| Authority | Operationalizes [IMPLEMENTATION_STANDARD.md](./IMPLEMENTATION_STANDARD.md) · Subordinate to all five authoritative documents |
| Enforcement | **Mandatory for every future feature** |

### Relationship to Other Documents

| Document | Relationship |
|----------|--------------|
| IMPLEMENTATION_STANDARD.md | Defines *how code is written* — this template defines *how features are executed* |
| DESIGN_SYSTEM.md | Defines visual standards — Section 6 extracts execution requirements |
| SYSTEM_ARCHITECTURE.md | Defines structure — Section 3.3 validates against it |
| MASTER_PRD.md | Defines requirements — Section 3.2 validates against it |
| PROJECT_BIBLE.md | Defines intent — Section 3.1 validates against it |

### Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-06-30 | Initial complete template — execution standard for all features |

---

**This document is the mandatory execution standard for every future feature on the audit platform.**

---

*End of Master Implementation Template v1.0.0*
