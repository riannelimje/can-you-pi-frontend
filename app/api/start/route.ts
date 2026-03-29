import { proxyToBackend } from '../_lib/backend';

export async function POST(request: Request) {
  return proxyToBackend('/start', request);
}