import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';

import { accountLogin, accountInfo } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';
import { setToken } from '@/utils/cookie';

export interface JwtToken {
  status?: 'ok' | 'error';
  token?: string;
}

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
    saveLoginToken: Reducer<JwtToken>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const tokenResponse = yield call(accountLogin, payload);
      if (!tokenResponse.success) {
        return;
      }
      yield put({
        type: 'saveLoginToken',
        payload: tokenResponse,
      });

      const userInfo = yield call(accountInfo, payload);
      if (!tokenResponse.success) {
        return;
      }
      yield put({
        type: 'changeLoginStatus',
        payload: userInfo,
      });

      // Login successfully
      if (response.status === 'ok') {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        message.success('🎉 🎉 🎉  登录成功！');
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        history.replace(redirect || '/');
      }
    },

    logout() {
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.content.codes);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    saveLoginToken(state, { payload }) {
      setToken(payload.content.token);
      return {
        ...state,
        status: payload.content,
      };
    },
  },
};

export default Model;
