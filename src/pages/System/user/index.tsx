import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Popconfirm } from 'antd';
import React, { useState, useRef, createRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { systemUser, systemUserDelete } from '@/services/clever-framework/api';
import type { CleverFramework } from '@/services/clever-framework/typings';
import type { AppBase } from '@/services/typings';
import UserCreateForm from '@/pages/System/user/UserCreateForm';
import UserUpdateForm from '@/pages/System/user/UserUpdateForm';
import UserAuthorizeForm from '@/pages/System/user/UserAuthorizeForm';
/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: CleverFramework.UserListItem[]) => {
  const loadingMessage = message.loading('正在删除');
  if (!selectedRows) return true;
  let success: boolean = false;
  try {
    await systemUserDelete(selectedRows.map((row) => row.id));
    message.success('删除成功，请稍等!');
    success = true;
  } catch (error) {
    // message.error('删除失败，请重试');
  } finally {
    loadingMessage();
  }
  return success;
};

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const [currentRow, setCurrentRow] = useState<CleverFramework.UserListItem>();
  const [selectedRowsState, setSelectedRows] = useState<CleverFramework.UserListItem[]>([]);

  const createUserFormRef = createRef<HTMLFormElement>(); // 初始化ref
  const updateUserFormRef = createRef<HTMLFormElement>(); // 初始化ref
  const authorizeUserFormRef = createRef<HTMLFormElement>(); // 初始化ref

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

  const columns: ProColumns<CleverFramework.UserListItem>[] = [
    {
      title: <FormattedMessage id="pages.system.userTable.id" defaultMessage="Id" />,
      hideInSearch: true,
      width: 160,
      dataIndex: 'id',
      tip: 'The id is the unique key',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.system.userTable.username" defaultMessage="username" />,
      dataIndex: 'username',
      valueType: 'textarea',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: <FormattedMessage id="pages.system.userTable.nickname" defaultMessage="昵称" />,
      dataIndex: 'nickname',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.system.userTable.userStatus" defaultMessage="用户状态" />,
      dataIndex: 'userStatus',
      hideInForm: true,
      valueEnum: {
        1: {
          text: (
            <FormattedMessage id="pages.system.userTable.userStatus.enable" defaultMessage="启用" />
          ),
          status: 1,
        },
        0: {
          text: (
            <FormattedMessage
              id="pages.system.userTable.userStatus.disable"
              defaultMessage="禁用"
            />
          ),
          status: 0,
        },
      },
      renderText: (val: boolean) => {
        return val ? `启用` : `已禁用`;
      },
    },
    {
      title: <FormattedMessage id="pages.system.userTable.phone" defaultMessage="手机号" />,
      dataIndex: 'phone',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.system.userTable.email" defaultMessage="邮箱" />,
      dataIndex: 'email',
      valueType: 'textarea',
    },
    {
      title: (
        <FormattedMessage
          id="pages.system.userTable.changePasswordDateTime"
          defaultMessage="Last scheduled time"
        />
      ),
      dataIndex: 'changePasswordDateTime',
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');
        if (`${status}` === '0') {
          return false;
        }
        if (`${status}` === '3') {
          return (
            <Input
              {...rest}
              placeholder={intl.formatMessage({
                id: 'pages.searchTable.exception',
                defaultMessage: 'Please enter the reason for the exception!',
              })}
            />
          );
        }
        return defaultRender(item);
      },
    },
    {
      title: <FormattedMessage id="pages.commonTable.option" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="update"
          onClick={() => {
            setCurrentRow(record);
            updateUserFormRef.current?.onUpdate(record.id);
          }}
        >
          修改
        </a>,
        <a
          key="authorize"
          onClick={() => {
            setCurrentRow(record);
            authorizeUserFormRef.current?.onAuthorize(record);
          }}
        >
          <a href="#">授权</a>
        </a>,
        <Popconfirm
          key="delete"
          title="确定删除该用户?"
          onConfirm={async () => {
            const success = await handleRemove(new Array(record));
            if (success) {
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }
          }}
          okText="确定"
          cancelText="取消"
        >
          <a href="#">删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<CleverFramework.UserListItem, AppBase.PageParams & CleverFramework.UserListItem>
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
              createUserFormRef.current?.onShow();
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={async (params) => {
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          const responseParam = await systemUser(params);
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
      <UserCreateForm
        ref={createUserFormRef}
        onFinish={() => onFinish()}
        onCancel={() => onCancel()}
      />
      <UserUpdateForm
        ref={updateUserFormRef}
        onFinish={() => onFinish()}
        onCancel={() => onCancel()}
      />
      <UserAuthorizeForm
        ref={authorizeUserFormRef}
        user={currentRow}
        onFinish={() => onFinish()}
        onCancel={() => onCancel()}
      />
    </PageContainer>
  );
};

export default TableList;
