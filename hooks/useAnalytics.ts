import { useEffect, useRef, useState } from 'react';

export interface AnalyticsStats {
  activeNow: number;
  visitsToday: number;
  topPages: Array<{ page: string; count: number }>;
}

const HEARTBEAT_INTERVAL_MS = 30_000; // 30 seconds
const STATS_INTERVAL_MS     = 60_000; // refresh stats every 60 seconds

// ─── Session ID ───────────────────────────────────────────────────────────────
// Stored in localStorage with a daily reset so each day = fresh session.
// Uses crypto.randomUUID() where available, falls back to Math.random.
// No personal info collected — purely anonymous.

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback for older environments
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getSessionId(): string {
  if (typeof window === 'undefined') return generateId();

  const KEY = 'proc_it_session';
  const todayUTC = new Date().toISOString().slice(0, 10);

  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const { id, date } = JSON.parse(raw) as { id: string; date: string };
      if (date === todayUTC && id) return id;
    }
  } catch {
    // localStorage unavailable or corrupted — generate fresh each time
  }

  const id = generateId();
  try {
    localStorage.setItem(KEY, JSON.stringify({ id, date: todayUTC }));
  } catch {
    // ignore
  }
  return id;
}

// ─── Current page slug ────────────────────────────────────────────────────────
function getCurrentPage(): string {
  if (typeof window === 'undefined') return '/';
  // Strip query/hash — just the pathname
  return window.location.pathname || '/';
}

// ─── API helpers ──────────────────────────────────────────────────────────────
const BASE = '/.netlify/functions';

async function sendHeartbeat(sessionId: string, page: string): Promise<void> {
  try {
    await fetch(`${BASE}/heartbeat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, page }),
      // Use keepalive so the request completes even if the page closes
      keepalive: true,
    });
  } catch {
    // Silently ignore — analytics failure must never affect the user
  }
}

async function fetchStats(): Promise<AnalyticsStats | null> {
  try {
    const res = await fetch(`${BASE}/stats`);
    if (!res.ok) return null;
    return (await res.json()) as AnalyticsStats;
  } catch {
    return null;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAnalytics(options?: { showStats?: boolean }) {
  const showStats = options?.showStats ?? true;
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const sessionIdRef = useRef<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    sessionIdRef.current = getSessionId();
    const sessionId = sessionIdRef.current;
    const page = getCurrentPage();

    // Initial heartbeat immediately
    sendHeartbeat(sessionId, page);

    // Periodic heartbeat
    const hbTimer = setInterval(() => {
      sendHeartbeat(sessionId, getCurrentPage());
    }, HEARTBEAT_INTERVAL_MS);

    // Fetch stats on load + periodically
    if (showStats) {
      fetchStats().then((s) => s && setStats(s));
      const statsTimer = setInterval(() => {
        fetchStats().then((s) => s && setStats(s));
      }, STATS_INTERVAL_MS);
      return () => {
        clearInterval(hbTimer);
        clearInterval(statsTimer);
      };
    }

    return () => clearInterval(hbTimer);
  }, [showStats]);

  return { stats, sessionId: sessionIdRef.current };
}
