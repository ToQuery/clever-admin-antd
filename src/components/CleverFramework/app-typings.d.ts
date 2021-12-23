/* eslint-disable */

import { Protocol } from 'puppeteer-core';

declare namespace AppBase {
  type RequestParam = {
    current: number; //    当前页号，从1开始
    pageSize: number; //    分页大小
  };

  type ResponseResult<T> = {
    success: boolean;
    code: number;
    message?: string;
    content: T & Record<string, any>;
    page: PageParams;
  };

  type PageParams = {
    current: number; //    当前页号，从1开始
    pageSize: number; //    分页大小
    totalElements: number; //    元素数量
    totalPages: number; //    页面数量
  };
}
