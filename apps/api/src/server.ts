import { env } from "./config/env.js";
import { createApp } from "./app.js";
import { connectToDatabase, disconnectFromDatabase } from "./db/connect.js";

try {
  await connectToDatabase(env.MONGODB_URI);
} catch (error) {
  console.error("[api] could not reach the database, not starting:");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

const server = createApp().listen(env.PORT, () => {
  console.log(`[api] listening on http://localhost:${env.PORT}`);
});

async function shutdown(signal: NodeJS.Signals): Promise<void> {
  console.log(`[api] ${signal} received, shutting down`);

  const forceExit = setTimeout(() => {
    console.error("[api] shutdown timed out, exiting");
    process.exit(1);
  }, 10_000);
  forceExit.unref();

  try {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
      server.closeIdleConnections();
    });

    await disconnectFromDatabase();
    process.exit(0);
  } catch (error) {
    console.error("[api] error during shutdown:", error);
    process.exit(1);
  }
}

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.once(signal, () => void shutdown(signal));
}
