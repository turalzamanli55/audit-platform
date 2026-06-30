# Design System

## Document Purpose

This document is the **visual constitution of the audit platform**. It defines how the product looks, feels, and behaves at every level of interaction. All developers, designers, product owners, and AI agents working in this repository must treat this document as authoritative for every screen, component, workflow, and visual decision.

This is not a UI guideline. It is not a component library specification. It is the enduring design charter for a world-class enterprise platform — the standard against which every interface decision is measured.

## Status

| Field | Value |
|-------|-------|
| Document | Design System |
| Version | 1.0 |
| Part | 1 of N |
| Status | Draft — Part 1 Complete |
| Last Updated | 2026-06-30 |
| Owner | Chief Product Designer / Design System Architect |
| Companion Documents | [Project Bible](./PROJECT_BIBLE.md), [Master PRD](./MASTER_PRD.md), [System Architecture](./SYSTEM_ARCHITECTURE.md) |

## Table of Contents

### Part 1 — Foundation (This Document)

1. [Design Vision](#1-design-vision)
2. [Design Philosophy](#2-design-philosophy)
3. [User Experience Principles](#3-user-experience-principles)
4. [Visual Identity](#4-visual-identity)
5. [Design Language](#5-design-language)
6. [Enterprise UX Goals](#6-enterprise-ux-goals)
7. [Anti-Patterns](#7-anti-patterns)
8. [Success Criteria](#8-success-criteria)

### Future Parts (Planned)

- Part 2 — Typography, Color, and Visual Tokens
- Part 3 — Layout, Grid, and Spatial Systems
- Part 4 — Components and Interaction Patterns
- Part 5 — Motion, Feedback, and States
- Part 6 — Accessibility and Inclusive Design
- Part 7 — Localization and Multi-Language Presentation
- Part 8 — Governance, Review, and Evolution

---

## 1. Design Vision

### The Ambition

We are building the **world's most beautiful enterprise audit platform** — a product where professional rigor and visual elegance are not opposing forces, but mutually reinforcing ones.

Audit, IFRS reporting, and financial intelligence are among the most demanding domains in enterprise software. Practitioners work under regulatory pressure, tight deadlines, and extraordinary cognitive load. They deserve tools that respect the gravity of their work while removing the friction that legacy software has normalized for decades.

Our design vision is singular: **enterprise software should feel as refined as the best consumer products**, without sacrificing the depth, structure, and defensibility that regulated professions require.

### Why Enterprise Software Deserves Beauty

For too long, enterprise software has been granted an exemption from design excellence. Complexity became an excuse for clutter. Density became a substitute for hierarchy. Familiarity with spreadsheets became a reason to replicate spreadsheets.

That era ends here.

Beauty in enterprise software is not vanity. It is **cognitive infrastructure**. When interfaces are clear, calm, and intentional, professionals make fewer errors, find information faster, maintain focus longer, and develop deeper trust in the system that supports their judgment.

A beautiful enterprise platform communicates respect for the user. It signals that their time matters, that their attention is valuable, and that the organization behind the product holds itself to the same standard of quality they hold their own work to.

### Beauty, Clarity, and Usability as Product Features

In this platform, design quality is not a polish layer applied at the end of development. It is a **first-class product capability**, equivalent in importance to security, performance, and data integrity.

| Design Quality | Product Outcome |
|----------------|-----------------|
| Clarity | Faster task completion, fewer misinterpretations |
| Consistency | Reduced training cost, lower cognitive switching |
| Calm | Sustained focus during long review sessions |
| Elegance | Higher adoption, stronger professional pride |
| Precision | Increased trust in outputs and system behavior |
| Responsiveness | Perceived intelligence and operational confidence |

Users do not separate "how it works" from "how it feels." They experience both simultaneously. A platform that looks trustworthy and feels effortless is a platform users will defend, recommend, and rely upon during their most critical engagements.

### Eight Hours Inside the Platform

Audit and accounting professionals do not visit this platform briefly. They **live inside it** — often for entire working days, across weeks-long engagements, through month-end close cycles and year-end audits.

The platform must therefore be designed for **long-session comfort** as a primary constraint, not an afterthought. Users should feel:

- Oriented, never lost
- Supported, never abandoned
- Calm, never overwhelmed
- Efficient, never slowed by the interface
- Proud, never embarrassed by the tools they use in front of clients

When a practitioner closes their laptop after eight hours of work, they should feel that the platform helped them think clearly — not that it exhausted them fighting the UI.

This is the standard. Every design decision in this system exists to serve it.

---

## 2. Design Philosophy

The following philosophies are the intellectual foundation of the design system. They are not slogans. They are decision-making tools. When two design options conflict, these philosophies determine which path the platform takes.

---

### Less but Better

Every element in the interface must earn its place. We remove not because minimalism is fashionable, but because **unnecessary elements compete with necessary ones** for the user's limited attention.

Less but better means:

- Fewer controls per view, each with clear purpose
- Fewer visual treatments, each with clear meaning
- Fewer navigation paths, each with clear destination
- Fewer words, each with clear intent

Reduction is a discipline. It requires understanding what is essential to professional judgment and what is merely habitual from legacy tools.

---

### Clarity Before Decoration

Decoration delights momentarily. Clarity serves continuously.

We never adorn an interface at the expense of comprehension. Visual treatment exists to **reveal structure, signal state, and guide action** — not to impress.

When clarity and aesthetics appear to conflict, we resolve the tension through better hierarchy, not more ornament. A well-structured plain interface is always superior to a decorated confusing one.

---

### Consistency Before Creativity

Creativity in enterprise software belongs in how elegantly we solve complex problems — not in how differently we present every screen.

Users build mental models over time. Consistency protects those models. When buttons, spacing, labels, and flows behave predictably across the platform, users stop thinking about the interface and start thinking about their work.

Creativity is reserved for moments where the domain genuinely requires novel presentation. Everywhere else, **the system speaks with one voice**.

---

### Function Creates Beauty

Beauty emerges from function executed with care. A perfectly aligned data table, a precisely timed state transition, a form that anticipates the user's next question — these are beautiful because they work beautifully.

We do not design beautiful interfaces and then add function. We design **excellent workflows** and allow beauty to emerge from their refinement.

---

### Invisible Complexity

Audit and financial reporting are inherently complex. The interface must absorb that complexity so the user does not have to.

Invisible complexity means:

- Sophisticated logic presented through simple surfaces
- Multi-step processes revealed progressively, not all at once
- Advanced capabilities available without cluttering default views
- System intelligence working quietly in the background

The user should feel that complex work is manageable — not that they are managing a complex interface.

---

### Calm Interfaces

Calm is the default emotional state of this platform.

Calm interfaces use restrained color, generous space, predictable motion, and measured information density. They do not shout. They do not flash. They do not create urgency where none exists.

Calm does not mean slow or passive. It means **the interface never adds anxiety to an already demanding profession**.

---

### Human-Centered Workflows

Technology serves the professional, not the reverse.

Every workflow is designed around how auditors and accountants actually think, review, document, and sign off — not around how databases are structured or how legacy systems organized screens.

Human-centered design honors:

- Professional skepticism
- The need for evidence and traceability
- The rhythm of review and revision
- The reality of interruption and context-switching
- The accountability that comes with signing one's name to work

---

### Speed Feels Premium

Performance is a design property.

Instant feedback, immediate transitions, and responsive interactions communicate quality and competence. Lag communicates the opposite — regardless of how beautiful the static design may be.

We design interfaces that feel fast, and we hold performance standards that ensure they remain fast under real enterprise conditions.

---

### Trust Through Visual Quality

In audit and financial reporting, trust is everything. Users must trust that what they see is accurate, current, and complete.

Visual quality builds trust. Sloppy alignment, inconsistent spacing, ambiguous states, and careless typography erode confidence — even when the underlying data is correct.

**Precision in presentation signals precision in engineering and data handling.**

---

### Every Pixel Has Purpose

No pixel is neutral. Every spacing decision, every color choice, every typographic weight communicates meaning.

Purposeful design means:

- Spacing creates grouping and separation
- Color signals status, priority, or interactivity — never decoration alone
- Typography establishes hierarchy and scannability
- Icons represent concepts, not fill empty space

When a pixel has no purpose, it is removed.

---

## 3. User Experience Principles

The following principles govern interaction design across the entire platform. They apply to every screen, every workflow, and every future feature. Each principle includes a short explanation of its intent and application.

### Orientation and Structure

| # | Principle | Explanation |
|---|-----------|-------------|
| 1 | **Never overwhelm the user** | Present only what the current task requires. Large datasets and complex workflows are revealed progressively, not dumped onto a single surface. |
| 2 | **Important information first** | Lead with the data, status, or decision most relevant to the user's immediate goal. Secondary detail is available, not intrusive. |
| 3 | **One primary action per screen** | Every view has a clear primary action. Secondary actions are visible but visually subordinate. The user always knows what to do next. |
| 4 | **Maintain clear hierarchy** | Visual weight, position, and typography consistently communicate what matters most. Users scan before they read. |
| 5 | **Always show where you are** | Navigation, breadcrumbs, page titles, and context indicators ensure users never feel lost within deep enterprise workflows. |
| 6 | **Preserve context across navigation** | Moving between related views should not erase the user's mental model. Parent context, selections, and filters persist where appropriate. |
| 7 | **Group related information** | Content is organized into logical clusters that match how professionals think about engagements, entities, periods, and workpapers. |
| 8 | **Use consistent page anatomy** | Headers, toolbars, content areas, and action zones follow predictable patterns so users orient instantly on any screen. |

### Efficiency and Flow

| # | Principle | Explanation |
|---|-----------|-------------|
| 9 | **Never require unnecessary clicks** | Every click must move the user meaningfully toward their goal. Eliminate redundant confirmation steps and intermediary screens. |
| 10 | **Minimize context switching** | Related tasks should be completable within the same view or adjacent panel — not spread across disconnected screens. |
| 11 | **Support batch operations** | When users must act on multiple items, the platform provides efficient multi-select and bulk actions without forcing repetition. |
| 12 | **Remember user preferences** | Sensible defaults, recently used items, and persisted view settings reduce repetitive configuration. |
| 13 | **Enable keyboard-first productivity** | Power users must be able to navigate, search, and act without reaching for the mouse. Keyboard shortcuts are discoverable and consistent. |
| 14 | **Fast feels intelligent** | Response time is a UX feature. Immediate feedback on every interaction reinforces confidence in the platform. |
| 15 | **Reduce cognitive load** | Do not make users hold information in memory. Display what they need, when they need it, in the context where they need it. |
| 16 | **Design for interruption** | Users will be interrupted. Workflows support graceful pause, clear resumption, and visible state of in-progress work. |

### Progressive Disclosure and Depth

| # | Principle | Explanation |
|---|-----------|-------------|
| 17 | **Progressive disclosure** | Show essentials first. Reveal depth on demand through expansion, drawers, detail panels, and drill-down — never all at once. |
| 18 | **Sensible defaults, full configurability** | Default views work for most users. Advanced options exist for those who need them, without cluttering the default experience. |
| 19 | **Make complexity opt-in** | Advanced filters, custom fields, and power features are available but never forced upon users performing standard tasks. |
| 20 | **Layer detail by audience** | Executives, managers, and staff see appropriate depth for their role — not the same undifferentiated data dump. |

### Feedback and Communication

| # | Principle | Explanation |
|---|-----------|-------------|
| 21 | **Always provide feedback** | Every user action receives a visible response — confirmation, progress, success, or failure. Silent system behavior erodes trust. |
| 22 | **Always explain errors** | Error messages state what happened, why it happened, and what the user can do next. Never blame the user. Never show raw system output. |
| 23 | **Never surprise the user** | Destructive actions require confirmation. State changes are visible. System-initiated changes are communicated before they take effect. |
| 24 | **Communicate system status** | Loading, saving, syncing, and processing states are always visible. Users must never wonder whether the platform is working. |
| 25 | **Confirm success explicitly** | Completed actions receive clear, proportionate confirmation — not silent disappearance into the void. |
| 26 | **Use precise language** | Labels, messages, and instructions use professional, unambiguous terminology aligned with audit and accounting vocabulary. |

### Trust, Safety, and Accountability

| # | Principle | Explanation |
|---|-----------|-------------|
| 27 | **Make irreversible actions visible** | Actions with legal, audit, or compliance consequences are clearly distinguished from routine operations. |
| 28 | **Preserve audit trail visibility** | Users can see who did what and when. The interface reinforces accountability without creating friction for authorized work. |
| 29 | **Never hide critical warnings** | Compliance alerts, deadline warnings, and data integrity issues are prominent and persistent until acknowledged or resolved. |
| 30 | **Design for professional defensibility** | The platform helps users demonstrate that their work was thorough, reviewed, and supported by evidence. |

### Inclusivity and Accessibility

| # | Principle | Explanation |
|---|-----------|-------------|
| 31 | **Readable typography** | Text is legible at all sizes, with sufficient contrast, comfortable line length, and clear hierarchy. |
| 32 | **Touch-friendly interaction** | Interactive targets are sized and spaced for confident use on tablets and touch-enabled devices, not only desktop mice. |
| 33 | **Do not rely on color alone** | Status, state, and category are communicated through iconography, labels, and pattern — not color exclusively. |
| 34 | **Support diverse working environments** | The platform is usable in bright offices, dim review rooms, and extended sessions with reduced eye strain. |
| 35 | **Accessible by default** | Accessibility is built into the design system from the foundation — not retrofitted as a compliance exercise. |

### Consistency and Learnability

| # | Principle | Explanation |
|---|-----------|-------------|
| 36 | **Consistent interaction patterns** | The same gesture, click, or shortcut performs the same class of action everywhere in the platform. |
| 37 | **Predictable navigation** | Users learn the navigation model once and apply it everywhere. Surprises are reserved for genuinely novel capabilities. |
| 38 | **Teach through design** | Well-designed interfaces teach users how to use them. Labels, placeholders, and empty states guide without manuals. |
| 39 | **Empty states are opportunities** | Empty views explain what will appear, why it is empty, and what action the user can take to populate it. |
| 40 | **Design for long-term mastery** | The platform rewards experience. Novices are guided; experts are accelerated. Both are respected. |

---

## 4. Visual Identity

### Platform Personality

The audit platform presents itself as **precise, calm, confident, and modern** — a professional instrument, not a bureaucratic obstacle.

It speaks with the quiet authority of a well-made tool. It does not perform enterprise seriousness through visual heaviness. It earns seriousness through clarity, consistency, and attention to detail.

The personality attributes that define this platform:

| Attribute | Expression |
|-----------|------------|
| **Precise** | Exact alignment, deliberate spacing, no visual ambiguity |
| **Calm** | Restrained palette, generous whitespace, no gratuitous urgency |
| **Confident** | Clear hierarchy, decisive typography, strong but not loud |
| **Modern** | Contemporary proportions, clean surfaces, current interaction patterns |
| **Professional** | Appropriate gravitas without corporate cliché |
| **Trustworthy** | Consistent behavior, transparent states, quality craftsmanship |
| **Intelligent** | Anticipatory layouts, meaningful defaults, responsive feedback |
| **Respectful** | Honors the user's expertise, time, and professional standards |

### What We Are Not

This platform must **never** resemble the visual language of legacy enterprise software. Specifically, it must not evoke:

| Reference Category | Why We Reject It |
|--------------------|------------------|
| **SAP** | Dense, utilitarian, visually exhausting; prioritizes function listing over hierarchy |
| **Oracle** | Heavy, corporate, inconsistent; reflects database-centric thinking |
| **Microsoft Dynamics** | Cluttered ribbons, ambiguous visual priority, dated enterprise patterns |
| **Legacy ERP systems** | Form-heavy, tab-laden, modal-driven workflows that trap users |
| **Old accounting software** | Spreadsheet mimicry, grey boxes, cramped layouts, weak typography |

These systems normalized the idea that enterprise users do not deserve good design. We reject that premise entirely.

### What Inspires Us

Our visual identity draws from products that have proven enterprise-grade work can feel exceptional:

| Inspiration | What We Take |
|-------------|--------------|
| **Apple** | Material quality, obsessive detail, calm confidence, hierarchy through typography and space |
| **Linear** | Speed, precision, keyboard-first productivity, dark-mode elegance, information density without clutter |
| **Notion** | Flexible structure, clean content presentation, approachable professionalism |
| **Stripe Dashboard** | Data clarity, trustworthy presentation, refined component craft, developer-grade precision made accessible |
| **Arc Browser** | Spatial clarity, thoughtful navigation, personality without noise |
| **Modern iOS** | Touch ergonomics, system-level consistency, depth through layering not decoration |
| **Modern macOS** | Desktop power with visual refinement, native-feeling interactions, respect for focus |

We do not copy these products. We study the **principles behind their excellence** and apply them to the specific demands of audit and financial reporting.

### Emotional Experience

When users interact with this platform, they should feel:

| Emotion | Description |
|---------|-------------|
| **In control** | The interface responds to their intent. They direct the tool; the tool does not direct them. |
| **Focused** | Visual calm and clear hierarchy protect attention during demanding analytical work. |
| **Confident** | Consistent behavior and precise presentation reinforce trust in their outputs. |
| **Capable** | The platform feels powerful without feeling complicated. |
| **Respected** | The quality of the design communicates that the product team respects their profession. |
| **Calm** | Even during deadline pressure, the interface does not amplify stress. |

Users should never feel confused, patronized, anxious, or embarrassed by the tools they use in front of colleagues and clients.

---

## 5. Design Language

The design language defines the visual vocabulary of the platform — the structural qualities that give every screen its character, regardless of specific content or feature.

---

### Minimalism

Minimalism in this platform means **purposeful reduction**, not aesthetic austerity.

Every screen contains only what the current professional task requires. Empty space is not wasted space — it is active space that separates concerns, guides the eye, and allows complex information to breathe.

Minimalism is measured by what the user can accomplish with less effort, not by how few elements appear on screen.

---

### Hierarchy

Hierarchy is the primary navigation tool for the eye.

Through size, weight, color, position, and spacing, the interface communicates:

- What requires immediate attention
- What supports the primary content
- What is available but not urgent
- What is contextual or metadata

Strong hierarchy eliminates the need for excessive labels, borders, and boxes. When hierarchy is correct, users scan confidently.

---

### Whitespace

Whitespace is a structural element, not leftover space.

It performs critical functions:

- Separates unrelated content groups
- Creates visual rest between dense data regions
- Signals importance through isolation
- Reduces perceived complexity

Generous whitespace is a hallmark of premium enterprise design. It communicates confidence that the product does not need to shout every piece of information simultaneously.

---

### Rhythm

Rhythm is the repeating spatial beat that creates visual coherence.

Consistent spacing increments, aligned baselines, and predictable vertical cadence make the interface feel composed and intentional. When rhythm is maintained, new screens feel familiar before they are explored.

Broken rhythm — arbitrary spacing, misaligned elements, inconsistent padding — is immediately perceived as low quality, even if users cannot articulate why.

---

### Balance

Balance distributes visual weight so no region of the screen feels accidentally heavy or empty.

In data-dense enterprise views, balance prevents the interface from collapsing under its own information. Sidebars, content areas, and action zones maintain proportional relationship across screen sizes.

---

### Contrast

Contrast directs attention and establishes readability.

The platform uses contrast purposefully:

- High contrast for primary content and critical actions
- Moderate contrast for secondary information
- Low contrast for backgrounds, dividers, and inactive states

Contrast is a functional tool for accessibility and scannability — not a decorative technique.

---

### Depth

Depth communicates layering and relationship without visual heaviness.

The platform uses subtle elevation, surface treatment, and spatial layering to distinguish:

- Background from content
- Content from overlay
- Primary panel from secondary panel

Depth is achieved through restraint. We do not simulate physicality for its own sake.

---

### Focus

Focus ensures the user's attention lands where it should.

Through hierarchy, contrast, isolation, and — when appropriate — deliberate de-emphasis of surrounding content, the interface guides attention to the current task, the active record, or the pending decision.

In enterprise workflows with multiple concurrent concerns, focus is a discipline that prevents costly errors.

---

### Visual Breathing Room

Breathing room is the combination of whitespace, rhythm, and restraint that allows users to process complex information without fatigue.

Long audit sessions demand interfaces that do not accumulate visual pressure over time. Breathing room is therefore not a luxury — it is an operational requirement for professionals working eight-hour days.

---

### Professional Elegance

Professional elegance is the synthesis of all design language elements: minimalism with warmth, hierarchy with humanity, precision with calm.

It is the quality that makes users prefer this platform over alternatives — not because it has more features, but because it feels better to use. It is what separates a tool professionals tolerate from a tool they advocate for.

---

## 6. Enterprise UX Goals

Enterprise UX goals define what the design system must achieve over time. They are organized by horizon to guide prioritization without sacrificing the long-term vision.

### Short-Term Goals

*Achievable within the current product foundation and early feature delivery.*

| Goal | Description |
|------|-------------|
| **Establish visual consistency** | Every existing screen and component follows a unified design language with no visual outliers. |
| **Deliver calm defaults** | Default views are clean, hierarchical, and uncluttered — not comprehensive data dumps. |
| **Implement clear navigation** | Users can orient within the platform structure within seconds of login. |
| **Provide immediate feedback** | All user actions produce visible system response — loading, success, error. |
| **Support core workflows end-to-end** | Authentication, onboarding, tenant management, and dashboard flows feel complete and polished. |
| **Establish accessible foundations** | Typography, contrast, and touch targets meet baseline accessibility requirements from the start. |
| **Build trust through craft** | Alignment, spacing, and typographic quality are exact — no visible rough edges. |

### Medium-Term Goals

*Achievable as domain features expand across audit, reporting, and intelligence modules.*

| Goal | Description |
|------|-------------|
| **Master data-dense views** | Tables, grids, and analytical views handle enterprise-scale data with clarity and performance. |
| **Develop advanced workflow patterns** | Multi-step review, approval chains, and collaboration flows feel natural and traceable. |
| **Enable keyboard-first productivity** | Power users can execute common tasks without mouse dependency. |
| **Support role-based presentation** | Different user roles see appropriately scoped interfaces without separate products. |
| **Refine progressive disclosure** | Complex domain features reveal depth without overwhelming default experiences. |
| **Establish motion and state language** | Transitions, loading patterns, and state changes are consistent and purposeful across the platform. |
| **Deliver multi-language visual quality** | Localization does not break layout, hierarchy, or readability in any supported language. |

### Long-Term Goals

*The enduring standard the platform must ultimately meet.*

| Goal | Description |
|------|-------------|
| **Industry-defining design benchmark** | The platform is cited as the design reference for professional audit and financial software. |
| **Zero-training onboarding for core tasks** | New users accomplish meaningful work without formal training or documentation. |
| **Effortless long-session use** | Professionals report the platform is comfortable across full working days, weeks, and audit seasons. |
| **Client-presentable at every screen** | Users are confident sharing any screen with clients, regulators, or board members without preparation. |
| **Design system self-sustainability** | New features built by any team automatically look and feel native to the platform. |
| **Inclusive by certification** | The platform meets or exceeds international accessibility standards as verified by formal audit. |
| **Design-driven competitive advantage** | User experience quality is a primary reason firms choose and retain the platform. |

---

## 7. Anti-Patterns

Anti-patterns define what this design system must **never become**. They are as important as the principles we follow. When a design decision resembles any of the following, it must be rejected and redesigned.

### Visual Anti-Patterns

| Anti-Pattern | Why It Is Forbidden |
|--------------|---------------------|
| **Do not look like Excel** | Spreadsheet mimicry traps users in manual, error-prone workflows and signals that the platform is a glorified grid — not a professional system. |
| **Do not overload dashboards** | Dashboards covered in widgets, charts, and counters create anxiety without insight. One meaningful dashboard is worth ten noisy ones. |
| **Do not use excessive color** | Color is a semantic signal, not decoration. Rainbow interfaces destroy hierarchy and fatigue the eye during long sessions. |
| **Do not create visual noise** | Competing borders, shadows, backgrounds, and badges on the same surface destroy hierarchy and signal low craft. |
| **Do not overuse icons** | Icons supplement labels; they do not replace them. Ambiguous icon-only interfaces fail under professional scrutiny. |
| **Do not use gratuitous gradients or effects** | Visual effects that do not communicate state, depth, or interactivity are decoration — and decoration is not our language. |
| **Do not mix design eras** | Combining modern layouts with legacy controls, old-style dialogs, or inconsistent component styles erodes trust instantly. |

### Interaction Anti-Patterns

| Anti-Pattern | Why It Is Forbidden |
|--------------|---------------------|
| **Do not create giant forms** | Long scrolling forms overwhelm users and increase error rates. Break complex input into logical, progressive steps. |
| **Do not hide critical actions** | Actions with professional consequences must be visible and deliberate — not buried in overflow menus or invisible gestures. |
| **Do not overuse modals** | Modal stacking traps users, breaks context, and signals poor information architecture. Use panels, drawers, and inline expansion instead. |
| **Do not surprise with destructive behavior** | Undeletable deletions, silent data loss, and unconfirmed state changes are unacceptable in a platform built for accountability. |
| **Do not overuse animations** | Motion must communicate state change or guide attention. Gratuitous animation distracts and slows professional work. |
| **Do not force unnecessary confirmation** | Confirming every routine action trains users to click through blindly, defeating the purpose of confirmation dialogs. |
| **Do not block without explanation** | Disabled controls, loading states, and permission denials must always explain why the user cannot proceed. |

### Information Anti-Patterns

| Anti-Pattern | Why It Is Forbidden |
|--------------|---------------------|
| **Do not dump data without hierarchy** | Raw data presentation is not a feature. Information must be structured, prioritized, and contextualized. |
| **Do not use jargon without purpose** | Technical and domain language is appropriate when precise. Obscure labels that do not match professional vocabulary are not. |
| **Do not show system internals to users** | Error codes, stack traces, and database concepts belong in logs — not in the interface. |
| **Do not present equal visual weight to unequal information** | When everything is bold, nothing is bold. Hierarchy failure causes missed critical information. |
| **Do not hide audit trail information** | Users must always be able to understand the history and ownership of records they are reviewing. |

### Enterprise Anti-Patterns

| Anti-Pattern | Why It Is Forbidden |
|--------------|---------------------|
| **Do not replicate legacy ERP navigation** | Deep menu trees, cryptic module codes, and tab forests reflect organizational structure — not user mental models. |
| **Do not design for administrators only** | The majority of users are practitioners doing daily work — not system configurators. |
| **Do not sacrifice usability for configurability** | Infinite customization creates inconsistent experiences and support burden. Sensible defaults with controlled flexibility is the model. |
| **Do not treat mobile as an afterthought** | Reviewers and partners use tablets. Read-only and approval workflows must be fully usable on non-desktop devices. |
| **Do not design features in isolation** | Every screen must feel like part of one platform — not a collection of independently designed modules stitched together. |

---

## 8. Success Criteria

Design success in this platform is measurable. The following criteria define how we evaluate whether the design system is achieving its purpose — not through subjective preference, but through observable outcomes.

### User Efficiency

| Criterion | Measure |
|-----------|---------|
| Task completion time | Core workflows complete in fewer steps and less time than legacy tool equivalents |
| Error rate | User errors during data entry, review, and sign-off decrease as design clarity improves |
| Keyboard utilization | Power users complete a growing percentage of tasks without mouse interaction |
| Repeat action reduction | Batch operations and smart defaults eliminate repetitive manual work |

### Learnability

| Criterion | Measure |
|-----------|---------|
| Time to first meaningful action | New users complete a relevant task within their first session without external training |
| Support ticket volume | UI confusion-related support requests decrease as consistency and clarity improve |
| Feature discovery | Users find and adopt new capabilities through in-product guidance, not documentation |
| Onboarding completion | Organization and workspace setup flows complete with minimal abandonment |

### Visual Consistency

| Criterion | Measure |
|-----------|---------|
| Component compliance | All screens use design system components — no one-off visual implementations |
| Cross-module coherence | Audit, reporting, and intelligence modules are visually indistinguishable in craft quality |
| Review pass rate | Design review catches fewer consistency violations with each release cycle |
| Agent and developer adherence | AI agents and developers produce visually native output by following this document |

### Accessibility

| Criterion | Measure |
|-----------|---------|
| Contrast compliance | All text and interactive elements meet WCAG 2.1 AA contrast requirements |
| Keyboard navigability | All workflows are operable via keyboard alone |
| Screen reader compatibility | Core workflows are navigable and comprehensible with assistive technology |
| Touch target sizing | All interactive elements meet minimum touch target dimensions |

### Professional Appearance

| Criterion | Measure |
|-----------|---------|
| Client presentation confidence | Users report willingness to share any screen with external parties without modification |
| Visual quality perception | User research sessions describe the platform as "modern," "clean," and "professional" |
| Competitive comparison | Design quality is favorably compared to consumer-grade SaaS, not legacy enterprise tools |
| Zero rough edges | No misaligned elements, broken layouts, or inconsistent spacing in production views |

### Long-Session Comfort

| Criterion | Measure |
|-----------|---------|
| Session duration tolerance | Users report comfort during sessions exceeding four hours |
| Eye strain reports | Low incidence of visual fatigue complaints in user feedback |
| Dark mode adoption and satisfaction | Dark mode is fully refined — not a color inversion, but a considered alternative environment |
| Information density balance | Users report screens feel "spacious" or "well-organized" — not "empty" or "crowded" |

### Enterprise Readiness

| Criterion | Measure |
|-----------|---------|
| Role-appropriate presentation | Different roles see correctly scoped interfaces without manual reconfiguration |
| Regulatory confidence | Design supports audit trail visibility, sign-off clarity, and evidence traceability |
| Scale without degradation | Visual quality and performance remain consistent as data volume and user count grow |
| Multi-tenant visual integrity | Each organization's workspace feels dedicated and professional — never shared or generic |

---

## Document Governance

This document is maintained by the design system architecture team and reviewed alongside product and engineering leadership. All proposed deviations must be documented, justified, and approved before implementation.

Future parts of this document will define the specific tokens, components, patterns, and governance processes that implement the principles established here.

**Part 1 is complete. Await Part 2 instruction.**

---

*End of Part 1*

---

# Part 2 — Layout System

## 9. Layout Philosophy

### The Purpose of Layout

Layout is the architecture of attention. In an enterprise audit platform, users process large volumes of structured information — engagements, workpapers, financial data, review notes, and compliance artifacts. Layout determines whether that information feels manageable or overwhelming.

Our layout philosophy treats every screen as a **professional workspace**: ordered, calm, predictable, and optimized for sustained analytical work. The interface organizes information so users can orient instantly, focus deeply, and move between tasks without losing context.

### Calm Layouts

A calm layout reduces visual anxiety before the user reads a single word.

Calm layouts are achieved through:

- Generous margins that prevent content from touching screen edges
- Clear separation between navigation, context, and primary work areas
- Limited simultaneous content regions — typically no more than three active zones
- Restrained use of borders, dividers, and background contrast
- Absence of competing focal points

Calm does not mean sparse. A data-dense audit view can be calm when hierarchy is strong and spacing is disciplined. Calm means the layout never adds stress to an already demanding task.

### Visual Breathing Room

Breathing room is intentional space that allows content to be perceived as distinct groups. It is not wasted pixels — it is the medium through which hierarchy communicates.

| Breathing Room Function | Application |
|-------------------------|-------------|
| **Isolation** | Primary content is separated from chrome and secondary panels |
| **Grouping** | Related fields, rows, and cards are closer to each other than to unrelated content |
| **Recovery** | Dense data regions are followed by space before the next major section |
| **Focus** | The current task area receives more space than peripheral context |

Breathing room scales with content weight. Lightweight forms receive more space per field. Heavy data tables receive structured internal rhythm with generous external margins.

### Predictable Positioning

Users build spatial memory. When navigation always lives in the same region, actions always appear in the same zone, and content always flows from the same origin, users navigate by position as much as by reading.

Predictable positioning rules:

| Region | Purpose |
|--------|---------|
| **Top** | Global context — organization, workspace, user, primary navigation |
| **Left** | Structural navigation — modules, engagements, entity hierarchy |
| **Center** | Primary work surface — the user's current task |
| **Right** | Supplementary context — detail panels, properties, activity, comments |
| **Bottom** | Persistent actions only when necessary — prefer top-aligned action bars |

Position never changes arbitrarily between modules. A detail panel on the right in Audit appears on the right in Reporting.

### Focus Management

Focus management ensures the layout directs attention to the current task without trapping the user.

Principles:

- **One primary work area** dominates each view — typically 60–75% of horizontal space on desktop
- **Secondary panels** support the primary task — they do not compete with it
- **Active state is visible** — selected records, open panels, and current steps are clearly distinguished
- **Depth replaces distraction** — overlays and panels de-emphasize background content rather than hiding it abruptly

When a user opens a detail panel, the primary list remains visible. When a user enters a focused mode (review, sign-off, presentation), the layout simplifies deliberately — removing peripheral chrome with an explicit entry and exit.

### Progressive Density

Not every view requires the same information density. Layout density adapts to context:

| Density Level | Use Case | Characteristics |
|---------------|----------|-----------------|
| **Comfortable** | Onboarding, settings, executive summaries | Generous spacing, larger type, fewer items per view |
| **Standard** | Daily workflows, forms, detail views | Balanced spacing, default type scale |
| **Compact** | Data tables, working papers, analytical grids | Tighter row height, preserved readability, maintained touch targets |
| **Dense** | Power-user views, comparison tables, bulk review | Maximum information per viewport, optional user toggle |

Density is never forced without user control. Compact and dense modes are available where professionally appropriate — never as the only option.

### Hierarchy in Layout

Layout hierarchy is expressed through position, size, and enclosure — in that order of reliability.

1. **Position** — Top-left content is seen first (in LTR locales). Primary content occupies the largest central region.
2. **Size** — More important regions receive more viewport area.
3. **Enclosure** — Cards and panels group related content. Enclosure is used sparingly — excessive boxing creates visual noise.

Layout hierarchy must align with information hierarchy. If the most important element on screen is a warning, the layout must give it position and space — not bury it in a secondary panel.

---

## 10. Grid System

### Grid Philosophy

The grid is an invisible structure that ensures every element on every screen belongs to a coherent spatial system. Users never see the grid, but they feel its discipline in the alignment and rhythm of the interface.

Our grid philosophy:

- **Consistency over novelty** — the same grid logic applies across all modules
- **Content-driven columns** — column count adapts to viewport, but alignment logic remains constant
- **Fluid with constraints** — layouts expand and contract gracefully, but content width has maximum readable bounds
- **Alignment is mandatory** — elements that appear aligned must be mathematically aligned to the grid

### Breakpoint Overview

| Breakpoint | Target Devices | Primary Use Context |
|------------|----------------|---------------------|
| **Mobile** | Phones (320–767px) | Notifications, quick approvals, status checks, light fieldwork |
| **Tablet** | Tablets (768–1023px) | Review sessions, client meetings, read-heavy workflows |
| **Laptop** | Small laptops (1024–1439px) | Primary practitioner workstation |
| **Desktop** | Standard monitors (1440–1919px) | Standard professional workstation — design reference viewport |
| **Large** | Large monitors (1920–2559px) | Multi-panel workflows, side-by-side comparison |
| **Ultra-wide** | Ultra-wide monitors (2560px+) | Command-center layouts with controlled content width |

### Desktop (1440px — Design Reference)

Desktop is the **primary design reference viewport**. All core workflows are designed and validated at this width first.

| Property | Specification |
|----------|-----------------|
| Grid columns | 12 columns |
| Column gutter | Consistent horizontal gap between columns |
| Page margin | Generous outer margin — content never touches viewport edge |
| Sidebar width | Fixed, collapsible — navigation remains stable |
| Content area | Remaining columns after sidebar and optional right panel |
| Maximum content width | Content text and forms do not exceed comfortable reading width, even when viewport is wider |
| Right panel | Optional, fixed width — detail, properties, activity |

Desktop layout anatomy:

```
┌─────────────────────────────────────────────────────────────┐
│  Global Header                                              │
├──────────┬──────────────────────────────────┬───────────────┤
│          │                                  │               │
│  Sidebar │  Primary Content Area            │  Right Panel  │
│  (Nav)   │  (Main Work Surface)             │  (Optional)   │
│          │                                  │               │
│          │                                  │               │
└──────────┴──────────────────────────────────┴───────────────┘
```

### Laptop (1024–1439px)

Laptop layouts preserve the desktop anatomy with adjusted proportions.

| Adjustment | Behavior |
|------------|----------|
| Sidebar | Remains visible — may narrow to icon-only mode |
| Right panel | Overlays or collapses to drawer — not displayed simultaneously with narrow content |
| Content area | Receives priority — sidebar yields space before content compresses below readable width |
| Typography | No reduction in body text size — layout adapts, type does not shrink |

### Tablet (768–1023px)

Tablet layouts shift from persistent multi-panel to **sequential panel** model.

| Adjustment | Behavior |
|------------|----------|
| Sidebar | Collapses to icon rail or hamburger navigation |
| Right panel | Becomes full-screen drawer or bottom sheet |
| Content area | Full width when no panel is open |
| Touch targets | All interactive elements meet minimum touch dimensions |
| Orientation | Layout adapts to portrait and landscape — landscape preferred for data views |

### Mobile (320–767px)

Mobile is not a miniature desktop. It is a **focused, task-specific** presentation layer.

| Adjustment | Behavior |
|------------|----------|
| Navigation | Bottom tab bar or hamburger — never persistent sidebar |
| Content | Single column, single focus |
| Panels | Full-screen overlays |
| Tables | Transform to card lists or horizontal scroll with pinned columns |
| Actions | Primary action fixed to accessible thumb zone |
| Forms | One field group per screen in multi-step flows |

### Content Width

Content width is constrained independently of viewport width to preserve readability.

| Content Type | Width Principle |
|--------------|-----------------|
| **Prose and descriptions** | Narrow — optimal reading line length |
| **Forms** | Moderate — fields do not stretch to full viewport on wide screens |
| **Data tables** | Fluid — expand to available space with horizontal scroll when necessary |
| **Dashboards** | Fluid with internal grid — widgets align to column grid |
| **Settings** | Moderate — grouped sections with clear labels |

On ultra-wide monitors, content does not stretch indefinitely. Excess viewport space is allocated to secondary panels, whitespace, or contextual information — not to stretching form fields or text lines.

### Sidebars

| Sidebar Type | Behavior |
|--------------|----------|
| **Navigation sidebar** | Persistent on desktop and laptop. Collapsible to icon rail. Hidden on mobile. |
| **Context sidebar** | Shows entity tree, engagement structure, or file hierarchy. Collapsible. |
| **Filter sidebar** | Available in data-heavy views. Opens as panel, not permanent fixture. |

Sidebars have fixed widths at each breakpoint. They do not resize arbitrarily. Collapse is always user-controlled and state-persisted.

### Containers

Containers define the horizontal bounds of page content.

| Container Type | Purpose |
|----------------|---------|
| **Page container** | Outermost content boundary within the viewport |
| **Section container** | Groups major page sections with consistent vertical spacing |
| **Card container** | Encloses related content with surface treatment |
| **Inline container** | Groups form fields or related controls |

Containers nest predictably: page contains sections, sections contain cards, cards contain content. Nesting never exceeds three levels of visual enclosure.

### Maximum Readable Widths

Readable width protects typography and comprehension.

| Content | Principle |
|---------|-----------|
| Body text | Line length supports comfortable reading — approximately 60–80 characters |
| Form labels and inputs | Input fields have maximum width — wide screens do not produce wide inputs |
| Headings | May span wider than body, but not full viewport on ultra-wide displays |
| Tables | Exempt from readable width — governed by data density rules |

### Alignment

All elements align to the grid. Specific alignment rules:

- Text aligns to column edges, not to arbitrary pixel positions
- Form labels align vertically across a form group
- Table columns align to consistent horizontal positions across pages
- Icons align to text baselines or vertical centers — never float arbitrarily
- Action buttons align to consistent positions within their container zone

### Spacing Rhythm

Horizontal and vertical spacing derive from the spacing system (Section 12). Grid gutters and margins are spacing tokens — not arbitrary values. The grid and spacing system together create the platform's spatial rhythm.

---

## 11. Responsive Philosophy

### Dual Foundation

This platform adopts a **dual responsive foundation**:

| Approach | Purpose |
|----------|---------|
| **Desktop-first enterprise** | Core professional workflows are designed for desktop and laptop viewports where practitioners spend the majority of their working time |
| **Mobile-first usability** | Touch ergonomics, readable type, and accessible targets are designed into components from the start — not retrofitted |

Desktop-first does not mean mobile-ignored. It means the full professional workflow exists on desktop, while mobile delivers focused, high-value capability.

### Adaptive Layouts

Layouts adapt structurally at breakpoints — not just proportionally.

| Viewport Change | Adaptation |
|-----------------|------------|
| Desktop to laptop | Panels compress, sidebar may narrow |
| Laptop to tablet | Sidebar collapses, panels become overlays |
| Tablet to mobile | Single column, navigation restructures |
| Mobile to mobile (landscape) | Data views gain horizontal space; navigation remains compact |

Adaptation is **discrete**, not fluid-to-breaking. Components snap to layout modes at defined breakpoints rather than degrading gradually into broken intermediate states.

### Progressive Disclosure in Responsive Context

As viewport narrows, information is removed from view — not shrunk.

| Priority | Responsive Behavior |
|----------|---------------------|
| Primary content | Always visible |
| Secondary metadata | Moves to detail panel or expandable row |
| Tertiary actions | Move to overflow menu |
| Navigation | Collapses to compact form |
| Column data | Hidden with column picker or revealed on row expansion |

Shrinking text, icons, or touch targets to fit more content on small screens is forbidden. If it does not fit, it is disclosed progressively.

### Touch Optimization

Touch is a first-class input method on tablet and mobile.

| Requirement | Standard |
|-------------|----------|
| Minimum touch target | Generous — comfortable for finger interaction |
| Spacing between targets | Sufficient to prevent mis-tap |
| Gesture support | Swipe for panel dismiss, pull for refresh where appropriate |
| Hover states | Never required for functionality — hover enhances desktop, does not gate access |
| Scroll | Natural momentum scrolling — no nested scroll traps |

### Large Monitors

Large monitors (1920–2559px) are an opportunity for **parallel context**, not stretched content.

| Strategy | Application |
|----------|-------------|
| Persistent right panel | Detail view alongside list — no click required to see context |
| Split view | Compare two records side by side |
| Dashboard expansion | More widgets visible without scrolling |
| Content width cap | Primary content respects maximum readable width |

### Ultra-Wide Monitors

Ultra-wide monitors (2560px+) require **deliberate constraint**.

| Strategy | Application |
|----------|-------------|
| Centered content column | Primary work area centered with contextual panels on sides |
| Three-zone layout | Navigation left, content center, detail right — all within comfortable widths |
| No full-bleed forms | Form fields do not stretch across ultra-wide viewports |
| Optional density increase | Compact mode available — not default |

Ultra-wide layouts must not create a "wall of interface" effect. Whitespace on ultra-wide displays is intentional and professional.

### Foldables and Emerging Form Factors

Foldable devices and dual-screen hardware are treated as **adaptive tablet** class with additional capability:

- When unfolded, treat as tablet landscape or small laptop depending on width
- When folded, treat as mobile
- Never assume a single fixed orientation
- Panel transitions must be smooth across fold state changes

---

## 12. Spacing System

### Spacing Philosophy

Spacing is the primary tool for creating hierarchy, grouping, and visual calm. In this design system, spacing is **systematic, not intuitive**. Every gap, margin, and padding derives from a defined scale.

Spacing communicates relationship:

| Proximity | Meaning |
|-----------|---------|
| **Tight** | Strongly related — label and input, icon and text |
| **Standard** | Related — items within a group |
| **Generous** | Separated — distinct groups within a section |
| **Wide** | Independent — major page sections |

### The 8-Point System

All spacing values are multiples of a base unit of **8**. This creates mathematical harmony across the interface and eliminates arbitrary pixel decisions.

| Token Tier | Multiplier | Typical Use |
|------------|------------|-------------|
| **Micro** | 0.5× base (4) | Icon-to-text gap, inline element spacing |
| **XS** | 1× base (8) | Tight component internal padding |
| **SM** | 1.5× base (12) | Compact component padding, dense list items |
| **MD** | 2× base (16) | Standard component padding, form field gaps |
| **LG** | 3× base (24) | Card padding, section internal spacing |
| **XL** | 4× base (32) | Section separation, page section gaps |
| **2XL** | 6× base (48) | Major section breaks |
| **3XL** | 8× base (64) | Page-level vertical rhythm |

Half-steps (4px) are permitted only for optical adjustments within components — never for layout-level spacing.

### Vertical Rhythm

Vertical rhythm creates a consistent cadence as users scroll through content.

| Level | Spacing |
|-------|---------|
| Between form fields | Standard tier |
| Between form groups | Large tier |
| Between cards in a list | Standard to large tier |
| Between page sections | Extra-large tier |
| Between page header and content | Extra-large tier |
| Page top and bottom margin | 2× extra-large tier |

Vertical rhythm is maintained across breakpoints. When layout adapts, spacing tokens remain constant — only layout structure changes.

### Horizontal Rhythm

Horizontal rhythm governs side-by-side relationships.

| Level | Spacing |
|-------|---------|
| Inline icon and label | Micro tier |
| Button group gap | Extra-small to small tier |
| Form column gap | Large tier |
| Card grid gap | Large tier |
| Column gutter | Large tier |
| Page margin | Extra-large to 2× extra-large tier |

### Component Spacing

Each component category has defined internal and external spacing:

| Component | Internal Padding | External Margin |
|-----------|------------------|-----------------|
| Button | Horizontal: standard. Vertical: small to standard | Adjacent buttons: extra-small gap |
| Input | Horizontal: standard. Vertical: small to standard | Below input: micro gap to label, standard gap to next field |
| Card | Large on all sides | Large between cards |
| Table cell | Small horizontal, small vertical | N/A — grid defines structure |
| Modal | Extra-large on all sides | N/A — overlay defines context |
| Sidebar item | Standard horizontal, small vertical | None — list defines structure |

### Page Spacing

Page-level spacing creates the outer frame of every screen.

| Element | Spacing |
|---------|---------|
| Page header to first content block | Extra-large |
| Between major content blocks | Extra-large to 2× extra-large |
| Page content to viewport edge | Extra-large minimum (via page margin) |
| Fixed action bar to content | Standard padding within bar, extra-large clearance above |

### Section Spacing

Sections are logical groupings within a page — a form section, a dashboard group, a settings category.

| Section Anatomy | Spacing |
|-----------------|---------|
| Section title to section content | Standard to large |
| Between items within section | Standard |
| Between sections | Extra-large |
| Section divider to content | Large above and below |

### Visual Balance

Spacing creates balance when distributed intentionally:

- **Symmetric balance** — equal spacing on left and right of centered content
- **Asymmetric balance** — more space on the content side, less on the navigation side, creating visual weight toward the work area
- **Vertical balance** — content is not top-crushed; adequate padding at page bottom for scroll completion comfort

### Density Levels

Spacing scales with density mode:

| Density | Spacing Modifier |
|---------|------------------|
| Comfortable | 1.25× standard spacing |
| Standard | 1× — default |
| Compact | 0.75× spacing — never below minimum touch target requirements |
| Dense | 0.625× spacing — table and grid interiors only |

Density changes spacing proportionally. It does not remove spacing categories — tight remains tighter than standard, but all relationships preserve their relative hierarchy.

---

# Part 3 — Visual Foundations

## 13. Color Philosophy

### Color as Meaning

Color in this platform is a **semantic instrument** — not a decorative one. Every color application communicates state, priority, category, or interactivity. When color is removed, the interface must remain fully comprehensible through typography, position, and iconography.

Color carries emotional weight. In a profession built on judgment and trust, color must reinforce confidence — not create alarm, confusion, or visual fatigue.

### Emotional Use of Color

| Emotional Goal | Color Approach |
|----------------|----------------|
| **Trust** | Cool, stable neutrals as foundation. Restrained primary accent. |
| **Calm** | Low-saturation surfaces. Absence of competing hues. |
| **Clarity** | High contrast for text. Distinct but muted status colors. |
| **Confidence** | Consistent color logic — same meaning everywhere. |
| **Urgency** | Reserved exclusively for genuine warnings and errors — never for marketing or decoration. |

The platform must feel composed under pressure. During month-end close or audit sign-off, the interface does not amplify stress through aggressive color.

### Semantic Color Roles

Every color in the system maps to a semantic role. No color is used outside its assigned meaning.

#### Primary

The primary color represents **brand identity and primary action**.

| Attribute | Definition |
|-----------|------------|
| Purpose | Primary buttons, key interactive elements, active navigation indicators |
| Character | Confident, professional, not aggressive |
| Usage | One primary color. One primary action per view uses it. |
| Restraint | Primary color appears on a minority of any screen |

#### Secondary

Secondary color supports **alternative actions and supplementary emphasis**.

| Attribute | Definition |
|-----------|------------|
| Purpose | Secondary buttons, tags, badges, supplementary highlights |
| Character | Complementary to primary — quieter, supportive |
| Usage | Never competes with primary for attention |

#### Success

Success color communicates **positive completion and confirmed state**.

| Attribute | Definition |
|-----------|------------|
| Purpose | Completed steps, saved state, passed checks, approved status |
| Character | Natural, reassuring green family — muted, not fluorescent |
| Usage | Status indicators, toast confirmations, progress completion |
| Restraint | Not used for decorative purposes or large background areas |

#### Warning

Warning color communicates **caution requiring attention — not yet failure**.

| Attribute | Definition |
|-----------|------------|
| Purpose | Approaching deadlines, incomplete requirements, soft validation concerns |
| Character | Warm amber family — noticeable without alarm |
| Usage | Banner alerts, status badges, field-level cautions |
| Restraint | Never used for marketing or non-actionable information |

#### Danger

Danger color communicates **error, failure, destructive action, or critical risk**.

| Attribute | Definition |
|-----------|------------|
| Purpose | Validation errors, failed operations, delete/destructive buttons, critical alerts |
| Character | Controlled red family — clear without panic |
| Usage | Error messages, destructive action buttons, critical status |
| Restraint | Appears only when genuinely necessary. Chronic danger color desensitizes users. |

#### Information

Information color communicates **neutral guidance and informational state**.

| Attribute | Definition |
|-----------|------------|
| Purpose | Tips, informational banners, help text accents, new feature indicators |
| Character | Cool blue family — calm and instructive |
| Usage | Informational toasts, help panel accents, neutral alerts |
| Restraint | Not a substitute for primary brand color |

#### Neutral

Neutral colors form the **structural backbone** of the interface.

| Attribute | Definition |
|-----------|------------|
| Purpose | Text, borders, dividers, disabled states, backgrounds, icons |
| Character | Warm or cool grey family — consistent temperature across the system |
| Scale | Multiple steps from near-white to near-black |
| Usage | The majority of the interface is neutral |

#### Surface

Surface colors define **elevated and contained areas**.

| Attribute | Definition |
|-----------|------------|
| Purpose | Cards, panels, modals, dropdowns, sidebars |
| Character | Slightly differentiated from background — subtle, not stark |
| Levels | Background → surface → elevated surface — maximum three levels |
| Dark mode | Surfaces lighten progressively in dark mode (toward foreground) |

#### Background

Background is the **canvas** upon which all content rests.

| Attribute | Definition |
|-----------|------------|
| Purpose | Page background, app shell |
| Character | The quietest color in the system — recedes completely |
| Usage | Never used for interactive elements |

#### Borders

Border colors define **separation without enclosure overload**.

| Attribute | Definition |
|-----------|------------|
| Purpose | Input borders, dividers, table lines, card outlines |
| Character | Low-contrast neutral — visible when needed, invisible when not |
| States | Default, hover, focus, error — each with distinct but restrained treatment |
| Restraint | Prefer spacing over borders for grouping. Borders are a precision tool. |

### Color Application Rules

| Rule | Description |
|------|-------------|
| **Never overload color** | Any screen with more than three distinct hue families is over-colored |
| **Status colors are sacred** | Success, warning, danger, and information colors are never used decoratively |
| **Backgrounds stay quiet** | Large areas use neutral and surface colors only |
| **Text contrast is mandatory** | All text meets accessibility contrast requirements against its background |
| **Dark mode is native** | Every color role has a dark mode equivalent — not an inversion |
| **Color names are semantic** | Components reference roles (primary, danger), not hue values (blue, red) |

---

## 14. Typography Philosophy

### Typography as Infrastructure

Typography is the primary vehicle for information in an audit platform. Users read thousands of words per session — labels, table data, review notes, financial figures, and regulatory text. Typography must be **invisible in style and unmissable in function**.

### Type Hierarchy

A clear type hierarchy enables scanning. Users identify page title, section header, body content, and metadata without conscious effort.

| Level | Role | Characteristics |
|-------|------|-----------------|
| **Display** | Marketing and onboarding hero text only | Largest scale, tight tracking, semibold or bold |
| **Heading 1** | Page title — one per screen | Large, semibold, high contrast |
| **Heading 2** | Major section title | Medium-large, semibold |
| **Heading 3** | Subsection title, card header | Medium, semibold or medium weight |
| **Heading 4** | Group label, panel title | Small-medium, medium weight |
| **Body** | Primary content, descriptions, paragraphs | Standard size, regular weight, comfortable line height |
| **Body Small** | Secondary content, helper text | Reduced size, regular weight |
| **Caption** | Timestamps, metadata, tertiary labels | Smallest size, regular or medium weight, reduced contrast |
| **Overline** | Category labels, section prefixes | Small, uppercase or tracked, medium weight |
| **Monospace** | Code, IDs, technical references, hash values | Fixed-width family, same size as adjacent body text |

### Headings

Headings structure the page. They are navigation landmarks as much as labels.

- One Heading 1 per page — it names the current context
- Headings never skip levels for visual effect
- Heading weight and size create hierarchy — not color alone
- Headings are concise — they label, not describe

### Body Text

Body text is optimized for **extended reading**.

| Property | Standard |
|----------|----------|
| Line height | Generous — approximately 1.5× font size |
| Line length | Constrained to comfortable reading width |
| Paragraph spacing | Clear separation between paragraphs |
| Weight | Regular for content, medium for emphasis — bold used sparingly in body |
| Color | High contrast against surface — secondary body uses reduced contrast |

### Captions and Metadata

Captions carry supporting information — timestamps, author names, version numbers, status qualifiers.

- Always smaller than the content they describe
- Reduced contrast — visible but subordinate
- Never compete with primary content for attention
- Consistent placement — metadata appears in predictable positions

### Tables

Table typography prioritizes **scannability and numeric alignment**.

| Element | Treatment |
|---------|-----------|
| Column headers | Small to body size, medium weight, subdued color |
| Cell data | Body small size, regular weight |
| Numeric data | Tabular figures — digits align vertically |
| Row emphasis | Medium weight or subtle background — not bold text |
| Totals and subtotals | Medium weight, optional separator above |

Tables never reduce text below readable minimums, even in compact density mode.

### Forms

Form typography creates clear **label-to-input relationships**.

| Element | Treatment |
|---------|-----------|
| Field label | Body small, medium weight, above input |
| Required indicator | Adjacent to label — not replacing it |
| Input text | Body size, regular weight |
| Placeholder | Reduced contrast — never mistaken for entered value |
| Helper text | Caption size, below input |
| Error message | Caption size, danger color, below input with icon |
| Section label | Heading 3 or 4 — groups related fields |

### Charts and Data Visualization

Chart typography is **minimal and functional**.

- Axis labels: caption size
- Data labels: body small — only when necessary
- Chart title: heading 3 or 4
- Legend: body small
- Tooltips: body small on surface background

Chart text never decorates — it clarifies.

### Professional Readability

This platform serves professionals who read critically. Typography supports that:

| Principle | Application |
|-----------|---------------|
| **Legibility over personality** | Typeface is modern and neutral — it does not express brand at the expense of reading |
| **Consistent family** | One primary type family for the entire platform. Monospace reserved for technical content. |
| **No decorative type** | Display type is used only in onboarding and marketing surfaces |
| **Figures matter** | Financial data uses tabular lining figures for column alignment |
| **Locale awareness** | Type scales accommodate scripts for all supported languages without breaking layout |

### Long-Session Comfort

Typography is tuned for eight-hour readability:

- No text below minimum accessible size at any density level
- Sufficient contrast in both light and dark mode
- Line heights that prevent vertical crowding
- No all-caps body text — uppercase reserved for overlines and labels of three words or fewer
- Weight variation preferred over size reduction for emphasis

---

## 15. Iconography

### Icons as Visual Vocabulary

Icons compress meaning into a compact visual form. In this platform, icons **support text — never replace it** unless the icon is universally unambiguous (close, search, settings, add).

Icons are a shared vocabulary. When an icon is assigned a meaning, that meaning is consistent across every module.

### Consistency

| Rule | Description |
|------|-------------|
| **One icon set** | A single icon family is used throughout the platform |
| **One style** | Outlined or filled — not mixed arbitrarily within the same context |
| **One size per context** | Navigation icons, inline icons, and standalone icons each have defined sizes |
| **One meaning per icon** | An icon never represents different concepts in different contexts |
| **Optical alignment** | Icons are visually centered with adjacent text — mathematically centered when needed |

### Recognition

Icons must be **instantly recognizable** to international professional users.

| Category | Examples |
|----------|----------|
| **Universal** | Search, close, add, delete, edit, settings, menu, chevron, check, alert |
| **Domain-specific** | Engagement, workpaper, evidence, sign-off, review note — must include text label |
| **Forbidden** | Abstract metaphors, overly clever representations, culture-specific symbols |

When recognition is uncertain, use text. A labeled button is always preferable to a mysterious icon.

### Stroke Philosophy

The platform uses **outlined icons** as the default style.

| Attribute | Standard |
|-----------|----------|
| Stroke weight | Consistent across all icons — matches typography weight visually |
| Corner radius | Consistent rounding — coherent with platform border radius |
| Grid | Icons designed on a consistent grid — typically 24×24 logical units |
| Padding | Icons have internal padding within their bounding box for optical balance |

Outlined icons are lighter, calmer, and more scalable across sizes. They align with the platform's minimal visual language.

### Filled vs Outlined

| Style | Usage |
|-------|-------|
| **Outlined** | Default — navigation, inline actions, table actions, form accessories |
| **Filled** | Active/selected state only — active navigation item, toggled feature, starred item |
| **Solid circle background** | Notification badges, count indicators, status dots |

Filled icons indicate **state change**, not a separate icon vocabulary. The same icon transitions from outlined to filled when its context becomes active.

### Semantic Meaning

Icons carry consistent semantic meaning:

| Meaning | Icon Concept |
|---------|-------------|
| Create / Add | Plus |
| Remove / Delete | Trash (destructive) or minus (remove from list) |
| Edit | Pencil |
| View | Eye |
| Download | Arrow down to surface |
| Upload | Arrow up from surface |
| Search | Magnifying glass |
| Filter | Funnel |
| Sort | Arrows vertical |
| More actions | Ellipsis |
| Close | X |
| Expand | Chevron down |
| Collapse | Chevron up |
| Navigate forward | Chevron right |
| Status: success | Check circle |
| Status: warning | Alert triangle |
| Status: error | Alert circle |
| Status: info | Info circle |

Domain-specific icons are documented in the component library (future part).

### Accessibility

Icons must be accessible to all users:

| Requirement | Standard |
|-------------|----------|
| **Decorative icons** | Hidden from assistive technology when adjacent text conveys meaning |
| **Functional icons** | Accessible name provided — aria-label or visible text |
| **Icon-only buttons** | Always have accessible label — tooltip is insufficient alone |
| **Color** | Icons never rely on color alone to convey meaning |
| **Size** | Minimum touch target met for interactive icons |
| **Contrast** | Icon stroke meets contrast requirements against its background |

---

## 16. Elevation & Depth

### Depth as Organization

Depth organizes the interface into perceptible layers. Users understand what is background, what is content, what is floating above, and what demands immediate attention — through depth cues, not through explicit explanation.

Depth in this platform is **subtle and functional**. We do not simulate physical space for aesthetic effect. Every depth level communicates a structural relationship.

### Surface Levels

| Level | Name | Purpose |
|-------|------|---------|
| **0** | Background | Page canvas — the lowest layer |
| **1** | Surface | Cards, panels, sidebar — resting on background |
| **2** | Elevated | Dropdowns, popovers, sticky headers — above surface |
| **3** | Overlay | Modals, dialogs, command palette — above all content |
| **4** | Toast | Notifications — highest transient layer |

No more than four persistent depth levels exist. Transient elements (tooltips) may appear at level 2 without counting as a system level.

### Cards

Cards are the primary **content container** in the platform.

| Property | Standard |
|----------|----------|
| Surface | Level 1 — resting on background |
| Border | Subtle border or shadow — not both prominently |
| Radius | Consistent corner radius — platform-wide token |
| Padding | Large internal spacing |
| Hover | Subtle elevation increase on interactive cards |
| Selected | Border accent or background shift — not elevation jump |

Cards group related content. They do not nest more than one level deep. A card within a card requires strong justification.

### Surfaces

Surfaces are any distinct plane that separates content from background:

| Surface | Depth Treatment |
|---------|-----------------|
| Sidebar | Level 1 — subtle differentiation from main background |
| Main content area | Level 0 or 1 depending on background treatment |
| Right panel | Level 1 — same as sidebar |
| Dropdown menu | Level 2 — clearly floating |
| Modal backdrop | Scrim over level 0–1 — dims content beneath |

### Glass and Translucency

Glass effects (translucent surfaces with blur) are used **sparingly**:

| Context | Permitted |
|---------|-----------|
| Sticky header over scrolling content | Yes — maintains context without solid bar |
| Command palette | Yes — floats above workspace |
| Mobile bottom navigation | Yes — content scrolls beneath |
| Standard cards and panels | No — use solid surfaces |
| Data tables | No — transparency reduces readability |

Glass is a premium accent — not a default surface treatment.

### Shadows

Shadows communicate elevation with restraint.

| Level | Shadow Character |
|-------|------------------|
| Level 1 | Minimal — barely perceptible, defines edge |
| Level 2 | Light — visible separation from surface |
| Level 3 | Moderate — clear float above content |
| Level 4 | Pronounced — draws attention to transient message |

Shadows are softer and more diffuse in light mode. In dark mode, shadows are supplemented or replaced by surface lightness differentiation.

Shadows never appear on elements that do not float. Flat content does not cast shadows.

### Blur

Blur is used exclusively for **glass surfaces and modal scrims**.

| Context | Blur |
|---------|------|
| Modal backdrop | Background content blurred and dimmed |
| Glass header | Content beneath header blurred |
| Standard UI | No blur |

Blur is never applied to content the user needs to read.

### Depth Hierarchy

Depth must correlate with interaction priority:

| Priority | Depth |
|----------|-------|
| Background content | Level 0 |
| Primary work area | Level 0–1 |
| Navigation | Level 1 |
| Contextual panels | Level 1 |
| Tooltips and popovers | Level 2 |
| Modals and dialogs | Level 3 |
| System notifications | Level 4 |

Higher depth always means higher interaction priority or transience. Permanent content never lives at overlay depth.

### Visual Grouping

Depth and spacing work together for grouping:

| Grouping Method | When to Use |
|-----------------|-------------|
| **Spacing alone** | Related items within a section — preferred method |
| **Surface (card)** | Distinct content group that may be interactive or collapsible |
| **Border** | Dense contexts where spacing alone is insufficient — tables, inline forms |
| **Elevation** | Floating element that temporarily overlays content |
| **Background shift** | Subtle tonal difference to separate zones — sidebar from content |

Prefer the lightest grouping method that achieves clarity. Escalate to heavier methods only when necessary.

---

# Part 4 — Component Foundations

## 17. Component Philosophy

### Components as Building Blocks

Components are the reusable units from which every screen is constructed. A well-designed component system ensures that the platform looks, feels, and behaves as one product — regardless of which team built which feature.

### Consistency

Every instance of a component type behaves identically across the platform.

| Dimension | Consistency Requirement |
|-----------|----------------------|
| Visual appearance | Same spacing, color, typography, and states everywhere |
| Interaction behavior | Same click, hover, focus, and keyboard response |
| Naming | Same component names in design and engineering vocabulary |
| States | Same state set — default, hover, focus, active, disabled, loading, error |

Users learn components once and apply that knowledge everywhere.

### Predictability

Predictable components reduce cognitive load.

- A button looks like a button and acts like a button — everywhere
- An input field accepts input the same way — everywhere
- A dropdown opens in the same direction with the same animation — everywhere
- Destructive actions always use the same visual treatment — everywhere

Surprises in component behavior erode trust.

### Composability

Components are designed to **combine without conflict**.

| Principle | Application |
|-----------|-------------|
| Single responsibility | Each component does one thing well |
| Nesting rules | Components nest predictably — input within form group within card |
| Slot patterns | Containers accept content without dictating it |
| Size harmony | Components at adjacent sizes align visually |
| No special cases | Composition handles variation — not one-off overrides |

### Accessibility

Accessibility is a component property, not a feature.

| Requirement | Standard |
|-------------|----------|
| Keyboard operable | Every interactive component is fully keyboard accessible |
| Focus visible | Focus state is always visible — never removed |
| Screen reader support | Roles, labels, and states are programmatically communicated |
| Color independent | State is never communicated by color alone |
| Touch accessible | Touch targets meet minimum size requirements |
| Motion respectful | Animations respect reduced-motion preferences |

### Maintainability

Components are designed for long-term evolution.

- Changes to a component propagate improvement across the entire platform
- New variants extend the system — they do not fork it
- Deprecated components have migration paths — they are not abandoned in place
- Documentation accompanies every component (future parts)

---

## 18. Buttons

### Button Purpose

Buttons initiate actions. They are the most direct expression of user intent in the interface. Every button must clearly communicate what will happen when it is activated.

### Button Hierarchy

A screen with ten equal-weight buttons has zero hierarchy. Button types create action priority.

| Priority | Type | Usage |
|----------|------|-------|
| **1 — Primary** | One per view maximum | The action the user most likely needs — Save, Submit, Create, Continue |
| **2 — Secondary** | Supporting actions | Cancel, Back, Export, alternative paths |
| **3 — Ghost** | Tertiary actions | Inline actions, table row actions, low-emphasis options |
| **4 — Danger** | Destructive actions | Delete, Remove, Revoke — always requires confirmation for irreversible actions |
| **5 — Icon** | Compact actions | Toolbar actions, card actions — always with accessible label |

### Primary Button

| Attribute | Standard |
|-----------|----------|
| Purpose | The single most important action on the screen |
| Visual weight | Highest — filled with primary color |
| Quantity | Maximum one per view. Zero is acceptable. Two is a design failure. |
| Placement | Consistent position — right side of action bar or below form |
| Label | Verb-first — "Create Engagement," not "New" |
| States | Default, hover, focus, active, loading, disabled |

### Secondary Button

| Attribute | Standard |
|-----------|----------|
| Purpose | Alternative or supporting action |
| Visual weight | Medium — outlined or muted fill |
| Pairing | Appears alongside primary — typically to its left |
| Label | Clear action — "Cancel," "Save as Draft," "Export" |
| States | Same as primary |

### Ghost Button

| Attribute | Standard |
|-----------|----------|
| Purpose | Low-emphasis action that should remain available but not prominent |
| Visual weight | Lowest — text or transparent background, no border |
| Usage | Inline actions, navigation-style buttons, repeated actions in lists |
| Hover | Subtle background appears on hover — confirming interactivity |
| States | Same as primary |

### Danger Button

| Attribute | Standard |
|-----------|----------|
| Purpose | Irreversible or destructive action |
| Visual weight | Danger color — filled for confirmation dialogs, outlined elsewhere |
| Confirmation | Destructive actions always require explicit confirmation |
| Label | Specific — "Delete Engagement," not "Delete" alone when context is ambiguous |
| Placement | Separated from primary actions — never adjacent to Save or Submit |
| States | Same as primary |

### Icon Button

| Attribute | Standard |
|-----------|----------|
| Purpose | Compact action in toolbars, cards, and table rows |
| Visual weight | Icon only — no text visible |
| Accessibility | Accessible label required — tooltip supplements, does not replace |
| Size | Meets minimum touch target |
| Shape | Consistent — square or circular with consistent radius |
| States | Same as primary, with optional background on hover |

### Loading State

| Attribute | Standard |
|-----------|----------|
| Trigger | Action in progress — save, submit, delete |
| Visual | Spinner or progress replaces button label or appears inline |
| Behavior | Button becomes non-interactive during loading |
| Label | "Saving…" or maintained label with spinner — user knows what is happening |
| Duration | If action exceeds three seconds, progress indicator replaces spinner |

### Disabled State

| Attribute | Standard |
|-----------|----------|
| Trigger | Action unavailable — permissions, validation, prerequisites |
| Visual | Reduced opacity or muted color — clearly non-interactive |
| Cursor | Not-allowed cursor on hover |
| Explanation | Tooltip or helper text explains why — never a silent disabled button |
| Keyboard | Disabled buttons are skipped in tab order |

### Button Groups

| Pattern | Usage |
|---------|-------|
| **Action bar** | Primary right, secondary left — bottom or top of form |
| **Split button** | Primary action with dropdown for variants — rare, justified use only |
| **Segmented control** | Mutually exclusive options — not a button group for actions |
| **Toolbar** | Icon buttons in horizontal row — consistent spacing |

---

## 19. Inputs

### Input Purpose

Inputs are the gateway for user data entry. In an audit platform, data accuracy is professionally critical. Input design must promote accuracy, prevent error, and provide immediate guidance.

### Text Input

| Attribute | Standard |
|-----------|----------|
| Purpose | Free-form text — names, descriptions, references |
| Label | Always visible above input — never placeholder-only |
| Placeholder | Example format or hint — never replaces label |
| States | Default, focus, filled, error, disabled, read-only |
| Width | Appropriate to expected content — not full-width for short values |
| Autocomplete | Supported where browser autofill is appropriate |

### Number Input

| Attribute | Standard |
|-----------|----------|
| Purpose | Numeric values — amounts, quantities, percentages |
| Alignment | Right-aligned in tables, left-aligned in forms |
| Formatting | Thousand separators, decimal precision as appropriate |
| Constraints | Min, max, step — enforced with clear error on violation |
| Currency | Currency symbol and formatting per locale |

### Date Input

| Attribute | Standard |
|-----------|----------|
| Purpose | Date and period selection — engagement dates, reporting periods |
| Format | Locale-appropriate date format displayed |
| Picker | Calendar picker on focus or icon click |
| Manual entry | Accepted with format validation |
| Range | Date range picker for period selection |

### Search Input

| Attribute | Standard |
|-----------|----------|
| Purpose | Filter and find within datasets |
| Icon | Search icon on left |
| Clear | Clear button appears when text is entered |
| Behavior | Debounced live search or explicit submit — consistent per context |
| Results | Search results update in associated content area |
| Keyboard | Slash or Command+K shortcut to focus search in supported views |

### Password Input

| Attribute | Standard |
|-----------|----------|
| Purpose | Authentication credentials |
| Masking | Characters masked by default |
| Reveal | Toggle to show/hide password |
| Strength | Strength indicator on creation — not on login |
| Requirements | Visible password requirements on registration and reset |

### Select

| Attribute | Standard |
|-----------|----------|
| Purpose | Single selection from predefined options |
| Display | Selected value visible in closed state |
| Dropdown | Opens below (or above if insufficient space) |
| Search | Searchable when option count exceeds threshold |
| Empty | "No options" state when list is empty |
| States | Default, focus, open, error, disabled |

### Multi-Select

| Attribute | Standard |
|-----------|----------|
| Purpose | Multiple selections from predefined options |
| Display | Selected items as removable tags or count indicator |
| Dropdown | Checkbox list in dropdown |
| Search | Searchable filter within options |
| Limits | Maximum selection count communicated when applicable |

### Textarea

| Attribute | Standard |
|-----------|----------|
| Purpose | Multi-line text — descriptions, review notes, comments |
| Size | Minimum three lines visible — resizable vertically |
| Character count | Displayed when limit exists |
| Auto-grow | Optional — grows with content up to maximum |

### Validation

| Timing | Behavior |
|--------|----------|
| **On blur** | Field validated when user leaves it |
| **On submit** | All fields validated on form submission |
| **On change** | Real-time validation only for high-confidence checks (format, length) |
| **Progressive** | Do not validate empty required fields until first submit attempt |

### Error Handling

| Element | Standard |
|---------|----------|
| Field border | Danger color |
| Error icon | Inline icon adjacent to error message |
| Error message | Below field — states what is wrong and how to fix it |
| Error summary | At form top for multiple errors — links to each field |
| Persistence | Error clears when field becomes valid |
| Server errors | Mapped to specific fields when possible — general message at form top otherwise |

---

## 20. Forms

### Form Philosophy

Forms are the primary mechanism for structured data entry in the platform. Enterprise forms must balance comprehensiveness with usability — collecting all required information without overwhelming the user.

### Enterprise Form Principles

| Principle | Application |
|-----------|-------------|
| **Minimum viable fields** | Collect only what is needed now. Additional data can be added later. |
| **Logical grouping** | Fields grouped by concept — not by database schema |
| **Progressive length** | Short forms inline. Long forms use wizard or sections. |
| **Smart defaults** | Pre-fill where value is known — organization, period, user |
| **Inline over modal** | Prefer inline editing over modal forms for single-field changes |
| **Preserve on error** | User input is never lost on validation failure |

### Wizard Philosophy

Multi-step wizards are used when a process has **distinct sequential phases** that cannot be meaningfully presented on one screen.

| Attribute | Standard |
|-----------|----------|
| Steps | Three to seven steps — fewer is better |
| Progress | Step indicator always visible — numbered or named |
| Navigation | Back is always available. Forward requires current step validation. |
| Persistence | Each step's data is preserved when navigating back |
| Completion | Summary step before final submission for high-stakes forms |
| Escape | User can save draft and exit at any step |
| Use cases | Onboarding, engagement creation, complex configuration |

Wizards are not a license for giant forms split arbitrarily. Each step must represent a genuine phase of the user's mental model.

### Validation Strategy

| Layer | Responsibility |
|-------|----------------|
| **Field-level** | Format, length, required — immediate feedback |
| **Cross-field** | Dependent fields, date ranges, matching values — on submit or step transition |
| **Server-side** | Business rules, uniqueness, permissions — returned as field or form errors |
| **Permission** | Fields user cannot edit are read-only — not hidden without explanation |

### Inline Feedback

Forms provide continuous feedback without waiting for submission.

| Feedback Type | Timing |
|---------------|--------|
| Field validation error | On blur or on submit |
| Field validation success | Optional subtle check for high-anxiety fields (password, email) |
| Character count | Real-time for limited fields |
| Auto-save confirmation | Subtle "Saved" indicator — not disruptive toast |
| Format hint | Persistent below field — not just in placeholder |

### Autosave Philosophy

Autosave protects professional work from loss.

| Attribute | Standard |
|-----------|----------|
| Trigger | Debounced save after user stops typing — typically 1–2 seconds |
| Indicator | Subtle status — "Saving…" / "Saved" / "Unable to save" |
| Conflict | If data changed elsewhere, user is notified before overwrite |
| Draft | Unsubmitted forms are preserved as drafts with recovery on return |
| Scope | Autosave applies to long forms and text content — not trivial toggles |

### Required and Optional Fields

| Rule | Standard |
|------|----------|
| Required indicator | Asterisk or "Required" label on required fields |
| Optional label | "Optional" shown only when most fields are required |
| Default assumption | Fields are required unless marked optional |
| Legend | Form-level legend explains indicator convention |
| Validation | Required fields validated on submit at minimum |

### Keyboard Navigation

Forms must be fully operable by keyboard.

| Key | Behavior |
|-----|----------|
| **Tab** | Move to next field |
| **Shift+Tab** | Move to previous field |
| **Enter** | Submit form (single field) or advance wizard step — never unexpectedly |
| **Escape** | Close dropdown, cancel edit, or exit modal |
| **Arrow keys** | Navigate within dropdown options, radio groups |
| **Space** | Toggle checkboxes, activate buttons |

Tab order follows visual order. Focus is trapped within modals. Focus returns to trigger element on modal close.

---

## Document Control

| Field | Value |
|-------|-------|
| Document | Design System |
| Version | 0.4.0 |
| Parts Complete | 1–4 |
| Status | Draft — Parts 1–4 Complete |
| Last Updated | 2026-06-30 |
| Change Summary | Added Part 2 (Layout System), Part 3 (Visual Foundations), Part 4 (Component Foundations) |
| Author | Chief Product Designer / Design System Architect |
| Next Planned | Part 5 — Motion, Feedback, and States |

### Revision History

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | 2026-06-30 | Part 1 — Foundation (Design Vision through Success Criteria) |
| 0.4.0 | 2026-06-30 | Parts 2–4 — Layout System, Visual Foundations, Component Foundations |

---

**Parts 2–4 are complete. Await next instruction.**

---

*End of Parts 2–4*

---

# Part 5 — Navigation & Information Architecture

## 21. Navigation Philosophy

### Navigation as Infrastructure

Navigation is the connective tissue of the platform. In an enterprise audit product with deep module hierarchies — engagements, entities, workpapers, reports, and intelligence views — navigation determines whether users move with confidence or lose context at every step.

Our navigation philosophy is singular: **navigation should feel invisible**. Users should never think about how to get somewhere. They should think about what to do when they arrive.

Invisible navigation is not hidden navigation. It is navigation so consistent, predictable, and well-structured that it recedes into the background of professional work.

### The Three Orientation Questions

At every moment, the user must be able to answer three questions without effort:

| Question | Navigation Responsibility |
|----------|--------------------------|
| **Where am I?** | Page title, breadcrumb, active nav state, context header |
| **Where did I come from?** | Breadcrumb trail, back navigation, preserved filters and selections |
| **Where can I go?** | Primary nav, secondary nav, contextual actions, search, command palette |

If any of these questions requires conscious effort to answer, navigation has failed.

### Primary Navigation

Primary navigation defines the **top-level modules** of the platform — the major domains of professional work.

| Attribute | Standard |
|-----------|----------|
| Position | Persistent left sidebar on desktop and laptop |
| Content | Module names with icons — Audit, Reporting, Intelligence, Settings |
| Behavior | One click to module root. Active module always visually indicated. |
| Persistence | Visible on all screens within the authenticated application |
| Collapse | User-controlled collapse to icon rail — state persisted |
| Limit | Maximum seven primary items — additional items grouped under "More" |

Primary navigation changes rarely. It reflects product architecture, not feature sprawl.

### Secondary Navigation

Secondary navigation defines **views within a module** — the sections, lists, and workspaces inside a primary area.

| Attribute | Standard |
|-----------|----------|
| Position | Within sidebar below primary items, or as horizontal tabs below header |
| Content | Module-specific views — Engagements, Templates, Team, Archive |
| Behavior | Switching secondary nav preserves module context |
| Relationship | Secondary items belong exclusively to their parent module |
| Density | Secondary nav may scroll independently within sidebar |

### Context Navigation

Context navigation operates **within a specific entity or record** — an engagement, a workpaper, a financial statement, a company.

| Attribute | Standard |
|-----------|----------|
| Position | Horizontal tabs or vertical sub-nav within content area |
| Content | Entity-specific views — Overview, Workpapers, Evidence, Review, Sign-off |
| Behavior | Context nav appears only when a record is selected or opened |
| Persistence | Context is preserved when switching between entity tabs |
| Depth | Maximum three levels: module → entity list → entity detail tabs |

### Breadcrumb Philosophy

Breadcrumbs provide **hierarchical wayfinding** for deep navigation paths.

| Rule | Standard |
|------|----------|
| When to show | Any view three or more levels deep from module root |
| Structure | Module → Section → Entity → Sub-view |
| Interaction | Each segment is clickable — navigates to that level |
| Current page | Final segment is text only — not a link |
| Truncation | Middle segments collapse with ellipsis when path is long |
| Mobile | Breadcrumbs compress to back button + current page title |
| Not a replacement | Breadcrumbs supplement navigation — they do not replace sidebar or tabs |

Breadcrumbs answer "where am I in the hierarchy?" — not "what is the history of my session?"

### Search-First Navigation

Search is a **first-class navigation method** for power users who know what they want.

| Attribute | Standard |
|-----------|----------|
| Global search | Accessible from header on every screen — keyboard shortcut |
| Scope | Searches across engagements, entities, workpapers, users, settings |
| Results | Grouped by type with preview context |
| Ranking | Recent and frequent items prioritized |
| Actions | Results support direct navigation and quick actions |
| Empty | Search with no results explains scope and suggests alternatives |

Search does not replace structured navigation. It accelerates it for experienced users.

### Keyboard Navigation

Keyboard navigation is mandatory for professional productivity.

| Key / Pattern | Behavior |
|---------------|----------|
| **Command palette** | Opens global command and search interface |
| **Arrow keys** | Navigate within menus, lists, and sidebar items |
| **Enter** | Activate selected navigation item |
| **Escape** | Close open menu, panel, or overlay |
| **Tab** | Move through interactive navigation elements |
| **Shortcuts** | Module-specific shortcuts documented and discoverable |

Navigation must be fully operable without a pointing device.

### Navigation Hierarchy

The complete navigation hierarchy follows a strict model:

```
Platform
└── Module (Primary Nav)
    └── Section (Secondary Nav)
        └── Entity List
            └── Entity Detail (Context Nav)
                └── Sub-view (Tabs)
```

No level is skipped in the user's mental model. No view exists outside this hierarchy without explicit entry and exit.

### Progressive Navigation

As users go deeper, navigation adapts:

| Depth | Navigation Presentation |
|-------|------------------------|
| Module root | Primary nav prominent, full sidebar |
| Section list | Primary nav + secondary nav, list in content area |
| Entity detail | Context tabs appear, breadcrumb visible |
| Sub-view | Full context established, focus on content |

Each level adds navigation context — it does not replace previous levels abruptly.

### Navigation Consistency

| Rule | Application |
|------|-------------|
| Same position | Navigation elements appear in the same screen regions across all modules |
| Same behavior | Click, hover, and keyboard interactions are identical |
| Same visual language | Active, hover, and default states use the same treatment everywhere |
| Same depth model | All modules follow the hierarchy model — no module invents its own navigation paradigm |
| Same search | Global search is always accessible from the same location |

---

## 22. Sidebar System

### The Enterprise Sidebar

The sidebar is the **primary structural navigation** of the platform. It is the first thing users learn and the element they interact with most frequently throughout an eight-hour session. It must be stable, scannable, and respectful of screen space.

### Expanded Mode

Expanded mode is the default on desktop and laptop viewports.

| Property | Standard |
|----------|----------|
| Width | Fixed — sufficient for icon and full label |
| Content | Logo, primary nav, secondary nav, optional footer actions |
| Labels | Full text labels visible alongside icons |
| Groups | Related items grouped with subtle section headers |
| Scroll | Independent vertical scroll when content exceeds viewport |
| Footer | User settings, collapse toggle, version info at bottom |

### Collapsed Mode

Collapsed mode reduces the sidebar to an **icon rail** for users who prioritize content width.

| Property | Standard |
|----------|----------|
| Width | Narrow — icon only with tooltip on hover |
| Icons | Centered in rail — consistent size |
| Labels | Hidden — revealed via tooltip on hover |
| Groups | Separated by subtle dividers — no group headers |
| Expand | Explicit toggle or hover expansion (see below) |
| Persistence | User preference saved across sessions |

### Hover Expansion

When collapsed, the sidebar may **temporarily expand on hover** to reveal labels without permanent width change.

| Behavior | Standard |
|----------|----------|
| Trigger | Mouse hover over collapsed sidebar |
| Expansion | Sidebar overlays content — does not push it |
| Duration | Expands immediately, collapses after brief delay on mouse leave |
| Touch | Not applicable — touch devices use tap to expand persistently |
| Content | Full labels and group headers visible during expansion |

### Active States

Active navigation items must be **immediately identifiable**.

| State | Treatment |
|-------|-----------|
| **Active (current page)** | Background highlight, primary color accent on icon or left border, medium font weight |
| **Active parent** | Subtle indication when child is active — parent module remains visually connected |
| **Hover** | Background shift — lighter than active, confirms interactivity |
| **Default** | No background — icon and label at standard contrast |
| **Disabled** | Reduced opacity — with tooltip explaining unavailability |

Only one primary item is active at a time. Active state persists across page loads.

### Nested Navigation

Nested items represent hierarchy within a module.

| Property | Standard |
|----------|----------|
| Indentation | Nested items indented — clear parent-child relationship |
| Disclosure | Parent items with children show chevron — expand/collapse on click |
| Auto-expand | Parent auto-expands when child is active |
| Depth | Maximum two levels of nesting within sidebar |
| Animation | Expand/collapse animated — brief, purposeful |

### Groups

Sidebar groups organize related navigation items.

| Property | Standard |
|----------|----------|
| Header | Small, uppercase or tracked label — subdued contrast |
| Spacing | Generous space above group header — clear separation from previous group |
| Collapse | Groups may be collapsible in expanded mode |
| Minimum | At least one item per group — no empty groups |

### Icons

Every sidebar item has an icon.

| Rule | Standard |
|------|----------|
| Consistency | Same icon set as platform-wide iconography |
| Size | Uniform within sidebar |
| Position | Left of label — aligned vertically |
| Active | Outlined to filled transition on active state |
| Recognition | Icons supplement labels — collapsed mode relies on icon recognition |

### Labels

| Rule | Standard |
|------|----------|
| Length | Concise — one or two words maximum |
| Language | Matches platform locale |
| Truncation | Ellipsis with tooltip for overflow — rare at standard sidebar width |
| Alignment | Left-aligned with consistent padding from icon |

### Scrolling

When navigation items exceed viewport height:

| Behavior | Standard |
|----------|----------|
| Scroll region | Sidebar body scrolls — header and footer remain fixed |
| Scrollbar | Subtle — visible on hover or during scroll |
| Active item | Always scrolled into view on page load |
| Position memory | Scroll position preserved during session |

### Search

Sidebar may include a **filter input** when a module has many navigation items.

| Property | Standard |
|----------|----------|
| Position | Top of sidebar body, below logo |
| Behavior | Filters visible nav items — does not search platform content |
| Placeholder | "Filter navigation…" |
| Clear | Clears on Escape |

### Favorites and Pinned Items

Users may pin frequently accessed items for rapid navigation.

| Property | Standard |
|----------|----------|
| Position | Above primary nav or in dedicated "Favorites" group at top |
| Limit | Maximum five pinned items |
| Action | Pin from context menu on any nav item |
| Persistence | Saved per user, per organization |
| Visual | Pin icon indicator on pinned items |

### Future Extensibility

The sidebar architecture supports future growth without redesign:

| Capability | Design Reserve |
|------------|----------------|
| New modules | Slot into primary nav — may require "More" grouping at scale |
| Badges | Count indicators on nav items — notifications, pending items |
| Status dots | Module-level status — incomplete, attention required |
| Customization | User-ordered favorites — not arbitrary nav reordering |
| Plugin nav | Third-party integrations append to designated zone — not primary nav |

---

## 23. Header System

### Header Architecture

The header is the **global command layer** — always visible, always accessible, always consistent. It provides platform-wide context and actions without competing with the primary work area.

The platform uses a layered header model:

| Header Type | Scope | Content |
|-------------|-------|---------|
| **Global header** | Entire platform | Brand, search, notifications, profile, org/workspace switchers |
| **Workspace header** | Current module or section | Page title, section actions, filters, view controls |
| **Context header** | Current entity or record | Entity name, status, metadata, entity-specific actions |

Headers stack logically — global header is always present, workspace and context headers appear as the user navigates deeper.

### Global Header

| Element | Position | Purpose |
|---------|----------|---------|
| Logo / Home | Left | Return to dashboard |
| Organization switcher | Left-center | Switch active organization |
| Workspace switcher | Left-center | Switch active workspace within organization |
| Search trigger | Center-right | Open command palette / global search |
| Notifications | Right | Alert and activity feed |
| Profile | Right | User menu — settings, sign out |
| Quick actions | Right | Contextual primary action when applicable |

Global header height is fixed and minimal. It does not grow with content.

### Workspace Header

| Element | Purpose |
|---------|---------|
| Page title | Names the current section — "Engagements," "Team Members" |
| Breadcrumb | Hierarchical path when depth warrants |
| View controls | List/grid toggle, sort, filter trigger |
| Section actions | "Create," "Import," "Export" — section-level primary actions |
| Tab bar | Secondary navigation tabs when applicable |

Workspace header appears below global header. It scrolls away on mobile to maximize content area — reappears on scroll up.

### Context Header

| Element | Purpose |
|---------|---------|
| Entity name | Engagement name, company name, report title |
| Status badge | Current state — Draft, In Review, Completed, Signed Off |
| Metadata | Key identifiers — period, client, engagement code |
| Entity actions | Edit, Share, Archive, Sign Off — entity-level actions |
| Context tabs | Sub-navigation within entity |

Context header is the most information-dense header layer. It must maintain hierarchy — entity name dominates, metadata is subordinate.

### Search

| Property | Standard |
|----------|----------|
| Trigger | Search icon or keyboard shortcut in global header |
| Interface | Command palette overlay — centered, keyboard-first |
| Scope selector | Optional filter by content type |
| Recent | Recently accessed items shown on open |
| Actions | Type to search, arrow to navigate, enter to open |

### Notifications

| Property | Standard |
|----------|----------|
| Trigger | Bell icon with unread count badge |
| Panel | Dropdown or slide-over panel |
| Content | Grouped by time — today, yesterday, earlier |
| Types | Assignment, mention, deadline, system, approval request |
| Actions | Click to navigate to source. Mark read individually or all. |
| Empty | "No notifications" with calm illustration or message |

### Profile

| Property | Standard |
|----------|----------|
| Trigger | Avatar or initials circle |
| Menu | Dropdown — profile, preferences, keyboard shortcuts, sign out |
| Avatar | User photo or initials — consistent size |
| Status | Optional presence indicator for collaboration features |

### Quick Actions

| Property | Standard |
|----------|----------|
| Position | Global header right zone or floating action on mobile |
| Content | Single primary creation action — "New Engagement," context-dependent |
| Behavior | Opens creation flow — modal, drawer, or navigation |

### Organization Switcher

| Property | Standard |
|----------|----------|
| Trigger | Organization name with chevron |
| Display | Current organization name — truncated if long |
| Menu | Searchable list of user's organizations |
| Action | Switch organization — reloads tenant context |
| Indicator | Clear visual confirmation of active organization |

### Workspace Switcher

| Property | Standard |
|----------|----------|
| Trigger | Workspace name with chevron |
| Display | Current workspace within active organization |
| Menu | List of workspaces in current organization |
| Action | Switch workspace — updates context |
| Dependency | Only visible when organization has multiple workspaces |

### Command Palette

The command palette is the **power-user navigation surface**.

| Property | Standard |
|----------|----------|
| Activation | Keyboard shortcut or search click |
| Interface | Centered overlay with search input |
| Capabilities | Search, navigate, execute actions, change settings |
| Results | Categorized — pages, actions, recent, settings |
| Keyboard | Full keyboard navigation — arrows, enter, escape |
| Recency | Recent commands prioritized |
| Scope | Platform-wide — available from any screen |

### Global Actions

Actions that apply across the platform appear in the global header zone:

| Action | Placement |
|--------|-----------|
| Create new (contextual) | Quick action button |
| Help / Documentation | Profile menu or dedicated icon |
| Keyboard shortcuts | Profile menu |
| Theme toggle | Profile menu or settings |

Global actions are few. Module-specific actions belong in workspace or context headers.

---

## 24. Information Architecture

### Organizing Enterprise Information

Information architecture (IA) is the discipline of structuring and labeling content so users find what they need without searching. In an audit platform with vast, interconnected data, IA is the difference between a tool professionals trust and one they tolerate.

### Hierarchy

Information hierarchy mirrors **professional mental models** — not database schemas or organizational charts.

| Level | Content Type | Example |
|-------|--------------|---------|
| **Platform** | Global capabilities | Audit, Reporting, Intelligence |
| **Collection** | Groups of related entities | Engagements, Clients, Templates |
| **Entity** | Single record | Engagement "FY2025 Annual Audit — Client X" |
| **Component** | Parts of an entity | Workpaper, Evidence item, Review note |
| **Attribute** | Data within a component | Amount, date, status, assignee |

Users navigate down this hierarchy to focus and up to broaden context.

### Grouping

Related information is grouped by **conceptual affinity**:

| Grouping Method | When to Use |
|-----------------|-------------|
| **By task** | Actions and data needed for a workflow step |
| **By entity** | All information about one engagement, client, or period |
| **By time** | Chronological activity, audit trail, version history |
| **By status** | Items requiring attention — pending review, overdue, draft |
| **By role** | Information relevant to the current user's responsibility |

Grouping is expressed through layout sections, cards, and tabs — not through deep menu nesting.

### Sections

A section is a **logical content division** within a page.

| Property | Standard |
|----------|----------|
| Title | Heading 2 or 3 — names the section |
| Spacing | Extra-large gap above section — clear separation |
| Content | Related items within consistent container |
| Collapse | Long sections may be collapsible — state persisted |
| Order | Most important section first — unless workflow dictates sequence |

### Cards

Cards encapsulate **discrete, scannable units** of information.

| Use Case | Card Content |
|----------|--------------|
| Entity preview | Name, status, key metadata, primary action |
| Summary metric | KPI value, trend, label |
| Activity item | Actor, action, timestamp |
| Setting group | Related configuration options |

Cards are not used for dense tabular data. Cards are not nested within cards.

### Lists

Lists present **homogeneous items** in scannable vertical sequence.

| Property | Standard |
|----------|----------|
| Item structure | Leading element (icon/avatar), primary text, secondary text, trailing action |
| Density | Standard or compact — user preference |
| Selection | Checkbox leading when multi-select is supported |
| Empty | Empty state with guidance |
| Loading | Skeleton items matching list structure |

### Tables

Tables present **structured, comparable data** — the primary information format for audit work.

Tables are governed by the comprehensive table philosophy in Section 27. At the IA level, tables are used when:

- Users need to compare values across items
- Data has consistent column structure
- Sorting, filtering, and bulk actions are required
- The dataset exceeds what cards can present efficiently

### Progressive Disclosure

Information is revealed in layers:

| Layer | Content |
|-------|---------|
| **Summary** | Name, status, key metric — visible in list or card |
| **Detail** | Full record in detail view or panel |
| **Deep detail** | Sub-tabs, expandable sections, linked records |
| **Raw data** | Export, audit trail, technical metadata — on explicit request |

Users never encounter full entity depth on first view. Each layer invites deeper exploration.

### Priority Ordering

Within any view, information is ordered by professional priority:

| Priority | Content |
|----------|---------|
| **1 — Action required** | Items needing user attention — approvals, errors, deadlines |
| **2 — Status summary** | Current state of the entity or workflow |
| **3 — Primary data** | The core information the user came to see |
| **4 — Supporting data** | Metadata, history, related items |
| **5 — Administrative** | Settings, technical details, audit trail |

Priority ordering is consistent across modules. Users learn to expect action items at the top.

### Scanning Behavior

Professional users scan before they read. IA supports scanning through:

| Technique | Application |
|-----------|-------------|
| **Consistent placement** | Status always in the same position, dates always right-aligned |
| **Visual anchors** | Icons, badges, and color signals at consistent positions |
| **Alignment** | Columns, labels, and values align across items |
| **Truncation** | Long text truncated with expansion — not wrapped to obscure structure |
| **Whitespace** | Generous spacing between scannable units |

### Enterprise Readability

Enterprise readability ensures information remains comprehensible at professional scale:

| Principle | Application |
|-----------|-------------|
| **Plain language** | Labels use professional vocabulary — not internal system terminology |
| **Consistent terminology** | Same concept, same label — everywhere |
| **Abbreviation discipline** | Abbreviations defined on first use or in glossary — not assumed |
| **Numeric clarity** | Financial figures formatted with separators, currency, and alignment |
| **Date clarity** | Locale-appropriate format with unambiguous month names or ISO format |
| **Status clarity** | Status labels are verbs or adjectives — "In Review," not "Status: 3" |

---

# Part 6 — Dashboard, Tables & Data Visualization

## 25. Dashboard Philosophy

### What Makes a World-Class Dashboard

A dashboard is not a data dump. It is a **curated briefing** — the platform's answer to "what do I need to know right now?" A world-class dashboard respects the user's time, role, and current priorities.

The dashboard is the first screen users see and the surface they return to between tasks. It must earn that position through clarity, relevance, and calm — not through widget density.

### Audience-Specific Design

The platform serves distinct professional roles. Dashboard content and emphasis adapt to each:

| Role | Primary Dashboard Need |
|------|------------------------|
| **Partners** | Portfolio health, risk exposure, deadline overview, team utilization, client status |
| **Managers** | Engagement progress, team workload, review bottlenecks, quality metrics, upcoming deadlines |
| **Auditors** | Assigned workpapers, open review notes, pending evidence, personal deadlines, recent activity |
| **Accountants** | Reporting status, reconciliation progress, period close timeline, outstanding items |
| **Executives** | High-level KPIs, trend summaries, compliance status, strategic metrics — minimal detail |

Dashboards are role-aware. A staff auditor does not see partner-level portfolio data by default. Role-appropriate dashboards are a default — customization is available but not required.

### Overview First

The dashboard leads with **summary before detail**.

| Layer | Content |
|-------|---------|
| Top | Greeting, date context, critical alerts |
| Upper | KPI cards — the four to six metrics that matter most |
| Middle | Action items — what needs attention now |
| Lower | Activity feed, recent items, secondary metrics |
| Bottom | Quick links to frequent destinations |

Users grasp their situation within five seconds of viewing the dashboard.

### Actionability

Every dashboard element must either **inform or enable action**.

| Type | Example |
|------|---------|
| **Inform** | "3 engagements due this week" |
| **Enable** | "Review pending workpaper" button on each overdue item |
| **Both** | KPI card showing overdue count — click navigates to filtered list |

Dashboard elements that inform without enabling action are incomplete. Data without a path to action is decoration.

### Context

Dashboard data is always **contextualized**:

| Context Element | Application |
|-----------------|-------------|
| Time period | "This week," "Q4 2025," "Current period" |
| Comparison | vs. prior period, vs. target, vs. team average |
| Scope | Current organization, workspace, or personal |
| Freshness | "Updated 5 minutes ago" — data currency is visible |

Numbers without context are meaningless. The dashboard provides context by default.

### Focus

The dashboard presents a **focused snapshot** — not comprehensive coverage.

| Principle | Application |
|-----------|-------------|
| Limited KPIs | Four to six primary metrics — not twenty |
| Limited actions | Top three to five action items — not an exhaustive task list |
| Limited activity | Recent ten items — with link to full activity log |
| No duplication | Dashboard does not replicate full module views |

The dashboard is a launchpad, not a workspace. Users drill into modules for depth.

### Minimal Cognitive Load

| Technique | Application |
|-----------|-------------|
| Consistent layout | Same dashboard structure across roles — content varies, layout does not |
| Clear zones | KPI area, action area, activity area — visually distinct |
| No configuration required | Default dashboard is useful immediately |
| Optional customization | Users may add, remove, or reorder widgets — defaults are excellent |
| Calm visual treatment | No chart junk, no competing colors, no animation |

---

## 26. KPI Cards

### KPI Card Purpose

KPI cards are the **atomic unit of dashboard metrics** — a single measurable value with context, trend, and status in a compact, scannable container.

### Card Anatomy

| Element | Position | Purpose |
|---------|----------|---------|
| Label | Top | What is being measured — "Open Engagements" |
| Value | Center | The current metric — large, high contrast |
| Trend | Below value | Direction and magnitude of change |
| Status | Top-right or below trend | Health indicator |
| Action | Bottom or on click | Navigate to detail view |

### Status Indicators

| Status | Meaning | Visual |
|--------|---------|--------|
| **Healthy** | Within acceptable range | Success color dot or subtle green accent |
| **Attention** | Approaching threshold | Warning color dot or amber accent |
| **Critical** | Requires immediate action | Danger color dot or red accent |
| **Neutral** | No status assessment | No indicator — value speaks for itself |

Status indicators are small and subordinate — they do not dominate the card.

### Trend Indicators

| Trend | Visual | Label Example |
|-------|--------|---------------|
| **Up** | Arrow up, success or danger depending on metric polarity | "+12% vs last month" |
| **Down** | Arrow down, success or danger depending on metric polarity | "−3% vs last quarter" |
| **Flat** | Horizontal arrow or dash | "No change" |
| **New** | No prior comparison | "First period" |

Trend polarity depends on the metric. Fewer overdue items trending down is positive. Revenue trending down is negative. The card makes polarity explicit.

### Delta Indicators

Delta shows the **absolute or percentage change** from a comparison period.

| Format | Example |
|--------|---------|
| Absolute | "+4 engagements" |
| Percentage | "+12.5%" |
| Both | "+4 (+12.5%)" |
| Comparison label | "vs last month" — always stated |

### Targets

When a metric has a defined target:

| Element | Display |
|---------|---------|
| Target value | "Target: 95%" |
| Progress | Progress bar or ring showing completion percentage |
| Status | On track, behind, exceeded |

### Progress

Progress indicators show **completion toward a goal**.

| Type | Use Case |
|------|----------|
| Linear bar | Completion percentage — engagement progress, checklist completion |
| Ring | Compact circular progress — profile completeness, quota usage |
| Fraction | "12 of 15 completed" — countable items |

### Alerts

KPI cards surface alerts when metrics cross thresholds:

| Alert Level | Behavior |
|-------------|----------|
| Warning | Card border shifts to warning color |
| Critical | Card border shifts to danger color with pulse — once, not continuous |
| Recovery | Alert styling removed when metric returns to healthy range |

Alerts on KPI cards are rare. Chronic alerts desensitize users.

### Health Scores

Composite health scores aggregate multiple metrics into a single indicator:

| Property | Standard |
|----------|----------|
| Scale | 0–100 or letter grade — consistent across platform |
| Composition | Tooltip or expand reveals contributing factors |
| Update | Recalculated on data change — freshness indicated |
| Usage | Engagement health, client risk score, team utilization |

---

## 27. Tables & Data Grids

### The Centrality of Tables

Tables are the **most important component category** in this platform. Audit and financial professionals live in tables — trial balances, lead schedules, working paper indexes, team assignments, review notes, transaction listings, and compliance checklists are all tabular data.

Table design quality directly determines platform productivity. A world-class table is not a grid of data — it is a **professional instrument** for scanning, comparing, filtering, acting on, and editing enterprise data at scale.

### Readability

| Principle | Standard |
|-----------|----------|
| Row height | Comfortable — standard and compact density options |
| Column padding | Consistent horizontal padding — data does not touch cell borders |
| Typography | Body small for cell data, medium weight for headers |
| Alignment | Text left, numbers right, dates center or right, status center |
| Zebra striping | Optional subtle alternate row background — aids horizontal scanning |
| Row hover | Subtle background highlight on hover — confirms row target |
| Borders | Horizontal dividers between rows — vertical dividers only when needed for dense data |
| White space | Adequate cell padding prevents visual crowding at all density levels |

### Scanning

Tables are designed for **horizontal and vertical scanning**:

| Technique | Application |
|-----------|-------------|
| Sticky headers | Column headers remain visible during vertical scroll |
| Sticky first column | Row identifier visible during horizontal scroll |
| Column alignment | Consistent alignment within column type |
| Visual anchors | Status badges, avatars, icons at consistent column positions |
| Row grouping | Group headers break vertical scan at logical boundaries |
| Truncation | Long cell text truncated with tooltip on hover — row height preserved |

### Sorting

| Property | Standard |
|----------|----------|
| Trigger | Click column header |
| Indicator | Arrow icon showing sort direction |
| Multi-sort | Shift+click for secondary sort — advanced, optional |
| Default sort | Sensible default on page load — most recent, alphabetical, or by status |
| Persistence | Sort state preserved in session and user preferences |
| Sortable columns | Visual indicator on hover — not all columns are sortable |

### Filtering

| Property | Standard |
|----------|----------|
| Filter bar | Above table — filter chips and add filter button |
| Quick filters | Predefined common filters — "My items," "Overdue," "This week" |
| Column filters | Per-column filter in header dropdown |
| Filter chips | Active filters displayed as removable chips |
| Clear all | One action to reset all filters |
| Count | "Showing 24 of 156" — filtered count always visible |
| Persistence | Filter state preserved in session and shareable via URL |

### Grouping

| Property | Standard |
|----------|----------|
| Group by | User selects grouping column — status, assignee, date, category |
| Group header | Shows group name and item count — collapsible |
| Aggregate | Optional summary row per group — count, sum, average |
| Nested groups | Maximum one level of grouping — nested grouping adds complexity without clarity |

### Pinning

| Property | Standard |
|----------|----------|
| Pin left | User pins columns to left side — remain visible during horizontal scroll |
| Pin right | Actions column pinned to right by default |
| Maximum | Up to three pinned columns |
| Indicator | Pin icon on column header |

### Column Resizing

| Property | Standard |
|----------|----------|
| Trigger | Drag column border |
| Minimum | Column does not shrink below readable minimum |
| Persistence | Column widths saved per user per table |
| Double-click | Auto-fit to content width |
| Reset | Option to restore default column widths |

### Column Visibility

| Property | Standard |
|----------|----------|
| Trigger | Column visibility control in table toolbar |
| Interface | Checkbox list of all columns |
| Required columns | Some columns cannot be hidden — row identifier, actions |
| Persistence | Visibility preferences saved per user |
| Presets | Optional named column presets — "Summary view," "Full detail" |

### Sticky Headers

Column headers remain **fixed at the top** of the table viewport during vertical scroll.

| Property | Standard |
|----------|----------|
| Behavior | Header row sticks below workspace header or table toolbar |
| Shadow | Subtle shadow appears on header when content scrolls beneath |
| Sort/filter | Header controls remain interactive while sticky |

### Sticky Columns

The first column (row identifier) and last column (actions) are **pinned by default**.

| Property | Standard |
|----------|----------|
| First column | Engagement name, account code, or primary identifier |
| Last column | Row actions — view, edit, delete |
| Shadow | Subtle shadow on pinned column edge when content scrolls beneath |
| Background | Pinned columns have solid background — content does not show through |

### Bulk Actions

| Property | Standard |
|----------|----------|
| Selection | Checkbox column enables multi-select |
| Select all | Header checkbox selects all visible — with option for all matching filter |
| Action bar | Appears above table when items selected — shows count and available actions |
| Actions | Contextual — assign, export, delete, change status |
| Confirmation | Destructive bulk actions require confirmation with count |
| Clear | Deselect all action in bulk action bar |

### Row Actions

| Property | Standard |
|----------|----------|
| Position | Last column — icon button or ellipsis menu |
| Default | Most common action visible — "View" or "Edit" |
| Overflow | Additional actions in ellipsis dropdown |
| Hover | Row actions visible on row hover — or always visible in actions column |
| Keyboard | Accessible via keyboard when row is focused |

### Inline Editing

| Property | Standard |
|----------|----------|
| Trigger | Double-click cell or explicit edit mode |
| Fields | Simple values only — text, number, select, date |
| Save | Enter or click away saves — Escape cancels |
| Validation | Inline validation on save — error shown in cell |
| Complex edits | Open detail panel or modal — not inline |
| Indication | Editable cells subtly indicated — pencil icon on hover or edit mode toggle |

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Arrow keys** | Navigate between cells |
| **Tab** | Move to next editable cell |
| **Enter** | Confirm edit / open row detail |
| **Escape** | Cancel edit / deselect |
| **Space** | Toggle row selection |
| **Shift+Click** | Range selection |
| **Command/Ctrl+A** | Select all visible |
| **Delete** | Delete selected (with confirmation) |

### Selection

| Mode | Behavior |
|------|----------|
| Single | Click row to select — opens detail panel |
| Multi | Checkbox selection for bulk actions |
| Range | Shift+click for range selection |
| Visual | Selected rows have distinct background |
| Persistence | Selection preserved during filter/sort within session |

### Pagination

| Property | Standard |
|----------|----------|
| Position | Below table — right-aligned |
| Controls | Previous, next, page numbers, page size selector |
| Page sizes | 25, 50, 100 — default 25 |
| Count | "Showing 1–25 of 1,247" |
| Persistence | Page size preference saved per user |

### Virtual Scrolling

For datasets exceeding one thousand rows, tables use **virtual scrolling** — rendering only visible rows.

| Property | Standard |
|----------|----------|
| Trigger | Automatic for large datasets |
| Behavior | Scroll position maintained, rows rendered on demand |
| Row height | Fixed row height required for virtual scroll accuracy |
| Performance | Smooth scroll at 60fps — no visible rendering lag |
| Fallback | Pagination for extremely wide tables or variable row heights |

### Large Datasets

| Strategy | Application |
|----------|-------------|
| Server-side pagination | Data fetched per page — not loaded entirely client-side |
| Server-side sort/filter | Sorting and filtering executed server-side for large datasets |
| Progressive loading | Initial page loads immediately — subsequent pages prefetched |
| Count estimation | "1,000+" when exact count is expensive to compute |
| Export | Full dataset export available separately from table view |

### Empty Tables

| State | Display |
|-------|---------|
| No data | Illustration or icon, message, primary action to create first item |
| No filter results | "No results match your filters" with clear filters action |
| No permissions | "You don't have access" with explanation |

Empty tables are opportunities — not dead ends.

### Loading Tables

| State | Display |
|-------|---------|
| Initial load | Skeleton rows matching table structure — correct column count and approximate widths |
| Refresh | Subtle loading indicator in table toolbar — existing data remains visible |
| Filter/sort | Brief skeleton or inline spinner — not full table replacement |
| Row action | Inline spinner in action cell — row remains visible |

Tables never show a blank white space while loading. Skeleton loading preserves layout stability.

### Responsive Behavior

| Viewport | Adaptation |
|----------|------------|
| Desktop | Full table with all features |
| Laptop | Full table — pinned columns more important |
| Tablet | Priority columns visible — horizontal scroll for others. Card view option. |
| Mobile | Card list view — each row becomes a card with key fields. Table view not forced. |

### Accessibility

| Requirement | Standard |
|-------------|----------|
| Keyboard navigation | Full cell and row navigation via keyboard |
| Screen reader | Column headers announced, row selection communicated, sort state announced |
| Focus | Visible focus indicator on active cell and row |
| Color | Row status not communicated by color alone |
| Touch | Row height meets touch target minimum on tablet |

### Enterprise Productivity

Tables are optimized for professionals who spend hours in them:

| Feature | Purpose |
|---------|---------|
| Saved views | Named combinations of filters, sort, and column visibility |
| Export | CSV, Excel export of current view or full dataset |
| Copy | Copy cell value or row to clipboard |
| Keyboard-first | All common operations achievable without mouse |
| Density toggle | Comfortable, standard, compact — user preference |
| Column reorder | Drag to reorder columns — preference persisted |
| Print | Print-optimized view of current table state |

---

## 28. Charts & Analytics

### Chart Philosophy

Charts transform data into **visual understanding**. In this platform, charts serve professional decision-making — not decoration. Every chart must answer a specific question and be the best format for that question.

Charts are used sparingly on dashboards and analytical views. When a number, table, or KPI card answers the question, a chart is not needed.

### When to Use Charts

| Use Chart When | Use Table/KPI When |
|----------------|-------------------|
| Trend over time is the insight | Exact values are needed |
| Comparison between categories | Many categories require precise comparison |
| Distribution or proportion is the insight | Single or few values suffice |
| Pattern recognition aids decision | Detail and audit trail are required |

### Line Charts

| Attribute | Definition |
|-----------|------------|
| Purpose | Show change over continuous time |
| Best for | Revenue trends, engagement progress, error rates over time |
| X-axis | Time — days, weeks, months, quarters |
| Y-axis | Quantitative measure |
| Multiple lines | Up to four series — beyond requires separate charts or toggle |
| Do not use for | Categorical comparison, parts of a whole, small datasets (< 5 points) |

### Bar Charts

| Attribute | Definition |
|-----------|------------|
| Purpose | Compare values across categories |
| Best for | Engagements by status, hours by team member, findings by category |
| Orientation | Vertical for time-based categories, horizontal for long labels |
| Stacked | Show composition within categories — total and parts |
| Do not use for | Trend over time (use line), more than ten categories without scrolling |

### Pie Charts

| Attribute | Definition |
|-----------|------------|
| Purpose | Show proportion of a whole |
| Best for | Status distribution, risk category breakdown — when few segments |
| Segments | Maximum five — beyond this, use bar chart |
| Labels | Percentage and value on or adjacent to segments |
| Do not use for | Comparison between similar-sized segments, more than five categories, trend data |

### Area Charts

| Attribute | Definition |
|-----------|------------|
| Purpose | Show cumulative or stacked volume over time |
| Best for | Cumulative hours, stacked revenue streams, resource utilization |
| Stacked area | Multiple series showing contribution to total |
| Do not use for | Non-cumulative data where line chart is clearer, more than four series |

### Trend Charts

| Attribute | Definition |
|-----------|------------|
| Purpose | Highlight direction and momentum |
| Best for | KPI trend on dashboard cards, sparklines in table cells |
| Sparklines | Inline mini charts — no axes, trend direction only |
| Annotation | Key events marked on trend — deadline, policy change |
| Do not use for | Precise value reading — pair with numeric display |

### Heat Maps

| Attribute | Definition |
|-----------|------------|
| Purpose | Show intensity or frequency across two dimensions |
| Best for | Activity by day/hour, risk by entity and category, completion by team and period |
| Color scale | Single hue gradient — low to high intensity |
| Labels | Axis labels and cell values on hover |
| Do not use for | Precise value comparison — cells are approximations |

### Financial Charts

| Attribute | Definition |
|-----------|------------|
| Purpose | Present financial data with professional formatting |
| Best for | Revenue vs. expense, budget vs. actual, variance analysis |
| Formatting | Currency symbols, thousand separators, consistent decimal places |
| Comparison | Period-over-period with clear labeling |
| Waterfall | Show sequential positive and negative contributions to a total |
| Do not use for | Non-financial data, charts without axis labels and units |

### Audit Charts

| Attribute | Definition |
|-----------|------------|
| Purpose | Visualize audit-specific metrics |
| Best for | Finding distribution, testing completion, risk assessment matrix, materiality thresholds |
| Risk matrix | Two-axis grid — likelihood vs. impact with plotted items |
| Progress | Completion percentage across engagement phases |
| Do not use for | General data that a standard chart type handles better |

### Risk Matrices

| Attribute | Definition |
|-----------|------------|
| Purpose | Plot items on likelihood vs. impact dimensions |
| Axes | Likelihood (low to high) × Impact (low to high) |
| Zones | Color-coded zones — green, amber, red by risk level |
| Items | Plotted as points or bubbles — sized by additional dimension if needed |
| Interaction | Click item to navigate to detail |
| Do not use for | Data without two meaningful risk dimensions |

### Chart Usage Rules

| Rule | Description |
|------|-------------|
| **Every chart has a title** | States what the chart shows — not generic "Chart" |
| **Every axis is labeled** | With units — currency, percentage, count, days |
| **Legends are positioned consistently** | Below or right — not overlapping data |
| **Colors are semantic** | Consistent color meaning across all charts |
| **Tooltips on hover** | Exact values available on interaction |
| **Empty charts** | Message explaining why no data — not a blank chart area |
| **Loading charts** | Skeleton matching chart dimensions — not spinner |
| **Accessible** | Data table alternative available for screen readers |
| **No chart junk** | No 3D effects, unnecessary gridlines, decorative backgrounds |

---

# Part 7 — Motion, Feedback & Interaction

## 29. Motion Philosophy

### Why Motion Exists

Motion is not decoration. In this platform, motion serves **four essential functions**:

| Function | Purpose |
|----------|---------|
| **Explain** | Show how the interface changed — where content came from, where it went |
| **Guide** | Direct attention to the result of an action — new item, completed step |
| **Reassure** | Confirm that the system responded — save completed, navigation succeeded |
| **Connect** | Maintain spatial relationships during transitions — panel opened from button |

Motion that does not serve one of these functions is removed.

### Motion Must Never Distract

| Rule | Application |
|------|-------------|
| No gratuitous animation | Elements do not bounce, pulse, or spin without functional purpose |
| No continuous motion | Nothing animates indefinitely — except loading indicators |
| No motion for novelty | New features do not introduce new animation patterns |
| Respects preference | Reduced-motion system preference disables non-essential animation |
| Subtle by default | Animations are brief and understated — not theatrical |

During an eight-hour audit session, motion must be imperceptible in aggregate. Individual transitions are felt, not noticed.

### Motion Should Explain

When the interface changes, motion reveals the **causal relationship**:

| Transition | Motion |
|------------|--------|
| Panel opens | Slides from trigger edge — user sees connection |
| Modal appears | Fades and scales from center — draws focus |
| Item added to list | Enters from top or bottom — natural list position |
| Item removed | Exits in place — then remaining items adjust |
| Navigation | Content cross-fades or slides in direction of navigation |
| Tab switch | Content cross-fades — no lateral slide between tabs |

### Motion Should Guide

After an action, motion draws attention to the **result**:

| Action | Guidance |
|--------|----------|
| Save | Brief success indicator at save location |
| Create | New item scrolls into view with subtle highlight |
| Delete | Item exits — remaining content adjusts smoothly |
| Error | Field shakes subtly or error message enters — attention to problem |
| Navigation | Destination content enters — user sees they arrived |

### Motion Should Reassure

In a profession where data integrity is paramount, motion confirms system response:

| Event | Reassurance |
|-------|-------------|
| Save | "Saved" indicator with check animation |
| Submit | Progress transition from form to confirmation |
| Upload | Progress bar with completion animation |
| Sync | Subtle sync indicator — data is current |
| Long operation | Progress indicator — system has not frozen |

---

## 30. Micro Interactions

### Buttons

| Interaction | Behavior |
|-------------|----------|
| **Hover** | Subtle background shift or elevation — confirms interactivity |
| **Press** | Slight scale reduction or depth shift — tactile feedback |
| **Release** | Returns to hover state — action executes on release |
| **Loading** | Label replaced by spinner — button non-interactive |
| **Success** | Brief check icon — reverts to default after moment |
| **Focus** | Visible focus ring — keyboard navigation indicator |

### Inputs

| Interaction | Behavior |
|-------------|----------|
| **Focus** | Border color shifts to primary — label may animate to floated position |
| **Type** | No per-keystroke animation — instant character appearance |
| **Valid** | Optional subtle check icon on blur |
| **Error** | Border shifts to danger — error message slides in below |
| **Clear** | Clear button fades in when text present |

### Cards

| Interaction | Behavior |
|-------------|----------|
| **Hover** (interactive) | Subtle elevation increase — shadow deepens |
| **Click** | Brief press feedback — navigates or expands |
| **Select** | Border accent appears — background shift |

### Sidebar

| Interaction | Behavior |
|-------------|----------|
| **Collapse/expand** | Width animates smoothly — content reflows |
| **Hover expansion** | Sidebar overlays with slide — labels fade in |
| **Item hover** | Background highlight — instant, no delay |
| **Item active** | Background and accent animate on navigation |
| **Nested expand** | Children slide down — chevron rotates |

### Search

| Interaction | Behavior |
|-------------|----------|
| **Open** | Command palette fades and scales in |
| **Type** | Results filter instantly — no debounce animation |
| **Navigate results** | Highlight moves between items — keyboard and mouse |
| **Select** | Palette fades out — navigates to result |
| **Close** | Fade out — returns focus to trigger |

### Menus

| Interaction | Behavior |
|-------------|----------|
| **Open** | Dropdown appears below trigger — fade and slight slide down |
| **Hover item** | Background highlight — instant |
| **Select** | Menu closes — action executes |
| **Close** | Fade out on click outside or Escape |

### Dropdowns

| Interaction | Behavior |
|-------------|----------|
| **Open** | Options panel appears — positioned to avoid viewport edge |
| **Scroll** | Native scroll within options — no custom scroll animation |
| **Select** | Value updates — panel closes |
| **Keyboard** | Arrow keys navigate — Enter selects |

### Tabs

| Interaction | Behavior |
|-------------|----------|
| **Select** | Active indicator slides to selected tab — content cross-fades |
| **Hover** | Subtle text color shift |
| **Keyboard** | Arrow keys move between tabs |

### Tables

| Interaction | Behavior |
|-------------|----------|
| **Row hover** | Background highlight — instant |
| **Row select** | Background shift to selected state |
| **Sort** | Arrow indicator rotates — rows reorder with brief transition |
| **Column resize** | Drag border — live resize |
| **Inline edit** | Cell transitions to input — save returns to display |

### Selection

| Interaction | Behavior |
|-------------|----------|
| **Checkbox** | Check animates in — brief scale |
| **Select all** | All visible checkboxes animate |
| **Bulk bar** | Action bar slides in from bottom or top when selection made |
| **Deselect** | Action bar slides out |

### Hover

| Principle | Standard |
|-----------|----------|
| Delay | No delay on interactive elements — instant feedback |
| Tooltips | Appear after brief delay — 300ms — prevent flicker |
| Cursor | Pointer on interactive, default on content, col-resize on column borders |
| Subtlety | Hover states are visible but not dramatic |

### Focus

| Principle | Standard |
|-----------|----------|
| Visibility | Focus ring always visible — never removed |
| Style | Consistent focus ring across all interactive elements |
| Order | Tab order follows visual order |
| Trap | Focus trapped in modals — returns on close |

---

## 31. Loading Experience

### Loading Philosophy

Loading is not dead time. It is an opportunity to **maintain user confidence** while the system works. The platform never leaves users staring at a spinner wondering whether something is happening.

Traditional spinners are a last resort — not the primary loading experience.

### Skeletons

Skeleton screens are the **primary loading pattern**.

| Property | Standard |
|----------|----------|
| Structure | Skeleton matches the layout of the content it replaces — same regions, approximate sizes |
| Animation | Subtle pulse or shimmer — indicates activity without distraction |
| Duration | Displayed immediately — no delay before showing skeleton |
| Transition | Content replaces skeleton with fade — no layout shift |
| Types | Text lines, circles (avatars), rectangles (cards, images), table rows |

### Progressive Loading

Content loads in **priority order**:

| Priority | Content |
|----------|---------|
| 1 | Page structure — header, navigation, layout skeleton |
| 2 | Primary content — main data, table rows, form |
| 3 | Secondary content — sidebars, metadata, activity feeds |
| 4 | Tertiary content — analytics, recommendations, non-essential widgets |

Users see meaningful content as quickly as possible. Secondary content fills in without shifting primary content.

### Streaming

Long-running content generation uses **streaming** where possible:

| Application | Behavior |
|-------------|----------|
| AI-generated text | Content appears incrementally — word by word or section by section |
| Large reports | Pages or sections render as they complete |
| Search results | Results appear as they are found — not all at once |

### Optimistic Updates

For actions with high success probability, the UI **updates immediately** before server confirmation:

| Action | Optimistic Behavior |
|--------|---------------------|
| Toggle status | Status changes immediately — reverts on failure |
| Rename | Name updates immediately — reverts on failure |
| Assign | Assignee appears immediately — reverts on failure |
| Delete | Item removed immediately — restored on failure with notification |

Failed optimistic updates show clear error notification and revert the UI.

### Background Loading

Non-blocking operations load in the background:

| Behavior | Standard |
|----------|----------|
| Indicator | Subtle status in toolbar or header — "Syncing…" |
| Interaction | User can continue working — not blocked |
| Completion | Brief notification on completion — if user initiated |
| Failure | Notification with retry option |

### Large Imports

| Phase | Display |
|-------|---------|
| Upload | Progress bar with percentage and file name |
| Processing | Progress bar with stage — "Validating…" "Importing…" |
| Complete | Summary — "247 records imported, 3 skipped" |
| Error | Detail of failures with download error report option |

### AI Processing

| Phase | Display |
|-------|---------|
| Initiated | "Analyzing…" with contextual message — "Reviewing working papers" |
| In progress | Streaming output or staged progress — "Step 2 of 4" |
| Complete | Results appear with clear delineation from AI-generated content |
| Failure | Clear error with retry — "Analysis could not be completed" |

AI loading states set appropriate expectations for duration — AI operations are not instant.

### Report Generation

| Phase | Display |
|-------|---------|
| Requested | "Generating report…" with estimated time if known |
| Progress | Stage indicator — "Compiling data…" "Formatting…" "Finalizing…" |
| Complete | Download prompt or inline preview |
| Long reports | Background generation with notification on completion |

### When Spinners Are Permitted

| Context | Permitted |
|---------|-----------|
| Button action | Inline spinner replacing button label — brief actions only |
| Inline refresh | Small spinner in toolbar — table refresh |
| Unknown duration | Spinner with message — "This may take a moment" |
| Full-page initial load | Skeleton preferred — spinner only if layout unknown |

Spinners never appear without accompanying context message.

---

## 32. Feedback System

### Feedback Philosophy

Feedback is the platform's **voice**. Every message the system sends to the user — confirmation, warning, error, or information — must be clear, professional, and respectful. In a platform used by regulated professionals, feedback tone directly affects trust.

### Success

| Attribute | Standard |
|-----------|----------|
| Tone | Confident, brief, positive |
| Message | States what succeeded — "Engagement saved" |
| Duration | Auto-dismiss after brief period — 4 to 6 seconds |
| Visual | Success color accent, check icon |
| Placement | Toast notification — top-right or bottom-right |
| Action | None required — optional undo if applicable |

### Warning

| Attribute | Standard |
|-----------|----------|
| Tone | Calm, clear, actionable |
| Message | States the concern and recommended action — "3 workpapers are overdue. Review now?" |
| Duration | Persistent until dismissed or acted upon |
| Visual | Warning color accent, alert triangle icon |
| Placement | Banner at top of content area or inline within context |
| Action | Link to resolve — "Review overdue items" |

### Information

| Attribute | Standard |
|-----------|----------|
| Tone | Neutral, helpful |
| Message | States the information — "New IFRS standard available for review" |
| Duration | Auto-dismiss or dismissible |
| Visual | Information color accent, info icon |
| Placement | Toast or inline banner |
| Action | Optional link to learn more |

### Error

| Attribute | Standard |
|-----------|----------|
| Tone | Direct, helpful, never blaming |
| Message | States what failed, why if known, and what to do — "Unable to save. Check your connection and try again." |
| Duration | Persistent until dismissed or resolved |
| Visual | Danger color accent, alert icon |
| Placement | Inline at error source for field errors — toast or banner for system errors |
| Action | Retry button when applicable |
| Never | Raw error codes, stack traces, or "Something went wrong" without explanation |

### Confirmation

| Attribute | Standard |
|-----------|----------|
| Tone | Serious, clear, specific |
| Message | States the action and its consequence — "Delete engagement 'FY2025 Audit'? This cannot be undone." |
| Visual | Modal dialog — not toast |
| Actions | Destructive action (danger button) and cancel (secondary button) |
| Default | Cancel is the safe default focus — destructive action requires deliberate click |
| Input | High-stakes destruction may require typing entity name to confirm |

### Undo

| Attribute | Standard |
|-----------|----------|
| Availability | After non-destructive actions — delete, archive, status change |
| Duration | Undo available for 8 to 10 seconds after action |
| Presentation | Toast with undo action — "Engagement archived. Undo" |
| Behavior | Undo restores previous state — confirms restoration |

### Notifications

| Attribute | Standard |
|-----------|----------|
| Purpose | Asynchronous events — assignments, mentions, deadlines, system updates |
| Delivery | In-app notification panel — not modal interruption |
| Grouping | By time and type |
| Persistence | Remain until read or dismissed |
| External | Email notifications configurable — not default for all events |

### Toasts

| Attribute | Standard |
|-----------|----------|
| Purpose | Brief, non-blocking feedback — success, information, minor errors |
| Position | Top-right or bottom-right — consistent platform-wide |
| Stacking | Maximum three visible — older toasts dismissed as new appear |
| Content | Icon, message, optional action, dismiss button |
| Duration | Auto-dismiss — 4 to 6 seconds for success, persistent for errors |

### Banners

| Attribute | Standard |
|-----------|----------|
| Purpose | Important contextual information — warnings, system status, policy changes |
| Position | Top of content area — below header |
| Persistence | Remain until dismissed or condition resolved |
| Types | Warning, information, system announcement |
| Dismiss | User can dismiss — except critical security warnings |

### Dialogs

| Attribute | Standard |
|-----------|----------|
| Purpose | Decisions requiring user input — confirmations, forms, complex choices |
| Types | Alert (acknowledge), confirmation (choose), input (provide data) |
| Focus | Trapped within dialog |
| Backdrop | Dimmed background — click outside does not dismiss destructive dialogs |
| Actions | Maximum two primary actions — confirm and cancel |

### Tone of Communication

| Principle | Application |
|-----------|-------------|
| **Professional** | Language appropriate for regulated professionals |
| **Concise** | Minimum words to convey meaning |
| **Specific** | "3 workpapers failed validation" — not "Some items have errors" |
| **Actionable** | Every warning and error includes a path forward |
| **Humble** | System takes responsibility — "Unable to save" not "You entered invalid data" when system failed |
| **Consistent** | Same situation, same message — across the platform |

### Emotional Design

Feedback acknowledges the emotional context of professional work:

| Situation | Emotional Approach |
|-----------|-------------------|
| Success after long work | Acknowledge completion — "Audit sign-off complete" |
| Error during deadline | Calm, solution-focused — no alarm |
| Data loss prevention | Serious but not panicked — confirmation with clear stakes |
| First-time success | Encouraging but not patronizing — "Organization created" |
| System maintenance | Respectful of user's time — advance notice, clear duration |

---

## 33. Interaction States

### State System Purpose

Every interactive and display element in the platform exists in a defined state. States communicate **what an element is, what it can do, and what just happened** — without requiring the user to guess.

### Default

The resting state. No user interaction is active.

| Property | Standard |
|----------|----------|
| Appearance | Standard colors, borders, and typography |
| Interactivity | Element is fully interactive unless otherwise noted |
| Indication | No special visual treatment |

### Hover

The pointer is over an interactive element.

| Property | Standard |
|----------|----------|
| Appearance | Subtle background shift, elevation increase, or underline |
| Purpose | Confirms element is interactive |
| Delay | Instant — no hover delay on buttons and links |
| Touch | Hover states not required on touch-only devices |

### Pressed

The element is being activated.

| Property | Standard |
|----------|----------|
| Appearance | Slight scale reduction or depth decrease |
| Duration | Only while pointer is down |
| Purpose | Tactile feedback — action is registering |

### Focused

The element has keyboard focus.

| Property | Standard |
|----------|----------|
| Appearance | Visible focus ring — consistent across platform |
| Purpose | Keyboard navigation indicator |
| Persistence | Remains while element is focused |
| Never removed | Focus indicators are never suppressed |

### Selected

The element is chosen within a group.

| Property | Standard |
|----------|----------|
| Appearance | Background accent, check icon, or border highlight |
| Context | Selected row, checked checkbox, active tab, chosen filter |
| Multiple | Multiple selection supported where applicable — tables, filters |

### Active

The element represents the current context.

| Property | Standard |
|----------|----------|
| Appearance | Primary color accent, filled icon, bold label |
| Context | Active navigation item, current page, enabled toggle |
| Distinction | Active (current context) differs visually from selected (chosen item) |

### Disabled

The element is not interactive.

| Property | Standard |
|----------|----------|
| Appearance | Reduced opacity, muted colors, not-allowed cursor |
| Explanation | Tooltip or helper text explains why — on hover or always visible |
| Keyboard | Skipped in tab order |
| Never silent | Disabled without explanation is forbidden |

### Loading

The element or its content is being processed.

| Property | Standard |
|----------|----------|
| Appearance | Spinner, skeleton, or progress indicator replaces or overlays content |
| Interactivity | Element is non-interactive during loading |
| Context | Loading message explains what is happening |
| Timeout | If loading exceeds 10 seconds, additional context or cancel option provided |

### Empty

The container has no content to display.

| Property | Standard |
|----------|----------|
| Appearance | Centered message with icon or illustration |
| Message | Explains what is empty and how to populate |
| Action | Primary action to create or import first item |
| Tone | Opportunity — not error |

### Completed

The item represents a finished state.

| Property | Standard |
|----------|----------|
| Appearance | Success color accent, check icon, strikethrough, or muted treatment |
| Context | Completed task, signed-off engagement, approved item |
| Interaction | Completed items may be read-only or filterable |

### Archived

The item is inactive but preserved.

| Property | Standard |
|----------|----------|
| Appearance | Muted colors, reduced visual weight, archive icon |
| Context | Archived engagements, retired templates, inactive users |
| Interaction | Viewable but not editable — restorable with explicit action |
| Visibility | Hidden from default views — accessible via filter or archive section |

### Locked

The item cannot be modified.

| Property | Standard |
|----------|----------|
| Appearance | Lock icon, muted editable fields, read-only treatment |
| Context | Signed-off workpapers, closed periods, approved reports |
| Explanation | "Locked by [user] on [date]" — accountability visible |
| Override | Administrative unlock requires explicit permission and audit trail |

### State Combinations

Elements may combine states:

| Combination | Example |
|-------------|---------|
| Selected + Focused | Keyboard-navigated selected table row |
| Active + Hover | Hovering over current navigation item |
| Disabled + Loading | Not applicable — loading implies activity |
| Completed + Archived | Completed engagement that has been archived |
| Locked + Selected | Selected locked workpaper — viewable but not editable |

State combinations follow the visual priority: loading > error > disabled > active > selected > hover > default.

---

## Document Control

| Field | Value |
|-------|-------|
| Document | Design System |
| Version | 0.7.0 |
| Parts Complete | 1–7 |
| Status | Draft — Parts 1–7 Complete |
| Last Updated | 2026-06-30 |
| Change Summary | Added Part 5 (Navigation & Information Architecture), Part 6 (Dashboard, Tables & Data Visualization), Part 7 (Motion, Feedback & Interaction) |
| Author | Chief Product Designer / Design System Architect |
| Next Planned | Part 8 — Accessibility, Localization, and Governance |

### Revision History

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | 2026-06-30 | Part 1 — Foundation (Design Vision through Success Criteria) |
| 0.4.0 | 2026-06-30 | Parts 2–4 — Layout System, Visual Foundations, Component Foundations |
| 0.7.0 | 2026-06-30 | Parts 5–7 — Navigation & IA, Dashboard & Tables & Charts, Motion & Feedback & Interaction |

---

**Parts 5–7 are complete. Await next instruction.**

---

*End of Parts 5–7*
