import { describe, expect, it, vi } from "vitest";
import { AuthorizationError, ConflictError } from "@/lib/errors";
import { CompanyRepository } from "@/repositories/company/company-repository";
import type { RepositoryContext } from "@/types/context";

function createContext(): RepositoryContext {
  return {
    userId: "user-1",
    tenant: {
      organization: { organizationId: "org-1", isResolved: true },
      workspace: { workspaceId: "ws-1", isResolved: true },
      company: { companyId: null, isResolved: false },
      permissions: { permissions: [], isResolved: false },
      roles: { roles: [], isResolved: false },
    },
  };
}

function createRepository(
  handlers: Record<string, () => unknown>,
): CompanyRepository {
  const client = {
    from: vi.fn((table: string) => {
      const chain: Record<string, unknown> = {};
      const register = (name: string, value: unknown) => {
        chain[name] = vi.fn(() => {
          if (typeof value === "function") {
            return value();
          }
          return chain;
        });
        return chain;
      };

      register("select", chain);
      register("eq", chain);
      register("is", chain);
      register("order", chain);
      register("insert", chain);
      register("update", chain);
      register("maybeSingle", () => handlers[`${table}.maybeSingle`]?.() ?? { data: null, error: null });
      register("single", () => handlers[`${table}.single`]?.() ?? { data: null, error: null });

      return chain;
    }),
  };

  return new CompanyRepository(client as never, createContext());
}

describe("CompanyRepository", () => {
  it("throws on optimistic lock mismatch", () => {
    const repository = createRepository({});
    expect(() => repository.validateOptimisticLock({ version: 2 }, 1)).toThrow(ConflictError);
  });

  it("validates workspace ownership", async () => {
    const repository = createRepository({
      "companies.maybeSingle": () => ({
        data: {
          id: "company-1",
          workspace_id: "ws-2",
          organization_id: "org-1",
          version: 1,
        },
        error: null,
      }),
    });

    await expect(repository.validateWorkspaceOwnership("company-1", "ws-1")).rejects.toThrow(
      AuthorizationError,
    );
  });

  it("resolves unique slug with suffix when taken", async () => {
    let call = 0;
    const repository = createRepository({
      "companies.maybeSingle": () => {
        call += 1;
        if (call === 1) {
          return {
            data: { id: "existing", slug: "acme", workspace_id: "ws-1" },
            error: null,
          };
        }
        return { data: null, error: null };
      },
    });

    const slug = await repository.resolveUniqueSlug("ws-1", "acme");
    expect(slug).toBe("acme-1");
  });
});
