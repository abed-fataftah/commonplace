import express, { type ErrorRequestHandler } from "express";
import type { Health } from "@commonplace/shared";
import { getDatabaseStatus } from "./db/connect.js";

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
};

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    const database = getDatabaseStatus();
    const body: Health = {
      status: database === "connected" ? "ok" : "degraded",
      uptime: process.uptime(),
      database,
    };

    res.status(body.status === "ok" ? 200 : 503).json(body);
  });

  app.use(errorHandler);

  return app;
}
