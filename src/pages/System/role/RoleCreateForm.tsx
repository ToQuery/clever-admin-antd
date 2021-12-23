import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { message, Spin, Tree } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, { ProFormText, ModalForm } from '@ant-design/pro-form';
import { useIntl } from 'umi';
import { menuTreeData2DataNode } from '@/services/clever-framework/utils';
import { DataNode } from 'rc-tree/lib/interface';
import { systemMenu, systemRoleAdd } from '@/components/CleverFramework/system-api';
import { CleverFramework } from '@/components/CleverFramework/system-typings';
// import {DataNode} from "rc-tree/lib/interface";

export type CreateRoleFormProps = {
  onFinish?: any;
  onCancel?: any;
};

/**
 * @param fields
 */
const handleAdd = async (fields: CleverFramework.RoleListItem) => {
  const hide = message.loading('正在添加');
  try {
    await systemRoleAdd({ ...fields });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

const RoleCreateForm: React.ForwardRefRenderFunction<HTMLFormElement, CreateRoleFormProps> = (
  props: CreateRoleFormProps,
  ref: any,
) => {
  // 绑定一个 ProFormInstance 实例
  const createRoleFormRef = useRef<ProFormInstance<CleverFramework.RoleListItem>>();
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);

  const [loading, handleLoading] = useState<boolean>(false);

  const [menuTreeData, handleMenuTreeData] = useState<DataNode[]>([]);

  const loadTreeData = () => {
    handleLoading(true);
    systemMenu()
      .then((response) => {
        handleMenuTreeData(menuTreeData2DataNode(response?.content));
      })
      .finally(() => {
        handleLoading(false);
      });
  };

  const hide = () => {
    handleCreateModalVisible(false);
  };

  const show = () => {
    loadTreeData();
    handleCreateModalVisible(true);
  };

  const onCancel = () => {
    hide();
    props.onCancel();
  };

  const onFinish = async (values: CleverFramework.MenuListItem) => {
    console.info('onFinish', values);
    const success = await handleAdd(values);
    if (success) {
      hide();
      props.onFinish();
    }
  };

  const onFinishFailed = (values: any) => {
    console.info('onFinishFailed', values);
  };

  useImperativeHandle(ref, () => {
    // 这里return 的对象里面方法和属性可以被父组件调用
    return {
      onShow() {
        // loadMenuTreeData();
        show();
      },
    };
  });

  const intl = useIntl();

  // @ts-ignore
  // @ts-ignore
  return (
    <ModalForm<CleverFramework.RoleListItem>
      title={intl.formatMessage({
        id: 'pages.system.roleTable.createForm.newRole',
        defaultMessage: '新建角色',
      })}
      width="400px"
      visible={createModalVisible}
      // 通过formRef进行绑定
      formRef={createRoleFormRef}
      modalProps={{ onCancel: onCancel }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Spin spinning={loading}>
        <ProFormText
          rules={[
            {
              required: true,
              message: '角色名称必填',
            },
          ]}
          label={intl.formatMessage({
            id: 'pages.system.roleTable.roleName',
            defaultMessage: '角色名称',
          })}
          name="roleName"
        />
        <ProForm.Item
          rules={[
            {
              required: true,
              message: '菜单权限必填',
            },
          ]}
          label={intl.formatMessage({
            id: 'pages.system.roleTable.configMenu',
            defaultMessage: '配置菜单',
          })}
          name="menuIds"
          initialValue={[]}
          valuePropName={'checkedKeys'}
          trigger={'onCheck'}
        >
          <Tree checkable={true} key={'id'} treeData={menuTreeData} />
        </ProForm.Item>
      </Spin>
    </ModalForm>
  );
};

export default forwardRef<HTMLFormElement, CreateRoleFormProps>(RoleCreateForm);
