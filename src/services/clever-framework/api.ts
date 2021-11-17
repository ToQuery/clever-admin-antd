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
  return request<Record<string, any>>('/api/user/logout', {
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

//
export async function systemUser(params?: AppBase.PageParams & CleverFramework.UserListItem) {
  return request<AppBase.ResponseParam<CleverFramework.UserListItem[]>>('/api/sys/user', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function systemUserAdd(systemUserBody: CleverFramework.UserListItem) {
  return request<AppBase.ResponseParam<CleverFramework.UserListItem>>('/api/sys/user', {
    method: 'POST',
    data: systemUserBody,
  });
}

export async function systemUserDetail(id: string) {
  return request<AppBase.ResponseParam<CleverFramework.UserListItem>>('/api/sys/user/' + id, {
    method: 'GET',
  });
}

//
export async function systemUserUpdate(systemUserBody: CleverFramework.UserListItem) {
  return request<AppBase.ResponseParam<CleverFramework.UserListItem>>('/api/sys/user', {
    method: 'PUT',
    data: systemUserBody,
  });
}

//
export async function systemUserDelete(ids: (string | undefined)[]) {
  return request('/api/sys/user', {
    method: 'DELETE',
    params: {
      ids: ids,
    },
  });
}

//
export async function systemMenu(params?: CleverFramework.MenuListItem) {
  return request<AppBase.ResponseParam<CleverFramework.MenuListItem[]>>('/api/sys/menu/tree', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function systemMenuAdd(systemMenuBody: CleverFramework.MenuListItem) {
  return request<AppBase.ResponseParam<CleverFramework.MenuListItem>>('/api/sys/menu', {
    method: 'POST',
    data: systemMenuBody,
  });
}

export async function systemMenuDetail(id: string) {
  return request<AppBase.ResponseParam<CleverFramework.MenuListItem>>('/api/sys/menu/' + id, {
    method: 'GET',
  });
}

//
export async function systemMenuUpdate(systemMenuBody: CleverFramework.MenuListItem) {
  return request<AppBase.ResponseParam<CleverFramework.MenuListItem>>('/api/sys/menu', {
    method: 'PUT',
    data: systemMenuBody,
  });
}

//
export async function systemMenuDelete(ids: (string | undefined)[]) {
  return request('/api/sys/menu', {
    method: 'DELETE',
    params: {
      ids: ids,
    },
  });
}

//
export async function systemRole(params?: AppBase.PageParams & CleverFramework.RoleListItem) {
  return request<AppBase.ResponseParam<CleverFramework.RoleListItem[]>>('/api/sys/role', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function systemRoleList() {
  return request<AppBase.ResponseParam<CleverFramework.RoleListItem[]>>('/api/sys/role/list', {
    method: 'GET',
  });
}

export async function systemRoleAdd(systemRoleBody: CleverFramework.RoleListItem) {
  return request<AppBase.ResponseParam<CleverFramework.RoleListItem>>('/api/sys/role', {
    method: 'POST',
    data: systemRoleBody,
  });
}

export async function systemRoleUpdate(systemRoleBody: CleverFramework.RoleListItem) {
  return request<AppBase.ResponseParam<CleverFramework.RoleListItem>>('/api/sys/role', {
    method: 'PUT',
    data: systemRoleBody,
  });
}

export async function systemRoleDetail(id: string) {
  return request<AppBase.ResponseParam<CleverFramework.RoleListItem>>('/api/sys/role/' + id, {
    method: 'GET',
  });
}


export async function systemRoleDelete(ids: (string | undefined)[]) {
  return request('/api/sys/role', {
    method: 'DELETE',
    params: {
      ids: ids,
    },
  });
}

//
export async function systemLog(params?: AppBase.PageParams & CleverFramework.LogListItem) {
  return request<AppBase.ResponseParam<CleverFramework.LogListItem[]>>('/api/sys/log', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
