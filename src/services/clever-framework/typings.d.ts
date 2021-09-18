// @ts-ignore
/* eslint-disable */

import { Protocol } from 'puppeteer-core';

declare namespace CleverFramework {
  type LoginRequest = {
    username?: string;
    password?: string;
    captchaToken?: string;
    captchaValue?: string;
  };

  type LoginResponse = {
    token?: string;
  };

  type CaptchaResponse = {
    captchaToken?: string;
    captchaImage?: string;
  };

  import integer = Protocol.integer;
  type UserInfo = {
    id?: string;
    username?: string;
    avatar?: string;
    nickname?: string;
    email?: string;
    codes?: any;
    authorities?: {
      menuName?: string;
      menuCode?: string;
    };
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
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
