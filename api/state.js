const TABLE = 'fuel_app_state';
const STATE_ID = 'default';
const MAX_BODY_BYTES = 4 * 1024 * 1024;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}

function env() {
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const appPin = process.env.APP_PIN || '';
  return { supabaseUrl: supabaseUrl.replace(/\/$/, ''), supabaseKey, appPin };
}

function supabaseHeaders(key, extra = {}) {
  const headers = {
    apikey: key,
    ...extra
  };

  if (!key.startsWith('sb_secret_')) {
    headers.Authorization = `Bearer ${key}`;
  }

  return headers;
}

async function readPayload(request) {
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) {
    throw new Error('Request body is too large.');
  }

  const body = text ? JSON.parse(text) : {};
  const payload = body.payload;
  if (!payload || typeof payload !== 'object' || !Array.isArray(payload.purchases)) {
    throw new Error('Invalid app state payload.');
  }
  return payload;
}

async function getState(supabaseUrl, supabaseKey) {
  const endpoint = `${supabaseUrl}/rest/v1/${TABLE}?id=eq.${encodeURIComponent(STATE_ID)}&select=payload,updated_at&limit=1`;
  const response = await fetch(endpoint, {
    headers: supabaseHeaders(supabaseKey)
  });

  const rows = await response.json().catch(() => []);
  if (!response.ok) {
    return json({ configured: true, message: 'Could not read Supabase state.', details: rows }, response.status);
  }

  return json({
    configured: true,
    payload: rows[0]?.payload || { purchases: [], funds: { ugtCash: 0, bankBalance: 0, salesForDeposit: 0, updatedAt: '' } },
    updatedAt: rows[0]?.updated_at || ''
  });
}

async function putState(request, supabaseUrl, supabaseKey) {
  let payload;
  try {
    payload = await readPayload(request);
  } catch (error) {
    return json({ configured: true, message: error.message }, 400);
  }

  const endpoint = `${supabaseUrl}/rest/v1/${TABLE}?on_conflict=id`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: supabaseHeaders(supabaseKey, {
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation'
    }),
    body: JSON.stringify([{
      id: STATE_ID,
      payload,
      updated_at: new Date().toISOString()
    }])
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    return json({ configured: true, message: 'Could not save Supabase state.', details: data }, response.status);
  }

  return json({ configured: true, payload: data?.[0]?.payload || payload, updatedAt: data?.[0]?.updated_at || '' });
}

export default {
  async fetch(request) {
    const { supabaseUrl, supabaseKey, appPin } = env();
    const method = request.method.toUpperCase();

    if (method !== 'GET' && method !== 'PUT') {
      return json({ message: 'Method not allowed.' }, 405);
    }

    if (!supabaseUrl || !supabaseKey) {
      return json({
        configured: false,
        message: 'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY on Vercel.'
      }, 503);
    }

    if (appPin && request.headers.get('x-app-pin') !== appPin) {
      return json({ configured: true, needsPin: true, message: 'Cloud access PIN required.' }, 401);
    }

    if (method === 'GET') {
      return getState(supabaseUrl, supabaseKey);
    }

    return putState(request, supabaseUrl, supabaseKey);
  }
};
