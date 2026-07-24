import type { ChatStreamEvent } from './sales-agent';

function isChatStreamEvent(value: unknown): value is ChatStreamEvent {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const event = value as Record<string, unknown>;

  if (event.type === 'text') return typeof event.text === 'string';
  if (event.type === 'start' || event.type === 'done') return true;
  if (event.type === 'error') return typeof event.message === 'string';
  return false;
}

export async function consumeNdjsonChatStream(
  stream: ReadableStream<Uint8Array>,
  onEvent: (event: ChatStreamEvent) => void,
) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  const consumeLine = (line: string) => {
    if (!line.trim()) return;
    try {
      const event: unknown = JSON.parse(line);
      if (isChatStreamEvent(event)) onEvent(event);
    } catch {
      // A broken provider frame must not discard valid frames that follow it.
    }
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? '';
      for (const line of lines) consumeLine(line);
    }

    buffer += decoder.decode();
    consumeLine(buffer);
  } finally {
    reader.releaseLock();
  }
}