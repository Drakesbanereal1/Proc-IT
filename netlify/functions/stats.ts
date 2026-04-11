import type { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

interface SessionData {
  firstSeen: number;
  lastSeen: number;
  page: string;
}

const ACTIVE_WINDOW_MS   = 2 * 60 * 1000;   // session active if heartbeat in last 2 min
const CLEANUP_AFTER_MS   = 24 * 60 * 60 * 1000; // prune sessions older than 24h

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

export const handler: Handler = async () => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  };

  const store = getStore('analytics');
  const now = Date.now();
  const today = todayUTC();

  // List all session blobs
  let keys: string[] = [];
  try {
    const { blobs } = await store.list();
    keys = blobs.map((b) => b.key);
  } catch {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ activeNow: 0, visitsToday: 0, topPages: [] }),
    };
  }

  // Fetch all sessions in parallel
  const fetched = await Promise.all(
    keys.map((key) =>
      store
        .get(key, { type: 'json' })
        .then((data) => ({ key, data: data as SessionData | null }))
        .catch(() => ({ key, data: null }))
    )
  );

  const valid = fetched.filter((f) => f.data !== null) as Array<{
    key: string;
    data: SessionData;
  }>;

  // Aggregate stats
  const activeNow = valid.filter((f) => now - f.data.lastSeen < ACTIVE_WINDOW_MS).length;

  const visitsToday = valid.filter(
    (f) => new Date(f.data.firstSeen).toISOString().slice(0, 10) === today
  ).length;

  // Top pages — from all sessions active in last 10 minutes
  const pageMap: Record<string, number> = {};
  valid
    .filter((f) => now - f.data.lastSeen < 10 * 60 * 1000)
    .forEach((f) => {
      const p = f.data.page || '/';
      pageMap[p] = (pageMap[p] ?? 0) + 1;
    });

  const topPages = Object.entries(pageMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([page, count]) => ({ page, count }));

  // Cleanup stale sessions (older than 24h) — fire-and-forget, don't await
  const staleKeys = valid
    .filter((f) => now - f.data.lastSeen > CLEANUP_AFTER_MS)
    .map((f) => f.key);

  if (staleKeys.length > 0) {
    Promise.all(staleKeys.map((key) => store.delete(key))).catch(() => {});
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ activeNow, visitsToday, topPages }),
  };
};
