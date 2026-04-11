import type { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

interface SessionData {
  firstSeen: number;
  lastSeen: number;
  page: string;
}

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  let body: { sessionId?: string; page?: string };
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Bad Request' }) };
  }

  const { sessionId, page = '/' } = body;

  // Validate sessionId — must be a non-empty string, max 64 chars, alphanumeric+dash only
  if (
    !sessionId ||
    typeof sessionId !== 'string' ||
    sessionId.length > 64 ||
    !/^[a-zA-Z0-9-]+$/.test(sessionId)
  ) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid sessionId' }) };
  }

  const store = getStore('analytics');

  // Preserve original firstSeen if session already exists
  let firstSeen = Date.now();
  try {
    const existing = await store.get(sessionId, { type: 'json' }) as SessionData | null;
    if (existing?.firstSeen) {
      firstSeen = existing.firstSeen;
    }
  } catch {
    // New session — firstSeen stays as now
  }

  const session: SessionData = {
    firstSeen,
    lastSeen: Date.now(),
    page: String(page).slice(0, 128),
  };

  await store.set(sessionId, JSON.stringify(session));

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ ok: true }),
  };
};
