-- P0 recovery: backfill role_permissions for engagement.* (and any other permissions
-- added after the initial seed). Mirrors supabase/seed.sql role mappings. Idempotent.

-- platform_owner — all permissions (seed: CROSS JOIN)
INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.slug = 'platform_owner'
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;

-- organization_owner
INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code IN (
  'engagement.read', 'engagement.create', 'engagement.update', 'engagement.archive'
)
WHERE r.slug = 'organization_owner'
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;

-- organization_admin
INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code IN (
  'engagement.read', 'engagement.create', 'engagement.update', 'engagement.archive'
)
WHERE r.slug = 'organization_admin'
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;

-- workspace_admin
INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code IN (
  'engagement.read', 'engagement.create', 'engagement.update', 'engagement.archive'
)
WHERE r.slug = 'workspace_admin'
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;

-- manager
INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code IN (
  'engagement.read', 'engagement.create', 'engagement.update'
)
WHERE r.slug = 'manager'
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;

-- member
INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code = 'engagement.read'
WHERE r.slug = 'member'
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;

-- viewer
INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code = 'engagement.read'
WHERE r.slug = 'viewer'
ON CONFLICT (role_id, permission_id) WHERE deleted_at IS NULL DO NOTHING;
