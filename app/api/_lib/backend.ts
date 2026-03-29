const DEFAULT_BACKEND_API_URL = 'https://can-you-pi-1041928881529.us-central1.run.app/api';

const BACKEND_API_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  DEFAULT_BACKEND_API_URL;

const API_BEARER_TOKEN =
  process.env.API_BEARER_TOKEN ||
  process.env.NEXT_PUBLIC_API_BEARER_TOKEN ||
  '';

export async function proxyToBackend(path: string, request: Request) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${BACKEND_API_URL}${normalizedPath}`;
  const body = await request.text();
  const cookieHeader = request.headers.get('cookie');

  const requestHeaders: HeadersInit = {
    ...(body ? { 'Content-Type': 'application/json' } : {}),
  };

  if (cookieHeader) {
    requestHeaders.Cookie = cookieHeader;
  }

  if (API_BEARER_TOKEN) {
    requestHeaders.Authorization = `Bearer ${API_BEARER_TOKEN}`;
  }

  const response = await fetch(url, {
    method: request.method,
    headers: requestHeaders,
    body: body || undefined,
    cache: 'no-store',
  });

  const responseBody = await response.text();
  const contentType = response.headers.get('content-type') || 'application/json';
  const setCookie = response.headers.get('set-cookie');

  const responseHeaders: HeadersInit = {
    'Content-Type': contentType,
  };

  if (setCookie) {
    responseHeaders['Set-Cookie'] = setCookie;
  }

  return new Response(responseBody, {
    status: response.status,
    headers: responseHeaders,
  });
}