import { describe, expect, it } from "vitest";
import {
  canonicalOperationFingerprint,
  migrationParser,
  resolveDynamicFragment,
} from "@/lib/database-governance/parser";

describe("MigrationParser normalization pipeline", () => {
  it("parses static ALTER TABLE ENABLE ROW LEVEL SECURITY", () => {
    const ops = migrationParser.normalizeStatement(
      "ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY",
    );
    expect(ops.map((operation) => operation.kind)).toEqual(["EnableRLS"]);
    expect(ops[0]?.table).toBe("organizations");
    expect(ops[0]?.source.mode).toBe("static");
  });

  it("resolves EXECUTE format(...) ENABLE RLS to EnableRLS", () => {
    const units = resolveDynamicFragment(`
      BEGIN
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', 'workspaces');
      END
    `);
    const ops = migrationParser.runPipeline(
      `DO $$ BEGIN EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', 'workspaces'); END $$`,
      "t",
    ).operations;
    expect(ops.some((operation) => operation.kind === "EnableRLS" && operation.table === "workspaces")).toBe(
      true,
    );
    expect(units.some((unit) => /ENABLE ROW LEVEL SECURITY/i.test(unit.sql))).toBe(true);
  });

  it("resolves EXECUTE USING with a bound SQL variable", () => {
    const result = migrationParser.runPipeline(
      `
      DO $$
      DECLARE
        t text;
        ddl text;
      BEGIN
        FOREACH t IN ARRAY ARRAY['companies']
        LOOP
          ddl := format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
          EXECUTE ddl;
        END LOOP;
      END $$;
      `,
      "exec_using",
    );
    expect(
      result.operations.some(
        (operation) =>
          operation.kind === "EnableRLS" && operation.table === "companies",
      ),
    ).toBe(true);

    const literalUsing = migrationParser.runPipeline(
      `
      DO $$ BEGIN
        EXECUTE 'ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY' USING 1;
      END $$;
      `,
      "exec_using_literal",
    );
    expect(
      literalUsing.operations.some(
        (operation) =>
          operation.kind === "EnableRLS" && operation.table === "companies",
      ),
    ).toBe(true);
  });

  it("expands FOREACH LOOP dynamic GRANT + CREATE POLICY", () => {
    const result = migrationParser.runPipeline(
      `
      DO $$
      DECLARE t text;
      BEGIN
        FOREACH t IN ARRAY ARRAY['alpha_table', 'beta_table']
        LOOP
          EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
          EXECUTE format('CREATE POLICY %I_select ON public.%I FOR SELECT TO authenticated USING (true)', t, t);
          EXECUTE format('GRANT SELECT ON public.%I TO authenticated', t);
        END LOOP;
      END $$;
      `,
      "foreach_mig",
    );

    const kinds = result.operations.map((operation) => operation.kind).sort();
    expect(kinds.filter((kind) => kind === "EnableRLS")).toHaveLength(2);
    expect(kinds.filter((kind) => kind === "Grant")).toHaveLength(2);
    expect(kinds.filter((kind) => kind === "CreatePolicy")).toHaveLength(2);
    expect(
      result.operations
        .filter((operation) => operation.kind === "EnableRLS")
        .map((operation) => operation.table)
        .sort(),
    ).toEqual(["alpha_table", "beta_table"]);
  });

  it("expands FOR LOOP ARRAY dynamic CREATE TRIGGER", () => {
    const result = migrationParser.runPipeline(
      `
      DO $$
      BEGIN
        FOR t IN ARRAY['gamma_table']
        LOOP
          EXECUTE format(
            'CREATE TRIGGER trg_%s_set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()',
            t, t
          );
        END LOOP;
      END $$;
      `,
      "for_mig",
    );
    expect(
      result.operations.some(
        (operation) =>
          operation.kind === "CreateTrigger" &&
          operation.name === "trg_gamma_table_set_updated_at",
      ),
    ).toBe(true);
  });

  it("parses DO $$ blocks containing static DDL", () => {
    const result = migrationParser.runPipeline(
      `
      DO $$
      BEGIN
        ALTER TABLE public.permissions ADD COLUMN IF NOT EXISTS module text;
      END $$;
      `,
      "do_static",
    );
    expect(
      result.operations.some(
        (operation) =>
          operation.kind === "AddColumn" &&
          operation.table === "permissions" &&
          operation.name === "module" &&
          operation.metadata.ifNotExists === true,
      ),
    ).toBe(true);
  });

  it("parses dynamic GRANT identically to static GRANT", () => {
    const staticSql = `
      GRANT SELECT, INSERT ON public.roles TO authenticated;
      GRANT ALL ON public.roles TO service_role;
    `;
    const dynamicSql = `
      DO $$
      BEGIN
        FOREACH t IN ARRAY ARRAY['roles']
        LOOP
          EXECUTE format('GRANT SELECT, INSERT ON public.%I TO authenticated', t);
          EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
        END LOOP;
      END $$;
    `;
    const check = migrationParser.assertStaticDynamicEquivalence(staticSql, dynamicSql);
    expect(check.ok).toBe(true);
    expect(check.staticFingerprints).toEqual(check.dynamicFingerprints);
  });

  it("parses dynamic CREATE POLICY identically to static CREATE POLICY", () => {
    const staticSql = `
      CREATE POLICY roles_select ON public.roles FOR SELECT TO authenticated USING (true);
      CREATE POLICY roles_write ON public.roles FOR ALL TO authenticated USING (true);
    `;
    const dynamicSql = `
      DO $$
      BEGIN
        FOREACH t IN ARRAY ARRAY['roles']
        LOOP
          EXECUTE format('CREATE POLICY %I_select ON public.%I FOR SELECT TO authenticated USING (true)', t, t);
          EXECUTE format('CREATE POLICY %I_write ON public.%I FOR ALL TO authenticated USING (true)', t, t);
        END LOOP;
      END $$;
    `;
    const check = migrationParser.assertStaticDynamicEquivalence(staticSql, dynamicSql);
    expect(check.ok).toBe(true);
  });

  it("produces identical fingerprints for static vs EXECUTE format RLS", () => {
    const staticSql = `ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;`;
    const dynamicSql = `
      DO $$ BEGIN
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', 'memberships');
      END $$;
    `;
    const check = migrationParser.assertStaticDynamicEquivalence(staticSql, dynamicSql);
    expect(check.ok).toBe(true);
    expect(check.staticFingerprints[0]).toContain("EnableRLS");
  });

  it("covers EXECUTE literal string form", () => {
    const result = migrationParser.runPipeline(
      `
      DO $$ BEGIN
        EXECUTE 'ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY';
      END $$;
      `,
      "exec_lit",
    );
    expect(
      result.operations.some(
        (operation) =>
          operation.kind === "EnableRLS" && operation.table === "workspaces",
      ),
    ).toBe(true);
  });

  it("canonical fingerprints ignore source location noise", () => {
    const a = migrationParser.normalizeStatement(
      "ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY",
      "a",
    );
    const b = migrationParser.runPipeline(
      `DO $$ BEGIN EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', 'organizations'); END $$`,
      "b",
    ).operations.filter((operation) => operation.kind === "EnableRLS");
    expect(canonicalOperationFingerprint(a)).toEqual(canonicalOperationFingerprint(b));
  });
});
