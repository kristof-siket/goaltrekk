// GoalTrekk app server.
//
// Serves the compiled frontend (index.html and the webpack bundle) and the
// goals REST API the frontend calls, on the port the service reserves. The
// goals live in the service's Postgres database, reached through the
// binding the service declaration declares (service.load()); the API keeps
// the wire shape the frontend was built against.
//
// Everything arrives through the service declaration (./service.mjs); the
// port comes from service.port(), never from the environment.
import service from "./service.mjs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// The app root: the directory holding the files the server serves
// (index.html, the webpack bundle). It sits above the server file — in the
// build output the two are siblings, in the repository one level further up
// — so walk up until index.html appears.
function findAppRoot(startDir) {
  let dir = path.resolve(startDir);
  for (let i = 0; i < 5; i += 1) {
    if (fs.existsSync(path.join(dir, "index.html"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return path.resolve(startDir);
}

const rootDir = findAppRoot(fileURLToPath(new URL(".", import.meta.url)));

// The database client, built once from the service's database binding.
const { db } = service.load();
const goals = () => db.client.orm.public.Goal;

// --- Wire shape (what the frontend sends and reads) ---

function asDate(value) {
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return null;
}

function asDateOrNow(value) {
  return asDate(value) ?? new Date();
}

function asIso(value) {
  const date = asDate(value);
  return date === null ? String(value) : date.toJSON();
}

function actionItemsFromWire(items) {
  if (!Array.isArray(items)) return [];
  return items
    .filter(item => item && typeof item === "object")
    .map(item => ({
      actionDate: asDateOrNow(item.action_date),
      actionSummary: String(item.action_summary ?? "")
    }));
}

function actionItemsToWire(items) {
  return (Array.isArray(items) ? items : []).map(item => ({
    action_date: asIso(item && item.actionDate),
    action_summary: String((item && item.actionSummary) ?? "")
  }));
}

function closedFromWire(value) {
  return value === true || value === "true";
}

function toWire(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    date: asIso(row.date),
    deadline: asIso(row.deadline),
    category: row.category,
    action_items: actionItemsToWire(row.actionItems),
    closed: String(row.closed === true),
    conclusion: row.conclusion
  };
}

function goalFieldsFromWire(body) {
  const date = asDateOrNow(body.date);
  return {
    title: String(body.title ?? ""),
    description: String(body.description ?? ""),
    date,
    deadline: asDate(body.deadline) ?? date,
    category: String(body.category ?? "General"),
    actionItems: actionItemsFromWire(body.action_items),
    closed: closedFromWire(body.closed),
    conclusion: String(body.conclusion ?? "")
  };
}

// --- Goals API (the shape the json-server mock served) ---

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}

async function readBody(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

async function handleGoals(request, pathname) {
  if (pathname === "/goals" || pathname === "/goals/") {
    if (request.method === "GET") {
      const rows = await goals().orderBy(goal => goal.id.asc()).all();
      return json(rows.map(toWire));
    }
    if (request.method === "POST") {
      const body = await readBody(request);
      if (body === null || typeof body !== "object" || Array.isArray(body)) {
        return json({}, 400);
      }
      const created = await goals().create(goalFieldsFromWire(body));
      return json(toWire(created), 201);
    }
    return json({}, 405);
  }

  const id = Number(pathname.slice("/goals/".length));
  if (!Number.isInteger(id)) return json({}, 404);

  if (request.method === "GET") {
    const row = await goals().first({ id });
    return row === null ? json({}, 404) : json(toWire(row));
  }

  if (request.method === "PUT") {
    const body = await readBody(request);
    if (body === null || typeof body !== "object" || Array.isArray(body)) {
      return json({}, 400);
    }
    const updated = await goals().where({ id }).update(goalFieldsFromWire(body));
    const row = Array.isArray(updated) ? updated[0] : updated;
    return row === null || row === undefined ? json({}, 404) : json(toWire(row));
  }

  if (request.method === "DELETE") {
    const row = await goals().first({ id });
    if (row === null) return json({}, 404);
    await goals().where({ id }).delete();
    return json({});
  }

  return json({}, 405);
}

// --- Frontend ---

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function serveFile(relativePath) {
  const filePath = path.resolve(rootDir, relativePath);
  if (!filePath.startsWith(rootDir)) return new Response("Not found", { status: 404 });
  try {
    const data = fs.readFileSync(filePath);
    const type = contentTypes[path.extname(filePath).toLowerCase()];
    return new Response(data, {
      headers: { "Content-Type": type ?? "application/octet-stream" }
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

async function handle(request) {
  const { pathname } = new URL(request.url);

  if (pathname === "/goals" || pathname.startsWith("/goals/")) {
    return handleGoals(request, pathname);
  }

  if (request.method === "GET" || request.method === "HEAD") {
    if (pathname === "/" || pathname === "/index.html") return serveFile("index.html");
    if (pathname.startsWith("/build/")) return serveFile(pathname.slice(1));
  }

  return new Response("Not found", { status: 404 });
}

const port = service.port();

Bun.serve({
  port,
  hostname: "0.0.0.0",
  fetch: request => handle(request)
});

console.log(`goaltrekk: serving on port ${port}`);
