export const DATABASE_STATUSES = [
  "connected",
  "connecting",
  "disconnecting",
  "disconnected",
  "uninitialized",
] as const;

export type DatabaseStatus = (typeof DATABASE_STATUSES)[number];

export type Health = {
  status: "ok" | "degraded";
  uptime: number;
  database: DatabaseStatus;
};
