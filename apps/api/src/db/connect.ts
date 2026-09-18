import mongoose from "mongoose";
import type { DatabaseStatus } from "@commonplace/shared";

const connectOptions = {
  // How long any operation retries before failing, including the initial connect.
  // The driver default is 30s, which turns an unreachable database into 30s of
  // hanging requests. 10s still rides out a typical Atlas failover election.
  serverSelectionTimeoutMS: 10_000,
  // One small service does not need 100 sockets, and Atlas counts them per cluster.
  maxPoolSize: 10,
} satisfies mongoose.ConnectOptions;

// Mongoose's default connection is process-wide, so these listeners are registered
// once on import rather than per call.
mongoose.connection.on("error", (error) => {
  console.error("[db] connection error:", error);
});

mongoose.connection.on("disconnected", () => {
  console.warn("[db] disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.info("[db] reconnected");
});

const readyStateLabels: Record<number, DatabaseStatus> = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
  99: "uninitialized",
};

export function getDatabaseStatus(): DatabaseStatus {
  return readyStateLabels[mongoose.connection.readyState] ?? "uninitialized";
}

export async function connectToDatabase(uri: string): Promise<void> {
  await mongoose.connect(uri, connectOptions);
  console.log(`[db] connected to database "${mongoose.connection.name}"`);
}

export async function disconnectFromDatabase(): Promise<void> {
  await mongoose.disconnect();
}
