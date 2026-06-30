# RLS Standards

## Purpose

Row Level Security policies for multi-tenant isolation on the Audit Platform foundation layer.

## Status

Active — Sprint 2B

## Core Principles

1. **Deny by default** — RLS enabled on every foundation table; no policy for `anon`.
2. **Authenticated only** — policies target `TO authenticated`.
3. **Tenant isolation** — organization and workspace boundaries enforced via membership.
4. **Service role bypass** — `is_service_role()` returns true for privileged server operations.
5. **Soft-delete awareness** — helper functions filter `deleted_at IS NULL` and `status = 'active'`.

## Helper Functions

| Function | Purpose |
|----------|---------|
| `auth_user_id()` | Returns `auth.uid()` |
| `is_service_role()` | Detects service role JWT |
| `user_belongs_to_organization(uuid)` | Membership check at org scope |
| `user_belongs_to_workspace(uuid)` | Membership check at workspace scope |
| `user_organization_ids()` | Set of org IDs for current user |
| `user_workspace_ids()` | Set of workspace IDs for current user |

All helpers are `SECURITY DEFINER` with `SET search_path = public`.

## Policy Matrix

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `organizations` | Member or service | Service only | Member or service | Service only |
| `workspaces` | Workspace/org member or service | Service only | Workspace/org member or service | Service only |
| `companies` | Workspace member or service | Workspace member or service | Workspace member or service | Service only |
| `roles` | Platform roles public; org roles scoped | Service only | Service only | Service only |
| `permissions` | All authenticated (active) | Service only | Service only | Service only |
| `role_permissions` | All authenticated (active) | Service only | Service only | Service only |
| `memberships` | Self, org members, or service | Service only | Service only | Service only |
| `*_settings` | Tenant member or service | Tenant member or service | Tenant member or service | Inherited |
| `audit_logs` | Org member or service | Org member or service | Service only | Service only |

## Grant Model

```sql
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
```

## Application Guidance

- **Browser/server clients** — use authenticated user session; RLS enforces isolation.
- **Service client** — use for provisioning (org create, membership assign) where policies require service role.
- **Never expose service role key** to client bundles.

## Testing RLS

1. Create test user via Supabase Auth.
2. Insert membership via service client.
3. Verify user can only SELECT rows within their org/workspace.
4. Verify cross-tenant SELECT returns zero rows.

## Future Sprints

Business modules will add resource-specific policies. Extend — do not replace — foundation policies.
