import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig, RequestConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';

import { userInfo } from './services/clever-framework/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import type { CleverFramework } from '@/services/clever-framework/typings';
import { requestInterceptors } from '@/request';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

export const request: RequestConfig = {
  timeout: 1000,
  requestInterceptors: [requestInterceptors],
};

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  userInfo?: CleverFramework.UserInfo;
  fetchUserInfo?: () => Promise<CleverFramework.UserInfo | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const userInfoResponse = await userInfo();
      return userInfoResponse.content;
    } catch (error) {
      console.error(error);
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    return {
      fetchUserInfo,
      userInfo: await fetchUserInfo(),
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    settings: {},
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.userInfo?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.userInfo && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          <Link to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};
