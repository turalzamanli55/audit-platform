-- FEATURE-COMPLETION-001: Role permission backfill for completion. Idempotent.

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code IN (
  'completion.read', 'completion.create', 'completion.update', 'completion.archive',
  'completion.review', 'completion.approve', 'completion.comment'
)
WHERE r.slug IN ('platform_owner', 'organization_owner', 'organization_admin', 'workspace_admin')
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code IN (
  'completion.read', 'completion.create', 'completion.update', 'completion.review', 'completion.comment'
)
WHERE r.slug = 'manager'
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code IN (
  'completion.read', 'completion.update', 'completion.comment'
)
WHERE r.slug = 'member'
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code = 'completion.read'
WHERE r.slug = 'viewer'
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;
