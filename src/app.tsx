// import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig, RequestConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import SwitchTabsLayout from '@/layouts/SwitchTabsLayout';
import type { Settings } from '../config/defaultSettings';
import defaultSettings from '../config/defaultSettings';
import { userInfo } from '@/services/clever-framework/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import type { CleverFramework } from '@/services/clever-framework/typings';
import {
  demo1Middleware,
  demo2Middleware,
  errorHandler,
  requestInterceptors,
  responseInterceptors,
} from '@/utils/request';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

export const request: RequestConfig = {
  timeout: 10000,
  errorConfig: {
    adaptor: (resData) => {
      return {
        ...resData,
        success: resData.success,
        errorMessage: resData.message,
      };
    },
  },
  errorHandler,
  middlewares: [demo1Middleware, demo2Middleware],
  requestInterceptors: [requestInterceptors],
  responseInterceptors: [responseInterceptors],
};

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<Settings>;
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
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  const { switchTabs, ...restSettings } = initialState?.settings || {};
  return {
    headerContentRender: () => (
      <div className="header-content">
        <Link to="/">
          <BookOutlined />
          <span>Clever Framework</span>
        </Link>
      </div>
    ),
    rightContentRender: () => (
      <RightContent switchTabsReloadable={switchTabs?.mode && switchTabs.reloadable} />
    ),
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.userInfo?.nickname,
    },
    footerRender: () => <Footer />,
    className: switchTabs?.mode && 'custom-by-switch-tabs',
    childrenRender: (children, props) => {
      const { route } = props;
      return (
        <SwitchTabsLayout
          mode={switchTabs?.mode}
          persistent={switchTabs?.persistent}
          fixed={switchTabs?.fixed}
          routes={route!.routes}
        >
          {children}
        </SwitchTabsLayout>
      );
    },
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
    // 增加一个 loading 的状态
    // childrenRender: (children) => {
    //   if (initialState.loading) return <PageLoading />;
    //   return children;
    // },
    ...restSettings,
  };
};
