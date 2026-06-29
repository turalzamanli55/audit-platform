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

*End of Part 8.*

---

## Part 9 — Audit Program & Procedure Execution

### Table of Contents — Part 9

41. [Audit Program Management](#41-audit-program-management)
42. [Audit Procedures Module](#42-audit-procedures-module)
43. [Procedure Execution](#43-procedure-execution)
44. [Procedure Monitoring](#44-procedure-monitoring)
45. [User Journey — Program Execution to Working Paper Readiness](#45-user-journey--program-execution-to-working-paper-readiness)

---

## 41. Audit Program Management

Audit Program Management governs **creation, customization, approval, and lifecycle of the engagement audit program** — the authoritative set of planned procedures mapped to risks, assertions, and audit areas.

*Constitutional basis: PROJECT_BIBLE Part 3 Workflow 13; Part 8 Audit Program entity; Part 15 Sections 77.2, 78; Business Rules ENG-03, WP-04, VER-01 through VER-03.*

### 41.1 Purpose

Provide a **governed, versioned audit program** derived from firm methodology and engagement risk assessment — defining every planned procedure before and during fieldwork execution.

### 41.2 Business Goals

| Goal | Description |
|------|-------------|
| **Risk-responsive design** | Every procedure linked to assessed risk and assertion |
| **Methodology consistency** | Firm ISA-aligned templates applied uniformly |
| **Planning integration** | Program embedded in approved audit plan (Section 39) |
| **Execution control** | Only approved program procedures executable by team |
| **Traceability** | Program version references materiality and risk assessment versions |
| **Flexibility** | Customization permitted with documented rationale |
| **Inspection readiness** | Program documents audit strategy for regulators and quality review |

### 41.3 Audit Program Templates

| Template Type | Source |
|---------------|--------|
| **Core ISA program** | Firm-published base methodology aligned with ISA |
| **Entity-size variants** | Small entity, listed entity, group audit supplements |
| **Framework variants** | IFRS-focused procedure sets per reporting framework |
| **Prior-year roll-forward** | Prior engagement approved program as starting point |
| **Governance** | Only workspace-approved template versions applied (WS-02) |

Templates carry version numbers and effective dates; generation locks template version at program creation.

### 41.4 Risk-Based Program Generation

| Aspect | Product Behavior |
|--------|------------------|
| **Trigger** | Audit strategy development or program regeneration request |
| **Inputs** | Approved risk assessment, materiality, significant accounts, audit approach |
| **Logic** | Procedures included or intensified where risk rated higher |
| **Significant risks** | Mandatory responsive procedures auto-included |
| **Fraud risks** | Fraud-responsive procedures from methodology library |
| **Exclusions** | Low-risk areas may receive reduced procedures per firm policy — documented |
| **Linkage** | Each generated procedure references source risk(s) and assertion(s) |
| **AI assistance** | AI Planning Assistant may suggest procedure modifications — manager confirms |

### 41.5 Industry-Specific Programs

| Industry Pack | Additional Procedures |
|---------------|----------------------|
| **Banking** | Loan portfolios, regulatory capital, ECL, liquidity |
| **Insurance** | Technical provisions, claims, reserving |
| **Manufacturing** | Inventory costing, WIP, physical inventory |
| **Real estate** | Investment property, development projects |
| **Technology** | Revenue recognition, capitalized development costs |

Industry supplements **merge with core program** — not replace — with industry procedures flagged in program index.

### 41.6 Custom Programs

| Aspect | Product Behavior |
|--------|------------------|
| **Addition** | Manager adds procedures from library or creates custom procedure |
| **Removal** | Procedure removal requires documented rationale — risk coverage maintained |
| **Modification** | Procedure extent or nature changed — versioned with reason |
| **Client-specific** | Entity-specific matters add bespoke procedures |
| **Validation** | Program cannot approve if significant risk lacks linked procedure |
| **Partner visibility** | Material program deviations flagged for Partner review |

### 41.7 Procedure Library

| Library Element | Description |
|-----------------|-------------|
| **Standard procedures** | Firm-curated ISA-aligned procedure definitions |
| **Procedure metadata** | Type, assertion, audit area, estimated hours, evidence requirements |
| **Working paper template** | Linked template per library procedure (WP-04) |
| **Search** | Filter by type, assertion, industry, risk level |
| **Versioning** | Library procedures versioned; engagements lock version at assignment |
| **Customization** | Workspace may publish firm-specific library extensions |

### 41.8 Program Versioning

| Event | Versioning |
|-------|------------|
| **Initial generation** | Version 1 at strategy approval |
| **Post-approval change** | Risk reassessment, scope change, or procedure modification creates new version |
| **Metadata** | Risk assessment version, materiality version, template version recorded |
| **Preservation** | All prior versions retained (VER-01, VER-02) |
| **Effect on execution** | In-flight procedures tied to program version at assignment; changes may require reassignment |
| **Comparison** | Any two program versions comparable |

### 41.9 Program Approval

| Step | Actor | Requirement |
|------|-------|-------------|
| **Prepare** | Audit Manager | Complete program — risk linkage, assignments drafted |
| **Review** | Engagement Partner | Review coverage of significant risks and resource adequacy |
| **Approve** | Engagement Partner | Approve program as part of audit plan package (Section 36.12) |
| **Lock** | System | Approved program version locked — modification requires revision |
| **Gate** | System | Fieldwork status requires approved program (ENG-03) |

Program approval is **integrated with audit plan approval** — not a separate bypassable step (APR-01).

### 41.10 Program Status

| Status | Meaning |
|--------|---------|
| **Draft** | Program generated or edited — not approved |
| **Pending approval** | Submitted with planning package |
| **Approved** | Partner approved — procedures executable |
| **In execution** | Fieldwork active — procedures being performed |
| **Substantially complete** | All required procedures complete or in final review |
| **Superseded** | New program version approved |
| **Archived** | Engagement closed — read-only |

### 41.11 Permissions

| Capability | Engagement Partner | Audit Manager | Audit Senior | Auditor |
|------------|-------------------|---------------|--------------|---------|
| Generate program | Yes | Yes | No | No |
| Customize program | Yes | Yes | Propose | No |
| Add/remove procedures | Yes | Yes | Propose | No |
| Submit for approval | Yes | Yes | No | No |
| Approve program | Yes | No | No | No |
| View approved program | Assigned team | Assigned team | Assigned team | Assigned team |
| Execute procedures | Oversight | Oversight | Supervise | Assigned only |

### 41.12 Business Validations

| Validation | Rule |
|------------|------|
| **PRG-V01** | Program generation blocked without completed risk assessment |
| **PRG-V02** | Program generation blocked without approved materiality |
| **PRG-V03** | Significant risk without responsive procedure blocks approval |
| **PRG-V04** | Approved program required before procedure execution |
| **PRG-V05** | Procedure removal requires documented rationale |
| **PRG-V06** | Program version references risk and materiality versions (VER-03) |
| **PRG-V07** | Only approved firm template versions applied (WP-04) |
| **PRG-V08** | Program revision after approval creates new version |
| **PRG-V09** | Custom procedure must specify type, assertion, and audit area |
| **PRG-V10** | Industry supplement requires matching industry compliance pack |

### 41.13 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **PRG-AC-01** | Program generatable from firm template and risk assessment |
| **PRG-AC-02** | Each procedure linked to risk and assertion |
| **PRG-AC-03** | Significant risk coverage validated before approval |
| **PRG-AC-04** | Industry supplement merges with core program |
| **PRG-AC-05** | Custom procedure add/remove with rationale supported |
| **PRG-AC-06** | Partner approval locks program version |
| **PRG-AC-07** | Program version comparison available |
| **PRG-AC-08** | Procedure library searchable by type and assertion |
| **PRG-AC-09** | Unapproved program blocks procedure execution |
| **PRG-AC-10** | Program status visible on engagement dashboard |

---

## 42. Audit Procedures Module

The Audit Procedures Module defines **individual audit procedures** within the approved program — their types, attributes, assignment, status, and review requirements.

*Constitutional basis: PROJECT_BIBLE Part 8 Working Paper entity; Part 15 Sections 77.5, 79; Business Rules WP-01 through WP-05.*

### 42.1 Purpose

Structure each planned procedure as a **governed, assignable unit of audit work** — with defined type, assertion, risk linkage, evidence requirements, and multi-level review workflow.

### 42.2 Business Goals

| Goal | Description |
|------|-------------|
| **Assertion coverage** | Procedures explicitly test financial statement assertions |
| **Risk responsiveness** | Procedure nature and extent match assessed risk |
| **Clear accountability** | Every procedure assigned to a named Auditor |
| **Evidence discipline** | Procedures cannot complete without linked evidence (WP-02) |
| **Review quality** | Multi-level review before sign-off |
| **Methodology compliance** | Procedures execute from approved templates (WP-04) |
| **Traceability** | Procedure links to risk, account, working paper, and evidence |

### 42.3 Procedure Types

| Type | ISA Context | Primary Use |
|------|-------------|-------------|
| **Test of controls** | ISA 330 | Evaluate operating effectiveness of internal controls |
| **Substantive procedure** | ISA 330 | Detect material misstatements at assertion level |
| **Analytical procedure** | ISA 520 | Evaluate financial information through analysis of plausible relationships |
| **Sampling procedure** | ISA 530 | Select and test subset of population |
| **Inquiry** | ISA 500 | Obtain information from knowledgeable persons |
| **Observation** | ISA 500 | Watch performance of process or control |
| **Inspection** | ISA 500 | Examine documents or records — internal or external |
| **Reperformance** | ISA 500 | Independently re-execute control or calculation |

Each procedure carries **one primary type**; composite procedures document sub-techniques in working paper.

### 42.4 Test of Controls

| Attribute | Product Requirement |
|-----------|---------------------|
| **Purpose** | Obtain evidence about operating effectiveness of controls |
| **Linkage** | Linked to documented control and process (future control module) |
| **Assertions** | Typically existence, completeness, authorization |
| **Evidence** | Walkthrough documentation, test of one, sample of control operations |
| **Conclusion** | Effective, ineffective, or not tested — with deficiency linkage if ineffective |
| **Effect** | Effective controls may reduce substantive extent — documented in strategy |

### 42.5 Substantive Procedures

| Attribute | Product Requirement |
|-----------|---------------------|
| **Purpose** | Detect material misstatements in account balances and disclosures |
| **Sub-types** | Tests of details; substantive analytical procedures |
| **Assertions** | Mapped per account — existence, valuation, completeness, etc. |
| **Extent** | Risk-responsive — higher risk warrants more extensive testing |
| **Materiality reference** | Performance materiality guides sample sizes |
| **Evidence** | Confirmations, vouching, reconciliation, recalculation |

### 42.6 Analytical Procedures

| Attribute | Product Requirement |
|-----------|---------------------|
| **Purpose** | Evaluate financial information through plausible relationships |
| **Stages** | Planning, substantive, or completion — flagged per procedure |
| **Documentation** | Expectation, actual, variance, investigation, conclusion |
| **AI boundary** | AI may compute trends; auditor explains and concludes |
| **Follow-up** | Unexplained significant variances require additional procedures |

### 42.7 Sampling Procedures

| Attribute | Product Requirement |
|-----------|---------------------|
| **Purpose** | Obtain audit evidence about population through sample testing |
| **Methodology** | Firm sampling guidance referenced — statistical or non-statistical |
| **Documentation** | Population definition, sample size basis, selection method, results |
| **Selection** | Auditor performs selection — system may assist, not auto-conclude |
| **Evaluation** | Misprojection and sampling risk documented in working paper |

### 42.8 Inquiry Procedures

| Attribute | Product Requirement |
|-----------|---------------------|
| **Purpose** | Obtain information through inquiry of management or others |
| **Documentation** | Person interviewed, date, questions, responses, corroboration |
| **Corroboration** | Inquiry alone insufficient for high-risk assertions — corroborating evidence required |
| **Governance inquiries** | Those charged with governance — documented separately where required |

### 42.9 Observation Procedures

| Attribute | Product Requirement |
|-----------|---------------------|
| **Purpose** | Observe performance of process, procedure, or control |
| **Documentation** | What observed, when, by whom, limitations of observation |
| **Limitation** | Point-in-time nature documented — may require complementary procedures |
| **Inventory** | Physical inventory observation flagged as specialized observation procedure |

### 42.10 Inspection Procedures

| Attribute | Product Requirement |
|-----------|---------------------|
| **Purpose** | Examine documents, records, or tangible assets |
| **Evidence types** | Contracts, invoices, bank statements, legal documents |
| **External vs internal** | Source reliability noted per ISA 500 hierarchy |
| **Client-provided** | Client-provided documents marked per evidence rules (AE-05) |
| **Linkage** | Inspected items linked as evidence to working paper |

### 42.11 Reperformance Procedures

| Attribute | Product Requirement |
|-----------|---------------------|
| **Purpose** | Independently re-execute control or calculation |
| **Use cases** | Recalculation of depreciation, interest, ECL models, control re-performance |
| **Documentation** | Original result, reperformed result, agreement or variance |
| **Expert** | Complex reperformance may involve specialist — documented |

### 42.12 Procedure Assignment

| Aspect | Product Behavior |
|--------|------------------|
| **Assignee** | Individual Auditor on engagement team |
| **Assignor** | Audit Manager or Audit Senior |
| **Due date** | Target completion date per fieldwork timeline |
| **Priority** | High-risk procedures flagged for prioritization |
| **Reassignment** | Manager reassigns with audit trail |
| **Notification** | Assignee notified of new or changed assignment |
| **Visibility** | Assignee sees procedure in **My Procedures** list |

### 42.13 Procedure Status

| Status | Meaning |
|--------|---------|
| **Not started** | Assigned — no working paper created |
| **In progress** | Working paper initiated; fieldwork underway |
| **Pending evidence** | Work in progress — required evidence not yet linked |
| **Submitted for review** | Auditor submitted working paper for review |
| **Review in progress** | Review notes open |
| **Returned** | Reviewer returned with comments |
| **Review cleared** | Required review levels cleared |
| **Complete** | Signed off — procedure finished (WP-02) |
| **Blocked** | Cannot proceed — dependency or evidence gap |
| **Deferred** | Postponed with documented reason and target date |

### 42.14 Review Workflow

| Level | Reviewer | Scope |
|-------|----------|-------|
| **First** | Audit Senior | Procedure execution, evidence linkage, conclusion support |
| **Second** | Audit Manager | Program compliance, risk coverage, exception evaluation |
| **Final (significant)** | Engagement Partner | Significant risk procedures and matters per firm policy |

| Step | Product Behavior |
|------|------------------|
| **Submit** | Auditor submits working paper linked to procedure |
| **Review** | Reviewer examines evidence sufficiency and conclusion |
| **Comment** | Review notes attached — severity: informational, required, blocking |
| **Resolve** | Auditor responds and updates working paper |
| **Clear** | Reviewer clears notes at assigned level |
| **Escalate** | Significant matters escalated to next review level |

Preparer cannot be sole final reviewer (WP-01, APR-02).

### 42.15 Approval Workflow

| Aspect | Product Behavior |
|--------|------------------|
| **Sign-off** | Review clearance constitutes procedure approval at review level |
| **Completion gate** | Procedure marked Complete only after required sign-offs (WP-02) |
| **Partner sign-off** | Significant risk procedures require Partner visibility per firm policy |
| **Attribution** | Each sign-off records reviewer, level, timestamp (APR-05) |
| **Lock** | Signed-off working paper locked — edits create new version (WP-03) |

### 42.16 Permissions

| Capability | Engagement Partner | Audit Manager | Audit Senior | Auditor |
|------------|-------------------|---------------|--------------|---------|
| Assign procedures | Yes | Yes | Yes | No |
| Execute assigned procedure | No | No | Supervise | Yes (assigned) |
| Submit for review | No | No | Yes | Yes |
| First-level review | Yes | Yes | Yes | No |
| Second-level review | Yes | Yes | No | No |
| Final review (significant) | Yes | No | No | No |
| Mark complete | No | Authorize | Authorize | No |
| View all procedures | Yes | Yes | Yes | Assigned + team read |

### 42.17 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **PRC-AC-01** | Procedures creatable with all defined types |
| **PRC-AC-02** | Each procedure linked to assertion and risk |
| **PRC-AC-03** | Manager can assign procedure to Auditor |
| **PRC-AC-04** | Assignee sees procedure in My Procedures |
| **PRC-AC-05** | Status lifecycle enforced through review |
| **PRC-AC-06** | Preparer cannot be sole final reviewer |
| **PRC-AC-07** | Complete blocked without required review sign-off |
| **PRC-AC-08** | Review notes attachable with severity |
| **PRC-AC-09** | Significant risk procedures visible to Partner |
| **PRC-AC-10** | Procedure links to working paper template (WP-04) |

---

## 43. Procedure Execution

Procedure Execution governs **fieldwork performance** — how assigned auditors perform procedures, document results, handle exceptions, and advance through review to completion.

*Constitutional basis: PROJECT_BIBLE Part 3 Workflow 15; Part 15 Sections 79–80; Business Rules WP-01 through WP-05, AI-01 through AI-05.*

### 43.1 Execution Lifecycle

```
Assigned → In Progress → Evidence Linked → Submitted → Senior Review
    → Manager Review → Partner Review (if required) → Complete
         ↑                    ↓
    Returned ←── Review Notes / Exceptions
```

| Stage | Gate |
|-------|------|
| **Start** | Approved program; procedure assigned; engagement in Fieldwork |
| **Evidence** | Required evidence types linked before submission |
| **Review** | Multi-level review per firm policy |
| **Complete** | All sign-offs obtained; no blocking review notes (WP-02) |

### 43.2 Assigned Auditor

| Aspect | Product Behavior |
|--------|------------------|
| **Accountability** | Named Auditor responsible for execution and working paper |
| **Handoff** | Reassignment requires manager action and notification |
| **Supervision** | Audit Senior supervises assigned Auditors |
| **Expert procedures** | Specialist may execute with Auditor oversight — documented |
| **Restriction** | Auditor executes only assigned approved procedures |

### 43.3 Execution Notes

| Element | Product Requirement |
|---------|---------------------|
| **Procedure narrative** | What was done, when, by whom |
| **Period covered** | Reporting period and cut-off addressed |
| **Population** | Population tested or sample drawn from |
| **Methodology** | Technique applied per procedure type |
| **Contemporaneous** | Documentation created during fieldwork — not backdated |
| **AI content** | AI-drafted sections marked until human acceptance (AI-01) |

### 43.4 Procedure Results

| Result Type | Documentation |
|-------------|---------------|
| **No exceptions** | Conclusion that procedure objective met |
| **Exceptions noted** | Variances, errors, control deviations recorded |
| **Qualified conclusion** | Limitation in scope or evidence documented |
| **Quantitative results** | Sample error rate, analytical variance, recalculation difference |
| **Assertion conclusion** | Whether assertion supported for tested area |

### 43.5 Exceptions

| Aspect | Product Behavior |
|--------|------------------|
| **Recording** | Exception documented with amount, nature, and account |
| **Classification** | Factual misstatement, projected misstatement, control deficiency |
| **Materiality** | Compared to performance and overall materiality |
| **Aggregation** | Exceptions feed misstatement summary (future findings module) |
| **Follow-up** | Material exceptions trigger additional procedures or finding documentation |

### 43.6 Follow-up Actions

| Action Type | Trigger |
|-------------|---------|
| **Additional procedures** | Unexplained exception or insufficient evidence |
| **Management inquiry** | Clarification required on exception or estimate |
| **Adjustment proposed** | Misstatement above trivial threshold |
| **Control deficiency** | Control failure identified in test of controls |
| **Risk reassessment** | New information changes risk profile |
| **Tracking** | Follow-up actions assigned with due date and owner |

### 43.7 Completion Status

| Requirement | Rule |
|-------------|------|
| **Evidence linked** | All required evidence attached and indexed |
| **Conclusion stated** | Professional conclusion documented |
| **Review cleared** | Required review levels signed off |
| **Exceptions resolved** | Blocking exceptions addressed or escalated |
| **AI accepted** | AI-assisted content human-approved |
| **Status** | Procedure status → Complete (WP-02) |

### 43.8 Manager Review

| Aspect | Product Behavior |
|--------|------------------|
| **Scope** | Evidence sufficiency, methodology compliance, exception evaluation |
| **Challenge** | Manager may return with review notes |
| **Sign-off** | Manager sign-off at second review level |
| **Escalation** | Significant matters escalated to Partner |
| **Blocking** | Uncleared blocking notes prevent completion |

### 43.9 Partner Review

| Aspect | Product Behavior |
|--------|------------------|
| **Trigger** | Significant risk procedures; material exceptions; firm policy thresholds |
| **Scope** | Professional judgment areas, significant estimates, fraud procedures |
| **Visibility** | Partner queue of procedures requiring attention |
| **Sign-off** | Partner sign-off recorded for significant items |
| **Non-routine** | Not every procedure requires Partner review — configurable per firm |

### 43.10 Audit Trail

| Event | Recorded |
|-------|----------|
| Procedure start / submit / return | User, timestamp, status |
| Evidence attach / detach | Document reference, user |
| Exception recorded | Amount, classification, user |
| Review note thread | Full history preserved |
| Sign-off at each level | Reviewer, level, timestamp |
| AI interaction | Prompt, output, accept/reject (AI-03) |
| Reassignment | Prior and new assignee, manager |
| Completion | Final status, program version reference |

### 43.11 Permissions

| Capability | Engagement Partner | Audit Manager | Audit Senior | Auditor |
|------------|-------------------|---------------|--------------|---------|
| Start execution | No | No | No | Yes (assigned) |
| Edit working paper | No | No | Supervise | Yes (assigned, pre-sign-off) |
| Record exceptions | No | Yes | Yes | Yes |
| Create follow-up | Yes | Yes | Yes | Propose |
| Submit for review | No | No | Yes | Yes |
| Manager review sign-off | Yes | Yes | No | No |
| Partner review sign-off | Yes | No | No | No |
| Mark complete | Yes | Yes | No | No |

### 43.12 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **EXE-AC-01** | Auditor can start execution only for assigned approved procedures |
| **EXE-AC-02** | Submission blocked without required evidence linkage |
| **EXE-AC-03** | Exceptions recordable with classification and amount |
| **EXE-AC-04** | Follow-up actions assignable with tracking |
| **EXE-AC-05** | Multi-level review workflow completable |
| **EXE-AC-06** | Complete blocked without required sign-offs |
| **EXE-AC-07** | Preparer cannot sign off own work as final reviewer |
| **EXE-AC-08** | Partner review queue shows significant procedures |
| **EXE-AC-09** | Full execution audit trail exportable |
| **EXE-AC-10** | AI-assisted content marked until accepted |

---

## 44. Procedure Monitoring

Procedure Monitoring provides **engagement-wide visibility** into audit program execution — enabling managers and partners to oversee progress, identify bottlenecks, and enforce fieldwork discipline.

*Constitutional basis: PROJECT_BIBLE Part 3 Workflow 13; MASTER_PRD Section 19 Engagement Dashboard.*

### 44.1 Open Procedures

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Procedures not yet Complete — Not started through Review in progress |
| **View** | Filterable list by assignee, audit area, risk level, due date |
| **Dashboard** | Count and list on engagement dashboard (Section 19) |
| **Drill-down** | Click to view procedure detail, assignee, and status |
| **Unassigned** | Procedures without assignee flagged prominently |

### 44.2 Completed Procedures

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Procedures with Complete status and required sign-offs |
| **Metrics** | Count and percentage of total program |
| **By area** | Completion breakdown by financial statement area |
| **By assignee** | Individual completion rates for workload balancing |
| **Trend** | Completion velocity over fieldwork period |

### 44.3 Overdue Procedures

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Assigned procedures past due date without Complete status |
| **Alert** | Manager and assignee notified |
| **Escalation** | Overdue high-risk procedures escalate to Partner visibility |
| **Dashboard** | Red indicator on outstanding tasks widget |
| **Reporting** | Overdue list exportable for team meetings |

### 44.4 Blocked Procedures

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Procedures that cannot proceed — evidence gap, dependency, client delay |
| **Reason** | Block reason documented by assignee or manager |
| **Resolution** | Manager clears block or reassigns when resolved |
| **Effect** | Blocked procedures excluded from completion percentage optionally |
| **Alert** | Blocked procedures visible on manager dashboard |

### 44.5 High-Risk Procedures

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Procedures linked to significant or high inherent risk |
| **Priority** | Displayed prominently in monitoring views |
| **Review status** | Partner review status tracked separately |
| **Completion** | High-risk completion rate KPI for engagement health |
| **Coverage** | Alert if high-risk procedure not started near fieldwork deadline |

### 44.6 Execution Progress

| Metric | Description |
|--------|-------------|
| **Overall completion** | % procedures Complete vs. total approved program |
| **By status** | Distribution across status lifecycle |
| **By audit area** | Area-level progress bars |
| **Review backlog** | Procedures submitted but not review-cleared |
| **Fieldwork timeline** | Actual progress vs. planned fieldwork milestones |
| **Milestone** | Substantially complete when all required procedures Complete |

### 44.7 KPIs

| KPI | Audience | Purpose |
|-----|----------|---------|
| **Procedure completion rate** | Audit Manager | Fieldwork progress |
| **Overdue procedure count** | Audit Manager | Deadline risk |
| **Review turnaround time** | Audit Manager | Review efficiency |
| **High-risk completion %** | Engagement Partner | Significant matter coverage |
| **Exception density** | Audit Manager | Quality and risk indicator |
| **Blocked procedure count** | Audit Manager | Dependency management |
| **Team utilization** | Audit Manager | Workload balance |
| **Program version currency** | Audit Manager | Planning drift detection |

### 44.8 Business Rules

| Rule | Description |
|------|-------------|
| **MON-R01** | Monitoring reflects real-time procedure status — not manual override |
| **MON-R02** | Overdue alerts sent to assignee and manager |
| **MON-R03** | High-risk incomplete near deadline escalates to Partner |
| **MON-R04** | Blocked procedures require documented reason |
| **MON-R05** | Completion % excludes superseded program procedures |
| **MON-R06** | Dashboard KPIs scoped to current approved program version |
| **MON-R07** | Partner view includes significant risk procedure subset |
| **MON-R08** | Substantially complete requires all required procedures Complete |

### 44.9 Permissions

| Capability | Engagement Partner | Audit Manager | Audit Senior | Auditor |
|------------|-------------------|---------------|--------------|---------|
| View engagement monitoring | Yes | Yes | Yes | Team summary |
| View team workload | Yes | Yes | Yes | Own assignments |
| View overdue / blocked | Yes | Yes | Yes | Own overdue |
| View high-risk dashboard | Yes | Yes | Yes | Assigned high-risk |
| Configure alerts | Yes | Yes | No | No |
| Export monitoring report | Yes | Yes | No | No |

### 44.10 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **MON-AC-01** | Dashboard shows procedure completion percentage |
| **MON-AC-02** | Overdue procedures identified and alerted |
| **MON-AC-03** | Blocked procedures require reason and appear in list |
| **MON-AC-04** | High-risk procedures filterable and tracked |
| **MON-AC-05** | Progress breakdown by audit area available |
| **MON-AC-06** | Manager sees team workload distribution |
| **MON-AC-07** | Partner sees high-risk completion KPI |
| **MON-AC-08** | Review backlog count visible |
| **MON-AC-09** | Monitoring scoped to approved program version |
| **MON-AC-10** | Export of monitoring summary supported |

---

## 45. User Journey — Program Execution to Working Paper Readiness

End-to-end experience from **approved audit strategy** through **executed, reviewed procedures** — with working paper documentation cleared for lead sheet compilation.

*Continues MASTER_PRD Part 8 Section 40 — engagement in Fieldwork status with approved planning package.*

### 45.1 Journey Overview

```
Audit Strategy Approved → Generate Audit Program → Assign Procedures
    → Execute Procedures → Manager Review → Partner Review → Ready for Working Papers
```

**Primary actors:** Audit Manager (oversight), Auditor (execute), Audit Senior (first review), Engagement Partner (significant review). **Prerequisite:** Partner-approved audit strategy and program (Section 39, 41).

### 45.2 Step 1 — Audit Strategy Approved

| Perspective | Audit Manager |
|-------------|---------------|
| **State** | Engagement status **Fieldwork**; planning package approved |
| **Sees** | Approved program version, materiality, risk assessment references |
| **Enabled** | Program management and procedure assignment active |
| **Context** | Approved financial statements and trial balance linked |

**User sees:** Engagement dashboard — **Audit strategy approved** — fieldwork actions enabled.

### 45.3 Step 2 — Generate Audit Program

| Perspective | Audit Manager |
|-------------|---------------|
| **Action** | Open **Audit Program** — view program generated at strategy approval |
| **Refine** | Add industry procedures; customize for entity-specific risks; remove low-risk procedures with rationale |
| **Validate** | System confirms significant risks have responsive procedures |
| **AI** | AI Planning Assistant suggests modifications — manager accepts or rejects |
| **Version** | Material changes create program revision — Partner re-approval if required |

**User sees:** Program index grouped by audit area with risk linkage indicators; validation checklist green.

### 45.4 Step 3 — Assign Procedures

| Perspective | Audit Manager; Audit Senior |
|-------------|----------------------------|
| **Action** | Select procedures → assign to Auditors with due dates |
| **Priority** | High-risk and significant risk procedures assigned first |
| **Balance** | Workload distributed across team |
| **Notify** | Assignees receive notification |
| **My Procedures** | Each Auditor sees assigned list with assertion, risk, and due date |

**User sees:** Assignment board with assignee columns; unassigned procedures flagged.

### 45.5 Step 4 — Execute Procedures

| Perspective | Auditor |
|-------------|---------|
| **Action** | Open assigned procedure → create working paper from template |
| **Perform** | Execute test — inquiry, inspection, reperformance, sampling, etc. |
| **Evidence** | Attach and link evidence documents and data extracts |
| **Results** | Record results; document exceptions if identified |
| **AI** | AI Auditor may assist retrieval and draft narrative — Auditor reviews and accepts |
| **Follow-up** | Create follow-up actions for unexplained exceptions |
| **Submit** | Submit working paper for review when evidence complete |

**User sees:** Working paper editor with evidence panel, exception recorder, and procedure checklist.

### 45.6 Step 5 — Manager Review

| Perspective | Audit Senior; Audit Manager |
|-------------|----------------------------|
| **Senior** | First-level review — evidence linkage, conclusion support |
| **Comments** | Review notes attached — Auditor resolves |
| **Manager** | Second-level review — methodology, exception evaluation, program compliance |
| **Return** | Paper returned if insufficient — status returns to In progress |
| **Clear** | Manager clears review — advances to Partner queue if significant |

**User sees:** Review queue with severity indicators; comment threads on working papers.

### 45.7 Step 6 — Partner Review

| Perspective | Engagement Partner |
|-------------|-------------------|
| **Queue** | Significant risk procedures, material exceptions, firm-policy items |
| **Review** | Partner examines judgment areas and significant matters |
| **Sign-off** | Partner sign-off recorded for required procedures |
| **Escalation** | Unresolved significant matters flagged for finding evaluation |
| **Complete** | Procedure marked Complete after all required sign-offs |

**User sees:** Partner review queue with significant risk filter; sign-off confirmation per procedure.

### 45.8 Step 7 — Ready for Working Papers

| Milestone | Criteria |
|-----------|----------|
| **Program execution** | All required procedures Complete with sign-offs |
| **Exceptions** | Material exceptions documented and evaluated |
| **Review** | No blocking review notes on completed procedures |
| **Evidence** | Working papers linked to evidence per WP-02 |
| **High-risk coverage** | Significant risk procedures Partner-reviewed |
| **Next workflow** | Lead sheet generation and tie-out to trial balance (Workflow 16) |

| Perspective | Audit Manager |
|-------------|---------------|
| **Action** | Confirm substantially complete status on monitoring dashboard |
| **Lead sheets** | Initiate lead sheet generation from completed working papers |
| **Completion** | Fieldwork phase nearing transition to Review status |

**User sees:** Engagement dashboard milestone — **Ready for Working Papers** — procedure portfolio complete and cleared; lead sheet actions enabled.

*This milestone denotes **fieldwork documentation completeness** — distinct from Part 8 §40.7 fieldwork commencement gate (PRD9-01).*

### 45.9 Journey Diagram

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Audit Strategy  │───►│    Generate      │───►│     Assign       │
│    Approved      │    │  Audit Program   │    │   Procedures     │
└──────────────────┘    └──────────────────┘    └────────┬─────────┘
                                                         │
┌──────────────────┐    ┌──────────────────┐    ┌───────▼──────────┐
│     Ready for    │◄───│    Partner       │◄───│     Execute      │
│ Working Papers   │    │     Review       │    │   Procedures     │
└──────────────────┘    └────────┬─────────┘    └──────────────────┘
                                 │
                        ┌────────▼─────────┐
                        │     Manager      │
                        │      Review      │
                        └──────────────────┘
```

### 45.10 Journey Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **PEJ-AC-01** | Program refinable after strategy approval with validation |
| **PEJ-AC-02** | Full assign → execute → review journey completable |
| **PEJ-AC-03** | Auditor executes only assigned procedures |
| **PEJ-AC-04** | Multi-level review enforced before completion |
| **PEJ-AC-05** | Partner review queue surfaces significant procedures |
| **PEJ-AC-06** | Milestone displayed when all required procedures complete |
| **PEJ-AC-07** | Monitoring dashboard reflects journey progress throughout |

---

## PRD Review Notes — Part 9

Consistency review of MASTER_PRD Part 9 against PROJECT_BIBLE (Parts 1–15) and MASTER_PRD Parts 1–8. No previous sections modified.

### Constitutional Alignment

| Area | Status | Notes |
|------|--------|-------|
| Workflow 13 Audit Planning (program) | Aligned | Section 41 |
| Workflow 15 Working Paper Generation | Aligned | Sections 42, 43 |
| Workflow 18 Audit Review | Aligned | Sections 42.14, 43.8–43.9 |
| Part 15 §77.2 Risk-based auditing | Aligned | Risk-procedure linkage throughout |
| Part 15 §79 Evidence Philosophy | Aligned | Section 43 evidence gates |
| Part 15 §80 Documentation Standards | Aligned | Review levels, sign-offs |
| WP-01 through WP-05 | Aligned | Sections 42, 43 |
| AI-01 through AI-05 | Aligned | Section 43 execution boundaries |
| ENG-03 Planning gate | Aligned | Section 41 — execution requires approved program |

### MASTER_PRD Parts 1–8 Alignment

| Area | Status |
|------|--------|
| Section 39 Audit Strategy / program generation | Section 41 expands — not duplicated |
| Section 40 planning journey | Section 45 continues from Fieldwork status |
| Section 19 Engagement Dashboard | Section 44 monitoring feeds dashboard KPIs |
| Section 13 Team assignment | Section 42.12 procedure assignment |
| Section 38 Risk linkage | Sections 41, 42 maintain risk-procedure chain |
| PRD8-04 Working Paper Generation | Addressed — Sections 42, 43 |
| PRD8-05 Lead Sheet Generation | Deferred — Section 45.8 next workflow |

### Terminology Consistency

| Term | Status |
|------|--------|
| Audit program vs audit procedure | Distinct — program contains procedures |
| Procedure types (ISA 500, 520, 530) | Section 42 — ISA-aligned |
| Test of controls vs substantive | Section 42.4, 42.5 |
| Sign-off vs approval | Sign-off at review levels; program approval at planning |
| Working paper vs procedure | Procedure is plan unit; working paper is documentation artifact |
| Complete vs signed off | Complete after required sign-offs (WP-02) |

### Governance & Approval Chain

| Area | Status |
|------|--------|
| Program approval — Partner | Section 41.9 |
| Procedure review — Senior → Manager → Partner | Sections 42.14, 43.8–43.9 |
| Separation of preparer and reviewer | WP-01, APR-02 throughout |
| Planning dependency | Approved program required for execution |
| Versioning | Program and working papers versioned |

### Editorial Recommendations

| ID | Recommendation |
|----|----------------|
| **PRD9-01** | Milestone naming — Part 8 §40.7 (fieldwork commencement) vs Part 9 §45.8 (fieldwork documentation complete) both use "Ready for Working Papers"; recommend **Fieldwork Enabled** and **Procedures Complete — Ready for Lead Sheets** in future editorial pass |
| **PRD9-02** | Evidence Management module — dedicated PRD part for upload, indexing, chain of custody (Bible §79) |
| **PRD9-03** | Working Paper module as standalone specification — expand templates, cross-references, roll-forward |
| **PRD9-04** | Lead Sheet Generation (Workflow 16) — Part 10 |
| **PRD9-05** | Internal Control Evaluation — control linkage for test of controls procedures (PRD8-03) |
| **PRD9-06** | Findings and misstatement aggregation — link exceptions to evaluation module |
| **PRD9-07** | AI Audit Analysis (Workflow 17) — procedure-level AI integration specification |
| **PRD9-08** | Time recording integration — actual hours vs. program estimates (PRD8-07) |

### Review Conclusion

MASTER_PRD Part 9 is **consistent with PROJECT_BIBLE and Parts 1–8**. It specifies audit program management, procedure types, execution, monitoring, and fieldwork review as governed ISA-aligned workflows without contradicting planning gates, risk linkage, or approval philosophy. PRD9-01 through PRD9-08 guide subsequent PRD parts.

---

## Document Control — Part 9

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.9.0 | 2026-06-30 | Chief Product Officer | Part 9 — Audit Program & Procedure Execution complete; PRD Review Notes Part 9 included |

---

*End of Part 9.*

---

## Part 10 — Audit Evidence Management

### Table of Contents — Part 10

46. [Audit Evidence Management](#46-audit-evidence-management)
47. [Evidence Repository](#47-evidence-repository)
48. [Evidence Review & Sign-off](#48-evidence-review--sign-off)
49. [Evidence Monitoring](#49-evidence-monitoring)
50. [User Journey — Evidence to Working Paper Readiness](#50-user-journey--evidence-to-working-paper-readiness)

---

## 46. Audit Evidence Management

Audit Evidence Management governs **collection, indexing, linkage, quality assessment, and retention** of audit evidence — the factual foundation for every working paper conclusion and audit opinion.

*Constitutional basis: PROJECT_BIBLE Part 15 Section 79; Part 8 Evidence entity; Part 3 traceability chain; Business Rules AE-01 through AE-05, TRC-01 through TRC-05, WP-02.*

### 46.1 Purpose

Enable engagement teams to **obtain, preserve, link, and evaluate** sufficient appropriate audit evidence — with immutable originals, governed access, and bidirectional traceability from conclusions to source documents.

### 46.2 Business Goals

| Goal | Description |
|------|-------------|
| **Sufficiency discipline** | Conclusions supported by linked evidence (AE-01) |
| **Integrity preservation** | Original evidence immutable (AE-02) |
| **Confidentiality** | Engagement-scoped access (AE-03) |
| **Retention compliance** | Regulatory and firm retention policies enforced (AE-04) |
| **Source transparency** | Client-provided vs auditor-prepared distinguished (AE-05) |
| **Traceability** | Full chain from opinion to source document (TRC-01) |
| **Inspection readiness** | Evidence navigable for quality review and regulatory inspection |
| **AI readiness** | Evidence supports AI retrieval and citation — human validates conclusions |

### 46.3 Evidence Lifecycle

```
Collect → Upload → Index → Link → Review → Approve → Reference in Conclusion → Archive
              ↑         ↓
         Re-upload   Reject / Return
```

| Stage | Description |
|-------|-------------|
| **Collect** | Auditor obtains document, extract, confirmation, or observation record |
| **Upload** | Evidence ingested into engagement repository |
| **Index** | Metadata applied — category, origin, period, tags |
| **Link** | Evidence linked to working paper, procedure, assertion, account |
| **Review** | Reviewer evaluates relevance, reliability, completeness |
| **Approve** | Evidence accepted for conclusion support |
| **Reference** | Cited in working paper conclusion |
| **Archive** | Retained per policy at engagement closure |

### 46.4 Evidence Collection

| Collection Method | Product Support |
|-------------------|-----------------|
| **Client portal upload** | Client User submits documents to engagement |
| **Auditor upload** | Engagement team uploads directly |
| **ERP / system extract** | Financial data import as structured evidence |
| **Confirmation response** | External confirmation recorded and attached |
| **Observation record** | Auditor documents observation with timestamp |
| **Third-party document** | External source identified and preserved |
| **AI retrieval** | AI surfaces documents — human selects and links |

Collection records **who obtained, when, and from whom** — chain of custody initiated at collection.

### 46.5 Evidence Upload

| Aspect | Product Behavior |
|--------|------------------|
| **Formats** | PDF, images, spreadsheets, structured data extracts, email archives per firm policy |
| **Immutability** | Original file preserved without modification (AE-02) |
| **Metadata capture** | Filename, upload date, uploader, file size, hash for integrity |
| **Engagement scope** | Evidence uploaded within engagement boundary only |
| **Period linkage** | Evidence associated with reporting period where applicable |
| **Bulk upload** | Multiple files with batch metadata |
| **Client-provided flag** | Marked at upload when source is client (AE-05) |
| **Virus / integrity** | Upload validation per security policy — outcome logged |

### 46.6 Evidence Linking

| Linkage Type | Purpose |
|--------------|---------|
| **Evidence → working paper** | Conclusion supported by specific evidence (AE-01) |
| **Evidence → procedure** | Evidence obtained for audit program procedure |
| **Evidence → assertion** | Evidence maps to assertion tested |
| **Evidence → account** | Evidence relates to trial balance account |
| **Evidence → transaction** | Evidence links to GL transaction or source entry |
| **Evidence → lead sheet** | Summary schedule references detailed evidence (future part) |
| **Bidirectional** | Navigate from conclusion to evidence and evidence to all usages |

Unlinked evidence may exist in repository — but **procedure submission blocked** without required linkage (Section 43, EXE-AC-02).

### 46.7 Evidence Categories

| Category | Description | Reliability Context |
|----------|-------------|-------------------|
| **External confirmation** | Third-party direct response | High reliability |
| **External documentary** | Invoices, contracts from external parties | High |
| **Internal documentary** | Client-prepared records | Moderate — control environment relevant |
| **System-generated extract** | ERP, bank feed, GL export | Moderate to high — extraction metadata preserved |
| **Auditor-prepared** | Schedules, recalculations by audit team | Moderate |
| **Client representation** | Written representation from management | Lower alone — corroboration required |
| **Observation / inquiry record** | Documented inquiry or observation | Lower alone — corroboration noted |
| **Analytical output** | Analytical procedure results | Moderate — expectation documented |
| **AI-extracted data** | Data extracted by AI from source | Requires human validation |

### 46.8 Evidence Ownership

| Role | Responsibility |
|------|----------------|
| **Collector (Auditor)** | Obtains and uploads evidence; initial metadata |
| **Custodian (Engagement team)** | Engagement-scoped custody during fieldwork |
| **Reviewer (Senior / Manager)** | Evaluates evidence quality and linkage |
| **Engagement Partner** | Accountable for engagement file evidence completeness |
| **Client User** | Provides client-origin evidence via governed channel |

Ownership does not transfer evidence outside engagement permissions (AE-03).

### 46.9 Evidence Status

| Status | Meaning |
|--------|---------|
| **Draft** | Upload initiated — metadata incomplete |
| **Uploaded** | In repository — not yet indexed or linked |
| **Indexed** | Metadata complete — searchable |
| **Pending review** | Submitted for evidence quality review |
| **Approved** | Reviewer accepted for conclusion support |
| **Rejected** | Reviewer rejected — requires re-upload or replacement |
| **Superseded** | Replaced by newer version — prior retained |
| **Archived** | Engagement closed — read-only retention |

### 46.10 Evidence Quality Assessment

| Quality Factor | Assessment |
|----------------|------------|
| **Relevance** | Evidence relates to assertion and procedure objective |
| **Reliability** | Source credibility evaluated per ISA 500 hierarchy |
| **Completeness** | Evidence set addresses population or sample as designed |
| **Authenticity** | Genuine and unaltered — integrity hash verified |
| **Timeliness** | Pertains to period under audit |
| **Reviewer judgment** | Quality assessed by engagement team — not automated score alone |

### 46.11 Evidence Sufficiency

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Quantity of evidence adequate for conclusion (ISA 500) |
| **Assessment** | Professional judgment by reviewer — not system-imposed threshold |
| **Indicators** | Platform shows required vs. linked evidence per procedure template |
| **Risk-responsive** | Higher-risk procedures flag sufficiency expectations |
| **Cumulative** | Multiple evidence items may combine to support conclusion |
| **Gap flagging** | Missing required evidence types flagged — blocks submission |
| **Documentation** | Sufficiency conclusion recorded in working paper or evidence review |

### 46.12 Evidence Appropriateness

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Quality and relevance of evidence for assertion tested |
| **Assertion-specific** | Different assertions require different evidence types — guided by methodology |
| **Source hierarchy** | External evidence distinguished from internal in UI |
| **Corroboration** | Inquiry and representation evidence flagged for corroboration need |
| **AI-extracted** | Appropriateness confirmed only after human validation |
| **Rejection** | Inappropriate evidence rejected with documented rationale |

### 46.13 Evidence Retention

| Principle | Application |
|-----------|-------------|
| **Immutability** | Approved evidence originals never modified (AE-02) |
| **Engagement file** | All linked evidence included in engagement file at closure |
| **Retention period** | Per organization and firm policy — configurable |
| **Legal hold** | Retention suspended when legal hold active |
| **Archive** | Post-closure read-only; export for inspection |
| **Deletion** | No hard delete of evidence with linkage history — archive only |
| **Export integrity** | Exported packages include provenance metadata |

### 46.14 Permissions

| Capability | Engagement Partner | Audit Manager | Audit Senior | Auditor | Client User |
|------------|-------------------|---------------|--------------|---------|-------------|
| Upload evidence | Yes | Yes | Yes | Yes | Client-provided only |
| Link evidence | Yes | Yes | Yes | Yes (own papers) | No |
| Review evidence | Yes | Yes | Yes | No | No |
| Approve evidence | Yes | Yes | Yes | No | No |
| Reject evidence | Yes | Yes | Yes | No | No |
| View evidence | Assigned team | Assigned team | Assigned team | Assigned | Own uploads |
| Archive / restore | Yes | Propose | No | No | No |
| Export evidence | Yes | Yes | No | No | No |

### 46.15 Business Validations

| Validation | Rule |
|------------|------|
| **EVD-V01** | Working paper conclusion requires linked evidence (AE-01) |
| **EVD-V02** | Original upload preserved immutably (AE-02) |
| **EVD-V03** | Evidence access limited to engagement team (AE-03) |
| **EVD-V04** | Client-provided evidence flagged at upload (AE-05) |
| **EVD-V05** | Procedure submission blocked without required evidence linkage |
| **EVD-V06** | Rejected evidence cannot support conclusion until replaced |
| **EVD-V07** | Evidence version supersedes prior — both retained (VER-02) |
| **EVD-V08** | AI-extracted evidence requires human validation before approval |
| **EVD-V09** | Archived evidence read-only |
| **EVD-V10** | Evidence hash verified on access for integrity check |

### 46.16 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **EVD-AC-01** | Auditor can upload evidence to engagement repository |
| **EVD-AC-02** | Original file preserved without modification |
| **EVD-AC-03** | Evidence linkable to working paper, procedure, and assertion |
| **EVD-AC-04** | Client-provided evidence visually distinguished |
| **EVD-AC-05** | Bidirectional navigation between evidence and working paper |
| **EVD-AC-06** | Procedure submission blocked without required evidence |
| **EVD-AC-07** | Evidence categories assignable at upload |
| **EVD-AC-08** | Sufficiency gap indicators visible per procedure |
| **EVD-AC-09** | Retention policy applied at engagement archive |
| **EVD-AC-10** | Full evidence audit trail exportable |

---

## 47. Evidence Repository

The Evidence Repository is the **governed engagement-scoped store** for all audit evidence — organized, searchable, and cross-referenced across the engagement file.

*Constitutional basis: PROJECT_BIBLE Part 8 Evidence entity; Part 15 Section 79.3; Business Rules AE-02, AE-03, VER-01.*

### 47.1 Purpose

Provide a **single authoritative evidence index** per engagement — enabling discovery, organization, version control, and cross-referencing of all documents supporting the audit file.

### 47.2 Business Goals

| Goal | Description |
|------|-------------|
| **Centralized custody** | All engagement evidence in one governed repository |
| **Discoverability** | Search and filter across entire evidence portfolio |
| **Organization** | Structured folders and tags reflecting audit areas |
| **Integrity** | Duplicate detection and version control |
| **Cross-reference** | Evidence network navigable across modules |
| **Retention** | Archive and restore per policy |

### 47.3 Folder Structure

| Folder Level | Organization |
|------------|--------------|
| **Engagement root** | Top-level repository per engagement |
| **Audit area** | Cash, receivables, revenue, inventory, payables, equity, etc. |
| **Procedure** | Sub-folder per audit program procedure optional |
| **Client-provided** | Segregated area for client-origin documents |
| **Auditor-prepared** | Team-created schedules and work products |
| **Permanent file** | Entity-level documents carried across periods |
| **Custom** | Manager-created folders with audit trail |

Folder structure **suggested from audit program** — customizable by Audit Manager.

### 47.4 Evidence Organization

| Organization Method | Description |
|---------------------|-------------|
| **By audit area** | Primary grouping aligned to lead sheet structure |
| **By procedure** | Evidence grouped under linked procedure |
| **By account** | Evidence mapped to trial balance accounts |
| **By upload date** | Chronological view for activity tracking |
| **By status** | Pending, approved, rejected views |
| **By collector** | Evidence attributed to team member |

Multiple organization views — same underlying evidence index.

### 47.5 Evidence Tagging

| Tag Type | Examples |
|----------|----------|
| **Category** | External confirmation, invoice, contract, bank statement |
| **Assertion** | Existence, completeness, valuation |
| **Account** | Account code and name |
| **Period** | Transaction date or period covered |
| **Source** | Client-provided, auditor-prepared, third-party |
| **Risk** | Linked significant risk reference |
| **Custom** | User-defined tags per engagement |

Tags support search and filtering; applied at upload or indexing.

### 47.6 Cross References

| Reference | Navigation |
|-----------|------------|
| **Evidence ↔ working paper** | Bidirectional |
| **Evidence ↔ procedure** | Procedure evidence index |
| **Evidence ↔ account** | Account evidence summary |
| **Evidence ↔ financial data** | Link to TB line or GL transaction |
| **Evidence ↔ other evidence** | Related document sets (e.g., invoice + payment) |
| **Usage map** | Show all working papers citing evidence item |

### 47.7 Search

| Search Capability | Description |
|-------------------|-------------|
| **Full-text** | Content search within indexed documents |
| **Metadata** | Filename, tag, category, uploader, date |
| **Semantic** | AI-assisted relevance search with citations (evidence-first) |
| **Scope** | Engagement-bound; permission-filtered |
| **Results** | Preview, metadata, linkage count, status |
| **AI boundary** | Search results cite source — not unsupported summaries |

### 47.8 Filtering

| Filter Dimension | Options |
|------------------|---------|
| **Status** | Uploaded, pending, approved, rejected |
| **Category** | Evidence category taxonomy |
| **Audit area** | Financial statement area |
| **Source** | Client, auditor, external |
| **Assignee / collector** | Team member |
| **Date range** | Upload or document date |
| **Linkage** | Linked, unlinked, required-but-missing |
| **Risk** | Significant risk linked evidence |

### 47.9 Version History

| Aspect | Product Behavior |
|--------|------------------|
| **Re-upload** | New version when client provides updated document |
| **Preservation** | All versions retained (VER-01, VER-02) |
| **Supersession** | Latest version default; prior versions accessible |
| **Linkage** | Working papers reference specific evidence version |
| **Comparison** | Version metadata comparable — original files preserved |
| **Rationale** | Re-upload reason documented |

### 47.10 Duplicate Detection

| Aspect | Product Behavior |
|--------|------------------|
| **Detection** | Hash match and filename similarity on upload |
| **Alert** | Uploader warned of potential duplicate |
| **Resolution** | User confirms duplicate link or proceeds as new |
| **Effect** | Duplicates cross-referenced — not silently merged |
| **Audit** | Duplicate resolution decision logged |

### 47.11 Archive

| Aspect | Product Behavior |
|--------|------------------|
| **Trigger** | Engagement closure or manual archive per policy |
| **Effect** | Repository read-only; all evidence preserved |
| **Retention** | Per organization retention configuration (AE-04) |
| **Access** | Engagement team read per retention rules |
| **Export** | Full evidence package exportable for inspection |
| **Legal hold** | Archive suspended when hold active |

### 47.12 Restore

| Aspect | Product Behavior |
|--------|------------------|
| **From archive** | Engagement Partner requests with Organization Owner approval |
| **Use case** | Inspection, litigation, correction |
| **Effect** | Read-only or limited edit per restore policy |
| **Audit** | Restore logged with reason and authorizer |

### 47.13 Permissions

| Capability | Engagement Partner | Audit Manager | Audit Senior | Auditor | Client User |
|------------|-------------------|---------------|--------------|---------|-------------|
| Create folders | Yes | Yes | No | No | No |
| Upload to repository | Yes | Yes | Yes | Yes | Client area only |
| Tag / index evidence | Yes | Yes | Yes | Yes | No |
| Search repository | Assigned team | Assigned team | Assigned team | Assigned team | Own uploads |
| Manage versions | Yes | Yes | Yes | Own uploads | No |
| Archive repository | Yes | Propose | No | No | No |
| Restore from archive | Yes | No | No | No | No |

### 47.14 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **REP-AC-01** | Engagement-scoped evidence repository creatable |
| **REP-AC-02** | Folder structure by audit area supported |
| **REP-AC-03** | Tags and categories applied to evidence |
| **REP-AC-04** | Full-text and metadata search functional |
| **REP-AC-05** | Filters by status, source, and linkage work |
| **REP-AC-06** | Evidence versions preserved on re-upload |
| **REP-AC-07** | Duplicate detection alerts on upload |
| **REP-AC-08** | Cross-reference navigation bidirectional |
| **REP-AC-09** | Archive makes repository read-only |
| **REP-AC-10** | Semantic search returns cited results |

---

## 48. Evidence Review & Sign-off

Evidence Review & Sign-off governs **professional evaluation of evidence quality, completeness, and suitability** before evidence supports working paper conclusions.

*Constitutional basis: PROJECT_BIBLE Part 15 Sections 79.2, 80; Business Rules WP-01, WP-02, APR-02, APR-05.*

### 48.1 Reviewer Workflow

```
Upload → Index → Submit for Review → Senior Review → Manager Review
    → Approve OR Reject → Link to Working Paper
              ↑
    Re-upload ←── Rejected
```

| Step | Actor | Action |
|------|-------|--------|
| **Submit** | Auditor | Submits evidence with linkage context for review |
| **First review** | Audit Senior | Relevance, reliability, completeness |
| **Second review** | Audit Manager | Sufficiency for procedure; significant matters |
| **Partner review** | Engagement Partner | Significant risk evidence per firm policy |
| **Outcome** | Reviewer | Approve, reject, or return with comments |

### 48.2 Review Notes

| Aspect | Product Behavior |
|--------|------------------|
| **Attachment** | Notes attach to evidence item or evidence set |
| **Severity** | Informational, required action, blocking |
| **Thread** | Collector responds; iterative resolution |
| **Clearance** | Reviewer clears notes on approval |
| **History** | Full thread preserved — not deleted on clearance |
| **Linkage** | Notes visible from linked working paper |

### 48.3 Approval Workflow

| Requirement | Description |
|-------------|-------------|
| **Approval** | Reviewer approves evidence for conclusion support |
| **Attribution** | Approver, timestamp, evidence version (APR-05) |
| **Effect** | Approved evidence available for working paper citation |
| **Significant evidence** | Partner approval for high-risk area evidence per policy |
| **Non-bypassable** | Required review levels cannot be skipped (APR-01) |

### 48.4 Rejected Evidence

| Aspect | Product Behavior |
|--------|------------------|
| **Trigger** | Reviewer rejects — inadequate, irrelevant, incomplete, unreliable |
| **Rationale** | Rejection reason mandatory (APR-04) |
| **Effect** | Rejected evidence cannot support conclusion |
| **Status** | Evidence status → Rejected |
| **Notification** | Collector notified with rejection comments |
| **Working paper** | Linked working paper flagged — submission blocked if required evidence rejected |

### 48.5 Re-upload

| Aspect | Product Behavior |
|--------|------------------|
| **Trigger** | Rejection or client provides updated document |
| **Process** | New version uploaded; prior version retained |
| **Linkage** | Working paper updated to reference new version |
| **Re-review** | New version submitted through review workflow |
| **Audit** | Re-upload reason and rejection history preserved |

### 48.6 Evidence Completeness

| Check | Product Behavior |
|-------|------------------|
| **Procedure requirements** | Template defines required evidence types per procedure |
| **Completeness indicator** | Required vs. linked vs. approved evidence counts |
| **Gap alert** | Missing required evidence flagged on working paper |
| **Blocking** | Submission blocked until completeness satisfied or documented exception |
| **Manager override** | Documented scope limitation — Partner visibility for significant |

### 48.7 Evidence Quality Review

| Review Dimension | Reviewer Assessment |
|----------------|---------------------|
| **Relevance** | Addresses assertion and procedure |
| **Reliability** | Source credibility per hierarchy |
| **Completeness** | Covers population or sample scope |
| **Authenticity** | No indication of alteration |
| **Timeliness** | Correct period |
| **AI validation** | AI-extracted data confirmed against source |

Quality review is **professional judgment** — platform structures documentation.

### 48.8 Manager Sign-off

| Aspect | Product Behavior |
|--------|------------------|
| **Scope** | Evidence sufficiency for procedure; exception evaluation |
| **Sign-off** | Manager sign-off on evidence set supporting working paper |
| **Escalation** | Significant matters to Partner |
| **Separation** | Collector cannot be sole manager sign-off on own evidence (WP-01) |

### 48.9 Partner Sign-off

| Aspect | Product Behavior |
|--------|------------------|
| **Trigger** | Significant risk procedures; material evidence matters; firm policy |
| **Scope** | Professional judgment on evidence supporting significant conclusions |
| **Queue** | Partner evidence review queue |
| **Sign-off** | Recorded with attribution |
| **Selective** | Not all evidence requires Partner sign-off — configurable |

### 48.10 Audit Trail

| Event | Recorded |
|-------|----------|
| Upload / re-upload | User, file hash, timestamp |
| Index / tag changes | User, metadata, timestamp |
| Link / unlink | Evidence, target artifact, user |
| Submit / approve / reject | Reviewer, comments, version |
| Sign-off at each level | Reviewer, level, timestamp |
| AI validation | Validator, source comparison, timestamp |
| Archive / restore | Authorizer, reason, timestamp |

### 48.11 Permissions

| Capability | Engagement Partner | Audit Manager | Audit Senior | Auditor |
|------------|-------------------|---------------|--------------|---------|
| Submit for evidence review | Yes | Yes | Yes | Yes |
| Review evidence | Yes | Yes | Yes | No |
| Approve evidence | Yes | Yes | Yes | No |
| Reject evidence | Yes | Yes | Yes | No |
| Manager sign-off | Yes | Yes | No | No |
| Partner sign-off | Yes | No | No | No |
| Override completeness block | Yes | Documented | No | No |

### 48.12 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **EVR-AC-01** | Evidence submittable for review with linkage context |
| **EVR-AC-02** | Reviewer can approve or reject with mandatory rejection rationale |
| **EVR-AC-03** | Rejected evidence blocked from conclusion support |
| **EVR-AC-04** | Re-upload creates versioned replacement |
| **EVR-AC-05** | Completeness indicator shows required vs. approved evidence |
| **EVR-AC-06** | Manager sign-off recorded on evidence set |
| **EVR-AC-07** | Partner queue shows significant evidence items |
| **EVR-AC-08** | Preparer cannot sole manager sign-off own evidence |
| **EVR-AC-09** | Review note thread preserved |
| **EVR-AC-10** | Full evidence review audit trail exportable |

---

## 49. Evidence Monitoring

Evidence Monitoring provides **engagement-wide visibility** into evidence collection, review status, and quality — enabling managers to enforce sufficiency discipline before working papers complete.

*Constitutional basis: MASTER_PRD Section 19 Engagement Dashboard; Part 15 Section 79.*

### 49.1 Missing Evidence

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Required evidence types not yet uploaded or linked per procedure |
| **Source** | Procedure template requirements vs. actual linkage |
| **Alert** | Manager and assignee notified |
| **Dashboard** | Missing evidence count on engagement dashboard |
| **Drill-down** | List by procedure, audit area, assignee |
| **Blocking** | Contributes to procedure submission block |

### 49.2 Pending Evidence

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Evidence uploaded but not yet approved — in review workflow |
| **View** | Queue by reviewer and age |
| **Alert** | Reviewer notified of pending items |
| **Aging** | Days pending visible for backlog management |

### 49.3 Approved Evidence

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Evidence with approved status — cleared for conclusion support |
| **Metrics** | Count and percentage of required evidence approved |
| **By area** | Approval rate by audit area |
| **Coverage** | Procedures with full evidence approval vs. partial |

### 49.4 Rejected Evidence

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Evidence rejected in review — awaiting re-upload |
| **Alert** | Collector notified; manager visibility |
| **Tracking** | Rejection reason and age tracked |
| **Resolution** | Cleared when re-upload approved or alternative linked |

### 49.5 Overdue Evidence

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Required evidence not obtained by target date |
| **Source** | Procedure due date vs. evidence status |
| **Alert** | Assignee and manager notified |
| **Escalation** | Overdue significant-risk evidence escalates to Partner |
| **Client dependency** | Client-provided evidence overdue flagged separately |

### 49.6 Evidence KPIs

| KPI | Audience | Purpose |
|-----|----------|---------|
| **Evidence completeness %** | Audit Manager | Required evidence obtained |
| **Evidence approval rate** | Audit Manager | Review throughput |
| **Missing evidence count** | Audit Manager | Gap identification |
| **Rejected evidence count** | Audit Manager | Quality indicator |
| **Overdue evidence count** | Audit Manager | Client and team dependency |
| **Pending review age** | Audit Manager | Review backlog |
| **Unlinked upload count** | Audit Manager | Indexing discipline |
| **Client-provided turnaround** | Audit Manager | Client coordination |

### 49.7 Quality KPIs

| KPI | Description |
|-----|-------------|
| **Rejection rate** | Rejected / submitted evidence ratio |
| **Re-upload rate** | Evidence requiring replacement |
| **AI validation rate** | AI-extracted evidence human-validated |
| **External evidence ratio** | External vs internal evidence mix |
| **Significant area coverage** | High-risk areas with approved evidence |
| **First-pass approval rate** | Evidence approved without rejection |

### 49.8 Business Rules

| Rule | Description |
|------|-------------|
| **EVM-R01** | Missing required evidence flagged in real time |
| **EVM-R02** | Rejected evidence cannot count toward completeness |
| **EVM-R03** | Overdue client evidence escalates after configurable threshold |
| **EVM-R04** | Unlinked uploads flagged after configurable period |
| **EVM-R05** | KPIs scoped to current approved program version |
| **EVM-R06** | Partner dashboard shows significant-risk evidence gaps |
| **EVM-R07** | Evidence monitoring feeds engagement closure readiness (OPN-02) |
| **EVM-R08** | Monitoring data exportable for team meetings |

### 49.9 Permissions

| Capability | Engagement Partner | Audit Manager | Audit Senior | Auditor |
|------------|-------------------|---------------|--------------|---------|
| View engagement evidence KPIs | Yes | Yes | Yes | Own assignments |
| View missing evidence report | Yes | Yes | Yes | Own procedures |
| View rejected / overdue | Yes | Yes | Yes | Own items |
| Configure evidence alerts | Yes | Yes | No | No |
| Export monitoring report | Yes | Yes | No | No |

### 49.10 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **EVM-AC-01** | Dashboard shows evidence completeness percentage |
| **EVM-AC-02** | Missing evidence list drillable by procedure |
| **EVM-AC-03** | Pending and rejected evidence queues visible |
| **EVM-AC-04** | Overdue evidence identified with alerts |
| **EVM-AC-05** | Quality KPIs calculated and displayed |
| **EVM-AC-06** | Partner view shows significant-risk evidence gaps |
| **EVM-AC-07** | Client-provided overdue evidence separately tracked |
| **EVM-AC-08** | Unlinked upload alert functional |
| **EVM-AC-09** | Monitoring export supported |
| **EVM-AC-10** | KPIs update on evidence status change |

---

## 50. User Journey — Evidence to Working Paper Readiness

End-to-end experience from **procedure execution** through **governed evidence collection, review, and repository indexing** — supporting working paper conclusions and fieldwork documentation completeness.

*Continues MASTER_PRD Part 9 Section 45 — procedure execution with evidence linkage requirements.*

### 50.1 Journey Overview

```
Audit Procedure Executed → Evidence Uploaded → Evidence Reviewed
    → Evidence Approved → Evidence Repository Updated → Ready for Working Papers
```

**Primary actors:** Auditor (collect and upload), Audit Senior (first review), Audit Manager (sufficiency sign-off), Engagement Partner (significant evidence). **Prerequisite:** Assigned procedure in execution; engagement in Fieldwork status.

### 50.2 Step 1 — Audit Procedure Executed

| Perspective | Auditor |
|-------------|---------|
| **State** | Assigned procedure In progress; working paper open |
| **Action** | Perform audit procedure — inspection, confirmation, sampling, etc. |
| **Requirement** | Procedure template shows required evidence types |
| **Gap** | Dashboard shows missing evidence indicators |
| **AI** | AI Auditor retrieves relevant documents — Auditor selects for upload |

**User sees:** Working paper with evidence requirements checklist — items marked missing or pending.

### 50.3 Step 2 — Evidence Uploaded

| Perspective | Auditor |
|-------------|---------|
| **Action** | Upload bank statement, invoice, confirmation, or extract |
| **Metadata** | Select category, audit area, assertion; flag client-provided |
| **Link** | Link evidence to working paper and procedure |
| **Duplicate** | System alerts if potential duplicate — user resolves |
| **Index** | Evidence indexed in repository under audit area folder |
| **Client** | Client User may upload via portal — Auditor notified |

**User sees:** Upload confirmation with linkage summary; evidence appears in repository and working paper evidence panel.

### 50.4 Step 3 — Evidence Reviewed

| Perspective | Audit Senior |
|-------------|--------------|
| **Queue** | Pending evidence review queue |
| **Review** | Senior examines relevance, reliability, completeness, authenticity |
| **AI-extracted** | Validates AI-extracted values against source document |
| **Comments** | Review notes attached — Auditor addresses |
| **Return** | Insufficient evidence returned with required actions |
| **Advance** | Cleared evidence advances to Manager review |

**User sees:** Evidence review screen with document preview, metadata, linkage map, and quality checklist.

### 50.5 Step 4 — Evidence Approved

| Perspective | Audit Manager; Engagement Partner |
|-------------|----------------------------------|
| **Manager** | Evaluates sufficiency for procedure; manager sign-off on evidence set |
| **Partner** | Reviews significant-risk evidence per firm policy |
| **Reject** | Inadequate evidence rejected with rationale — Auditor re-uploads |
| **Approve** | Evidence status → Approved — cleared for conclusion citation |
| **Completeness** | Procedure evidence completeness indicator turns green |

**User sees:** Approval confirmation; rejected items show rejection reason and re-upload action.

### 50.6 Step 5 — Evidence Repository Updated

| Perspective | Audit Manager |
|-------------|---------------|
| **Index** | Approved evidence fully indexed with tags and cross-references |
| **Organization** | Repository reflects audit area structure |
| **Cross-ref** | Evidence linked to accounts, transactions where applicable |
| **Usage** | Usage map shows all working papers citing evidence |
| **Monitoring** | Dashboard KPIs update — completeness % increases |
| **Search** | Evidence discoverable by team via search and filters |

**User sees:** Repository view with approved evidence count; cross-reference network navigable.

### 50.7 Step 6 — Ready for Working Papers

| Milestone | Criteria |
|-----------|----------|
| **Required evidence** | All required evidence types approved for procedure |
| **Linkage** | Evidence linked to working paper and assertion (AE-01) |
| **Review** | Evidence review and sign-off complete |
| **Repository** | Evidence indexed in engagement repository |
| **Working paper** | Auditor cites approved evidence in conclusion |
| **Procedure** | Working paper submittable for procedure review (Section 43) |
| **Next workflow** | Working paper review cycle; lead sheet tie-out (Workflow 16) |

| Perspective | Auditor |
|-------------|---------|
| **Action** | Complete working paper conclusion citing approved evidence |
| **Submit** | Submit working paper for Senior review |
| **Confidence** | Evidence sufficiency indicator green |

**User sees:** Engagement milestone — **Ready for Working Papers** — evidence portfolio complete for procedure; working paper submission enabled.

*This milestone denotes **evidence sufficiency for working paper support** — complementary to Part 9 §45.8 procedure completion milestone (PRD10-01).*

### 50.8 Journey Diagram

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ Audit Procedure  │───►│    Evidence      │───►│    Evidence      │
│    Executed      │    │    Uploaded      │    │    Reviewed      │
└──────────────────┘    └──────────────────┘    └────────┬─────────┘
                                                         │
┌──────────────────┐    ┌──────────────────┐    ┌─────────▼────────┐
│     Ready for    │◄───│    Evidence      │◄───│    Evidence      │
│ Working Papers   │    │   Repository     │    │    Approved      │
│                  │    │    Updated       │    │                  │
└──────────────────┘    └──────────────────┘    └──────────────────┘
```

### 50.9 Journey Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **EVJ-AC-01** | Procedure shows required evidence checklist during execution |
| **EVJ-AC-02** | Upload and link journey completable in single flow |
| **EVJ-AC-03** | Review reject → re-upload → approve cycle functional |
| **EVJ-AC-04** | Approved evidence citable in working paper conclusion |
| **EVJ-AC-05** | Repository reflects approved evidence with cross-references |
| **EVJ-AC-06** | Milestone displayed when evidence completeness satisfied |
| **EVJ-AC-07** | Client portal upload integrates into same review workflow |

---

## PRD Review Notes — Part 10

Consistency review of MASTER_PRD Part 10 against PROJECT_BIBLE (Parts 1–15) and MASTER_PRD Parts 1–9. No previous sections modified.

### Constitutional Alignment

| Area | Status | Notes |
|------|--------|-------|
| Part 15 §79 Evidence Philosophy | Aligned | Sections 46–48 |
| Part 15 §79.3 Evidence Management | Aligned | Sections 46, 47 |
| Part 15 §79.4 Traceability Chain | Aligned | Section 46.6 |
| Part 8 Evidence entity | Aligned | Lifecycle throughout |
| AE-01 through AE-05 | Aligned | Sections 46, 47 |
| TRC-01 through TRC-05 | Aligned | Linkage and audit trail |
| WP-02 Evidence gate | Aligned | Sections 46, 48, 50 |
| OPN-02 File completeness | Aligned | Section 49 monitoring |

### MASTER_PRD Parts 1–9 Alignment

| Area | Status |
|------|--------|
| PRD9-02 Evidence Management module | Addressed — Part 10 |
| Section 43 Procedure Execution | Section 50 continues evidence flow |
| Section 42 Pending evidence status | Sections 46, 49 |
| EXE-AC-02 Evidence linkage gate | Sections 46, 48 |
| Section 19 Dashboard | Section 49 KPIs feed dashboard |
| AI-01, AI-02 AI evidence boundaries | Sections 46, 48 |
| Financial data import as evidence | Section 46.4 — cross-reference Part 5 |

### Terminology Consistency

| Term | Status |
|------|--------|
| Sufficient appropriate evidence | ISA 500 — Sections 46.11, 46.12 |
| Client-provided vs auditor-prepared | AE-05 throughout |
| Evidence vs working paper | Evidence supports; working paper documents procedure |
| Approval vs sign-off | Evidence approved; working paper signed off |
| Immutable originals | AE-02 — Section 46.5 |
| AI-extracted evidence | Human validation required — Section 48.7 |

### Governance & Review Chain

| Area | Status |
|------|--------|
| Senior → Manager → Partner evidence review | Section 48 |
| Separation of preparer and reviewer | WP-01, APR-02 |
| Rejection with rationale | APR-04 — Section 48.4 |
| Non-bypassable review | APR-01 |
| Retention and archive | AE-04 — Sections 46.13, 47.11 |

### AI Readiness

| Area | Status |
|------|--------|
| Evidence-first retrieval | Section 47.7 semantic search with citations |
| AI extraction validation | Sections 46, 48 |
| AI cannot approve evidence | Human approval required |
| Citation on AI search results | AI-02 aligned |

### Editorial Recommendations

| ID | Recommendation |
|----|----------------|
| **PRD10-01** | Milestone taxonomy — Part 8 (fieldwork commencement), Part 9 (procedure completion), Part 10 (evidence sufficiency) all reference "Ready for Working Papers"; recommend unified milestone glossary in future editorial pass |
| **PRD10-02** | Working Paper module standalone specification — expand beyond evidence linkage (PRD9-03) |
| **PRD10-03** | Lead Sheet Generation (Workflow 16) — Part 11 |
| **PRD10-04** | External confirmation workflow — dedicated specification for confirmation send/receive |
| **PRD10-05** | Client portal evidence request list — structured PBC (provided by client) management |
| **PRD10-06** | Legal hold on evidence — cross-reference governance PRD part |
| **PRD10-07** | Evidence export package for inspection — Part 10 §51 export strategy linkage |
| **PRD10-08** | Integration with DMS/ERP evidence ingestion — Part 11 integration PRD |

### Review Conclusion

MASTER_PRD Part 10 is **consistent with PROJECT_BIBLE and Parts 1–9**. It specifies audit evidence management, repository, review, and monitoring as governed ISA-aligned workflows without contradicting traceability, sufficiency discipline, or approval philosophy. PRD10-01 through PRD10-08 guide subsequent PRD parts.

---

## Document Control — Part 10

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.10.0 | 2026-06-30 | Chief Product Officer | Part 10 — Audit Evidence Management complete; PRD Review Notes Part 10 included |

---

*End of Part 10.*

---

## Part 11 — Working Papers, Lead Sheets & Documentation

### Table of Contents — Part 11

51. [Working Papers Module](#51-working-papers-module)
52. [Lead Sheets Module](#52-lead-sheets-module)
53. [Cross-Referencing Engine](#53-cross-referencing-engine)
54. [Documentation Monitoring](#54-documentation-monitoring)
55. [User Journey — Documentation to Findings Readiness](#55-user-journey--documentation-to-findings-readiness)

### Dependencies

This part depends on modules specified in MASTER_PRD Parts 4–10:

| Upstream Module | PRD Reference |
|-----------------|---------------|
| Engagement Management | Part 4 — Sections 16–19 |
| Financial Statements | Part 7 — Sections 31–32 |
| IFRS Notes | Part 7 — Section 33 |
| Audit Planning | Part 8 — Section 36 |
| Materiality Management | Part 8 — Section 37 |
| Risk Assessment | Part 8 — Section 38 |
| Audit Program Management | Part 9 — Section 41 |
| Audit Procedures & Execution | Part 9 — Sections 42–43 |
| Evidence Repository | Part 10 — Sections 46–47 |

Future PRD parts depending on this document:

| Downstream Module | Relationship |
|-------------------|--------------|
| Findings | Working paper conclusions feed misstatement and deficiency evaluation |
| Control Deficiencies | Control test working papers link to deficiency register |
| AI Auditor | AI drafts attach to working papers — human approval required |
| Governance | Documentation completeness gates opinion issuance |
| Audit Opinion | Opinion supported by signed-off engagement file |
| Management Letter | Findings cross-reference working papers |
| Final Reporting | Export packages include documentation index |

---

## 51. Working Papers Module

The Working Papers Module governs **structured documentation of audit procedures, evidence, results, and conclusions** — the evidentiary core of the engagement file.

*Constitutional basis: PROJECT_BIBLE Part 3 Workflow 15; Part 8 Working Paper entity; Part 15 Sections 79–80; Business Rules WP-01 through WP-05, AE-01, VER-01 through VER-03.*

### 51.1 Purpose

Enable engagement teams to **create, link, review, and sign off** defensible working papers that document sufficient appropriate audit evidence for each assigned procedure — with full traceability to risks, assertions, evidence, and financial reporting outputs.

### 51.2 Business Goals

| Goal | Description |
|------|-------------|
| **ISA 230 compliance** | Documentation meets audit documentation standards |
| **Evidence discipline** | Conclusions linked to approved evidence (AE-01, WP-02) |
| **Methodology consistency** | Firm templates applied uniformly (WP-04) |
| **Review quality** | Multi-level review with separation of duties (WP-01) |
| **Traceability** | Full chain from conclusion to source (TRC-01) |
| **Version integrity** | Changes versioned — prior preserved (WP-03) |
| **Inspection readiness** | Navigable engagement file for quality review |
| **AI acceleration** | AI drafts accelerate preparation — human accountability preserved |

### 51.3 Working Paper Lifecycle

```
Create → In Progress → Submitted → Under Review → Review Cleared → Signed Off → Archived
              ↑              ↓
         AI Draft      Returned (review notes)
```

| Stage | Description |
|-------|-------------|
| **Create** | Working paper initiated from procedure assignment or template |
| **In progress** | Auditor documents procedure, links evidence, records results |
| **Submitted** | Auditor submits for review — evidence completeness checked |
| **Under review** | Review notes open at assigned levels |
| **Review cleared** | All required review notes resolved |
| **Signed off** | Required review levels signed off — paper locked (WP-02) |
| **Archived** | Engagement closed — read-only retention |

### 51.4 Automatic Working Paper Generation

| Aspect | Product Behavior |
|--------|------------------|
| **Trigger** | Auditor assigned procedure; or AI-assisted draft requested |
| **Source** | Firm working paper template linked to procedure library (WP-04) |
| **Pre-population** | Procedure reference, assertion, risk, audit area, materiality context |
| **Financial data** | Relevant trial balance balances and extracts embedded where applicable |
| **Evidence index** | Linked approved evidence listed in paper |
| **AI draft** | AI Auditor may generate draft sections — marked until human acceptance |
| **Status** | Auto-generated papers enter In progress — not signed off |

### 51.5 Manual Working Papers

| Aspect | Product Behavior |
|--------|------------------|
| **Creation** | Auditor creates paper from template or governed blank structure |
| **Use cases** | Supplementary testing, entity-specific matters, roll-forward schedules |
| **Linkage** | Must link to procedure, assertion, and audit area |
| **Validation** | Orphan papers without procedure linkage flagged |
| **Approval** | Same review workflow as auto-generated papers |

### 51.6 Working Paper Templates

| Template Type | Source |
|---------------|--------|
| **Standard ISA papers** | Firm-published library per procedure type |
| **Industry papers** | Banking, insurance, manufacturing supplements |
| **Analytical papers** | Planning and completion analytical templates |
| **Roll-forward** | Prior-year signed-off paper as base |
| **Governance** | Only approved template versions applied (WP-04, WS-02) |

Templates define required sections: objective, scope, procedure, results, exceptions, conclusion, evidence requirements.

### 51.7 Cross References

| Reference Type | Requirement |
|----------------|-------------|
| **Working paper → evidence** | Conclusion cites specific approved evidence |
| **Working paper → procedure** | Fulfills audit program procedure |
| **Working paper → risk** | Responsive to assessed risk |
| **Working paper → assertion** | Assertion under test identified |
| **Working paper → lead sheet** | Lead sheet line references paper |
| **Working paper → other papers** | Related testing cross-referenced |
| **Bidirectional** | Navigate from any linked artifact to paper |

Detailed cross-reference behavior specified in Section 53.

### 51.8 Linked Evidence

| Aspect | Product Behavior |
|--------|------------------|
| **Requirement** | Conclusions must link to approved evidence (AE-01) |
| **Display** | Evidence panel shows linked items with status |
| **Sufficiency** | Required vs. linked vs. approved evidence indicator |
| **Citation** | Conclusion text may cite evidence by reference index |
| **Rejection** | Rejected evidence unlinked — paper flagged |
| **Version** | Paper references specific evidence version |

### 51.9 Linked Risks

| Aspect | Product Behavior |
|--------|------------------|
| **Source** | Risk assessment version at paper creation |
| **Display** | Risk rating, rationale, and significant risk flag visible |
| **Procedure response** | Paper documents response to linked risk |
| **Reassessment** | Risk version change may flag paper for review |
| **Significant risk** | Partner review required per firm policy |

### 51.10 Linked Assertions

| Aspect | Product Behavior |
|--------|------------------|
| **Identification** | Assertion(s) under test recorded on paper |
| **Types** | Existence, completeness, accuracy, cut-off, classification, presentation |
| **Account** | Trial balance account or account group linked |
| **Coverage** | Assertion coverage map shows tested vs. planned assertions |

### 51.11 Linked Procedures

| Aspect | Product Behavior |
|--------|------------------|
| **Binding** | Each working paper fulfills one or more audit program procedures |
| **Status sync** | Procedure status reflects paper review state (Section 42.13) |
| **Completion** | Procedure Complete only when paper signed off (WP-02) |
| **Assignment** | Paper inherits assignee from procedure |

### 51.12 Linked Financial Statements

| Aspect | Product Behavior |
|--------|------------------|
| **Source** | Approved financial statement package version (Part 7) |
| **Linkage** | Paper references statement line items tested |
| **Amounts** | Reported amounts compared to tested conclusions |
| **Version** | Statement version locked at paper sign-off reference |
| **Drill-down** | Navigate from statement line to supporting papers |

### 51.13 Linked IFRS Notes

| Aspect | Product Behavior |
|--------|------------------|
| **Source** | Approved IFRS note package linked to statement version |
| **Linkage** | Papers testing disclosures reference relevant notes |
| **Disclosure assertions** | Presentation and disclosure assertion coverage |
| **Cross-navigate** | From note to supporting working papers |

### 51.14 Review Workflow

| Level | Reviewer | Scope |
|-------|----------|-------|
| **First** | Audit Senior | Execution, evidence linkage, conclusion support |
| **Second** | Audit Manager | Methodology, exceptions, program compliance |
| **Final (significant)** | Engagement Partner | Significant risks and matters |

| Step | Product Behavior |
|------|------------------|
| **Submit** | Auditor submits when evidence complete |
| **Review** | Reviewer examines sufficiency and appropriateness |
| **Comment** | Review notes — informational, required, blocking |
| **Resolve** | Auditor updates paper; responds to notes |
| **Clear** | Reviewer clears at assigned level |
| **Escalate** | Significant matters to Partner |

Preparer cannot be sole final reviewer (WP-01, APR-02).

### 51.15 Approval Workflow

| Aspect | Product Behavior |
|--------|------------------|
| **Sign-off** | Review clearance constitutes approval at each level |
| **Final sign-off** | Manager sign-off locks paper — edits create new version (WP-03) |
| **Partner sign-off** | Required for significant risk papers per firm policy |
| **Attribution** | Reviewer, level, timestamp recorded (APR-05) |
| **Procedure gate** | Linked procedure Complete after final sign-off (WP-02) |

### 51.16 Version History

| Event | Versioning |
|-------|------------|
| **Edit after creation** | New version; prior retained (WP-03, VER-02) |
| **Post sign-off edit** | New version; re-review required |
| **Evidence change** | Evidence version update may flag paper |
| **TB / statement change** | Underlying data version change flags affected papers |
| **Comparison** | Any two versions comparable |
| **AI draft** | AI interaction versions preserved if content accepted |

### 51.17 Ownership

| Role | Responsibility |
|------|----------------|
| **Preparer (Auditor)** | Creates, documents, submits working paper |
| **Reviewer (Senior / Manager)** | Reviews and signs off |
| **Engagement Partner** | Accountable for engagement file; signs significant papers |
| **Custodian** | Engagement team — papers confined to engagement boundary |

### 51.18 Permissions

| Capability | Engagement Partner | Audit Manager | Audit Senior | Auditor |
|------------|-------------------|---------------|--------------|---------|
| Create working paper | Yes | Yes | Yes | Yes (assigned) |
| Edit working paper | Yes | Yes | Yes | Yes (pre-sign-off) |
| Submit for review | Yes | Yes | Yes | Yes |
| Review / sign off | Yes | Yes | Yes | No (own paper) |
| Partner sign-off | Yes | No | No | No |
| View all papers | Assigned team | Assigned team | Assigned team | Assigned + read |
| Archive access | Yes | Yes | Yes | Read |

### 51.19 Business Validations

| Validation | Rule |
|------------|------|
| **WP-V01** | Conclusion requires linked approved evidence (AE-01) |
| **WP-V02** | Sign-off blocked without required review levels (WP-02) |
| **WP-V03** | Edits after sign-off create new version (WP-03) |
| **WP-V04** | Paper created from approved template (WP-04) |
| **WP-V05** | Uncleared blocking review notes prevent sign-off (WP-05) |
| **WP-V06** | Preparer cannot be sole final reviewer (WP-01) |
| **WP-V07** | Paper must link to procedure and assertion |
| **WP-V08** | AI content marked until human acceptance |
| **WP-V09** | Significant risk paper requires Partner visibility |
| **WP-V10** | Paper references evidence and data versions (VER-03) |

### 51.20 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **WP-AC-01** | Working paper creatable from procedure assignment and template |
| **WP-AC-02** | Auto-population includes procedure, risk, assertion context |
| **WP-AC-03** | Conclusion blocked without linked approved evidence |
| **WP-AC-04** | Multi-level review workflow completable |
| **WP-AC-05** | Sign-off locks paper; edit creates version |
| **WP-AC-06** | Preparer cannot sole final reviewer |
| **WP-AC-07** | Paper links to financial statement line and note where applicable |
| **WP-AC-08** | AI-drafted sections marked until accepted |
| **WP-AC-09** | Version comparison available |
| **WP-AC-10** | Procedure status syncs with paper sign-off |

---

## 52. Lead Sheets Module

The Lead Sheets Module governs **summary schedules linking trial balance amounts to detailed testing and working paper conclusions** — the navigational bridge of the audit file.

*Constitutional basis: PROJECT_BIBLE Part 3 Workflow 16; Part 8 Lead Sheet entity; Part 15 Section 80; Business Rules TRC-01, VER-03.*

### 52.1 Purpose

Produce **versioned lead sheets** that reconcile trial balance accounts to tested amounts, working paper conclusions, and financial statement lines — enabling reviewers and partners to navigate from reported figures to audit evidence efficiently.

### 52.2 Business Goals

| Goal | Description |
|------|-------------|
| **Trial balance reconciliation** | Lead sheet totals agree to approved trial balance |
| **Navigation** | Bridge from summary to detailed working papers |
| **Coverage visibility** | Unlinked accounts and untested balances flagged |
| **Conclusion aggregation** | Working paper conclusions roll up to account level |
| **Comparative support** | Prior-year lead sheets support trend analysis |
| **Version integrity** | Lead sheets versioned with trial balance version |
| **Review efficiency** | Managers review summaries before detailed papers |

### 52.3 Automatic Lead Sheet Generation

| Aspect | Product Behavior |
|--------|------------------|
| **Trigger** | Trial balance approved; working papers signed off; or refresh after adjustment |
| **Inputs** | Adjusted trial balance, audit program, completed working papers, firm templates |
| **Mapping** | Accounts mapped to lead sheet sections by audit area |
| **Aggregation** | Working paper conclusions aggregated to account lines |
| **Reconciliation** | Tested amounts vs. reported amounts calculated |
| **Differences** | Unreconciled differences flagged |
| **Cross-ref index** | Working paper reference index generated per section |

### 52.4 Manual Lead Sheets

| Aspect | Product Behavior |
|--------|------------------|
| **Creation** | Audit Senior creates supplementary lead sheet schedules |
| **Use cases** | Custom account groupings, consolidation schedules, memo accounts |
| **Validation** | Manual sheets must still reconcile to trial balance |
| **Linkage** | Working papers manually linked where auto-mapping incomplete |

### 52.5 Account Roll-forwards

| Column | Description |
|--------|-------------|
| **Opening balance** | From prior period closing or comparative trial balance |
| **Additions** | Debits/credits per account nature |
| **Closing balance** | Per current trial balance |
| **Reconciliation** | Roll-forward agrees to trial balance movement |
| **Supporting papers** | Papers supporting movement analysis linked |
| **Exceptions** | Unexplained movements flagged |

### 52.6 Comparative Years

| Aspect | Product Behavior |
|--------|------------------|
| **Prior period** | Comparative column from approved prior lead sheet or trial balance |
| **Variance** | Current vs. prior amount and percentage |
| **Investigation** | Material variances link to analytical working papers |
| **First year** | Comparative omitted where no prior period |
| **Restatement** | Prior period restatement creates new comparative version |

### 52.7 Cross References

| Reference | Navigation |
|-----------|------------|
| **Lead sheet → working paper** | Detail testing references |
| **Lead sheet → trial balance account** | Account balance source |
| **Lead sheet → financial statement line** | Presentation linkage |
| **Lead sheet → evidence** | Via working paper indirect link |
| **Bidirectional** | From TB account to lead sheet to papers |

### 52.8 Trial Balance Reconciliation

| Check | Product Behavior |
|-------|------------------|
| **Total agreement** | Lead sheet section totals agree to trial balance |
| **Account coverage** | Every material account mapped or flagged unlinked |
| **Difference column** | Reported vs. tested vs. difference displayed |
| **Explanation** | Differences require documented explanation or adjustment reference |
| **Version** | Reconciliation to specific trial balance version |
| **Blocking** | Unreconciled material difference blocks lead sheet sign-off |

### 52.9 Supporting Schedules

| Schedule Type | Purpose |
|---------------|---------|
| **Account detail** | Breakdown of account balance components |
| **Testing summary** | Extent of testing — sample size, coverage |
| **Exception summary** | Aggregated exceptions from working papers |
| **Cross-reference index** | Index of all papers supporting section |
| **Adjustment schedule** | Proposed and posted adjustments linked |

### 52.10 Review Workflow

| Step | Actor | Action |
|------|-------|--------|
| **Generate** | Audit Senior | Generate or refresh lead sheets |
| **Reconcile** | Audit Senior | Confirm TB reconciliation; resolve differences |
| **Link** | Auditor / Senior | Complete working paper linkages |
| **Submit** | Audit Senior | Submit for Manager review |
| **Review** | Audit Manager | Review reconciliation, coverage, conclusions |
| **Comment** | Audit Manager | Review notes on unreconciled items |
| **Clear** | Audit Manager | Clear review — advance to sign-off |

### 52.11 Approval Workflow

| Requirement | Description |
|-------------|-------------|
| **Preparer** | Audit Senior |
| **Reviewer / approver** | Audit Manager sign-off |
| **Partner visibility** | Significant unreconciled matters escalated |
| **Lock** | Signed-off lead sheet locked — refresh creates new version |
| **Attribution** | Sign-off recorded with timestamp (APR-05) |

### 52.12 Versioning

| Event | Versioning |
|-------|------------|
| **Initial generation** | Version tied to trial balance version |
| **TB change** | Regeneration required — new version |
| **Working paper update** | Refresh aggregates new conclusions — versioned |
| **Sign-off** | Approved version locked |
| **Comparison** | Prior versions preserved and comparable (VER-02) |

### 52.13 Permissions

| Capability | Engagement Partner | Audit Manager | Audit Senior | Auditor |
|------------|-------------------|---------------|--------------|---------|
| Generate lead sheets | Yes | Yes | Yes | No |
| Edit lead sheets | Yes | Yes | Yes | Contribute links |
| Submit for review | Yes | Yes | Yes | No |
| Review / sign off | Yes | Yes | No | No |
| View lead sheets | Assigned team | Assigned team | Assigned team | Assigned team |
| Refresh after TB change | Yes | Yes | Yes | No |

### 52.14 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **LS-AC-01** | Lead sheets auto-generated from trial balance and working papers |
| **LS-AC-02** | Totals reconcile to trial balance version |
| **LS-AC-03** | Unlinked accounts flagged |
| **LS-AC-04** | Working paper cross-reference index generated |
| **LS-AC-05** | Roll-forward columns supported |
| **LS-AC-06** | Comparative prior period column supported |
| **LS-AC-07** | Material unreconciled difference blocks sign-off |
| **LS-AC-08** | Manager sign-off locks lead sheet version |
| **LS-AC-09** | TB version change triggers regeneration prompt |
| **LS-AC-10** | Bidirectional navigation to working papers |

---

## 53. Cross-Referencing Engine

The Cross-Referencing Engine governs **creation, validation, navigation, and integrity of references** across the engagement documentation network — unifying audit, reporting, and evidence artifacts.

*Constitutional basis: PROJECT_BIBLE Part 3 Section 16 traceability chain; Part 15 Sections 79.3, 80; Business Rules TRC-01 through TRC-05.*

### 53.1 Purpose

Maintain a **bidirectional reference network** connecting working papers, lead sheets, evidence, procedures, risks, assertions, trial balance, financial statements, and IFRS notes — enabling end-to-end drill-down and inspection-grade navigation.

### 53.2 Business Goals

| Goal | Description |
|------|-------------|
| **End-to-end lineage** | Any conclusion traceable to source (TRC-01) |
| **Bidirectional navigation** | Summary to detail and detail to summary |
| **Reference integrity** | Broken references detected and resolved |
| **Automation** | System-generated references reduce manual effort |
| **Inspection readiness** | Reference network exportable for quality review |
| **Non-repudiation** | Reference creation and changes logged (TRC-05) |

### 53.3 Automatic References

| Trigger | Auto-Reference Created |
|---------|------------------------|
| **Procedure assignment** | Paper → procedure |
| **Evidence link** | Paper → evidence; evidence → paper |
| **Risk at creation** | Paper → risk assessment entry |
| **Account on paper** | Paper → trial balance account |
| **Lead sheet generation** | Lead sheet → accounts; lead sheet → papers |
| **Statement testing** | Paper → statement line |
| **Note testing** | Paper → IFRS note |
| **AI citation** | AI output → source evidence |

### 53.4 Manual References

| Aspect | Product Behavior |
|--------|------------------|
| **Creation** | User creates reference between supported artifact types |
| **Use cases** | Related papers, supporting schedules, prior-year references |
| **Validation** | Target artifact must exist and be accessible |
| **Permission** | User must have read access to both ends |
| **Audit** | Manual reference creation logged |

### 53.5 Reference Validation

| Validation | Rule |
|------------|------|
| **Existence** | Referenced artifact exists in engagement |
| **Permission** | User can access both ends |
| **Version** | Reference notes target version where applicable |
| **Type compatibility** | Only supported reference types permitted |
| **Circular** | Circular references allowed but flagged for review |
| **On sign-off** | Reference integrity check runs before paper sign-off |

### 53.6 Broken Reference Detection

| Break Type | Detection |
|------------|-----------|
| **Deleted artifact** | Referenced item archived or superseded |
| **Version supersession** | Referenced version no longer current — warning |
| **Rejected evidence** | Evidence rejected — paper reference flagged |
| **TB regeneration** | Account mapping changed — lead sheet reference flagged |
| **Statement regeneration** | Statement version changed — paper reference flagged |
| **Alert** | Broken references appear on documentation monitoring dashboard |
| **Resolution** | User updates reference or documents rationale |

### 53.7 Reference Explorer

| Feature | Description |
|---------|-------------|
| **Graph view** | Visual network of references from selected artifact |
| **List view** | Inbound and outbound references tabulated |
| **Depth** | Configurable drill depth — e.g., paper → evidence → source |
| **Filter** | By artifact type, audit area, status |
| **Export** | Reference map exportable for inspection |
| **Starting points** | Open from any artifact — paper, lead sheet, account, statement line |

### 53.8 Navigation

| Navigation Path | Example |
|-----------------|---------|
| **Opinion → file** | Future opinion links to engagement file version |
| **Statement → TB → lead sheet → paper → evidence** | Full downward drill |
| **Evidence → papers → lead sheet → account** | Upward usage map |
| **Note → papers → evidence** | Disclosure testing path |
| **Risk → procedures → papers** | Risk response path |
| **Breadcrumb** | Context preserved during navigation |

### 53.9 Audit Trail

| Event | Recorded |
|-------|----------|
| Reference created | Source, target, user, timestamp |
| Reference removed | User, reason, timestamp |
| Broken reference detected | System event, affected artifacts |
| Reference resolved | User, resolution action |
| Explorer export | User, scope, timestamp |

### 53.10 Permissions

| Capability | Engagement Partner | Audit Manager | Audit Senior | Auditor |
|------------|-------------------|---------------|--------------|---------|
| Create manual reference | Yes | Yes | Yes | Yes (own papers) |
| Remove reference | Yes | Yes | Yes | Own papers only |
| View reference explorer | Assigned team | Assigned team | Assigned team | Assigned team |
| Export reference map | Yes | Yes | No | No |
| Resolve broken reference | Yes | Yes | Yes | Assigned artifacts |

### 53.11 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **XRF-AC-01** | Automatic references created on evidence and procedure link |
| **XRF-AC-02** | Manual reference creatable between supported types |
| **XRF-AC-03** | Broken reference detection alerts on dashboard |
| **XRF-AC-04** | Reference explorer shows inbound and outbound refs |
| **XRF-AC-05** | Full drill-down from statement line to evidence |
| **XRF-AC-06** | Version supersession warns without breaking navigation |
| **XRF-AC-07** | Reference integrity check before paper sign-off |
| **XRF-AC-08** | Reference audit trail exportable |
| **XRF-AC-09** | Bidirectional navigation functional |
| **XRF-AC-10** | Cross-module references span audit and reporting artifacts |

---

## 54. Documentation Monitoring

Documentation Monitoring provides **engagement-wide visibility** into working paper and lead sheet completeness, review status, and documentation quality — supporting fieldwork completion and findings readiness.

*Constitutional basis: MASTER_PRD Section 19 Engagement Dashboard; Business Rules WP-05, OPN-02.*

### 54.1 Missing Working Papers

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Approved program procedures without working paper or unsigned paper |
| **Source** | Audit program vs. working paper index |
| **Alert** | Manager and assignee notified |
| **Dashboard** | Missing paper count on engagement dashboard |
| **Drill-down** | By procedure, audit area, assignee |
| **Blocking** | Contributes to fieldwork substantially complete gate |

### 54.2 Missing Lead Sheets

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Audit areas or account groups without lead sheet coverage |
| **Source** | Trial balance accounts vs. lead sheet mapping |
| **Alert** | Senior and Manager notified |
| **Material accounts** | Significant accounts without lead sheet flagged prominently |

### 54.3 Incomplete Documentation

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Papers in progress, pending evidence, or uncleared review notes |
| **Categories** | Draft, submitted, returned, pending evidence |
| **Blocking notes** | Papers with uncleared blocking review notes (WP-05) |
| **Evidence gaps** | Papers with missing required evidence |
| **AI unaccepted** | Papers with unaccepted AI-drafted content |

### 54.4 Pending Reviews

| Aspect | Product Behavior |
|--------|------------------|
| **Working papers** | Submitted awaiting Senior, Manager, or Partner review |
| **Lead sheets** | Submitted awaiting Manager review |
| **Aging** | Days pending visible per reviewer queue |
| **Workload** | Review count per reviewer for capacity planning |

### 54.5 Pending Approvals

| Aspect | Product Behavior |
|--------|------------------|
| **Sign-off queue** | Papers cleared for final sign-off pending reviewer action |
| **Lead sheet sign-off** | Lead sheets awaiting Manager sign-off |
| **Partner queue** | Significant papers awaiting Partner sign-off |
| **Escalation** | Overdue sign-offs escalate per firm policy |

### 54.6 Documentation KPIs

| KPI | Audience | Purpose |
|-----|----------|---------|
| **Working paper completion %** | Audit Manager | Fieldwork progress |
| **Lead sheet coverage %** | Audit Manager | Summary documentation completeness |
| **Review backlog count** | Audit Manager | Review throughput |
| **Missing paper count** | Audit Manager | Program coverage gaps |
| **Broken reference count** | Audit Manager | Reference integrity |
| **TB reconciliation status** | Audit Manager | Lead sheet integrity |
| **Sign-off turnaround** | Audit Manager | Review efficiency |
| **Partner queue depth** | Engagement Partner | Significant matter oversight |

### 54.7 Quality KPIs

| KPI | Description |
|-----|-------------|
| **First-pass review acceptance** | Papers approved without return |
| **Return rate** | Papers returned with review notes |
| **Blocking note density** | Blocking notes per paper |
| **Exception rate** | Papers with documented exceptions |
| **Evidence rejection impact** | Papers affected by rejected evidence |
| **AI acceptance rate** | AI-drafted content accepted vs. rejected |
| **Unreconciled lead sheet items** | Differences without explanation |

### 54.8 Business Rules

| Rule | Description |
|------|-------------|
| **DOC-R01** | Missing required working paper flagged in real time |
| **DOC-R02** | Uncleared blocking notes prevent paper sign-off (WP-05) |
| **DOC-R03** | Lead sheet must reconcile before sign-off |
| **DOC-R04** | Broken references flagged on monitoring dashboard |
| **DOC-R05** | KPIs scoped to current approved program and TB versions |
| **DOC-R06** | Partner dashboard shows significant documentation matters |
| **DOC-R07** | Documentation completeness feeds opinion gate (OPN-02) |
| **DOC-R08** | Monitoring data exportable for engagement team meetings |

### 54.9 Permissions

| Capability | Engagement Partner | Audit Manager | Audit Senior | Auditor |
|------------|-------------------|---------------|--------------|---------|
| View documentation KPIs | Yes | Yes | Yes | Own assignments |
| View missing papers report | Yes | Yes | Yes | Own procedures |
| View review backlog | Yes | Yes | Yes | Own submissions |
| View broken references | Yes | Yes | Yes | Assigned artifacts |
| Configure alerts | Yes | Yes | No | No |
| Export monitoring report | Yes | Yes | No | No |

### 54.10 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **DOC-AC-01** | Dashboard shows working paper completion percentage |
| **DOC-AC-02** | Missing working papers list drillable by assignee |
| **DOC-AC-03** | Missing lead sheet coverage identified |
| **DOC-AC-04** | Pending review queues visible by reviewer |
| **DOC-AC-05** | Blocking review notes prevent sign-off indicator shown |
| **DOC-AC-06** | Broken reference count on dashboard |
| **DOC-AC-07** | Lead sheet reconciliation status displayed |
| **DOC-AC-08** | Partner significant-matter queue visible |
| **DOC-AC-09** | Quality KPIs calculated and displayed |
| **DOC-AC-10** | Monitoring export supported |

---

## 55. User Journey — Documentation to Findings Readiness

End-to-end experience from **approved evidence** through **signed-off working papers and lead sheets** — ready for findings evaluation and misstatement aggregation.

*Continues MASTER_PRD Part 10 Section 50 — evidence approved and linked; builds on Part 9 procedure execution.*

### 55.1 Journey Overview

```
Evidence Approved → Working Papers Generated → Lead Sheets Generated
    → Cross References Verified → Documentation Reviewed → Documentation Approved
        → Ready for Findings Assessment
```

**Primary actors:** Auditor (prepare), Audit Senior (first review), Audit Manager (lead sheets and final review), Engagement Partner (significant matters).

### 55.2 Step 1 — Evidence Approved

| Perspective | Auditor |
|-------------|---------|
| **State** | Required evidence approved for assigned procedure (Part 10) |
| **Sees** | Working paper with evidence panel green; sufficiency indicator satisfied |
| **Action** | Open working paper — auto-generated from procedure template |
| **Context** | Procedure, risk, assertion, and account pre-populated |

**User sees:** Working paper editor with approved evidence listed and procedure checklist complete.

### 55.3 Step 2 — Working Papers Generated

| Perspective | Auditor |
|-------------|---------|
| **Action** | Document procedure performed; record results and exceptions |
| **Evidence** | Cite approved evidence in conclusion |
| **Cross-ref** | System auto-links evidence, procedure, risk, assertion, account |
| **AI** | AI-drafted narrative reviewed and accepted |
| **Submit** | Submit working paper for Senior review |
| **Iterate** | Resolve review notes; resubmit if returned |

**User sees:** Working paper progressing through review — status Submitted → Under Review.

### 55.4 Step 3 — Lead Sheets Generated

| Perspective | Audit Senior |
|-------------|--------------|
| **Trigger** | Sufficient working papers signed off for audit area |
| **Action** | Generate lead sheets from trial balance and working papers |
| **Processing** | Accounts mapped; conclusions aggregated; TB reconciliation calculated |
| **Differences** | Investigate and document unreconciled items |
| **Roll-forward** | Complete movement columns where applicable |
| **Submit** | Submit lead sheets for Manager review |

**User sees:** Lead sheet by audit area with reconciliation status and working paper index.

### 55.5 Step 4 — Cross References Verified

| Perspective | Audit Manager |
|-------------|---------------|
| **Action** | Open Reference Explorer from lead sheet or statement line |
| **Verify** | Drill-down from account → lead sheet → paper → evidence |
| **Broken refs** | Resolve broken reference alerts |
| **Manual refs** | Add supplementary cross-references where needed |
| **Statement** | Verify papers link to approved statement lines and notes |
| **Completeness** | Documentation monitoring dashboard reviewed |

**User sees:** Reference network with green integrity status; broken references resolved.

### 55.6 Step 5 — Documentation Reviewed

| Perspective | Audit Senior; Audit Manager; Engagement Partner |
|-------------|------------------------------------------------|
| **Senior** | First-level working paper review — cleared |
| **Manager** | Second-level paper review; lead sheet review |
| **Partner** | Significant risk papers and material matters reviewed |
| **Notes** | All blocking review notes cleared (WP-05) |
| **Sign-off** | Required levels signed off on papers and lead sheets |

**User sees:** Review queues empty; papers and lead sheets status **Signed Off**.

### 55.7 Step 6 — Documentation Approved

| Milestone | Criteria |
|-----------|----------|
| **Working papers** | All required procedures have signed-off papers |
| **Lead sheets** | All audit areas reconciled and signed off |
| **References** | No unresolved broken references |
| **Exceptions** | Documented on working papers — ready for findings evaluation |
| **Versions** | Papers and lead sheets reference current TB and statement versions |

| Perspective | Audit Manager |
|-------------|---------------|
| **Action** | Confirm documentation substantially complete on monitoring dashboard |
| **Certification** | Manager acknowledges documentation package ready for findings phase |

**User sees:** Documentation KPIs at target thresholds; substantially complete indicator green.

### 55.8 Step 7 — Ready for Findings Assessment

| Milestone | Criteria |
|-----------|----------|
| **Signed-off documentation** | Working papers and lead sheets complete |
| **Exceptions captured** | Working paper exceptions available for aggregation |
| **Traceability** | Full reference chain verified |
| **Next workflow** | Misstatement evaluation, control deficiency assessment, going concern |

| Perspective | Audit Manager |
|-------------|---------------|
| **Action** | Initiate findings evaluation from documented exceptions |
| **Partner** | Reviews significant matters before findings conclusion |
| **Engagement** | Dashboard milestone updated |

**User sees:** Engagement dashboard milestone — **Ready for Findings Assessment** — findings module actions enabled.

### 55.9 Journey Diagram

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│    Evidence      │───►│   Working        │───►│   Lead Sheets    │
│    Approved      │    │   Papers Gen.    │    │    Generated     │
└──────────────────┘    └──────────────────┘    └────────┬─────────┘
                                                         │
┌──────────────────┐    ┌──────────────────┐    ┌───────▼──────────┐
│     Ready for    │◄───│  Documentation   │◄───│  Cross Refs      │
│    Findings      │    │    Approved      │    │   Verified       │
│  Assessment      │    └────────┬─────────┘    └──────────────────┘
└──────────────────┘             │
                        ┌────────▼─────────┐
                        │ Documentation    │
                        │    Reviewed      │
                        └──────────────────┘
```

### 55.10 Journey Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **DJ-AC-01** | Working paper generatable from approved evidence state |
| **DJ-AC-02** | Full paper review and sign-off journey completable |
| **DJ-AC-03** | Lead sheets generatable from signed-off papers |
| **DJ-AC-04** | Reference explorer verifies end-to-end chain |
| **DJ-AC-05** | Documentation monitoring reflects journey progress |
| **DJ-AC-06** | Ready for Findings Assessment milestone displayed |
| **DJ-AC-07** | Exceptions on papers available for findings module |

---

## PRD Review Notes — Part 11

Consistency review of MASTER_PRD Part 11 against PROJECT_BIBLE (Parts 1–15) and MASTER_PRD Parts 1–10. No previous sections modified.

### Constitutional Alignment

| Area | Status | Notes |
|------|--------|-------|
| Workflow 15 Working Paper Generation | Aligned | Section 51 |
| Workflow 16 Lead Sheet Generation | Aligned | Section 52 |
| Part 15 §80 Documentation Standards | Aligned | Sections 51, 52 |
| Part 15 §79 Evidence traceability | Aligned | Sections 51, 53 |
| Part 8 Working Paper entity | Aligned | Section 51 lifecycle |
| Part 8 Lead Sheet entity | Aligned | Section 52 |
| WP-01 through WP-05 | Aligned | Sections 51, 54 |
| TRC-01 through TRC-05 | Aligned | Section 53 |
| OPN-02 File completeness | Aligned | Section 54 |

### MASTER_PRD Parts 1–10 Alignment

| Area | Status |
|------|--------|
| PRD9-03 Working Paper standalone | Addressed — Section 51 |
| PRD9-04 / PRD7-05 Lead Sheet Generation | Addressed — Section 52 |
| PRD10-02 Evidence linkage | Section 51.8 — builds on Part 10 |
| Section 43 Procedure Execution | Section 51 integrates — status sync |
| Section 46–48 Evidence | Section 51.8 linked evidence |
| Part 7 Financial statements / notes | Sections 51.12, 51.13 |
| Part 8 Risk / materiality | Sections 51.9, planning context |
| Section 19 Dashboard | Section 54 feeds KPIs |
| PRD10-01 Milestone taxonomy | Section 55 introduces **Ready for Findings Assessment** — distinct milestone |

### Terminology Consistency

| Term | Status |
|------|--------|
| Working paper vs working paper template | Distinct — template vs instance |
| Lead sheet vs supporting schedule | Lead sheet is summary; schedules are detail |
| Sign-off vs approval | Sign-off at review levels; documentation approved as milestone |
| Cross-reference vs linkage | Cross-reference engine unifies all link types |
| Documentation vs engagement file | Documentation is working papers + lead sheets + linked artifacts |

### Governance & Review Chain

| Area | Status |
|------|--------|
| Auditor prepare → Senior → Manager | Sections 51, 52 |
| Partner significant matters | Sections 51, 55 |
| Separation of preparer and reviewer | WP-01 throughout |
| Version locking on sign-off | WP-03, Sections 51, 52 |
| TB version dependency | Section 52.12 |

### Traceability & Cross References

| Area | Status |
|------|--------|
| Full chain to source | Section 53 navigation paths |
| Bidirectional references | Section 53 |
| Broken reference detection | Sections 53, 54 |
| Statement and note linkage | Sections 51.12, 51.13, 53 |

### Editorial Recommendations

| ID | Recommendation |
|----|----------------|
| **PRD11-01** | Milestone glossary — consolidate Part 8–11 "Ready for Working Papers" variants with Part 11 "Ready for Findings Assessment" in future editorial pass |
| **PRD11-02** | Findings and misstatement evaluation module — Part 12 per journey end state |
| **PRD11-03** | Control deficiency documentation — link control test papers to deficiency register (PRD8-03) |
| **PRD11-04** | AI Auditor procedure integration (Workflow 17) — expand AI draft to paper workflow |
| **PRD11-05** | Working paper roll-forward from prior-year engagement file |
| **PRD11-06** | Independent quality reviewer (Reviewer role) documentation path — Part 15 §80 |
| **PRD11-07** | Export engagement file package for inspection — Part 10 §51 export linkage |
| **PRD11-08** | Group audit — component lead sheet consolidation |

### Review Conclusion

MASTER_PRD Part 11 is **consistent with PROJECT_BIBLE and Parts 1–10**. It specifies working papers, lead sheets, cross-referencing, and documentation monitoring as governed ISA-aligned documentation workflows without contradicting evidence discipline, traceability, or review philosophy. PRD11-01 through PRD11-08 guide subsequent PRD parts.

---

## Document Control — Part 11

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.11.0 | 2026-06-30 | Chief Product Officer | Part 11 — Working Papers, Lead Sheets & Documentation complete; PRD Review Notes Part 11 included |

---

*End of Part 11.*

---

## Part 12 — Findings, Control Deficiencies & Remediation

### Table of Contents — Part 12

56. [Findings Management Module](#56-findings-management-module)
57. [Control Deficiency Module](#57-control-deficiency-module)
58. [Management Response & Remediation](#58-management-response--remediation)
59. [Findings Dashboard](#59-findings-dashboard)
60. [User Journey — Findings to AI Audit Analysis Readiness](#60-user-journey--findings-to-ai-audit-analysis-readiness)

### Dependencies

This part depends on modules specified in MASTER_PRD Parts 7–11:

| Upstream Module | PRD Reference |
|-----------------|---------------|
| Working Papers | Part 11 — Section 51 |
| Lead Sheets | Part 11 — Section 52 |
| Audit Procedures & Execution | Part 9 — Sections 42–43 |
| Evidence Repository | Part 10 — Sections 46–47 |
| Risk Assessment | Part 8 — Section 38 |
| Materiality Management | Part 8 — Section 37 |
| Financial Statements | Part 7 — Sections 31–32 |

Future PRD parts depending on this document:

| Downstream Module | Relationship |
|-------------------|--------------|
| AI Auditor | AI findings may link to audit findings; completion analysis (Workflow 17) |
| Governance | Audit committee visibility; remediation oversight |
| Audit Opinion | Opinion impact from uncorrected misstatements and deficiencies |
| Management Letter | Findings compiled into management letter (Workflow 21) |
| Final Reporting | Finding registers exported in engagement deliverables |

---

## 56. Findings Management Module

The Findings Management Module governs **identification, evaluation, documentation, and lifecycle of audit findings** — misstatements, observations, and matters affecting the audit opinion and management communication.

*Constitutional basis: PROJECT_BIBLE Part 8 Finding entity; Part 15 Section 78 Findings Evaluation; Workflow 21; Business Rules AE-01, APR-01 through APR-05, OPN-02.*

*Terminology note: **Audit Finding** (this section) is distinct from **AI Finding** (PROJECT_BIBLE Part 4 Section 20) — AI Findings require human disposition and may link to audit findings but are separate governed objects.*

### 56.1 Purpose

Enable engagement teams to **record, evaluate, approve, and track** audit findings with full linkage to working papers, evidence, materiality, and financial statements — supporting misstatement aggregation, opinion evaluation, and management communication.

### 56.2 Business Goals

| Goal | Description |
|------|-------------|
| **Complete evaluation** | All exceptions and matters evaluated before opinion (OPN-02) |
| **Materiality discipline** | Findings assessed individually and in aggregate against materiality |
| **Traceability** | Every finding links to working paper and evidence (AE-01) |
| **Governed communication** | Findings approved before management letter inclusion |
| **Remediation tracking** | Accepted findings tracked through resolution |
| **Opinion support** | Uncorrected misstatements summarized for opinion impact |
| **Inspection readiness** | Finding register navigable for quality review |

### 56.3 Finding Lifecycle

```
Identified → Documented → Submitted → Manager Review → Partner Review
    → Agreed with Management → Communicated → Remediation → Closed → Archived
              ↑
    Created from working paper exception or manual entry
```

| Stage | Description |
|-------|-------------|
| **Identified** | Exception or matter noted during fieldwork |
| **Documented** | Finding record created with description and amount |
| **Submitted** | Submitted for manager evaluation |
| **Reviewed** | Manager and Partner review materiality and classification |
| **Agreed** | Management acknowledges finding where required |
| **Communicated** | Included in management letter or governance communication |
| **Remediation** | Action plan tracked (Section 58) |
| **Closed** | Resolved or accepted as uncorrected with rationale |
| **Archived** | Engagement closed — read-only |

### 56.4 Finding Categories

| Category | Description |
|----------|-------------|
| **Misstatement** | Difference between reported and correct amounts |
| **Projected misstatement** | Extrapolated error from sample testing |
| **Judgmental difference** | Difference arising from accounting estimate judgment |
| **Control deficiency** | Control design or operating failure — links to Section 57 |
| **Recommendation** | Process improvement without misstatement |
| **Compliance matter** | Regulatory or contractual non-compliance observation |
| **Going concern indicator** | Matter affecting going concern assessment |
| **Disclosure deficiency** | IFRS disclosure gap identified during audit |

### 56.5 Finding Severity

| Severity | Definition | Typical Action |
|----------|------------|----------------|
| **Critical** | Potential material misstatement or material weakness | Partner review mandatory; opinion impact assessment |
| **High** | Likely error or significant deficiency | Prompt management communication |
| **Medium** | Notable matter requiring attention | Manager review; may aggregate |
| **Low** | Minor observation | Documented; may not communicate |
| **Informational** | Contextual observation | Recorded; no action required |

Severity is **professional judgment** — suggested from working paper exception data; confirmed by Audit Manager.

### 56.6 Finding Materiality

| Assessment | Product Behavior |
|------------|------------------|
| **Individual amount** | Compared to overall and performance materiality |
| **Specific materiality** | Compared to area-specific thresholds where applicable |
| **Trivial threshold** | Below trivial — may exclude from accumulation per policy |
| **Aggregate misstatement** | Running total of uncorrected misstatements vs. materiality |
| **Percentage** | Amount as percentage of materiality benchmark displayed |
| **Qualitative factors** | Qualitative materiality factors documented |
| **Opinion impact** | Material individually or in aggregate flagged for Partner |
| **Adjustment tracking** | Corrected misstatements removed from uncorrected summary |

### 56.7 Finding Ownership

| Role | Responsibility |
|------|----------------|
| **Identifier (Auditor)** | Creates finding from working paper exception |
| **Evaluator (Audit Manager)** | Assesses materiality, classification, aggregation |
| **Approver (Engagement Partner)** | Approves significant and communicated findings |
| **Management owner** | Client responsible party for response (Section 58) |
| **Custodian** | Engagement team — finding confined to engagement |

### 56.8 Finding Status

| Status | Meaning |
|--------|---------|
| **Draft** | Finding created — not submitted |
| **Pending evaluation** | Awaiting manager review |
| **Under partner review** | Significant finding with Partner |
| **Approved** | Evaluation complete — ready for management communication |
| **Pending management response** | Awaiting client response |
| **Remediation in progress** | Action plan active |
| **Closed — corrected** | Misstatement adjusted in financial statements |
| **Closed — uncorrected** | Accepted uncorrected with documented rationale |
| **Closed — no action** | Inconsequential — documented waiver |
| **Withdrawn** | Finding invalidated — rationale recorded |

### 56.9 Finding Versioning

| Event | Versioning |
|-------|------------|
| **Creation** | Version 1 |
| **Amount or classification change** | New version with rationale |
| **Management response update** | Versioned amendment |
| **Closure** | Final version locked |
| **Preservation** | All versions retained (VER-02) |
| **Linkage** | Finding references working paper and evidence versions (VER-03) |

### 56.10 Evidence Linking

| Linkage | Requirement |
|---------|-------------|
| **Working paper** | Finding originates from or references working paper |
| **Evidence** | Supporting evidence linked — mandatory (AE-01) |
| **Procedure** | Audit program procedure referenced |
| **Account** | Trial balance account and assertion identified |
| **Lead sheet** | Lead sheet line referenced where applicable |
| **Financial statement** | Statement line impact identified for misstatements |
| **Blocking** | Finding submission blocked without evidence linkage |

### 56.11 Cross References

| Reference Type | Navigation |
|----------------|------------|
| **Finding → working paper** | Source procedure and conclusion |
| **Finding → evidence** | Supporting documentation |
| **Finding → risk** | Related assessed risk |
| **Finding → control deficiency** | Linked deficiency record (Section 57) |
| **Finding → adjustment** | Proposed or posted journal adjustment |
| **Finding → management letter** | Communication reference (future part) |
| **Bidirectional** | Navigate from any linked artifact to finding |

### 56.12 Review Workflow

| Step | Actor | Action |
|------|-------|--------|
| **Create** | Auditor | Document finding from exception |
| **Submit** | Auditor | Submit for manager evaluation |
| **Evaluate** | Audit Manager | Assess amount, category, severity, materiality |
| **Aggregate** | Audit Manager | Update misstatement summary |
| **Escalate** | Audit Manager | Significant findings to Partner |
| **Review** | Engagement Partner | Review material and communicated findings |
| **Approve** | Engagement Partner | Approve finding for communication |

### 56.13 Approval Workflow

| Finding Type | Approver |
|--------------|----------|
| **Below performance materiality** | Audit Manager |
| **Above performance materiality** | Engagement Partner |
| **Control deficiency** | Per Section 57 classification approval |
| **Uncorrected misstatement** | Engagement Partner mandatory |
| **Communication inclusion** | Engagement Partner before management letter |
| **Attribution** | Approver, timestamp, version (APR-05) |
| **Non-bypassable** | Significant findings cannot skip Partner (APR-01, APR-03) |

### 56.14 Permissions

| Capability | Engagement Partner | Audit Manager | Audit Senior | Auditor | Client User |
|------------|-------------------|---------------|--------------|---------|-------------|
| Create finding | Yes | Yes | Yes | Yes | No |
| Edit finding (draft) | Yes | Yes | Yes | Yes | No |
| Submit for evaluation | Yes | Yes | Yes | Yes | No |
| Evaluate / approve | Yes | Yes (non-significant) | No | No | No |
| View findings | Assigned team | Assigned team | Assigned team | Assigned team | Communicated only |
| Close finding | Yes | Yes | No | No | No |
| Management response | No | No | No | No | Yes (assigned) |

### 56.15 Business Validations

| Validation | Rule |
|------------|------|
| **FND-V01** | Finding requires linked working paper and evidence (AE-01) |
| **FND-V02** | Misstatement requires amount or range |
| **FND-V03** | Material finding requires Partner approval |
| **FND-V04** | Uncorrected misstatement requires Partner approval and rationale |
| **FND-V05** | Aggregate misstatement calculated against materiality |
| **FND-V06** | Finding version references source paper version (VER-03) |
| **FND-V07** | Closed finding locked — reopen requires Manager authorization |
| **FND-V08** | Opinion gate blocked with unevaluated material findings (OPN-02) |
| **FND-V09** | Control deficiency finding links to deficiency record |
| **FND-V10** | Communication blocked without approved finding status |

### 56.16 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **FND-AC-01** | Finding creatable from working paper exception |
| **FND-AC-02** | Submission blocked without evidence linkage |
| **FND-AC-03** | Materiality comparison displayed against engagement thresholds |
| **FND-AC-04** | Aggregate misstatement summary auto-calculated |
| **FND-AC-05** | Partner approval required for material findings |
| **FND-AC-06** | Finding categories and severity assignable |
| **FND-AC-07** | Version history preserved on amendment |
| **FND-AC-08** | Bidirectional navigation to working paper and evidence |
| **FND-AC-09** | Uncorrected misstatement register exportable |
| **FND-AC-10** | Finding status lifecycle enforced |

---

## 57. Control Deficiency Module

The Control Deficiency Module governs **documentation, classification, and evaluation of internal control deficiencies** identified during the audit — with COSO mapping and SOX-readiness support.

*Constitutional basis: PROJECT_BIBLE Part 8 Control entity; Part 2 Sections 26.4–26.5 COSO/SOX; Glossary §42.8; Business Rules APR-03.*

### 57.1 Purpose

Enable engagement teams to **document, classify, and evaluate** control deficiencies with linkage to risks, procedures, evidence, and financial statement assertions — supporting ICFR documentation and management letter communication.

### 57.2 Business Goals

| Goal | Description |
|------|-------------|
| **Deficiency documentation** | Structured record of each identified deficiency |
| **Classification discipline** | Deficiency, significant deficiency, or material weakness per professional standards |
| **COSO alignment** | Deficiencies mapped to COSO components |
| **SOX readiness** | Platform supports ICFR programs — does not perform attestation |
| **Risk linkage** | Deficiencies linked to control risk assessment |
| **Remediation tracking** | Deficiencies tracked through corrective action |
| **Assertion coverage** | Deficiencies mapped to affected assertions |

### 57.3 Control Categories

| Category | Description |
|----------|-------------|
| **Entity-level controls** | Tone at top, governance, risk culture |
| **Process-level controls** | Transaction processing controls |
| **IT general controls (ITGC)** | Access, change management, operations |
| **Application controls** | Automated processing controls |
| **Manual controls** | Human-performed control activities |
| **Preventive controls** | Designed to prevent misstatement |
| **Detective controls** | Designed to detect misstatement |

### 57.4 Control Severity

| Severity | Description |
|----------|-------------|
| **Design deficiency** | Control not suitably designed to prevent or detect misstatement |
| **Operating deficiency** | Control suitably designed but not operating effectively |
| **Combined deficiency** | Both design and operating failures |
| **Compensating control** | Alternative control mitigating deficiency — documented |

### 57.5 Deficiency Classification

| Classification | Definition | Typical Reporting |
|----------------|------------|-------------------|
| **Control deficiency** | Shortcoming in design or operation that does not rise to significant deficiency | Internal documentation; may communicate |
| **Significant deficiency** | Important enough to merit attention by those charged with governance | Communicate to governance |
| **Material weakness** | Reasonable possibility that material misstatement will not be prevented or detected | Communicate to governance; opinion impact assessment |

Classification is **professional judgment** — Audit Manager proposes; Engagement Partner approves significant deficiency and material weakness classifications.

### 57.6 COSO Mapping

| COSO Component | Mapping |
|----------------|---------|
| **Control environment** | Tone, integrity, ethics, board oversight |
| **Risk assessment** | Entity risk identification and assessment |
| **Control activities** | Policies and procedures mitigating risk |
| **Information and communication** | Financial reporting information systems |
| **Monitoring activities** | Ongoing and separate evaluations |

Each deficiency mapped to **one or more COSO components** — supports ICFR documentation structure.

### 57.7 SOX Readiness

| Capability | Platform Support |
|------------|------------------|
| **ICFR documentation** | Control and deficiency records structured for SOX programs |
| **Deficiency classification** | Material weakness and significant deficiency taxonomy |
| **Management assessment support** | Deficiency data exportable for management reporting |
| **Audit trail** | Immutable deficiency and classification history |
| **Segregation of duties** | Preparer-reviewer separation on deficiency evaluation |

Platform **supports** SOX compliance programs — does not perform management's ICFR assessment or auditor's SOX attestation (PROJECT_BIBLE §26.5).

### 57.8 Financial Statement Assertions

| Assertion | Deficiency Impact |
|-----------|-------------------|
| **Existence / Occurrence** | Deficiency may allow fictitious transactions |
| **Completeness** | Deficiency may allow unrecorded transactions |
| **Accuracy / Valuation** | Deficiency may allow measurement errors |
| **Cut-off** | Deficiency may allow period misclassification |
| **Classification** | Deficiency may allow improper classification |
| **Presentation / Disclosure** | Deficiency may allow disclosure failures |

Affected assertions documented per deficiency.

### 57.9 Linked Risks

| Linkage | Product Behavior |
|---------|------------------|
| **Control risk** | Deficiency increases assessed control risk |
| **Inherent risk** | Combined risk assessment updated |
| **Significant risk** | Material weakness may indicate significant risk area |
| **Reassessment** | Deficiency may trigger risk reassessment version |
| **Procedure response** | Additional substantive procedures documented |

### 57.10 Linked Procedures

| Linkage | Product Behavior |
|---------|------------------|
| **Test of controls** | Deficiency identified from control test working paper |
| **Walkthrough** | Design deficiency from walkthrough documentation |
| **Substantive procedure** | Compensating substantive work linked |
| **Procedure impact** | Control reliance withdrawn — documented in strategy |

### 57.11 Linked Evidence

| Linkage | Requirement |
|---------|-------------|
| **Test results** | Control test evidence linked to deficiency |
| **Walkthrough documentation** | Process narrative and control identification |
| **Exception detail** | Specific control failure instances documented |
| **Blocking** | Deficiency record blocked without evidence linkage |

### 57.12 Review Workflow

| Step | Actor | Action |
|------|-------|--------|
| **Document** | Auditor | Record deficiency from control test |
| **Submit** | Auditor | Submit for manager evaluation |
| **Classify** | Audit Manager | Propose deficiency classification |
| **Review** | Engagement Partner | Approve significant deficiency and material weakness |
| **Communicate** | Engagement Partner | Authorize governance communication |

### 57.13 Approval Workflow

| Classification | Approver |
|----------------|----------|
| **Control deficiency** | Audit Manager |
| **Significant deficiency** | Engagement Partner |
| **Material weakness** | Engagement Partner mandatory |
| **Reclassification** | Partner approval for upgrade; Manager for downgrade with Partner visibility |
| **Attribution** | Recorded per APR-05 |

### 57.14 Permissions

| Capability | Engagement Partner | Audit Manager | Audit Senior | Auditor |
|------------|-------------------|---------------|--------------|---------|
| Create deficiency | Yes | Yes | Yes | Yes |
| Classify deficiency | Approve significant+ | Propose | No | No |
| Approve classification | Yes | Deficiency only | No | No |
| Link risks/procedures | Yes | Yes | Yes | Yes |
| View deficiencies | Assigned team | Assigned team | Assigned team | Assigned team |
| Export for SOX reporting | Yes | Yes | No | No |

### 57.15 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **CTL-AC-01** | Deficiency creatable from control test working paper |
| **CTL-AC-02** | Three-tier classification supported |
| **CTL-AC-03** | COSO component mapping required |
| **CTL-AC-04** | Partner approval required for significant deficiency and material weakness |
| **CTL-AC-05** | Affected assertions documented |
| **CTL-AC-06** | Evidence linkage mandatory |
| **CTL-AC-07** | Linked risk and procedure references functional |
| **CTL-AC-08** | Deficiency links to audit finding where applicable |
| **CTL-AC-09** | SOX-ready export format supported |
| **CTL-AC-10** | Reclassification creates versioned update |

---

## 58. Management Response & Remediation

Management Response & Remediation governs **client acknowledgment, corrective action planning, and verification** for communicated findings and control deficiencies.

*Constitutional basis: PROJECT_BIBLE Part 8 Finding lifecycle; Workflow 21 management responses; Governance module references.*

### 58.1 Purpose

Track **management responses, remediation action plans, and closure verification** for audit findings and control deficiencies — providing governance visibility from identification through resolution.

### 58.2 Business Goals

| Goal | Description |
|------|-------------|
| **Management accountability** | Documented client response to findings |
| **Remediation discipline** | Action plans with owners and target dates |
| **Progress visibility** | Real-time remediation status for audit and governance teams |
| **Verification** | Auditor confirms remediation effectiveness where required |
| **Governance reporting** | Audit committee visibility into open remediation |
| **Closure discipline** | Findings closed only when criteria met |

### 58.3 Management Response

| Element | Product Requirement |
|---------|---------------------|
| **Acknowledgment** | Management acknowledges finding receipt |
| **Agreement** | Agree, partially agree, or disagree — with rationale |
| **Corrective intent** | Statement of intended corrective action |
| **Timeline proposal** | Management-proposed remediation timeline |
| **Responsible party** | Named management owner |
| **Documentation** | Response recorded in platform — not offline only |
| **Client portal** | Client User submits response through governed channel |
| **Versioning** | Response amendments versioned |

### 58.4 Action Plans

| Element | Product Requirement |
|---------|---------------------|
| **Actions** | Specific corrective steps defined |
| **Owner** | Named responsible individual |
| **Target date** | Completion deadline |
| **Priority** | Aligned with finding severity |
| **Dependencies** | Linked actions and prerequisites |
| **Resources** | Required resources noted where applicable |
| **Approval** | Audit Manager acknowledges action plan adequacy |

### 58.5 Responsible Owners

| Owner Type | Scope |
|------------|-------|
| **Management owner** | Client responsible for remediation execution |
| **Audit owner** | Engagement team member tracking remediation |
| **Governance owner** | Audit committee oversight contact optional |
| **Notification** | Owners notified of assignments and due dates |
| **Escalation** | Overdue actions escalate to CFO and Partner |

### 58.6 Target Dates

| Aspect | Product Behavior |
|--------|------------------|
| **Initial date** | Set at action plan creation |
| **Extension** | Extension requires documented rationale and auditor acknowledgment |
| **Milestone dates** | Intermediate milestones for multi-step remediation |
| **Engagement vs post-engagement** | Remediation may continue after engagement closure — tracked |
| **Alert** | Approaching and overdue date notifications |

### 58.7 Progress Tracking

| Status | Meaning |
|--------|---------|
| **Not started** | Action plan approved — execution not begun |
| **In progress** | Remediation activities underway |
| **Pending verification** | Management reports complete — awaiting auditor verification |
| **Verified** | Auditor confirmed remediation effective |
| **Overdue** | Past target date without completion |
| **Escalated** | Escalated to senior management or Partner |

Progress updates recorded with date, description, and author.

### 58.8 Remediation Status

| Finding Status | Remediation State |
|----------------|-------------------|
| **Pending management response** | Awaiting client input |
| **Remediation in progress** | Action plan active |
| **Pending verification** | Awaiting auditor re-test |
| **Closed — corrected** | Remediation verified or misstatement adjusted |
| **Closed — uncorrected** | Accepted without correction — Partner approved |
| **Closed — superseded** | Finding withdrawn or replaced |

### 58.9 Verification

| Verification Type | Description |
|-----------------|-------------|
| **Re-performance** | Auditor re-tests control after remediation |
| **Substantive re-test** | Additional substantive procedures on affected area |
| **Management representation** | Written confirmation of remediation — corroborated |
| **Documentation review** | Review of remediation evidence provided by client |
| **Outcome** | Effective, partially effective, ineffective — documented |
| **Linkage** | Verification working paper linked to finding closure |

### 58.10 Closure Criteria

| Criterion | Requirement |
|-----------|-------------|
| **Misstatement corrected** | Adjustment posted and reflected in statements |
| **Deficiency remediated** | Control re-tested and operating effectively |
| **Uncorrected accepted** | Partner approval with documented rationale |
| **Management response complete** | Response recorded for communicated findings |
| **Verification complete** | Auditor verification where required by policy |
| **No open actions** | All action plan items closed |

### 58.11 Permissions

| Capability | Engagement Partner | Audit Manager | Auditor | Client User |
|------------|-------------------|---------------|---------|-------------|
| Request management response | Yes | Yes | Propose | No |
| Submit management response | No | No | No | Yes (assigned) |
| Create action plan | Yes | Yes | Propose | Propose |
| Update progress | Yes | Yes | Yes | Yes (own actions) |
| Verify remediation | Yes | Yes | Yes | No |
| Close finding | Yes | Yes | No | No |
| View remediation dashboard | Assigned team | Assigned team | Assigned | Own items |

### 58.12 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **REM-AC-01** | Client User can submit management response |
| **REM-AC-02** | Action plan creatable with owner and target date |
| **REM-AC-03** | Progress updates recordable with audit trail |
| **REM-AC-04** | Overdue actions generate alerts |
| **REM-AC-05** | Verification outcome linkable to finding closure |
| **REM-AC-06** | Closure blocked without meeting criteria |
| **REM-AC-07** | Extension requires documented rationale |
| **REM-AC-08** | Post-engagement remediation tracking supported |
| **REM-AC-09** | Management disagreement documented with rationale |
| **REM-AC-10** | Remediation status visible on findings dashboard |

---

## 59. Findings Dashboard

The Findings Dashboard provides **engagement and portfolio visibility** into open findings, control deficiencies, remediation status, and opinion-impact metrics.

*Constitutional basis: MASTER_PRD Section 19 Engagement Dashboard; PROJECT_BIBLE Part 13 governance visibility.*

### 59.1 Open Findings

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Findings not in Closed status |
| **View** | Filterable by category, severity, status, assignee |
| **Count** | Open finding count on engagement dashboard |
| **Age** | Days open since identification |
| **Drill-down** | Navigate to finding detail and linked artifacts |

### 59.2 Critical Findings

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Critical severity or material weakness classification |
| **Visibility** | Prominent display — Partner queue |
| **Alert** | Immediate notification to Partner and Manager |
| **Opinion impact** | Opinion impact assessment status displayed |
| **Blocking** | Unresolved critical findings block opinion gate |

### 59.3 Material Findings

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Findings above performance materiality individually or in aggregate |
| **Aggregate view** | Running uncorrected misstatement total vs. overall materiality |
| **Percentage** | Aggregate as percentage of materiality |
| **Partner review** | Material findings in Partner approval queue |
| **Trend** | Material finding count trend over engagement |

### 59.4 Control Deficiencies

| Aspect | Product Behavior |
|--------|------------------|
| **By classification** | Deficiency, significant deficiency, material weakness counts |
| **By COSO component** | Distribution across COSO framework |
| **Open vs closed** | Remediation status breakdown |
| **Linkage** | Drill-down to deficiency detail and evidence |

### 59.5 Outstanding Responses

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Findings awaiting management response |
| **Aging** | Days since communication without response |
| **Alert** | Client and audit team notified at thresholds |
| **Escalation** | Overdue responses escalate to CFO |

### 59.6 Overdue Actions

| Aspect | Product Behavior |
|--------|------------------|
| **Definition** | Remediation actions past target date |
| **View** | By owner, finding, severity |
| **Alert** | Owner and audit team notified |
| **Portfolio** | Firm-wide overdue remediation for governance (future) |

### 59.7 Remediation KPIs

| KPI | Audience | Purpose |
|-----|----------|---------|
| **Open findings count** | Audit Manager | Outstanding evaluation workload |
| **Aggregate uncorrected misstatement** | Engagement Partner | Opinion impact |
| **Material weakness count** | Engagement Partner | Governance communication |
| **Response rate** | Audit Manager | Client responsiveness |
| **Remediation completion %** | Audit Manager | Closure progress |
| **Overdue action count** | Audit Manager | Remediation discipline |
| **Average days to close** | Audit Manager | Cycle efficiency |
| **Verification pending count** | Audit Manager | Re-test backlog |

### 59.8 Executive Summary

| Element | Content |
|---------|---------|
| **Finding overview** | Total findings by category and severity |
| **Materiality summary** | Uncorrected misstatements vs. materiality threshold |
| **Control summary** | Deficiency classification breakdown |
| **Remediation summary** | Open actions, overdue items, completion rate |
| **Opinion indicators** | Factors potentially affecting opinion type |
| **Audience** | Engagement Partner, Audit Manager, audit committee (governance grant) |
| **Export** | Executive summary exportable for governance meetings |

### 59.9 Business Rules

| Rule | Description |
|------|-------------|
| **FND-R01** | Aggregate misstatement recalculated on finding change |
| **FND-R02** | Critical findings notify Partner immediately |
| **FND-R03** | Material aggregate exceeding materiality escalates to Partner |
| **FND-R04** | Outstanding responses alert at configurable threshold |
| **FND-R05** | Overdue remediation escalates to CFO and Partner |
| **FND-R06** | Opinion gate blocked with unevaluated material findings (OPN-02) |
| **FND-R07** | Dashboard distinguishes audit findings from AI findings |
| **FND-R08** | Executive summary requires Manager authorization to share externally |

### 59.10 Permissions

| Capability | Engagement Partner | Audit Manager | Audit Senior | Auditor | Client User |
|------------|-------------------|---------------|--------------|---------|-------------|
| View findings dashboard | Yes | Yes | Yes | Assigned | Communicated items |
| View executive summary | Yes | Yes | No | No | No |
| View aggregate misstatement | Yes | Yes | Yes | Read | No |
| Configure alerts | Yes | Yes | No | No | No |
| Export dashboard | Yes | Yes | No | No | No |
| Governance view | Per grant | Per grant | No | No | Own responses |

### 59.11 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **FDB-AC-01** | Dashboard shows open findings by severity |
| **FDB-AC-02** | Aggregate misstatement vs. materiality displayed |
| **FDB-AC-03** | Critical findings in Partner queue |
| **FDB-AC-04** | Control deficiency breakdown by classification |
| **FDB-AC-05** | Outstanding management responses listed with aging |
| **FDB-AC-06** | Overdue remediation actions alerted |
| **FDB-AC-07** | Executive summary generatable |
| **FDB-AC-08** | Audit findings distinguished from AI findings |
| **FDB-AC-09** | Dashboard export supported |
| **FDB-AC-10** | KPIs update on finding status change |

---

## 60. User Journey — Findings to AI Audit Analysis Readiness

End-to-end experience from **signed-off working papers** through **evaluated findings, management responses, and remediation plans** — ready for AI-assisted completion analysis and opinion preparation.

*Continues MASTER_PRD Part 11 Section 55 — Ready for Findings Assessment milestone.*

### 60.1 Journey Overview

```
Working Papers Approved → Finding Created → Evidence Linked → Manager Review
    → Partner Review → Management Response → Remediation Plan → Ready for AI Audit Analysis
```

**Primary actors:** Auditor (identify), Audit Manager (evaluate), Engagement Partner (approve), Client User (respond). **Prerequisite:** Documentation substantially complete (Part 11).

### 60.2 Step 1 — Working Papers Approved

| Perspective | Audit Manager |
|-------------|---------------|
| **State** | Required working papers signed off; exceptions documented |
| **Action** | Open **Findings Evaluation** from engagement dashboard |
| **Source** | Working paper exceptions pre-populated as finding candidates |
| **Aggregate** | Misstatement summary initialized from exception data |

**User sees:** Findings workspace with exception import list and **Ready for Findings Assessment** milestone active.

### 60.3 Step 2 — Finding Created

| Perspective | Auditor |
|-------------|---------|
| **Action** | Select working paper exception → **Create Finding** |
| **Input** | Category, amount, description, affected account and assertion |
| **Control** | Control test failure → creates linked deficiency record (Section 57) |
| **Severity** | System suggests severity from amount vs. materiality — Auditor confirms |
| **Draft** | Finding saved as Draft pending evidence linkage |

**User sees:** Finding form pre-populated from working paper exception data.

### 60.4 Step 3 — Evidence Linked

| Perspective | Auditor |
|-------------|---------|
| **Action** | Link supporting evidence and working paper |
| **Auto-link** | Source working paper and evidence auto-referenced |
| **Cross-ref** | Additional evidence linked if supplementary |
| **Validation** | Submission enabled when linkage complete |
| **Submit** | Submit finding for manager evaluation |

**User sees:** Evidence panel green; finding status **Pending evaluation**.

### 60.5 Step 4 — Manager Review

| Perspective | Audit Manager |
|-------------|---------------|
| **Evaluate** | Review amount, category, classification, materiality impact |
| **Aggregate** | Update running uncorrected misstatement summary |
| **Deficiency** | Confirm or upgrade control deficiency classification |
| **Return** | Return to Auditor with comments if insufficient |
| **Escalate** | Material findings escalated to Partner queue |
| **Approve** | Approve non-significant findings |

**User sees:** Manager evaluation queue with aggregate misstatement gauge vs. materiality.

### 60.6 Step 5 — Partner Review

| Perspective | Engagement Partner |
|-------------|-------------------|
| **Queue** | Material misstatements, significant deficiencies, material weaknesses |
| **Opinion impact** | Assess individual and aggregate impact on opinion |
| **Approve** | Approve findings for management communication |
| **Uncorrected** | Document acceptance rationale for uncorrected misstatements |
| **Communicate** | Authorize findings for management letter inclusion |

**User sees:** Partner findings queue with opinion impact indicators.

### 60.7 Step 6 — Management Response

| Perspective | Client User (CFO); Audit Manager |
|-------------|----------------------------------|
| **Request** | Manager sends finding to client through governed portal |
| **Response** | CFO acknowledges, agrees or disagrees, proposes corrective action |
| **Timeline** | Management proposes remediation timeline |
| **Record** | Response versioned in platform |
| **Disagreement** | Documented with rationale — auditor evaluates |

**User sees:** Client portal finding response form; audit team sees response status **Received**.

### 60.8 Step 7 — Remediation Plan

| Perspective | Audit Manager; Client User |
|-------------|---------------------------|
| **Plan** | Action items with owners and target dates |
| **Acknowledge** | Manager acknowledges plan adequacy |
| **Track** | Progress updates from management owner |
| **Verify** | Auditor schedules re-test for control deficiencies |
| **Close** | Finding closed when closure criteria met |

**User sees:** Remediation tracker with action status and overdue indicators.

### 60.9 Step 8 — Ready for AI Audit Analysis

| Milestone | Criteria |
|-----------|----------|
| **Findings evaluated** | All exceptions evaluated and approved |
| **Aggregate assessed** | Uncorrected misstatement summary complete |
| **Responses recorded** | Management responses obtained for communicated findings |
| **Remediation tracked** | Action plans documented for required items |
| **Opinion readiness** | Opinion impact factors documented |
| **Next workflow** | AI-assisted completion analysis, going concern, opinion drafting (Workflow 17) |

| Perspective | Audit Manager |
|-------------|---------------|
| **Action** | Initiate AI Audit Analysis on completion scope — anomalies, aggregate review, draft completion checklists |
| **AI boundary** | AI surfaces patterns and drafts — Manager and Partner conclude |
| **Engagement** | Status advances toward Completion phase |

**User sees:** Engagement dashboard milestone — **Ready for AI Audit Analysis** — AI completion analysis and opinion preparation enabled.

*AI Finding disposition (accept/reject) remains separate from audit finding evaluation — AI analysis may reference both (PROJECT_BIBLE Part 4 Section 20).*

### 60.10 Journey Diagram

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│    Working       │───►│    Finding       │───►│    Evidence      │
│ Papers Approved  │    │    Created       │    │     Linked       │
└──────────────────┘    └──────────────────┘    └────────┬─────────┘
                                                         │
┌──────────────────┐    ┌──────────────────┐    ┌──────▼───────────┐
│     Ready for    │◄───│  Remediation     │◄───│    Partner       │
│  AI Audit        │    │     Plan         │    │     Review       │
│   Analysis       │    └────────┬─────────┘    └────────┬─────────┘
└──────────────────┘             │              ┌────────▼─────────┐
                                 │              │     Manager      │
                                 └──────────────│     Review       │
                        ┌──────────────────┐   └──────────────────┘
                        │   Management     │
                        │    Response      │
                        └──────────────────┘
```

### 60.11 Journey Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **FJ-AC-01** | Finding creatable from working paper exception |
| **FJ-AC-02** | Full evaluate → approve journey completable |
| **FJ-AC-03** | Client can submit management response |
| **FJ-AC-04** | Remediation plan with tracking functional |
| **FJ-AC-05** | Aggregate misstatement updates throughout journey |
| **FJ-AC-06** | Partner queue surfaces material findings |
| **FJ-AC-07** | Ready for AI Audit Analysis milestone displayed |

---

## PRD Review Notes — Part 12

Consistency review of MASTER_PRD Part 12 against PROJECT_BIBLE (Parts 1–15) and MASTER_PRD Parts 1–11. No previous sections modified.

### Constitutional Alignment

| Area | Status | Notes |
|------|--------|-------|
| Part 8 Finding entity | Aligned | Section 56 |
| Part 8 Control entity | Aligned | Section 57 |
| Part 15 §78 Findings Evaluation | Aligned | Sections 56, 60 |
| Workflow 21 Management Letter | Aligned | Section 56 — inputs for future part |
| Part 2 §26.4 COSO | Aligned | Section 57.6 |
| Part 2 §26.5 SOX Readiness | Aligned | Section 57.7 |
| Glossary §42.8 Controls | Aligned | Section 57 classifications |
| OPN-02 Opinion gate | Aligned | Sections 56, 59 |
| AE-01 Evidence linkage | Aligned | Section 56.10 |

### MASTER_PRD Parts 1–11 Alignment

| Area | Status |
|------|--------|
| Part 11 §55 Ready for Findings Assessment | Section 60 continues |
| Section 43 exceptions → findings | Section 56.3, 60.2 |
| Section 19 Dashboard findings widgets | Section 59 |
| Part 8 materiality | Section 56.6 aggregate assessment |
| AI Finding vs Audit Finding | Section 56 terminology note; Section 59 FND-R07 |
| PRD11-02 Findings module | Addressed — Part 12 |
| PRD11-03 Control deficiencies | Addressed — Section 57 |

### Terminology Consistency

| Term | Status |
|------|--------|
| Audit Finding vs AI Finding | Explicitly distinguished — Section 56 |
| Misstatement types | Factual, projected, judgmental — Section 56.4 |
| Control deficiency / significant deficiency / material weakness | Section 57.5 — glossary aligned |
| COSO components | Section 57.6 — Bible §26.4 |
| Remediation vs management response | Section 58 — distinct concepts |
| Uncorrected misstatement | Section 56.6, 59.3 |

### Governance & Review Chain

| Area | Status |
|------|--------|
| Auditor identify → Manager evaluate → Partner approve | Sections 56, 60 |
| Material finding Partner mandatory | FND-V03, FND-AC-05 |
| Management response via client portal | Section 58 |
| Opinion gate with open material findings | OPN-02, FND-R06 |
| APR-03 escalation for material items | Section 56.13 |

### Traceability

| Area | Status |
|------|--------|
| Finding → working paper → evidence | Section 56.10 |
| Finding → control deficiency | Sections 56, 57 |
| Finding → financial statement line | Section 56.10 |
| Cross-reference engine integration | References Part 11 Section 53 |

### Editorial Recommendations

| ID | Recommendation |
|----|----------------|
| **PRD12-01** | Management Letter Generation (Workflow 21) — Part 13 |
| **PRD12-02** | Audit Opinion module — opinion type selection and uncorrected misstatement linkage |
| **PRD12-03** | AI Audit Analysis (Workflow 17) — expand completion-phase AI specification |
| **PRD12-04** | Journal adjustment workflow — link corrected misstatements to adjustments (PRD7-01, PRD8-02) |
| **PRD12-05** | Governance / audit committee dashboard — portfolio remediation view |
| **PRD12-06** | Going concern assessment module — link going concern indicators from findings |
| **PRD12-07** | Key Audit Matters — significant finding to KAM mapping for listed entities |
| **PRD12-08** | AI Finding to Audit Finding conversion workflow — formalize linkage rules |

### Review Conclusion

MASTER_PRD Part 12 is **consistent with PROJECT_BIBLE and Parts 1–11**. It specifies findings management, control deficiencies, remediation, and dashboard visibility as governed assurance workflows without contradicting materiality discipline, evidence linkage, or approval philosophy. PRD12-01 through PRD12-08 guide subsequent PRD parts.

---

## Document Control — Part 12

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.12.0 | 2026-06-30 | Chief Product Officer | Part 12 — Findings, Control Deficiencies & Remediation complete; PRD Review Notes Part 12 included |

---

*End of Part 12.*

---

# Sprint 4 — AI, Governance, Opinion, Executive Reporting & Export

*MASTER_PRD Parts 13–17*

---

## Part 13 — AI Auditor & AI Copilot

### Table of Contents — Part 13

61. [AI Auditor](#61-ai-auditor)
62. [AI Knowledge Copilot](#62-ai-knowledge-copilot)

---

## 61. AI Auditor

The AI Auditor capability governs **AI-assisted completion-phase and fieldwork analysis** — evidence-cited analytical outputs that accelerate professional work while preserving human accountability.

*Constitutional basis: PROJECT_BIBLE Part 3 Workflow 17; Part 4 Sections 19–20; Business Rules AI-01 through AI-05.*

### 61.1 AI Audit Analysis

| Aspect | Product Behavior |
|--------|------------------|
| **Purpose** | Execute scoped AI analysis on engagement data, documents, and populations |
| **Trigger** | Auditor or Audit Manager requests analysis on defined scope |
| **Scope** | Account, document set, transaction population, audit area, or completion package |
| **Processing** | Permission-filtered RAG retrieval → analysis → cited output → human disposition |
| **Output** | AI analysis report with citations, confidence, limitations |
| **Boundary** | Analysis is proposal — not audit conclusion (AI-01) |

### 61.2 Executive Summary

| Element | Content |
|---------|---------|
| **Engagement overview** | Status, materiality, key risks, completion progress |
| **Finding summary** | Open, material, and uncorrected misstatement highlights |
| **Documentation status** | Working paper and lead sheet completion |
| **Opinion indicators** | Factors potentially affecting opinion type |
| **Recommendations** | AI-suggested focus areas for Partner review — advisory |
| **Audience** | Audit Manager and Engagement Partner |

### 61.3 Risk Analysis

| Analysis | Description |
|----------|-------------|
| **Risk coverage** | Assessed risks vs. completed procedures |
| **Unaddressed risks** | Significant risks without cleared procedures |
| **Risk change** | Rating changes from planning to completion |
| **Fraud risk** | Fraud factor indicators from data patterns — advisory |
| **Linkage** | References risk assessment version (Part 8) |

### 61.4 Financial Analysis

| Analysis | Description |
|----------|-------------|
| **Statement-level** | Key line item movements and composition |
| **Account-level** | Material account balance analysis |
| **Estimate areas** | Fair value, impairment, provisions flagged |
| **Related party** | Related party transaction patterns |
| **Source** | Approved financial statements and trial balance |

### 61.5 Trend Analysis

| Aspect | Product Behavior |
|--------|------------------|
| **Periods** | Multi-period comparison from validated financial data |
| **Visualization** | Trend lines with narrative explanation |
| **Anomalies** | Unusual trend breaks flagged with cited data points |
| **AI boundary** | Trends computed and narrated — auditor investigates conclusions |

### 61.6 Variance Analysis

| Aspect | Product Behavior |
|--------|------------------|
| **Budget / forecast** | Variance to budget where data available |
| **Prior period** | Period-over-period variance with thresholds |
| **Expectation** | Auditor or AI-stated expectation vs. actual |
| **Investigation** | Unexplained material variances flagged for follow-up |
| **Linkage** | Analytical working papers may reference analysis |

### 61.7 Ratio Analysis

| Ratio Category | Examples |
|----------------|----------|
| **Liquidity** | Current ratio, quick ratio, cash ratio |
| **Profitability** | Gross margin, net margin, ROA, ROE |
| **Leverage** | Debt-to-equity, interest coverage |
| **Efficiency** | Asset turnover, receivables days, inventory days |
| **Industry** | Benchmark comparison where configured |
| **Citation** | Every ratio cites source accounts and periods |

### 61.8 Liquidity Analysis

| Aspect | Product Behavior |
|--------|------------------|
| **Cash position** | Cash and equivalents trend and composition |
| **Working capital** | Current assets vs. current liabilities movement |
| **Covenant indicators** | Configured covenant ratio monitoring — advisory |
| **Going concern link** | Liquidity stress feeds going concern indicators |

### 61.9 Going Concern Indicators

| Indicator Type | Examples |
|----------------|----------|
| **Financial** | Negative equity, net liability, adverse ratios |
| **Operational** | Loss of major customer, regulatory action |
| **Finding-linked** | Going concern category findings (Part 12) |
| **Assessment** | AI surfaces indicators — Partner assesses going concern |
| **Documentation** | Indicators link to supporting evidence and papers |

### 61.10 Fraud Indicators

| Aspect | Product Behavior |
|--------|------------------|
| **Patterns** | Unusual journal entries, round amounts, period-end spikes |
| **Revenue recognition** | Side agreement indicators from document analysis |
| **Management override** | Privileged access transaction patterns — advisory |
| **Boundary** | AI does not conclude on fraud — surfaces for brainstorming (ISA 240) |
| **Linkage** | May create AI Finding for human disposition |

### 61.11 AI Recommendations

| Recommendation Type | Description |
|---------------------|-------------|
| **Additional procedures** | Suggested procedures for uncovered areas — advisory |
| **Review focus** | Areas warranting heightened reviewer attention |
| **Finding evaluation** | Suggested misstatement aggregation review |
| **Documentation gaps** | Missing papers or evidence flagged |
| **Acceptance** | Recommendations accepted, rejected, or deferred — logged |

### 61.12 Confidence Score

| Level | Meaning |
|-------|---------|
| **High** | Strong evidence basis; multiple corroborating sources |
| **Medium** | Reasonable evidence; some inference required |
| **Low** | Weak or incomplete evidence; thorough human verification required |
| **Display** | Always shown alongside AI outputs |
| **Boundary** | Confidence informs — does not replace judgment |

### 61.13 Explainability

| Element | Requirement |
|---------|-------------|
| **Citations** | Every substantive output cites source documents or data (AI-02) |
| **Methodology** | Analysis approach described in output |
| **Limitations** | Known limitations and exclusions stated |
| **Data scope** | What was searched and permission-filtered |
| **Reasoning chain** | Step-by-step logic visible to user |
| **Retrieval context** | Sources retrieved displayed for verification |

### 61.14 Human Validation

| Disposition | Requirement |
|-------------|-------------|
| **Accept** | Professional confirms validity; accountability transferred |
| **Reject** | Rationale recorded — retained in audit trail (AI-05) |
| **Defer** | Owner and target date assigned |
| **Escalate** | Routed to senior with notification |
| **Incorporate** | Accepted output linked to working paper or finding |
| **Blocking** | Unaccepted substantive AI outputs cannot auto-enter conclusions |

### 61.15 AI Governance

| Principle | Application |
|-----------|-------------|
| **Advisory only** | AI never approves, signs off, or issues opinions (AI-01) |
| **Scope boundary** | Permission-filtered data only (AI-04) |
| **Full logging** | All interactions logged (AI-03) |
| **Citation mandatory** | No uncited assertions in professional context (AI-02) |
| **Human accountability** | Professional named on accepted conclusions |
| **Inspection readiness** | AI involvement visible in engagement file |

### 61.16 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **AIA-AC-01** | Scoped AI analysis executable on engagement data |
| **AIA-AC-02** | All analysis types produce cited outputs |
| **AIA-AC-03** | Confidence score displayed on every substantive output |
| **AIA-AC-04** | Limitations section included in analysis reports |
| **AIA-AC-05** | Accept/reject/defer/escalate disposition functional |
| **AIA-AC-06** | Rejected outputs retained with rationale |
| **AIA-AC-07** | AI cannot mark procedures complete or issue opinion |
| **AIA-AC-08** | Analysis restricted to user permission scope |
| **AIA-AC-09** | Full interaction audit trail exportable |
| **AIA-AC-10** | Accepted analysis linkable to working paper |

---

## 62. AI Knowledge Copilot

The AI Knowledge Copilot provides a **unified conversational interface** for evidence-cited professional inquiry across engagement data, firm knowledge, and standards.

*Constitutional basis: PROJECT_BIBLE Part 3 Workflow 24; Part 4 Sections 19.3, 22; Business Rules AI-01 through AI-05.*

### 62.1 IFRS Questions

| Aspect | Product Behavior |
|--------|------------------|
| **Scope** | IFRS recognition, measurement, presentation, disclosure |
| **Sources** | Firm knowledge base, IFRS knowledge framework, engagement financial data |
| **Output** | Cited answers with standard paragraph references where available |
| **Boundary** | Complex matters directed to full standard reading |
| **Linkage** | Answers linkable to engagement context |

### 62.2 ISA Questions

| Aspect | Product Behavior |
|--------|------------------|
| **Scope** | Audit planning, evidence, sampling, reporting, ethics |
| **Sources** | Firm methodology, ISA knowledge base, engagement file context |
| **Output** | Cited guidance with methodology template references |
| **Boundary** | Not substitute for firm quality standards in material matters |

### 62.3 Accounting Questions

| Aspect | Product Behavior |
|--------|------------------|
| **Scope** | General accounting concepts, policies, estimates |
| **Context** | Entity financial data and classification where relevant |
| **Output** | Cited answers grounded in engagement or knowledge base |

### 62.4 Audit Questions

| Aspect | Product Behavior |
|--------|------------------|
| **Scope** | Engagement-specific audit methodology and file questions |
| **Context** | Permission-filtered engagement data and documentation |
| **Output** | Cited answers with document and data references |

### 62.5 Evidence Search

| Aspect | Product Behavior |
|--------|------------------|
| **Capability** | Natural language search across engagement evidence repository |
| **Results** | Ranked documents with relevance and preview |
| **Citation** | Each result cites source document and location |
| **Scope** | Engagement-bound; permission-filtered |
| **Linkage** | User can link retrieved document to working paper |

### 62.6 Citation Engine

| Requirement | Application |
|-------------|-------------|
| **Mandatory citations** | Substantive answers include source references (AI-02) |
| **Source types** | Documents, data points, knowledge chunks, standard excerpts |
| **Navigation** | Click-through to source |
| **Insufficient evidence** | "Insufficient evidence" response when no sources retrieved |
| **No hallucination** | Parametric knowledge not sole basis for financial conclusions |

### 62.7 Formula Explanation

| Aspect | Product Behavior |
|--------|------------------|
| **Scope** | Explain materiality, ratio, sampling, and analytical formulas |
| **Context** | Engagement-specific values where applicable |
| **Output** | Step-by-step calculation with cited inputs |
| **Educational** | Supports junior staff learning firm methodology |

### 62.8 Cross References

| Reference | Capability |
|-----------|------------|
| **Engagement artifacts** | Navigate to working papers, findings, statements |
| **Knowledge documents** | Link to firm guidance and precedents |
| **Standards** | Reference IFRS/ISA excerpts |
| **Bidirectional** | From answer to source and source to usage |

### 62.9 Multi-language Support

| Aspect | Product Behavior |
|--------|------------------|
| **User locale** | Responses in user's configured language (Part 2) |
| **Standards** | IFRS/ISA authoritative text may include bilingual reference |
| **Terminology** | ISA and IFRS terms translated per locale standards |
| **Documents** | Engagement documents in original language with summary in locale |

### 62.10 Conversation Memory

| Scope | Behavior |
|-------|----------|
| **Session memory** | Current conversation context retained within session |
| **Engagement context** | Explicit engagement scope maintained |
| **No cross-engagement** | Memory does not leak across engagements |
| **Persistence** | Session logged; memory cleared on session end |
| **Boundary** | Not long-term memory across unrelated sessions |

### 62.11 AI Limitations

| Limitation | Communication |
|------------|---------------|
| **Not professional advice** | Copilot assists — professional judgment required |
| **Permission scope** | Cannot access out-of-scope data |
| **Not approval** | Answers do not constitute review or sign-off |
| **Material matters** | Complex matters require full document review |
| **Currency** | Superseded guidance flagged — human verifies |
| **Display** | Limitations shown with every substantive response |

### 62.12 Human Escalation

| Trigger | Action |
|---------|--------|
| **Low confidence** | Suggest escalation to senior |
| **User request** | Escalate question to Engagement Partner or methodology team |
| **Out of scope** | Direct to firm expert or knowledge owner |
| **Material matter** | Prompt full standards review |
| **Record** | Escalation logged with rationale |

### 62.13 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **COP-AC-01** | Natural language questions answerable in engagement context |
| **COP-AC-02** | IFRS and ISA questions return cited responses |
| **COP-AC-03** | Evidence search returns permission-filtered results |
| **COP-AC-04** | Answers without citations blocked for substantive questions |
| **COP-AC-05** | Formula explanations show calculation steps |
| **COP-AC-06** | Multi-language responses per user locale |
| **COP-AC-07** | Session conversation context maintained |
| **COP-AC-08** | Limitations displayed on substantive responses |
| **COP-AC-09** | Escalation pathway functional |
| **COP-AC-10** | Full interaction log exportable |

---

## Part 14 — Governance & Approvals

### Table of Contents — Part 14

63. [Governance Module](#63-governance-module)
64. [Review Workflow](#64-review-workflow)
65. [Approval Workflow](#65-approval-workflow)
66. [Sign-off Management](#66-sign-off-management)
67. [Decision History](#67-decision-history)

---

## 63. Governance Module

The Governance Module provides **cross-cutting oversight infrastructure** for review, approval, sign-off, and decision traceability across all platform artifacts.

*Constitutional basis: PROJECT_BIBLE Part 3 Workflow 19; Business Rules APR-01 through APR-05; Part 8 Governance domain.*

### 63.1 Purpose

Unify **professional oversight workflows** — ensuring every significant artifact passes through defined review, approval, and sign-off chains without bypass.

### 63.2 Business Goals

| Goal | Description |
|------|-------------|
| **Non-bypassable chains** | Approval routes cannot be short-circuited (APR-01) |
| **Separation of duties** | Preparer cannot approve own work (APR-02) |
| **Escalation discipline** | Material items route to senior professionals (APR-03) |
| **Audit trail** | Every decision attributed and timestamped (APR-05) |
| **Consistency** | Uniform governance across audit, reporting, and export |
| **Inspection readiness** | Complete decision history for quality review |

### 63.3 Lifecycle

```
Prepare → Submit → Review → Approve / Reject → Sign-off → Lock → (Revise → Re-submit)
```

Governance lifecycle applies to artifacts: working papers, financial statements, opinions, management letters, exports, materiality, findings, and adjustments.

### 63.4 Versioning

| Principle | Application |
|-----------|-------------|
| **Version at submission** | Each submission references artifact version |
| **Post-approval lock** | Approved artifacts immutable — new version for changes |
| **Re-approval** | Modifications require new approval cycle |
| **Decision binding** | Approvals reference specific version (VER-03) |

### 63.5 Permissions

| Capability | Organization Owner | Engagement Partner | Audit Manager | CFO |
|------------|-------------------|-------------------|---------------|-----|
| Configure approval chains | Yes | Propose | Propose | No |
| Override rejection | Yes (exceptional) | Documented | No | No |
| View decision history | Yes | Assigned | Assigned | Reporting scope |
| Waive gate (exceptional) | Yes | Partner + Owner | No | No |

### 63.6 Business Rules

| Rule | Description |
|------|-------------|
| **GOV-R01** | Approval chains non-bypassable (APR-01) |
| **GOV-R02** | Self-approval prohibited (APR-02) |
| **GOV-R03** | Rejection requires rationale (APR-04) |
| **GOV-R04** | All approvals timestamped and attributed (APR-05) |
| **GOV-R05** | Material items escalate per thresholds (APR-03) |
| **GOV-R06** | Approved artifacts locked until new version |
| **GOV-R07** | Exceptional waives require Organization Owner record |

### 63.7 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **GOV-AC-01** | Governance lifecycle applicable across artifact types |
| **GOV-AC-02** | Self-approval blocked |
| **GOV-AC-03** | Rejection requires documented comments |
| **GOV-AC-04** | Decision history searchable by artifact |
| **GOV-AC-05** | Approved artifact version locked |

---

## 64. Review Workflow

Review Workflow governs **structured professional challenge** of artifacts before approval — distinct from operational sign-off.

*Constitutional basis: PROJECT_BIBLE Part 3 Workflow 18; Part 15 Section 80; Business Rules WP-01, WP-05.*

### 64.1 Purpose

Ensure artifacts meet **quality standards** through documented reviewer challenge, comment resolution, and clearance.

### 64.2 Business Goals

| Goal | Description |
|------|-------------|
| **Quality gate** | Review before approval on significant artifacts |
| **Professional skepticism** | Review notes challenge conclusions |
| **Issue resolution** | Comments resolved before advancement |
| **Multi-level review** | Senior → Manager → Partner as applicable |
| **Blocking discipline** | Uncleared blocking notes prevent sign-off (WP-05) |

### 64.3 Lifecycle

```
Submit → Review Assigned → Comments Recorded → Preparer Responds → Cleared → Advance to Approval
              ↑                                    ↓
         Returned ←────────────────────────── Unresolved
```

### 64.4 Versioning

Review cycles bound to artifact version; new artifact version may reset or inherit open notes per policy.

### 64.5 Permissions

| Capability | Engagement Partner | Audit Manager | Audit Senior | Preparer |
|------------|-------------------|---------------|--------------|----------|
| Submit for review | Yes | Yes | Yes | Yes |
| Review / comment | Yes | Yes | Yes | No |
| Clear review notes | Yes | Yes | Yes | No |
| Return artifact | Yes | Yes | Yes | No |

### 64.6 Business Rules

| Rule | Description |
|------|-------------|
| **REV-R01** | Preparer cannot clear own review notes as reviewer |
| **REV-R02** | Blocking notes prevent sign-off (WP-05) |
| **REV-R03** | Review thread preserved — not deleted on clearance |
| **REV-R04** | Review severity: informational, required, blocking |
| **REV-R05** | Independent reviewer path separate from engagement team |

### 64.7 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **REV-AC-01** | Multi-level review configurable per artifact type |
| **REV-AC-02** | Comment threads with severity supported |
| **REV-AC-03** | Blocking notes prevent advancement |
| **REV-AC-04** | Return workflow resets or holds approval |
| **REV-AC-05** | Review history preserved immutably |

---

## 65. Approval Workflow

Approval Workflow governs **formal authorization** of artifacts through defined chains.

*Constitutional basis: PROJECT_BIBLE Part 3 Workflow 19; Business Rules APR-01 through APR-05, RPT-01.*

### 65.1 Purpose

Route artifacts through **configured, non-bypassable approval chains** appropriate to artifact type and materiality.

### 65.2 Business Goals

| Goal | Description |
|------|-------------|
| **Authorization integrity** | Only authorized outputs reach stakeholders |
| **Role-appropriate chains** | CFO for statements; Partner for opinions |
| **Materiality escalation** | Threshold-based routing (APR-03) |
| **Rejection discipline** | Documented return to preparer (APR-04) |
| **Lock on approval** | Approved artifacts immutable (RPT-02) |

### 65.3 Lifecycle

```
Review Cleared → Approval Submitted → Approver 1 → Approver 2 → ... → Approved → Locked
                        ↓
                   Rejected → Preparer Revision
```

### 65.4 Versioning

Approval binds to specific artifact version; re-approval required after version change.

### 65.5 Permissions

| Artifact Type | Typical Chain |
|---------------|---------------|
| **Financial statements** | Controller → Director → CFO |
| **Audit opinion** | Manager → Engagement Partner |
| **Management letter** | Manager → Engagement Partner |
| **Materiality revision** | Manager → Partner (significant) |
| **Export (bulk)** | Manager → Organization Owner |

### 65.6 Business Rules

| Rule | Description |
|------|-------------|
| **APR-R01** | Chains non-bypassable (APR-01) |
| **APR-R02** | Self-approval prohibited (APR-02) |
| **APR-R03** | Rejection requires comments (APR-04) |
| **APR-R04** | Attribution on every approval (APR-05) |
| **APR-R05** | Publication requires approval (RPT-01) |

### 65.7 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **APR-AC-01** | Configurable chains per artifact type |
| **APR-AC-02** | Sequential and parallel routing supported |
| **APR-AC-03** | Self-approval blocked |
| **APR-AC-04** | Rejection returns to preparer with comments |
| **APR-AC-05** | Approved artifact locked |

---

## 66. Sign-off Management

Sign-off Management governs **attribution of professional responsibility** at each review and approval level.

*Constitutional basis: PROJECT_BIBLE Part 15 Section 80 Sign-offs; Business Rules WP-01, WP-02, APR-05.*

### 66.1 Purpose

Record **who reviewed, approved, or signed off** — with level, scope, timestamp, and artifact version.

### 66.2 Business Goals

| Goal | Description |
|------|-------------|
| **Accountability** | Named professional at each level |
| **Separation of duties** | Preparer ≠ sole reviewer (WP-01) |
| **Completion gates** | Sign-off required before procedure completion (WP-02) |
| **Finality** | Sign-off locks documentation at that level |
| **Inspection evidence** | Sign-off chain demonstrable |

### 66.3 Lifecycle

```
Review Cleared → Sign-off Requested → Sign-off Recorded → Artifact Locked at Level
```

### 66.4 Versioning

Sign-off references artifact version; superseded if artifact revised.

### 66.5 Permissions

| Level | Typical Signatory |
|-------|-------------------|
| **First review** | Audit Senior |
| **Second review** | Audit Manager |
| **Final / Partner** | Engagement Partner |
| **Financial reporting** | CFO |
| **Independent review** | Reviewer (parallel path) |

### 66.6 Business Rules

| Rule | Description |
|------|-------------|
| **SGN-R01** | Preparer cannot sign off own work as reviewer |
| **SGN-R02** | Sign-off blocks further edit without new version |
| **SGN-R03** | Sign-off records level, scope, timestamp |
| **SGN-R04** | Required sign-offs enforced before completion gates |
| **SGN-R05** | Revocation requires exceptional authorization |

### 66.7 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **SGN-AC-01** | Multi-level sign-off configurable |
| **SGN-AC-02** | Preparer-reviewer separation enforced |
| **SGN-AC-03** | Sign-off attribution complete |
| **SGN-AC-04** | Post-sign-off edit creates new version |
| **SGN-AC-05** | Sign-off chain exportable |

---

## 67. Decision History

Decision History provides the **immutable audit trail of all governance actions** across the platform.

### 67.1 Purpose

Preserve **complete, non-repudiable record** of reviews, approvals, rejections, sign-offs, and waives.

### 67.2 Business Goals

| Goal | Description |
|------|-------------|
| **Transparency** | Every governance action visible |
| **Non-repudiation** | Records cannot be altered (TRC-05) |
| **Inspection support** | Quality reviewers reconstruct decisions |
| **Accountability** | Actor, action, artifact, version, timestamp |
| **Analytics** | Governance metrics for firm leadership |

### 67.3 Lifecycle

Decisions recorded at event time — permanent retention per policy.

### 67.4 Versioning

Each decision record references artifact version at time of action.

### 67.5 Permissions

| Capability | Organization Owner | Engagement Partner | Audit Manager | Auditor |
|------------|-------------------|-------------------|---------------|---------|
| View decision history | Yes | Engagement scope | Engagement scope | Own actions |
| Export decision log | Yes | Yes | Yes | No |
| Filter by artifact/user | Yes | Yes | Yes | Limited |

### 67.6 Business Rules

| Rule | Description |
|------|-------------|
| **DEC-R01** | All governance actions logged |
| **DEC-R02** | Logs immutable — no user deletion |
| **DEC-R03** | Rejection rationale preserved |
| **DEC-R04** | Waiver decisions require elevated authorization |
| **DEC-R05** | AI disposition decisions included |

### 67.7 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **DEC-AC-01** | All approvals and rejections logged |
| **DEC-AC-02** | Decision log searchable by artifact and user |
| **DEC-AC-03** | Version referenced on each decision |
| **DEC-AC-04** | Export of decision history supported |
| **DEC-AC-05** | Logs immutable to users |

---

## Part 15 — Audit Opinion & Management Letter

### Table of Contents — Part 15

68. [Audit Opinion](#68-audit-opinion)
69. [Management Letter](#69-management-letter)
70. [User Journey — Opinion to Executive Reporting Readiness](#70-user-journey--opinion-to-executive-reporting-readiness)

---

## 68. Audit Opinion

The Audit Opinion module governs **formation, review, authorization, and publication** of the auditor's report.

*Constitutional basis: PROJECT_BIBLE Part 3 Workflow 20; Part 8 Audit Opinion entity; Business Rules OPN-01 through OPN-05.*

### 68.1 Opinion Types

| Type | Description | Trigger |
|------|-------------|---------|
| **Unqualified** | Fair presentation in all material respects | No material misstatements; no scope limitations |
| **Qualified** | Except for specific matter | Material but not pervasive misstatement or limitation |
| **Adverse** | Material and pervasive misstatement | Financial statements materially misstated |
| **Disclaimer** | Unable to express opinion | Pervasive scope limitation |

Opinion type is **Engagement Partner judgment** — platform structures documentation; does not select opinion autonomously.

### 68.2 Unqualified Opinion

| Requirement | Documentation |
|-------------|---------------|
| **Basis** | Sufficient appropriate evidence obtained |
| **Misstatements** | None material individually or in aggregate |
| **Scope** | No material limitations |
| **Independence** | Confirmations documented (OPN-04) |
| **Statements** | Linked to approved statement version (OPN-03) |

### 68.3 Qualified Opinion

| Requirement | Documentation |
|-------------|---------------|
| **Basis for modification** | Specific matter documented (OPN-05) |
| **Basis for opinion paragraph** | Explains qualification |
| **Materiality** | Matter material but not pervasive |
| **Finding linkage** | Linked uncorrected misstatement or limitation |

### 68.4 Adverse Opinion

| Requirement | Documentation |
|-------------|---------------|
| **Basis** | Material and pervasive misstatement |
| **Rationale** | Documented with finding and evidence linkage |
| **Partner approval** | Mandatory Partner authorization |
| **Communication** | Those charged with governance informed |

### 68.5 Disclaimer of Opinion

| Requirement | Documentation |
|-------------|---------------|
| **Basis** | Unable to obtain sufficient appropriate evidence |
| **Pervasiveness** | Scope limitation pervasive |
| **Rationale** | Documented limitation basis (OPN-05) |
| **Partner approval** | Mandatory |

### 68.6 Opinion Workflow

```
Prerequisites Met → Draft Report → Incorporate Opinion Type → Manager Review
    → Partner Review → Partner Authorization → Locked → Ready for Export
```

| Prerequisite | Gate |
|--------------|------|
| **File completeness** | No open material review notes (OPN-02) |
| **Findings evaluated** | All material findings addressed |
| **Representations** | Management representation obtained |
| **Independence** | Confirmations documented (OPN-04) |
| **Statements** | Approved financial statement version linked (OPN-03) |

### 68.7 Review

| Level | Reviewer | Scope |
|-------|----------|-------|
| **Draft** | Audit Manager | Report accuracy, finding incorporation |
| **Final** | Engagement Partner | Opinion basis, modification appropriateness |
| **Independent** | Reviewer | Quality review per firm policy |

### 68.8 Approval

| Requirement | Description |
|-------------|-------------|
| **Authorizer** | Engagement Partner mandatory (OPN-01) |
| **Attribution** | Partner identity, timestamp, report version (APR-05) |
| **Lock** | Authorized report immutable — revision requires re-authorization |
| **Modification** | Qualified, adverse, disclaimer require documented rationale (OPN-05) |

### 68.9 Publication

| Aspect | Product Behavior |
|--------|------------------|
| **Status** | Authorized → Published on distribution |
| **Recipients** | Those charged with governance; regulatory as required |
| **Binding** | Published report references locked version |
| **Audit trail** | Distribution logged |
| **Export** | Publication via export engine (Part 17) |

### 68.10 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **OPN-AC-01** | All four opinion types supported |
| **OPN-AC-02** | Opinion blocked with open material review notes |
| **OPN-AC-03** | Opinion linked to statement version |
| **OPN-AC-04** | Partner authorization required |
| **OPN-AC-05** | Modified opinions require documented rationale |
| **OPN-AC-06** | Independence confirmation gate enforced |
| **OPN-AC-07** | Authorized opinion locked |
| **OPN-AC-08** | Finding linkage visible in opinion basis |
| **OPN-AC-09** | Publication logged |
| **OPN-AC-10** | Emphasis of matter paragraphs supported |

---

## 69. Management Letter

The Management Letter module governs **communication of audit findings, observations, and recommendations** to client management.

*Constitutional basis: PROJECT_BIBLE Part 3 Workflow 21; Part 8 Finding entity; Business Rules RPT-01.*

### 69.1 Purpose

Produce a **versioned, approved management letter** compiling findings and control observations with full traceability to working paper evidence.

### 69.2 Observations

| Source | Content |
|--------|---------|
| **Audit findings** | Approved findings from register (Part 12) |
| **Control deficiencies** | Classified deficiencies |
| **Process observations** | Non-finding recommendations |
| **Linkage** | Each observation links to working paper and evidence |
| **Grouping** | By severity, category, or audit area |

### 69.3 Recommendations

| Element | Description |
|---------|-------------|
| **Recommendation text** | Specific corrective or improvement action |
| **Rationale** | Why recommendation matters |
| **Priority** | Critical, high, medium, low |
| **Owner** | Suggested management owner |
| **Timeline** | Suggested implementation timeframe |

### 69.4 Priority

| Priority | Criteria |
|----------|----------|
| **Critical** | Material weakness or critical finding |
| **High** | Significant deficiency or high-severity finding |
| **Medium** | Control deficiency or medium finding |
| **Low** | Process improvement |
| **Informational** | Best practice suggestion |

### 69.5 Management Responses

| Aspect | Product Behavior |
|--------|------------------|
| **Channel** | Client portal governed delivery |
| **Response** | Acknowledge, agree, disagree — per finding (Part 12 Section 58) |
| **Timeline** | Management-proposed remediation dates |
| **Versioning** | Responses versioned |
| **Inclusion** | Responses referenced in letter or appendix |

### 69.6 Tracking

| Tracking Element | Description |
|------------------|-------------|
| **Delivery status** | Draft, approved, delivered, acknowledged |
| **Response status** | Per observation — pending, received, overdue |
| **Remediation** | Linked to remediation tracker (Part 12) |
| **Closure** | Observation closed when criteria met |
| **Audit trail** | Delivery and acknowledgment logged |

### 69.7 Review and Approval

| Step | Actor |
|------|-------|
| **Draft** | Audit Manager |
| **Review** | Engagement Partner |
| **Approve** | Engagement Partner |
| **Deliver** | Partner authorizes client delivery |

### 69.8 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **MLT-AC-01** | Letter compilable from approved findings |
| **MLT-AC-02** | Observations link to working papers |
| **MLT-AC-03** | Priority assignable per item |
| **MLT-AC-04** | Partner approval required before delivery |
| **MLT-AC-05** | Client delivery through governed channel |
| **MLT-AC-06** | Management responses tracked |
| **MLT-AC-07** | Letter versioned |
| **MLT-AC-08** | Delivery audit trail recorded |

---

## 70. User Journey — Opinion to Executive Reporting Readiness

End-to-end experience from **AI completion analysis** through **authorized opinion and management letter** — ready for executive reporting.

*Continues MASTER_PRD Part 12 Section 60 — Ready for AI Audit Analysis milestone.*

### 70.1 Journey Overview

```
Ready for AI Audit Analysis → AI Analysis Completed → Partner Review
    → Opinion Generated → Management Letter Generated → Ready for Executive Reporting
```

### 70.2 Step 1 — Ready for AI Audit Analysis

| Perspective | Audit Manager |
|-------------|---------------|
| **State** | Findings evaluated; documentation substantially complete |
| **Action** | Initiate AI Auditor completion analysis |
| **Scope** | Full engagement completion package |

**User sees:** AI analysis workspace with scope selector and prerequisite checklist green.

### 70.3 Step 2 — AI Analysis Completed

| Perspective | Audit Manager |
|-------------|---------------|
| **Processing** | AI produces executive summary, risk/financial analysis, going concern and fraud indicators |
| **Review** | Manager reviews cited outputs — accepts, rejects, or escalates |
| **Focus** | AI recommendations inform Partner review agenda |
| **Record** | All dispositions logged |

**User sees:** AI completion report with confidence scores, citations, and disposition controls.

### 70.4 Step 3 — Partner Review

| Perspective | Engagement Partner |
|-------------|-------------------|
| **Review** | Partner reviews completion file, findings, AI analysis, aggregate misstatement |
| **Opinion assessment** | Determines appropriate opinion type |
| **Going concern** | Assesses going concern based on indicators and judgment |
| **Clear** | Clears engagement for opinion drafting |

**User sees:** Partner completion review queue with opinion impact summary.

### 70.5 Step 4 — Opinion Generated

| Perspective | Audit Manager; Engagement Partner |
|-------------|----------------------------------|
| **Draft** | Manager drafts auditor's report from firm template |
| **Opinion type** | Partner selects unqualified, qualified, adverse, or disclaimer |
| **Linkage** | Report linked to approved financial statement version |
| **Review** | Manager and Partner review cycles |
| **Authorize** | Partner authorizes opinion — report locked |

**User sees:** Auditor's report editor with opinion type selector and prerequisite gates.

### 70.6 Step 5 — Management Letter Generated

| Perspective | Audit Manager |
|-------------|---------------|
| **Compile** | Findings and deficiencies compiled into letter |
| **Prioritize** | Observations ordered by priority |
| **Draft** | Letter sections generated from template |
| **Approve** | Partner approves letter |
| **Deliver** | Letter delivered to client via portal |

**User sees:** Management letter with finding cross-reference index.

### 70.7 Step 6 — Ready for Executive Reporting

| Milestone | Criteria |
|-----------|----------|
| **Opinion authorized** | Partner-approved auditor's report locked |
| **Management letter** | Approved and delivered |
| **Statements** | Published financial statements linked |
| **Next workflow** | Executive dashboards, board packs, KPI reporting |

**User sees:** Engagement milestone — **Ready for Executive Reporting** — executive and board reporting enabled.

### 70.8 Journey Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **OJ-AC-01** | AI completion analysis runnable from milestone state |
| **OJ-AC-02** | Opinion generation blocked without prerequisites |
| **OJ-AC-03** | Partner authorization locks opinion |
| **OJ-AC-04** | Management letter generatable from findings |
| **OJ-AC-05** | Ready for Executive Reporting milestone displayed |

---

## Part 16 — Executive Reporting

### Table of Contents — Part 16

71. [Executive Dashboard](#71-executive-dashboard)
72. [KPI Dashboard](#72-kpi-dashboard)
73. [Board Reporting](#73-board-reporting)
74. [Executive Analytics](#74-executive-analytics)
75. [Management Packs](#75-management-packs)

---

## 71. Executive Dashboard

*Constitutional basis: PROJECT_BIBLE Part 13 Financial Intelligence; Part 1 Financial Intelligence domain.*

### 71.1 Purpose

Provide **executive-grade situational awareness** across financial performance, assurance status, risk, and governance — with drill-down to source evidence.

### 71.2 Business Goals

| Goal | Description |
|------|-------------|
| **Decision support** | Timely insight for CFO, board, and audit committee |
| **Unified view** | Reporting, audit, and intelligence in one surface |
| **Evidence drill-down** | Every metric traceable to source (TRC-01) |
| **Governance visibility** | Findings, remediation, and opinion status |
| **Role-appropriate** | Content filtered by stakeholder role |

### 71.3 Widgets

| Widget | Content |
|--------|---------|
| **Financial snapshot** | Key statement metrics — revenue, profit, cash, equity |
| **Period comparison** | Current vs. prior period movement |
| **Audit status** | Engagement progress, opinion status |
| **Open findings** | Material findings and remediation summary |
| **Risk heat map** | Top risks and indicators |
| **Compliance status** | Reporting and filing readiness |
| **AI insights** | Accepted AI intelligence highlights — cited |
| **Action items** | Overdue remediation and pending approvals |

### 71.4 KPIs

Embedded KPIs per widget — see Section 72.

### 71.5 Filters

| Filter | Options |
|--------|---------|
| **Entity / company** | Legal reporting entity |
| **Period** | Reporting period |
| **Engagement** | Active audit engagement |
| **Domain** | Financial, audit, governance |
| **Severity** | Finding and risk severity |

### 71.6 Permissions

| Role | Access |
|------|--------|
| **CFO / Finance Director** | Full financial and reporting widgets |
| **Engagement Partner** | Audit and assurance widgets |
| **Board / Audit Committee** | Governance grant — summary widgets |
| **Organization Owner** | Portfolio-level aggregation |

### 71.7 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **EXD-AC-01** | Executive dashboard displays role-appropriate widgets |
| **EXD-AC-02** | Drill-down to source evidence functional |
| **EXD-AC-03** | Filters by entity and period work |
| **EXD-AC-04** | Audit and financial data unified |
| **EXD-AC-05** | AI insights distinguished and cited |

---

## 72. KPI Dashboard

### 72.1 Purpose

Present **quantified performance and assurance metrics** with trend and threshold monitoring.

### 72.2 Business Goals

| Goal | Description |
|------|-------------|
| **Performance tracking** | Financial KPIs vs. plan and prior period |
| **Assurance metrics** | Audit progress and quality indicators |
| **Threshold alerts** | Material movements flagged |
| **Benchmarking** | Industry comparison where configured |

### 72.3 Widgets

| Category | KPIs |
|----------|------|
| **Financial** | Revenue growth, EBITDA margin, cash conversion, leverage |
| **Audit** | Procedure completion, open findings, aggregate misstatement % |
| **Quality** | Review turnaround, first-pass acceptance |
| **Remediation** | Open actions, overdue count, completion % |
| **Reporting** | Close-to-publish cycle time |

### 72.4 KPIs

Each KPI displays: value, prior period, variance, trend, materiality context where applicable, and source drill-down.

### 72.5 Filters

Period, entity, engagement, KPI category, severity threshold.

### 72.6 Permissions

CFO and Finance Director — financial KPIs; Partner and Manager — audit KPIs; Board — governance subset.

### 72.7 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **KPI-AC-01** | Financial and audit KPIs displayed |
| **KPI-AC-02** | Trend and variance shown |
| **KPI-AC-03** | Threshold alerts configurable |
| **KPI-AC-04** | KPI drill-down to source |
| **KPI-AC-05** | Materiality context on audit KPIs |

---

## 73. Board Reporting

### 73.1 Purpose

Produce **governance-ready board and audit committee packages** summarizing financial, assurance, and risk matters.

### 73.2 Business Goals

| Goal | Description |
|------|-------------|
| **Oversight support** | Board-grade summaries without operational detail overload |
| **Assurance transparency** | Audit status and significant matters |
| **Risk visibility** | Top risks and remediation |
| **Compliance** | Regulatory and governance requirements addressed |
| **Timely delivery** | Scheduled board cycle support |

### 73.3 Widgets

| Section | Content |
|---------|---------|
| **Financial summary** | Performance highlights |
| **Audit summary** | Opinion, significant matters, KAMs (where applicable) |
| **Findings summary** | Material findings and management responses |
| **Risk summary** | Enterprise and engagement risks |
| **Remediation status** | Open actions and overdue items |
| **Governance actions** | Committee decisions and follow-ups |

### 73.4 KPIs

Board-level KPIs: financial health indicators, audit completion, open material matters, remediation rate.

### 73.5 Filters

Entity, period, committee type (board vs. audit committee), meeting date.

### 73.6 Permissions

Board member and audit committee grant; CFO and Partner prepare; Organization Owner configures access.

### 73.7 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **BRD-AC-01** | Board package generatable from governed data |
| **BRD-AC-02** | Audit committee variant supported |
| **BRD-AC-03** | Significant matters prominently displayed |
| **BRD-AC-04** | Access restricted to governance grant |
| **BRD-AC-05** | Package exportable (Part 17) |

---

## 74. Executive Analytics

### 74.1 Purpose

Deliver **deep analytical narratives** — variance, trend, ratio, and scenario analysis for executive decision-making.

### 74.2 Business Goals

| Goal | Description |
|------|-------------|
| **Insight generation** | Beyond dashboards — explanatory analytics |
| **AI-assisted narrative** | Cited executive summaries |
| **Comparative analysis** | Multi-period, budget, benchmark |
| **Audit alignment** | Analytics consistent with audited figures |
| **Explainability** | Every insight traceable |

### 74.3 Widgets

| Analytic | Description |
|----------|-------------|
| **Variance deep-dive** | Material variances with drivers |
| **Trend analysis** | Multi-year trends with narrative |
| **Ratio dashboard** | Financial ratio suite with benchmarks |
| **Cash flow analytics** | Liquidity and cash generation |
| **Segment analysis** | Business segment performance |
| **Scenario view** | Sensitivity indicators — advisory |

### 74.4 KPIs

Analytic-specific metrics with drill-down.

### 74.5 Filters

Entity, period range, segment, account group, materiality threshold.

### 74.6 Permissions

CFO, Finance Director, Engagement Partner (audit context), Board (summary grant).

### 74.7 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **EXA-AC-01** | Variance and trend analytics executable |
| **EXA-AC-02** | AI narrative cited to source data |
| **EXA-AC-03** | Ratio analysis with benchmarks |
| **EXA-AC-04** | Drill-down to trial balance and evidence |
| **EXA-AC-05** | Analytics use approved financial data only |

---

## 75. Management Packs

### 75.1 Purpose

Assemble **periodic management reporting packages** — combining financial statements, analytics, KPIs, and commentary for internal stakeholders.

### 75.2 Business Goals

| Goal | Description |
|------|-------------|
| **Packaged delivery** | Consistent management report structure |
| **Approved content only** | Published statements and vetted analytics |
| **Branding** | Organization branding applied |
| **Distribution governance** | Authorized recipients only |
| **Version control** | Each pack versioned |

### 75.3 Widgets

Configurable pack sections: financial statements, KPI summary, executive commentary, cash flow, findings summary (audit context), appendix.

### 75.4 KPIs

Pack includes KPI dashboard snapshot at generation date.

### 75.5 Filters

Entity, period, pack template, audience (management vs. board).

### 75.6 Permissions

CFO approves; Finance Director prepares; export per Part 17.

### 75.7 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **MPK-AC-01** | Management pack generatable from templates |
| **MPK-AC-02** | Only approved content included |
| **MPK-AC-03** | Branding applied per organization settings |
| **MPK-AC-04** | Pack versioned |
| **MPK-AC-05** | Export to PDF and DOCX supported |

---

## Part 17 — Export & Reporting

### Table of Contents — Part 17

76. [Export Engine](#76-export-engine)
77. [DOCX Export](#77-docx-export)
78. [PDF Export](#78-pdf-export)
79. [Excel Export](#79-excel-export)
80. [XBRL Export](#80-xbrl-export)

---

## 76. Export Engine

*Constitutional basis: PROJECT_BIBLE Part 3 Workflow 22; Business Rules EXP-01 through EXP-05, RPT-05.*

### 76.1 Purpose

Govern **export of approved artifacts** in authorized formats with complete audit trail, metadata, and permission control.

### 76.2 Business Goals

| Goal | Description |
|------|-------------|
| **Approved-only final export** | Draft watermark on unapproved (EXP-01, RPT-05) |
| **Distribution audit** | Every export logged (EXP-02) |
| **Permission control** | Export gated by role (EXP-03) |
| **Metadata integrity** | Version and approval embedded (EXP-04) |
| **Bulk protection** | Elevated auth for mass export (EXP-05) |
| **Portability** | Customer data export per organizational policy |

### 76.3 Export Lifecycle

```
Request → Permission Check → Approval Status Check → Generate → Metadata Embed
    → Deliver → Log → Confirm
```

| Stage | Gate |
|-------|------|
| **Request** | User selects artifact and format |
| **Permission** | Role has export capability (EXP-03) |
| **Approval** | Artifact approved for final export (EXP-01) |
| **Generate** | Format-specific engine produces file |
| **Deliver** | Secure download or distribution channel |
| **Log** | Export event recorded (EXP-02) |

### 76.4 Templates

| Template Type | Application |
|---------------|-------------|
| **Financial statement** | Firm-published IFRS presentation templates |
| **Auditor's report** | ISA-aligned opinion templates |
| **Management letter** | Firm letter templates |
| **Working paper package** | Engagement file export structure |
| **Board pack** | Executive reporting templates |
| **Bulk data** | Organizational portability format |

### 76.5 Branding

| Element | Configuration |
|---------|---------------|
| **Organization logo** | Header on exported reports |
| **Color scheme** | Firm brand colors where configured |
| **Footer** | Firm name, date, version metadata |
| **Watermark** | DRAFT on unapproved artifacts (RPT-05) |
| **Tier** | Branding per organization tier (Part 2) |

### 76.6 Digital Signature Readiness

| Aspect | Product Behavior |
|--------|------------------|
| **Metadata** | Export packages structured for external signing workflows |
| **Integrity hash** | File hash recorded in export log |
| **Provenance** | Version, approver, timestamp embedded |
| **Integration point** | Platform prepares packages — signing via external trust service |
| **Audit trail** | Signing events recorded when integrated |

### 76.7 Audit Trail

| Event | Recorded |
|-------|----------|
| Export request | User, artifact, format, timestamp |
| Permission check | Pass/fail |
| Generation | Success/failure, file hash |
| Delivery | Recipient, channel |
| Bulk export | Elevated authorization record |

### 76.8 Versioning

Exports reference specific artifact version; re-export creates new export record — not artifact version change.

### 76.9 Permissions

| Export Type | Typical Authorizer |
|-------------|-------------------|
| **Financial statements** | CFO |
| **Auditor's report** | Engagement Partner |
| **Management letter** | Engagement Partner |
| **Working paper package** | Engagement Partner |
| **Bulk / full engagement** | Organization Owner (EXP-05) |
| **Organizational portability** | Organization Owner |

### 76.10 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **EXP-AC-01** | Export blocked for unapproved artifacts (final format) |
| **EXP-AC-02** | Draft export watermarked |
| **EXP-AC-03** | Every export logged |
| **EXP-AC-04** | Metadata embedded in exports |
| **EXP-AC-05** | Bulk export requires elevated authorization |
| **EXP-AC-06** | Permission check enforced |
| **EXP-AC-07** | Export audit trail exportable |

---

## 77. DOCX Export

### 77.1 Purpose

Export approved artifacts to **Microsoft Word format** for editing, collaboration, and stakeholder distribution.

### 77.2 Supported Artifacts

Financial statements, IFRS notes, auditor's report, management letter, board packs, management commentary.

### 77.3 Export Behavior

| Aspect | Product Behavior |
|--------|------------------|
| **Template** | Firm DOCX templates applied |
| **Structure** | Headings, tables, cross-references preserved |
| **Metadata** | Document properties include version and approval |
| **Draft** | Watermark on unapproved |
| **Branding** | Logo and footer per organization settings |

### 77.4 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **DOC-AC-01** | Approved artifacts exportable to DOCX |
| **DOC-AC-02** | Template formatting preserved |
| **DOC-AC-03** | Metadata in document properties |
| **DOC-AC-04** | Draft watermark applied |

---

## 78. PDF Export

### 78.1 Purpose

Export approved artifacts to **PDF format** for formal distribution, filing, and archival.

### 78.2 Supported Artifacts

All report types; engagement file packages; evidence bundles; board packs.

### 78.3 Export Behavior

| Aspect | Product Behavior |
|--------|------------------|
| **Final format** | Primary distribution format for authorized reports |
| **Integrity** | PDF generation logged with hash |
| **Watermark** | DRAFT on unapproved; none on approved |
| **Bookmarks** | Navigation bookmarks for multi-section documents |
| **Accessibility** | Tagged PDF where firm policy requires |

### 78.4 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **PDF-AC-01** | Approved reports exportable to PDF |
| **PDF-AC-02** | Draft watermark on unapproved |
| **PDF-AC-03** | Export hash recorded |
| **PDF-AC-04** | Multi-section navigation bookmarks |

---

## 79. Excel Export

### 79.1 Purpose

Export **structured financial and audit data** to Excel for analysis, submission, and working paper support.

### 79.2 Supported Artifacts

Trial balance, lead sheets, finding registers, misstatement summary, analytical data, KPI data, working paper schedules.

### 79.3 Export Behavior

| Aspect | Product Behavior |
|--------|------------------|
| **Structure** | Worksheets per logical section |
| **Formulas** | Source values exported — formulas documented in metadata |
| **Traceability** | Cell-level source reference where applicable (TRC-02) |
| **Version** | Export metadata sheet with version and date |
| **Permission** | Data export gated — bulk requires elevation |

### 79.4 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **XLS-AC-01** | Trial balance and lead sheets exportable |
| **XLS-AC-02** | Finding register exportable |
| **XLS-AC-03** | Metadata sheet included |
| **XLS-AC-04** | Permission gating enforced |

---

## 80. XBRL Export

### 80.1 Purpose

Export approved financial statements to **XBRL structured format** for regulatory filing readiness.

### 80.2 Business Goals

| Goal | Description |
|------|-------------|
| **Regulatory readiness** | Structured format for jurisdiction filing |
| **Taxonomy mapping** | IFRS taxonomy elements mapped to statement lines |
| **Validation** | Pre-export validation against taxonomy rules |
| **Approved only** | Published statements only (EXP-01) |
| **Metadata** | Filing metadata embedded |

### 80.3 Export Behavior

| Aspect | Product Behavior |
|--------|------------------|
| **Source** | Approved, published financial statement package |
| **Taxonomy** | Jurisdiction-appropriate IFRS taxonomy version |
| **Mapping** | Statement lines mapped to taxonomy elements |
| **Validation** | Required elements and calculations validated pre-export |
| **Extension** | Entity-specific extensions documented |
| **Audit trail** | XBRL export logged |

### 80.4 Acceptance Criteria

| ID | Criterion |
|----|-----------|
| **XBRL-AC-01** | Approved statements exportable to XBRL |
| **XBRL-AC-02** | Taxonomy validation before export |
| **XBRL-AC-03** | Line-to-element mapping documented |
| **XBRL-AC-04** | Export logged with version reference |
| **XBRL-AC-05** | Pre-export validation errors block export |

---

## PRD Review Notes — Sprint 4 (Parts 13–17)

Consistency review of MASTER_PRD Sprint 4 against PROJECT_BIBLE (Parts 1–15) and MASTER_PRD Parts 1–12. No previous sections modified.

### Constitutional Alignment

| Area | Status | Notes |
|------|--------|-------|
| Workflow 17 AI Audit Analysis | Aligned | Part 13 Section 61 |
| Workflow 24 AI Copilot | Aligned | Part 13 Section 62 |
| Workflow 19 Approval | Aligned | Part 14 Sections 63–67 |
| Workflow 20 Audit Opinion | Aligned | Part 15 Section 68 |
| Workflow 21 Management Letter | Aligned | Part 15 Section 69 |
| Workflow 22 Report Export | Aligned | Part 17 Sections 76–80 |
| Part 4 AI Philosophy | Aligned | Sections 61–62 |
| Part 13 Financial Intelligence | Aligned | Part 16 |
| OPN-01 through OPN-05 | Aligned | Section 68 |
| EXP-01 through EXP-05 | Aligned | Part 17 |
| AI-01 through AI-05 | Aligned | Sections 61–62 |

### MASTER_PRD Parts 1–12 Alignment

| Area | Status |
|------|--------|
| Part 12 §60 Ready for AI Audit Analysis | Part 15 §70 continues |
| PRD12-01 Management Letter | Part 15 Section 69 |
| PRD12-02 Audit Opinion | Part 15 Section 68 |
| PRD12-03 AI Audit Analysis | Part 13 Section 61 |
| PRD7-02 Export PRD | Part 17 |
| Section 14 Governance (IAM) | Part 14 complements — artifact governance |
| AI Finding vs Audit Finding | Maintained — Section 61 AI boundaries |
| Part 7 financial statements | Opinion linkage Section 68 |
| Part 12 findings/remediation | Management letter Section 69 |

### Terminology Consistency

| Term | Status |
|------|--------|
| AI Auditor vs AI Copilot | Distinct capabilities — Sections 61, 62 |
| Audit Finding vs AI Finding | Preserved distinction |
| Opinion types | Unqualified, qualified, adverse, disclaimer — ISA aligned |
| Review vs approval vs sign-off | Part 14 clarifies layers |
| Draft vs approved export | EXP-01, RPT-05 throughout Part 17 |
| Executive vs board reporting | Sections 71, 73 distinct |

### Governance & Review Chain

| Area | Status |
|------|--------|
| APR-01 through APR-05 | Part 14 |
| Partner opinion authorization | OPN-01, Section 68 |
| CFO statement publication | Cross-reference Part 7 |
| Separation of duties | Part 14 throughout |
| Decision history immutability | Section 67 |

### Traceability & Cross References

| Area | Status |
|------|--------|
| Executive drill-down | Part 16 references TRC-01 |
| Opinion to statement version | OPN-03 |
| Management letter to findings | Section 69 |
| Export metadata | EXP-04 |

### Editorial Recommendations

| ID | Recommendation |
|----|----------------|
| **SPR4-01** | Engagement Closure (Workflow 25) — Sprint 5 specification |
| **SPR4-02** | Key Audit Matters — listed entity opinion enhancement |
| **SPR4-03** | Management representation letter — opinion prerequisite module |
| **SPR4-04** | Milestone glossary — consolidate Parts 8–15 milestone names |
| **SPR4-05** | AI Finding to Audit Finding conversion — formalize rules (PRD12-08) |
| **SPR4-06** | Digital signature integration — trust service provider specification |
| **SPR4-07** | Portfolio-level executive dashboard — multi-entity aggregation |
| **SPR4-08** | Emphasis of matter and other matter paragraphs — expand opinion editor |

### Review Conclusion

MASTER_PRD Sprint 4 (Parts 13–17) is **consistent with PROJECT_BIBLE and Parts 1–12**. It specifies AI Auditor, AI Copilot, governance, opinion, management letter, executive reporting, and export as governed enterprise workflows without contradicting AI human-in-the-loop requirements, approval philosophy, or traceability commitments. SPR4-01 through SPR4-08 guide subsequent PRD work.

---

## Document Control — Sprint 4

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.17.0 | 2026-06-30 | Chief Product Officer | Sprint 4 — Parts 13–17: AI Auditor & Copilot, Governance & Approvals, Audit Opinion & Management Letter, Executive Reporting, Export & Reporting; PRD Review Notes Sprint 4 included |

---

*End of Sprint 4. Await further instruction.*












