import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm } from 'antd';
import React, { useState, useRef, createRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import DictCreateForm from '@/pages/System/dict/DictCreateForm';
import DictUpdateForm from '@/pages/System/dict/DictUpdateForm';
import type { ProFormColumnsType } from '@ant-design/pro-form';
import type { CleverFramework } from '@/components/CleverFramework/system-typings';
import { systemDict, systemDictDelete } from '@/components/CleverFramework/system-api';
import type { AppBase } from '@/components/CleverFramework/app-typings';

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: CleverFramework.DictListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await systemDictDelete(selectedRows.map((row) => row.id));
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const TableList: React.FC = () => {
  const [, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [, setCurrentRow] = useState<CleverFramework.DictListItem>();

  const createDictFormRef = createRef<HTMLFormElement>(); // 初始化ref

  const updateDictFormRef = createRef<HTMLFormElement>(); // 初始化ref

  const [selectedRowsState, setSelectedRows] = useState<CleverFramework.DictListItem[]>([]);

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

  const columns: ProColumns<CleverFramework.DictListItem>[] &
    ProFormColumnsType<CleverFramework.DictListItem>[] = [
    {
      title: <FormattedMessage id="pages.system.dictTable.id" defaultMessage="Id" />,
      hideInSearch: true,
      dataIndex: 'id',
      tip: 'The id is the unique key',
      valueType: 'textarea',
      width: 200,
    },
    {
      title: <FormattedMessage id="pages.system.dictTable.dictName" defaultMessage="字典名称" />,
      dataIndex: 'dictName',
      valueType: 'textarea',
      width: 250,
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: <FormattedMessage id="pages.system.dictTable.dictCode" defaultMessage="字段Code" />,
      dataIndex: 'dictCode',
      valueType: 'textarea',
      width: 200,
    },
    {
      title: <FormattedMessage id="pages.system.dictTable.dictDesc" defaultMessage="描述" />,
      dataIndex: 'dictDesc',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.system.dictTable.sortNum" defaultMessage="序号" />,
      tip: '序号越大越靠前',
      dataIndex: 'sortNum',
      valueType: 'textarea',
      hideInSearch: true,
      width: 120,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      width: 200,
      render: (_, record) => [
        <a
          key="update"
          onClick={() => {
            updateDictFormRef.current?.onUpdate(record.id);
          }}
        >
          修改
        </a>,
        <Popconfirm
          key="delete"
          title="确定删除该字典?"
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
      <ProTable<CleverFramework.DictListItem, AppBase.PageParams & CleverFramework.DictListItem>
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
              createDictFormRef.current?.onShow();
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={async (params) => {
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          const responseParam = await systemDict(params);
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
      <DictCreateForm
        ref={createDictFormRef}
        onFinish={() => onFinish()}
        onCancel={() => onCancel()}
      />
      <DictUpdateForm
        ref={updateDictFormRef}
        onFinish={() => onFinish()}
        onCancel={() => onCancel()}
      />
    </PageContainer>
  );
};

export default TableList;
