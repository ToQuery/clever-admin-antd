/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
import type { CleverFramework } from '@/services/clever-framework/typings';

export default function access(initialState: { userInfo?: CleverFramework.UserInfo | undefined }) {
  const { userInfo } = initialState || {};
  console.log(userInfo);
  return {
    canAdmin: true,
    cleverAccess: true,
  };
}
