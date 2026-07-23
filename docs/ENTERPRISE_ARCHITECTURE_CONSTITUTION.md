# PROJECT_BIBLE — ENTERPRISE ARCHITECTURE CONSTITUTION

**Version:** 1.0  
**Status:** Mandatory  
**Priority:** Higher than individual feature requests  
**Audience:** Every developer and AI agent working in this repository

This document is mandatory for every future implementation.

---

## MISSION

The platform is no longer in the prototype stage.

The platform is now an Enterprise SaaS Platform.

From this point forward, EVERY implementation must preserve:

- architecture
- consistency
- maintainability
- reusability
- performance
- security
- long-term scalability

No implementation may sacrifice architecture for implementation speed.

---

## ABSOLUTE RULE

Before implementing ANY feature, Cursor MUST understand the ENTIRE SYSTEM.

This is mandatory.

Cursor MUST first inspect:

- Platform Owner
- Company Administration
- Authentication
- Authorization
- Permissions
- Licensing
- Seat Management
- Workspace Management
- Organizations
- Audit Infrastructure
- History
- Localization
- Navigation
- Repositories
- Database
- Actions
- Existing UI
- Existing Components
- Existing Services
- Existing Tables
- Existing Policies
- Existing Workflows

before writing code.

Implementation without understanding the whole system is prohibited.

---

## SYSTEM FIRST PRINCIPLE

Never solve only the requested feature.

Always verify how the requested feature affects:

- Platform Owner
- Company Administrator
- Users
- Permissions
- History
- Audit
- Navigation
- Localization
- Mobile
- Dark Mode
- Existing Components
- Existing APIs
- Existing Repositories
- Existing Database
- Existing Workflows
- Existing Modules

If another module already solves a similar problem, reuse it.

Never duplicate functionality.

---

## ARCHITECTURE BEFORE CODE

The architecture always comes first.

Implementation comes second.

If implementation conflicts with architecture, architecture wins.

Never modify architecture simply because implementation becomes easier.

---

## REUSE FIRST

Before writing ANY code, search the entire repository.

Questions that MUST be answered:

1. Does this already exist?
2. Can it be extended?
3. Can it be reused?
4. Can it be composed?
5. Can it be generalized?

Only if every answer is **NO** may new code be introduced.

---

## NO DUPLICATION

The platform must contain exactly ONE implementation for:

- Authentication
- Authorization
- History
- Audit
- Localization
- Permissions
- Delete
- Restore
- Lifecycle
- Retention
- Seat Logic
- Licensing
- Navigation
- Theme
- Notifications
- Validation
- Search
- Export
- Import
- Timeline
- Activity

If another implementation already exists, reuse it.

Never create competing implementations.

---

## DATABASE RULE

Creating a new table is the LAST option.

Before creating a table, prove that existing tables cannot support the requirement.

Every new table requires written justification.

---

## SERVICE RULE

Never create a new service if an existing service can be extended.

---

## REPOSITORY RULE

Never create another repository for an existing domain.

Extend the existing repository.

---

## UI RULE

Never create another component that solves the same problem.

Generalize existing components.

Reuse existing design system, dialogs, forms, tables, cards, badges, and layout.

---

## OWNER PLATFORM PROTECTION

The Platform Owner Console is considered a protected architecture.

Before implementing ANY Platform Owner feature, Cursor MUST inspect:

- Navigation
- Platform Pages
- Company Details
- User Details
- Subscriptions
- Plans
- Licensing
- Seat Usage
- Settings
- Security
- Search
- Dashboards
- Recycle Bin
- History
- Activity
- Localization
- Mobile
- Dark Mode

No Platform implementation may duplicate, replace, or bypass existing Platform functionality.

---

## COMPANY ADMINISTRATION PROTECTION

Company Administration must always remain a subset of the Platform.

Never implement a second administration platform.

Reuse Platform capabilities.

Restrict only by permissions.

---

## AUDIT RULE

Never create another audit system.

Reuse:

- `emitAuditEvent()`
- `audit_logs`
- existing timeline
- existing activity feeds

---

## HISTORY RULE

History exists only once.

Timeline exists only once.

Activity exists only once.

Version history must be derived from audit.

---

## LOCALIZATION RULE

Every feature must automatically support:

- English
- Azerbaijani
- Russian
- Turkish

No hardcoded strings.

Every new component must contain translation keys.

A feature is NOT COMPLETE until all four languages exist.

---

## RESPONSIVE RULE

Every new feature must work on:

- Desktop
- Laptop
- Tablet
- Mobile

No horizontal scrolling.

Touch friendly.

---

## PERFORMANCE RULE

Prefer:

- composition
- extension
- lazy loading
- existing repositories
- existing caching

Avoid:

- duplicate queries
- duplicate repositories
- duplicate services
- duplicate state

---

## ARCHITECTURAL DECISION RULE

When two implementation approaches are functionally equivalent, ALWAYS choose the implementation that:

- reduces architectural complexity
- reduces duplicated state
- reuses existing infrastructure
- preserves existing business logic
- avoids new tables
- avoids new repositories
- avoids new services
- avoids duplicate lifecycle logic
- improves maintainability

Architecture simplicity always wins.

---

## SYSTEM INTEGRITY CHECK

Before implementation, Cursor MUST verify:

- Will this break Platform Owner?
- Will this break Company Administration?
- Will this duplicate functionality?
- Will this duplicate state?
- Will this duplicate history?
- Will this duplicate audit?
- Will this duplicate localization?
- Will this duplicate repositories?
- Will this duplicate UI?
- Will this duplicate permissions?
- Will this duplicate lifecycle?
- Will this duplicate business rules?

If YES, implementation must STOP.

---

## PRE IMPLEMENTATION CHECKLIST

Before every implementation, Cursor MUST inspect:

- [docs/PROJECT_BIBLE.md](PROJECT_BIBLE.md)
- [docs/MASTER_PRD.md](MASTER_PRD.md)
- [docs/SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md) / [architecture/SYSTEM_ARCHITECTURE.md](../architecture/SYSTEM_ARCHITECTURE.md)
- Platform Owner
- Company Administration
- Repositories
- Actions
- Policies
- Current UI
- Localization
- Database
- Existing Components
- Existing Workflows

Only then may implementation begin.

---

## POST IMPLEMENTATION CHECKLIST

After implementation verify:

- No duplicate code
- No duplicate repositories
- No duplicate tables
- No duplicate services
- No duplicate history
- No duplicate audit
- No duplicate localization
- No duplicate lifecycle
- No regressions
- Dark Mode
- Localization (EN / AZ / RU / TR)
- Responsive
- Accessibility
- Performance
- Security
- Architecture consistency

---

## FINAL PRINCIPLE

Every new feature must feel like it was always part of the platform.

No feature should look added.

Every feature should feel:

- native
- consistent
- enterprise
- minimal
- maintainable
- reusable

The platform must evolve as ONE system, never as a collection of independent modules.

---

## CONFLICT RESOLUTION

**THIS CONSTITUTION HAS HIGHER PRIORITY THAN INDIVIDUAL FEATURE REQUESTS.**

If a requested implementation violates these principles, Cursor MUST:

1. Stop
2. Explain the conflict
3. Propose an architecture-compliant alternative

---

## Related Documents

| Document | Role |
|----------|------|
| [PROJECT_BIBLE.md](PROJECT_BIBLE.md) | Product & vision constitution |
| [MASTER_PRD.md](MASTER_PRD.md) | Product requirements |
| [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md) | System architecture |
| This document | Implementation architecture constitution for agents & engineers |
