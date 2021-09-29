// @ts-ignore
/* eslint-disable */

import { Protocol } from 'puppeteer-core';

declare namespace AppBase {
  type ResponseParam<T> = {
    success: boolean;
    code: number;
    message?: string;
    content?: T;
    page: PageParams;
  };

  type PageParams = {
    current: number; //    当前页号，从1开始
    pageSize: number; //    分页大小
    totalElements: number; //    元素数量
    totalPages: number; //    页面数量
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}
