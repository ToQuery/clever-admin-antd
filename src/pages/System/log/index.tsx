import React, { useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

import { systemLog } from '@/services/clever-framework/api';
import type {CleverFramework} from "@/services/clever-framework/typings";
import {AppBase} from "@/services/typings";


const TableList: React.FC = () => {

  const actionRef = useRef<ActionType>();


  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<CleverFramework.LogListItem>[] = [
    {
      title: <FormattedMessage id="pages.system.logTable.id" defaultMessage="Id" />,
      hideInSearch: true,
      hideInTable: true,
      dataIndex: 'id',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.system.userTable.userId" defaultMessage="userId" />,
      hideInSearch: true,
      hideInTable: true,
      dataIndex: 'userId',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.system.userTable.username" defaultMessage="username" />,
      hideInSearch: true,
      valueType: 'textarea',
      render: (_, record) => [
        <span>{record.sysUser?.username}</span>,
      ],
    },
    {
      title: <FormattedMessage id="pages.system.logTable.moduleName" defaultMessage="moduleName" />,
      dataIndex: 'moduleName',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.system.logTable.bizName" defaultMessage="bizName" />,
      dataIndex: 'bizName',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.system.logTable.logType" defaultMessage="logType" />,
      dataIndex: 'logType',
      hideInForm: true,
      valueEnum: {
        'CREATE': {
          text: (
            <FormattedMessage id="pages.system.logTable.logType.create" defaultMessage="创建" />
          ),
          status: 'CREATE',
        },
        'MODIFY': {
          text: (
            <FormattedMessage id="pages.system.logTable.logType.modify" defaultMessage="修改" />
          ),
          status: 'MODIFY',
        },
        'DELETE': {
          text: (
            <FormattedMessage id="pages.system.logTable.logType.delete" defaultMessage="删除" />
          ),
          status: 'DELETE',
        },
        'QUERY': {
          text: (
            <FormattedMessage id="pages.system.logTable.logType.query" defaultMessage="查看" />
          ),
          status: 'QUERY',
        },
      },
    },
    {
      title: <FormattedMessage id="pages.commonTable.createDateTime" defaultMessage="createDateTime" />,
      dataIndex: 'createDateTime',
      valueType: 'dateTimeRange',
      render: (_, record) => [
        <span>{record?.createDateTime}</span>,
      ],
    },
    {
      title: <FormattedMessage id="pages.system.logTable.rawData" defaultMessage="rawData" />,
      hideInSearch: true,
      hideInTable: true,
      dataIndex: 'rawData',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.system.logTable.targetData" defaultMessage="targetData" />,
      hideInSearch: true,
      hideInTable: true,
      dataIndex: 'targetData',
      valueType: 'textarea',
    },
  ];

  return (
    <PageContainer>
      <ProTable<CleverFramework.LogListItem, AppBase.PageParams & CleverFramework.LogListItem>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
        ]}
        request={async (
          // 第一个参数 params 查询表单和 params 参数的结合
          // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
          params
        ) => {
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          const responseParam = await systemLog(params);
          return {
            data: responseParam.content,
            success: responseParam.success,
            total: responseParam.page.totalElements,
          };
        }}
        columns={columns}
        rowSelection={{}}
      />
    </PageContainer>
  );
};

export default TableList;
