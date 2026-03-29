import { proxyToBackend } from '../../../_lib/backend';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ quizId: string }> }
) {
  const { quizId } = await params;
  return proxyToBackend(`/quiz/${quizId}/check`, request);
}