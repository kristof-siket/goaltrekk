// Prisma Composer module for GoalTrekk.
//
// The entry whose default export the `prisma` CLI loads. Its name decides
// which project on Prisma Cloud the app deploys to. The app is one service
// with one managed Postgres database, migrated by the deploy from the
// committed migrations/ path.
import { module } from "@prisma/composer";
import { postgres, dataContract } from "@prisma/composer-prisma-cloud/orm";
import contractJson from "./src/prisma/contract.json" with { type: "json" };
import service from "./src/service.mjs";

const goalsData = dataContract(contractJson);

export default module("goaltrekk", ({ provision }) => {
  const db = provision(
    postgres({ name: "db", contract: goalsData, config: "./prisma.config.ts" })
  );
  provision(service, { deps: { db } });
});
