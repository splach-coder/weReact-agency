import { runScheduledAutomation } from './src/lib/automation-scheduler';

// The OpenNext worker is generated immediately before Wrangler bundles this file.
// @ts-ignore Generated module is unavailable until the OpenNext build runs.
import handler from './.open-next/worker.js';

type WorkerEnv = {
  AUTOMATION_INTERNAL_SECRET?: string;
};

type WorkerContext = {
  waitUntil(promise: Promise<unknown>): void;
};

const worker = {
  fetch: handler.fetch,

  scheduled(
    _controller: unknown,
    env: WorkerEnv,
    context: WorkerContext,
  ) {
    context.waitUntil(
      runScheduledAutomation(
        env,
        (request) => handler.fetch(request, env, context),
      ),
    );
  },
};

export default worker;

// Keep OpenNext's durable object exports available if caching enables them later.
// @ts-ignore Generated module is unavailable until the OpenNext build runs.
export { DOQueueHandler, DOShardedTagCache } from './.open-next/worker.js';