import express, { type ErrorRequestHandler } from "express";
import type { Health } from "@commonplace/shared";

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
};

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    const body: Health = { status: "ok", uptime: process.uptime() };
    res.json(body);
  });

  app.use(errorHandler);

  return app;
}
