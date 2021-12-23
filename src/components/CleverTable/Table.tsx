import React from "react";
import type {AppBase} from "@/components/CleverFramework/typings";
import type {ProTableProps} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type {SortOrder} from "antd/lib/table/interface";

export type CleverTableProps<T, ValueType = 'text'> = {

  params?: AppBase.RequestParam;

  /** @name 渲染 table */
  tableRender?: (
    props: ProTableProps<T, AppBase.RequestParam, ValueType>,
    defaultDom: JSX.Element,
    /** 各个区域的 dom */
    domList: {
      toolbar: JSX.Element | undefined;
      alert: JSX.Element | undefined;
      table: JSX.Element | undefined;
    },
  ) => React.ReactNode;

  tableExtraRender?: (props: ProTableProps<T, AppBase.RequestParam, ValueType>, dataSource: T[]) => React.ReactNode;

  /** @name 一个获得 dataSource 的方法 */
  request?: (
    params: AppBase.RequestParam & {
      pageSize?: number;
      current?: number;
    },
    sort: Record<string, SortOrder>,
    filter: Record<string, React.ReactText[] | null>,
  ) => Promise<Partial<AppBase.ResponseResult<T>>>;

  /** @name 格式化搜索表单提交数据 */
  beforeSearchSubmit?: (params: Partial<AppBase.RequestParam>) => any;

  /** @name 提交表单时触发 */
  onSubmit?: (params: AppBase.RequestParam) => void;

} & Omit<ProTableProps<T, AppBase.RequestParam, ValueType>, 'request'>


const ProviderWarp = <DataType extends Record<string, any>, ValueType = 'text'>(props: CleverTableProps<DataType, ValueType>) => {
  return (
    <></>
  );
};

ProviderWarp.Summary = ProTable.Summary;

export default ProviderWarp;

