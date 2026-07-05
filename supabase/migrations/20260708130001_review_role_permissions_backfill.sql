-- FEATURE-REVIEW-001: Role permission backfill for review. Idempotent.

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code IN (
  'review.read', 'review.create', 'review.update', 'review.archive',
  'review.review', 'review.approve', 'review.comment'
)
WHERE r.slug IN ('platform_owner', 'organization_owner', 'organization_admin', 'workspace_admin')
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code IN (
  'review.read', 'review.create', 'review.update', 'review.review', 'review.comment'
)
WHERE r.slug = 'manager'
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code IN (
  'review.read', 'review.update', 'review.comment'
)
WHERE r.slug = 'member'
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code = 'review.read'
WHERE r.slug = 'viewer'
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;
