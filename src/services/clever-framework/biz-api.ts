import {request} from 'umi';
import type {Biz} from "@/services/clever-framework/biz-typings";
import type {AppBase} from "@/components/CleverFramework/app-typings";

// 获取验证码
export async function bizNewsPage(params?: Biz.News) {
  return request<AppBase.ResponseResult<Biz.News>>('/admin/biz-news', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
