import request from '@/utils/request';

export type LoginParamsType = {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
};

export interface AccountLogin {
  username: string;
  password: string;
}

export async function accountLogin(params: AccountLogin) {
  return request('/api/user/token', {
    method: 'POST',
    data: params,
  });
}

export async function accountInfo() {
  return request('/api/user/info');
}

export async function fakeAccountLogin(params: LoginParamsType) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
