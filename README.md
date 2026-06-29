# Audit Platform

## Project Overview

Enterprise-grade SaaS platform for audit, compliance, and financial reporting workflows. Built with a modern AI-first architecture to compete with industry leaders while delivering a superior user experience.

## Mission

Build a world-class enterprise platform that transforms how organizations manage audit processes, compliance workflows, and financial reporting — powered by intelligent automation and modern technology.

## Vision

Become the leading AI-first audit and compliance platform, setting new standards for usability, intelligence, and enterprise reliability in the global market.

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Bundler (Dev) | Turbopack |
| Package Manager | npm |
| Linting | ESLint |

## Architecture Overview

The platform follows a modular, domain-driven architecture:

- **App Router** — File-based routing with server and client components
- **Feature Modules** — Domain-specific logic isolated in `src/features` and `src/modules`
- **Service Layer** — Business logic in `src/services`
- **Repository Pattern** — Data access abstraction in `src/repositories`
- **AI Engine** — Dedicated AI subsystem documented in `ai/`
- **Internationalization** — Multilingual support (Azerbaijani, English, Russian, Turkish)

See `architecture/` and `docs/` for detailed specifications.

## Folder Structure

```
audit/
├── .github/              # CI/CD and GitHub workflows
├── ai/                   # AI engine documentation
├── api/                  # API specifications
├── architecture/         # System architecture docs
├── assets/               # Static assets
├── database/             # Database documentation
├── design/               # Design system and UX guidelines
├── docs/                 # Project documentation
├── modules/              # Module-level documentation
├── prompts/              # AI and development prompts
├── public/               # Public static files
├── roadmap/              # Product roadmap
├── scripts/              # Build and utility scripts
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # Shared UI components
│   ├── config/           # Application configuration
│   ├── constants/        # Application constants
│   ├── contexts/         # React contexts
│   ├── emails/           # Email templates
│   ├── features/         # Feature modules
│   ├── generated/        # Auto-generated code
│   ├── hooks/            # Custom React hooks
│   ├── i18n/             # Internationalization
│   ├── lib/              # Shared libraries
│   ├── middleware/       # Middleware utilities
│   ├── modules/          # Domain modules
│   ├── providers/        # React providers
│   ├── repositories/     # Data access layer
│   ├── schemas/          # Validation schemas
│   ├── services/         # Business services
│   ├── stores/           # State management
│   ├── styles/           # Global styles
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   └── validators/       # Validation logic
└── tests/                # Test suites
```

## Development Philosophy

- **Production-first** — Every decision assumes enterprise scale and reliability
- **Type safety** — TypeScript everywhere; no implicit any
- **Modularity** — Clear boundaries between domains, services, and UI
- **Documentation-driven** — Architecture and decisions documented before implementation
- **AI-native** — Intelligence embedded at the platform core, not bolted on

## Coding Standards

See [docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md) for full guidelines.

- TypeScript strict mode
- ESLint-enforced code quality
- Consistent import aliases (`@/*`)
- Desktop-first responsive design
- Accessibility as a first-class concern

## Project Rules

See [prompts/PROJECT_RULES.md](prompts/PROJECT_RULES.md) for AI and development rules.

- No business logic without documented requirements
- No database changes without schema documentation
- No API endpoints without specification
- Security review required for all auth and data access code

## Roadmap

See [roadmap/MASTER_ROADMAP.md](roadmap/MASTER_ROADMAP.md) for the product roadmap.

_Roadmap details to be defined._

## License

_License to be determined._

## Contribution

_Contribution guidelines to be defined._

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (Turbopack)
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to view the application.
