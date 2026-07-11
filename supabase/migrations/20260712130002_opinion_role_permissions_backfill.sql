-- FEATURE-OPINION-001: Role permission backfill for opinion. Idempotent.

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code IN (
  'opinion.read', 'opinion.create', 'opinion.update', 'opinion.archive',
  'opinion.review', 'opinion.approve', 'opinion.comment'
)
WHERE r.slug IN ('platform_owner', 'organization_owner', 'organization_admin', 'workspace_admin')
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code IN (
  'opinion.read', 'opinion.create', 'opinion.update', 'opinion.review', 'opinion.comment'
)
WHERE r.slug = 'manager'
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code IN (
  'opinion.read', 'opinion.update', 'opinion.comment'
)
WHERE r.slug = 'member'
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code = 'opinion.read'
WHERE r.slug = 'viewer'
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;
