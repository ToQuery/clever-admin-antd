import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm } from 'antd';
import React, { useState, useRef, createRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import MenuCreateForm from './MenuCreateForm';
import MenuUpdateForm from './MenuUpdateForm';
import { systemMenu, systemMenuDelete } from '@/services/clever-framework/api';
import type { CleverFramework } from '@/services/clever-framework/typings';
import type { AppBase } from '@/services/typings';

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: CleverFramework.MenuListItem[]) => {
  const loadingMessage = message.loading('正在删除');
  if (!selectedRows) return true;
  let success: boolean = false;
  try {
    await systemMenuDelete(selectedRows.map((row) => row.id));
    message.success('删除成功，请稍等!');
    success = true;
  } catch (error) {
    message.error('删除失败，请重试');
  } finally {
    loadingMessage();
  }
  return success;
};

const MenuList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const [selectedRowsState, setSelectedRows] = useState<CleverFramework.MenuListItem[]>([]);

  const createMenuFormRef = createRef<HTMLFormElement>(); // 初始化ref
  const updateMenuFormRef = createRef<HTMLFormElement>(); // 初始化ref

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

  const columns: ProColumns<CleverFramework.MenuListItem>[] = [
    {
      title: <FormattedMessage id="pages.system.menuTable.id" defaultMessage="Id" />,
      hideInSearch: true,
      width: 300,
      dataIndex: 'id',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.system.menuTable.menuName" defaultMessage="menuName" />,
      dataIndex: 'menuName',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.system.menuTable.menuCode" defaultMessage="menuCode" />,
      hideInSearch: true,
      dataIndex: 'menuCode',
      tip: 'The id is the unique key',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.system.menuTable.menuLevel" defaultMessage="menuLevel" />,
      hideInSearch: true,
      dataIndex: 'menuLevel',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.system.menuTable.sortNum" defaultMessage="sortNum" />,
      hideInSearch: true,
      dataIndex: 'sortNum',
      tip: 'The id is the unique key',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.commonTable.option" defaultMessage="Operating" />,
      width: 500,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        const optionButtons: React.ReactNode[] = [
          <a
            key="new-children"
            onClick={() => {
              createMenuFormRef.current?.onShow(record.id);
            }}
          >
            新建子菜单
          </a>,
        ];
        if (record && record.id != '0') {
          const changeButton: React.ReactNode[] = [
            <a
              key="update"
              onClick={() => {
                updateMenuFormRef.current?.onUpdate(record.id);
              }}
            >
              修改
            </a>,
            <Popconfirm
              key="delete"
              title="确定删除该菜单?"
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
          ];
          optionButtons.push(changeButton);
        }

        return optionButtons;
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<CleverFramework.MenuListItem, AppBase.PageParams & CleverFramework.MenuListItem>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        pagination={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              createMenuFormRef.current?.onShow('0');
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={async (params) => {
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          const responseParam = await systemMenu(params);
          return {
            data: responseParam.content,
            success: responseParam.success,
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
      <MenuCreateForm
        ref={createMenuFormRef}
        onFinish={() => onFinish()}
        onCancel={() => onCancel()}
      />
      <MenuUpdateForm
        ref={updateMenuFormRef}
        onFinish={() => onFinish()}
        onCancel={() => onCancel()}
      />
    </PageContainer>
  );
};

export default MenuList;
