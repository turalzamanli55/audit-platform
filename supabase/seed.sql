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
  ('engagement.read', 'Read Engagement', 'View engagement profile and metadata', 'workspace', 'engagement', 'active'),
  ('engagement.create', 'Create Engagement', 'Create new engagements', 'workspace', 'engagement', 'active'),
  ('engagement.update', 'Update Engagement', 'Modify engagement information', 'workspace', 'engagement', 'active'),
  ('engagement.archive', 'Archive Engagement', 'Archive engagements', 'workspace', 'engagement', 'active'),
  ('engagement.delete', 'Delete Engagement', 'Permanently delete engagements (restricted)', 'workspace', 'engagement', 'active'),
  ('planning.read', 'Read Planning', 'View audit planning workspace and documents', 'workspace', 'planning', 'active'),
  ('planning.create', 'Create Planning', 'Initiate audit planning for an engagement', 'workspace', 'planning', 'active'),
  ('planning.update', 'Update Planning', 'Modify audit planning content', 'workspace', 'planning', 'active'),
  ('planning.archive', 'Archive Planning', 'Archive audit planning records', 'workspace', 'planning', 'active'),
  ('planning.submit', 'Submit Planning', 'Submit audit planning for partner review', 'workspace', 'planning', 'active'),
  ('planning.review', 'Review Planning', 'Return audit planning for revision', 'workspace', 'planning', 'active'),
  ('planning.approve', 'Approve Planning', 'Approve audit planning and clear fieldwork gate', 'workspace', 'planning', 'active'),
  ('planning.comment', 'Comment on Planning', 'Add planning review comments', 'workspace', 'planning', 'active'),
  ('risk_assessment.read', 'Read Risk Assessment', 'View risk assessment workspace and register', 'workspace', 'risk_assessment', 'active'),
  ('risk_assessment.create', 'Create Risk Assessment', 'Initiate risk assessment after planning approval', 'workspace', 'risk_assessment', 'active'),
  ('risk_assessment.update', 'Update Risk Assessment', 'Modify risk ratings, responses, and register items', 'workspace', 'risk_assessment', 'active'),
  ('risk_assessment.archive', 'Archive Risk Assessment', 'Archive risk assessment records', 'workspace', 'risk_assessment', 'active'),
  ('risk_assessment.submit', 'Submit Risk Assessment', 'Submit risk assessment for review', 'workspace', 'risk_assessment', 'active'),
  ('risk_assessment.review', 'Review Risk Assessment', 'Review and return risk assessment documentation', 'workspace', 'risk_assessment', 'active'),
  ('risk_assessment.approve', 'Approve Risk Assessment', 'Approve risk assessment and acknowledge significant risks', 'workspace', 'risk_assessment', 'active'),
  ('risk_assessment.comment', 'Comment on Risk Assessment', 'Add review and internal risk notes', 'workspace', 'risk_assessment', 'active'),
  ('materiality.read', 'Read Materiality', 'View materiality workspace and ISA 320 documentation', 'workspace', 'materiality', 'active'),
  ('materiality.create', 'Create Materiality', 'Initiate materiality package for an engagement', 'workspace', 'materiality', 'active'),
  ('materiality.update', 'Update Materiality', 'Modify materiality thresholds, benchmarks, and calculations', 'workspace', 'materiality', 'active'),
  ('materiality.review', 'Review Materiality', 'Review and return materiality documentation', 'workspace', 'materiality', 'active'),
  ('materiality.approve', 'Approve Materiality', 'Approve materiality thresholds per ISA 320', 'workspace', 'materiality', 'active'),
  ('materiality.archive', 'Archive Materiality', 'Archive materiality packages', 'workspace', 'materiality', 'active'),
  ('materiality.comment', 'Comment on Materiality', 'Add review and internal materiality notes', 'workspace', 'materiality', 'active'),
  ('fieldwork.read', 'Read Fieldwork', 'View fieldwork workspace, procedures, and working papers', 'workspace', 'fieldwork', 'active'),
  ('fieldwork.create', 'Create Fieldwork', 'Initiate fieldwork for an approved engagement plan', 'workspace', 'fieldwork', 'active'),
  ('fieldwork.update', 'Update Fieldwork', 'Modify fieldwork procedures and working papers', 'workspace', 'fieldwork', 'active'),
  ('fieldwork.archive', 'Archive Fieldwork', 'Archive fieldwork records', 'workspace', 'fieldwork', 'active'),
  ('fieldwork.assign', 'Assign Fieldwork', 'Assign audit procedures to auditors', 'workspace', 'fieldwork', 'active'),
  ('fieldwork.review', 'Review Fieldwork', 'Review and return fieldwork documentation', 'workspace', 'fieldwork', 'active'),
  ('fieldwork.comment', 'Comment on Fieldwork', 'Add auditor, review, and internal fieldwork notes', 'workspace', 'fieldwork', 'active'),
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
  'engagement.read', 'engagement.create', 'engagement.update', 'engagement.archive',
  'planning.read', 'planning.create', 'planning.update', 'planning.archive',
  'planning.submit', 'planning.review', 'planning.approve', 'planning.comment',
  'risk_assessment.read', 'risk_assessment.create', 'risk_assessment.update', 'risk_assessment.archive',
  'risk_assessment.submit', 'risk_assessment.review', 'risk_assessment.approve', 'risk_assessment.comment',
  'materiality.read', 'materiality.create', 'materiality.update', 'materiality.archive',
  'materiality.review', 'materiality.approve', 'materiality.comment',
  'fieldwork.read', 'fieldwork.create', 'fieldwork.update', 'fieldwork.archive',
  'fieldwork.assign', 'fieldwork.review', 'fieldwork.comment',
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
  'engagement.read', 'engagement.create', 'engagement.update', 'engagement.archive',
  'planning.read', 'planning.create', 'planning.update', 'planning.archive',
  'planning.submit', 'planning.review', 'planning.approve', 'planning.comment',
  'risk_assessment.read', 'risk_assessment.create', 'risk_assessment.update', 'risk_assessment.archive',
  'risk_assessment.submit', 'risk_assessment.review', 'risk_assessment.approve', 'risk_assessment.comment',
  'materiality.read', 'materiality.create', 'materiality.update', 'materiality.archive',
  'materiality.review', 'materiality.approve', 'materiality.comment',
  'fieldwork.read', 'fieldwork.create', 'fieldwork.update', 'fieldwork.archive',
  'fieldwork.assign', 'fieldwork.review', 'fieldwork.comment',
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
  'engagement.read', 'engagement.create', 'engagement.update', 'engagement.archive',
  'planning.read', 'planning.create', 'planning.update', 'planning.archive',
  'planning.submit', 'planning.review', 'planning.approve', 'planning.comment',
  'risk_assessment.read', 'risk_assessment.create', 'risk_assessment.update', 'risk_assessment.archive',
  'risk_assessment.submit', 'risk_assessment.review', 'risk_assessment.approve', 'risk_assessment.comment',
  'materiality.read', 'materiality.create', 'materiality.update', 'materiality.archive',
  'materiality.review', 'materiality.approve', 'materiality.comment',
  'fieldwork.read', 'fieldwork.create', 'fieldwork.update', 'fieldwork.archive',
  'fieldwork.assign', 'fieldwork.review', 'fieldwork.comment',
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
  'engagement.read', 'engagement.create', 'engagement.update',
  'planning.read', 'planning.create', 'planning.update', 'planning.submit',
  'risk_assessment.read', 'risk_assessment.create', 'risk_assessment.update', 'risk_assessment.submit', 'risk_assessment.comment',
  'materiality.read', 'materiality.create', 'materiality.update', 'materiality.comment',
  'fieldwork.read', 'fieldwork.create', 'fieldwork.update', 'fieldwork.assign', 'fieldwork.comment',
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
  'engagement.read',
  'planning.read',
  'risk_assessment.read',
  'materiality.read', 'materiality.update', 'materiality.comment',
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
  'engagement.read',
  'planning.read',
  'risk_assessment.read',
  'materiality.read',
  'settings.read',
  'audit_log.read'
)
WHERE r.slug = 'viewer';
