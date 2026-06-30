-- Platform roles, permissions, and default settings templates
-- Sprint 2B — no business data, no fake organizations

-- ---------------------------------------------------------------------------
-- Platform permissions
-- ---------------------------------------------------------------------------

INSERT INTO public.permissions (code, name, description, scope, resource, status)
VALUES
  ('platform.administer', 'Platform Administration', 'Full platform operator administration', 'platform', 'platform', 'active'),
  ('organization.read', 'Read Organization', 'View organization profile and metadata', 'organization', 'organization', 'active'),
  ('organization.administer', 'Administer Organization', 'Manage organization configuration and policies', 'organization', 'organization', 'active'),
  ('organization.configure', 'Configure Organization', 'Modify organization settings', 'organization', 'organization', 'active'),
  ('workspace.read', 'Read Workspace', 'View workspace profile and metadata', 'workspace', 'workspace', 'active'),
  ('workspace.administer', 'Administer Workspace', 'Manage workspace configuration', 'workspace', 'workspace', 'active'),
  ('workspace.configure', 'Configure Workspace', 'Modify workspace settings', 'workspace', 'workspace', 'active'),
  ('company.read', 'Read Company', 'View company profile and metadata', 'company', 'company', 'active'),
  ('company.administer', 'Administer Company', 'Manage company configuration', 'company', 'company', 'active'),
  ('company.configure', 'Configure Company', 'Modify company settings', 'company', 'company', 'active'),
  ('membership.read', 'Read Memberships', 'View organization and workspace memberships', 'organization', 'membership', 'active'),
  ('membership.administer', 'Administer Memberships', 'Manage user memberships and assignments', 'organization', 'membership', 'active'),
  ('role.read', 'Read Roles', 'View role definitions', 'organization', 'role', 'active'),
  ('role.administer', 'Administer Roles', 'Manage role assignments within policy boundaries', 'organization', 'role', 'active'),
  ('settings.read', 'Read Settings', 'View tenant settings', 'organization', 'settings', 'active'),
  ('settings.configure', 'Configure Settings', 'Modify tenant settings', 'organization', 'settings', 'active'),
  ('audit_log.read', 'Read Audit Logs', 'View platform audit history', 'organization', 'audit_log', 'active');

-- ---------------------------------------------------------------------------
-- Platform roles
-- ---------------------------------------------------------------------------

INSERT INTO public.roles (slug, name, description, scope, is_system, status)
VALUES
  ('platform_owner', 'Platform Owner', 'Vendor platform operator with full platform access', 'platform', true, 'active'),
  ('organization_owner', 'Organization Owner', 'Top-level customer tenant administrator', 'platform', true, 'active'),
  ('organization_admin', 'Organization Admin', 'Delegated organization administrator', 'platform', true, 'active'),
  ('workspace_admin', 'Workspace Admin', 'Workspace-level administrator', 'platform', true, 'active'),
  ('manager', 'Manager', 'Operational manager with elevated workspace access', 'platform', true, 'active'),
  ('member', 'Member', 'Standard professional member', 'platform', true, 'active'),
  ('viewer', 'Viewer', 'Read-only member', 'platform', true, 'active');

-- ---------------------------------------------------------------------------
-- Role permission mappings
-- ---------------------------------------------------------------------------

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.slug = 'platform_owner';

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code IN (
  'organization.read', 'organization.administer', 'organization.configure',
  'workspace.read', 'workspace.administer', 'workspace.configure',
  'company.read', 'company.administer', 'company.configure',
  'membership.read', 'membership.administer',
  'role.read', 'role.administer',
  'settings.read', 'settings.configure',
  'audit_log.read'
)
WHERE r.slug = 'organization_owner';

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code IN (
  'organization.read', 'organization.administer', 'organization.configure',
  'workspace.read', 'workspace.administer', 'workspace.configure',
  'company.read', 'company.administer', 'company.configure',
  'membership.read', 'membership.administer',
  'role.read',
  'settings.read', 'settings.configure',
  'audit_log.read'
)
WHERE r.slug = 'organization_admin';

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code IN (
  'workspace.read', 'workspace.administer', 'workspace.configure',
  'company.read', 'company.administer', 'company.configure',
  'membership.read',
  'role.read',
  'settings.read', 'settings.configure',
  'audit_log.read'
)
WHERE r.slug = 'workspace_admin';

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code IN (
  'workspace.read',
  'company.read', 'company.administer',
  'membership.read',
  'settings.read',
  'audit_log.read'
)
WHERE r.slug = 'manager';

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code IN (
  'organization.read',
  'workspace.read',
  'company.read',
  'membership.read',
  'settings.read'
)
WHERE r.slug = 'member';

INSERT INTO public.role_permissions (role_id, permission_id, status)
SELECT r.id, p.id, 'active'
FROM public.roles r
JOIN public.permissions p ON p.code IN (
  'organization.read',
  'workspace.read',
  'company.read',
  'settings.read',
  'audit_log.read'
)
WHERE r.slug = 'viewer';
