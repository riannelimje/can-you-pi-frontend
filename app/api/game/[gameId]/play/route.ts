import { proxyToBackend } from '../../../_lib/backend';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;
  return proxyToBackend(`/game/${gameId}/play`, request);
}