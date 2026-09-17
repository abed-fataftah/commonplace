import { useEffect, useState } from "react";
import { APP_NAME, type Health } from "@commonplace/shared";

export function App() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then(setHealth)
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <main>
      <h1>{APP_NAME}</h1>
      {error && <p>API error: {error}</p>}
      {health && (
        <p>
          API status: {health.status} (uptime {health.uptime.toFixed(1)}s)
        </p>
      )}
      {!health && !error && <p>Checking API…</p>}
    </main>
  );
}
