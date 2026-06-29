# Master Product Requirements Document

## Document Purpose

This document is the **executable product specification** for the audit platform. It translates the constitutional intent of [PROJECT_BIBLE.md](./PROJECT_BIBLE.md) into product requirements that govern screens, workflows, modules, AI features, and delivery priorities.

| Attribute | Value |
|-----------|-------|
| Document | Master PRD |
| Version | 0.1.0 |
| Part | 1 of N |
| Status | Draft — Part 1 Complete |
| Last Updated | 2026-06-30 |
| Owner | Chief Product Officer |
| Authority | Subordinate to PROJECT_BIBLE.md |

## Table of Contents — Part 1

1. [Product Overview](#1-product-overview)
2. [Product Scope](#2-product-scope)
3. [Business Objectives](#3-business-objectives)
4. [Stakeholders](#4-stakeholders)
5. [Product Success Metrics](#5-product-success-metrics)
6. [PRD Review Notes](#prd-review-notes)

### Future Parts (Planned)

- Part 2 — Product Domains & Module Requirements
- Part 3 — User Journeys & Workflow Requirements
- Part 4 — Feature Specifications & Acceptance Criteria
- Part 5 — Release Roadmap & Prioritization

---

## 1. Product Overview

### 1.1 Platform Description

The platform is an **enterprise SaaS product** for audit, IFRS financial reporting, and financial intelligence. It serves accounting firms, audit practices, corporate finance teams, and regulated enterprises that require rigorous financial assurance, statutory reporting, and defensible decision-making.

The product unifies three professional domains in a single governed environment:

| Domain | Product Responsibility |
|--------|------------------------|
| **Audit** | End-to-end assurance engagement management — from client acceptance through opinion and archive |
| **IFRS Reporting** | Financial statement composition, disclosure management, and regulatory reporting workflows |
| **Financial Intelligence** | Analytical insight, variance analysis, and executive-grade financial narrative grounded in auditable data |

The platform is **multi-tenant**, **globally deployable**, and designed to serve small practices and large international firms. Every product decision must remain compatible with enterprise scale, regulatory seriousness, and professional accountability as defined in PROJECT_BIBLE Parts 1–15.

### 1.2 Business Purpose

The product exists to **restore time to professional judgment** while **strengthening the integrity of audit and financial reporting** (PROJECT_BIBLE, Section 2).

Professionals spend disproportionate effort on mechanical tasks — collating evidence, re-keying data, tracing numbers from source to disclosure, and navigating fragmented tools. The product reallocates that effort toward analytical, skeptical, and judgment-intensive work that defines audit and reporting quality.

The product solves a structural market gap: organizations need software as **trustworthy as established enterprise audit platforms** and as **intelligent as modern AI systems** — without compromising either dimension.

### 1.3 Target Market

| Market Segment | Description | Primary Product Entry |
|----------------|-------------|----------------------|
| **Mid-to-large audit firms** | Independent firms performing statutory audits under ISA | Full audit engagement lifecycle |
| **Accounting and advisory firms** | Firms preparing IFRS financial statements for clients | IFRS reporting cycle |
| **Corporate finance teams** | In-house finance preparing group or entity reporting | IFRS reporting + Financial Intelligence |
| **Regulated enterprises** | Banking, insurance, manufacturing, construction, government | Industry compliance packs + enterprise administration |
| **Internal audit functions** | In-house assurance teams | Risk-based planning, control testing, finding tracking |
| **Primary geographic markets** | Azerbaijan (default locale), English-speaking markets, Russia/CIS, Turkey | Multilingual platform (az, en, ru, tr) |

Initial commercial focus targets organizations that **cannot compromise on audit trail integrity, tenant isolation, or professional defensibility** — not price-sensitive consumer or micro-business segments.

### 1.4 Business Value

| Value Dimension | Outcome for Customers |
|-----------------|----------------------|
| **Efficiency** | Measurable reduction in low-value manual documentation, search, and cross-referencing |
| **Quality** | Consistent methodology application across engagements, offices, and teams |
| **Defensibility** | Complete traceability from published outputs to source evidence and approving professional |
| **Risk reduction** | Earlier anomaly and risk surfacing; structured review and sign-off gates |
| **Reporting integrity** | Governed IFRS statement composition with versioned notes and approval chains |
| **Executive insight** | Financial intelligence with drill-down to evidence — not disconnected dashboards |
| **Inspection readiness** | Engagement files and platform audit trails that withstand regulatory and quality inspection |
| **Scalability** | Firms handle more engagements and reporting cycles without proportional headcount growth |

### 1.5 Strategic Positioning

```
                    Enterprise Trust & Compliance
                              ↑
                              │
    Legacy Audit Platforms ───┼─── This Platform
    (mature, slow to innovate)│   (enterprise-grade + AI-native)
                              │
                              ↓
                    AI Speed & Intelligence
```

| Positioning Axis | This Platform |
|------------------|---------------|
| **vs. legacy audit software** | Matches workflow completeness and regulatory seriousness; exceeds in AI-native architecture, explainability, and modern collaboration |
| **vs. generic AI tools** | Domain-specific, evidence-grounded, governed — suitable for regulated professional use |
| **vs. ERP systems** | Consumes financial data; does not compete as operational system of record |
| **vs. spreadsheet workflows** | Structured, versioned, traceable — reduces but does not eliminate governed spreadsheet exchange |
| **Category claim** | AI-first audit, IFRS reporting, and financial intelligence platform |

Strategic intent: become the **operating environment** in which engagements are planned, evidence is gathered, judgments are recorded, financial statements are composed, and insights are generated — with a continuous auditable thread connecting every artifact (PROJECT_BIBLE, Section 3).

### 1.6 Unique Differentiators

| Differentiator | Product Expression |
|----------------|-------------------|
| **AI-native architecture** | Intelligence embedded in workflows — not a bolt-on chat interface |
| **Evidence-first AI** | AI retrieves and cites before generating; no unsupported assertions in professional contexts |
| **Human accountability by design** | Sign-off, publication, and opinion remain explicit human acts — enforced by workflow gates |
| **Unified traceability** | Single lineage chain from audit opinion and financial report to source data |
| **Three-domain convergence** | Audit, IFRS reporting, and financial intelligence in one governed tenant |
| **Configurable methodology** | Firm-defined programs, templates, and rules without vendor code changes |
| **Professional skepticism support** | AI rejection, review notes, and exception handling are first-class product behaviors |
| **Global readiness** | Multi-language, multi-entity, multi-jurisdiction from architectural foundation |
| **Inspection-grade audit trail** | Platform itself auditable — including all AI interactions |

### 1.7 Relationship with PROJECT_BIBLE

| Document | Role |
|----------|------|
| **PROJECT_BIBLE** | Constitutional charter — mission, vision, philosophy, principles, domain model, workflows, standards methodology, architecture philosophy, and governance |
| **MASTER_PRD** | Executable specification — product requirements, stakeholder needs, success metrics, and (in future parts) features, journeys, and acceptance criteria |

**Governance rule:** Where MASTER_PRD and PROJECT_BIBLE conflict, PROJECT_BIBLE prevails. MASTER_PRD must not reinterpret or weaken PROJECT_BIBLE principles.

| PROJECT_BIBLE Provides | MASTER_PRD Derives |
|------------------------|-------------------|
| Core Principles (40) | Non-negotiable product constraints on every feature |
| Business domains and modules | Module-level requirements and scope boundaries |
| Workflows and business rules | User journey and acceptance criteria (future parts) |
| IFRS and ISA methodology | Reporting and assurance feature requirements |
| AI philosophy | AI feature behavior and governance requirements |
| Success criteria categories | Measurable KPIs with product-specific targets |

MASTER_PRD references PROJECT_BIBLE by section rather than restating constitutional content. Implementation teams treat both documents as mandatory inputs.

---

## 2. Product Scope

### 2.1 What the Platform Does

The platform **assures, reports, and analyzes** financial information within a governed professional environment.

| Capability Area | Product Function |
|-----------------|------------------|
| **Financial data management** | Import, validate, adjust, and classify trial balance and general ledger data with source preservation |
| **IFRS financial reporting** | Compose versioned financial statements and notes with approval workflows |
| **External audit execution** | Manage ISA-aligned engagement lifecycle, working papers, evidence, review, and opinion |
| **Internal assurance** | Support risk-based internal audit planning, control testing, and finding remediation |
| **Evidence management** | Index, link, and retain audit evidence with cross-references to procedures and financial data |
| **AI-assisted professional work** | Evidence retrieval, anomaly surfacing, draft documentation, and standards-aware analysis — human validated |
| **Financial intelligence** | Variance, trend, ratio, and executive analytics with drill-down to source |
| **Governance and oversight** | Board and audit committee visibility, representation tracking, independence documentation |
| **Enterprise administration** | Multi-tenant organization, workspace, entity, user, and methodology configuration |
| **Reporting and export** | Governed production and distribution of financial, audit, and management reports |
| **Knowledge management** | Firm methodology, standards, and precedents accessible within professional workflows |

### 2.2 What the Platform Does Not Do

Scope discipline is mandatory (PROJECT_BIBLE, Section 7). The following are **explicitly out of product scope**:

| Exclusion | Rationale |
|-----------|-----------|
| ERP / operational accounting | Platform consumes data; does not run day-to-day business operations |
| Bookkeeping and transaction recording | Assurance and reporting — not daily accounting |
| Payroll processing | Out of scope; payroll data may be referenced for audit or disclosure |
| CRM and sales automation | Client records within audit context only — not sales pipeline management |
| Generic conversational AI | AI serves evidence-grounded professional workflows only |
| General-purpose spreadsheet | Structured governed workflows take precedence |
| Tax filing and government portal submission | Tax disclosures within IFRS reporting may be supported; filing engines are not |
| HR and workforce management | Engagement staffing only — not HR records or performance management |
| Generic document storage | Document management serves audit and reporting workflows only |
| Consumer / lite product modes | B2B enterprise SaaS exclusively |

Features resembling exclusions must be evaluated for **rejection, deferral, or narrow integration** — not silent scope expansion.

### 2.3 Primary Capabilities (Current Product Intent)

Primary capabilities define the **minimum viable enterprise product** and near-term delivery focus (0–24 months):

| # | Capability | Domain |
|---|------------|--------|
| 1 | Organization, workspace, and entity administration | Enterprise |
| 2 | User, role, and engagement-scoped permission management | Enterprise |
| 3 | Financial data import with source preservation and validation | Financial Data |
| 4 | Trial balance management and adjustment workflows | Financial Data |
| 5 | IFRS classification and mapping governance | IFRS Reporting |
| 6 | Versioned financial statement composition | IFRS Reporting |
| 7 | IFRS note preparation with disclosure linkage | IFRS Reporting |
| 8 | Audit engagement lifecycle (acceptance through closure) | Audit |
| 9 | Audit planning, risk assessment, and program execution | Audit |
| 10 | Working papers with evidence linkage and multi-level review | Audit |
| 11 | Lead sheets reconciled to trial balance | Audit |
| 12 | Audit opinion formation and authorization | Audit |
| 13 | Evidence-backed AI copilot within engagement boundaries | AI |
| 14 | Firm knowledge base with standards-aware retrieval | Knowledge |
| 15 | Platform audit log and traceability chain | Cross-cutting |
| 16 | Multilingual platform shell (az, en, ru, tr) | Global |
| 17 | Governed report export | Reporting |

### 2.4 Future Capabilities (Planned Product Intent)

Future capabilities extend the product toward market leadership (24–60 months). Inclusion in scope does not imply committed delivery date:

| # | Capability | Horizon |
|---|------------|---------|
| 1 | Full ERP and DMS bi-directional integrations | Medium-term |
| 2 | Advanced AI: risk scoring, anomaly detection, draft working papers | Medium-term |
| 3 | Portfolio-level firm analytics and quality metrics | Medium-term |
| 4 | Regulatory change monitoring with template impact analysis | Long-term |
| 5 | Compliance packs by jurisdiction and industry | Medium-term |
| 6 | XBRL and structured regulatory export | Medium-term |
| 7 | Cross-engagement benchmarking (privacy-preserving) | Long-term |
| 8 | Partner extension and certified integration ecosystem | Long-term |
| 9 | Multi-region data residency and enterprise SLA tiers | Long-term |
| 10 | Offline-tolerant fieldwork for critical scenarios | Medium-term |
| 11 | Predictive risk and quality analytics | Long-term |
| 12 | Client acceptance workflow as first-class product journey | Near-term |

### 2.5 Enterprise Scope

| Dimension | Product Requirement |
|-----------|---------------------|
| **Tenancy** | Multi-tenant SaaS with strict organization isolation |
| **Hierarchy** | Organization → Workspace → Company (entity) → Engagement / Reporting Period |
| **Scale** | Thousands of concurrent users; large document volumes per engagement |
| **Permissions** | Organization, workspace, and engagement-level least privilege |
| **Group structures** | Parent-subsidiary entities with consolidation support |
| **Multi-office firms** | Workspace-per-office with shared or isolated methodology |
| **Client portal** | Governed client user access with strict data boundary |
| **Subscription tiers** | Module entitlements and seat licensing by tier |
| **Data portability** | Full organizational export without vendor lock-in |
| **Operational maturity** | SLA tiers, disaster recovery, and security certification path |

### 2.6 Industry Scope

| Industry | Scope Treatment |
|----------|-----------------|
| **General / cross-industry** | Core IFRS and ISA methodology — default for all customers |
| **Banking** | Specialized disclosures, instrument complexity, enhanced security |
| **Insurance** | Technical provisions, actuarial disclosure support, specialized working papers |
| **Construction** | Contract accounting, project-linked documentation, revenue recognition support |
| **Manufacturing** | Inventory, costing, physical inventory audit programs |
| **Government / public sector** | Public sector reporting templates, budget analytics, transparency requirements |
| **Enterprise (multi-industry groups)** | Multi-entity workspace with industry configuration per entity |

Industry scope is delivered through **configurable compliance packs and templates** — not separate product forks.

---

## 3. Business Objectives

Business objectives translate PROJECT_BIBLE mission and goals into **product-level outcomes** the organization must achieve. Objectives are categorized for prioritization and success measurement.

### 3.1 Strategic Objectives

| ID | Objective | Success Indicator |
|----|-----------|-------------------|
| STR-01 | Establish category position as AI-first audit and IFRS reporting platform | Reference customers and market recognition in primary segments |
| STR-02 | Achieve enterprise trust comparable to established audit software leaders | Tier-1 firm adoption; pass regulatory and quality inspections |
| STR-03 | Differentiate through evidence-backed AI without compromising professional accountability | Measurable efficiency gains with zero AI-attributed quality failures |
| STR-04 | Build unified platform across audit, reporting, and intelligence | Single-tenant adoption of all three domains by enterprise customers |
| STR-05 | Enable global expansion through multilingual and multi-jurisdiction foundation | Active customers in all four initial locale markets |

### 3.2 Operational Objectives

| ID | Objective | Success Indicator |
|----|-----------|-------------------|
| OPS-01 | Reduce manual effort in targeted workflows by ≥ 30% | Time-motion studies on documentation, search, and cross-referencing |
| OPS-02 | Increase engagement throughput per professional FTE | Engagements completed per auditor without quality degradation |
| OPS-03 | Compress reporting cycle time for IFRS customers | Days from trial balance finalization to approved statements |
| OPS-04 | Reduce quality review bottlenecks | Review turnaround time; uncleared review note density |
| OPS-05 | Achieve time-to-value < 90 days from onboarding | First productive engagement or reporting cycle within window |
| OPS-06 | Maintain platform availability ≥ 99.9% (enterprise tier) | SLA measurement |

### 3.3 Customer Objectives

| ID | Objective | Success Indicator |
|----|-----------|-------------------|
| CUS-01 | Deliver measurable ROI within first contract year | Customer-reported efficiency and cost avoidance |
| CUS-02 | Achieve ≥ 95% annual customer retention | Net revenue retention |
| CUS-03 | Enable firms to scale without proportional senior staff dependency | Junior staff productivity with governed methodology |
| CUS-04 | Provide inspection-ready engagement files | Pass external quality and regulatory inspections |
| CUS-05 | Support customer self-service methodology configuration | Template and rule changes without vendor intervention |
| CUS-06 | Expand module adoption within existing customers | Seat growth and module upsell rate |

### 3.4 AI Objectives

| ID | Objective | Success Indicator |
|----|-----------|-------------------|
| AI-01 | Embed AI in all major professional workflows | AI interaction rate on planning, fieldwork, reporting, and review |
| AI-02 | Maintain 100% evidence citation on AI outputs in professional contexts | Automated compliance check; zero uncited assertions in accepted outputs |
| AI-03 | Achieve professional acceptance rate demonstrating trust | Accept/reject ratio with documented rejection rationale |
| AI-04 | Deliver AI retrieval within professional workflow tolerance | P95 latency < 5 seconds |
| AI-05 | Ensure AI never bypasses human sign-off | Zero autonomous approvals; audit log verification |
| AI-06 | Build firm knowledge reuse through RAG | Knowledge base queries linked to engagements |

### 3.5 Compliance Objectives

| ID | Objective | Success Indicator |
|----|-----------|-------------------|
| CMP-01 | Support ISA-aligned audit methodology out of the box | Firm methodology configuration without ISA contradiction |
| CMP-02 | Support IFRS-aligned financial reporting | Statement and disclosure completeness validation |
| CMP-03 | Maintain zero cross-tenant data leakage | Security incident count |
| CMP-04 | Achieve SOC 2 Type II certification path | Control evidence and audit readiness |
| CMP-05 | Ensure 100% audit log completeness for defined events | Log coverage verification |
| CMP-06 | Support data residency and retention requirements | Customer jurisdiction compliance |
| CMP-07 | Enable professional defensibility under inspection | Platform audit trails withstand external review |

### 3.6 Enterprise Objectives

| ID | Objective | Success Indicator |
|----|-----------|-------------------|
| ENT-01 | Support enterprise-scale concurrent usage | Load testing at firm-scale volumes |
| ENT-02 | Provide engagement-level permission granularity | Least-privilege enforcement verification |
| ENT-03 | Enable multi-entity group reporting and assurance | Group customer reference deployments |
| ENT-04 | Deliver enterprise identity integration (SSO) | SSO adoption rate among enterprise tier |
| ENT-05 | Support certified partner integrations | ≥ 1 major ERP integration per enterprise customer |
| ENT-06 | Maintain export completeness for customer portability | Successful full export exercises |

---

## 4. Stakeholders

Stakeholders are individuals and organizations whose needs the product must satisfy. Each stakeholder profile defines **responsibilities, goals, pain points, and success metrics** — the basis for future user stories and acceptance criteria.

### 4.1 Platform Owner

The Platform Owner is the **vendor organization** that develops, operates, and commercializes the SaaS product.

| Dimension | Description |
|-----------|-------------|
| **Responsibilities** | Product strategy, platform operations, security, commercial model, partner ecosystem, and regulatory posture of the SaaS service |
| **Goals** | Sustainable revenue growth, category leadership, enterprise customer trust, operational excellence, and defensible AI positioning |
| **Pain Points** | Balancing velocity with regulated-domain quality; proving AI trustworthiness; competing against entrenched incumbents; multi-jurisdiction compliance burden |
| **Success Metrics** | ARR growth, net revenue retention, gross margin, platform uptime, security incident count, reference customer count, support ticket resolution time |

### 4.2 Organization Owner

The Organization Owner is the **customer's top-level administrator** — typically managing firm-wide or enterprise-wide subscription and policy.

| Dimension | Description |
|-----------|-------------|
| **Responsibilities** | Own subscription, billing, organization policies, administrator delegation, and data export authorization |
| **Goals** | Maximize return on platform investment, ensure firm-wide adoption, maintain data governance, and control access |
| **Pain Points** | Complex permission management at scale, onboarding friction, visibility into utilization, and vendor dependency risk |
| **Success Metrics** | User adoption rate, active engagement count, policy compliance, successful administrator self-service actions, export completion when needed |

### 4.3 Audit Firm

The Audit Firm is an **organizational customer** delivering independent assurance services across a client portfolio.

| Dimension | Description |
|-----------|-------------|
| **Responsibilities** | Deliver audit services, maintain firm methodology and quality standards, manage teams, uphold professional and regulatory obligations |
| **Goals** | Scale capacity, consistent quality across offices, protect reputation, optimize utilization, technology-enabled differentiation |
| **Pain Points** | Inconsistent practice, quality review bottlenecks, senior staff dependency, legacy software limits, fee pressure |
| **Success Metrics** | Engagements per FTE, quality review clearance rate, inspection pass rate, methodology compliance score, client retention |

### 4.4 Enterprise Customer

The Enterprise Customer is an **organizational customer** using the platform for in-house reporting, assurance, and financial intelligence — not necessarily as an external audit firm.

| Dimension | Description |
|-----------|-------------|
| **Responsibilities** | Group reporting, internal controls, coordination with external auditors, board reporting, regulatory compliance |
| **Goals** | Unified assurance and reporting environment, group consistency, reduced duplication, enterprise security |
| **Pain Points** | Disparate subsidiary systems, inconsistent methodologies, complex permissions, coordination cost |
| **Success Metrics** | Reporting cycle time, entity coverage, consolidation accuracy, audit coordination efficiency, board package delivery time |

### 4.5 Engagement Partner

| Dimension | Description |
|-----------|-------------|
| **Responsibilities** | Ultimate professional accountability for audit engagement — acceptance, strategy, material judgments, final review, opinion authorization |
| **Goals** | Defensible opinions, efficient team leverage, inspection survival, client relationship preservation |
| **Pain Points** | Late discovery of issues, incomplete files at sign-off, insufficient visibility into team progress, documentation quality variance |
| **Success Metrics** | Opinion issuance on schedule, zero material post-issuance findings, review clearance at first submission, engagement profitability |

### 4.6 Audit Manager

| Dimension | Description |
|-----------|-------------|
| **Responsibilities** | Plan and supervise engagements, assign team, review working papers, evaluate findings, manage client communication on audit matters |
| **Goals** | On-time fieldwork completion, quality documentation, efficient resource use, clear escalation paths |
| **Pain Points** | Review backlog, uneven staff quality, tracking procedure completion, coordinating across modules |
| **Success Metrics** | Fieldwork completion vs. plan, review note resolution time, procedure completion rate, team utilization, finding evaluation timeliness |

### 4.7 Auditor

| Dimension | Description |
|-----------|-------------|
| **Responsibilities** | Execute procedures, prepare working papers, obtain and document evidence, respond to review notes |
| **Goals** | Efficient fieldwork, defensible documentation, skill development, meet deadlines |
| **Pain Points** | Repetitive documentation, evidence search difficulty, unclear review feedback, tool fragmentation |
| **Success Metrics** | Working papers submitted on schedule, first-pass review acceptance rate, evidence linkage completeness, time on mechanical vs. analytical tasks |

### 4.8 Reviewer

| Dimension | Description |
|-----------|-------------|
| **Responsibilities** | Independent quality review (EQR-style or internal) — evaluate engagement file against firm and professional standards |
| **Goals** | Efficient review, consistent quality bar, clear finding communication, timely clearance |
| **Pain Points** | Incomplete files submitted for review, navigation difficulty in large engagements, inconsistent documentation quality |
| **Success Metrics** | Review turnaround time, findings per engagement, clearance rate, reinspection findings rate |

### 4.9 Finance Team

The Finance Team encompasses **Financial Controller, Finance Director, and CFO** as a collective stakeholder group for reporting workflows.

| Dimension | Description |
|-----------|-------------|
| **Responsibilities** | Trial balance integrity, IFRS classification, adjustments, financial statement preparation, executive approval, auditor coordination |
| **Goals** | Accurate and timely reporting, smooth audit support, controlled close process, executive-ready outputs |
| **Pain Points** | Classification errors, version chaos, manual disclosure assembly, weak trial balance-to-statement linkage, audit disruption |
| **Success Metrics** | Close-to-approval cycle time, classification exception rate, statement regeneration frequency, auditor query volume, CFO approval timeliness |

### 4.10 Board

| Dimension | Description |
|-----------|-------------|
| **Responsibilities** | Strategic oversight, safeguard stakeholder interests, approve major decisions, oversee financial reporting integrity |
| **Goals** | Confidence in reported position, effective governance, timely awareness of material matters |
| **Pain Points** | Over-reliance on management summaries, limited access to underlying assurance, delayed issue awareness |
| **Success Metrics** | Board package delivery timeliness, material issue escalation time, governance dashboard utilization, oversight confidence (survey) |

### 4.11 Regulator

The Regulator is an **external oversight body** — securities regulator, professional institute inspector, or supreme audit institution — that may examine engagement files or platform controls.

| Dimension | Description |
|-----------|-------------|
| **Responsibilities** | Enforce professional standards, inspect audit quality, protect market integrity, oversee public interest reporting |
| **Goals** | Evidence that audits and reports comply with standards; detect systemic quality failures |
| **Pain Points** | Incomplete engagement files, unsupported conclusions, inadequate documentation of judgment, opaque AI use |
| **Success Metrics** | Inspection finding rate (customer); platform audit log completeness; evidence traceability verification; AI interaction transparency |

*Note: Regulators are typically not platform users. The product must produce outputs and audit trails that **customers can present** to regulators.*

### 4.12 System Administrator

The System Administrator manages **day-to-day platform configuration** within a customer organization — Workspace Administrator and delegated IT administrators.

| Dimension | Description |
|-----------|-------------|
| **Responsibilities** | User provisioning, workspace configuration, template publication, methodology setup, integration management, audit log access |
| **Goals** | Secure and efficient platform operation, self-service configuration, minimal vendor dependency |
| **Pain Points** | Complex permission models, template versioning, integration failures, user onboarding volume |
| **Success Metrics** | User provisioning time, configuration change success rate, integration uptime, support ticket volume, security policy compliance |

---

## 5. Product Success Metrics

Product success metrics define **measurable KPIs** across business, technical, operational, AI, customer, and enterprise dimensions. Targets align with PROJECT_BIBLE Section 8; this section adds product ownership and measurement accountability.

### 5.1 Business KPIs

| KPI | Target | Measurement Method | Review Cadence |
|-----|--------|-------------------|----------------|
| Annual revenue growth | Positive; target set per fiscal plan | Financial systems | Quarterly |
| Net revenue retention | ≥ 110% | Subscription analytics | Quarterly |
| Customer acquisition cost payback | < 18 months | Sales and marketing analytics | Quarterly |
| Module expansion rate | ≥ 25% of customers add module within 18 months | Product analytics | Semi-annual |
| Reference customer count | Growing pipeline of public references | Sales | Semi-annual |
| Manual effort reduction | ≥ 30% in AI-assisted workflows | Customer time studies | Annual |
| Engagement throughput per FTE | ≥ 15% improvement year-over-year | Firm customer analytics | Annual |

### 5.2 Technical KPIs

| KPI | Target | Measurement Method | Review Cadence |
|-----|--------|-------------------|----------------|
| Platform availability | ≥ 99.9% (enterprise tier) | Uptime monitoring | Monthly |
| Core read response time (P95) | < 500ms | APM | Weekly |
| AI retrieval latency (P95) | < 5 seconds | AI service metrics | Weekly |
| Document ingestion throughput | Firm-scale without degradation | Load testing + production metrics | Quarterly |
| Zero cross-tenant data leakage | 0 incidents | Security monitoring | Continuous |
| Audit log completeness | 100% of defined events | Log coverage audit | Quarterly |
| Deployment frequency | Weekly (low-risk) | CI/CD metrics | Monthly |
| Mean time to recovery | < 1 hour (critical) | Incident management | Per incident |
| Defect escape rate | < 5% of releases | QA metrics | Per release |

### 5.3 Operational KPIs

| KPI | Target | Measurement Method | Review Cadence |
|-----|--------|-------------------|----------------|
| Time-to-value | < 90 days from onboarding | Customer success tracking | Per customer |
| Onboarding completion rate | ≥ 85% | CS platform | Quarterly |
| Support ticket first response | < 4 hours (enterprise) | Support system | Weekly |
| Support ticket resolution (P2) | < 24 hours | Support system | Weekly |
| Platform incident count | Decreasing trend | Incident log | Monthly |
| Documentation currency | 100% of shipped features documented | Doc review | Per release |
| Release rollback rate | < 2% | CI/CD | Quarterly |

### 5.4 AI KPIs

| KPI | Target | Measurement Method | Review Cadence |
|-----|--------|-------------------|----------------|
| AI interaction rate | ≥ 60% of active users per month | Product analytics | Monthly |
| Evidence citation compliance | 100% on professional outputs | Automated validation | Continuous |
| AI output acceptance rate | Tracked; target set after baseline | Accept/reject logging | Monthly |
| AI rejection with rationale | 100% of rejections documented | Audit trail | Monthly |
| Autonomous approval incidents | 0 | Security and workflow audit | Continuous |
| AI-assisted task time reduction | ≥ 25% on targeted tasks | User studies | Semi-annual |
| Knowledge base query success | ≥ 80% result relevance (survey) | User feedback | Quarterly |

### 5.5 Customer KPIs

| KPI | Target | Measurement Method | Review Cadence |
|-----|--------|-------------------|----------------|
| Annual customer retention | ≥ 95% | Subscription analytics | Quarterly |
| Net Promoter Score | ≥ 40 (enterprise) | Customer survey | Semi-annual |
| Task completion rate (core workflows) | ≥ 90% | Product analytics | Monthly |
| Reviewer satisfaction | ≥ 4.2 / 5 | Role-specific survey | Semi-annual |
| Learning curve to proficiency | < 2 weeks | Onboarding analytics | Per cohort |
| Customer-reported inspection pass rate | ≥ 95% | Customer survey | Annual |
| Integration adoption | ≥ 1 major ERP per enterprise customer | Integration analytics | Annual |

### 5.6 Enterprise KPIs

| KPI | Target | Measurement Method | Review Cadence |
|-----|--------|-------------------|----------------|
| Concurrent users per tenant | Firm-scale without degradation | Load testing | Quarterly |
| Engagement-level permission accuracy | 100% enforcement | Security testing | Per release |
| SSO adoption (enterprise tier) | ≥ 80% | Identity analytics | Quarterly |
| Data export completeness | 100% of contractual objects | Export verification | Annual |
| Disaster recovery RPO/RTO | Per SLA tier | DR drills | Annual |
| Penetration test critical findings | 0 open at release | Security assessment | Per assessment |
| WCAG 2.1 AA compliance | 100% of shell UI | Accessibility audit | Per major release |
| Multilingual shell coverage | 100% (az, en, ru, tr) | Localization audit | Per major release |
| Configurable methodology (no code) | Firm admin self-service confirmed | Admin task testing | Semi-annual |
| SOC 2 Type II readiness | On certification path | Control assessment | Annual |

### 5.7 Metric Governance

| Rule | Description |
|------|-------------|
| **Instrumentation first** | Features are not production-complete until KPIs are measurable |
| **Quarterly review** | Product and engineering leadership review all KPI categories |
| **Baseline before target** | New KPIs require baseline measurement before target commitment |
| **Customer co-validation** | Efficiency and quality KPIs validated with reference customers where possible |
| **PROJECT_BIBLE alignment** | KPI categories must map to PROJECT_BIBLE Section 8 dimensions |

---

## PRD Review Notes

Consistency review of MASTER_PRD Part 1 against PROJECT_BIBLE (Parts 1–15). No PROJECT_BIBLE content modified.

### Constitutional Alignment

| Area | Status | Notes |
|------|--------|-------|
| Mission and vision | Aligned | Section 1 references PROJECT_BIBLE Section 2–3 without restating |
| Core Principles | Aligned | Section 1.7 establishes subordination; principles referenced not duplicated |
| Non-Goals | Aligned | Section 2.2 maps PROJECT_BIBLE Section 7 exclusions |
| Three domains | Aligned | Audit, IFRS Reporting, Financial Intelligence consistent with Parts 1, 2, 13 |
| AI philosophy | Aligned | Human accountability, evidence-first — Parts 4, 15 |
| Success criteria | Aligned | Section 5 extends PROJECT_BIBLE Section 8 with ownership and cadence |

### Terminology Consistency

| Term | PROJECT_BIBLE | MASTER_PRD | Status |
|------|---------------|------------|--------|
| AI Findings vs. audit Findings | Part 4, Section 20 | Not yet in Part 1 — future feature parts | Pending |
| Business Insights | Part 13 | Referenced as financial intelligence output | Aligned |
| Working Paper, Lead Sheet, Evidence | Parts 2, 3, 8, 15 | Scope and stakeholder sections | Aligned |
| Engagement Partner sign-off chain | Parts 2, 3, 15 | Stakeholder and scope sections | Aligned |
| IFRS Note / Disclosure | Parts 8, 14 | IFRS reporting scope | Aligned |
| Platform Owner | Not named in Bible | Introduced as vendor role — maps to commercial operator | New term — PRD-01 |

### Scope Consistency

| Area | Status |
|------|--------|
| Primary vs. future capabilities | Section 2.3–2.4 aligns with PROJECT_BIBLE Section 6 horizons without duplicating roadmap detail |
| Module list | Section 2.1 capability areas map to Part 2 Section 12 modules — no contradictions |
| Industry scope | Section 2.6 aligns with Part 2 Section 9.4 segments |
| Client acceptance gap | ISA-03 / Part 15 notes client acceptance not in Part 3 workflows — listed in Section 2.4 future capabilities |

### Stakeholder Coverage

| Stakeholder | PROJECT_BIBLE Source | MASTER_PRD Section 4 |
|-------------|---------------------|----------------------|
| Organization Owner | Part 2, Section 10 | 4.2 |
| Audit Firm | Part 2, Section 9 | 4.3 |
| Enterprise Customer | Part 2, Section 9.4 | 4.4 |
| Engagement Partner | Part 2, Section 10 | 4.5 |
| Audit Manager | Part 2, Section 10 | 4.6 |
| Auditor | Part 2, Section 9–10 | 4.7 |
| Reviewer | Part 2, Section 10 | 4.8 |
| Finance Team | Part 2, Sections 9–10 | 4.9 |
| Board | Part 2, Section 9.3 | 4.10 |
| Regulator | Part 3, Section 16 (stakeholder) | 4.11 |
| System Administrator | Part 2 (Workspace Administrator) | 4.12 |
| Platform Owner | Commercial operator (not in Bible) | 4.1 |

### Editorial Recommendations

| ID | Recommendation |
|----|----------------|
| **PRD-01** | Add "Platform Owner" to PROJECT_BIBLE glossary as vendor/commercial operator distinct from Organization Owner |
| **PRD-02** | Part 2 of MASTER_PRD should enumerate module requirements mapped to PROJECT_BIBLE Part 2 Section 12 |
| **PRD-03** | Part 3 should map user journeys to PROJECT_BIBLE Part 3 Workflows 1–25 with acceptance criteria |
| **PRD-04** | Define KPI baselines during MVP launch — targets in Section 5 are directional until instrumented |
| **PRD-05** | Add Internal Auditor and Compliance Officer as secondary stakeholders in Part 2 stakeholder expansion |
| **PRD-06** | Cross-reference ISA Review Notes (ISA-03) for client acceptance workflow priority in Part 3 roadmap |

### Review Conclusion

MASTER_PRD Part 1 is **consistent with PROJECT_BIBLE** as the executable product layer. It references constitutional content without duplication, defines scope and objectives for product delivery, and establishes measurable success criteria. No contradictions identified. PRD-01 through PRD-06 are recommendations for future PRD parts and glossary updates.

---

## Document Control — Part 1

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1.0 | 2026-06-30 | Chief Product Officer | Part 1 — Product Overview, Scope, Objectives, Stakeholders, Success Metrics complete; PRD Review Notes included |

---

*End of Part 1.*

---

## Part 2 — Multi-Tenant Foundation & Enterprise Administration

### Table of Contents — Part 2

6. [Multi-Tenant Product Model](#6-multi-tenant-product-model)
7. [Organization Management Module](#7-organization-management-module)
8. [Workspace Management Module](#8-workspace-management-module)
9. [Company Management Module](#9-company-management-module)
10. [User Journey — First-Time Setup](#10-user-journey--first-time-setup)

---

## 6. Multi-Tenant Product Model

The multi-tenant product model defines how the platform **organizes customers, operations, and professional work** from a business perspective. It is the structural foundation for permissions, data isolation, and scalability (PROJECT_BIBLE, Part 8, Section 38; Core Principle 15).

### 6.1 Hierarchy Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         PLATFORM                                 │
│  (Vendor-operated SaaS — shared infrastructure, global policies) │
└────────────────────────────┬────────────────────────────────────┘
                             │ hosts
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ORGANIZATION                                │
│  (Customer tenant — subscription, global policies, billing)      │
└────────────────────────────┬────────────────────────────────────┘
                             │ contains
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       WORKSPACE                                  │
│  (Operational boundary — office, unit, or client portal)         │
└────────────────────────────┬────────────────────────────────────┘
                             │ contains
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        COMPANY                                   │
│  (Legal reporting entity — financial data and reporting)         │
└────────────────────────────┬────────────────────────────────────┘
                             │ subject of
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       ENGAGEMENT                                 │
│  (Professional assignment — audit file for company and period)   │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Level Definitions

#### Platform

| Dimension | Description |
|-----------|-------------|
| **Purpose** | The vendor-operated SaaS environment hosting all customer organizations — providing shared capabilities, global compliance posture, and operational administration |
| **Ownership** | Platform Owner (vendor) |
| **Business Relationships** | Hosts many Organizations; not accessible to customer users for cross-tenant operations |
| **Business Isolation** | Complete isolation between Organizations — no customer visibility across tenancy boundaries (ORG-01) |
| **Typical Structure** | Single global platform with optional regional deployment variants for data residency |

#### Organization

| Dimension | Description |
|-----------|-------------|
| **Purpose** | Top-level **customer tenant** — a firm, enterprise, or institution that subscribes to and operates the platform |
| **Ownership** | Organization Owner (customer) |
| **Business Relationships** | Contains Workspaces, Users, and organization-wide policies; parent of all customer data within the tenant |
| **Business Isolation** | Absolute boundary — no data, user, or configuration leakage to other Organizations |
| **Typical Structure** | One Organization per subscribing customer legal entity (audit firm, corporate group administrator) |

#### Workspace

| Dimension | Description |
|-----------|-------------|
| **Purpose** | Operational subdivision within an Organization — firm office, business unit, practice area, or **client portal** |
| **Ownership** | Workspace Administrator (delegated by Organization Owner) |
| **Business Relationships** | Belongs to Organization; contains Companies and Engagements; scopes methodology templates and user access |
| **Business Isolation** | Client workspaces isolated from other client workspaces within the same firm (WS-03); permissions may only narrow organization policy |
| **Typical Structure** | Multi-office firm: one Workspace per office; Enterprise: one Workspace per division or shared corporate Workspace |

#### Company

| Dimension | Description |
|-----------|-------------|
| **Purpose** | A **legal reporting entity** — the unit for which financial data is managed, statements are composed, and engagements are performed |
| **Ownership** | Workspace Administrator (registration); Financial Controller (financial data) |
| **Business Relationships** | Belongs to Workspace; may have parent Company (group); has Financial Periods, Engagements, Chart of Accounts |
| **Business Isolation** | Entity-scoped data container; access governed by workspace and engagement grants |
| **Typical Structure** | Single entity SME: one Company; Group: parent Company with subsidiary Companies in same or different Workspaces |

#### Engagement

| Dimension | Description |
|-----------|-------------|
| **Purpose** | A **bounded professional assignment** to perform audit or assurance work for a specific Company and reporting period |
| **Ownership** | Engagement Partner (accountability); Audit Manager (operations) |
| **Business Relationships** | Belongs to Workspace; linked to Company and Financial Period; contains Team, Working Papers, Evidence, Opinion |
| **Business Isolation** | Engagement-scoped access — team members see only assigned engagements unless elevated role grants broader access |
| **Typical Structure** | Annual statutory audit: one Engagement per Company per audit period; may coexist with reporting-only activity on same Company |

### 6.3 Cross-Level Relationships

```
Organization ──1:N──► Workspace ──1:N──► Company ──1:N──► Engagement
     │                    │                  │
     │                    │                  └──► Financial Period ──► Trial Balance / Statements
     │                    │
     └──► Users (org-wide identity, workspace-scoped roles)
```

| Relationship | Cardinality | Business Rule |
|--------------|-------------|---------------|
| Platform → Organization | One-to-many | Each Organization provisioned independently |
| Organization → Workspace | One-to-many | Minimum one Workspace required for operations |
| Workspace → Company | One-to-many | Company belongs to exactly one Workspace |
| Company → Engagement | One-to-many | Engagements reference one Company and one period |
| Company → Company (group) | Parent-child | Subsidiary must reference valid parent in same Organization (CO-04) |
| User → Organization | Many-to-one | User identity scoped to Organization |
| User → Workspace | Many-to-many | Explicit workspace assignment required |

### 6.4 Typical Enterprise Structures

#### Audit Firm (Multi-Office)

```
Organization: "ABC Audit LLP"
├── Workspace: "Baku Office"
│   ├── Company: Client A Ltd
│   │   └── Engagement: FY2026 Statutory Audit
│   └── Company: Client B JSC
├── Workspace: "London Office"
│   └── Company: Client C PLC
└── Workspace: "Shared Methodology" (optional)
    └── Published templates (read-only to other workspaces)
```

#### Corporate Enterprise (In-House)

```
Organization: "Global Holdings Group"
├── Workspace: "Corporate Finance"
│   ├── Company: Global Holdings (Parent)
│   ├── Company: Subsidiary Alpha
│   └── Company: Subsidiary Beta
└── Workspace: "Internal Audit"
    └── Engagement: FY2026 ICFR Review (Company: Global Holdings)
```

#### Client Portal (Firm Serving Client)

```
Organization: "ABC Audit LLP"
└── Workspace: "Client Portal — Client A Ltd"
    ├── Company: Client A Ltd
    ├── Client Users (read/upload only)
    └── Engagement: FY2026 Audit (auditor team from firm workspaces)
```

### 6.5 Isolation Principles

| Level | Isolation Guarantee |
|-------|---------------------|
| **Platform** | Operational separation of tenant data; shared services do not commingle customer content |
| **Organization** | No cross-organization data access under any customer role |
| **Workspace** | Client confidentiality enforced between client workspaces in same firm |
| **Company** | Financial data scoped to entity; group visibility requires explicit group permissions |
| **Engagement** | Team-scoped access; evidence and working papers confined to engagement boundary |

---

## 7. Organization Management Module

The Organization Management module governs the **top-level customer tenant** — subscription boundary, global policies, and delegation of administration across the customer's platform estate.

*Constitutional basis: PROJECT_BIBLE, Part 2 Sections 10–12; Part 3 Workflow 2; Business Rules ORG-01 through ORG-05.*

### 7.1 Purpose

Enable a subscribing customer to **establish, configure, and govern** their isolated platform environment — including subscription entitlements, organization-wide policies, owner accountability, and lifecycle management from provisioning through termination.

### 7.2 Business Goals

| Goal | Description |
|------|-------------|
| **Tenancy establishment** | Provide a secure, isolated environment for all customer data and users |
| **Accountability** | Maintain exactly one Organization Owner at all times |
| **Policy governance** | Set organization-wide ceilings for security, quality, and compliance |
| **Commercial alignment** | Enforce subscription tier and module entitlements |
| **Portability** | Enable authorized full export of organizational data |
| **Lifecycle control** | Govern suspension, archive, and termination with retention compliance |

### 7.3 Who Can Create Organizations

| Actor | Capability |
|-------|------------|
| **Platform Owner (Super Administrator)** | Provision new Organization tenants during customer onboarding |
| **Automated provisioning** | Self-service signup (if commercially enabled) creates Organization with registering user as Organization Owner |
| **Organization Owner** | Cannot create additional Organizations — one tenant per subscription |
| **All other roles** | No organization creation capability |

Organization creation is a **platform-level commercial event**, not a routine customer administrator action.

### 7.4 Organization Settings

| Setting Category | Description | Configurable By |
|----------------|-------------|-----------------|
| **Subscription & licensing** | Tier, seat count, module entitlements, contract dates | Platform Owner; Organization Owner (view) |
| **Default locale** | Organization default language (az, en, ru, tr) | Organization Owner |
| **Security policies** | MFA requirements, session timeout, password policy, SSO enablement | Organization Owner |
| **AI policies** | AI enablement, usage boundaries, model policy selection | Organization Owner |
| **Retention policy** | Default retention periods for engagements and financial data | Organization Owner |
| **Export policy** | Who may request exports; approval requirements | Organization Owner |
| **Naming conventions** | Optional standards for entity and engagement naming | Organization Owner |
| **Notification defaults** | Organization-wide notification preferences | Organization Owner |
| **Audit log retention** | Minimum retention for platform audit logs | Organization Owner (within platform minimum) |
| **Data residency** | Preferred data region (where subscription tier permits) | Organization Owner (at provisioning) |

### 7.5 Organization Profile

| Profile Element | Required | Description |
|-----------------|----------|-------------|
| **Legal name** | Yes | Official name of subscribing organization |
| **Display name** | Yes | Name shown in platform UI |
| **Organization type** | Yes | Audit firm, accounting firm, enterprise, government, other |
| **Primary jurisdiction** | Yes | Country of primary legal registration |
| **Registration identifier** | Recommended | Commercial registration or tax identifier |
| **Primary contact email** | Yes | Organization Owner contact |
| **Billing contact** | Yes | Invoice and commercial correspondence |
| **Address** | Recommended | Registered or primary business address |
| **Phone** | Optional | Primary contact number |
| **Website** | Optional | Organization website |
| **Time zone** | Yes | Default time zone for scheduling and timestamps |

### 7.6 Organization Branding

| Branding Element | Description | Availability |
|------------------|-------------|--------------|
| **Logo** | Organization logo displayed in platform header and exports | Enterprise tier and above |
| **Primary color accent** | UI accent color for organization-branded experience | Enterprise tier and above |
| **Report header branding** | Logo on exported report packages | Configurable per organization |
| **Client portal branding** | Branding on client-facing portal views | Workspace may inherit or override |
| **Email template branding** | Logo on system notification emails | Organization-level setting |

Branding must not compromise accessibility standards (PROJECT_BIBLE, Part 7) or obscure platform security indicators.

### 7.7 Organization Lifecycle

```
Provisioned → Active → Suspended → Terminated → Retained (archived)
                    ↓
              (reactivation path from Suspended to Active)
```

| State | Description | User Access |
|-------|-------------|-------------|
| **Provisioned** | Tenant created; initial configuration in progress | Organization Owner only |
| **Active** | Fully operational subscription | Per role permissions |
| **Suspended** | Commercial or policy suspension — non-payment, contract dispute, security hold | Read-only or blocked per suspension reason |
| **Terminated** | Subscription ended; no new work permitted | No access except export window if granted |
| **Retained** | Post-termination data retention per contract and regulation | No user access; Platform Owner retention only |

### 7.8 Organization Status

| Status | Business Meaning | Transitions |
|--------|------------------|-------------|
| **Provisioned** | Awaiting completion of initial setup wizard | → Active (setup complete) |
| **Active** | Normal operations | → Suspended, → Terminated |
| **Suspended** | Temporarily restricted | → Active (reinstatement), → Terminated |
| **Terminated** | Contract concluded | → Retained (automatic after export window) |
| **Retained** | Legal/regulatory hold only | Terminal state until retention expires |

All status transitions are recorded in the platform audit log with actor, timestamp, and reason.

### 7.9 Organization Archive Policy

| Policy Element | Requirement |
|----------------|-------------|
| **Trigger** | Organization moves to Terminated then Retained status |
| **Scope** | All workspaces, companies, engagements, financial data, documents, and audit logs within Organization |
| **Accessibility** | No customer user access during Retained state |
| **Export window** | Organization Owner may request full export during defined post-termination window |
| **Retention duration** | Per subscription contract and applicable regulation — minimum defined by Platform Owner |
| **Legal hold** | Legal hold suspends deletion regardless of standard retention expiry |
| **Restoration** | Reactivation from Retained requires Platform Owner commercial approval |

### 7.10 Organization Deletion Policy

| Rule | Description |
|------|-------------|
| **No hard delete with data** | Organizations containing financial, engagement, or audit data cannot be permanently destroyed (Core Principle 3) |
| **Soft termination only** | Customer-initiated "deletion" transitions to Terminated → Retained |
| **Minimum retention** | Platform retains data per contract and regulatory minimums |
| **Anonymization** | Post-retention anonymization may apply where law permits — requires Platform Owner action |
| **Audit log preservation** | Platform audit logs for the Organization retained beyond customer data where regulations require |
| **Export before termination** | Product prompts Organization Owner to complete export before confirming termination |

### 7.11 Business Validations

| Validation | Rule |
|------------|------|
| **ORG-V01** | Legal name required and non-empty |
| **ORG-V02** | Exactly one active Organization Owner at all times |
| **ORG-V03** | Organization type must be selected from defined list |
| **ORG-V04** | Primary jurisdiction must be valid supported jurisdiction |
| **ORG-V05** | Default locale must be one of supported locales (az, en, ru, tr) |
| **ORG-V06** | Cannot transition to Active without completed minimum setup (profile, owner MFA if required) |
| **ORG-V07** | Cannot terminate with active engagements in non-closed state without override acknowledgment |
| **ORG-V08** | Module entitlements cannot exceed subscription tier |
| **ORG-V09** | Organization name unique within platform (display name may duplicate with disambiguation) |
| **ORG-V10** | Export request requires Organization Owner authorization (ORG-05) |

### 7.12 User Permissions

| Capability | Organization Owner | Workspace Administrator | All Other Roles |
|------------|-------------------|------------------------|-----------------|
| View organization profile | Yes | Yes (read) | No |
| Edit organization profile | Yes | No | No |
| Manage subscription view | Yes | No | No |
| Configure security policies | Yes | No | No |
| Configure AI policies | Yes | No | No |
| Configure retention policy | Yes | No | No |
| Authorize full export | Yes | No | No |
| Suspend users (org-wide) | Yes | No | No |
| Appoint Organization Owner successor | Yes | No | No |
| View organization audit log | Yes | No | No |
| Manage branding | Yes | No | No |
| Request termination | Yes | No | No |

### 7.13 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **ORG-AC-01** | Platform Owner can provision a new Organization with Organization Owner assigned |
| **ORG-AC-02** | Provisioned Organization is inaccessible to all other Organizations |
| **ORG-AC-03** | Organization Owner can complete organization profile and settings |
| **ORG-AC-04** | System enforces exactly one Organization Owner — transfer requires explicit succession workflow |
| **ORG-AC-05** | Module features unavailable when not entitled by subscription tier |
| **ORG-AC-06** | Organization status transitions follow defined lifecycle with audit log entries |
| **ORG-AC-07** | Suspended Organization restricts write access per suspension policy |
| **ORG-AC-08** | Termination workflow prompts export and blocks termination with open critical engagements unless acknowledged |
| **ORG-AC-09** | Organization Owner can authorize and execute full organizational export |
| **ORG-AC-10** | Branding settings reflect in UI and exports when configured |
| **ORG-AC-11** | MFA enforced for Organization Owner when organization policy requires |

---

## 8. Workspace Management Module

The Workspace Management module governs **operational subdivisions** within an Organization — the boundary where client confidentiality, methodology, and day-to-day professional work are isolated.

*Constitutional basis: PROJECT_BIBLE, Part 2 Sections 10–12; Part 3 Workflow 2; Business Rules WS-01 through WS-04.*

### 8.1 Purpose

Enable organizations to **structure operations** across offices, business units, or client portals — with isolated administration, methodology configuration, and user access while inheriting organization-wide policy ceilings.

### 8.2 Business Goals

| Goal | Description |
|------|-------------|
| **Operational segmentation** | Support multi-office firms and multi-division enterprises |
| **Client confidentiality** | Isolate client workspaces from each other within a firm |
| **Methodology control** | Publish firm-approved templates at workspace level |
| **Delegated administration** | Empower Workspace Administrators without organization-wide access |
| **Scalable onboarding** | Add workspaces as firm grows without new Organization |

### 8.3 Workspace Creation

| Attribute | Description |
|-----------|-------------|
| **Who may create** | Organization Owner; Workspace Administrator (if delegated by Organization Owner) |
| **Required inputs** | Workspace name, workspace type, default locale (optional override), assigned Workspace Administrator |
| **Optional inputs** | Description, methodology template set, module subset (within org entitlements), client portal flag |
| **Processing** | Validate uniqueness within Organization → assign administrator → apply organization policy inheritance → create workspace container → record audit log |
| **Output** | Active workspace ready for company registration and user assignment |

#### Workspace Types

| Type | Purpose | Typical Use |
|------|---------|-------------|
| **Firm office** | Geographic or practice office | Baku office, London office |
| **Business unit** | Internal division | Corporate finance, internal audit |
| **Client portal** | Client-isolated environment | Single client data and client users |
| **Shared services** | Central methodology or quality | Template library, knowledge base |

### 8.4 Workspace Ownership

| Role | Responsibility |
|------|----------------|
| **Organization Owner** | Ultimate authority; may create, archive, reassign administrators |
| **Workspace Administrator** | Day-to-day workspace configuration, user provisioning, template publication |
| **Engagement Partner** | Professional authority within engagements — not workspace administration |

Each workspace must have **at least one assigned Workspace Administrator** at all times.

### 8.5 Workspace Settings

| Setting | Description |
|---------|-------------|
| **Display name and description** | Workspace identification |
| **Default locale** | Override organization default for workspace users |
| **Enabled modules** | Subset of organization-entitled modules active in workspace |
| **Methodology template set** | Active audit and reporting templates |
| **Default chart of accounts template** | Applied to new companies unless overridden |
| **Default compliance pack** | Industry or jurisdiction pack for new companies |
| **Client portal mode** | Enables client user invitations with restricted access |
| **Review policy defaults** | Default review levels and quality review requirements |
| **Notification routing** | Workspace-specific notification rules |
| **Integration connections** | Workspace-scoped ERP or DMS integrations |

Workspace settings **cannot relax** organization security or AI policies (ORG-03).

### 8.6 Workspace Permissions

| Principle | Application |
|-----------|-------------|
| **Bounded administration** | Workspace Administrator operates only within assigned workspaces (WS-01) |
| **Inheritance with restriction** | Workspace permissions narrow organization permissions — never expand |
| **Explicit user assignment** | Users must be assigned to workspace to access workspace content |
| **Cross-workspace access** | Requires explicit multi-workspace grant — not default |
| **Client user confinement** | Client users limited to designated client portal workspace |
| **Template publication** | Only Workspace Administrator or Organization Owner may publish templates (WS-02) |

#### Permission Matrix (Summary)

| Capability | Organization Owner | Workspace Administrator | Engagement Team | Client User |
|------------|-------------------|------------------------|-----------------|-------------|
| Create workspace | Yes | Delegated (if granted) | No | No |
| Edit workspace settings | Yes | Assigned workspaces | No | No |
| Publish methodology templates | Yes | Assigned workspaces | No | No |
| Invite users to workspace | Yes | Assigned workspaces | No | No |
| Create company | Yes | Assigned workspaces | No | No |
| View workspace audit log | Yes | Assigned workspaces | No | No |
| Archive workspace | Yes | No | No | No |

### 8.7 Workspace Lifecycle

```
Created → Active → Archived
              ↓
        (cannot create new companies when Archived)
```

| State | Description |
|-------|-------------|
| **Created** | Workspace exists; configuration in progress |
| **Active** | Fully operational — companies, engagements, users permitted |
| **Archived** | Read-only — no new companies or engagements; existing data preserved |

Archived workspaces cannot be deleted if they contain financial or engagement data (CO-03, ORG archive policy applies at organization level).

### 8.8 Business Validations

| Validation | Rule |
|------------|------|
| **WS-V01** | Workspace name unique within Organization |
| **WS-V02** | At least one Workspace Administrator assigned |
| **WS-V03** | Workspace type must be selected |
| **WS-V04** | Enabled modules must be subset of organization entitlements |
| **WS-V05** | Client portal workspace cannot share users with firm internal workspace without explicit dual assignment |
| **WS-V06** | Methodology template publication requires Workspace Administrator or Organization Owner |
| **WS-V07** | Cannot archive workspace with open engagements unless override with acknowledgment |
| **WS-V08** | Configuration changes versioned with effective date (WS-04) |

### 8.9 How Workspaces Isolate Business Operations

```
┌─────────────────────────────────────────────────────────────┐
│                    ORGANIZATION                              │
│  Shared: subscription, org policies, user identities         │
├──────────────────────┬──────────────────────────────────────┤
│   WORKSPACE A        │   WORKSPACE B (Client Portal)         │
│  (Firm Office)       │                                      │
│  • Firm staff        │  • Client users only                 │
│  • Client X data     │  • Client Y data only                │
│  • Office templates  │  • No visibility to Workspace A      │
│  • Engagements X     │  • Engagements Y                     │
└──────────────────────┴──────────────────────────────────────┘
```

| Isolation Dimension | Mechanism |
|---------------------|-----------|
| **Data** | Companies and engagements belong to one workspace |
| **Users** | Workspace assignment required; client users confined to client portal |
| **Methodology** | Templates published per workspace — may differ between offices |
| **Administration** | Workspace Administrator cannot see other workspaces |
| **Confidentiality** | Cross-workspace search and navigation prohibited by default |
| **Audit trail** | Actions tagged with workspace context for forensic review |

### 8.10 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **WS-AC-01** | Organization Owner can create workspace with assigned administrator |
| **WS-AC-02** | Workspace name unique within Organization enforced |
| **WS-AC-03** | Workspace Administrator can configure settings only within assigned workspaces |
| **WS-AC-04** | Client portal workspace isolates client users from other workspaces |
| **WS-AC-05** | Methodology templates require approval before publication to workspace users |
| **WS-AC-06** | User without workspace assignment cannot access workspace content |
| **WS-AC-07** | Archived workspace is read-only — no new companies or engagements |
| **WS-AC-08** | Workspace configuration changes create versioned history with effective date |
| **WS-AC-09** | Workspace cannot enable modules not entitled at organization level |
| **WS-AC-10** | Cross-workspace data access attempt is denied and logged |

---

## 9. Company Management Module

The Company Management module governs **legal reporting entities** — the anchor for all financial data, reporting periods, IFRS composition, and audit engagements.

*Constitutional basis: PROJECT_BIBLE, Part 3 Workflow 1; Part 8 Section 38; Business Rules CO-01 through CO-05.*

### 9.1 Purpose

Register and govern legal entities within a workspace so that financial data, reporting frameworks, industry configuration, and engagements have a **defined, traceable reporting unit** with correct regulatory context.

### 9.2 Business Goals

| Goal | Description |
|------|-------------|
| **Entity identity** | Unambiguous legal entity registration within workspace |
| **Regulatory context** | Explicit reporting framework and jurisdiction at creation |
| **Financial data anchor** | All imports, periods, and statements tied to registered entity |
| **Group support** | Parent-subsidiary hierarchy for consolidation |
| **Audit readiness** | Entity configured for engagement assignment and auditor access |
| **Historical preservation** | Entity history retained — no destructive deletion |

### 9.3 Company Creation

| Attribute | Description |
|-----------|-------------|
| **Trigger** | Organization Owner or Workspace Administrator initiates company creation |
| **Required inputs** | Legal name, jurisdiction, reporting framework, functional currency, fiscal year end, industry classification |
| **Recommended inputs** | Registration identifier, parent company (if subsidiary), entity type |
| **Processing** | Validate uniqueness → apply naming conventions → assign default chart of accounts template → apply industry compliance pack → establish entity permission boundary → create initial financial period shell → audit log |
| **Output** | Registered company in Active status ready for data import and engagement assignment |
| **Roles** | Organization Owner, Workspace Administrator |

### 9.4 Company Profile

The company profile is the **authoritative business identity** of the reporting entity — displayed across financial, reporting, and audit contexts.

| Profile Section | Contents |
|-----------------|----------|
| **Legal identity** | Legal name, trade name, registration numbers, legal form |
| **Location** | Jurisdiction, registered address, operating address |
| **Regulatory** | Reporting framework, listing status, regulatory identifiers |
| **Financial** | Functional currency, presentation currency, fiscal year, consolidation role |
| **Classification** | Industry type, size category, compliance pack |
| **Contacts** | Primary finance contact, auditor contact (if applicable) |
| **Notes** | Free-text administrative notes (not for audit conclusions) |

### 9.5 Company Attributes — Complete Business Inventory

The following attributes define a Company from a **business perspective**. All attributes are governed, auditable, and versioned where changes affect reporting or audit context.

#### Identity Attributes

| Attribute | Required | Description |
|-----------|----------|-------------|
| **Legal entity name** | Yes | Official registered name |
| **Trade name / DBA** | No | Operating name if different from legal name |
| **Company registration number** | Recommended | National company registry identifier |
| **Tax identification number** | Recommended | VAT, TIN, or equivalent |
| **Legal form** | Recommended | LLC, JSC, LLP, partnership, government entity, etc. |
| **Entity identifier (internal)** | Auto | Platform-assigned unique reference within Organization |
| **LEI (Legal Entity Identifier)** | No | Global identifier for regulated entities |
| **Stock exchange listing** | No | Exchange and ticker if publicly listed |

#### Location & Jurisdiction Attributes

| Attribute | Required | Description |
|-----------|----------|-------------|
| **Country of incorporation** | Yes | Primary jurisdiction |
| **Registered address** | Recommended | Legal registered address |
| **Operating address** | No | Principal place of business if different |
| **Regulatory jurisdiction** | Recommended | Primary regulator if distinct from incorporation |

#### Financial & Reporting Attributes

| Attribute | Required | Description |
|-----------|----------|-------------|
| **Reporting framework** | Yes | IFRS, local GAAP, or other declared framework (CO-01) |
| **Functional currency** | Yes | Currency of primary economic environment |
| **Presentation currency** | No | Currency for published statements if different |
| **Fiscal year end** | Yes | Month and day (e.g., 31 December) |
| **First reporting period** | Yes | Initial period for which platform will hold data |
| **Rounding convention** | No | Thousands, millions, or unit — per organization default |
| **Consolidation method** | No | For group entities — full, proportional, equity (if applicable) |
| **Group reporting entity flag** | No | Whether entity is group parent for consolidation |

#### Structure Attributes

| Attribute | Required | Description |
|-----------|----------|-------------|
| **Entity type** | Yes | Standalone, parent, subsidiary, branch, joint venture |
| **Parent company** | Conditional | Required for subsidiary — must exist in same Organization (CO-04) |
| **Ownership percentage** | No | Parent ownership share for subsidiaries |
| **Group hierarchy level** | Auto | Depth in group tree |

#### Industry & Compliance Attributes

| Attribute | Required | Description |
|-----------|----------|-------------|
| **Industry classification** | Yes | Banking, insurance, construction, manufacturing, government, general, other |
| **Industry sub-classification** | No | Finer industry granularity |
| **Compliance pack** | Auto/Manual | Industry and jurisdiction template set applied |
| **Regulated entity flag** | No | Subject to sector-specific regulation |
| **Public interest entity flag** | No | PIE designation for audit scoping |

#### Operational Attributes

| Attribute | Required | Description |
|-----------|----------|-------------|
| **Company status** | Auto | Registered, Active, Inactive, Archived |
| **Audit status** | Yes | Not under audit, under external audit, under internal audit, audit completed (period) |
| **Default chart of accounts template** | Auto | Assigned at creation from workspace default |
| **Default locale** | No | Entity-specific locale override |
| **Primary finance contact** | Recommended | Named finance responsible person |
| **External auditor firm name** | No | If audit performed outside platform tenant |
| **Data import source preference** | No | ERP, spreadsheet, manual — guides onboarding |

#### Lifecycle & Governance Attributes

| Attribute | Description |
|-----------|-------------|
| **Created date** | Registration timestamp |
| **Created by** | User who registered entity |
| **Activated date** | When first financial data imported or engagement created |
| **Last modified** | Most recent profile change |
| **Archive date** | When moved to Archived status |
| **Archive reason** | Documented reason for archival |
| **Retention classification** | Standard, extended, legal hold |

### 9.6 Industry Type

| Industry | Product Behavior |
|----------|------------------|
| **General** | Standard IFRS and ISA templates |
| **Banking** | Banking compliance pack — specialized disclosures and programs |
| **Insurance** | Insurance compliance pack — technical provisions focus |
| **Construction** | Contract and project-linked structures |
| **Manufacturing** | Inventory and costing emphasis |
| **Government / public sector** | Public sector reporting templates |
| **Oil & gas** | Specialized industry pack (future) |
| **Other** | General templates with manual configuration |

Industry selection **activates compliance pack** — it does not lock entity from using core platform capabilities.

### 9.7 Fiscal Year

| Requirement | Description |
|-------------|-------------|
| **Declaration at creation** | Fiscal year end month/day required |
| **Period generation** | Platform generates Financial Periods based on fiscal year |
| **Non-calendar year** | Supported — periods align to declared fiscal year end |
| **Change restriction** | Fiscal year change after data exists requires Organization Owner acknowledgment and documented reason |
| **Comparative periods** | Prior periods created for comparatives when configured |

### 9.8 Reporting Currency

| Currency Type | Description |
|---------------|-------------|
| **Functional currency** | Required — all imported data measured in this currency unless conversion documented |
| **Presentation currency** | Optional — statements may be presented in different currency with disclosure |
| **Currency change** | Treated as significant event — versioned with effective date and restatement flag |

### 9.9 Accounting Framework

| Framework | Product Support |
|-----------|-----------------|
| **IFRS** | Full classification, statements, notes (primary framework) |
| **Local GAAP** | Supported via configurable compliance packs where available |
| **Other** | Declared at creation — determines template and validation set |

Framework declaration is **immutable after first approved financial statement** without documented framework change workflow.

### 9.10 Audit Status

| Status | Meaning | Transitions |
|--------|---------|-------------|
| **Not under audit** | No active engagement on current period | → Under external audit (engagement accepted) |
| **Under external audit** | Active external audit engagement in progress | → Audit completed (engagement closed) |
| **Under internal audit** | Active internal assurance engagement | → Audit completed |
| **Audit completed** | Engagement closed for period | → Not under audit (new period) or new engagement |

Audit status is **derived from engagement state** — not manually overridden without authorization.

### 9.11 Company Lifecycle

```
Registered → Active → Inactive → Archived
                ↓
         (Restore from Inactive or Archived)
```

| State | Description | Permitted Actions |
|-------|-------------|-------------------|
| **Registered** | Entity created; no financial data | Edit profile, import data, create engagement |
| **Active** | Financial data or engagement exists | Full operations |
| **Inactive** | Temporarily dormant — no open periods or engagements | Read-only; reactivate |
| **Archived** | Permanent read-only retention | View, export; no edits |

### 9.12 Archive

| Rule | Description |
|------|-------------|
| **Trigger** | Workspace Administrator or Organization Owner initiates archive |
| **Precondition** | No open reporting periods; no open engagements |
| **Effect** | Company read-only; all periods archived |
| **Reversibility** | Restore permitted with Organization Owner authorization |
| **Data retention** | All financial and engagement history preserved (CO-03) |

### 9.13 Restore

| Rule | Description |
|------|-------------|
| **Who may restore** | Organization Owner; Workspace Administrator with delegation |
| **From Inactive** | Reactivate to Active — periods may be reopened per policy |
| **From Archived** | Requires Organization Owner authorization and documented reason |
| **Audit log** | Restore action recorded with full attribution |

### 9.14 Business Validations

| Validation | Rule |
|------------|------|
| **CO-V01** | Legal name required and unique within workspace (CO-02) |
| **CO-V02** | Registration identifier unique within workspace when provided |
| **CO-V03** | Reporting framework required (CO-01) |
| **CO-V04** | Functional currency required |
| **CO-V05** | Fiscal year end required — valid month/day |
| **CO-V06** | Industry classification required |
| **CO-V07** | Subsidiary must reference valid parent in same Organization (CO-04) |
| **CO-V08** | Parent cannot be subsidiary of its own descendant |
| **CO-V09** | Cannot hard-delete company with financial or engagement data (CO-03) |
| **CO-V10** | Financial data import requires open reporting period (CO-05) |
| **CO-V11** | Framework change blocked after approved statements without change workflow |
| **CO-V12** | Archive blocked with open periods or engagements |

### 9.15 Permissions

| Capability | Organization Owner | Workspace Administrator | Financial Controller | Auditor (engagement grant) |
|------------|-------------------|------------------------|---------------------|---------------------------|
| Create company | Yes | Yes | No | No |
| Edit company profile | Yes | Yes | Limited (contacts) | Read |
| Archive company | Yes | Yes | No | No |
| Restore company | Yes | Delegated | No | No |
| View company | Yes | Yes | Assigned entities | Engagement-scoped |
| Manage financial periods | Yes | Yes | Yes | Read (if granted) |
| Import financial data | No | No | Yes | No |

### 9.16 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **CO-AC-01** | Workspace Administrator can create company with all required attributes |
| **CO-AC-02** | Duplicate legal name within workspace rejected |
| **CO-AC-03** | Reporting framework required and stored at creation |
| **CO-AC-04** | Subsidiary without valid parent rejected |
| **CO-AC-05** | Default chart of accounts template applied from workspace |
| **CO-AC-06** | Industry selection activates appropriate compliance pack |
| **CO-AC-07** | Financial period shell created for first reporting period |
| **CO-AC-08** | Company with financial data cannot be hard-deleted |
| **CO-AC-09** | Archive blocked when open engagements or periods exist |
| **CO-AC-10** | Restore from archived creates audit log with authorization |
| **CO-AC-11** | Audit status updates when engagement accepted and closed |
| **CO-AC-12** | Auditor can view company only with engagement-scoped grant |

---

## 10. User Journey — First-Time Setup

This section describes the **first-time experience** from a new customer's perspective — from initial access through readiness to create the first engagement. It operationalizes PROJECT_BIBLE Part 3 Workflows 1–4 and the time-to-value objective (MASTER_PRD Section 3.2, OPS-05).

### 10.1 Journey Overview

```
Register → Create/Enter Organization → Configure Organization
    → Create Workspace → Invite Users → Create Company
        → Ready for First Engagement
```

**Target outcome:** Organization Owner or delegate reaches "Ready for First Engagement" within the onboarding window defined in OPS-05 (< 90 days; guided setup target < 1 business day for core structure).

### 10.2 Step 1 — User Registration

| Step | User Experience |
|------|-----------------|
| **Entry** | User receives invitation email OR accesses self-service signup (if enabled) |
| **Action** | Clicks invitation link or completes signup form |
| **Required** | Email, display name, secure password (or SSO authentication) |
| **Authentication** | Completes identity verification; MFA setup if policy requires |
| **Outcome** | Authenticated user account created in pending or active state |
| **First-time owner** | Self-service signup user becomes Organization Owner of new tenant |

**User sees:** Welcome screen explaining next steps toward organization setup.

### 10.3 Step 2 — Organization Creation (or Entry)

#### Path A — New Customer (Organization Creation)

| Step | User Experience |
|------|-----------------|
| **Actor** | Registering user becomes Organization Owner |
| **Action** | Completes organization setup wizard |
| **Required** | Legal name, display name, organization type, primary jurisdiction, default locale, time zone |
| **Optional** | Registration identifier, address, branding (if tier permits) |
| **Outcome** | Organization provisioned in Active or Provisioned status |
| **Guidance** | Wizard explains tenancy, security responsibilities, and subscription entitlements |

#### Path B — Invited User (Existing Organization)

| Step | User Experience |
|------|-----------------|
| **Actor** | User invited by Organization Owner or Workspace Administrator |
| **Action** | Accepts invitation, authenticates, lands in assigned workspace |
| **Outcome** | User active with assigned role — skips organization creation |
| **Guidance** | Role-specific welcome explaining permitted actions |

### 10.4 Step 3 — Organization Configuration

| Step | User Experience |
|------|-----------------|
| **Actor** | Organization Owner |
| **Actions** | Configure security policy (MFA), review module entitlements, set retention and export policies, optional branding |
| **Milestone** | Organization profile complete — status transitions to Active |
| **Guidance** | Checklist shows completion progress; incomplete security items flagged |

**User sees:** Organization dashboard with setup checklist and "Create Workspace" prompt.

### 10.5 Step 4 — Workspace Creation

| Step | User Experience |
|------|-----------------|
| **Actor** | Organization Owner (or delegated administrator) |
| **Action** | Creates first workspace — names office, selects type, assigns Workspace Administrator |
| **Required** | Workspace name, type, administrator assignment |
| **Recommended** | Select default methodology template set, default chart of accounts, compliance pack |
| **Outcome** | Active workspace ready for companies and users |
| **Guidance** | Explanation of workspace isolation — especially for firms planning client portals |

**User sees:** Workspace home with empty state: "Add your first company" and "Invite your team."

### 10.6 Step 5 — User Invitation

| Step | User Experience |
|------|-----------------|
| **Actor** | Organization Owner or Workspace Administrator |
| **Action** | Invites team members by email with role and workspace assignment |
| **Roles invited** | Typical first invites: Workspace Administrator, Audit Manager, Financial Controller |
| **Processing** | Invitees receive email, register/authenticate, accept role |
| **Outcome** | Team members active in workspace with appropriate permissions |
| **Guidance** | Separation of duties reminder — preparer and reviewer roles explained |

### 10.7 Step 6 — Company Creation

| Step | User Experience |
|------|-----------------|
| **Actor** | Workspace Administrator (or Organization Owner) |
| **Action** | Registers first legal entity — client company or own entity |
| **Required** | Legal name, jurisdiction, framework, currency, fiscal year end, industry |
| **Processing** | System applies templates, creates first financial period, confirms registration |
| **Outcome** | Active company ready for data import and engagement |
| **Guidance** | Prompt to import trial balance or create engagement |

**User sees:** Company profile page with next-step actions: "Import financial data" and "Create engagement."

### 10.8 Step 7 — Ready for First Engagement

| Milestone | Criteria |
|-----------|----------|
| **Structure complete** | Organization Active, Workspace Active, Company Active, team invited |
| **Optional data** | Trial balance imported and validated (recommended before audit engagement) |
| **Engagement readiness** | User with Engagement Partner or Audit Manager role can initiate engagement creation |

#### First Engagement Entry Points

| Customer Type | First Action |
|---------------|--------------|
| **Audit firm** | Create audit engagement for registered client company |
| **Accounting firm** | Import trial balance and begin IFRS reporting cycle |
| **Enterprise** | Import group entity data or create internal audit engagement |

**User sees:** Guided "Create your first engagement" or "Start reporting cycle" call-to-action with links to relevant workflows.

### 10.9 First-Time Journey Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Register /  │────►│ Organization │────►│  Configure   │
│   Accept     │     │   Created    │     │  Org Settings│
│  Invitation  │     │              │     │              │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                     ┌──────────────┐     ┌───────▼───────┐
                     │    Invite    │◄────│   Create      │
                     │    Users     │     │   Workspace   │
                     └──────┬───────┘     └───────────────┘
                            │
                     ┌──────▼───────┐     ┌──────────────┐
                     │   Create     │────►│    READY     │
                     │   Company    │     │  First Eng.  │
                     └──────────────┘     └──────────────┘
```

### 10.10 Onboarding Success Criteria

| ID | Criterion |
|----|-----------|
| **OJ-AC-01** | New Organization Owner completes guided setup without support intervention |
| **OJ-AC-02** | Setup checklist tracks progress through all mandatory steps |
| **OJ-AC-03** | User can reach company creation within first session |
| **OJ-AC-04** | Empty states provide clear next-action guidance at each level |
| **OJ-AC-05** | Invited users land in correct workspace with correct role |
| **OJ-AC-06** | "Ready for first engagement" milestone displayed when criteria met |

---

## PRD Review Notes — Part 2

Consistency review of MASTER_PRD Part 2 against PROJECT_BIBLE (Parts 1–15) and MASTER_PRD Part 1. No previous sections modified.

### Constitutional Alignment

| Area | Status | Notes |
|------|--------|-------|
| Multi-tenancy (Core Principle 15) | Aligned | Section 6 isolation principles match ORG-01 |
| Nothing deleted permanently (Principle 3) | Aligned | Sections 7.10, 9.11–9.13 — soft delete and archive only |
| Regulatory context explicit (Principle 11) | Aligned | Company framework declaration CO-01 in Section 9 |
| Configurability (Principle 10) | Aligned | Workspace methodology and compliance packs |
| Least privilege (Principle 26) | Aligned | Permission matrices in Sections 7–9 |

### MASTER_PRD Part 1 Alignment

| Area | Status |
|------|--------|
| Hierarchy Organization → Workspace → Company → Engagement | Section 6 matches Part 1 Section 2.5 |
| Primary capability #1 (org/workspace/entity admin) | Sections 7–9 deliver specification |
| Time-to-value OPS-05 | Section 10 onboarding journey |
| System Administrator stakeholder | Mapped to Workspace Administrator in Sections 7–8 |
| PRD-02 recommendation (module requirements) | Addressed for Organization, Workspace, Company modules |

### PROJECT_BIBLE Workflow Mapping

| Workflow | MASTER_PRD Section |
|----------|-------------------|
| Workflow 1: Company Creation | Section 9.3, 10.7 |
| Workflow 2: Organization & Workspace Setup | Sections 7, 8, 10.3–10.5 |
| Workflow 3: User Invitation | Section 10.6 |
| Workflow 4: Role Assignment | Section 10.6 (referenced; full spec in future part) |

### Business Rules Coverage

| Rule Group | Covered In |
|------------|------------|
| ORG-01 through ORG-05 | Section 7 |
| WS-01 through WS-04 | Section 8 |
| CO-01 through CO-05 | Section 9 |

### Terminology Consistency

| Term | Status |
|------|--------|
| Company (not "Entity" in product UI) | Consistent with Part 8 glossary |
| Organization Owner | Consistent |
| Workspace Administrator | Consistent |
| Client portal workspace | Consistent with Part 2 WS-03 |
| Engagement | Defined in Section 6; full module spec deferred to future PRD part |

### Editorial Recommendations

| ID | Recommendation |
|----|----------------|
| **PRD2-01** | Engagement Management module specification belongs in MASTER_PRD Part 3 — referenced in Section 6 only |
| **PRD2-02** | User Management and Role Assignment modules need full specification in Part 3 (Workflow 3–4) |
| **PRD2-03** | Financial Period management is implicit in Section 9 — explicit module spec needed in Part 3 |
| **PRD2-04** | Self-service signup vs. sales-provisioned onboarding is commercial decision — document in go-to-market playbook |
| **PRD2-05** | Add "Client" business object relationship to Company in Part 3 — PROJECT_BIBLE Part 8 distinguishes Client from Company |
| **PRD2-06** | Consolidation workflows for group companies referenced in Section 9 — detailed in future reporting PRD part |

### Review Conclusion

MASTER_PRD Part 2 is **consistent with PROJECT_BIBLE and Part 1**. It specifies the multi-tenant foundation and three enterprise administration modules without contradicting business rules, entity lifecycles, or permission philosophy. Engagement module detail appropriately deferred. PRD2-01 through PRD2-06 guide subsequent PRD parts.

---

## Document Control — Part 2

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.2.0 | 2026-06-30 | Chief Product Officer | Part 2 — Multi-Tenant Foundation & Enterprise Administration complete; PRD Review Notes Part 2 included |

---

*End of Part 2.*

---

## Part 3 — Identity, Users, Teams & Access Control

### Table of Contents — Part 3

11. [Identity & Access Management](#11-identity--access-management)
12. [User Management Module](#12-user-management-module)
13. [Team Management Module](#13-team-management-module)
14. [Roles & Permission Management](#14-roles--permission-management)
15. [User Journey — Invitation to First Login](#15-user-journey--invitation-to-first-login)

---

## 11. Identity & Access Management

Identity & Access Management (IAM) is the **control plane** of the platform. It determines who may enter the system, what they may see, what they may change, and what they may approve. IAM implements PROJECT_BIBLE Part 5 Section 24 and Core Principles 26–30.

### 11.1 Purpose

Establish **trustworthy identity verification** and **precise authorization** across a multi-tenant professional platform — ensuring every action is attributable, every access is explicitly granted, and every boundary (organization, workspace, engagement, client) is enforced.

### 11.2 Business Goals

| Goal | Description |
|------|-------------|
| **Identity assurance** | Verify every user is who they claim to be before granting access |
| **Least privilege** | Grant minimum permissions required for assigned professional work |
| **Tenant isolation** | Prevent cross-organization data access under all circumstances |
| **Professional accountability** | Bind every action to an individual identity — no shared accounts |
| **Enterprise readiness** | Support SSO, MFA, and enterprise identity provider integration |
| **Inspection defensibility** | Log all authentication, authorization, and access change events |
| **Separation of duties** | Enforce preparer-reviewer-approver boundaries structurally |

### 11.3 IAM Architecture (Business View)

```
┌────────────────────────────────────────────────────────────────┐
│                     IDENTITY LAYER                              │
│  Authentication · Email Verification · MFA · SSO · Recovery     │
├────────────────────────────────────────────────────────────────┤
│                   AUTHORIZATION LAYER                           │
│  RBAC · Scope (Org / Workspace / Engagement) · Capabilities     │
├────────────────────────────────────────────────────────────────┤
│                    ISOLATION LAYER                              │
│  Organization · Workspace · Company · Client Boundaries         │
├────────────────────────────────────────────────────────────────┤
│                      SESSION LAYER                              │
│  Session Management · Device Trust · Account Locking            │
├────────────────────────────────────────────────────────────────┤
│                      AUDIT LAYER                                │
│  Login Events · Grants · Denials · Elevations · Revocations     │
└────────────────────────────────────────────────────────────────┘
```

### 11.4 Authentication

Authentication verifies **who** is requesting access. It does not grant permissions — authorization follows separately.

| Aspect | Product Behavior |
|--------|------------------|
| **Credential types** | Email + password; enterprise SSO (SAML, OIDC) |
| **Strength requirements** | Password policy aligned with organization settings |
| **Individual accounts** | Shared credentials prohibited — one identity per person |
| **Organization scoping** | Login context bound to organization membership |
| **Failed attempts** | Account locking after configurable threshold |
| **Audit** | All login attempts (success and failure) logged |

#### User Experience

| Scenario | Experience |
|----------|------------|
| **First login** | User completes invitation or registration → verifies email → sets password (if applicable) → MFA setup if required → lands in assigned context |
| **Returning login** | User enters credentials or SSO → MFA challenge if required → session established → redirected to last workspace or dashboard |
| **SSO user** | Redirected to identity provider → returns authenticated → organization context resolved automatically |

### 11.5 Authorization

Authorization determines **what** an authenticated identity may do.

| Principle | Product Behavior |
|-----------|------------------|
| **Deny by default** | No access without explicit role and scope assignment |
| **Scope-bound** | Permissions limited to organization, workspace, engagement, or entity |
| **Capability-granular** | read, create, edit, review, approve, export, administer, configure — per module |
| **Real-time enforcement** | Permission changes effective on next protected action |
| **Separation of duties** | Conflicting roles blocked on same engagement without policy exception |
| **AI boundary** | AI retrieval limited to invoking user's permission scope (AI-04) |

### 11.6 User Identity

| Identity Element | Description |
|------------------|-------------|
| **Platform identity** | Unique user record within an Organization |
| **Email** | Primary identifier — unique per organization (USR-01) |
| **Display name** | Professional name shown in audit trail and collaboration |
| **Authentication binding** | Password hash or SSO subject identifier |
| **Organization membership** | User belongs to exactly one Organization |
| **Profile attributes** | Language, timezone, notification preferences — user-managed |
| **Attribution** | All professional actions permanently attributed to user identity |
| **Deactivation** | Identity preserved; access revoked — never hard-deleted (USR-04) |

### 11.7 Session Management

| Control | Product Behavior |
|---------|------------------|
| **Inactivity timeout** | Configurable per organization — conservative default |
| **Absolute session limit** | Maximum session duration regardless of activity |
| **Secure renewal** | Session extended without re-exposing credentials |
| **Logout** | Immediate session termination; all tokens invalidated |
| **Concurrent sessions** | Configurable limit per user |
| **Deactivation termination** | All active sessions invalidated when account deactivated |
| **Security event termination** | Password change, MFA reset, or lockout ends all sessions |

#### User Experience

Users receive warning before session expiry on sensitive workflows. Unsaved work prompts are presented where product supports draft preservation. Expired sessions redirect to login with return URL preserved.

### 11.8 Account Lifecycle

```
Invited → Pending Activation → Active → Deactivated → Archived
                                      ↓
                               (Reactivate to Active)
```

| State | Access | Description |
|-------|--------|-------------|
| **Invited** | None | Invitation sent; not yet accepted |
| **Pending Activation** | Limited | Accepted invite; email or MFA setup incomplete |
| **Active** | Per permissions | Fully operational account |
| **Deactivated** | None | Access revoked; historical attribution preserved |
| **Archived** | None | Long-term inactive record; administrative retention |

### 11.9 Password Recovery

| Step | Product Behavior |
|------|------------------|
| **Request** | User requests reset via verified email |
| **Token** | Time-limited, single-use recovery token issued |
| **Verification** | User completes identity verification step |
| **Reset** | New password set meeting policy requirements |
| **Notification** | Email confirmation of password change |
| **Session invalidation** | All existing sessions terminated on successful reset |
| **Audit** | Recovery request and completion logged |

SSO users are directed to their identity provider for credential recovery — platform does not manage SSO passwords.

### 11.10 Email Verification

| Requirement | Product Behavior |
|-------------|------------------|
| **Invitation acceptance** | Email verified through secure invitation link |
| **Self-registration** | Verification required before organization activation |
| **Email change** | New email verified before replacing primary |
| **Unverified block** | Unverified accounts cannot access professional modules |
| **Resend** | Verification email resend with rate limiting |
| **Expiry** | Verification links expire per security policy |

### 11.11 MFA Readiness

| Aspect | Product Behavior |
|--------|------------------|
| **Supported methods** | Authenticator app (TOTP), hardware security keys, SSO-enforced MFA |
| **Mandatory roles** | Organization Owner, Workspace Administrator, Engagement Partner (USR-05) |
| **Organization policy** | Organization Owner may extend MFA to additional roles |
| **Enrollment** | Guided setup during first login or upon policy assignment |
| **Step-up authentication** | Sensitive operations (export, approval, admin) may require fresh MFA challenge |
| **Recovery** | MFA recovery via secure, audited alternative verification |
| **SSO delegation** | MFA may be enforced by identity provider for SSO users |

### 11.12 Account Locking

| Trigger | Behavior |
|---------|----------|
| **Failed login threshold** | Account temporarily locked after configurable failed attempts |
| **Lockout duration** | Progressive or fixed duration per organization policy |
| **Administrator unlock** | Organization Owner or Workspace Administrator may unlock |
| **Automatic unlock** | Lock expires after duration |
| **Notification** | User notified of lockout via email |
| **Audit** | Lockout and unlock events logged |

### 11.13 Trusted Devices

| Trust Level | Description | Policy Options |
|-------------|-------------|----------------|
| **Trusted** | Device registered and verified by user; meets organization policy | Full access per role |
| **Registered** | Device known but not fully verified | Standard access |
| **Untrusted** | New or unrecognized device | MFA challenge required; sensitive operations restricted |

| Capability | Product Behavior |
|------------|------------------|
| **Device registration** | User may register device after successful MFA |
| **Device list** | User views and revokes registered devices |
| **Organization policy** | Require trusted device for export, approval, or administration |
| **Revocation** | User or administrator revokes device trust — re-verification required |

Device trust is **readiness architecture** — organizations may enforce progressively stricter policies (PROJECT_BIBLE, Part 5 Section 24.10).

### 11.14 Business Rules

| Rule | Description |
|------|-------------|
| **IAM-01** | Authentication required before any professional module access (USR-03) |
| **IAM-02** | One active account per email per organization (USR-01) |
| **IAM-03** | MFA mandatory for Organization Owner, Workspace Administrator, Engagement Partner (USR-05) |
| **IAM-04** | Deactivation over deletion — user records preserved (USR-04) |
| **IAM-05** | Permission changes logged immutably |
| **IAM-06** | Cross-organization access prohibited |
| **IAM-07** | Client users confined to client portal workspaces |
| **IAM-08** | Temporary elevation requires expiry and justification |
| **IAM-09** | SSO and password authentication mutually exclusive per user binding |
| **IAM-10** | Session terminated on deactivation, password change, or security event |

### 11.15 Permissions (IAM Administration)

| Capability | Organization Owner | Workspace Administrator | User (Self) |
|------------|-------------------|------------------------|-------------|
| Configure authentication policy | Yes | No | No |
| Configure MFA policy | Yes | No | No |
| Configure session policy | Yes | No | No |
| Configure SSO | Yes | No | No |
| Unlock user account | Yes | Assigned workspaces | No |
| View authentication audit log | Yes | No | Own events only |
| Manage own MFA | No | No | Yes |
| Manage own sessions/devices | No | No | Yes |
| Deactivate user | Yes | Assigned workspaces | No |

### 11.16 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **IAM-AC-01** | User cannot access professional modules without successful authentication |
| **IAM-AC-02** | Duplicate active email within organization rejected |
| **IAM-AC-03** | MFA enforced for mandated roles before module access |
| **IAM-AC-04** | Failed login attempts trigger lockout per policy |
| **IAM-AC-05** | Password recovery invalidates all existing sessions |
| **IAM-AC-06** | Email verification required before full account activation |
| **IAM-AC-07** | Permission denial logged with user, resource, and timestamp |
| **IAM-AC-08** | Deactivated user cannot authenticate; sessions terminated |
| **IAM-AC-09** | SSO users authenticate via identity provider without platform password |
| **IAM-AC-10** | User can view and revoke trusted devices |
| **IAM-AC-11** | Cross-organization login attempt denied |
| **IAM-AC-12** | Step-up MFA required for configured sensitive operations |

---

## 12. User Management Module

The User Management module governs **individual professional identities** within an Organization — invitation, profile, preferences, status, and lifecycle.

*Constitutional basis: PROJECT_BIBLE Part 3 Workflows 3–4; Part 8 User entity; Business Rules USR-01 through USR-05.*

### 12.1 Purpose

Enable organizations to **provision, manage, and deactivate** user accounts with correct role and scope assignments — maintaining identity integrity and audit attribution across the professional workforce.

### 12.2 Business Goals

| Goal | Description |
|------|-------------|
| **Controlled provisioning** | Only authorized administrators invite users |
| **Clean identity** | One account per person per organization |
| **Preference personalization** | Users control locale, timezone, and notifications |
| **Lifecycle governance** | Deactivate departing staff without losing audit history |
| **Client separation** | Client users provisioned only in client portal contexts |
| **Rapid onboarding** | Invited users reach productive access quickly |

### 12.3 User Invitation

| Attribute | Description |
|-----------|-------------|
| **Who may invite** | Organization Owner; Workspace Administrator (within assigned workspaces) |
| **Required inputs** | Email, display name, target workspace(s), proposed role(s) |
| **Optional inputs** | Engagement pre-assignment, invitation message, expiry override |
| **Processing** | Validate email uniqueness → generate secure token → send notification → await acceptance → audit log |
| **Expiry** | Configurable period; expired invitations may be resent |
| **Client users** | May only be invited to client portal workspaces (IAM-07) |
| **Output** | Invitation record in Invited status |

### 12.4 User Creation

| Path | Description |
|------|-------------|
| **Invitation acceptance** | Primary path — user created upon invitation acceptance |
| **Self-registration** | Organization Owner path during new tenant setup |
| **SSO JIT provisioning** | User created on first SSO login if pre-provisioned by policy (future enterprise tier) |

Direct user creation without invitation is **restricted to Organization Owner** and requires email verification.

### 12.5 Profile Management

| Profile Element | Editable By | Description |
|-----------------|-------------|-------------|
| **Display name** | User; Administrator | Professional name |
| **Email** | Administrator (change); User (request) | Primary identifier — change requires verification |
| **Job title** | User | Optional professional title |
| **Phone** | User | Optional contact number |
| **Professional registration** | User | Optional — CPA, ACCA, etc. |
| **Organization-visible ID** | Administrator | Optional employee or member number |

### 12.6 Profile Picture

| Aspect | Product Behavior |
|--------|------------------|
| **Upload** | User may upload profile image |
| **Formats** | Standard image formats; size limit enforced |
| **Default** | Initials avatar when no image uploaded |
| **Moderation** | Organization may disable custom images |
| **Display** | Shown in collaboration, review notes, audit trail attribution |
| **Privacy** | Image visible to organization members only — not public |

### 12.7 Language Preference

| Aspect | Product Behavior |
|--------|------------------|
| **Supported locales** | Azerbaijani (default), English, Russian, Turkish |
| **User override** | User selects preferred UI language |
| **Hierarchy** | User preference → Workspace default → Organization default |
| **Persistence** | Applied on login across sessions |
| **Scope** | Platform shell UI; content may follow entity locale |

### 12.8 Timezone

| Aspect | Product Behavior |
|--------|------------------|
| **User setting** | User selects timezone for display of dates and times |
| **Default** | Organization timezone at account creation |
| **Application** | Notifications, deadlines, audit trail display |
| **Reporting** | Financial dates follow entity/period rules — not user timezone |

### 12.9 Notification Preferences

| Category | User Configurable |
|----------|-------------------|
| **Review notes assigned** | Yes — email, in-app |
| **Approval requests** | Yes |
| **Engagement status changes** | Yes |
| **Invitation and access** | Required — cannot disable security notifications |
| **Digest frequency** | Immediate, daily digest, weekly digest |
| **Channel** | In-app (always); email (configurable) |

Organization may enforce minimum notification settings for compliance roles.

### 12.10 Account Status

| Status | Description |
|--------|-------------|
| **Invited** | Invitation pending |
| **Pending Activation** | Accepted; setup incomplete |
| **Active** | Full access per permissions |
| **Deactivated** | Access revoked |
| **Archived** | Long-term inactive |

Status displayed to administrators; users see Active or setup prompts only.

### 12.11 Deactivate

| Aspect | Product Behavior |
|--------|------------------|
| **Who may deactivate** | Organization Owner; Workspace Administrator (workspace-scoped users) |
| **Effect** | Immediate access revocation; sessions terminated |
| **Attribution** | Historical actions remain attributed to user |
| **Reassignment prompt** | Administrator prompted to reassign open review items and engagements |
| **Client users** | Same deactivation rules apply |
| **Audit** | Deactivation logged with actor and reason |

### 12.12 Reactivate

| Aspect | Product Behavior |
|--------|------------------|
| **Who may reactivate** | Organization Owner; Workspace Administrator |
| **From Deactivated** | Account restored to Active; roles and scopes reinstated unless changed |
| **Re-authentication** | User must authenticate and complete MFA on reactivation |
| **Invitation not required** | Existing identity reactivated — not new invitation |
| **Audit** | Reactivation logged with reason |

### 12.13 Archive

| Aspect | Product Behavior |
|--------|------------------|
| **Purpose** | Long-term administrative state for departed users |
| **Trigger** | Administrator archives deactivated user after reassignment complete |
| **Effect** | User hidden from active user lists; historical record preserved |
| **Reversibility** | Reactivate path available with Organization Owner authorization |

### 12.14 Delete Policy

| Rule | Description |
|------|-------------|
| **No hard delete** | Users with platform action history cannot be permanently deleted (USR-04, Core Principle 3) |
| **Deactivation is removal** | Customer "removal" means deactivation |
| **Archive is administrative** | Archive tidies admin views — does not destroy data |
| **GDPR requests** | Personal data minimization handled per legal process — professional attribution may require retention |
| **Invitation cancellation** | Unaccepted invitations may be cancelled/deleted |

### 12.15 Business Validations

| Validation | Rule |
|------------|------|
| **USR-V01** | Email required and valid format |
| **USR-V02** | Email unique among active users in organization |
| **USR-V03** | Display name required |
| **USR-V04** | At least one workspace and role assigned before Active status |
| **USR-V05** | Client user role only in client portal workspace |
| **USR-V06** | Cannot deactivate sole Organization Owner without succession |
| **USR-V07** | Engagement Partner deactivation requires engagement reassignment acknowledgment |
| **USR-V08** | Email change requires verification of new address |
| **USR-V09** | Invitation resend rate-limited |

### 12.16 Permissions

| Capability | Organization Owner | Workspace Administrator | User (Self) |
|------------|-------------------|------------------------|-------------|
| Invite user | Yes | Assigned workspaces | No |
| Edit user profile (admin fields) | Yes | Assigned workspaces | No |
| Edit own profile | Yes | Yes | Yes |
| Assign roles | Yes | Workspace-scoped | No |
| Deactivate user | Yes | Assigned workspaces | No |
| Reactivate user | Yes | Delegated | No |
| Archive user | Yes | No | No |
| View user list | Yes | Assigned workspaces | No |
| Cancel invitation | Yes | Assigned workspaces | No |

### 12.17 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **USR-AC-01** | Administrator can invite user with workspace and role assignment |
| **USR-AC-02** | Duplicate active email rejected |
| **USR-AC-03** | Invited user can accept and complete activation |
| **USR-AC-04** | User can set language, timezone, and notification preferences |
| **USR-AC-05** | Deactivated user cannot log in; sessions terminated |
| **USR-AC-06** | Historical actions remain attributed after deactivation |
| **USR-AC-07** | Client user invitation to non-client workspace rejected |
| **USR-AC-08** | Cannot deactivate sole Organization Owner |
| **USR-AC-09** | Expired invitation can be resent |
| **USR-AC-10** | Profile picture upload and removal works with default fallback |

---

## 13. Team Management Module

The Team Management module governs **groups of users assigned to shared professional work** — primarily engagement teams.

*Constitutional basis: PROJECT_BIBLE Part 8 Team entity; Business Rule ENG-02.*

### 13.1 Purpose

Structure **collective professional responsibility** for engagement execution — defining who works on an engagement, in what capacity, and under whose leadership.

### 13.2 Business Goals

| Goal | Description |
|------|-------------|
| **Clear accountability** | Engagement Partner and Audit Manager always assigned |
| **Collaboration** | Team members share engagement context with appropriate access |
| **Separation of duties** | Team composition supports preparer-reviewer separation |
| **Independence** | Reviewer path separate from engagement team where required |
| **Audit trail** | Team changes recorded throughout engagement lifecycle |

### 13.3 Team Creation

| Attribute | Description |
|-----------|-------------|
| **Trigger** | Engagement setup or acceptance workflow |
| **Automatic creation** | Team created when engagement is initiated |
| **Naming** | Team named from engagement (e.g., "Client A — FY2026 Audit") |
| **Initial members** | Engagement Partner and Audit Manager required at creation (ENG-02) |
| **Who may create** | Audit Manager; Workspace Administrator (administrative setup) |

Teams are **engagement-scoped** — not free-floating groups. Future product versions may support standing teams (PRD3 recommendation).

### 13.4 Team Structure

```
Engagement Team
├── Engagement Partner (accountability)
├── Audit Manager (operations lead)
├── Audit Senior(s)
├── Auditor(s)
└── Reviewer (independent path — parallel, not subordinate)
```

| Role on Team | Team Function |
|--------------|---------------|
| **Engagement Partner** | Ultimate professional responsibility; final sign-off authority |
| **Audit Manager** | Day-to-day leadership; review and planning |
| **Audit Senior** | Fieldwork supervision; preliminary review |
| **Auditor** | Procedure execution; working paper preparation |
| **Reviewer** | Independent quality review — separate access path |
| **Financial Controller** | Client-side — limited team visibility where client portal enabled |
| **Client User** | Document provision only — no team leadership |

### 13.5 Team Ownership

| Role | Ownership |
|------|-----------|
| **Engagement Partner** | Professional accountability for team output |
| **Audit Manager** | Team composition and day-to-day assignment |
| **Workspace Administrator** | Administrative override for team provisioning issues |

### 13.6 Team Membership

| Aspect | Product Behavior |
|--------|------------------|
| **Adding members** | Audit Manager proposes; recorded in audit log |
| **Removing members** | Audit Manager removes; open assignments flagged for reassignment |
| **Role on team** | Distinct from platform role — user holds engagement role on team |
| **Multiple engagements** | User may be on multiple teams simultaneously |
| **Access effect** | Team membership grants engagement-scoped access |
| **Minimum composition** | Partner and Manager required throughout active engagement |

### 13.7 Assignments

| Assignment Type | Description |
|-----------------|-------------|
| **Engagement-wide** | Full engagement file access per role |
| **Section assignment** | Specific financial statement area or working paper section |
| **Procedure assignment** | Individual audit program procedures assigned to Auditor |
| **Review assignment** | Reviewer assigned to engagement or section |

Assignments **narrow** access within engagement — they do not expand beyond engagement scope.

### 13.8 Leadership

| Leadership Function | Responsible Role |
|---------------------|------------------|
| **Professional accountability** | Engagement Partner |
| **Operational leadership** | Audit Manager |
| **Fieldwork supervision** | Audit Senior |
| **Quality review** | Reviewer (independent) |
| **Client coordination** | Audit Manager (primary); Partner (escalation) |

Leadership changes require audit log entry and may trigger workflow notifications.

### 13.9 Team Lifecycle

```
Formed → Active → Modified → Dissolved
```

| State | Description |
|-------|-------------|
| **Formed** | Team created at engagement initiation with required leadership |
| **Active** | Members performing fieldwork and review |
| **Modified** | Members added, removed, or roles changed during engagement |
| **Dissolved** | Team dissolved at engagement closure — historical record retained |

### 13.10 Permissions

| Capability | Engagement Partner | Audit Manager | Workspace Administrator |
|------------|-------------------|---------------|------------------------|
| Create team (via engagement) | Authorize | Initiate | Admin setup |
| Add team member | Yes | Yes | No |
| Remove team member | Yes | Yes | No |
| Assign procedures | Yes | Yes | No |
| Change Engagement Partner | Yes (with admin notification) | No | Yes (exceptional) |
| View team | Yes | Yes | Read (admin) |

### 13.11 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **TEAM-AC-01** | Engagement cannot proceed without Partner and Manager assigned |
| **TEAM-AC-02** | Adding member grants engagement-scoped access per role |
| **TEAM-AC-03** | Removing member revokes engagement access; flags open assignments |
| **TEAM-AC-04** | Reviewer on team follows independent access path |
| **TEAM-AC-05** | Team changes recorded in audit log |
| **TEAM-AC-06** | Procedure assignment visible to assigned Auditor |
| **TEAM-AC-07** | Team dissolved on engagement closure with history retained |

---

## 14. Roles & Permission Management

Roles & Permission Management implements the platform **RBAC model** — binding capabilities to users within organizational scopes.

*Constitutional basis: PROJECT_BIBLE Part 2 Section 10; Part 5 Section 24; Business Rules USR-02, APR-01 through APR-02.*

### 14.1 Purpose

Define, assign, and govern **who may do what, where** — across organization, workspace, and engagement boundaries — with separation of duties and full auditability.

### 14.2 Permission Model

```
Effective Permission = Role × Capability × Scope
```

| Element | Description |
|---------|-------------|
| **Role** | Named professional or administrative function |
| **Capability** | Action on module or object type |
| **Scope** | Organization, workspace, engagement, or entity boundary |

#### Capabilities

| Capability | Description |
|------------|-------------|
| **read** | View data and artifacts |
| **create** | Create new records |
| **edit** | Modify existing records |
| **review** | Record review notes; perform review actions |
| **approve** | Authorize artifacts through approval chain |
| **export** | Export data or reports |
| **administer** | Manage users, settings, configuration within scope |
| **configure** | Modify methodology, templates, business rules |

### 14.3 System Roles

Platform-defined roles for **vendor operations** — not assignable by customers.

| Role | Scope | Purpose |
|------|-------|---------|
| **Super Administrator** | Platform | Tenant provisioning, platform operations, emergency actions |

Super Administrator does not participate in professional judgments (PROJECT_BIBLE Part 2 Section 10).

### 14.4 Organization Roles

Assignable at **organization scope** — ceiling for all workspace and engagement permissions.

| Role | Primary Scope | Summary |
|------|---------------|---------|
| **Organization Owner** | Organization | Subscription, policies, full administration |
| **Read Only User** | Organization (limited) | Observe granted modules — no write |

Organization Owner has full access within tenant unless self-restricted from engagements for independence.

### 14.5 Workspace Roles

Assignable at **workspace scope** — operational professional and administrative roles.

| Role | Primary Function |
|------|------------------|
| **Workspace Administrator** | Workspace configuration, user provisioning, template publication |
| **Engagement Partner** | Engagement accountability and sign-off |
| **Audit Manager** | Engagement planning and supervision |
| **Audit Senior** | Fieldwork supervision and preliminary review |
| **Auditor** | Procedure execution |
| **Reviewer** | Independent quality review |
| **Financial Controller** | Entity financial data and reporting |
| **Finance Director** | Reporting review and approval |
| **CFO** | Executive approval |
| **Client User** | Client portal access |
| **Read Only User** | Observation only |

A user may hold **different workspace roles in different workspaces**.

### 14.6 Engagement Roles

Assignable at **engagement scope** — narrow access to specific engagement.

| Engagement Role | Access |
|-------------------|--------|
| **Engagement Partner** | Full engagement |
| **Audit Manager** | Full engagement operations |
| **Audit Senior** | Assigned sections + review |
| **Auditor** | Assigned procedures and papers |
| **Reviewer** | Read + review documentation only |
| **Financial Controller** | Linked entity financial data (read/write per grant) |
| **Client User** | Shared documents and requests only |

Engagement role **cannot exceed** workspace role capabilities.

### 14.7 Custom Roles (Future)

| Aspect | Planned Behavior |
|--------|------------------|
| **Availability** | Organization Owner defines custom roles from capability catalog |
| **Boundaries** | Cannot exceed platform-defined capability set |
| **Naming** | Firm-specific role names (e.g., "Manager — FS") |
| **Inheritance** | Custom roles map to base capability bundles |
| **Audit** | Custom role changes versioned and logged |

Custom roles are **future capability** — MVP uses canonical role catalog only.

### 14.8 Permission Inheritance

```
Organization (ceiling)
       ↓ narrows
   Workspace (assignment)
       ↓ narrows
   Engagement (team)
       ↓ narrows
   Entity / Section (assignment)
```

| Rule | Description |
|------|-------------|
| **Ceiling** | Organization role sets maximum capabilities |
| **Narrow only** | Lower scopes cannot widen access |
| **Explicit grant** | Workspace and engagement access require explicit assignment |
| **No automatic write** | Read at organization does not imply write at engagement |
| **Client isolation** | Client role never inherits firm internal access |

### 14.9 Permission Conflicts

| Conflict Type | Resolution |
|---------------|------------|
| **Preparer + sole reviewer** | Blocked on same engagement (WP-01) — requires policy exception with approval |
| **Engagement team + Reviewer** | Reviewer path independent; conflicting write access blocked |
| **Client + firm role** | Mutually exclusive on same workspace |
| **Conflicting approvals** | User cannot approve own preparation (APR-02) |
| **Role elevation overlap** | Temporary elevation cannot duplicate permanent conflicting role without exception |

Conflicts surface at **assignment time** with clear error — not at runtime failure.

### 14.10 Role Assignment

| Attribute | Description |
|-----------|-------------|
| **Who may assign** | Organization Owner; Workspace Administrator; Audit Manager (engagement only) |
| **Inputs** | User, role, scope, effective date, optional expiry |
| **Validation** | Separation of duties check; scope authority check |
| **Processing** | Apply binding → notify user → audit log → effective next session |
| **Revocation** | Immediate effect; sessions re-evaluated |

Maps to PROJECT_BIBLE Workflow 4.

### 14.11 Delegation

| Delegation Type | Product Behavior |
|-----------------|------------------|
| **Administrator delegation** | Organization Owner delegates workspace admin rights |
| **Approval delegation** | Not supported — approvals are personal accountability acts |
| **Acting role** | Temporary role assignment with expiry (see Temporary Access) |
| **Partner absence** | Another Partner assigned — not automatic delegation |

Professional approvals **cannot be delegated** without explicit role assignment.

### 14.12 Temporary Access

| Aspect | Product Behavior |
|--------|------------------|
| **Purpose** | Time-bound elevation for coverage, inspection, or emergency |
| **Required fields** | User, role/scope, justification, expiry date/time |
| **Maximum duration** | Configurable per organization — default limited |
| **Approval** | Organization Owner or Workspace Administrator approval required |
| **Notification** | User and security contact notified |
| **Expiry** | Automatic revocation; sessions re-evaluated |
| **Audit** | Grant, usage, and revocation logged |

### 14.13 Approval Rules

| Rule | Description |
|------|-------------|
| **APR-01** | Approval chains non-bypassable |
| **APR-02** | Self-approval prohibited |
| **APR-03** | Material items escalate per configurable thresholds |
| **Role-to-approval mapping** | Engagement Partner — opinion; CFO — statements; etc. |
| **Separation** | Preparer, reviewer, approver distinct on same artifact |

### 14.14 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **RBAC-AC-01** | User without role assignment cannot access scoped resources |
| **RBAC-AC-02** | Workspace access requires explicit workspace assignment |
| **RBAC-AC-03** | Engagement access requires team membership or explicit grant |
| **RBAC-AC-04** | Preparer-reviewer conflict blocked on same engagement |
| **RBAC-AC-05** | Permission change logged with actor, target, role, scope |
| **RBAC-AC-06** | Temporary access expires automatically |
| **RBAC-AC-07** | Client user cannot access firm internal workspaces |
| **RBAC-AC-08** | Organization Owner can assign all canonical roles |
| **RBAC-AC-09** | Denied access attempt logged |
| **RBAC-AC-10** | Engagement-scoped auditor cannot access unassigned engagement |

---

## 15. User Journey — Invitation to First Login

End-to-end experience for a **new employee** joining an existing organization — from invitation through first successful login and engagement access.

*Maps to PROJECT_BIBLE Workflows 3–4 and MASTER_PRD Part 2 Section 10.*

### 15.1 Journey Overview

```
Admin Invites → Employee Receives Email → Account Activation
    → Join Organization → Join Workspace → Join Engagement
        → First Successful Login → Landing in Work Context
```

### 15.2 Step 1 — Inviting a New Employee

| Perspective | Administrator |
|-------------|---------------|
| **Who** | Organization Owner or Workspace Administrator |
| **Where** | Organization or Workspace administration → Users → Invite |
| **Actions** | Enter employee email and display name; select workspace(s); assign role (e.g., Auditor); optionally pre-assign engagement |
| **Confirmation** | System confirms invitation sent; pending invitation visible in user list |
| **Guidance** | Separation of duties tip if role conflicts with existing assignments |

**Administrator sees:** Pending invitation with expiry date and resend option.

### 15.3 Step 2 — Employee Receives Invitation

| Perspective | Invited Employee |
|-------------|------------------|
| **Channel** | Email to provided address |
| **Content** | Organization name, inviter name, role, workspace, secure acceptance link, expiry date |
| **Action** | Clicks acceptance link |
| **Failure** | Expired link shows message with contact administrator guidance |

**Employee sees:** Branded invitation email with clear call-to-action.

### 15.4 Step 3 — Account Activation

| Perspective | Invited Employee |
|-------------|------------------|
| **First screen** | Welcome — organization name and assigned role displayed |
| **New user** | Creates password meeting policy OR redirected to SSO |
| **Email verification** | Confirmed through invitation link or additional verification step |
| **MFA setup** | If role requires MFA — guided enrollment (authenticator app) |
| **Profile** | Prompted to confirm display name; optional profile picture, timezone, language |
| **Terms** | Accept platform terms and organization policies |
| **Outcome** | Account transitions to Active |

**Employee sees:** Setup wizard with progress indicator — cannot skip MFA if mandated.

### 15.5 Step 4 — Joining an Organization

| Perspective | Invited Employee |
|-------------|------------------|
| **Automatic** | Organization membership established through invitation |
| **Context** | User now belongs to organization with assigned organization-level scope (if any) |
| **Visibility** | Organization name in platform header; subscription tier not visible to standard users |
| **Policies** | Organization security policies (session timeout, MFA) apply immediately |

**Employee sees:** Organization dashboard or workspace redirect — not organization admin screens.

### 15.6 Step 5 — Joining a Workspace

| Perspective | Invited Employee |
|-------------|------------------|
| **Automatic** | Workspace assignment from invitation applied |
| **First entry** | User lands in assigned workspace context |
| **Multiple workspaces** | Workspace switcher shown if assigned to more than one |
| **Empty state** | If no engagement yet — guidance to await assignment or contact manager |
| **Modules visible** | Only modules enabled for workspace and entitled by subscription |

**Employee sees:** Workspace home with role-appropriate navigation (e.g., Auditor sees Engagements, not Administration).

### 15.7 Step 6 — Joining an Engagement

| Perspective | Invited Employee |
|-------------|------------------|
| **Path A — Pre-assigned** | Engagement visible immediately in engagement list |
| **Path B — Manager assignment** | Audit Manager adds employee to engagement team → notification sent |
| **Access granted** | Engagement file, assigned procedures, and linked financial data per role |
| **Team visibility** | Employee sees team roster with leadership identified |
| **Onboarding** | Engagement-specific checklist — planning status, assigned procedures, first working paper |

**Employee sees:** Engagement dashboard with "My assignments" and procedure list.

### 15.8 Step 7 — First Successful Login

| Perspective | Invited Employee (returning or post-activation) |
|-------------|-----------------------------------------------|
| **Entry** | Login page → credentials or SSO → MFA if required |
| **Authentication** | Identity verified; session established |
| **Authorization** | Permissions resolved — organization, workspace, engagement |
| **Landing** | Redirect to last workspace or default dashboard |
| **First-time banner** | Brief guided tour of key navigation (dismissible) |
| **Success state** | User performs first professional action — e.g., opens assigned working paper |

**Employee sees:** Productive work context within 60 seconds of authentication — engagement or assignment list ready.

### 15.9 Journey Diagram

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Admin sends │───►│  Employee   │───►│  Activation │
│ invitation  │    │ opens email │    │   wizard    │
└─────────────┘    └─────────────┘    └──────┬──────┘
                                             │
┌─────────────┐    ┌─────────────┐    ┌──────▼──────┐
│   First     │◄───│   Join      │◄───│    Join     │
│   login     │    │ engagement  │    │ org/workspace│
└─────────────┘    └─────────────┘    └─────────────┘
```

### 15.10 Journey Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **UJ-AC-01** | Invited user completes activation without administrator intervention |
| **UJ-AC-02** | MFA mandated roles cannot skip enrollment |
| **UJ-AC-03** | User lands in correct workspace after activation |
| **UJ-AC-04** | Pre-assigned engagement visible on first login |
| **UJ-AC-05** | Manager-added team member receives notification and access within one session |
| **UJ-AC-06** | First login audit trail records activation, MFA setup, and initial access |

---

## PRD Review Notes — Part 3

Consistency review of MASTER_PRD Part 3 against PROJECT_BIBLE (Parts 1–15) and MASTER_PRD Parts 1–2. No previous sections modified.

### Constitutional Alignment

| Area | Status | Notes |
|------|--------|-------|
| IAM philosophy (Bible Part 5 §24) | Aligned | Section 11 implements identity, authz, session, MFA, device trust |
| Permission philosophy (Bible Part 2 §10) | Aligned | Section 14 RBAC model and cascade |
| Business rules USR-01–05 | Aligned | Sections 11–12 |
| Business rules ENG-02 | Aligned | Section 13 team leadership requirements |
| Zero Trust / least privilege | Aligned | Deny-by-default throughout |
| Core Principle 3 (no delete) | Aligned | Section 12.14 delete policy |

### MASTER_PRD Parts 1–2 Alignment

| Area | Status |
|------|--------|
| PRD2-02 (User Management in Part 3) | Addressed — Section 12 |
| PRD2-02 (Role Assignment in Part 3) | Addressed — Sections 14, 15 |
| Multi-tenant hierarchy | Sections 11, 14 reference org/workspace/engagement cascade |
| System Administrator stakeholder | Mapped to Workspace Administrator + Organization Owner |
| Time-to-value onboarding | Section 15 complements Part 2 Section 10 |

### Workflow Mapping

| Workflow | MASTER_PRD Section |
|----------|-------------------|
| Workflow 3: User Invitation | Sections 12.3, 15.2–15.4 |
| Workflow 4: Role Assignment | Sections 14.10, 15.5–15.7 |

### Terminology Consistency

| Term | Status |
|------|--------|
| Organization Owner, Workspace Administrator | Consistent |
| Canonical roles from Bible Part 2 §10 | All listed in Section 14 |
| Finance Director | Included — present in workflows, was implicit in Part 2 |
| Client User | Consistent with IAM-07 and WS-03 |
| Team vs. Role | Team = engagement group; Role = RBAC — distinction clear |
| Deactivate vs. Delete | Consistent with USR-04 |

### Business Rules Coverage

| Rule Group | Covered In |
|------------|------------|
| USR-01 through USR-05 | Sections 11–12 |
| ENG-02 | Section 13 |
| WP-01 (preparer-reviewer) | Section 14.9 |
| APR-01, APR-02 | Section 14.13 |
| AI-04 (AI scope) | Section 11.5 |
| IAM cascade (Bible §24.14) | Section 14.8 |

### Editorial Recommendations

| ID | Recommendation |
|----|----------------|
| **PRD3-01** | Engagement Management module (PRD2-01) still needed in Part 4 — team module assumes engagement exists |
| **PRD3-02** | Finance Director role capabilities should be detailed in reporting PRD part |
| **PRD3-03** | SSO configuration UI specification belongs in enterprise administration part |
| **PRD3-04** | Custom roles marked future — define capability catalog in Part 4 when custom roles scheduled |
| **PRD3-05** | Standing teams (non-engagement) — defer or document as future in team module |
| **PRD3-06** | Client business object (PRD2-05) — link Client User to Client record in Part 4 |
| **PRD3-07** | ABAC readiness noted in Bible §24.5 — reference when device trust policies expand |

### Review Conclusion

MASTER_PRD Part 3 is **consistent with PROJECT_BIBLE and Parts 1–2**. It specifies IAM, user management, team management, and RBAC as executable product requirements without contradicting permission philosophy, user lifecycle rules, or multi-tenant isolation. PRD3-01 through PRD3-07 guide subsequent PRD parts.

---

## Document Control — Part 3

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.3.0 | 2026-06-30 | Chief Product Officer | Part 3 — Identity, Users, Teams & Access Control complete; PRD Review Notes Part 3 included |

---

*End of Part 3.*

---

## Part 4 — Engagement, Client & Financial Period Management

### Table of Contents — Part 4

16. [Engagement Management Module](#16-engagement-management-module)
17. [Client Management Module](#17-client-management-module)
18. [Financial Period Management](#18-financial-period-management)
19. [Engagement Dashboard](#19-engagement-dashboard)
20. [User Journey — Client to Trial Balance Readiness](#20-user-journey--client-to-trial-balance-readiness)

---

## 16. Engagement Management Module

The Engagement Management module is the **primary container for assurance work** — governing the professional assignment from setup through archive. It binds client relationship, legal entity, financial period, team, methodology, and the complete audit file.

*Constitutional basis: PROJECT_BIBLE Part 8 Audit Engagement entity; Part 15 Sections 78–81; Part 3 Workflows 13–20; Business Rules ENG-01 through ENG-05.*

### 16.1 Purpose

Enable audit firms and assurance teams to **create, configure, govern, and close** professional engagements with correct regulatory context, team accountability, materiality documentation, and lifecycle controls — producing inspection-ready engagement files worthy of Big4-level quality standards.

### 16.2 Business Goals

| Goal | Description |
|------|-------------|
| **Professional accountability** | Engagement Partner and Audit Manager assigned from inception (ENG-02) |
| **Regulatory clarity** | Audit framework, accounting framework, and scope documented at setup (ENG-05) |
| **Acceptance discipline** | No fieldwork before engagement acceptance (ENG-01) |
| **Planning gate** | Fieldwork blocked until approved audit plan (ENG-03) |
| **Integrity at closure** | Closed engagements read-only; reopen requires partner authorization (ENG-04) |
| **Portfolio visibility** | Firm leadership views engagement status across workspace |
| **Traceability** | Engagement links company, period, team, and all downstream artifacts |
| **Client confidentiality** | Engagements scoped to workspace with engagement-level access |

### 16.3 Engagement Creation

| Attribute | Description |
|-----------|-------------|
| **Who may create** | Audit Manager; Workspace Administrator (administrative); Engagement Partner (authorize) |
| **Prerequisites** | Active workspace; active client; active company assigned to client; open or available financial period |
| **Trigger** | New audit assignment; rolling forward prior engagement; internal assurance initiation |
| **Processing** | Select client → company → period → type → frameworks → team → materiality → generate engagement record → audit log |
| **Output** | Engagement in Draft or Pending Acceptance status with unique engagement number |

### 16.4 Engagement Numbering Strategy

Engagement numbers must be **unique, human-readable, and firm-traceable** across the organization portfolio.

| Component | Description | Example |
|-----------|-------------|---------|
| **Workspace prefix** | Optional short code for office or practice | `BAK` |
| **Client code** | Firm-assigned client identifier | `0142` |
| **Period year** | Financial period end year | `2026` |
| **Sequence** | Auto-increment per client per year | `01` |
| **Full number** | Concatenated per firm configuration | `BAK-0142-2026-01` |

| Numbering Rule | Requirement |
|----------------|-------------|
| **Uniqueness** | Engagement number unique within Organization |
| **Immutability** | Number assigned at creation — not changed after acceptance |
| **Configuration** | Organization or workspace may configure format template |
| **Display** | Number shown on dashboard, exports, and audit trail |
| **Search** | Number is primary search key for engagement discovery |

### 16.5 Client Selection

| Aspect | Product Behavior |
|--------|------------------|
| **Selection** | User selects from active clients in workspace |
| **Filter** | Search by client name, client code, industry |
| **Validation** | Client must be Active status |
| **New client** | Link to create client if not exists — returns to engagement creation |
| **Relationship** | Engagement records client relationship; company selected in next step |
| **History** | Prior engagements for client visible during selection |

Client represents the **commercial relationship**; company represents the **legal reporting entity** (Section 17).

### 16.6 Company Assignment

| Aspect | Product Behavior |
|--------|------------------|
| **Selection** | Companies linked to selected client displayed |
| **Filter** | Only companies associated with client and active in workspace |
| **Group entities** | Subsidiary selection supported; parent visible for context |
| **Validation** | Company must be Active; reporting framework declared (CO-01) |
| **Inheritance** | Company industry, currency, and framework pre-populate engagement defaults |
| **Single assignment** | One primary company per engagement — group audits may reference related entities (future consolidation scope) |

### 16.7 Financial Period Selection

| Aspect | Product Behavior |
|--------|------------------|
| **Selection** | Open or In Close periods for assigned company offered |
| **Creation** | User may create new period if none exists (Section 18) |
| **Validation** | Period must belong to selected company (CO-05) |
| **Duplicate check** | Warning if engagement already exists for same company and period |
| **Comparative** | System prompts to link comparative prior period |
| **Locked periods** | Locked periods not selectable for new engagements without override |

### 16.8 Engagement Type

| Type | Description | Typical Use |
|------|-------------|-------------|
| **External statutory audit** | Independent audit of financial statements | Annual statutory audit |
| **Group audit** | Audit of consolidated financial statements | Parent entity group audit |
| **Review engagement** | Limited assurance review | Interim review |
| **Agreed-upon procedures** | Specific procedures without opinion | AUP reports |
| **Internal audit** | In-house assurance engagement | ICFR, operational audit |
| **Special purpose audit** | Audit of specific accounts or elements | Component audit |
| **Reporting only** | IFRS reporting cycle without external opinion | Accounting firm reporting assignment |

Engagement type drives **methodology template**, deliverable set, and opinion module availability.

### 16.9 Audit Framework

| Framework | Product Behavior |
|-----------|------------------|
| **ISA** | Default for external statutory audit — ISA-aligned programs and documentation |
| **Local auditing standards** | Configurable via compliance pack where jurisdiction requires |
| **Internal audit standards** | IIAS/IPPF-aligned programs for internal audit type |

Audit framework governs **how** assurance work is performed — distinct from accounting framework.

### 16.10 Accounting Framework

| Framework | Product Behavior |
|-----------|------------------|
| **IFRS** | Primary — classification, statements, notes templates |
| **Local GAAP** | Via compliance pack |
| **Other** | Declared explicitly — determines reporting validation set |

Defaults from company declaration; may be confirmed or overridden at engagement acceptance with documentation (ENG-05).

### 16.11 Industry Selection

| Aspect | Product Behavior |
|--------|------------------|
| **Default** | Inherited from company industry classification |
| **Override** | Audit Manager may override with justification for engagement-specific risk profile |
| **Effect** | Activates industry compliance pack, risk library, and specialized programs |
| **Audit trail** | Override recorded with rationale |

### 16.12 Currency

| Currency Element | Source | Engagement Use |
|------------------|--------|----------------|
| **Functional currency** | Company declaration | Measurement basis for financial data |
| **Presentation currency** | Company or engagement override | Statement presentation if different |
| **Engagement currency** | Confirmed at setup | Display and materiality denomination |
| **Validation** | Must match period import currency (FD-06) | Blocks mixed-currency without conversion workflow |

### 16.13 Materiality Configuration

Materiality is configured at **engagement level** and documented before planning approval.

| Materiality Element | Description | Set By |
|---------------------|-------------|--------|
| **Overall materiality** | Threshold for financial statement-level misstatements | Audit Manager; Partner approves |
| **Performance materiality** | Lower threshold for procedure design — typically 50–75% of overall | Audit Manager |
| **Specific materiality** | Thresholds for particular classes, disclosures, or transactions | Audit Manager |
| **Clearly trivial threshold** | Amount below which misstatements need not be accumulated | Audit Manager |
| **Basis of calculation** | Benchmark used (revenue, total assets, profit, etc.) | Audit Manager — documented |
| **Percentage applied** | Professional judgment on benchmark | Audit Manager — documented |
| **Revision** | Versioned update if circumstances change during engagement | Manager proposes; Partner approves significant revisions |

Materiality values are **professional judgments** — platform structures documentation and approval; does not auto-calculate without human confirmation.

### 16.14 Risk Level

| Aspect | Product Behavior |
|--------|------------------|
| **Initial indicator** | Optional preliminary risk rating at setup — Low, Moderate, High |
| **Basis** | Industry, entity size, prior year issues, client acceptance assessment |
| **Effect** | Suggests program intensity; does not replace formal risk assessment (Workflow 14) |
| **AI input** | AI risk indicators may inform — not set — initial level |
| **Formal assessment** | Replaced by documented risk assessment matrix during planning |

### 16.15 Status Lifecycle

```
Draft → Pending Acceptance → Accepted → Planning → Fieldwork → Review
    → Completion → Closed → Archived
```

| Status | Description | Permitted Actions |
|--------|-------------|-------------------|
| **Draft** | Engagement created; setup incomplete | Edit configuration; assign team |
| **Pending Acceptance** | Submitted for acceptance decision | Partner accepts or declines |
| **Accepted** | Client acceptance complete (ENG-01) | Planning activities |
| **Planning** | Audit plan in development | Materiality, risk assessment, program |
| **Fieldwork** | Approved plan; procedures in execution | Testing, evidence, working papers |
| **Review** | Fieldwork substantially complete | Multi-level review, finding evaluation |
| **Completion** | Review cleared; opinion in progress | Opinion drafting, reporting |
| **Closed** | Opinion issued; engagement administratively complete (ENG-04) | Read-only |
| **Archived** | Retention state; long-term preservation | Read-only; export only |

#### Status Transition Gates

| Transition | Gate |
|------------|------|
| Draft → Pending Acceptance | Required fields complete; Partner and Manager assigned |
| Pending Acceptance → Accepted | Partner acceptance documented |
| Accepted → Planning | Automatic on acceptance |
| Planning → Fieldwork | Approved audit plan (ENG-03) |
| Fieldwork → Review | Procedure completion threshold met per manager |
| Review → Completion | Review notes cleared; findings evaluated |
| Completion → Closed | Opinion authorized; closure checklist complete |
| Closed → Archived | Retention policy applied |

**Reopen:** Closed engagement may reopen to Fieldwork or Review with Engagement Partner authorization — logged (Section 16.17).

### 16.16 Archive Policy

| Rule | Description |
|------|-------------|
| **Trigger** | Engagement Closed and retention period elapsed, or manual archive |
| **Precondition** | Closure checklist complete; no open administrative actions |
| **Effect** | Read-only; all artifacts locked |
| **Retention** | Per organization retention policy and regulatory minimum |
| **Access** | Engagement team read access per retention rules; export for inspection |
| **Legal hold** | Archive suspended if legal hold active |

### 16.17 Restore Policy

| Rule | Description |
|------|-------------|
| **From Archived** | Engagement Partner requests restore with Organization Owner approval |
| **From Closed** | Reopen path (Section 16.15) — not full restore |
| **Audit** | Restore/reopen logged with reason |
| **Use case** | Inspection, litigation, correction of administrative error |

### 16.18 Business Validations

| Validation | Rule |
|------------|------|
| **ENG-V01** | Engagement Partner and Audit Manager required before Pending Acceptance |
| **ENG-V02** | Client, company, and period required |
| **ENG-V03** | Engagement number unique within organization |
| **ENG-V04** | Duplicate company + period + type warns or blocks per firm policy |
| **ENG-V05** | Fieldwork status blocked without Accepted status (ENG-01) |
| **ENG-V06** | Fieldwork status blocked without approved plan (ENG-03) |
| **ENG-V07** | Closure blocked with uncleared material review notes (WP-05) |
| **ENG-V08** | Closed engagement read-only except partner reopen (ENG-04) |
| **ENG-V09** | Scope and framework changes versioned after acceptance (ENG-05) |
| **ENG-V10** | Materiality revision versioned; significant changes require partner approval |
| **ENG-V11** | Opinion issuance blocked in non-Completion status (OPN-01, OPN-02) |

### 16.19 Permissions

| Capability | Engagement Partner | Audit Manager | Workspace Administrator | Auditor |
|------------|-------------------|---------------|------------------------|---------|
| Create engagement | Authorize | Yes | Admin setup | No |
| Edit setup (Draft) | Yes | Yes | Yes | No |
| Submit for acceptance | Yes | Yes | No | No |
| Accept engagement | Yes | No | No | No |
| Change status | Yes | Propose | No | No |
| Configure materiality | Approve | Yes | No | No |
| Close engagement | Yes | Propose | No | No |
| Reopen closed | Yes | No | No | No |
| Archive | Yes | No | Organization Owner | No |
| View engagement | Assigned | Assigned | Admin read | Team member |

### 16.20 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **ENG-AC-01** | Audit Manager can create engagement with client, company, and period |
| **ENG-AC-02** | Unique engagement number generated per numbering strategy |
| **ENG-AC-03** | Fieldwork blocked until engagement Accepted |
| **ENG-AC-04** | Fieldwork blocked until audit plan approved |
| **ENG-AC-05** | Partner and Manager required before acceptance submission |
| **ENG-AC-06** | Materiality documented with basis and benchmarks |
| **ENG-AC-07** | Closed engagement is read-only |
| **ENG-AC-08** | Partner can reopen closed engagement with audit log |
| **ENG-AC-09** | Duplicate company-period engagement warns user |
| **ENG-AC-10** | Engagement type drives correct methodology template |
| **ENG-AC-11** | Closure blocked with open material review notes |
| **ENG-AC-12** | Status transitions recorded in audit trail |

---

## 17. Client Management Module

The Client Management module governs the **commercial client relationship** — the organization being served by the firm or enterprise — distinct from the legal reporting entity (Company).

*Constitutional basis: PROJECT_BIBLE Part 8 Client entity; PRD3-06 recommendation.*

### 17.1 Purpose

Register and manage **client relationships** that anchor engagements — supporting contact management, multi-entity client structures, client portal provisioning, and client user linkage without becoming a CRM.

### 17.2 Business Goals

| Goal | Description |
|------|-------------|
| **Relationship clarity** | Distinguish client (who we serve) from company (what we audit/report) |
| **Multi-entity support** | One client with multiple legal entities |
| **Portal enablement** | Link client users to client record for portal access |
| **Engagement history** | View all engagements across client relationship |
| **Not a CRM** | Audit-context client records only — no sales pipeline (MASTER_PRD Section 2.2) |

### 17.3 Client Creation

| Attribute | Description |
|-----------|-------------|
| **Who may create** | Organization Owner; Workspace Administrator |
| **Required inputs** | Client name, primary jurisdiction, workspace assignment |
| **Optional inputs** | Client code, industry, primary contact, client portal flag |
| **Processing** | Validate uniqueness → assign client code → link to workspace → audit log |
| **Output** | Client in Active status — ready for company linkage |

### 17.4 Client Profile

| Profile Section | Contents |
|-----------------|----------|
| **Identity** | Client name, client code, relationship type |
| **Commercial** | Engagement history summary, active engagement count |
| **Regulatory** | Primary jurisdiction, industry |
| **Contacts** | Contact persons (Section 17.6) |
| **Entities** | Linked companies (Section 17.7) |
| **Portal** | Client portal workspace link; client users |
| **Notes** | Administrative relationship notes |

### 17.5 Legal Information

| Attribute | Description |
|-----------|-------------|
| **Legal name** | Official name of client organization |
| **Registration number** | Client-level registration if applicable |
| **Tax identifier** | Client-level tax ID |
| **Jurisdiction** | Primary country of operation |
| **Registered address** | Legal address |
| **Relationship start date** | When firm began serving client |

Legal information at client level may **differ from company level** in group structures — subsidiary companies have own legal identity.

### 17.6 Contact Persons

| Attribute | Description |
|-----------|-------------|
| **Name** | Contact full name |
| **Role** | CFO, Financial Controller, Company Secretary, etc. |
| **Email** | Primary communication |
| **Phone** | Optional |
| **Primary flag** | Designated primary contact |
| **Portal user link** | Optional link to Client User account |
| **Engagement notifications** | Per-contact notification preferences |

Multiple contacts supported per client.

### 17.7 Multiple Companies

```
Client (Relationship)
├── Company A (Parent)
├── Company B (Subsidiary)
└── Company C (Subsidiary)
```

| Rule | Description |
|------|-------------|
| **Linkage** | One client may have many companies |
| **Company uniqueness** | Company belongs to one workspace; linked to one primary client |
| **Engagement** | Each engagement targets one company; client provides portfolio view |
| **Creation** | Company created then linked to client, or created from client profile |
| **Dissociation** | Unlinking requires administrator action with audit log |

### 17.8 Client Status

```
Onboarded → Active → Inactive → Offboarded → Archived
```

| Status | Description |
|--------|-------------|
| **Onboarded** | Client record created; no active engagement |
| **Active** | Active engagement or reporting relationship |
| **Inactive** | No current engagements; historical retained |
| **Offboarded** | Relationship ended; no new engagements |
| **Archived** | Read-only administrative retention |

### 17.9 Archive

| Rule | Description |
|------|-------------|
| **Precondition** | No open engagements; all companies unlinked or archived |
| **Effect** | Client read-only; engagement history preserved |
| **Who** | Organization Owner; Workspace Administrator |

### 17.10 Restore

| Rule | Description |
|------|-------------|
| **From Inactive/Offboarded** | Reactivate to Active |
| **From Archived** | Organization Owner authorization required |
| **Audit** | Restore logged with reason |

### 17.11 Permissions

| Capability | Organization Owner | Workspace Administrator | Audit Manager | Client User |
|------------|-------------------|------------------------|---------------|-------------|
| Create client | Yes | Yes | No | No |
| Edit client profile | Yes | Yes | Read | No |
| Link company | Yes | Yes | No | No |
| Manage contacts | Yes | Yes | Read | No |
| Invite client user | Yes | Yes | No | No |
| Archive client | Yes | Yes | No | No |
| View client | Yes | Assigned workspace | Assigned engagements | Own client only |

### 17.12 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **CLI-AC-01** | Administrator can create client with required attributes |
| **CLI-AC-02** | Client code unique within workspace |
| **CLI-AC-03** | Multiple companies linkable to one client |
| **CLI-AC-04** | Client user invitation linked to client record |
| **CLI-AC-05** | Client engagement history visible from profile |
| **CLI-AC-06** | Offboarded client cannot spawn new engagements |
| **CLI-AC-07** | Archive blocked with open engagements |
| **CLI-AC-08** | Client portal flag routes client users to correct workspace |

---

## 18. Financial Period Management

Financial Period Management governs **reporting time boundaries** for each company — controlling when data may be imported, adjusted, reported, and audited.

*Constitutional basis: PROJECT_BIBLE Part 8 Financial Period entity; Business Rule CO-05; Part 3 Workflow 5.*

### 18.1 Purpose

Define and control **period-bound financial data containers** — ensuring imports, adjustments, statements, and audit work attach to the correct reporting cycle with governed open, close, and lock states.

### 18.2 Business Goals

| Goal | Description |
|------|-------------|
| **Period integrity** | Data assigned to correct reporting window |
| **Close discipline** | Controlled transition from open to closed |
| **Comparative support** | Prior periods linked for financial statement comparatives |
| **Audit alignment** | Engagement period matches financial data period |
| **Immutability at lock** | Approved period data protected from change |

### 18.3 Fiscal Years

| Aspect | Product Behavior |
|--------|------------------|
| **Source** | Company fiscal year end declaration (MASTER_PRD Section 9.7) |
| **Generation** | Platform generates fiscal year containers from company fiscal year end |
| **Label** | Fiscal year labeled by end year (e.g., FY2026 ending 31 Dec 2026) |
| **Non-calendar** | Supported — periods align to declared fiscal year end |
| **Change** | Fiscal year change after data exists requires documented approval |

### 18.4 Reporting Periods

| Attribute | Description |
|-----------|-------------|
| **Definition** | Specific reporting cycle within company — annual, interim, quarterly |
| **Naming** | Period end date and type (e.g., "Year ended 31 December 2026") |
| **Ownership** | Financial Controller |
| **Contents** | Trial balance, general ledger, classifications, statements, notes |
| **Creation** | Manual or automatic when company registered or engagement created |
| **Uniqueness** | One primary annual period per company per fiscal year end date |

#### Period Types

| Type | Description |
|------|-------------|
| **Annual** | Full fiscal year reporting period |
| **Interim** | Quarterly or semi-annual interim period |
| **Special** | Short period, opening balance, or transition period |

### 18.5 Comparative Periods

| Aspect | Product Behavior |
|--------|------------------|
| **Linkage** | Current period links to prior approved period for comparatives |
| **Validation** | Comparative period must be Closed or Locked with approved statements |
| **Auto-suggest** | System suggests prior year equivalent period |
| **Missing comparative** | First-year entity — comparative not required; flagged in reporting |
| **Restatement** | If comparative restated, linkage versioned (RPT-04) |

### 18.6 Open Period

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Active period accepting imports, adjustments, and classification |
| **Permitted** | Trial balance import, GL import, adjustments, classification |
| **Engagement** | Audit fieldwork may reference open period data |
| **Transition** | Financial Controller initiates close process |

### 18.7 Closed Period

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Period close complete; no new imports or casual adjustments |
| **Permitted** | Audit adjustments with approval; statement regeneration; review |
| **Blocked** | New trial balance import without reopen workflow |
| **Transition** | CFO or Financial Controller approves period close; may move to Locked after statement approval |

#### In Close (Intermediate State)

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Close in progress — cut-off enforced; limited changes |
| **Permitted** | Final adjustments, reconciliation, statement draft |
| **Blocked** | New bulk imports |

### 18.8 Locked Period

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Period financially finalized — approved statements locked |
| **Permitted** | Read, export, audit read-only reference |
| **Blocked** | Adjustments, reclassification, data import — all changes |
| **Unlock** | Organization Owner or CFO authorization with documented reason — rare event |
| **Audit** | Unlock creates audit event; triggers statement invalidation flag |

### 18.9 Period Validation

| Validation | Rule |
|------------|------|
| **PER-V01** | Import requires Open or In Close period (CO-05) |
| **PER-V02** | Period dates align with company fiscal year |
| **PER-V03** | Trial balance debits equal credits before validation pass (FD-02) |
| **PER-V04** | Closed period blocks new import without reopen |
| **PER-V05** | Locked period blocks all data mutations |
| **PER-V06** | Comparative period must precede current period chronologically |
| **PER-V07** | Engagement period must match linked financial period |
| **PER-V08** | Only one Open annual period per company recommended — warning if multiple |

### 18.10 Period Lifecycle

```
Open → In Close → Closed → Locked → Archived
```

| State | Financial Controller Actions | Auditor Actions |
|-------|------------------------------|-----------------|
| **Open** | Import, adjust, classify | Read; audit planning |
| **In Close** | Final adjustments | Fieldwork on validated data |
| **Closed** | Limited adjustments | Substantive testing; statements draft |
| **Locked** | Read only | Opinion; reference frozen data |
| **Archived** | Read only | Read only; inspection |

### 18.11 Permissions

| Capability | Financial Controller | Finance Director | CFO | Auditor (engagement grant) |
|------------|---------------------|------------------|-----|---------------------------|
| Create period | Yes | Yes | Yes | No |
| Import data | Yes | Yes | No | No |
| Initiate close | Yes | Yes | No | No |
| Approve close | No | Yes | Yes | No |
| Lock period | No | Propose | Yes | No |
| Unlock period | No | No | Yes (with Org Owner) | No |
| View period | Assigned company | Assigned company | Organization | Engagement-scoped |
| Archive period | No | No | Organization Owner | No |

### 18.12 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **PER-AC-01** | Financial Controller can create reporting period for company |
| **PER-AC-02** | Import blocked on Closed period without reopen |
| **PER-AC-03** | Import blocked on Locked period |
| **PER-AC-04** | Comparative period linkable at period creation |
| **PER-AC-05** | Period close workflow transitions Open → In Close → Closed |
| **PER-AC-06** | Lock prevents all data mutations |
| **PER-AC-07** | Unlock requires authorization and audit log |
| **PER-AC-08** | Engagement validates period belongs to assigned company |
| **PER-AC-09** | Unbalanced trial balance blocks validation (FD-02) |
| **PER-AC-10** | Archived period read-only with export capability |

---

## 19. Engagement Dashboard

The Engagement Dashboard is the **command center** for an active engagement — the first screen engagement team members see after opening an engagement. Every widget serves professional oversight, progress tracking, or action prioritization.

### 19.1 Dashboard Purpose

Provide **at-a-glance situational awareness** of engagement health — progress against plan, team workload, open items requiring attention, financial context, and AI-assisted insights — without replacing detailed working papers or planning documents.

### 19.2 Widget Catalog

#### Overview

| Business Purpose | Content |
|------------------|---------|
| **Engagement identity** | Engagement number, client name, company, period, type, status |
| **Professional context** | Engagement Partner, Audit Manager, audit framework, accounting framework |
| **Key dates** | Planning deadline, fieldwork target, opinion target, days remaining |
| **Status indicator** | Current lifecycle status with next required gate |

*Why it matters:* Team members immediately confirm they are in the correct engagement with correct regulatory context.

#### Progress

| Business Purpose | Content |
|------------------|---------|
| **Procedure completion** | Percentage of audit program procedures complete, in review, not started |
| **Section progress** | Progress by financial statement area (revenue, assets, liabilities, etc.) |
| **Planning status** | Plan approved / pending |
| **Milestone tracker** | Acceptance, planning, fieldwork, review, completion milestones with dates |

*Why it matters:* Managers allocate resources and identify delays before deadlines are missed.

#### Assigned Team

| Business Purpose | Content |
|------------------|---------|
| **Team roster** | Names, roles, contact availability |
| **Leadership** | Partner and Manager prominently displayed |
| **Reviewer** | Independent reviewer if assigned |
| **Workload indicator** | Open assignments per team member |

*Why it matters:* Clarifies accountability and enables coordination.

#### Outstanding Tasks

| Business Purpose | Content |
|------------------|---------|
| **My tasks** | Procedures, review notes, and approvals assigned to current user |
| **Team tasks** | Overdue or unassigned procedures |
| **Priority flag** | Tasks blocking status progression highlighted |

*Why it matters:* Drives daily professional productivity — users know what to do next.

#### Open Findings

| Business Purpose | Content |
|------------------|---------|
| **Finding count** | Open misstatements, control deficiencies, recommendations |
| **Severity summary** | By severity classification |
| **Aggregate misstatement** | Running total against materiality |
| **Link** | Navigate to finding register |

*Why it matters:* Partner and Manager monitor opinion impact throughout — not only at completion.

#### Pending Reviews

| Business Purpose | Content |
|------------------|---------|
| **Papers awaiting review** | Working papers submitted but not signed off |
| **Review note count** | Open uncleared notes |
| **Aging** | Days since submission — bottleneck indicator |

*Why it matters:* Review backlog is the primary quality and schedule risk in audit delivery.

#### Pending Approvals

| Business Purpose | Content |
|------------------|---------|
| **Approval queue** | Plans, adjustments, opinion draft awaiting authorization |
| **Approver** | Who must act |
| **Materiality flag** | Items exceeding escalation threshold |

*Why it matters:* Approval chains are governance gates — visibility prevents stalemate.

#### Financial Summary

| Business Purpose | Content |
|------------------|---------|
| **Trial balance status** | Imported, validated, classified, adjusted |
| **Key balances** | Total assets, revenue, profit — material movements vs. prior period |
| **Data freshness** | Last import date; validation status |
| **Link** | Navigate to trial balance and lead sheets |

*Why it matters:* Auditors work from financial data — summary confirms data readiness and highlights anomalies at headline level.

#### AI Summary

| Business Purpose | Content |
|------------------|---------|
| **AI activity** | Recent AI analyses run on engagement |
| **Pending AI items** | AI findings awaiting accept/reject |
| **Risk indicators** | AI-surfaced anomalies linked to evidence — advisory only |
| **Limitations** | Reminder that AI outputs require professional validation |

*Why it matters:* Surfaces AI assistance status without implying AI conclusions — supports human-in-the-loop discipline.

#### Recent Activity

| Business Purpose | Content |
|------------------|---------|
| **Activity feed** | Chronological log — papers signed off, evidence uploaded, status changes, imports |
| **Attribution** | Who did what, when |
| **Filter** | By user, activity type, date |

*Why it matters:* Managers maintain situational awareness without auditing every working paper daily.

#### Notifications

| Business Purpose | Content |
|------------------|---------|
| **Unread count** | Review assignments, approval requests, mentions |
| **Priority** | Items blocking engagement progression |
| **Action** | Direct navigation to source item |

*Why it matters:* Reduces missed review assignments and approval delays.

#### Quick Actions

| Business Purpose | Content |
|------------------|---------|
| **Role-appropriate shortcuts** | Upload evidence, create working paper, run AI analysis, submit for review, import trial balance |
| **Gated actions** | Actions unavailable in current status hidden or disabled with explanation |

*Why it matters:* Accelerates common workflows from single entry point.

### 19.3 KPIs

| KPI | Audience | Business Meaning |
|-----|----------|------------------|
| **Procedure completion %** | Manager | Fieldwork progress |
| **Review clearance rate** | Manager, Partner | Quality workflow health |
| **Open review notes** | Manager | Backlog risk |
| **Days to target opinion** | Partner | Schedule risk |
| **Aggregate misstatement / materiality** | Partner, Manager | Opinion risk indicator |
| **Evidence linkage %** | Senior, Manager | Documentation completeness |
| **Overdue assignments** | Manager | Resource or performance issue |
| **Planning gate status** | Partner | Readiness for fieldwork |

KPIs are **indicators** — not quality conclusions. Professional judgment remains with engagement leadership.

### 19.4 Dashboard by Role

| Role | Default Emphasis |
|------|------------------|
| **Engagement Partner** | Progress, open findings, aggregate misstatement, pending approvals, days to opinion |
| **Audit Manager** | Outstanding tasks, pending reviews, team workload, procedure completion |
| **Audit Senior** | My tasks, pending reviews, section progress |
| **Auditor** | My tasks, quick actions, assigned procedures |
| **Reviewer** | Pending reviews, open notes, file completeness |
| **Financial Controller** | Financial summary, trial balance status, data import |

### 19.5 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **DASH-AC-01** | Dashboard loads as default engagement landing page |
| **DASH-AC-02** | Overview shows correct engagement identity and status |
| **DASH-AC-03** | Progress reflects actual procedure completion state |
| **DASH-AC-04** | My tasks filtered to current user assignments |
| **DASH-AC-05** | Open findings show aggregate misstatement against materiality |
| **DASH-AC-06** | Pending reviews count matches uncleared submitted papers |
| **DASH-AC-07** | Financial summary reflects current trial balance validation status |
| **DASH-AC-08** | AI summary shows pending accept/reject items only — not conclusions |
| **DASH-AC-09** | Quick actions respect engagement status gates |
| **DASH-AC-10** | Role-based widget emphasis applied on dashboard load |

---

## 20. User Journey — Client to Trial Balance Readiness

End-to-end experience for an **audit firm** establishing a new client engagement and reaching readiness to import trial balance data.

*Maps to MASTER_PRD Part 3 Team module, Part 4 Sections 16–18, and PROJECT_BIBLE Workflows 1, 5, 13.*

### 20.1 Journey Overview

```
Create Client → Create Company → Create Engagement → Assign Team
    → Configure Materiality → Ready to Import Trial Balance
```

**Actor:** Audit Manager (primary); Workspace Administrator (setup); Engagement Partner (acceptance and materiality approval).

### 20.2 Step 1 — Create Client

| Perspective | Audit Manager / Workspace Administrator |
|-------------|----------------------------------------|
| **Where** | Workspace → Clients → New Client |
| **Actions** | Enter client legal name, client code, jurisdiction, industry; add primary contact (CFO name, email) |
| **Optional** | Enable client portal flag for future client user access |
| **Outcome** | Client record Active in workspace |
| **Guidance** | "Link or create a company entity for this client" |

**User sees:** Client profile with empty companies list and "Add company" action.

### 20.3 Step 2 — Create Company

| Perspective | Workspace Administrator |
|-------------|-------------------------|
| **Where** | From client profile → Add Company — or Workspace → Companies → New |
| **Actions** | Enter legal entity name, registration ID, jurisdiction, IFRS framework, functional currency, fiscal year end (31 December), industry; link to client created in Step 1 |
| **Processing** | System applies chart of accounts template and compliance pack; creates first annual reporting period (Open) |
| **Outcome** | Company Active; financial period available |
| **Guidance** | "Create engagement or import trial balance" |

**User sees:** Company profile with reporting period "Year ended 31 December 2026 — Open."

### 20.4 Step 3 — Create Engagement

| Perspective | Audit Manager |
|-------------|---------------|
| **Where** | Workspace → Engagements → New Engagement |
| **Actions** | Select client → select company → select period → type: External statutory audit → confirm ISA and IFRS frameworks → industry inherited → currency confirmed |
| **Processing** | System generates engagement number (e.g., `BAK-0142-2026-01`); creates engagement in Draft |
| **Outcome** | Engagement draft with checklist of required setup items |
| **Guidance** | "Assign Engagement Partner and Audit Manager to proceed" |

**User sees:** Engagement setup wizard with progress steps.

### 20.5 Step 4 — Assign Team

| Perspective | Audit Manager |
|-------------|---------------|
| **Actions** | Assign Engagement Partner, Audit Manager (self), Audit Seniors, Auditors from workspace user list; optionally assign Reviewer |
| **Validation** | System requires Partner and Manager before acceptance |
| **Notifications** | Team members notified of engagement assignment |
| **Outcome** | Team formed; members see engagement in their list |

**User sees:** Team roster on engagement with roles; assigned users receive notification.

### 20.6 Step 5 — Configure Materiality

| Perspective | Audit Manager (prepare); Engagement Partner (approve) |
|-------------|-----------------------------------------------------|
| **Actions** | Enter benchmark (e.g., total assets), percentage, calculated overall materiality; set performance materiality (e.g., 70% of overall); set clearly trivial threshold; document basis |
| **Submission** | Submit for Partner review |
| **Approval** | Partner approves materiality documentation |
| **Parallel** | Submit engagement for acceptance — Partner accepts client engagement |
| **Outcome** | Materiality documented; engagement moves to Accepted → Planning |

**User sees:** Materiality worksheet with calculation visible and approval status.

### 20.7 Step 6 — Ready to Import Trial Balance

| Milestone | Criteria |
|-----------|----------|
| **Engagement** | Accepted; Partner and Manager assigned; materiality approved |
| **Period** | Open reporting period exists for company |
| **Team** | Fieldwork team assigned (planning may proceed in parallel) |
| **Next action** | "Import trial balance" enabled on dashboard and company financial view |

| Perspective | Audit Manager or Financial Controller (if client portal) |
|-------------|--------------------------------------------------------|
| **Actions** | Navigate to company → reporting period → Import Trial Balance; or use engagement quick action |
| **Prerequisite check** | System confirms period Open, engagement Accepted, data import permitted |
| **Outcome** | User enters trial balance upload workflow (future PRD part) |

**User sees:** Engagement dashboard with "Ready for data import" banner and quick action **Import Trial Balance** — planning workflow also available.

### 20.8 Journey Diagram

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Create    │───►│   Create    │───►│   Create    │
│   Client    │    │   Company   │    │ Engagement  │
└─────────────┘    └─────────────┘    └──────┬──────┘
                                             │
┌─────────────┐    ┌─────────────┐    ┌──────▼──────┐
│   Ready     │◄───│ Configure   │◄───│   Assign    │
│ Import TB   │    │ Materiality │    │    Team     │
└─────────────┘    └─────────────┘    └─────────────┘
```

### 20.9 Journey Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **J-AC-01** | User can complete client-to-engagement flow without leaving workspace |
| **J-AC-02** | Company auto-linked to client when created from client profile |
| **J-AC-03** | Engagement creation pre-fills framework and industry from company |
| **J-AC-04** | Team assignment notifications sent within one minute |
| **J-AC-05** | Materiality approval and engagement acceptance can proceed in parallel |
| **J-AC-06** | Import trial balance action enabled only when period Open and engagement Accepted |
| **J-AC-07** | Dashboard shows readiness milestone when all criteria met |

---

## PRD Review Notes — Part 4

Consistency review of MASTER_PRD Part 4 against PROJECT_BIBLE (Parts 1–15) and MASTER_PRD Parts 1–3. No previous sections modified.

### Constitutional Alignment

| Area | Status | Notes |
|------|--------|-------|
| Engagement lifecycle (Bible Part 8, 15 §78) | Aligned | Section 16 status model maps to Acceptance → Planning → Fieldwork → Review → Completion → Closure → Archived |
| ENG-01 through ENG-05 | Aligned | Section 16 validations and gates |
| Client entity (Bible Part 8) | Aligned | Section 17 — PRD3-06 addressed |
| Financial Period (Bible Part 8) | Aligned | Section 18 — PRD2-03 addressed |
| CO-01, CO-05 | Aligned | Company framework and period governance |
| Materiality (Bible Part 15 §77) | Aligned | Section 16.13 — professional judgment documented |
| AI dashboard (Bible Part 4) | Aligned | Section 19 — advisory only, human validation |

### MASTER_PRD Parts 1–3 Alignment

| Area | Status |
|------|--------|
| PRD3-01 (Engagement module in Part 4) | Addressed — Section 16 |
| PRD3-06 (Client record) | Addressed — Section 17 |
| PRD2-03 (Financial Period module) | Addressed — Section 18 |
| PRD2-05 (Client vs Company) | Clarified — Client relationship vs legal entity |
| Team module (Part 3 §13) | Referenced in Sections 16, 20 — team assignment at engagement creation |
| Multi-tenant hierarchy (Part 2 §6) | Engagement scoped to workspace; client isolated |

### Workflow Mapping

| Workflow | MASTER_PRD Section |
|----------|-------------------|
| Workflow 1: Company Creation | Section 20.3 (referenced) |
| Workflow 5: Trial Balance Upload | Section 20.7 readiness milestone |
| Workflow 13: Audit Planning | Section 16 materiality; dashboard planning status |
| Workflow 14: Risk Assessment | Section 16.13 — formal assessment in planning |
| Client acceptance (Part 15 §78) | Section 16 status Pending Acceptance → Accepted |

### Permission Consistency

| Area | Status |
|------|--------|
| Engagement Partner / Audit Manager gates | Consistent with Part 3 §14 |
| Financial Controller period ownership | Consistent with Part 2 §9 |
| Client User scope | Section 17 — portal only |
| Workspace Administrator boundaries | Consistent with WS-01 |

### Terminology Consistency

| Term | Status |
|------|--------|
| Company vs Client | Distinct definitions — Section 17.2 |
| Financial Period vs Fiscal Year | Fiscal year generates periods — Section 18.3–18.4 |
| Locked vs Closed | Both defined — Closed allows limited audit adjustments; Locked is immutable |
| Finding vs AI Finding | Dashboard "Open Findings" = audit findings; AI separate widget — consistent with Part 4 §20 |
| Engagement number | New product term — ENG-V03 uniqueness rule |

### Editorial Recommendations

| ID | Recommendation |
|----|----------------|
| **PRD4-01** | Client acceptance workflow detail (independence, conflict check) — expand in Part 5 as sub-workflow of Pending Acceptance |
| **PRD4-02** | Group audit with multiple companies — define component engagement model in future part |
| **PRD4-03** | Trial Balance Import module specification — next financial data PRD part |
| **PRD4-04** | Dashboard KPI thresholds configurable per firm — note for workspace settings |
| **PRD4-05** | Add engagement number to PROJECT_BIBLE glossary |
| **PRD4-06** | Locked period unlock should trigger statement version invalidation — cross-reference in reporting PRD |
| **PRD4-07** | Internal audit engagement type may omit opinion module — confirm in audit engine part |

### Review Conclusion

MASTER_PRD Part 4 is **consistent with PROJECT_BIBLE and Parts 1–3**. It specifies the platform's most critical assurance container (Engagement), client relationship layer, financial period governance, engagement dashboard, and operational user journey without contradicting lifecycle rules, permission model, or multi-tenant isolation. PRD4-01 through PRD4-07 guide subsequent PRD parts.

---

## Document Control — Part 4

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.4.0 | 2026-06-30 | Chief Product Officer | Part 4 — Engagement, Client & Financial Period Management complete; PRD Review Notes Part 4 included |

---

*End of Part 4.*

---

## Part 5 — Financial Data Import & Source Management

### Table of Contents — Part 5

21. [Financial Data Import Module](#21-financial-data-import-module)
22. [Trial Balance Import](#22-trial-balance-import)
23. [General Ledger Import](#23-general-ledger-import)
24. [Import History & Data Management](#24-import-history--data-management)
25. [User Journey — Engagement to Data Validation Readiness](#25-user-journey--engagement-to-data-validation-readiness)

---

## 21. Financial Data Import Module

The Financial Data Import module governs **ingestion of financial data from external sources** into the platform — preserving original evidence, versioning every submission, and staging data for validation before professional use.

*Constitutional basis: PROJECT_BIBLE Part 2 Section 12 (Financial Data Import); Part 3 Workflows 5–7; Business Rules FD-01 through FD-06; Part 3 Section 16 traceability chain.*

### 21.1 Purpose

Enable authorized users to **import trial balance, general ledger, and supporting financial schedules** from client and ERP sources into a governed company reporting period — with immutable source preservation, structured validation, and full traceability from downstream outputs to original uploaded files.

### 21.2 Business Goals

| Goal | Description |
|------|-------------|
| **Source preservation** | Original files preserved immutably alongside parsed data (FD-01) |
| **Evidence chain** | Every balance traceable to import source and cell-level origin where applicable |
| **Version discipline** | Re-import creates new version — never silent overwrite (FD-04) |
| **Period governance** | Imports only into permitted period states (CO-05) |
| **Currency integrity** | Declared currency on every import (FD-06) |
| **Validation readiness** | Staged data flows to validation workflow — import ≠ certified data |
| **Audit defensibility** | Complete import audit trail for regulators and engagement inspection |
| **Multi-source support** | Excel, CSV, ERP exports today; extensible to future automated feeds |

### 21.3 Supported Import Sources

| Source | Description | Availability |
|--------|-------------|--------------|
| **Excel** | `.xlsx`, `.xls` — primary client deliverable format | Current |
| **CSV** | Comma or delimiter-separated extracts | Current |
| **ERP Export** | Pre-formatted exports from SAP, Oracle, 1C, and similar systems via file | Current |
| **Future API Imports** | Scheduled or on-demand pulls from connected ERP systems | Future — governed integration; not manual upload |

All sources follow the **same governance model**: source file preserved, import session recorded, validation required before reliance.

### 21.4 Upload Wizard

The upload wizard guides users through **governed import setup** before file processing begins.

```
Select Data Type → Select Company & Period → Select Source Format
    → Upload File → Map Columns → Declare Currency → Review & Confirm
```

| Wizard Step | Business Content |
|-------------|------------------|
| **1. Data type** | Trial balance, general ledger, or supporting schedule |
| **2. Company & period** | Target legal entity and reporting period — period must permit import |
| **3. Source format** | Excel, CSV, ERP template profile |
| **4. Upload file** | File selection; size and format validation |
| **5. Column mapping** | Map file columns to platform fields; template detection assists |
| **6. Currency** | Confirm functional currency for import |
| **7. Review & confirm** | Summary before processing — user authorizes import session start |

Wizard may be launched from **company financial view**, **reporting period**, or **engagement dashboard** quick action (MASTER_PRD Section 19).

### 21.5 Import Sessions

An **import session** is a single governed attempt to ingest a file into a company period.

| Session Attribute | Description |
|-------------------|-------------|
| **Session identifier** | Unique reference for the import attempt |
| **Data type** | Trial balance, general ledger, supporting schedule |
| **Company & period** | Target scope |
| **Source file** | Immutable preserved original |
| **Initiator** | User who started session |
| **Timestamp** | Start and completion times |
| **Mapping profile** | Column mapping applied |
| **Currency declared** | Functional currency for session |
| **Status** | In progress, staged, failed, cancelled, superseded |
| **Version** | Import version number within period and data type |

One active **staged** import per data type may be current; prior versions retained in history.

### 21.6 Import History

| History Element | Description |
|-----------------|-------------|
| **Chronological list** | All import sessions for company and period |
| **Version chain** | Ordered versions with active version flagged |
| **Comparison** | Compare account counts, totals, and deltas between versions |
| **Source retrieval** | Download original file for any historical version |
| **Validation linkage** | Validation results tied to import version |
| **Engagement linkage** | Imports visible on engagement financial summary when period linked |

### 21.7 Re-import

| Aspect | Product Behavior |
|--------|------------------|
| **Trigger** | User uploads corrected or updated file for same period and data type |
| **Effect** | Creates **new import version** — prior version preserved (FD-04) |
| **Active version** | User designates which version is active after successful staging |
| **Downstream impact** | Re-import invalidates dependent drafts (classification, statements) until re-validation |
| **Approved data** | Re-import over approved trial balance requires acknowledgment and may require re-approval workflow |
| **Audit** | Re-import logged with reason and version transition |

### 21.8 Cancel Import

| Aspect | Product Behavior |
|--------|------------------|
| **When** | During in-progress session before confirmation, or staged session before validation reliance |
| **Effect** | Session marked cancelled; no staged data promoted |
| **Source file** | Preserved in audit trail even if cancelled — evidence of attempt |
| **Who** | Session initiator or Financial Controller |
| **Restart** | User may start new session |

### 21.9 Permissions

| Capability | Financial Controller | Finance Director | Auditor (engagement grant) | Workspace Administrator |
|------------|---------------------|------------------|---------------------------|------------------------|
| Start import wizard | Yes | Yes | No | No |
| Upload trial balance | Yes | Yes | No | No |
| Upload general ledger | Yes | Yes | No | No |
| Cancel own import session | Yes | Yes | No | No |
| Cancel any import session | Yes | Yes | No | No |
| View import history | Assigned company | Assigned company | Engagement-scoped | Admin read |
| Download source file | Yes | Yes | Read if granted | No |
| Set active import version | Yes | Yes | No | No |
| Re-import | Yes | Yes | No | No |

Auditor access is **read-only** on imported data when engagement-scoped grant exists — auditors do not import client financial data unless dual role as Financial Controller.

### 21.10 Business Validations

| Validation | Rule |
|------------|------|
| **IMP-V01** | Period must be Open or In Close for new import (CO-05, PER-V01) |
| **IMP-V02** | Locked period blocks all imports (PER-V03) |
| **IMP-V03** | Source file preserved immutably on every upload (FD-01) |
| **IMP-V04** | Currency must be declared and match company functional currency unless conversion documented (FD-06) |
| **IMP-V05** | Re-import creates new version — no silent replace (FD-04) |
| **IMP-V06** | File format must match declared source type |
| **IMP-V07** | Company must be Active status |
| **IMP-V08** | User must have import permission on target company |
| **IMP-V09** | Import session attributed to initiating user |
| **IMP-V10** | Cancelled sessions do not affect active validated data |

### 21.11 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **IMP-AC-01** | Financial Controller can complete upload wizard for trial balance |
| **IMP-AC-02** | Original source file preserved and downloadable from import history |
| **IMP-AC-03** | Import blocked on Locked period |
| **IMP-AC-04** | Re-import creates new version; prior version retained |
| **IMP-AC-05** | Cancelled import does not change active staged data |
| **IMP-AC-06** | Import session recorded with user, timestamp, and company-period scope |
| **IMP-AC-07** | Excel, CSV, and ERP export profiles supported |
| **IMP-AC-08** | Auditor with engagement grant can view import history read-only |
| **IMP-AC-09** | Currency declaration required before import confirmation |
| **IMP-AC-10** | Import from engagement quick action pre-fills company and period |

---

## 22. Trial Balance Import

Trial Balance Import is the **primary financial data entry point** for reporting and audit — establishing period-end account balances that anchor classification, statements, lead sheets, and substantive testing.

*Constitutional basis: PROJECT_BIBLE Part 3 Workflow 5; Part 8 Trial Balance entity; Business Rules FD-02, FD-03.*

### 22.1 Purpose

Import period-end trial balance data for a company reporting period — validating structural integrity, preserving source evidence, and staging balances for the data validation workflow.

### 22.2 Business Goals

| Goal | Description |
|------|-------------|
| **Balance integrity** | Debits equal credits before progression (FD-02) |
| **Account completeness** | All material accounts captured for classification |
| **Traceability** | Every balance linked to source file and cell where applicable |
| **Staging discipline** | Import stages data — validation certifies fitness (FD-03) |
| **Audit readiness** | Auditors rely on validated trial balance linked to engagement |

### 22.3 File Selection

| Aspect | Product Behavior |
|--------|------------------|
| **Formats** | Excel (primary), CSV, ERP trial balance export |
| **Selection** | User selects file from local system through wizard |
| **Size limits** | Firm-scale volumes supported per enterprise scalability requirements |
| **Virus/malware** | File screened per platform security policy before processing |
| **Multi-sheet** | Excel multi-sheet files — user selects sheet or system detects trial balance sheet |

### 22.4 Template Detection

| Aspect | Product Behavior |
|--------|------------------|
| **Auto-detect** | System analyzes headers and structure to suggest mapping template |
| **Firm templates** | Workspace-published mapping profiles for common client formats |
| **ERP profiles** | Pre-defined profiles for common ERP export layouts |
| **Manual override** | User adjusts column mapping when detection incorrect |
| **Save profile** | User may save mapping as reusable profile for client |

#### Expected Column Mapping

| Platform Field | Source Column |
|----------------|---------------|
| Account code | Required |
| Account name | Required |
| Debit balance | Required (or single amount + type) |
| Credit balance | Required (or single amount + type) |
| Opening balance | Optional |
| Movement | Optional |

### 22.5 Period Selection

| Aspect | Product Behavior |
|--------|------------------|
| **Pre-fill** | From wizard context — company and period |
| **Validation** | Period Open or In Close only |
| **Engagement link** | When launched from engagement, period must match engagement period |
| **Display** | Period end date and status shown prominently |

### 22.6 Currency Selection

| Aspect | Product Behavior |
|--------|------------------|
| **Default** | Company functional currency pre-selected |
| **Confirmation** | User confirms before import |
| **Mismatch** | Warning if file metadata or column headers suggest different currency |
| **Multi-currency** | Single functional currency per import — foreign columns require separate workflow (future) |

### 22.7 Validation Summary

Structural validation runs **immediately after parsing** — before staging confirmation.

| Check | Severity |
|-------|----------|
| Debits equal credits | Critical error if fail (FD-02) |
| Required columns mapped | Critical error |
| Duplicate account codes | Error or warning per policy |
| Zero-balance accounts | Warning — may be excluded or included |
| Unmapped account codes vs chart | Warning |
| Account count vs prior import | Informational |
| Negative debit/credit conventions | Normalized with warning if ambiguous |

| Result | Meaning |
|--------|---------|
| **Pass** | Ready to stage |
| **Pass with warnings** | Stage allowed; warnings surface in validation workflow |
| **Fail** | Staging blocked; user must correct file and re-upload |

### 22.8 Preview Screen

| Preview Content | Description |
|-----------------|-------------|
| **Account list** | Parsed accounts with debit, credit, net balance |
| **Totals** | Total debits, total credits, difference |
| **Exception list** | Errors and warnings from validation summary |
| **Row count** | Number of accounts imported |
| **Source reference** | File name, sheet, mapping profile |
| **Comparison** | Optional delta vs. prior import version |

User reviews preview before confirming staging.

### 22.9 Import Confirmation

| Step | Product Behavior |
|------|------------------|
| **User action** | Confirm staging or return to fix mapping/file |
| **On confirm** | Data staged; source preserved; import version recorded |
| **Notification** | Finance Director notified of new staging (configurable) |
| **Next step** | Prompt to proceed to data validation workflow |
| **Status** | Trial balance status: **Imported** (staged, not yet validated) |

### 22.10 Import Status

| Status | Description |
|--------|-------------|
| **Not imported** | No trial balance for period |
| **Import in progress** | Session active |
| **Imported (staged)** | Parsed and staged; awaiting validation |
| **Validated** | Passed validation workflow (FD-03) |
| **Validated with warnings** | Passed with acknowledged warnings |
| **Failed validation** | Critical errors — remediation required |
| **Superseded** | Replaced by newer import version as active |

### 22.11 Error Handling

| Error Type | User Experience |
|------------|-----------------|
| **File format error** | Clear message; user re-uploads correct format |
| **Unbalanced trial balance** | Show difference amount; block staging |
| **Missing required mapping** | Highlight unmapped columns; return to mapping step |
| **Period closed** | Block with explanation; link to reopen request if applicable |
| **Parse failure** | Partial parse prevented — no incomplete staging |
| **System error** | Session marked failed; source preserved; user may retry |

All errors logged in import session audit trail.

### 22.12 Permissions

Same as Section 21.9 — trial balance import restricted to Financial Controller and Finance Director on assigned companies.

### 22.13 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **TB-AC-01** | User can import Excel trial balance with column mapping |
| **TB-AC-02** | Unbalanced trial balance blocked from staging |
| **TB-AC-03** | Preview shows totals and exception list before confirm |
| **TB-AC-04** | Confirmed import preserves source file immutably |
| **TB-AC-05** | Template detection suggests mapping for standard layouts |
| **TB-AC-06** | Import on Locked period rejected |
| **TB-AC-07** | Staged status distinct from Validated status |
| **TB-AC-08** | Re-import creates new version with comparison to prior |
| **TB-AC-09** | Engagement-launched import pre-fills correct period |
| **TB-AC-10** | Parse failure does not leave partial staged data |

---

## 23. General Ledger Import

General Ledger Import provides **transaction-level detail** underlying the trial balance — enabling drill-down, substantive testing, analytical procedures, and reconciliation.

*Constitutional basis: PROJECT_BIBLE Part 3 Workflow 6; Part 8 General Ledger entity.*

### 23.1 Purpose

Import detailed general ledger transactions for a reporting period — supporting reconciliation to trial balance, transaction-level audit procedures, and traceability from account balances to individual entries.

### 23.2 Business Goals

| Goal | Description |
|------|-------------|
| **Drill-down** | Navigate from trial balance account to transactions |
| **Reconciliation** | GL totals reconcile to trial balance (Workflow 7) |
| **Substantive testing** | Population for audit sampling and anomaly detection |
| **Source preservation** | Original GL extract preserved immutably |
| **Optional but recommended** | GL import recommended when trial balance imported |

### 23.3 Supported Formats

| Format | Content |
|--------|---------|
| **Excel** | Client GL extracts, auditor-requested schedules |
| **CSV** | ERP standard exports |
| **ERP Export** | SAP, Oracle, 1C, and similar GL detail extracts |

#### Expected Transaction Fields

| Field | Required |
|-------|----------|
| Transaction date | Yes |
| Account code | Yes |
| Amount (debit/credit or signed) | Yes |
| Description / narrative | Recommended |
| Journal reference | Recommended |
| Document reference | Optional |
| Counterparty | Optional |
| User / poster | Optional |

### 23.4 Transaction Validation

| Check | Severity |
|-------|----------|
| Required fields present | Critical |
| Valid date format | Critical |
| Account code exists in chart or flagged unmapped | Warning |
| Transaction date within or related to reporting period | Warning or error per policy |
| Zero-amount transactions | Excluded with count reported |
| Duplicate row detection | Warning — see Section 23.8 |

### 23.5 Journal Integrity

| Aspect | Product Behavior |
|--------|------------------|
| **Journal grouping** | Transactions with same journal reference grouped for balancing check |
| **Unbalanced journals** | Flagged as warning — may indicate extract issue |
| **Single-sided entries** | Flagged per double-entry expectation |
| **Reversal pairs** | Detected where reference patterns match — informational |

### 23.6 Opening Balance Handling

| Aspect | Product Behavior |
|--------|------------------|
| **Opening entries** | Identified by date, type, or mapping flag |
| **Treatment** | Opening balances reconciled to prior period closing where comparative exists |
| **First period** | Opening balance import supported; no prior reconciliation |
| **Mismatch** | Warning if opening balances do not match prior period trial balance |

### 23.7 Comparative Data

| Aspect | Product Behavior |
|--------|------------------|
| **Prior period GL** | May import prior period for trend analysis — separate version per period |
| **Comparative linkage** | Linked to comparative reporting period (Section 18) |
| **Cross-period analysis** | Financial intelligence uses validated GL from linked periods |

### 23.8 Duplicate Detection

| Aspect | Product Behavior |
|--------|------------------|
| **Within file** | Duplicate rows flagged by key (date, account, amount, reference) |
| **Across imports** | Re-import versioned — duplicates between versions informational |
| **User action** | User may exclude duplicates before staging or accept with acknowledgment |
| **Audit** | Duplicate handling decision logged |

### 23.9 Import Summary

| Summary Element | Description |
|-----------------|-------------|
| **Transaction count** | Total rows staged |
| **Date range** | Earliest and latest transaction dates |
| **Account coverage** | Distinct accounts with activity |
| **Total debits / credits** | GL totals |
| **TB reconciliation** | Comparison to trial balance totals where TB exists |
| **Warnings and errors** | Exception summary |
| **Source file** | Preserved original reference |

### 23.10 Permissions

| Capability | Financial Controller | Finance Director | Auditor (engagement grant) |
|------------|---------------------|------------------|---------------------------|
| Import general ledger | Yes | Yes | No |
| View GL data | Assigned company | Assigned company | Engagement-scoped read |
| View import summary | Yes | Yes | Read if granted |
| Cancel GL import session | Yes | Yes | No |

### 23.11 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **GL-AC-01** | User can import GL extract with transaction field mapping |
| **GL-AC-02** | Transactions outside period flagged per policy |
| **GL-AC-03** | Import summary shows transaction count and date range |
| **GL-AC-04** | GL totals compared to trial balance when both exist |
| **GL-AC-05** | Unbalanced journals flagged as warnings |
| **GL-AC-06** | Duplicate rows detected and reported |
| **GL-AC-07** | Source file preserved immutably |
| **GL-AC-08** | Re-import creates new version without deleting prior |
| **GL-AC-09** | Auditor can browse staged GL with engagement read grant |
| **GL-AC-10** | Opening balance mismatch generates warning vs prior period |

---

## 24. Import History & Data Management

Import History & Data Management governs the **lifecycle of import versions** — active version selection, rollback, audit trail, and ownership accountability across the financial data chain.

*Constitutional basis: PROJECT_BIBLE Business Rules FD-01, FD-04; Part 3 Section 17 Import stage; Core Principles 1, 2, 5.*

### 24.1 Import Sessions

| Concept | Definition |
|---------|------------|
| **Import session** | Single upload attempt from wizard start to staged, failed, or cancelled outcome |
| **Session record** | Immutable log of who imported what, when, for which company and period |
| **Session linkage** | Sessions grouped by data type within period import history |
| **Active session** | At most one in-progress session per user per data type recommended — warning if concurrent |

### 24.2 Import Versions

| Concept | Definition |
|---------|------------|
| **Import version** | Numbered iteration of imported data for a data type and period |
| **Active version** | Version currently designated for validation and downstream use |
| **Superseded version** | Prior version replaced as active — retained in history |
| **Version metadata** | Version number, session reference, timestamp, initiator, source file hash |
| **Dependency tracking** | Downstream artifacts (validation, classification) reference active import version |

```
Period: FY2026 — Trial Balance
├── Version 1 (superseded) — 15 Jan 2026 — imported
├── Version 2 (superseded) — 22 Jan 2026 — re-import corrected file
└── Version 3 (active)     — 05 Feb 2026 — final client submission
```

### 24.3 Replace Import

| Aspect | Product Behavior |
|--------|------------------|
| **Business meaning** | Designate a different existing version as active — without new upload |
| **Use case** | Revert to prior submission after reviewing versions |
| **Authorization** | Financial Controller or Finance Director |
| **Downstream** | Triggers re-validation requirement; invalidates dependent drafts |
| **Audit** | Version switch logged with reason |

*Replace is not deletion — it is **active version designation** within version chain.*

### 24.4 Rollback Import

| Aspect | Product Behavior |
|--------|------------------|
| **Business meaning** | Return active version to immediately prior version |
| **Use case** | Correct erroneous activation of wrong version |
| **Authorization** | Finance Director; Organization Owner if validated data affected |
| **Precondition** | Prior version must exist |
| **Downstream** | Full re-validation; classification and statement drafts invalidated |
| **Restriction** | Rollback blocked if period Locked |

Rollback preserves all versions — only changes which is **active**.

### 24.5 Import Audit Trail

| Event | Recorded |
|-------|----------|
| Session started | User, company, period, data type, timestamp |
| File uploaded | File name, size, format |
| Mapping applied | Profile used, manual overrides |
| Validation result (structural) | Pass, warnings, errors |
| Staging confirmed | User confirmation timestamp |
| Version activated | Active version change |
| Replace / rollback | Actor, from version, to version, reason |
| Cancel / fail | Status and reason |
| Source download | User, version, timestamp |

Import audit trail is **immutable** — no user deletion.

### 24.6 Import Ownership

| Role | Ownership |
|------|-----------|
| **Session initiator** | Accountable for upload accuracy and mapping |
| **Financial Controller** | Business owner of period financial data |
| **Finance Director** | Oversight; warning acknowledgment; replace/rollback authorization |
| **Auditor** | Observer — may document reliance on validated import in working papers |

### 24.7 Import Status (Consolidated)

| Status | Applies To | Meaning |
|--------|------------|---------|
| **In progress** | Session | Upload wizard active |
| **Staged** | Session / data | Parsed, awaiting validation workflow |
| **Failed** | Session | Parse or critical structural failure |
| **Cancelled** | Session | User cancelled before staging |
| **Active** | Version | Designated version for period |
| **Superseded** | Version | Historical — not active |
| **Validated** | Data | Passed Workflow 7 validation |
| **Failed validation** | Data | Critical errors in validation workflow |

### 24.8 Business Rules

| Rule | Description |
|------|-------------|
| **IH-01** | Source files never modified after upload (FD-01) |
| **IH-02** | Re-import always creates new version (FD-04) |
| **IH-03** | Active version explicitly designated — not implicit |
| **IH-04** | Replace/rollback requires reason and authorization |
| **IH-05** | Rollback blocked on Locked period |
| **IH-06** | Validated data dependency references import version (VER-03) |
| **IH-07** | Import history retained per organization retention policy |
| **IH-08** | Cross-tenant import history isolation absolute |

### 24.9 Permissions

| Capability | Financial Controller | Finance Director | Organization Owner | Auditor |
|------------|---------------------|------------------|-------------------|---------|
| View import history | Yes | Yes | Yes | Engagement read |
| Download source | Yes | Yes | Yes | If granted |
| Designate active version | Yes | Yes | Yes | No |
| Replace active version | Yes | Yes | Yes | No |
| Rollback version | No | Yes | Yes | No |
| View audit trail | Yes | Yes | Yes | Engagement read |

### 24.10 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **IH-AC-01** | Import history shows all versions chronologically |
| **IH-AC-02** | User can download original source for any version |
| **IH-AC-03** | Replace active version logs reason and triggers re-validation flag |
| **IH-AC-04** | Rollback blocked on Locked period |
| **IH-AC-05** | Re-import increments version number |
| **IH-AC-06** | Audit trail records all import lifecycle events |
| **IH-AC-07** | Active version visible on period and engagement financial summary |
| **IH-AC-08** | Superseded versions remain accessible read-only |
| **IH-AC-09** | Cross-company import history not visible |
| **IH-AC-10** | Validation results linked to specific import version |

---

## 25. User Journey — Engagement to Data Validation Readiness

End-to-end experience for importing financial data from an **accepted engagement** through readiness for the formal data validation workflow (PROJECT_BIBLE Workflow 7).

*Continues MASTER_PRD Part 4 Section 20 — "Ready to Import Trial Balance" milestone.*

### 25.1 Journey Overview

```
Open Engagement → Import Trial Balance → Review Validation
    → Import General Ledger → Import Successful → Ready for Financial Data Validation
```

**Primary actor:** Financial Controller (client side or firm on behalf of client). **Observer:** Audit Manager on engagement dashboard.

### 25.2 Step 1 — Open Engagement

| Perspective | Financial Controller or Audit Manager |
|-------------|--------------------------------------|
| **Where** | Workspace → Engagements → select engagement |
| **Sees** | Engagement dashboard — status Accepted or Planning; financial summary shows "Not imported" |
| **Action** | Click **Import Trial Balance** quick action or navigate to company → period |
| **Prerequisite** | Engagement Accepted; period Open |

**User sees:** Dashboard banner: "No trial balance imported for this period."

### 25.3 Step 2 — Import Trial Balance

| Perspective | Financial Controller |
|-------------|---------------------|
| **Wizard** | Data type: Trial balance → company and period pre-filled → upload Excel file |
| **Mapping** | Template detected; user confirms account code, name, debit, credit columns |
| **Currency** | Functional currency confirmed (e.g., AZN) |
| **Processing** | System parses file; runs structural validation |
| **Duration** | Progress indicator for large files |

**User sees:** Wizard steps with clear progress; file name displayed after upload.

### 25.4 Step 3 — Review Validation

| Perspective | Financial Controller |
|-------------|---------------------|
| **Preview screen** | Account list, total debits/credits, balance check |
| **Pass scenario** | Green balance check — debits equal credits |
| **Warning scenario** | Unmapped accounts flagged — user may proceed to staging with warnings |
| **Fail scenario** | Out of balance — user returns to correct file; re-uploads |
| **Confirm** | User confirms staging |

**User sees:** Validation summary with pass/fail/warning counts; cannot confirm if critical errors.

### 25.5 Step 4 — Import General Ledger

| Perspective | Financial Controller |
|-------------|---------------------|
| **Entry** | Prompted after TB staging: "Import general ledger for drill-down?" |
| **Wizard** | Data type: General ledger → same period → upload ERP extract |
| **Mapping** | Date, account, amount, description, reference mapped |
| **Reconciliation preview** | GL totals compared to trial balance |
| **Confirm** | User stages GL |

**User sees:** Import summary with transaction count and TB reconciliation status.

### 25.6 Step 5 — Import Successful

| Perspective | Financial Controller and Audit Manager |
|-------------|----------------------------------------|
| **Trial balance status** | Imported (staged) |
| **General ledger status** | Imported (staged) |
| **Import history** | Version 1 active for each data type |
| **Engagement dashboard** | Financial summary updates — "Staged — validation pending" |
| **Notification** | Finance Director notified of staged data |

**User sees:** Success confirmation with links to import history and **Start Validation**.

### 25.7 Step 6 — Ready for Financial Data Validation

| Milestone | Criteria |
|-----------|----------|
| **Data staged** | Trial balance staged; GL staged (recommended) |
| **Source preserved** | Original files in import history |
| **Active version** | Version 1 designated active |
| **Period** | Still Open or In Close |
| **Next workflow** | Workflow 7 — Data Validation (future PRD part) |

| Perspective | Financial Controller |
|-------------|---------------------|
| **Action** | Click **Start Validation** on period or engagement dashboard |
| **Outcome** | Enters formal validation workflow — structural, business, GL-to-TB reconciliation |
| **Auditor** | Audit Manager sees financial summary update on engagement dashboard — may begin planning while client validates |

**User sees:** Milestone badge: **Ready for Financial Data Validation** with checklist all green except validation itself.

### 25.8 Journey Diagram

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Open     │───►│   Import    │───►│   Review    │
│ Engagement  │    │ Trial Bal.  │    │ Validation  │
└─────────────┘    └─────────────┘    └──────┬──────┘
                                             │
┌─────────────┐    ┌─────────────┐    ┌──────▼──────┐
│   Ready     │◄───│  Import     │◄───│   Import    │
│ Validation  │    │ Successful  │    │     GL      │
└─────────────┘    └─────────────┘    └─────────────┘
```

### 25.9 Journey Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **FJ-AC-01** | Import trial balance reachable from engagement dashboard in ≤3 clicks |
| **FJ-AC-02** | Company and period pre-filled when launched from engagement |
| **FJ-AC-03** | User cannot confirm unbalanced trial balance |
| **FJ-AC-04** | GL import offered after successful TB staging |
| **FJ-AC-05** | Engagement financial summary updates after staging |
| **FJ-AC-06** | Ready for validation milestone displayed when TB staged |
| **FJ-AC-07** | Audit Manager sees updated financial summary without import capability |

---

## PRD Review Notes — Part 5

Consistency review of MASTER_PRD Part 5 against PROJECT_BIBLE (Parts 1–15) and MASTER_PRD Parts 1–4. No previous sections modified.

### Constitutional Alignment

| Area | Status | Notes |
|------|--------|-------|
| Traceability chain (Bible §16) | Aligned | Import preserves path to Original Excel Cell |
| FD-01 through FD-06 | Aligned | Sections 21–24 business rules |
| Workflow 5, 6, 7 | Aligned | Sections 22, 23, 25 — Workflow 7 entry at journey end |
| Data lifecycle Import stage (§17) | Aligned | Staging vs validation distinction maintained |
| Core Principle 1 (traceable) | Aligned | Import sessions, versions, audit trail |
| Core Principle 6 (source sacred) | Aligned | Immutable source preservation |

### MASTER_PRD Parts 1–4 Alignment

| Area | Status |
|------|--------|
| PRD4-03 (Trial Balance Import module) | Addressed — Sections 21–22 |
| Part 4 Section 20 readiness milestone | Section 25 continues journey |
| Financial Period states (§18) | Import gated on Open/In Close; blocked on Locked |
| Engagement dashboard financial summary (§19) | Referenced in journey |
| Permission model (Part 3) | Financial Controller imports; Auditor read-only |

### Terminology Consistency

| Term | Status |
|------|--------|
| Imported vs Validated vs Staged | Distinct statuses — consistent with Bible Workflow 7 |
| Import session vs import version | Session = attempt; version = numbered iteration |
| Re-import vs replace vs rollback | Clearly distinguished in Section 24 |
| Trial balance vs general ledger | Consistent with Part 8 entities |
| Supporting schedule | Mentioned in §21 — detail deferred |

### Multi-Tenant & Auditability

| Area | Status |
|------|--------|
| Company-period scoping | All imports scoped — no cross-tenant leakage |
| Import audit trail | Section 24.5 — immutable |
| User attribution | Session initiator and ownership defined |
| Engagement linkage | Imports visible in engagement context |

### Editorial Recommendations

| ID | Recommendation |
|----|----------------|
| **PRD5-01** | Data Validation workflow (Bible Workflow 7) — full specification in Part 6 |
| **PRD5-02** | Chart of Accounts mapping profiles — detail in classification PRD part |
| **PRD5-03** | Supporting schedule import (payroll, inventory) — extend Section 21 in future |
| **PRD5-04** | Future API imports — integration PRD when ERP connectivity delivered |
| **PRD5-05** | Cell-level traceability (TRC-02) — confirm in trial balance preview UI spec |
| **PRD5-06** | Multi-currency import and conversion workflow — future part |
| **PRD5-07** | Import invalidation rules for approved statements — cross-reference PRD4-06 |

### Review Conclusion

MASTER_PRD Part 5 is **consistent with PROJECT_BIBLE and Parts 1–4**. It specifies financial data ingestion with source preservation, versioning, and validation readiness without contradicting traceability philosophy, period governance, or permission model. PRD5-01 through PRD5-07 guide subsequent PRD parts.

---

## Document Control — Part 5

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.5.0 | 2026-06-30 | Chief Product Officer | Part 5 — Financial Data Import & Source Management complete; PRD Review Notes Part 5 included |

---

*End of Part 5.*

---

## Part 6 — Financial Data Validation, Chart of Accounts & IFRS Classification

### Table of Contents — Part 6

26. [Financial Data Validation Module](#26-financial-data-validation-module)
27. [Chart of Accounts Management](#27-chart-of-accounts-management)
28. [IFRS Mapping Module](#28-ifrs-mapping-module)
29. [Classification Review](#29-classification-review)
30. [User Journey — Validation to Statement Readiness](#30-user-journey--validation-to-statement-readiness)

---

## 26. Financial Data Validation Module

The Financial Data Validation module **certifies imported financial data** as fit for classification, reporting, and audit reliance — executing structural and business integrity checks before downstream workflows may proceed.

*Constitutional basis: PROJECT_BIBLE Part 3 Workflow 7; Business Rules FD-02, FD-03, FD-06; Part 3 Section 17 Validation stage.*

### 26.1 Purpose

Transform **staged import data** into **validated financial data** through governed validation rules — producing a validation report, exception list, and certified data status that gates IFRS classification and financial statement composition.

Import succeeds at ingestion; validation certifies fitness for professional use (FD-03).

### 26.2 Business Goals

| Goal | Description |
|------|-------------|
| **Data fitness certification** | Unvalidated data cannot reach classification or statements (FD-03) |
| **Balance integrity** | Trial balance debits equal credits (FD-02) |
| **Reconciliation** | GL totals reconcile to trial balance where both imported |
| **Actionable exceptions** | Errors and warnings returned with remediation guidance |
| **Warning governance** | Warnings require documented acknowledgment before progression |
| **Version linkage** | Validation results tied to import version (VER-03) |
| **Audit defensibility** | Validation report retained for auditor and regulator inspection |
| **Re-validation discipline** | Re-import triggers mandatory re-validation |

### 26.3 Validation Lifecycle

```
Staged Import → Validation Triggered → Rules Executed → Exception Review
    → Remediation (if needed) → Warning Acknowledgment → Validated Status
```

| Stage | Description |
|-------|-------------|
| **Staged** | Import complete — validation not yet run |
| **In validation** | Rules executing against active import version |
| **Failed** | Critical errors — remediation required |
| **Passed with warnings** | No critical errors; warnings pending acknowledgment |
| **Validated** | All critical errors resolved; warnings acknowledged |
| **Superseded** | New import version — re-validation required |

### 26.4 Validation Rules

Validation rules are grouped into **structural**, **business**, and **reconciliation** categories. Rules execute against the active import version for a company reporting period.

| Rule Category | Scope |
|---------------|-------|
| **Structural** | Format, completeness, mandatory fields, balance arithmetic |
| **Business** | Period, currency, account integrity, duplicates |
| **Reconciliation** | Trial balance to general ledger; opening balance consistency |
| **Reference** | Chart of accounts linkage; cross-period consistency |

Rules are **configurable per organization and workspace** within platform-defined rule catalog — not hardcoded exceptions for individual customers without audit trail.

### 26.5 Mandatory Fields

| Data Type | Mandatory Elements |
|-----------|-------------------|
| **Trial balance** | Account code, account name, debit or credit balance |
| **General ledger** | Transaction date, account code, amount |
| **Import metadata** | Company, period, currency declaration |

Missing mandatory fields produce **critical errors** — validation cannot pass.

### 26.6 Balance Validation

| Check | Severity | Rule |
|-------|----------|------|
| Total debits equal total credits | Critical | FD-02 |
| Net balance per account consistent with debit/credit columns | Critical |
| No account with both material debit and credit without explanation | Warning |
| Zero-balance accounts present | Informational |
| Account count within expected range vs prior period | Warning if significant variance |

### 26.7 Debit/Credit Validation

| Check | Severity |
|-------|----------|
| Valid numeric format for all amounts | Critical |
| Negative values in debit column handled per convention | Warning if ambiguous |
| Single-sided trial balance entries flagged | Warning |
| Rounding differences within tolerance | Pass with informational note |
| Rounding differences exceeding tolerance | Warning |

### 26.8 Duplicate Detection

| Check | Scope | Severity |
|-------|-------|----------|
| Duplicate account codes in trial balance | Within file | Critical |
| Duplicate GL transaction keys | Within file | Warning |
| Duplicate import version | Across versions | Informational — versioned separately |

### 26.9 Currency Validation

| Check | Severity |
|-------|----------|
| Declared import currency matches company functional currency | Warning if mismatch — conversion required |
| Mixed currency columns in single import | Critical |
| Currency symbol in amount fields | Warning — normalization applied |
| All amounts in consistent currency unit | Critical |

FD-06: currency declaration enforced at import; validation confirms consistency.

### 26.10 Period Validation

| Check | Severity |
|-------|----------|
| Import target period is Open or In Close | Critical if Locked |
| GL transaction dates predominantly within reporting period | Warning |
| Transactions outside period exceed threshold | Warning or error per policy |
| Period end date aligns with company fiscal year | Critical if mismatch |
| Comparative period exists where configured | Informational |

### 26.11 Account Integrity

| Check | Severity |
|-------|----------|
| Account codes parse without corruption | Critical |
| Account codes exist in chart of accounts or flagged as new | Warning |
| Inactive accounts with balances | Warning |
| Account name missing | Warning |
| Account code format matches company convention | Informational |

### 26.12 Reference Integrity

| Check | Severity |
|-------|----------|
| GL account codes reference valid chart accounts | Warning |
| GL journal references internally consistent | Warning |
| Trial balance accounts link to GL activity where GL imported | Informational |
| Import version matches active version designated | Critical |
| Prior validated version dependency intact | Informational |

### 26.13 Error Categories

Errors **block** progression to classification and reporting.

| Category | Examples |
|----------|----------|
| **Critical balance** | Debits ≠ credits |
| **Critical format** | Unparseable file structure after staging |
| **Critical period** | Import to Locked period |
| **Critical duplicate** | Duplicate account codes |
| **Critical currency** | Mixed currencies without declaration |
| **Critical reference** | Active import version mismatch |

Each error includes: code, description, affected records, remediation guidance.

### 26.14 Warning Categories

Warnings **allow** progression after documented acknowledgment by Finance Director.

| Category | Examples |
|----------|----------|
| **Account mapping** | Accounts not in chart of accounts |
| **Period boundary** | GL transactions outside period |
| **Reconciliation** | GL to TB variance within review threshold |
| **Convention** | Ambiguous debit/credit sign convention |
| **Variance** | Material change vs prior period account count |
| **Inactive accounts** | Balances on deactivated accounts |

### 26.15 Validation Summary

| Summary Element | Description |
|-----------------|-------------|
| **Overall status** | Failed / Passed with warnings / Validated |
| **Error count** | By category |
| **Warning count** | By category |
| **Balance totals** | Debits, credits, difference |
| **GL reconciliation** | TB vs GL variance if applicable |
| **Account statistics** | Count, new accounts, unmapped |
| **Import version** | Version validated |
| **Validator** | User who triggered validation |
| **Timestamp** | Validation execution time |
| **Report export** | Downloadable validation report for audit file |

### 26.16 Permissions

| Capability | Financial Controller | Finance Director | Auditor (engagement grant) | CFO |
|------------|---------------------|------------------|---------------------------|-----|
| Trigger validation | Yes | Yes | No | No |
| View validation report | Yes | Yes | Read | Read |
| Remediate errors (re-import) | Yes | Yes | No | No |
| Acknowledge warnings | No | Yes | No | No |
| Override validation block | No | No | No | Organization Owner only (exceptional) |
| View validation history | Yes | Yes | Read | Read |

### 26.17 Business Validations

| Validation | Rule |
|------------|------|
| **VAL-V01** | Validation requires staged import — no validation without data |
| **VAL-V02** | Critical errors block Validated status (FD-03) |
| **VAL-V03** | Warnings require Finance Director acknowledgment |
| **VAL-V04** | Re-import invalidates prior validation — re-run required |
| **VAL-V05** | Validation results versioned with import version |
| **VAL-V06** | Validation report immutable once finalized |
| **VAL-V07** | Classification workflow blocked until Validated status |
| **VAL-V08** | Auditor cannot trigger validation — observe only |

### 26.18 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **VAL-AC-01** | User can trigger validation on staged trial balance |
| **VAL-AC-02** | Unbalanced trial balance fails validation with critical error |
| **VAL-AC-03** | GL-to-TB reconciliation displayed when both imported |
| **VAL-AC-04** | Warnings require Finance Director acknowledgment before Validated |
| **VAL-AC-05** | Classification blocked until Validated status |
| **VAL-AC-06** | Validation report exportable with full exception detail |
| **VAL-AC-07** | Re-import triggers re-validation requirement |
| **VAL-AC-08** | Validation results linked to specific import version |
| **VAL-AC-09** | Auditor can view validation report with engagement read grant |
| **VAL-AC-10** | Validation history shows all runs for period |

---

## 27. Chart of Accounts Management

Chart of Accounts Management governs the **structured catalog of ledger accounts** for a company — the bridge between client accounting codes and IFRS classification.

*Constitutional basis: PROJECT_BIBLE Part 8 Chart of Accounts and Account entities; Part 2 Section 12.*

### 27.1 Purpose

Define, maintain, and govern the **account hierarchy** used for import mapping, validation, IFRS classification, and audit testing — ensuring account integrity across reporting periods.

### 27.2 Business Goals

| Goal | Description |
|------|-------------|
| **Import alignment** | Trial balance and GL accounts map to defined chart |
| **Classification foundation** | IFRS mapping rules reference chart accounts |
| **Hierarchy support** | Parent-child structure for roll-up and reporting |
| **Lifecycle control** | Activation and deactivation without destroying history |
| **Template efficiency** | Default charts accelerate new company setup |
| **Version discipline** | Chart changes versioned with effective dates |

### 27.3 Default Chart of Accounts

| Aspect | Product Behavior |
|--------|------------------|
| **Source** | Workspace or organization published templates |
| **Application** | Assigned at company creation (MASTER_PRD Section 9) |
| **Industry variants** | Banking, insurance, manufacturing, general templates |
| **Customization** | Company may extend default — not replace without migration |
| **Governance** | Template publication requires Workspace Administrator approval |

### 27.4 Custom Chart of Accounts

| Aspect | Product Behavior |
|--------|------------------|
| **Creation** | Financial Controller builds custom chart for company |
| **Import-driven** | New accounts auto-suggested from import validation warnings |
| **Structure** | User defines hierarchy, codes, names, types |
| **Approval** | Finance Director approves material chart changes |
| **Versioning** | Changes create new chart version with effective date |

### 27.5 Account Categories

| Category | Description | IFRS Relevance |
|----------|-------------|----------------|
| **Assets** | Resources with future economic benefit | Statement of financial position |
| **Liabilities** | Present obligations | Statement of financial position |
| **Equity** | Residual interest | Statement of financial position |
| **Income** | Revenue and gains | Statement of profit or loss |
| **Expenses** | Costs and losses | Statement of profit or loss |
| **Off-balance / memo** | Statistical or memo accounts | Disclosure or lead sheet only |

### 27.6 Account Types

| Type | Description |
|------|-------------|
| **Header / group** | Roll-up account — no posting |
| **Posting** | Transaction-level account |
| **Sub-account** | Child of posting or group account |
| **Statistical** | Non-monetary — excluded from balance validation |
| **Intercompany** | Flagged for consolidation elimination (future) |

### 27.7 Parent/Child Structure

```
Assets (header)
├── Non-current assets (group)
│   ├── Property, plant and equipment (posting)
│   └── Intangible assets (posting)
└── Current assets (group)
    ├── Trade receivables (posting)
    └── Cash and equivalents (posting)
```

| Rule | Description |
|------|-------------|
| **Single parent** | Each account has at most one parent |
| **No circular references** | Parent cannot be descendant of child |
| **Roll-up** | Trial balance amounts aggregate to parent for reporting views |
| **Posting restriction** | Balances on header accounts flagged — should be zero |

### 27.8 Account Activation

| Aspect | Product Behavior |
|--------|------------------|
| **New accounts** | Created active by default |
| **Import discovery** | Accounts from import may be added as active pending review |
| **Effect** | Active accounts available for mapping and classification |
| **Audit** | Activation logged |

### 27.9 Account Deactivation

| Aspect | Product Behavior |
|--------|------------------|
| **Trigger** | Account no longer used — obsolete code |
| **Effect** | Excluded from new mapping suggestions; historical data retained |
| **Balance warning** | Deactivation with current balance generates warning |
| **Reactivation** | Permitted with Finance Director approval |
| **Audit** | Deactivation logged with reason |

### 27.10 Account Merge (Future)

| Aspect | Planned Behavior |
|--------|------------------|
| **Purpose** | Combine duplicate or superseded accounts |
| **Effect** | Map historical data to surviving account |
| **Governance** | Finance Director approval; full audit trail |
| **IFRS impact** | Mapping rules updated for merged accounts |

Account merge is **future capability** — MVP uses deactivation plus manual mapping update.

### 27.11 Permissions

| Capability | Financial Controller | Finance Director | Workspace Administrator | Auditor |
|------------|---------------------|------------------|------------------------|---------|
| View chart | Yes | Yes | Yes | Engagement read |
| Add/edit accounts | Yes | Yes | No | No |
| Approve chart changes | No | Yes | No | No |
| Publish default template | No | No | Yes | No |
| Deactivate account | Yes | Yes | No | No |

### 27.12 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **COA-AC-01** | Default chart applied at company creation |
| **COA-AC-02** | User can add custom account with category and type |
| **COA-AC-03** | Parent-child hierarchy enforced without circular references |
| **COA-AC-04** | Import validation flags accounts not in chart |
| **COA-AC-05** | Deactivated account excluded from new mapping |
| **COA-AC-06** | Chart changes versioned with effective date |
| **COA-AC-07** | Finance Director approval required for material chart changes |
| **COA-AC-08** | Auditor can view chart with engagement read grant |

---

## 28. IFRS Mapping Module

The IFRS Mapping module maps **chart of accounts entries to IFRS presentation categories** — determining how trial balance amounts appear in primary financial statements and notes.

*Constitutional basis: PROJECT_BIBLE Part 3 Workflows 8–9; Part 8 IFRS Classification entity; Part 14 Section 72; Business Rule CO-01.*

### 28.1 Purpose

Apply governed mapping rules to validated trial balance accounts — producing a **classified trial balance** ready for financial statement composition, with full traceability from IFRS line item to source account and import cell.

### 28.2 Business Goals

| Goal | Description |
|------|-------------|
| **IFRS compliance** | Accounts mapped to correct presentation categories per declared framework |
| **Rule governance** | Mapping rules versioned and approved before application |
| **Efficiency** | Rule-based and bulk mapping reduce manual effort |
| **AI assistance** | AI suggests mappings — human approves (Workflow 8) |
| **Exception visibility** | Unmapped accounts blocked from statement generation |
| **Audit trail** | Every mapping and override traceable |
| **Materiality** | Material accounts require explicit classification before statements |

### 28.3 Account Mapping

| Concept | Description |
|---------|-------------|
| **Source** | Chart of accounts account code |
| **Target** | IFRS presentation category and financial statement line |
| **Cardinality** | One account maps to one primary IFRS category per period |
| **Balance** | Account balance flows to mapped statement line |
| **Notes** | Mapping may trigger disclosure note requirements |

#### IFRS Presentation Hierarchy (Summary)

| Level | Examples |
|-------|----------|
| **Statement** | Statement of financial position, profit or loss, cash flows, changes in equity |
| **Section** | Current assets, non-current liabilities, operating expenses |
| **Line item** | Trade receivables, Revenue, Depreciation |
| **Sub-line** | Allowance for doubtful debts (disclosure detail) |

### 28.4 Rule-Based Mapping

| Aspect | Product Behavior |
|--------|------------------|
| **Mapping rules** | Condition → IFRS category (e.g., account code range, name pattern, account type) |
| **Priority** | Rules evaluated in priority order — first match wins |
| **Source** | Firm-published rules at workspace level |
| **Application** | Rules applied automatically during classification run |
| **Version** | Rules versioned — classification records rule version used (VER-03) |
| **Approval** | Only approved mapping rule versions applied to production classification |

### 28.5 Manual Mapping

| Aspect | Product Behavior |
|--------|------------------|
| **Trigger** | User maps individual account not covered by rules |
| **UI** | Account list with IFRS category selector |
| **Validation** | Proposed category validated against IFRS template |
| **Persistence** | Manual mapping may create new rule for future periods |
| **Attribution** | User and timestamp recorded |

### 28.6 Bulk Mapping

| Aspect | Product Behavior |
|--------|------------------|
| **Selection** | Multi-select accounts with shared target category |
| **Apply** | Single IFRS category assigned to selection |
| **Filter** | Bulk apply to unmapped accounts by account type or category |
| **Review** | Bulk mapping enters review queue before approval |
| **Audit** | Bulk operation logged as single event with account list |

### 28.7 Suggested Mapping

| Source | Product Behavior |
|--------|------------------|
| **Rule engine** | Automatic from approved mapping rules |
| **Prior period** | Suggest same mapping as prior validated period |
| **AI suggestion** | AI proposes category with cited rule, prior mapping, or standards reference |
| **Confidence** | AI suggestions display confidence and limitations |
| **Status** | Suggestions remain **Suggested** until human approval — not active |

AI cannot finalize classifications (Workflow 8, AI-01).

### 28.8 Unmapped Accounts

| Aspect | Product Behavior |
|--------|------------------|
| **Detection** | Accounts without IFRS category after classification run |
| **Severity** | Material unmapped accounts block statement generation |
| **Report** | Unmapped account exception list |
| **Remediation** | Manual mapping, new rule, or bulk mapping |
| **Immateral aggregation** | Immaterial unmapped may aggregate with disclosure per materiality policy |

### 28.9 Mapping Review

| Aspect | Product Behavior |
|--------|------------------|
| **Review queue** | Classifications pending Finance Director review |
| **Sample review** | Risk-based sample of rule-applied mappings for spot check |
| **Override visibility** | AI suggestions and manual overrides highlighted |
| **Comment** | Reviewer records review notes |
| **Clearance** | Review notes cleared before approval |

### 28.10 Mapping Approval

| Aspect | Product Behavior |
|--------|------------------|
| **Submitter** | Financial Controller submits classified trial balance |
| **Approver** | Finance Director approves classification package |
| **Gate** | Statement generation blocked until approval |
| **Material overrides** | Require explicit Finance Director approval per account (Workflow 9) |
| **Lock** | Approved classification locked with period — changes require override workflow |

### 28.11 Mapping Versioning

| Dimension | Versioned |
|-----------|-----------|
| **Mapping rules** | Firm rule set versions with effective dates |
| **Classification run** | Each execution produces classification version |
| **Approved classification** | Locked version referenced by statements |
| **Overrides** | Each override creates classification sub-version |
| **Dependency** | Classification version references import version and rule version |

### 28.12 Mapping History

| History Element | Description |
|-----------------|-------------|
| **Rule changes** | Who changed which rule, when, effective date |
| **Classification runs** | Each run with account count mapped, unmapped, overridden |
| **Approvals** | Approval chain for each classification version |
| **Overrides** | Original and new category with justification |
| **Comparison** | Period-over-period mapping changes |

### 28.13 Permissions

| Capability | Financial Controller | Finance Director | Auditor | Workspace Administrator |
|------------|---------------------|------------------|---------|------------------------|
| Run classification | Yes | Yes | No | No |
| Manual / bulk map | Yes | Yes | No | No |
| Accept AI suggestion | Yes | Yes | No | No |
| Submit for approval | Yes | Yes | No | No |
| Approve classification | No | Yes | No | No |
| Publish mapping rules | No | No | No | Yes |
| View mapping history | Yes | Yes | Read | Yes |
| View overrides | Yes | Yes | Read | No |

### 28.14 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **MAP-AC-01** | Classification blocked until trial balance Validated |
| **MAP-AC-02** | Rule-based mapping applies approved rule version |
| **MAP-AC-03** | Unmapped material accounts block statement generation |
| **MAP-AC-04** | AI suggestion requires explicit human acceptance |
| **MAP-AC-05** | Bulk mapping applies to multi-selected accounts |
| **MAP-AC-06** | Finance Director approval required before statements |
| **MAP-AC-07** | Classification version references import and rule versions |
| **MAP-AC-08** | Mapping history shows all overrides with justification |
| **MAP-AC-09** | Prior period mapping suggested for recurring accounts |
| **MAP-AC-10** | Auditor can view approved classification read-only |

---

## 29. Classification Review

Classification Review governs the **human oversight workflow** for IFRS classifications — ensuring professional review, override discipline, and approval before financial statement generation.

*Constitutional basis: PROJECT_BIBLE Part 3 Workflows 8–9; Part 14 Section 74 disclosure linkage.*

### 29.1 Review Queue

| Queue Content | Description |
|---------------|-------------|
| **Pending submission** | Classification run complete — awaiting controller submission |
| **Pending review** | Submitted — awaiting Finance Director review |
| **Pending override approval** | Material overrides awaiting director approval |
| **AI suggestions pending** | Unaccepted AI suggestions requiring decision |
| **Rejected items** | Returned to preparer with review comments |

Queue filtered by company, period, and assigned reviewer.

### 29.2 Reviewer Workflow

```
Receive Submission → Sample / Full Review → Record Review Notes
    → Request Changes OR Clear for Approval → Approve Classification
```

| Step | Actor | Action |
|------|-------|--------|
| **Submit** | Financial Controller | Submit classified trial balance with unmapped exception report |
| **Review** | Finance Director | Examine mappings, overrides, AI acceptances, material accounts |
| **Challenge** | Finance Director | Record review notes on specific accounts |
| **Resolve** | Financial Controller | Address notes — remapping or justification |
| **Approve** | Finance Director | Approve classification package |
| **Notify** | System | Auditor and engagement team notified of approved classification |

### 29.3 Override Process

| Step | Requirement |
|------|-------------|
| **Identify** | Controller identifies incorrect automated or rule-based classification |
| **Propose** | Select new IFRS category |
| **Justify** | Business justification text required (Workflow 9) |
| **Materiality check** | Material overrides route to Finance Director |
| **Apply** | Override applied — original classification preserved in history |
| **Recalculate** | Affected statement line subtotals updated in preview |

### 29.4 Approval Workflow

| Artifact | Approval Chain |
|----------|---------------|
| **Standard classification** | Financial Controller (submit) → Finance Director (approve) |
| **Material override** | Financial Controller (initiate) → Finance Director (approve) |
| **Classification with acknowledged warnings** | Finance Director documents acknowledgment |
| **Reclassification after approval** | New override workflow — invalidates statement drafts |

Approval recorded with timestamp, approver, and classification version (APR-05).

### 29.5 Rejected Classifications

| Aspect | Product Behavior |
|--------|------------------|
| **Rejection** | Finance Director rejects submission with comments |
| **Effect** | Classification returns to preparer — not approved |
| **Status** | Remains in review queue as rejected |
| **Resolution** | Preparer addresses comments and resubmits |
| **History** | Rejection and resubmission in audit trail |

### 29.6 Reclassification

| Aspect | Product Behavior |
|--------|------------------|
| **Trigger** | Mapping rule change, override, or import version change after prior classification |
| **Effect** | New classification run; prior version superseded |
| **Downstream** | Statement and note drafts invalidated until regeneration |
| **Approved period** | Reclassification on locked classification requires override authorization |
| **Audit** | Reclassification reason documented |

### 29.7 Audit Trail

| Event | Recorded |
|-------|----------|
| Classification run | User, rule version, import version, timestamp |
| AI suggestion | Suggestion, acceptance/rejection, user, rationale if rejected |
| Manual / bulk mapping | Accounts affected, target category, user |
| Override | Original, new, justification, approver |
| Review notes | Author, text, resolution, clearance |
| Submission / rejection / approval | Actor, timestamp, version |
| Reclassification | Trigger, prior version, new version |

### 29.8 Business Rules

| Rule | Description |
|------|-------------|
| **CLR-01** | All material accounts classified before approval |
| **CLR-02** | Every override requires justification |
| **CLR-03** | Material overrides require Finance Director approval |
| **CLR-04** | Original classification preserved on override — not deleted |
| **CLR-05** | AI classification requires human acceptance — not auto-applied |
| **CLR-06** | Approved classification uses approved mapping rule version only |
| **CLR-07** | Auditor visibility of overrides where engagement access granted |
| **CLR-08** | Statement generation blocked until classification approved |

### 29.9 Permissions

| Capability | Financial Controller | Finance Director | Auditor | CFO |
|------------|---------------------|------------------|---------|-----|
| Submit classification | Yes | Yes | No | No |
| Review and note | No | Yes | No | No |
| Approve classification | No | Yes | No | No |
| Reject submission | No | Yes | No | No |
| Initiate override | Yes | Yes | No | No |
| Approve material override | No | Yes | No | No |
| View approved classification | Yes | Yes | Read | Read |
| View override history | Yes | Yes | Read | No |

### 29.10 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **CLR-AC-01** | Finance Director review queue shows pending submissions |
| **CLR-AC-02** | Rejection returns classification to preparer with comments |
| **CLR-AC-03** | Override without justification blocked |
| **CLR-AC-04** | Material override requires director approval |
| **CLR-AC-05** | Original classification visible after override |
| **CLR-AC-06** | Approved classification unlocks statement generation gate |
| **CLR-AC-07** | Reclassification invalidates draft statements flag |
| **CLR-AC-08** | Auditor can view overrides on engagement with read grant |
| **CLR-AC-09** | AI rejected suggestions retained in audit trail |
| **CLR-AC-10** | Full classification audit trail exportable |

---

## 30. User Journey — Validation to Statement Readiness

End-to-end experience from **staged trial balance** through **approved classification** — ready for financial statement generation (PROJECT_BIBLE Workflow 11).

*Continues MASTER_PRD Part 5 Section 25 — "Ready for Financial Data Validation" milestone.*

### 30.1 Journey Overview

```
Trial Balance Imported → Validation Executed → Validation Errors Reviewed
    → Chart of Accounts Reviewed → IFRS Mapping Completed
        → Classification Approved → Ready for Financial Statement Generation
```

**Primary actor:** Financial Controller. **Approver:** Finance Director. **Observer:** Audit Manager on engagement.

### 30.2 Step 1 — Trial Balance Imported

| Perspective | Financial Controller |
|-------------|---------------------|
| **State** | Trial balance staged (Imported status) from Part 5 journey |
| **Where** | Company → reporting period → financial data |
| **Sees** | Banner: "Validation required" with **Start Validation** action |
| **Prerequisite** | Active import version designated |

**User sees:** Period status shows Staged — not yet Validated.

### 30.3 Step 2 — Validation Executed

| Perspective | Financial Controller |
|-------------|---------------------|
| **Action** | Clicks **Start Validation** |
| **Processing** | System runs structural, business, and reconciliation rules |
| **Duration** | Progress indicator; large datasets may take moments |
| **Outcome** | Validation report generated |

**User sees:** Validation summary — pass, fail, or warnings count.

### 30.4 Step 3 — Validation Errors Reviewed

| Perspective | Financial Controller and Finance Director |
|-------------|------------------------------------------|
| **Fail path** | Critical errors listed — e.g., out of balance, duplicate accounts |
| **Remediation** | Controller re-imports corrected file (new version) or fixes chart |
| **Re-validate** | Validation re-run on new version |
| **Warning path** | Finance Director reviews warnings — GL/TB variance, unmapped accounts |
| **Acknowledge** | Director acknowledges warnings with comment |
| **Outcome** | Status → **Validated** |

**User sees:** Exception list with remediation links; acknowledgment dialog for warnings.

### 30.5 Step 4 — Chart of Accounts Reviewed

| Perspective | Financial Controller |
|-------------|---------------------|
| **Trigger** | Validation flagged accounts not in chart |
| **Action** | Review chart — add missing accounts, deactivate obsolete, correct hierarchy |
| **New accounts from import** | Accept or merge suggested accounts from validation |
| **Approval** | Material chart changes submitted to Finance Director |
| **Outcome** | Chart aligned with trial balance accounts |

**User sees:** Chart view with highlighted new or unmapped accounts from validation.

### 30.6 Step 5 — IFRS Mapping Completed

| Perspective | Financial Controller |
|-------------|---------------------|
| **Action** | Run **IFRS Classification** |
| **Rule application** | Approved mapping rules applied automatically |
| **AI suggestions** | Review AI-proposed mappings — accept or reject each |
| **Manual** | Map remaining unmapped accounts individually or in bulk |
| **Preview** | Classified trial balance preview — statement line subtotals |
| **Unmapped** | Zero material unmapped accounts before submission |

**User sees:** Mapping workspace with tabs: Suggested, Unmapped, Mapped, AI Pending.

### 30.7 Step 6 — Classification Approved

| Perspective | Financial Controller and Finance Director |
|-------------|------------------------------------------|
| **Submit** | Controller submits classification package |
| **Review** | Director reviews queue — spot-checks material accounts and overrides |
| **Notes** | Director records review notes if issues found — iterative resolution |
| **Approve** | Director approves classification |
| **Lock** | Approved classification locked to period and import version |
| **Notification** | Audit Manager sees financial summary update on engagement dashboard |

**User sees:** Approval confirmation; classification status **Approved**.

### 30.8 Step 7 — Ready for Financial Statement Generation

| Milestone | Criteria |
|-----------|----------|
| **Data validated** | Trial balance Validated status |
| **Chart complete** | All trial balance accounts in chart |
| **Classification approved** | Finance Director approval recorded |
| **Import linkage** | Active import and classification versions linked |
| **Next workflow** | Workflow 11 — Financial Statement Generation (future PRD part) |

| Perspective | Financial Controller |
|-------------|---------------------|
| **Action** | **Generate Financial Statements** enabled on period and engagement dashboard |
| **Auditor** | Audit Manager begins planning linkage to classified balances and lead sheets |

**User sees:** Milestone badge: **Ready for Financial Statement Generation** with green checklist.

### 30.9 Journey Diagram

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Trial Bal.  │───►│ Validation  │───►│  Errors &   │
│  Imported   │    │  Executed   │    │  Warnings   │
└─────────────┘    └─────────────┘    └──────┬──────┘
                                             │
┌─────────────┐    ┌─────────────┐    ┌──────▼──────┐
│   Ready     │◄───│ Classif.    │◄───│    IFRS     │
│ Statements  │    │  Approved   │    │   Mapping   │
└─────────────┘    └─────────────┘    └──────┬──────┘
                                             │
                                      ┌──────▼──────┐
                                      │    Chart    │
                                      │  Reviewed   │
                                      └─────────────┘
```

### 30.10 Journey Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **CJ-AC-01** | Validation reachable in one click from staged period |
| **CJ-AC-02** | User cannot proceed to mapping without Validated status |
| **CJ-AC-03** | Chart review highlights validation-flagged accounts |
| **CJ-AC-04** | Classification run applies approved rules automatically |
| **CJ-AC-05** | Statement generation disabled until classification approved |
| **CJ-AC-06** | Engagement dashboard reflects classification approval |
| **CJ-AC-07** | Full journey completable without support intervention |

---

## PRD Review Notes — Part 6

Consistency review of MASTER_PRD Part 6 against PROJECT_BIBLE (Parts 1–15) and MASTER_PRD Parts 1–5. No previous sections modified.

### Constitutional Alignment

| Area | Status | Notes |
|------|--------|-------|
| Workflow 7 Data Validation | Aligned | Section 26 |
| Workflow 8 IFRS Classification | Aligned | Sections 28–29 |
| Workflow 9 Manual Override | Aligned | Sections 28–29 |
| FD-02, FD-03, FD-06 | Aligned | Section 26 validations |
| IFRS Classification entity lifecycle | Aligned | Suggested → Reviewed → Approved → Overridden → Locked |
| Traceability (§16) | Aligned | Classification version links to import version |
| AI classification (Workflow 8) | Aligned | Suggest only — human accepts (CLR-05) |

### MASTER_PRD Parts 1–5 Alignment

| Area | Status |
|------|--------|
| PRD5-01 (Data Validation in Part 6) | Addressed — Section 26 |
| PRD5-02 (COA mapping profiles) | Addressed — Sections 27–28 |
| Part 5 journey end state | Section 30 continues from validation readiness |
| Imported vs Validated status | Maintained distinction |
| Finance Director acknowledgment | Section 26 warnings |
| Engagement dashboard | Section 30.7 notification |

### Terminology Consistency

| Term | Status |
|------|--------|
| Validation vs import | Staged → Validated — not conflated |
| Mapping vs classification | Mapping rules apply → classification run produces classified TB |
| Chart of accounts vs IFRS category | COA = client accounts; IFRS = presentation target |
| Override vs reclassification | Override = single account; reclassification = full rerun |
| Error vs warning | Errors block; warnings need acknowledgment |
| Account vs IFRS Classification | Part 8 entities — reflected in Sections 27–28 |

### Governance & AI Readiness

| Area | Status |
|------|--------|
| Finance Director approval gate | Sections 28–29 |
| Mapping rule versioning | Section 28.11 |
| AI suggestion acceptance | Sections 28.7, 29 — not auto-applied |
| Auditor read-only observation | Permissions consistent with Part 3 |
| Statement generation gate | CLR-08 — blocks until approved |

### Editorial Recommendations

| ID | Recommendation |
|----|----------------|
| **PRD6-01** | Financial Statement Generation (Workflow 11) — Part 7 specification |
| **PRD6-02** | Journal Adjustments (Workflow 10) — between classification and statements in future part |
| **PRD6-03** | IFRS presentation hierarchy full taxonomy — reference Part 14 Bible §72 in mapping UI |
| **PRD6-04** | Materiality threshold for unmapped account blocking — configurable per engagement |
| **PRD6-05** | Mapping rule conflict resolution when multiple rules match — priority documented in firm admin |
| **PRD6-06** | Account merge future capability — dependency with mapping rule migration |
| **PRD6-07** | Validation rule catalog publishable at workspace level — extend Section 26.4 |

### Review Conclusion

MASTER_PRD Part 6 is **consistent with PROJECT_BIBLE and Parts 1–5**. It specifies data validation, chart of accounts, IFRS mapping, and classification review as governed professional workflows without contradicting traceability, FD rules, or AI human-in-the-loop requirements. PRD6-01 through PRD6-07 guide subsequent PRD parts.

---

## Document Control — Part 6

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.6.0 | 2026-06-30 | Chief Product Officer | Part 6 — Financial Data Validation, Chart of Accounts & IFRS Classification complete; PRD Review Notes Part 6 included |

---

*End of Part 6.*

---

## Part 7 — Financial Statement Composition & IFRS Reporting

### Table of Contents — Part 7

31. [Financial Statement Engine](#31-financial-statement-engine)
32. [Financial Statements](#32-financial-statements)
33. [IFRS Notes Engine](#33-ifrs-notes-engine)
34. [Financial Reporting Review](#34-financial-reporting-review)
35. [User Journey — Reporting to Working Paper Readiness](#35-user-journey--reporting-to-working-paper-readiness)

---

## 31. Financial Statement Engine

The Financial Statement Engine governs **composition of the primary financial statement package** from approved classified trial balance data — producing versioned, reconciled, reviewable statements as an integrated set.

*Constitutional basis: PROJECT_BIBLE Part 3 Workflow 11; Part 8 Financial Statement entity; Part 14 Section 73; Part 10 Sections 48–52; Business Rules RPT-01 through RPT-05, FD-03.*

### 31.1 Purpose

Transform **approved IFRS classification and adjusted trial balance** into **versioned primary financial statements** — internally consistent, traceable to source accounts, and ready for note linkage, professional review, and CFO approval.

### 31.2 Business Goals

| Goal | Description |
|------|-------------|
| **Single source composition** | All statements derive from one classified adjusted trial balance version |
| **Integrated package** | Statement set generated and versioned together — not independently |
| **Framework compliance** | Output adheres to declared IFRS presentation template |
| **Traceability** | Every line item traces to accounts and import source (Part 3 §16) |
| **Governed approval** | CFO sign-off before publication (RPT-01) |
| **Comparative integrity** | Prior period from approved prior version (RPT-04) |
| **Change discipline** | Underlying data changes invalidate drafts until regeneration |
| **Audit readiness** | Approved statements available to engagement team for working papers |

### 31.3 Statement Generation Lifecycle

```
Prerequisites Met → Generate Draft → In Review → Approved → Published → Archived
         ↑                ↓
    Regenerate      (invalidated by data/classification change)
```

| Stage | Description |
|-------|-------------|
| **Prerequisites** | Validated data; approved classification; adjusted trial balance current |
| **Generate** | Engine applies template; computes lines; creates versioned draft set |
| **Draft** | Editable review state — not authorized for external distribution |
| **In review** | Submitted to Finance Director review |
| **Approved** | CFO authorized — version locked (RPT-02) |
| **Published** | Released to stakeholders per distribution governance |
| **Archived** | Period closed — read-only retention |

### 31.4 Statement Regeneration

| Trigger | Product Behavior |
|---------|------------------|
| **Trial balance change** | New import, adjustment posted, reclassification |
| **Classification change** | Mapping override or reclassification after approval |
| **Template update** | Firm template version change with effective date |
| **Manual request** | Financial Controller initiates regeneration |
| **Effect** | New statement version created; prior draft versions preserved |
| **Invalidation** | Existing draft marked superseded; approval reset required |
| **Downstream** | Linked note drafts invalidated until note regeneration |
| **Audit** | Regeneration reason and trigger recorded |

Regeneration never silently overwrites approved versions — new version and re-approval required.

### 31.5 Comparative Periods

| Aspect | Product Behavior |
|--------|------------------|
| **Source** | Prior period approved statement version or approved comparative trial balance |
| **Columns** | Current period and comparative period columns on applicable statements |
| **Validation** | Comparative figures reconcile to prior approved package (RPT-04) |
| **Missing comparative** | First-year entity — comparative column omitted with disclosure flag |
| **Restatement** | Prior period restatement creates new comparative version with disclosure |
| **Linkage** | Comparative period reference stored in statement version metadata |

### 31.6 Materiality Awareness

| Aspect | Product Behavior |
|--------|------------------|
| **Line item aggregation** | Immaterial items may aggregate per template rules with disclosure |
| **Disaggregation** | Material balances disaggregated per IFRS requirements |
| **Engagement materiality** | Audit engagement materiality visible for auditor context — not auto-applied to presentation |
| **Disclosure materiality** | Note engine uses disclosure materiality for required note triggering |
| **Rounding** | Rounding differences within clearly trivial threshold documented |
| **Override** | Finance Director documents presentation aggregation decisions |

Materiality in presentation is **professional judgment** — engine applies configured rules; humans approve exceptions.

### 31.7 Version Management

| Principle | Application |
|-----------|-------------|
| **Simultaneous versioning** | All primary statements share one version number per generation |
| **Version metadata** | Classification version, trial balance version, template version recorded |
| **Draft versions** | Unlimited draft iterations preserved |
| **Approved lock** | Approved version immutable — modification requires new version (RPT-02, VER-02) |
| **Comparison** | Any two versions comparable side-by-side |
| **Dependency** | Derived notes reference statement version (RPT-03, VER-03) |

### 31.8 Review Status

| Status | Meaning |
|--------|---------|
| **Not submitted** | Draft — preparer editing |
| **Submitted for review** | Awaiting Finance Director |
| **Review in progress** | Review notes open |
| **Review cleared** | All notes resolved — ready for approval submission |
| **Returned** | Rejected to preparer with comments |

Review status applies to **statement package as a whole** and may track per-statement notes.

### 31.9 Approval Status

| Status | Meaning |
|--------|---------|
| **Unapproved** | Draft or in review |
| **Pending CFO approval** | Review cleared — awaiting CFO |
| **Approved** | CFO authorized — locked |
| **Approval revoked** | Rare — Organization Owner action with audit trail |

Approval chain: Financial Controller (prepare) → Finance Director (review) → CFO (approve) per Workflow 11.

### 31.10 Publishing Status

| Status | Meaning |
|--------|---------|
| **Unpublished** | Approved but not distributed |
| **Published** | Authorized distribution completed |
| **Publication revoked** | Withdrawal recorded — rare regulatory event |

Publication requires **Approved** status (RPT-01). Draft exports watermarked (RPT-05).

### 31.11 Permissions

| Capability | Financial Controller | Finance Director | CFO | Auditor (engagement grant) |
|------------|---------------------|------------------|-----|---------------------------|
| Generate statements | Yes | Yes | No | No |
| Regenerate | Yes | Yes | No | No |
| Submit for review | Yes | Yes | No | No |
| Review / note | No | Yes | No | No |
| Approve (CFO) | No | No | Yes | No |
| Publish | No | No | Yes | No |
| View draft | Yes | Yes | Yes | Read if granted |
| View approved | Yes | Yes | Yes | Read if granted |
| Export draft | Yes | Yes | Yes | No |
| Export approved | Yes | Yes | Yes | Per engagement policy |

### 31.12 Business Validations

| Validation | Rule |
|------------|------|
| **FS-V01** | Generation blocked without Validated trial balance (FD-03) |
| **FS-V02** | Generation blocked without approved classification (CLR-08) |
| **FS-V03** | Unbalanced classified trial balance blocks generation |
| **FS-V04** | Template version locked at generation time |
| **FS-V05** | Cross-statement reconciliation must pass before review submission |
| **FS-V06** | CFO approval required before Published status (RPT-01) |
| **FS-V07** | Approved statements locked — edit requires regeneration (RPT-02) |
| **FS-V08** | Comparative figures from approved prior version only (RPT-04) |
| **FS-V09** | Draft export includes draft watermark (RPT-05) |
| **FS-V10** | Statement version references source classification and TB versions |

### 31.13 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **FS-AC-01** | User can generate statement package from approved classification |
| **FS-AC-02** | All five primary statements generated in single version |
| **FS-AC-03** | Cross-statement reconciliation validated before review |
| **FS-AC-04** | TB change invalidates draft and prompts regeneration |
| **FS-AC-05** | Comparative columns populated from approved prior period |
| **FS-AC-06** | CFO approval locks statement version |
| **FS-AC-07** | Line item drill-down traces to trial balance accounts |
| **FS-AC-08** | Draft export watermarked; approved export not watermarked |
| **FS-AC-09** | Auditor can view approved statements with engagement read grant |
| **FS-AC-10** | Version comparison shows differences between two generations |

---

## 32. Financial Statements

This section specifies **executable product requirements** for each primary financial statement. Constitutional philosophy is defined in PROJECT_BIBLE Part 14 Section 73; this section defines product behavior per statement.

### 32.1 Statement of Financial Position

| Dimension | Product Requirement |
|-----------|---------------------|
| **Purpose** | Present assets, liabilities, and equity at reporting date |
| **Business Value** | Solvency assessment; collateral evaluation; regulatory capital; audit assertion baseline |
| **Primary Inputs** | Classified adjusted trial balance; IFRS presentation template; current/non-current rules; comparative approved prior statement |
| **Output Expectations** | Current and comparative columns; minimum IAS 1 line items; assets = liabilities + equity; rounding per convention; versioned draft or approved package |
| **Relationships** | Closing equity → Statement of Changes in Equity; cash line → Statement of Cash Flows closing cash; balances → IFRS notes |
| **Review Requirements** | Finance Director reviews classification of material balances, current/non-current presentation, aggregation/disaggregation |
| **Approval Requirements** | CFO approves as part of integrated package — not independently |

### 32.2 Statement of Profit or Loss

| Dimension | Product Requirement |
|-----------|---------------------|
| **Purpose** | Present income and expenses for the period resulting in profit or loss |
| **Business Value** | Earnings analysis; performance measurement; tax and dividend basis; key audit area |
| **Primary Inputs** | Classified revenue and expense accounts; OCI separation rules; comparative prior statement; industry template for line items |
| **Output Expectations** | By nature or by function format per template; profit before tax; tax expense; profit for period; comparative columns |
| **Relationships** | Profit for period → Statement of Comprehensive Income; expense categories → notes; links to SoCE retained earnings movement |
| **Review Requirements** | Director reviews material classifications, unusual items presentation, nature vs function consistency |
| **Approval Requirements** | CFO approves as integrated package |

#### Statement of Comprehensive Income

| Dimension | Product Requirement |
|-----------|---------------------|
| **Purpose** | Present profit or loss and other comprehensive income (OCI) — combined or separate presentation per IAS 1 |
| **Business Value** | Full picture of equity change beyond profit; fair value and FX reserve movements |
| **Primary Inputs** | Profit or loss from P&L; OCI classified accounts; presentation option (single or two-statement) per entity policy |
| **Output Expectations** | Total comprehensive income; OCI components disclosed; tax on OCI where applicable |
| **Relationships** | OCI components → SoCE reserves; total comprehensive income → SoCE reconciliation |
| **Review Requirements** | Director reviews OCI classification and presentation election consistency |
| **Approval Requirements** | CFO approves as integrated package |

*Presentation mode (combined P&L and OCI vs separate statements) configured per entity accounting policy.*

### 32.3 Statement of Changes in Equity

| Dimension | Product Requirement |
|-----------|---------------------|
| **Purpose** | Reconcile opening to closing equity by component |
| **Business Value** | Transparency of dividends, share issues, retained earnings, OCI reserves |
| **Primary Inputs** | Opening equity from comparative; profit for period; OCI; dividends; share transactions; other equity movements |
| **Output Expectations** | Columnar reconciliation by equity component; total agrees to SoFP closing equity |
| **Relationships** | Closing total → SoFP equity section; profit → P&L; OCI → OCI statement |
| **Review Requirements** | Director reviews each movement column; dividend and reserve reconciliations |
| **Approval Requirements** | CFO approves as integrated package |

### 32.4 Statement of Cash Flows

| Dimension | Product Requirement |
|-----------|---------------------|
| **Purpose** | Present cash flows by operating, investing, and financing activities |
| **Business Value** | Liquidity assessment; going concern; earnings quality; lender covenant analysis |
| **Primary Inputs** | Classified trial balance; cash and equivalents accounts; indirect or direct method template; comparative prior statement; non-cash adjustment data |
| **Output Expectations** | Three activity sections; net change in cash; opening and closing cash; reconciles to SoFP cash |
| **Relationships** | Closing cash → SoFP; operating cash → reconciliation to profit (indirect method); supplemental disclosures in notes |
| **Review Requirements** | Director reviews classification of flows, non-cash adjustments, interest and dividend classification policy |
| **Approval Requirements** | CFO approves as integrated package |

### 32.5 Statement Package Integration

```
Classified Adjusted Trial Balance
              ↓
    ┌─────────┴─────────┐
    ↓                   ↓
Statement of      Statement of Profit or Loss /
Financial Position   Comprehensive Income
    ↓                   ↓
Statement of Cash Flows
    ↓
Statement of Changes in Equity
    ↓
    IFRS Notes (Section 33)
```

| Integration Rule | Description |
|------------------|-------------|
| **Single generation** | All statements produced in one engine run |
| **Cross-validation** | Automated checks between linked elements |
| **Single approval** | Package approved as whole |
| **Single version** | Shared version identifier across set |

---

## 33. IFRS Notes Engine

The IFRS Notes Engine governs **preparation, linkage, and versioning of IFRS disclosure notes** — integral components of the financial statement package per IAS 1.

*Constitutional basis: PROJECT_BIBLE Part 3 Workflow 12; Part 8 IFRS Note entity; Part 14 Sections 74–75; Business Rules RPT-03.*

### 33.1 Purpose

Produce **complete, linked, versioned IFRS notes** from classified financial data and statement line items — ensuring disclosure completeness, cross-referencing, and governed approval before publication.

### 33.2 Automatic Note Generation

| Aspect | Product Behavior |
|--------|------------------|
| **Trigger** | Draft or approved financial statements generated |
| **Requirement identification** | Required disclosures determined by account presence, materiality, and industry compliance pack |
| **Data population** | Quantitative note tables populated from classified trial balance |
| **Narrative sections** | Template narratives populated; AI may draft with evidence citation |
| **Linkage** | Notes auto-linked to statement line items they support |
| **Completeness check** | Missing required notes flagged as blocking errors |
| **Status** | Auto-generated notes enter Draft status — not approved |

### 33.3 Manual Notes

| Aspect | Product Behavior |
|--------|------------------|
| **Creation** | User creates note from template or blank governed structure |
| **Editing** | Financial Controller edits quantitative and narrative content |
| **Supplementary** | Notes for entity-specific matters not covered by auto-generation |
| **Attachment** | Supporting schedules linked to note figures |
| **Validation** | Note figures must reconcile to trial balance or statement lines |

### 33.4 Disclosure Templates

| Template Type | Source |
|---------------|--------|
| **Standard IFRS notes** | Firm-published library per framework version |
| **Industry notes** | Banking, insurance, manufacturing supplements |
| **Entity custom** | Workspace-approved custom templates |
| **Accounting policies** | Policy note templates per framework |
| **Governance** | Only approved template versions applied (WS-02) |

Templates versioned with effective dates; generation locks template version.

### 33.5 Cross References

| Reference Type | Requirement |
|----------------|-------------|
| **Note to statement** | Each note references supported statement line items |
| **Statement to note** | Statement lines link to supporting notes |
| **Note to note** | Related notes cross-referenced |
| **Note to schedule** | Detailed schedules linked from note body |
| **Bidirectional navigation** | User navigates both directions |

### 33.6 Roll-forward Notes

| Aspect | Product Behavior |
|--------|------------------|
| **Prior period note** | Prior approved note used as roll-forward base |
| **Carry-forward** | Accounting policies and static narrative carried forward |
| **Update** | Quantitative tables refreshed from current period data |
| **Change detection** | Policy changes flagged for update per IAS 8 |
| **Version** | Roll-forward creates new note version linked to current statement version |

### 33.7 Comparative Notes

| Aspect | Product Behavior |
|--------|------------------|
| **Comparative columns** | Prior period figures in quantitative tables where applicable |
| **Source** | Approved prior period note or prior trial balance |
| **Restatement** | Comparative restated when prior period restated — disclosed |
| **First year** | Comparative omitted where no prior period — disclosed |

### 33.8 Review Workflow

| Step | Actor | Action |
|------|-------|--------|
| **Prepare** | Financial Controller | Complete auto and manual notes; resolve completeness errors |
| **Submit** | Financial Controller | Submit note package linked to statement version |
| **Review** | Finance Director | Review individual notes; record review comments |
| **Resolve** | Financial Controller | Address comments; update notes |
| **Clear** | Finance Director | Clear review on note package |

Notes reviewed **with statement package** — may also track per-note review status.

### 33.9 Approval Workflow

| Step | Requirement |
|------|-------------|
| **Prerequisite** | Statement package review cleared; disclosure completeness checklist pass |
| **AI narratives** | AI-drafted sections human-approved before package approval |
| **Submitter** | Financial Controller |
| **Approver** | CFO approves notes with statements — integrated package |
| **Lock** | Approved notes locked to statement version (RPT-03) |
| **Invalidation** | Statement regeneration invalidates note drafts until regeneration |

### 33.10 Version History

| Versioned Element | Description |
|-------------------|-------------|
| **Note package version** | Tied to statement version |
| **Individual notes** | Versioned within package |
| **Template version** | Recorded at generation |
| **AI draft versions** | AI interaction preserved if narrative accepted |
| **Comparison** | Note versions comparable across statement versions |

### 33.11 Permissions

| Capability | Financial Controller | Finance Director | CFO | Auditor |
|------------|---------------------|------------------|-----|---------|
| Generate notes | Yes | Yes | No | No |
| Edit notes | Yes | Yes | No | No |
| Accept AI narrative | Yes | Yes | No | No |
| Submit for review | Yes | Yes | No | No |
| Review notes | No | Yes | No | No |
| Approve notes | No | No | Yes (with statements) | No |
| View notes | Yes | Yes | Yes | Engagement read |

### 33.12 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **NOTE-AC-01** | Required notes identified from account presence and materiality |
| **NOTE-AC-02** | Missing required note blocks approval |
| **NOTE-AC-03** | Note figures reconcile to statement and trial balance |
| **NOTE-AC-04** | Bidirectional note-to-statement navigation works |
| **NOTE-AC-05** | AI-drafted narrative requires human approval |
| **NOTE-AC-06** | Note version tied to statement version |
| **NOTE-AC-07** | Roll-forward from prior approved notes supported |
| **NOTE-AC-08** | Comparative note columns from approved prior period |
| **NOTE-AC-09** | Disclosure completeness checklist generated |
| **NOTE-AC-10** | Auditor can view approved notes with engagement read grant |

---

## 34. Financial Reporting Review

Financial Reporting Review governs the **professional oversight workflow** for the complete financial reporting package — statements and notes — before CFO approval and publication.

*Constitutional basis: PROJECT_BIBLE Part 10 Section 48; Business Rules RPT-01, APR-01 through APR-02.*

### 34.1 Report Review Queue

| Queue Content | Description |
|---------------|-------------|
| **Pending submission** | Statement and note package prepared — not submitted |
| **Awaiting review** | Submitted to Finance Director |
| **Review in progress** | Director actively reviewing |
| **Revision requested** | Returned to preparer with comments |
| **Pending CFO approval** | Review cleared — awaiting CFO |
| **Approved** | CFO approved — ready for publication |
| **Publication pending** | Approved — distribution not yet executed |

Queue scoped by company, period, and workspace.

### 34.2 Reviewer Workflow

```
Submit Package → Director Review → Comments / Clear
    → CFO Approval Submission → CFO Review → Approve OR Return
        → Publication Readiness Check → Publish
```

| Role | Responsibility |
|------|----------------|
| **Financial Controller** | Prepare, submit, resolve comments |
| **Finance Director** | Technical review — classification, presentation, disclosures |
| **CFO** | Executive approval — authorization to publish |
| **Auditor** | Observer — read access during audit; no approval |

### 34.3 Review Comments

| Aspect | Product Behavior |
|--------|------------------|
| **Attachment** | Comments attach to statement line, note section, or package level |
| **Severity** | Informational, required change, blocking |
| **Thread** | Preparer responds; iterative resolution |
| **Clearance** | Director clears each comment or entire package |
| **History** | Comment thread preserved in audit trail |

### 34.4 Revision Requests

| Aspect | Product Behavior |
|--------|------------------|
| **Trigger** | Director or CFO returns package with revision request |
| **Effect** | Package status returns to preparer — approval reset |
| **Scope** | Specific items flagged or full package return |
| **Resolution** | Preparer edits statements, notes, or underlying data and regenerates |
| **Resubmission** | New submission creates new review cycle — version incremented |

### 34.5 Approval Workflow

| Artifact | Chain |
|----------|-------|
| **Financial statement package** | Controller (prepare) → Director (review) → CFO (approve) |
| **Integrated notes** | Approved with statements — not separate CFO action unless policy requires |
| **Publication** | CFO authorizes after approval |
| **Separation of duties** | Preparer cannot be sole reviewer or approver (APR-02) |

### 34.6 Publication Readiness

| Readiness Check | Requirement |
|-----------------|-------------|
| **Validation** | Data Validated |
| **Classification** | Approved |
| **Statements** | Generated and reconciled |
| **Notes** | Complete — no blocking disclosure gaps |
| **Review** | Director review cleared |
| **Approval** | CFO approved |
| **Comparatives** | Sourced from approved prior versions |
| **Watermark** | Removed for approved publication export |

Publication readiness checklist displayed before publish action.

### 34.7 Audit Trail

| Event | Recorded |
|-------|----------|
| Statement generation / regeneration | User, versions, trigger, timestamp |
| Note generation | Template version, completeness result |
| Submission / return / approval | Actor, comments, version |
| Review comments | Full thread |
| CFO approval | Timestamp, statement and note versions |
| Publication / export | User, format, recipients, timestamp |
| AI narrative acceptance | AI interaction record |

### 34.8 Business Rules

| Rule | Description |
|------|-------------|
| **RPT-R01** | No publication without CFO approval (RPT-01) |
| **RPT-R02** | Notes linked to statement version (RPT-03) |
| **RPT-R03** | Draft exports watermarked (RPT-05) |
| **RPT-R04** | Approval chains non-bypassable (APR-01) |
| **RPT-R05** | Self-approval prohibited (APR-02) |
| **RPT-R06** | Underlying data change invalidates draft until regeneration |
| **RPT-R07** | Auditor read access does not imply approval rights |
| **RPT-R08** | Publication events logged for distribution audit |

### 34.9 Permissions

| Capability | Financial Controller | Finance Director | CFO | Auditor |
|------------|---------------------|------------------|-----|---------|
| Submit package | Yes | Yes | No | No |
| Review / comment | No | Yes | No | No |
| Return for revision | No | Yes | Yes | No |
| Approve package | No | No | Yes | No |
| Publish | No | No | Yes | No |
| View publication readiness | Yes | Yes | Yes | Read |
| Export approved | Yes | Yes | Yes | Per policy |

### 34.10 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **REV-AC-01** | Review queue shows pending packages by period |
| **REV-AC-02** | Director can attach comments to statement lines and notes |
| **REV-AC-03** | Return resets approval status |
| **REV-AC-04** | CFO approval locks package |
| **REV-AC-05** | Publication readiness checklist enforced before publish |
| **REV-AC-06** | Preparer cannot approve own package |
| **REV-AC-07** | Full review audit trail exportable |
| **REV-AC-08** | Publication logs recipient and timestamp |
| **REV-AC-09** | Auditor cannot approve or publish |
| **REV-AC-10** | Draft export watermarked throughout review |

---

## 35. User Journey — Reporting to Working Paper Readiness

End-to-end experience from **approved classification** through **approved financial reporting package** — ready for audit working papers and lead sheet linkage.

*Continues MASTER_PRD Part 6 Section 30 — "Ready for Financial Statement Generation" milestone.*

### 35.1 Journey Overview

```
Financial Data Validated → IFRS Mapping Approved → Financial Statements Generated
    → IFRS Notes Generated → Financial Reporting Review → Reporting Approved
        → Ready for Working Papers
```

**Primary actors:** Financial Controller (prepare), Finance Director (review), CFO (approve). **Observer:** Audit Manager and team on engagement.

### 35.2 Step 1 — Financial Data Validated

| Perspective | Financial Controller |
|-------------|---------------------|
| **State** | Trial balance Validated; chart and mapping complete |
| **Prerequisite** | Part 6 journey complete |
| **Sees** | Period banner: **Ready for Financial Statement Generation** |

**User sees:** Green checklist — validation and classification approved.

### 35.3 Step 2 — IFRS Mapping Approved

| Perspective | Financial Controller |
|-------------|---------------------|
| **State** | Finance Director approved classification (Part 6) |
| **Action** | Navigate to **Financial Reporting** → **Generate Statements** |
| **Enabled** | Generation action active |

**User sees:** Classification version and import version displayed as generation inputs.

### 35.4 Step 3 — Financial Statements Generated

| Perspective | Financial Controller |
|-------------|---------------------|
| **Action** | Click **Generate Financial Statements** |
| **Processing** | Engine composes all five primary statements; cross-validation runs |
| **Outcome** | Draft statement package version 1 created |
| **Review** | Controller spot-checks material lines; drills down to trial balance accounts |

**User sees:** Statement package viewer with tabs for each statement; reconciliation status green.

### 35.5 Step 4 — IFRS Notes Generated

| Perspective | Financial Controller |
|-------------|---------------------|
| **Action** | **Generate IFRS Notes** — auto-triggered or manual after statements |
| **Processing** | Required notes identified; tables populated; AI drafts policy narratives |
| **AI** | Controller reviews AI narratives — accepts or edits each |
| **Completeness** | Disclosure checklist — resolve any blocking gaps |
| **Linkage** | Verify note-to-statement cross-references |

**User sees:** Note index with status icons; completeness checklist with blocking items highlighted.

### 35.6 Step 5 — Financial Reporting Review

| Perspective | Financial Controller and Finance Director |
|-------------|------------------------------------------|
| **Submit** | Controller submits integrated package |
| **Review** | Director reviews statements and notes; comments on material items |
| **Iterate** | Controller resolves comments; resubmits if needed |
| **Clear** | Director clears review — package advances to CFO queue |
| **Auditor** | Audit Manager views approved draft package read-only on engagement — plans procedures |

**User sees:** Review queue with comment threads; package status **Pending CFO Approval**.

### 35.7 Step 6 — Reporting Approved

| Perspective | CFO |
|-------------|-----|
| **Action** | Reviews publication readiness checklist |
| **Approve** | Authorizes financial statement and note package |
| **Lock** | Version locked — immutable without regeneration |
| **Notify** | Engagement team notified — approved financials available |

**User sees:** Approval confirmation; package status **Approved**.

### 35.8 Step 7 — Ready for Working Papers

| Milestone | Criteria |
|-----------|----------|
| **Approved statements** | CFO-approved package locked |
| **Approved notes** | Linked to statement version |
| **Traceability** | Full chain from statement line to source import |
| **Engagement link** | Audit engagement references approved reporting package version |
| **Next workflow** | Audit team links lead sheets to trial balance and statement lines; substantive testing |

| Perspective | Audit Manager |
|-------------|---------------|
| **Action** | Open engagement → financial data → approved statements |
| **Lead sheets** | Map trial balance to working paper areas |
| **Working papers** | Team begins substantive procedures against approved figures |
| **Client** | CFO may publish to stakeholders when ready |

**User sees:** Engagement dashboard milestone: **Ready for Working Papers** — financial reporting package approved and linked.

### 35.9 Journey Diagram

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Validated  │───►│  Mapping    │───►│ Statements  │
│    Data     │    │  Approved   │    │  Generated  │
└─────────────┘    └─────────────┘    └──────┬──────┘
                                             │
┌─────────────┐    ┌─────────────┐    ┌──────▼──────┐
│   Ready     │◄───│  Reporting  │◄───│    IFRS     │
│ Working     │    │  Approved   │    │    Notes    │
│  Papers     │    └──────┬──────┘    └─────────────┘
└─────────────┘           │
                   ┌──────▼──────┐
                   │  Reporting  │
                   │   Review    │
                   └─────────────┘
```

### 35.10 Journey Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **RJ-AC-01** | Statement generation enabled only after classification approved |
| **RJ-AC-02** | Note generation linked to statement version |
| **RJ-AC-03** | Full review cycle completable with comment resolution |
| **RJ-AC-04** | CFO approval locks package |
| **RJ-AC-05** | Engagement shows approved package to audit team |
| **RJ-AC-06** | Ready for Working Papers milestone displayed after approval |
| **RJ-AC-07** | Traceability from statement line to source available to auditor |

---

## PRD Review Notes — Part 7

Consistency review of MASTER_PRD Part 7 against PROJECT_BIBLE (Parts 1–15) and MASTER_PRD Parts 1–6. No previous sections modified.

### Constitutional Alignment

| Area | Status | Notes |
|------|--------|-------|
| Workflow 11 Statement Generation | Aligned | Section 31 |
| Workflow 12 IFRS Notes | Aligned | Section 33 |
| Part 14 §73 Financial Statements | Aligned | Section 32 — executable layer |
| Part 14 §74–75 Disclosure | Aligned | Section 33 |
| Part 10 Reporting Philosophy | Aligned | Sections 31, 34 |
| RPT-01 through RPT-05 | Aligned | Sections 31, 33, 34 |
| Traceability chain (§16) | Aligned | Line item drill-down in FS-AC-07 |

### MASTER_PRD Parts 1–6 Alignment

| Area | Status |
|------|--------|
| PRD6-01 (Statement Generation Part 7) | Addressed — Sections 31–32 |
| Part 6 journey end state | Section 35 continues from classification approved |
| CLR-08 statement gate | Section 31 validations |
| CFO approval chain (Part 2) | Sections 31, 34 |
| Engagement dashboard | Section 35.8 milestone |
| AI note drafting (Part 4) | Section 33 — human approval required |

### Terminology Consistency

| Term | Status |
|------|--------|
| Financial Statement vs IFRS Note | Distinct modules; integrated package approval |
| Draft / Approved / Published | Consistent lifecycle across statements and notes |
| Regeneration vs new version | Consistent with import versioning (Part 5) |
| Classification vs composition | Classification (Part 6) precedes composition (Part 7) |
| Working Papers readiness | New milestone — bridges reporting to audit (Part 15 Bible) |

### Governance & Versioning

| Area | Status |
|------|--------|
| Simultaneous statement versioning | Section 31.7 — matches Bible §73.4 |
| Note-statement version binding | RPT-03 throughout |
| Separation of preparer/reviewer | APR-02 in Section 34 |
| Draft watermark | RPT-05 in Sections 31, 34 |

### Editorial Recommendations

| ID | Recommendation |
|----|----------------|
| **PRD7-01** | Journal Adjustments (Workflow 10) — specify between classification and statement generation in Part 8 |
| **PRD7-02** | Export and publication distribution (Part 10 §51) — dedicated export PRD part |
| **PRD7-03** | OCI presentation election (IFRS-05) — entity policy configuration UI |
| **PRD7-04** | Consolidation statements for group entities — future part |
| **PRD7-05** | Lead sheet auto-generation from approved statements — audit PRD part |
| **PRD7-06** | Disclosure completeness rules catalog — link to IFRS Knowledge Framework (Bible §72) |
| **PRD7-07** | Management representation letter linkage to approved package — governance PRD part |

### Review Conclusion

MASTER_PRD Part 7 is **consistent with PROJECT_BIBLE and Parts 1–6**. It specifies financial statement composition, IFRS notes, and reporting review as governed integrated packages without contradicting traceability, versioning, or approval philosophy. PRD7-01 through PRD7-07 guide subsequent PRD parts.

---

## Document Control — Part 7

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.7.0 | 2026-06-30 | Chief Product Officer | Part 7 — Financial Statement Composition & IFRS Reporting complete; PRD Review Notes Part 7 included |

---

*End of Part 7.*

---

## Part 8 — Audit Planning, Materiality & Risk Assessment

### Table of Contents — Part 8

36. [Audit Planning Module](#36-audit-planning-module)
37. [Materiality Management](#37-materiality-management)
38. [Risk Assessment Module](#38-risk-assessment-module)
39. [Audit Strategy Module](#39-audit-strategy-module)
40. [User Journey — Planning to Working Paper Readiness](#40-user-journey--planning-to-working-paper-readiness)

---

## 36. Audit Planning Module

The Audit Planning Module governs **development, documentation, review, and approval of the audit plan** — the governed foundation for all fieldwork, working papers, and evidence collection.

*Constitutional basis: PROJECT_BIBLE Part 3 Workflow 13; Part 15 Sections 77–78; Part 8 Audit Planning entity; Business Rules ENG-03, ENG-05, APR-01 through APR-05.*

### 36.1 Purpose

Establish a **defensible, versioned audit plan** that defines engagement objectives, scope, significant areas, team allocation, and the audit program — responsive to assessed risks and documented materiality — before fieldwork commences.

### 36.2 Business Goals

| Goal | Description |
|------|-------------|
| **Planning gate enforcement** | No fieldwork without approved audit plan (ENG-03) |
| **Risk-responsive design** | Audit program aligned to assessed risks of material misstatement |
| **Resource efficiency** | Team capacity and timeline planned against scope and risk |
| **Methodology consistency** | Firm ISA-aligned templates applied uniformly |
| **Inspection readiness** | Planning documentation meets ISA 300 expectations |
| **Traceability** | Plan links to materiality, risks, procedures, and financial data |
| **Continuous revision** | Scope and circumstance changes trigger versioned plan updates |

### 36.3 Planning Lifecycle

```
Initiate Planning → Draft Plan → Materiality & Risk Input → Strategy & Program
    → Manager Review → Partner Approval → Fieldwork Enabled
         ↑                                    ↓
    Plan Revision ←── Scope Change / Risk Reassessment
```

| Stage | Description |
|-------|-------------|
| **Initiate** | Engagement Accepted; planning status active |
| **Draft** | Manager develops planning memorandum and scope |
| **Integrate** | Materiality approved; risk assessment documented; strategy defined |
| **Review** | Manager submits; Partner reviews significant matters |
| **Approve** | Partner approves audit plan — planning gate cleared |
| **Revise** | Scope change, materiality revision, or risk reassessment triggers new version |

Engagement status transitions **Planning → Fieldwork** only upon approved audit plan (Section 16.15).

### 36.4 Planning Memorandum

| Element | Product Requirement |
|---------|---------------------|
| **Purpose** | Primary planning document summarizing engagement approach |
| **Content** | Entity overview, industry context, prior-year summary, key changes, fraud considerations, going concern indicators, significant matters from acceptance |
| **Versioning** | Each revision creates new memorandum version |
| **Ownership** | Audit Manager prepares; Engagement Partner approves |
| **AI assistance** | AI Planning Assistant may draft sections — human edits and approves |
| **Linkage** | References materiality version, risk assessment version, audit strategy version |

### 36.5 Engagement Objectives

| Objective Element | Documentation |
|-------------------|---------------|
| **Primary objective** | Express opinion on whether financial statements present fairly per applicable framework |
| **Reporting framework** | IFRS (or configured framework) — inherited from engagement |
| **Engagement type** | External statutory audit — or configured assurance type |
| **Scope of opinion** | Entity-level; component scope if applicable |
| **Regulatory context** | Jurisdiction and filing requirements noted |
| **Special considerations** | First-year audit, group audit, significant estimates flagged |

Objectives are **declared at planning** and versioned if scope changes (ENG-05).

### 36.6 Audit Scope

| Scope Dimension | Product Behavior |
|-----------------|------------------|
| **Financial periods** | Current period under audit; comparative period reference |
| **Entities** | Company linked to engagement; component entities if group |
| **Statements in scope** | Primary financial statements and notes per approved reporting package |
| **Exclusions** | Documented limitations with rationale |
| **Scope changes** | Versioned update; Partner approval; planning revision triggered |
| **Linkage** | Scope references approved financial statement package version (Part 7) |

### 36.7 Significant Accounts

| Aspect | Product Behavior |
|--------|------------------|
| **Identification** | Accounts exceeding performance materiality or meeting qualitative significance criteria |
| **Source** | Derived from classified trial balance and approved financial statements |
| **Qualitative factors** | Related-party balances, estimates, fraud-sensitive accounts flagged |
| **Documentation** | Rationale for significance documented per account or account group |
| **Procedure linkage** | Significant accounts drive enhanced audit program procedures |
| **Refresh** | Regenerated when trial balance or statement package changes |

### 36.8 Significant Processes

| Aspect | Product Behavior |
|--------|------------------|
| **Identification** | Revenue cycle, procurement, payroll, treasury, IT general controls, etc. |
| **Documentation** | Process narrative or reference to control documentation |
| **Risk linkage** | Processes linked to assessed risks and planned procedures |
| **Industry pack** | Industry compliance pack suggests standard significant processes |
| **Control consideration** | Each significant process evaluated for control reliance decision (future control module) |

### 36.9 Team Planning

| Element | Product Requirement |
|---------|---------------------|
| **Team roster** | Engagement Partner, Audit Manager, Audit Seniors, Auditors, Reviewer (Section 13) |
| **Role assignment** | Each member assigned professional role on engagement |
| **Procedure assignment** | Audit program procedures assigned to individual Auditors |
| **Capacity planning** | Estimated hours by role and audit area |
| **Expert identification** | Valuation, IT, actuarial, tax specialists flagged for involvement |
| **Timeline** | Planning, fieldwork, review, and opinion target dates |
| **Notifications** | Team notified of assignments and plan approval |

### 36.10 Planning Status

| Status | Meaning |
|--------|---------|
| **Not started** | Engagement Accepted; planning not initiated |
| **In progress** | Manager developing plan components |
| **Pending review** | Submitted to Partner |
| **Returned** | Partner returned with revision requests |
| **Approved** | Partner approved — fieldwork gate open |
| **Superseded** | New plan version approved; prior version archived |

Dashboard displays planning status alongside engagement lifecycle (Section 19).

### 36.11 Review

| Step | Actor | Action |
|------|-------|--------|
| **Prepare** | Audit Manager | Complete memorandum, scope, significant accounts/processes, team plan |
| **Integrate** | Audit Manager | Confirm materiality, risk assessment, and strategy complete |
| **Submit** | Audit Manager | Submit planning package for Partner review |
| **Review** | Engagement Partner | Review significant matters, scope, resource adequacy |
| **Comment** | Engagement Partner | Record review comments on planning sections |
| **Resolve** | Audit Manager | Address comments; resubmit if required |
| **Clear** | Engagement Partner | Clear review — advance to approval |

Preparer cannot be sole reviewer (APR-02).

### 36.12 Approval

| Requirement | Description |
|-------------|-------------|
| **Approver** | Engagement Partner |
| **Prerequisites** | Materiality documented; risk assessment complete; audit strategy approved |
| **Effect** | Planning gate cleared; engagement may transition to Fieldwork |
| **Lock** | Approved plan version locked — changes require new version and re-approval |
| **Attribution** | Approver identity, timestamp, version recorded (APR-05) |
| **Non-bypassable** | No fieldwork status without approved plan (ENG-03, APR-01) |

### 36.13 Permissions

| Capability | Engagement Partner | Audit Manager | Audit Senior | Auditor |
|------------|-------------------|---------------|--------------|---------|
| Initiate planning | Yes | Yes | No | No |
| Edit planning memorandum | Yes | Yes | Contribute | No |
| Define scope | Yes | Yes | No | No |
| Identify significant accounts/processes | Yes | Yes | Yes | No |
| Team and procedure assignment | Yes | Yes | Propose | No |
| Submit for review | Yes | Yes | No | No |
| Review planning | Yes | No | No | No |
| Approve plan | Yes | No | No | No |
| View approved plan | Assigned team | Assigned team | Assigned team | Assigned team |

### 36.14 Business Validations

| Validation | Rule |
|------------|------|
| **PLN-V01** | Planning blocked without Accepted engagement (ENG-01) |
| **PLN-V02** | Plan submission blocked without documented materiality |
| **PLN-V03** | Plan submission blocked without completed risk assessment |
| **PLN-V04** | Plan submission blocked without approved audit strategy |
| **PLN-V05** | Fieldwork blocked without approved plan (ENG-03) |
| **PLN-V06** | Scope change after approval requires plan revision (ENG-05) |
| **PLN-V07** | Approved plan locked — edit creates new version |
| **PLN-V08** | Partner cannot approve plan they alone prepared without second reviewer per firm policy |
| **PLN-V09** | Significant accounts must link to trial balance or statement line |
| **PLN-V10** | Procedure assignment requires team member with Auditor role |

### 36.15 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **PLN-AC-01** | Audit Manager can create planning memorandum for Accepted engagement |
| **PLN-AC-02** | Significant accounts identified from approved financial data |
| **PLN-AC-03** | Plan submission blocked without materiality, risk, and strategy |
| **PLN-AC-04** | Partner can review, comment, and approve plan |
| **PLN-AC-05** | Approved plan enables Fieldwork status transition |
| **PLN-AC-06** | Unapproved plan blocks working paper creation |
| **PLN-AC-07** | Scope change creates versioned plan revision |
| **PLN-AC-08** | Team procedure assignments visible to assigned Auditors |
| **PLN-AC-09** | Planning audit trail records all submissions and approvals |
| **PLN-AC-10** | AI-drafted planning content marked until human acceptance |

---

## 37. Materiality Management

Materiality Management governs **documentation, versioning, review, and approval of audit materiality thresholds** — distinct from IFRS disclosure materiality (Part 7).

*Constitutional basis: PROJECT_BIBLE Part 15 Section 77.6; Part 8 glossary; Business Rules ENG-V10, APR-03; Section 16.13 engagement materiality configuration.*

### 37.1 Purpose

Enable engagement teams to **set, document, revise, and approve** overall materiality, performance materiality, specific materiality, and clearly trivial thresholds — providing the quantitative framework for planning, procedure design, and misstatement evaluation.

### 37.2 Business Goals

| Goal | Description |
|------|-------------|
| **Professional judgment** | Thresholds set by engagement team — not system-imposed |
| **ISA alignment** | Documentation supports ISA 320 requirements |
| **Planning integration** | Materiality referenced throughout engagement |
| **Revision discipline** | Changes versioned with documented rationale |
| **Escalation** | Significant revisions escalate to Partner (APR-03) |
| **Distinction** | Audit materiality clearly separated from reporting disclosure materiality |

### 37.3 Overall Materiality

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Magnitude of misstatement that would influence audit strategy |
| **Calculation basis** | Benchmark selected (revenue, total assets, profit before tax, etc.) |
| **Percentage** | Professional percentage applied to benchmark — documented |
| **Amount** | Calculated overall materiality amount in engagement currency |
| **Documentation** | Basis, benchmark value, percentage, and rationale required |
| **Reference** | Used for financial statement-level misstatement evaluation |

### 37.4 Performance Materiality

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Amount set below overall materiality to reduce aggregation risk |
| **Typical range** | Platform suggests 50–75% of overall — team confirms |
| **Purpose** | Guides procedure design and sample sizes |
| **Documentation** | Rationale for percentage selection |
| **Significant accounts** | Accounts above performance materiality flagged as significant |

### 37.5 Specific Materiality

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Lower thresholds for particular classes of transactions, account balances, or disclosures |
| **Use cases** | Related-party transactions, executive compensation, regulatory capital, sensitive disclosures |
| **Configuration** | Multiple specific materiality items per engagement |
| **Documentation** | Area, amount, and rationale for each specific threshold |
| **Effect** | Drives targeted procedures for sensitive areas |

### 37.6 Trivial Threshold

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Clearly trivial amount below which misstatements need not be accumulated |
| **Typical basis** | Percentage of overall materiality — team confirms |
| **Documentation** | Amount and rationale recorded |
| **Misstatement register** | Misstatements below trivial threshold excluded from accumulation per team policy |

### 37.7 Manual Override

| Aspect | Product Behavior |
|--------|------------------|
| **Calculated amount** | System may compute suggested amount from benchmark × percentage |
| **Override** | Audit Manager may override calculated amount with documented rationale |
| **Approval** | Override requires Partner visibility; significant overrides require Partner approval |
| **Audit trail** | Calculated vs. final amount both recorded |
| **No auto-set** | Materiality never applied without human confirmation |

### 37.8 Version History

| Event | Versioning |
|-------|------------|
| **Initial setting** | Version 1 at engagement planning |
| **Revision** | New version when benchmark, percentage, or amount changes |
| **Trigger** | Circumstance change, scope change, interim financial information, discovered error |
| **Rationale** | Mandatory revision reason per version |
| **Effect** | Prior version preserved; current version referenced by planning and risk assessment |
| **Downstream** | Materiality revision may trigger risk reassessment and plan revision |

### 37.9 Review Workflow

| Step | Actor | Action |
|------|-------|--------|
| **Prepare** | Audit Manager | Enter materiality worksheet — all threshold types |
| **Submit** | Audit Manager | Submit for Partner review |
| **Review** | Engagement Partner | Review basis, amounts, and professional reasonableness |
| **Comment** | Engagement Partner | Request changes if needed |
| **Clear** | Engagement Partner | Clear review — materiality documented |

Initial materiality may be set at engagement acceptance (Section 20.6) and refined during formal planning.

### 37.10 Approval Workflow

| Change Type | Approver |
|-------------|----------|
| **Initial materiality** | Engagement Partner approves |
| **Routine revision** | Audit Manager documents; Partner approves if within firm tolerance |
| **Significant revision** | Engagement Partner mandatory approval (ENG-V10, APR-03) |
| **Effect** | Approved materiality version locked until next revision |
| **Attribution** | Approver, timestamp, version recorded (APR-05) |

### 37.11 Permissions

| Capability | Engagement Partner | Audit Manager | Audit Senior | Auditor |
|------------|-------------------|---------------|--------------|---------|
| View materiality | Yes | Yes | Yes | Read |
| Set / edit materiality | Approve | Yes | No | No |
| Override calculated amount | Approve | Yes (documented) | No | No |
| Submit for review | Yes | Yes | No | No |
| Approve materiality | Yes | No | No | No |
| Revise materiality | Approve | Yes | No | No |

### 37.12 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **MAT-AC-01** | Manager can document all four materiality threshold types |
| **MAT-AC-02** | Calculated amount shown; manual override requires rationale |
| **MAT-AC-03** | Partner approval recorded for initial materiality |
| **MAT-AC-04** | Revision creates new version with reason |
| **MAT-AC-05** | Significant revision requires Partner approval |
| **MAT-AC-06** | Materiality version referenced by planning and risk modules |
| **MAT-AC-07** | Audit materiality distinguished from reporting materiality in UI |
| **MAT-AC-08** | Historical materiality versions viewable and comparable |
| **MAT-AC-09** | Materiality amounts displayed on engagement dashboard |
| **MAT-AC-10** | Auditor can view but not edit materiality thresholds |

---

## 38. Risk Assessment Module

The Risk Assessment Module governs **identification, evaluation, documentation, and linkage of risks of material misstatement** at financial statement and assertion levels — including fraud risk.

*Constitutional basis: PROJECT_BIBLE Part 3 Workflow 14; Part 15 Sections 77.2, 78; Business Rules AI advisory constraints; APR-03 significant risk escalation.*

### 38.1 Purpose

Produce a **defensible, versioned risk assessment** that drives audit procedure selection, resource allocation, and partner oversight of significant risks — with AI indicators as advisory inputs only.

### 38.2 Business Goals

| Goal | Description |
|------|-------------|
| **Risk-based auditing** | Audit effort directed to highest-risk areas (ISA 315) |
| **Assertion-level granularity** | Risks assessed at account and assertion level |
| **Fraud consideration** | Fraud risk factors documented per ISA 240 |
| **Procedure linkage** | Every significant risk linked to planned procedures |
| **Partner visibility** | Significant risks escalated to Engagement Partner |
| **Reassessment** | Fieldwork triggers documented risk updates |
| **AI discipline** | AI risk indicators inform — never conclude — risk assessment |

### 38.3 Inherent Risk

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Susceptibility of an assertion to misstatement assuming no related controls |
| **Assessment** | Rated per account/assertion — typically High, Moderate, Low |
| **Factors** | Account complexity, estimation uncertainty, transaction volume, industry risk |
| **Documentation** | Rationale required for each inherent risk rating |
| **Source data** | Informed by trial balance, financial statements, industry pack |

### 38.4 Control Risk

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Risk that misstatement will not be prevented or detected by internal controls |
| **Assessment** | Rated after control environment understanding |
| **Reliance decision** | Documented — test controls vs. substantive approach |
| **Linkage** | Control documentation module (future part) feeds control risk |
| **Default** | Substantive approach assumed until control evaluation complete |

### 38.5 Detection Risk

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Risk that audit procedures fail to detect material misstatement |
| **Relationship** | Inverse function of inherent and control risk at assertion level |
| **Procedure response** | Higher combined risk → more extensive procedures |
| **Documentation** | Detection risk addressed through procedure design — not separately rated in all methodologies |
| **Sampling** | Sample sizes responsive to assessed detection risk |

### 38.6 Fraud Risk

| Aspect | Product Behavior |
|--------|------------------|
| **Requirement** | Fraud risk assessment mandatory per engagement |
| **Factors** | Incentive, opportunity, rationalization; management override; revenue recognition |
| **Significant fraud risks** | Automatically flagged as significant risks |
| **Procedures** | Fraud risks linked to specific responsive procedures |
| **Brainstorming** | Documentation of fraud discussion among engagement team |
| **AI boundary** | AI cannot conclude on fraud — surfaces anomalies as inputs only |

### 38.7 Business Risk

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Risks arising from economic, industry, and entity operating conditions |
| **Examples** | Liquidity pressure, regulatory change, market decline, going concern |
| **Effect** | Business risks may create financial statement risks |
| **Documentation** | Entity and environment understanding section |
| **Going concern** | Business risk factors feed going concern assessment |

### 38.8 IT Risk

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Risks arising from reliance on information systems and technology |
| **Scope** | IT general controls, application controls, automated controls, data integrity |
| **Assessment** | IT risk rating influences IT audit requirement in strategy |
| **Expert involvement** | IT specialist flagged when IT risk rated significant |
| **Linkage** | IT risks linked to relevant accounts and assertions |

### 38.9 Financial Statement Risks

| Aspect | Product Behavior |
|--------|------------------|
| **Level** | Risks at financial statement area — revenue, receivables, inventory, etc. |
| **Aggregation** | Assertion-level risks roll up to statement-level view |
| **Significant accounts** | Alignment with significant accounts from planning (Section 36.7) |
| **Prior year** | Prior-year risk assessment available for roll-forward comparison |
| **Change detection** | Risk rating changes from prior year flagged |

### 38.10 Assertion-Level Risks

| Assertion | Application |
|-----------|-------------|
| **Existence / Occurrence** | Assets/liabilities exist; transactions occurred |
| **Completeness** | All transactions and accounts included |
| **Accuracy / Valuation** | Amounts accurate and appropriately valued |
| **Cut-off** | Transactions in correct period |
| **Classification** | Proper account and presentation classification |
| **Presentation / Disclosure** | Properly described, classified, and disclosed |

Risks assessed in **matrix format**: account × assertion with risk rating and rationale.

### 38.11 Risk Scoring

| Aspect | Product Behavior |
|--------|------------------|
| **Professional rating** | Engagement team assigns risk ratings — primary method |
| **AI indicators** | AI Risk Advisor surfaces account-level indicators with contributing factors |
| **Advisory only** | AI scores displayed as suggestions — not auto-applied (AI-01, AI-02) |
| **Acceptance** | Manager accepts, modifies, or rejects AI suggestions — all logged |
| **Composite view** | Combined inherent and control risk informs procedure intensity |

### 38.12 Risk Heat Map

| Aspect | Product Behavior |
|--------|------------------|
| **Visualization** | Color-coded matrix — accounts vs. assertions or statement areas |
| **Severity bands** | High (red), Moderate (amber), Low (green) — configurable labels |
| **Drill-down** | Click cell to view rationale, linked procedures, AI indicators |
| **Partner view** | Significant risks highlighted prominently |
| **Export** | Heat map included in risk assessment report output |
| **Filter** | Filter by statement area, significant risk only, changed from prior year |

### 38.13 Review

| Step | Actor | Action |
|------|-------|--------|
| **Prepare** | Audit Manager leads; Audit Senior contributes |
| **AI review** | Manager evaluates AI indicators — accepts or rejects |
| **Submit** | Manager submits risk assessment for review |
| **Review** | Engagement Partner reviews significant risks and fraud assessment |
| **Comment** | Partner challenges ratings and procedure linkage |
| **Clear** | Partner clears significant risk review |

Significant risks require **Partner visibility** before planning approval.

### 38.14 Approval

| Requirement | Description |
|-------------|-------------|
| **Routine risks** | Audit Manager documents; Partner reviews as part of planning approval |
| **Significant risks** | Partner explicit acknowledgment recorded |
| **Reassessment** | Fieldwork reassessment versioned; Partner reviews if significant change |
| **Lock** | Approved risk assessment version locked with approved plan |
| **Linkage** | Risk version referenced by audit program |

### 38.15 Permissions

| Capability | Engagement Partner | Audit Manager | Audit Senior | Auditor |
|------------|-------------------|---------------|--------------|---------|
| Create / edit risk assessment | Yes | Yes | Yes | Contribute assigned areas |
| View AI risk indicators | Yes | Yes | Yes | Read |
| Accept / reject AI suggestions | Yes | Yes | Yes | No |
| Rate risks | Yes | Yes | Yes | Propose |
| Submit for review | Yes | Yes | No | No |
| Review significant risks | Yes | No | No | No |
| Approve / acknowledge | Yes | No | No | No |
| View heat map | Assigned team | Assigned team | Assigned team | Assigned team |

### 38.16 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **RISK-AC-01** | Risk matrix creatable at account × assertion level |
| **RISK-AC-02** | Fraud risk assessment section mandatory |
| **RISK-AC-03** | Significant risks flagged and visible to Partner |
| **RISK-AC-04** | AI risk indicators displayed as advisory — not auto-rated |
| **RISK-AC-05** | AI suggestion acceptance/rejection logged |
| **RISK-AC-06** | Each significant risk linked to planned procedure |
| **RISK-AC-07** | Heat map visualizes risk ratings with drill-down |
| **RISK-AC-08** | Risk reassessment creates versioned update |
| **RISK-AC-09** | Prior-year risk assessment available for comparison |
| **RISK-AC-10** | Risk assessment blocks planning approval if incomplete |

---

## 39. Audit Strategy Module

The Audit Strategy Module governs **overall audit approach, resource allocation, and program design** — translating materiality and risk assessment into an executable audit plan.

*Constitutional basis: PROJECT_BIBLE Part 3 Workflow 13; Part 15 Section 78 Audit Planning stage; Part 8 Audit Program entity.*

### 39.1 Purpose

Define the **overall audit strategy** — approach, timing, resource deployment, and audit program — responsive to assessed risks and documented materiality, ready for Partner approval and fieldwork execution.

### 39.2 Business Goals

| Goal | Description |
|------|-------------|
| **Risk-responsive program** | Procedures mapped to assessed risks and assertions |
| **Resource optimization** | Team capacity aligned to scope and risk |
| **Methodology compliance** | Firm audit program templates applied |
| **Expert coordination** | Specialist involvement planned and documented |
| **IT and controls strategy** | Explicit approach to IT and internal control reliance |
| **Timeline discipline** | Milestones planned against engagement deadlines |

### 39.3 Overall Audit Strategy

| Strategy Element | Documentation |
|------------------|---------------|
| **Audit approach** | Primarily substantive; combined; or controls-reliance |
| **Reporting framework** | IFRS — inherited from engagement |
| **Materiality reference** | Current approved materiality version |
| **Risk summary** | Key risks and significant matters |
| **Prior-year reference** | Changes from prior audit approach documented |
| **Going concern** | Approach to going concern assessment |
| **Group considerations** | Component auditor coordination if applicable |

### 39.4 Resource Planning

| Element | Product Requirement |
|---------|---------------------|
| **Team hours** | Estimated hours by role and audit area |
| **Budget** | Engagement hour budget vs. firm benchmark |
| **Specialists** | IT, valuation, actuarial, tax hours planned |
| **Capacity check** | Team availability against planned timeline |
| **Contingency** | Buffer for significant risk areas |
| **Tracking** | Actual vs. planned hours visible on dashboard (future time module) |

### 39.5 Timeline

| Milestone | Product Behavior |
|-----------|------------------|
| **Planning completion** | Target date for plan approval |
| **Fieldwork start** | Planned commencement after planning gate |
| **Fieldwork completion** | Target date for substantive work |
| **Review completion** | Target date for engagement review clearance |
| **Opinion date** | Target date for auditor's report |
| **Dependencies** | Timeline linked to client reporting deadlines |
| **Alerts** | Dashboard warnings when milestones at risk |

### 39.6 Audit Areas

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Financial statement areas — cash, receivables, revenue, inventory, etc. |
| **Mapping** | Areas mapped to significant accounts and trial balance sections |
| **Risk linkage** | Each area linked to assessed risks |
| **Procedure assignment** | Procedures grouped by audit area |
| **Completion tracking** | Area completion percentage on dashboard |
| **Lead sheet linkage** | Areas align to lead sheet structure (future part) |

### 39.7 Sampling Strategy

| Aspect | Product Behavior |
|--------|------------------|
| **Methodology** | Firm sampling guidance referenced per procedure |
| **Documentation** | Sample size basis documented — materiality and risk responsive |
| **Selection** | Sample selection performed by auditor — not automated conclusion |
| **Evaluation** | Misprojection methodology documented in working papers |
| **AI boundary** | AI may suggest sample parameters — auditor confirms |

### 39.8 Expert Involvement

| Expert Type | Trigger |
|-------------|---------|
| **IT specialist** | Significant IT risk or complex systems |
| **Valuation specialist** | Fair value estimates, impairment, financial instruments |
| **Actuarial specialist** | Insurance technical provisions, pensions |
| **Tax specialist** | Complex tax positions affecting financial statements |
| **Industry specialist** | Specialized industry knowledge required |
| **Documentation** | Expert scope, reliance level, and findings linkage recorded |

### 39.9 IT Audit Requirement

| Aspect | Product Behavior |
|--------|------------------|
| **Assessment** | IT risk rating determines IT audit scope |
| **Scope options** | ITGC testing, application control testing, data analytics |
| **Reliance** | IT audit conclusions inform control risk assessment |
| **Specialist** | IT expert assigned when scope requires |
| **Documentation** | IT audit requirement and scope in strategy |

### 39.10 Internal Audit Reliance

| Aspect | Product Behavior |
|--------|------------------|
| **Evaluation** | Document whether and extent of reliance on internal audit |
| **Factors** | Internal audit competence, objectivity, systematic approach |
| **Effect** | Reliance may reduce external audit procedures — documented |
| **Coordination** | Internal audit workpapers referenced if relied upon |
| **Default** | No reliance assumed — explicit decision required |

### 39.11 Review Workflow

| Step | Actor | Action |
|------|-------|--------|
| **Generate program** | Audit Manager | Apply firm methodology template; customize for risks |
| **Assign procedures** | Audit Manager | Assign to Auditors by audit area |
| **Submit strategy** | Audit Manager | Submit strategy and program for Partner review |
| **Review** | Engagement Partner | Review approach, resources, significant risk coverage |
| **Comment** | Engagement Partner | Challenge procedure adequacy |
| **Clear** | Engagement Partner | Clear strategy review |

### 39.12 Approval Workflow

| Requirement | Description |
|-------------|-------------|
| **Approver** | Engagement Partner approves audit strategy with audit plan |
| **Prerequisites** | Materiality approved; risk assessment complete |
| **Effect** | Audit program authorized for execution |
| **Lock** | Approved program version locked — changes require revision |
| **Procedure gate** | Auditors execute only assigned approved procedures |

### 39.13 Permissions

| Capability | Engagement Partner | Audit Manager | Audit Senior | Auditor |
|------------|-------------------|---------------|--------------|---------|
| Define strategy | Yes | Yes | Contribute | No |
| Generate audit program | Yes | Yes | No | No |
| Customize procedures | Yes | Yes | Propose | No |
| Assign procedures | Yes | Yes | Yes | No |
| Submit for approval | Yes | Yes | No | No |
| Approve strategy | Yes | No | No | No |
| View assigned procedures | Yes | Yes | Yes | Yes |
| Execute procedures | No | Oversight | Supervise | Yes |

### 39.14 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **STR-AC-01** | Audit program generated from firm methodology template |
| **STR-AC-02** | Procedures mapped to risks and assertions |
| **STR-AC-03** | Procedures assignable to individual Auditors |
| **STR-AC-04** | Resource plan and timeline documented |
| **STR-AC-05** | IT audit requirement explicitly documented |
| **STR-AC-06** | Internal audit reliance decision recorded |
| **STR-AC-07** | Expert involvement flagged where required |
| **STR-AC-08** | Partner approval locks strategy and program |
| **STR-AC-09** | Dashboard shows audit area completion tracking |
| **STR-AC-10** | Strategy revision creates versioned update |

---

## 40. User Journey — Planning to Working Paper Readiness

End-to-end experience from **approved financial statements** through **approved audit strategy** — enabling fieldwork and working paper execution.

*Continues MASTER_PRD Part 7 Section 35 — approved financial reporting package linked to engagement; builds on Section 16 engagement lifecycle and Section 20 acceptance journey.*

### 40.1 Journey Overview

```
Financial Statements Approved → Create Audit Plan → Define Materiality
    → Assess Risks → Approve Audit Strategy → Ready for Working Papers
```

**Primary actors:** Audit Manager (lead), Engagement Partner (approve), Audit Senior and Auditors (contribute). **Prerequisite:** CFO-approved financial statement package (Part 7).

### 40.2 Step 1 — Financial Statements Approved

| Perspective | Audit Manager |
|-------------|---------------|
| **State** | Engagement dashboard shows approved financial reporting package linked |
| **Sees** | Statement version, note version, trial balance version references |
| **Enabled** | **Audit Planning** workflow active |
| **Context** | Significant accounts derivable from approved statements and classified trial balance |

**User sees:** Banner — **Financial reporting approved** — planning actions enabled.

*Note: Initial materiality may already be documented at engagement acceptance (Section 20.6). Planning phase confirms or revises materiality.*

### 40.3 Step 2 — Create Audit Plan

| Perspective | Audit Manager |
|-------------|---------------|
| **Action** | Navigate to Engagement → **Audit Planning** → **Create Plan** |
| **Processing** | Planning memorandum initiated; engagement objectives and scope populated from engagement profile |
| **Content** | Entity overview, prior-year summary, significant matters from acceptance |
| **Significant accounts** | System suggests accounts from trial balance and approved statements |
| **Significant processes** | Industry pack suggests standard cycles — manager confirms |
| **Team** | Procedure assignments drafted from team roster |
| **AI** | AI Planning Assistant may draft memorandum sections — manager reviews and edits |

**User sees:** Planning workspace with memorandum editor, significant accounts list, and team planning panel.

### 40.4 Step 3 — Define Materiality

| Perspective | Audit Manager; Engagement Partner |
|-------------|----------------------------------|
| **Action** | Open **Materiality** worksheet within planning |
| **Input** | Benchmark (e.g., total assets), percentage, overall materiality; performance materiality; specific materiality items; trivial threshold |
| **Override** | Manager adjusts calculated amount with documented rationale if needed |
| **Submit** | Manager submits for Partner review |
| **Approve** | Partner approves materiality — version locked |
| **Revision** | If financial data changed materially since acceptance, manager revises with new version |

**User sees:** Materiality worksheet with calculation trail and approval status **Approved**.

### 40.5 Step 4 — Assess Risks

| Perspective | Audit Manager; Audit Senior |
|-------------|----------------------------|
| **Action** | Open **Risk Assessment** — initiate account × assertion matrix |
| **AI** | AI Risk Advisor displays account-level indicators — manager evaluates each |
| **Fraud** | Complete fraud risk section — document team brainstorming |
| **Rate** | Assign inherent risk per assertion; document rationale |
| **Significant risks** | System flags high ratings and fraud risks — Partner notification |
| **Heat map** | Review color-coded risk heat map; drill into high-risk cells |
| **Linkage** | Link each significant risk to responsive procedures |
| **Submit** | Manager submits risk assessment for Partner review of significant risks |

**User sees:** Risk matrix and heat map with significant risks highlighted; AI indicators marked **Advisory**.

### 40.6 Step 5 — Approve Audit Strategy

| Perspective | Audit Manager; Engagement Partner |
|-------------|----------------------------------|
| **Strategy** | Manager defines overall approach — substantive, controls, or combined |
| **Program** | Firm methodology template generates audit program; manager customizes for risks |
| **Resources** | Hours, timeline, and expert involvement documented |
| **IT / IA** | IT audit requirement and internal audit reliance decisions recorded |
| **Submit** | Manager submits complete planning package — memorandum, materiality, risk, strategy, program |
| **Review** | Partner reviews significant matters, risk coverage, resource adequacy |
| **Approve** | Partner approves audit plan and strategy — planning gate cleared |
| **Status** | Engagement transitions **Planning → Fieldwork** |

**User sees:** Planning package status **Approved**; engagement lifecycle advances to **Fieldwork**.

### 40.7 Step 6 — Ready for Working Papers

| Milestone | Criteria |
|-----------|----------|
| **Approved audit plan** | Partner-approved planning package |
| **Materiality** | Documented and approved |
| **Risk assessment** | Complete with significant risks acknowledged |
| **Audit program** | Procedures assigned to team |
| **Financial data** | Approved statements and validated trial balance linked |
| **Planning gate** | ENG-03 satisfied — fieldwork enabled |
| **Next workflow** | Auditors execute assigned procedures; working papers created (Workflow 15) |

| Perspective | Auditor |
|-------------|---------|
| **Action** | Open engagement → **My Procedures** — view assigned audit program items |
| **Context** | Each procedure shows risk linkage, assertion, and audit area |
| **Begin** | Start working paper for assigned procedure |
| **Senior** | Audit Senior supervises fieldwork; Manager monitors completion dashboard |

**User sees:** Engagement dashboard milestone — **Ready for Working Papers** — assigned procedures active; working paper creation enabled.

### 40.8 Journey Diagram

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│    Financial     │───►│   Create Audit   │───►│     Define       │
│   Statements     │    │      Plan        │    │   Materiality    │
│    Approved      │    └──────────────────┘    └────────┬─────────┘
└──────────────────┘                                    │
                                                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│     Ready for    │◄───│    Approve       │◄───│   Assess Risks   │
│ Working Papers   │    │  Audit Strategy  │    │                  │
└──────────────────┘    └──────────────────┘    └──────────────────┘
```

### 40.9 Planning Gate Summary

| Gate | Requirement | Business Rule |
|------|-------------|---------------|
| **Planning initiation** | Engagement Accepted | ENG-01 |
| **Plan submission** | Materiality + risk + strategy complete | PLN-V02–V04 |
| **Fieldwork enablement** | Partner-approved audit plan | ENG-03 |
| **Working papers** | Assigned procedures from approved program | Workflow 15 |

### 40.10 Journey Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **PLJ-AC-01** | Planning enabled when approved financial package linked |
| **PLJ-AC-02** | Full planning journey completable end-to-end |
| **PLJ-AC-03** | Partner approval transitions engagement to Fieldwork |
| **PLJ-AC-04** | Unapproved plan blocks procedure execution |
| **PLJ-AC-05** | Auditors see assigned procedures after plan approval |
| **PLJ-AC-06** | Ready for Working Papers milestone displayed after approval |
| **PLJ-AC-07** | AI inputs marked advisory throughout planning journey |

---

## PRD Review Notes — Part 8

Consistency review of MASTER_PRD Part 8 against PROJECT_BIBLE (Parts 1–15) and MASTER_PRD Parts 1–7. No previous sections modified.

### Constitutional Alignment

| Area | Status | Notes |
|------|--------|-------|
| Workflow 13 Audit Planning | Aligned | Sections 36, 39 |
| Workflow 14 Risk Assessment | Aligned | Section 38 |
| Part 15 §77 ISA Methodology | Aligned | Risk-based auditing, professional judgment, AI boundaries |
| Part 15 §78 Audit Lifecycle | Aligned | Planning stage; planning gate (§78.3) |
| Part 15 §77.6 Materiality | Aligned | Section 37 — audit context |
| Part 15 §80 Documentation Standards | Aligned | Planning ownership by Audit Manager |
| ENG-03 Planning gate | Aligned | Sections 36, 40 |
| APR-01 through APR-05 | Aligned | Approval chains throughout |

### MASTER_PRD Parts 1–7 Alignment

| Area | Status |
|------|--------|
| Section 16.13 Materiality configuration | Section 37 expands — not duplicated |
| Section 16.15 Planning → Fieldwork gate | Sections 36, 40 |
| Section 20.6 Materiality at acceptance | Section 40.4 references refinement |
| Part 7 approved financial package | Section 40.2 prerequisite |
| Part 7 "Ready for Working Papers" milestone | Section 40 clarifies fieldwork gate — see PRD8-01 |
| PRD7-05 Lead sheet linkage | Deferred — future audit PRD part |
| Team management (Section 13) | Section 36.9 team planning |

### Terminology Consistency

| Term | Status |
|------|--------|
| Audit materiality vs reporting materiality | Section 37.2 — distinct contexts |
| Inherent / control / detection risk | ISA-aligned — Section 38 |
| Significant risk | Partner visibility — Section 38.14 |
| Significant accounts | Planning input — Section 36.7 |
| Assertion-level risks | Section 38.10 matrix |
| AI advisory vs conclusion | Consistent with Parts 4–6 AI rules |

### Governance & Approval Chain

| Area | Status |
|------|--------|
| Audit Manager prepares | Sections 36, 37, 38, 39 |
| Engagement Partner approves plan | Sections 36.12, 39.12 |
| Materiality Partner approval | Section 37.10 |
| Significant risk Partner acknowledgment | Section 38.14 |
| Separation of duties | APR-02 in review workflows |
| Versioning | All planning artifacts versioned |

### Editorial Recommendations

| ID | Recommendation |
|----|----------------|
| **PRD8-01** | Reconcile Part 7 §35.8 "Ready for Working Papers" (reporting approved) with Part 8 §40.7 (planning gate cleared) — consider dual milestones: "Financial Reporting Approved" and "Planning Complete — Fieldwork Enabled" in future editorial pass (Parts 1–7 not modified) |
| **PRD8-02** | Journal Adjustments (Workflow 10, PRD7-01) — specify in Part 9 between classification and statement generation or as audit adjustment workflow |
| **PRD8-03** | Internal Control Evaluation lifecycle stage (Bible §78) — dedicated PRD part for control documentation and reliance |
| **PRD8-04** | Working Paper Generation (Workflow 15) — Part 9 audit execution |
| **PRD8-05** | Lead Sheet Generation (Workflow 16) — Part 9; links to PRD7-05 |
| **PRD8-06** | Client acceptance workflow (ISA-03) — engagement PRD expansion |
| **PRD8-07** | Time tracking and budget vs. actual hours — resource planning integration |
| **PRD8-08** | Group audit and component auditor coordination — future enterprise part |

### Review Conclusion

MASTER_PRD Part 8 is **consistent with PROJECT_BIBLE and Parts 1–7**. It specifies audit planning, materiality, risk assessment, and audit strategy as governed ISA-aligned workflows without contradicting engagement lifecycle, approval philosophy, or AI human-in-the-loop requirements. PRD8-01 through PRD8-08 guide subsequent PRD parts.

---

## Document Control — Part 8

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.8.0 | 2026-06-30 | Chief Product Officer | Part 8 — Audit Planning, Materiality & Risk Assessment complete; PRD Review Notes Part 8 included |

---

*End of Part 8. Await further instruction for Part 9.*







