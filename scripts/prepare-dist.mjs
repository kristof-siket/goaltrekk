// Assembles the deployable build output in dist/.
//
// Only the build output is deployed, so everything the app server needs at
// run time is collected here: the server itself, its service declaration
// (with the emitted contract.json the database client is built from), and
// the frontend page plus webpack bundle.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const [from, to] of [
  ["src/index.ts", "index.ts"],
  ["src/service.mjs", "service.mjs"],
  ["src/prisma/contract.json", "prisma/contract.json"],
  ["index.html", "index.html"],
  ["build/app.bundle.js", "build/app.bundle.js"]
]) {
  const dest = path.join(dist, to);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(path.join(root, from), dest);
}

console.log("Prepared dist/ (server, service declaration, contract, frontend).");
