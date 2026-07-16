#!/usr/bin/env npx tsx
import { ensureCiCdBlueprints } from "../src/lib/devops/ci/generators";

const paths = ensureCiCdBlueprints();
for (const path of paths) {
  console.log(`Wrote ${path}`);
}
