// Prisma Compute service declaration for GoalTrekk's app server.
//
// The app is deployed as its source: the build output (dist/, assembled by
// scripts/prepare-dist.mjs) is copied verbatim and its index.ts boots under
// the Compute runtime (Bun). The server imports this declaration to read
// its port and its database binding. Its package imports are left external
// for deploy to stage beside the output.
import { compute } from "@prisma/composer-prisma-cloud";
import { postgres, dataContract } from "@prisma/composer-prisma-cloud/orm";
import nodeBuild from "@prisma/composer/node";
import contractJson from "./prisma/contract.json" with { type: "json" };

const goalsData = dataContract(contractJson);

export default compute({
  name: "web",
  deps: { db: postgres(goalsData) },
  build: nodeBuild({
    module: import.meta.url,
    dir: "../dist",
    entry: "./index.ts",
    dependencies: "external",
  }),
});
