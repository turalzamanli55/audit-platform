<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:enterprise-architecture-constitution -->
# Enterprise Architecture Constitution (Mandatory)

Before implementing **any** feature, you MUST follow:

1. [`docs/ENTERPRISE_ARCHITECTURE_CONSTITUTION.md`](docs/ENTERPRISE_ARCHITECTURE_CONSTITUTION.md) — implementation constitution (highest priority over feature requests)
2. [`docs/PROJECT_BIBLE.md`](docs/PROJECT_BIBLE.md) — product constitution
3. [`docs/MASTER_PRD.md`](docs/MASTER_PRD.md) and [`docs/SYSTEM_ARCHITECTURE.md`](docs/SYSTEM_ARCHITECTURE.md) when relevant

**Rules in short:** understand the whole system first; reuse before inventing; never duplicate audit/history/lifecycle/auth/i18n/delete; new tables/repos/services are last resort with written justification; Company Administration stays a permission-scoped subset of Platform; every UI ships EN/AZ/RU/TR and is responsive. If a request conflicts with the constitution, stop, explain, and propose a compliant alternative.
<!-- END:enterprise-architecture-constitution -->
