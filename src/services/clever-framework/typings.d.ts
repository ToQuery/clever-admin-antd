// @ts-ignore
/* eslint-disable */

import { Protocol } from 'puppeteer-core';
import {DataNode} from "rc-tree/lib/interface";

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

  type UserInfo = {
    id?: string;
    username?: string;
    avatar?: string;
    nickname?: string;
    email?: string;
    codes?: string[];
    authorities?: {
      menuName?: string;
      menuCode?: string;
    };
  };

  type UserListItem = {
    id?: string;
    username?: string;
    nickname?: string;
    avatar?: string;
    phone?: string;
    email?: string;
    enabled?: boolean;
    changePasswordDateTime?: string;
  };

  type MenuListItem = {
    id?: string;
    menuName?: string;
    menuCode?: string;
    menuLevel?: number;
    sortNum?: number;
    parentId?: string;
    children?: MenuListItem[];
  };

  type RoleListItem = {
    id?: string;
    roleName?: string;
  };

  type LogType = 'CREATE' | 'MODIFY' | 'DELETE'| 'QUERY';

  type LogListItem = {
    id?: string;
    userId?: string;
    moduleName?: string;
    bizName?: string;
    logType?: LogType;
    rawData?: string;
    targetData?: string;
    sysUser?: UserListItem;
    createDateTime?: string;
  };

}
