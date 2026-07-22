import { siteConfig } from '@/config/site';

const PRIVATE_PREFIXES = ['/admin', '/crm', '/api', '/unsubscribe'];

export function createIndexNowPayload(urls: readonly string[], key: string) {
  const canonical = new URL(siteConfig.url);
  const urlList = [...new Set(urls)].filter((value) => {
    const url = new URL(value);
    return (
      url.origin === canonical.origin &&
      !PRIVATE_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))
    );
  });

  return {
    host: canonical.host,
    key,
    keyLocation: `${canonical.origin}/${key}.txt`,
    urlList,
  };
}

export function isAcceptedIndexNowStatus(status: number) {
  return status === 200 || status === 202;
}