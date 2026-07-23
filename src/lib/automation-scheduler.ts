const AUTOMATION_ENDPOINT =
  'https://www.wereact.agency/api/internal/automation';

type SchedulerEnv = {
  AUTOMATION_INTERNAL_SECRET?: string;
};

type FetchHandler = (request: Request) => Promise<Response>;

export async function runScheduledAutomation(
  env: SchedulerEnv,
  fetchHandler: FetchHandler,
) {
  const secret = env.AUTOMATION_INTERNAL_SECRET?.trim();
  if (!secret) {
    throw new Error('AUTOMATION_INTERNAL_SECRET is not configured.');
  }

  const response = await fetchHandler(
    new Request(AUTOMATION_ENDPOINT, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${secret}`,
        'content-type': 'application/json',
      },
    }),
  );

  if (!response.ok) {
    throw new Error(
      `Scheduled automation processor returned ${response.status}.`,
    );
  }
}