import { request } from 'umi';
import type { CleverFramework } from '@/components/CleverCore/system-typings';
import type { AppBase } from '@/components/CleverCore/app-typings';

// 获取验证码
export async function captcha() {
  return request<AppBase.ResponseResult<CleverFramework.CaptchaResponse>>('/api/captcha', {
    method: 'GET',
  });
}

// 获取当前的用户信息
export async function userInfo() {
  return request<AppBase.ResponseResult<CleverFramework.UserInfo>>('/api/user/info', {
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
  return request<AppBase.ResponseResult<CleverFramework.LoginResponse>>('/api/user/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: loginRequest,
  });
}

//
export async function systemUser(params?: AppBase.PageParams & CleverFramework.UserListItem) {
  return request<AppBase.ResponseResult<CleverFramework.UserListItem[]>>('/api/sys/user', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function systemUserAdd(systemUserBody: CleverFramework.UserListItem) {
  return request<AppBase.ResponseResult<CleverFramework.UserListItem>>('/api/sys/user', {
    method: 'POST',
    data: systemUserBody,
  });
}

export async function systemUserDetail(id: string) {
  return request<AppBase.ResponseResult<CleverFramework.UserListItem>>('/api/sys/user/' + id, {
    method: 'GET',
  });
}

//
export async function systemUserUpdate(systemUserBody: CleverFramework.UserListItem) {
  return request<AppBase.ResponseResult<CleverFramework.UserListItem>>('/api/sys/user', {
    method: 'PUT',
    data: systemUserBody,
  });
}

export async function systemUserAuthorize(userAuthorize: CleverFramework.UserAuthorize) {
  return request<AppBase.ResponseResult<CleverFramework.UserListItem>>('/api/sys/user', {
    method: 'PUT',
    data: userAuthorize,
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
  return request<AppBase.ResponseResult<CleverFramework.MenuListItem[]>>('/api/sys/menu/tree', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function systemMenuAdd(systemMenuBody: CleverFramework.MenuListItem) {
  return request<AppBase.ResponseResult<CleverFramework.MenuListItem>>('/api/sys/menu', {
    method: 'POST',
    data: systemMenuBody,
  });
}

export async function systemMenuDetail(id: string) {
  return request<AppBase.ResponseResult<CleverFramework.MenuListItem>>('/api/sys/menu/' + id, {
    method: 'GET',
  });
}

//
export async function systemMenuUpdate(systemMenuBody: CleverFramework.MenuListItem) {
  return request<AppBase.ResponseResult<CleverFramework.MenuListItem>>('/api/sys/menu', {
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
  return request<AppBase.ResponseResult<CleverFramework.RoleListItem[]>>('/api/sys/role', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function systemRoleList() {
  return request<AppBase.ResponseResult<CleverFramework.RoleListItem[]>>('/api/sys/role/list', {
    method: 'GET',
  });
}

export async function systemRoleAdd(systemRoleBody: CleverFramework.RoleListItem) {
  return request<AppBase.ResponseResult<CleverFramework.RoleListItem>>('/api/sys/role', {
    method: 'POST',
    data: systemRoleBody,
  });
}

export async function systemRoleUpdate(systemRoleBody: CleverFramework.RoleListItem) {
  return request<AppBase.ResponseResult<CleverFramework.RoleListItem>>('/api/sys/role', {
    method: 'PUT',
    data: systemRoleBody,
  });
}

export async function systemRoleDetail(id: string) {
  return request<AppBase.ResponseResult<CleverFramework.RoleListItem>>('/api/sys/role/' + id, {
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
export async function systemLog(params?: AppBase.RequestParam & CleverFramework.LogListItem) {
  return request<AppBase.ResponseResult<CleverFramework.LogListItem[]>>('/api/sys/log', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

//
export async function systemDict(params?: AppBase.RequestParam & CleverFramework.DictListItem) {
  return request<AppBase.ResponseResult<CleverFramework.DictListItem[]>>('/api/sys/dict', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function systemDictList() {
  return request<AppBase.ResponseResult<CleverFramework.DictListItem[]>>('/api/sys/dict/list', {
    method: 'GET',
  });
}

export async function systemDictAdd(systemDictBody: CleverFramework.DictListItem) {
  return request<AppBase.ResponseResult<CleverFramework.DictListItem>>('/api/sys/dict', {
    method: 'POST',
    data: systemDictBody,
  });
}

export async function systemDictUpdate(systemDictBody: CleverFramework.DictListItem) {
  return request<AppBase.ResponseResult<CleverFramework.DictListItem>>('/api/sys/dict', {
    method: 'PUT',
    data: systemDictBody,
  });
}

export async function systemDictDetail(id: string) {
  return request<AppBase.ResponseResult<CleverFramework.DictListItem>>('/api/sys/dict/' + id, {
    method: 'GET',
  });
}

export async function systemDictDelete(ids: (string | undefined)[]) {
  return request('/api/sys/dict', {
    method: 'DELETE',
    params: {
      ids: ids,
    },
  });
}

//
export async function systemConfig(params?: AppBase.RequestParam & CleverFramework.ConfigListItem) {
  return request<AppBase.ResponseResult<CleverFramework.ConfigListItem[]>>('/api/sys/config', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function systemConfigList() {
  return request<AppBase.ResponseResult<CleverFramework.ConfigListItem[]>>('/api/sys/config/list', {
    method: 'GET',
  });
}

export async function systemConfigAdd(systemDictBody: CleverFramework.ConfigListItem) {
  return request<AppBase.ResponseResult<CleverFramework.ConfigListItem>>('/api/sys/config', {
    method: 'POST',
    data: systemDictBody,
  });
}

export async function systemConfigUpdate(systemDictBody: CleverFramework.ConfigListItem) {
  return request<AppBase.ResponseResult<CleverFramework.ConfigListItem>>('/api/sys/config', {
    method: 'PUT',
    data: systemDictBody,
  });
}

export async function systemConfigDetail(id: string) {
  return request<AppBase.ResponseResult<CleverFramework.ConfigListItem>>('/api/sys/config/' + id, {
    method: 'GET',
  });
}

export async function systemConfigDelete(ids: (string | undefined)[]) {
  return request('/api/sys/config', {
    method: 'DELETE',
    params: {
      ids: ids,
    },
  });
}
