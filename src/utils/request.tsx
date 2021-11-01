import type { RequestOptionsInit } from 'umi-request';
import { getTokenWithBear } from '@/utils/cookie';

export function requestInterceptors(url: string, options: RequestOptionsInit) {
  const obj: RequestOptionsInit = options;
  const { headers } = obj;
  if (headers) {
    headers['Authorization'] = getTokenWithBear();
  }

  return {
    url,
    options: { ...options, headers },
  };
}
