# Migration Standards

## Purpose

Defines how database migrations are authored, ordered, validated, and deployed for the Audit Platform.

## Status

Active — Sprint 2B

## File Naming

```
YYYYMMDDHHMMSS_descriptive_name.sql
```

Example: `20260630000001_extensions_and_common.sql`

## Migration Order (Sprint 2B)

| File | Scope |
|------|-------|
| `20260630000001_extensions_and_common.sql` | Extensions, enums, shared functions, default settings helpers |
| `20260630000002_foundation_tables.sql` | Foundation tables, indexes, triggers, RLS helper functions |
| `20260630000003_rls_policies.sql` | Enable RLS, policies, grants |

## Authoring Rules

1. **Idempotent extensions** — use `CREATE EXTENSION IF NOT EXISTS`.
2. **Explicit schemas** — qualify objects as `public.*`.
3. **No destructive DDL** on existing production objects without a compensating migration.
4. **Comments** — header block describing sprint and purpose.
5. **No business data** in migrations except structural seed requirements.
6. **Seed separation** — platform roles/permissions in `supabase/seed.sql`.

## Pre-Deploy Checklist

- [ ] Migration applies cleanly on empty database
- [ ] No duplicate migration timestamps
- [ ] RLS enabled on all new tables
- [ ] Enterprise columns present
- [ ] Triggers attached for `updated_at`, `version`, audit actors
- [ ] Indexes created for FKs and unique business keys
- [ ] `supabase/seed.sql` runs after migrations

## Local Validation

```bash
supabase db reset --local
```

Requires Docker Desktop. Validates migrations + seed end-to-end.

## Remote Deployment

```bash
supabase link --project-ref <ref>
supabase db push
supabase db seed   # if seed not run during push
```

## Type Generation

After schema is applied:

```bash
npx supabase gen types typescript --project-id <ref> > src/types/supabase.ts
```

When CLI access is unavailable, types must be manually synchronized with migrations.

## Rollback Procedure

1. Identify the failing migration.
2. Create a new migration that reverses DDL (drop policies → drop tables → drop functions).
3. Never modify migrations already applied to shared environments.
4. Document incident in deployment notes.

## Health Verification

`checkMigrationHealth()` verifies:

- All 11 foundation tables are queryable
- Platform role count ≥ 7
- Permission count ≥ 17

## Sprint Boundaries

Sprint 2B migrations must NOT include:

- Financial tables
- Audit engagement tables
- AI tables
- Notifications table
- Reporting views
