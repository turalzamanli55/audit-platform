-- Backfill planning.submit/review/approve/comment permissions. Idempotent.

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code IN (
  'planning.read', 'planning.create', 'planning.update', 'planning.archive',
  'planning.submit', 'planning.review', 'planning.approve', 'planning.comment'
)
WHERE r.slug IN ('platform_owner', 'organization_owner', 'organization_admin', 'workspace_admin')
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code IN (
  'planning.read', 'planning.create', 'planning.update',
  'planning.submit', 'planning.comment'
)
WHERE r.slug = 'manager'
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code IN ('planning.read', 'planning.comment')
WHERE r.slug IN ('member', 'viewer')
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;
