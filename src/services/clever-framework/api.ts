import { request } from 'umi';
import type { CleverFramework } from '@/services/clever-framework/typings';
import type { AppBase } from '@/services/typings';

// 获取验证码
export async function captcha() {
  return request<AppBase.ResponseParam<CleverFramework.CaptchaResponse>>('/api/captcha', {
    method: 'GET',
  });
}

// 获取当前的用户信息
export async function userInfo() {
  return request<AppBase.ResponseParam<CleverFramework.UserInfo>>('/api/user/info', {
    method: 'GET',
  });
}

// 退出登录
export async function logout() {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
  });
}

// 登录
export async function login(loginRequest: CleverFramework.LoginRequest) {
  return request<AppBase.ResponseParam<CleverFramework.LoginResponse>>('/api/user/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: loginRequest,
  });
}
