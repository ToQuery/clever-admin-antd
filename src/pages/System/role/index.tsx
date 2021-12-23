import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useState, useRef, createRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import RoleCreateForm from './RoleCreateForm';
import RoleUpdateForm from './RoleUpdateForm';
import type { CleverFramework } from '@/components/CleverCore/system-typings';
import { systemRole, systemRoleDelete } from '@/components/CleverCore/system-api';
import type { AppBase } from '@/components/CleverCore/app-typings';

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: CleverFramework.RoleListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await systemRoleDelete(selectedRows.map((row) => row.id));
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const RoleList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const [, setCurrentRow] = useState<CleverFramework.RoleListItem>();

  const [selectedRowsState, setSelectedRows] = useState<CleverFramework.RoleListItem[]>([]);

  const createRoleFormRef = createRef<HTMLFormElement>(); // 初始化ref

  const updateRoleFormRef = createRef<HTMLFormElement>(); // 初始化ref

  const onFinish = () => {
    setSelectedRows([]);
    actionRef.current?.reloadAndRest?.();
  };

  const onCancel = () => {};

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<CleverFramework.RoleListItem>[] = [
    {
      title: <FormattedMessage id="pages.system.roleTable.id" defaultMessage="Id" />,
      hideInSearch: true,
      width: 300,
      dataIndex: 'id',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.system.roleTable.roleName" defaultMessage="角色名称" />,
      dataIndex: 'roleName',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.commonTable.createDateTime" defaultMessage="创建时间" />,
      dataIndex: 'createDateTime',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      width: 500,
      render: (_, record) => [
        <a
          key="update"
          onClick={() => {
            setCurrentRow(record);
            updateRoleFormRef.current?.onUpdate(record.id);
          }}
        >
          <FormattedMessage id="pages.commonTable.update" defaultMessage="修改" />
        </a>,
        <a key="delete">
          <FormattedMessage id="pages.commonTable.delete" defaultMessage="删除" />
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<CleverFramework.RoleListItem, AppBase.PageParams>
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
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              createRoleFormRef.current?.onShow();
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={async (params) => {
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          const responseParam = await systemRole(params);
          return {
            data: responseParam.content,
            success: responseParam.success,
            total: responseParam.page.totalElements,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
        </FooterToolbar>
      )}
      <RoleCreateForm
        ref={createRoleFormRef}
        onFinish={() => onFinish()}
        onCancel={() => onCancel()}
      />
      <RoleUpdateForm
        ref={updateRoleFormRef}
        onFinish={() => onFinish()}
        onCancel={() => onCancel()}
      />
    </PageContainer>
  );
};

export default RoleList;
