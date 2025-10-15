const collectRequestBody = async (req) => {
  if (req.body) {
    if (typeof req.body === 'string') {
      return req.body;
    }
    try {
      return JSON.stringify(req.body);
    } catch (error) {
      console.warn('Failed to stringify request body', error);
    }
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  if (!chunks.length) {
    return '';
  }

  return Buffer.concat(chunks).toString('utf8');
};

const parseJson = (input) => {
  if (!input) return {};
  try {
    return JSON.parse(input);
  } catch (error) {
    console.warn('Failed to parse JSON body', error);
    return {};
  }
};

const isJson = (value) => typeof value === 'object' && value !== null;

const readUpstreamResponse = async (response) => {
  const text = await response.text();
  if (!text) {
    return { body: null, isJson: false };
  }

  try {
    return { body: JSON.parse(text), isJson: true };
  } catch {
    return { body: text, isJson: false };
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('allow', 'POST');
    res.status(405).json({ detail: 'Method not allowed' });
    return;
  }

  try {
    const rawBody = await collectRequestBody(req);
    const payload = parseJson(rawBody);
    const { role, username, password } = payload;

    if (!role || !username || !password) {
      res.status(400).json({ detail: 'Missing login credentials.' });
      return;
    }

    const backendBaseUrl = process.env.BACKEND_BASE_URL || 'https://www.osusideas.online';
    const targetUrl = new URL('/ar/auth/api/sessions/login/', backendBaseUrl).toString();

    const formBody = new URLSearchParams();
    formBody.set('role', role);
    formBody.set('username', username);
    formBody.set('password', password);

    const upstreamResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: formBody.toString(),
    });

    const { body, isJson: bodyIsJson } = await readUpstreamResponse(upstreamResponse);
    const upstreamContentType = upstreamResponse.headers.get('content-type');

    if (!upstreamResponse.ok) {
      if (upstreamContentType) {
        res.setHeader('content-type', upstreamContentType);
      }
      res.status(upstreamResponse.status).send(body ?? '');
      return;
    }

    res.setHeader('cache-control', 'no-store');

    if (bodyIsJson || isJson(body)) {
      res.status(200).json(body ?? {});
      return;
    }

    if (upstreamContentType) {
      res.setHeader('content-type', upstreamContentType);
    } else {
      res.setHeader('content-type', 'text/plain; charset=utf-8');
    }

    res.status(200).send(body ?? '');
  } catch (error) {
    console.error('Login proxy failed', error);
    res.status(500).json({ detail: 'Login proxy failed.', message: error.message });
  }
}
