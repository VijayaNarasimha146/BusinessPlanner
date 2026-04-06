import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(rootDir, "db");
const dataFile = path.resolve(dataDir, "planner-data.json");
const emptyPlannerData = { months: [] };

const ensurePlannerDataFile = async () => {
  await mkdir(dataDir, { recursive: true });

  try {
    await readFile(dataFile, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeFile(dataFile, JSON.stringify(emptyPlannerData, null, 2));
      return;
    }

    throw error;
  }
};

const readPlannerData = async () => {
  await ensurePlannerDataFile();

  try {
    const rawData = await readFile(dataFile, "utf8");
    return JSON.parse(rawData);
  } catch (error) {
    await writeFile(dataFile, JSON.stringify(emptyPlannerData, null, 2));
    return emptyPlannerData;
  }
};

const writePlannerData = async plannerData => {
  await ensurePlannerDataFile();
  await writeFile(dataFile, JSON.stringify(plannerData, null, 2));
};

const readRequestBody = request =>
  new Promise((resolve, reject) => {
    let requestBody = "";

    request.on("data", chunk => {
      requestBody += chunk;
    });

    request.on("end", () => resolve(requestBody));
    request.on("error", reject);
  });

const plannerApiMiddleware = async (request, response, next) => {
  if (!request.url?.startsWith("/api/planner")) {
    next();
    return;
  }

  response.setHeader("Content-Type", "application/json");

  try {
    if (request.method === "GET") {
      const plannerData = await readPlannerData();
      response.statusCode = 200;
      response.end(JSON.stringify(plannerData));
      return;
    }

    if (request.method === "POST") {
      const rawBody = await readRequestBody(request);
      const parsedBody = rawBody ? JSON.parse(rawBody) : emptyPlannerData;
      const plannerData = {
        months: Array.isArray(parsedBody.months) ? parsedBody.months : []
      };

      await writePlannerData(plannerData);
      response.statusCode = 200;
      response.end(JSON.stringify({ ok: true }));
      return;
    }

    response.statusCode = 405;
    response.end(JSON.stringify({ error: "Method not allowed" }));
  } catch (error) {
    response.statusCode = 500;
    response.end(
      JSON.stringify({
        error: "Planner persistence failed",
        details: error.message
      })
    );
  }
};

const plannerDbPlugin = () => ({
  name: "planner-db-plugin",
  configureServer(server) {
    server.middlewares.use(plannerApiMiddleware);
  },
  configurePreviewServer(server) {
    server.middlewares.use(plannerApiMiddleware);
  }
});

export default defineConfig({
  plugins: [react(), plannerDbPlugin()],
  server: {
    port: 3000
  }
});
