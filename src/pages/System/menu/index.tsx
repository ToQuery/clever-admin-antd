import { PlusOutlined } from '@ant-design/icons';
import {Form, Button, message, TreeSelect, Popconfirm} from 'antd';
import React, {useState, useRef, createRef} from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { FormValueType } from './UpdateForm';
import MenuUpdateForm from './MenuUpdateForm';
import MenuCreateForm from './MenuCreateForm';
import { systemMenu, systemMenuUpdate, systemMenuDelete } from '@/services/clever-framework/api';
import type {CleverFramework} from "@/services/clever-framework/typings";
import {ProFormInstance} from "@ant-design/pro-form";
import {AppBase} from "@/services/typings";


/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Configuring');
  try {
    await systemMenuUpdate({
      username: fields.username,
      id: fields.id,
    });
    hide();

    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: CleverFramework.MenuListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await systemMenuDelete(selectedRows.map((row) => row.id));
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const MenuList: React.FC = () => {

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<CleverFramework.MenuListItem>();
  const [selectedRowsState, setSelectedRows] = useState<CleverFramework.MenuListItem[]>([]);

  const createFormRef = createRef<CreateForm>(); // 初始化ref

  const updateFormRef = createRef<UpdateForm>(); // 初始化ref
  // const updateFormRef = useRef<UpdateForm>();

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<CleverFramework.MenuListItem>[] = [
    {
      title: (
        <FormattedMessage
          id="pages.system.menuTable.id"
          defaultMessage="Id"
        />
      ),
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
      title: (
        <FormattedMessage
          id="pages.system.menuTable.menuCode"
          defaultMessage="menuCode"
        />
      ),
      hideInSearch: true,
      dataIndex: 'menuCode',
      tip: 'The id is the unique key',
      valueType: 'textarea',
    },
    {
      title: (
        <FormattedMessage
          id="pages.system.menuTable.menuLevel"
          defaultMessage="menuLevel"
        />
      ),
      hideInSearch: true,
      dataIndex: 'menuLevel',
      valueType: 'textarea',
    },
    {
      title: (
        <FormattedMessage
          id="pages.system.menuTable.sortNum"
          defaultMessage="sortNum"
        />
      ),
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
              createFormRef.current?.onShow(record);
            }}
          >
            新建子菜单
          </a>,
        ]
        if ( record && record.id != '0') {
          const changeButton: React.ReactNode[] = [
          <a
            key="update"
            onClick={() => {
              setCurrentRow(record);
              updateFormRef.current?.onUpdate(record.id);
            }}
          >
            修改
          </a>,
            <Popconfirm
              key="delete"
              title="确定删除该菜单?"
              onConfirm={async () => {
                const success = await handleRemove(new Array(record))
                if (success) {
                  setCurrentRow(undefined);
                  setSelectedRows([]);
                  actionRef.current?.reloadAndRest?.();
                }
              }}
              okText="确定"
              cancelText="取消"
            >
              <a href="#">删除</a>
            </Popconfirm>,
          ]
          optionButtons.push(changeButton);
        }

        return optionButtons;
      }
    },
  ];

  const onFinish = () => {
    setSelectedRows([]);
    actionRef.current?.reloadAndRest?.();
  };

  const onCancel = () => {

  }

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
        pagination={{}}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              createFormRef.current?.onShow('0');
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
      <MenuCreateForm ref={createFormRef} onFinish={ () => onFinish() } onCancel={ () => onCancel() }/>
      <MenuUpdateForm ref={updateFormRef} onFinish={ () => onFinish() } onCancel={ () => onCancel() }/>
    </PageContainer>
  );
};

export default MenuList;
