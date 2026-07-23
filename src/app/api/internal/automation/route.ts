import { NextResponse } from 'next/server';
import {
  authenticateAutomationRequest,
  parseAutomationBatchSize,
  processAutomationBatch,
} from '@/lib/automation-processor';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const secret = process.env.AUTOMATION_INTERNAL_SECRET;
  if (!secret) {
    console.error('AUTOMATION_INTERNAL_SECRET is not configured.');
    return NextResponse.json({ error: 'Automation recovery is not configured.' }, { status: 503 });
  }

  if (!authenticateAutomationRequest(request.headers.get('authorization'), secret)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  let body: { batchSize?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    // An empty request uses the safe default batch.
  }

  const configuredBatch = Number.parseInt(process.env.AUTOMATION_BATCH_SIZE ?? '10', 10);
  const batch = parseAutomationBatchSize(body.batchSize ?? configuredBatch);
  if (!batch.valid) return NextResponse.json({ error: batch.error }, { status: 400 });

  try {
    const result = await processAutomationBatch(batch.value);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error('Automation recovery failed.', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Automation recovery failed.' }, { status: 500 });
  }
}
