# Repository Standards

## Purpose

TypeScript repository layer conventions for Supabase data access in the Audit Platform.

## Status

Active — Sprint 2B

## Architecture

```
Server Action / Route Handler
        ↓
Repository (AuthenticatedRepository)
        ↓
Supabase Client (server or service)
        ↓
PostgreSQL + RLS
```

## Base Classes

- `BaseRepository` — holds typed `SupabaseClient<Database>`.
- `AuthenticatedRepository` — adds `RepositoryContext` (userId, tenant).

## Implemented Repositories

| Repository | Table(s) | Scope |
|------------|----------|-------|
| `OrganizationRepository` | `organizations`, `organization_settings` | Org CRUD + defaults |
| `WorkspaceRepository` | `workspaces`, `workspace_settings` | Workspace CRUD + defaults |
| `CompanyRepository` | `companies`, `company_settings` | Company CRUD + defaults |
| `MembershipRepository` | `memberships` | Membership lifecycle |
| `RoleRepository` | `roles`, `role_permissions` | Platform/org roles |
| `PermissionRepository` | `permissions`, `role_permissions` | Permission catalog |

## Query Conventions

1. **Active records** — always apply `applyActiveFilter()` (`.is("deleted_at", null)`).
2. **Result handling** — use `unwrapSupabaseResult()`; throw `DatabaseError` on PostgREST errors.
3. **Not found** — use `requireRow()` → `NotFoundError`.
4. **Optimistic locking** — pass `expectedVersion`; `.eq("version", expectedVersion)`.
5. **Soft delete** — set `deleted_at`, `deleted_by`, appropriate `status`; never hard delete.

## Create Pattern

On organization/workspace/company create, repositories also insert settings row with default JSON:

```typescript
await this.client.from("organization_settings").insert({
  organization_id: organization.id,
  settings: { ...DEFAULT_ORGANIZATION_SETTINGS },
});
```

## Service vs Authenticated Client

| Operation | Client |
|-----------|--------|
| User-scoped reads | `createServerClient()` |
| Org provisioning, membership writes | `createServiceClient()` |

RLS policies dictate which client is required. Membership INSERT requires service role per current policies.

## Type Safety

- Import row types from `@/types/supabase`: `Tables<"organizations">`.
- `Database` type must match applied migrations.
- Export domain aliases from repository modules (`Organization`, `Workspace`, etc.).

## Error Mapping

| Condition | Error |
|-----------|-------|
| PostgREST failure | `DatabaseError` |
| Zero rows on required fetch | `NotFoundError` |
| Version mismatch | `ConflictError` |

## Extension Guidelines

1. Add new repository under `src/repositories/{entity}/`.
2. Export from `src/repositories/index.ts`.
3. Extend `AuthenticatedRepository` unless explicitly public/read-only.
4. Do not bypass RLS without documented service-role requirement.
5. No raw SQL in repositories — use Supabase query builder.

## Testing

Repository integration tests require applied migrations and seed. Unit tests mock `SupabaseClient` at action layer.
