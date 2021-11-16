import type { Context, RequestOptionsInit, ResponseError } from 'umi-request';
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

export async function demo1Middleware(ctx: Context, next: () => void) {
  console.log('request1');
  await next();
  console.log('response1');
}

export async function demo2Middleware(ctx: Context, next: () => void) {
  console.log('request2');
  await next();
  console.log('response2');
}

export function responseInterceptors(response: Response, options: RequestOptionsInit) {
  console.info('responseInterceptors', response, options);
  return response;
}

export const errorHandler = async (error: ResponseError) => {
  const { response } = error;
  if (response && !response.ok) {
    const { status, url } = response;
    console.error(`请求错误 ${status}: ${url}`);
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw await waitResponse(response);
  }

  if (!response) {
    console.error(`请求错误`);
  }
  throw error;
};

async function waitResponse(response: Response) {
  let result = null;
  await response
    .clone()
    .json()
    .then((responseData) => {
      result = responseData;
    })
    .catch((error) => {
      throw error;
    });
  return result;
}
