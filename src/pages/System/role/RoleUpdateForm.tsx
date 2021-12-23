import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { message, Spin, Tree } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, { ProFormText, ModalForm } from '@ant-design/pro-form';
import { useIntl } from 'umi';
import { menuTreeData2DataNode } from '@/services/clever-framework/utils';
import type { DataNode } from 'rc-tree/lib/interface';
import { CleverFramework } from '@/components/CleverFramework/system-typings';
import { systemMenu, systemRoleDetail, systemRoleUpdate } from '@/components/CleverFramework/system-api';

export type UpdateRoleFormProps = {
  onFinish?: any;
  onCancel?: any;
};

/**
 * @param fields
 */
const handleUpdate = async (fields: CleverFramework.RoleListItem) => {
  const loadingMessage = message.loading('正在修改');
  let success: boolean = false;
  try {
    await systemRoleUpdate({ ...fields });
    message.success('修改成功');
    success = true;
  } catch (error) {
    console.error(error);
    message.error('修改失败, 请重试!');
  } finally {
    loadingMessage();
  }
  return success;
};

const RoleCreateForm: React.ForwardRefRenderFunction<HTMLFormElement, UpdateRoleFormProps> = (
  props: UpdateRoleFormProps,
  ref: any,
) => {
  // 绑定一个 ProFormInstance 实例
  const updateRoleFormRef = useRef<ProFormInstance<CleverFramework.RoleListItem>>();
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

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

  const show = () => {
    handleUpdateModalVisible(true);
  };

  const hide = () => {
    updateRoleFormRef?.current?.resetFields();
    handleUpdateModalVisible(false);
  };

  const roleDetail = (id: string) => {
    handleLoading(true);
    systemRoleDetail(id)
      .then((response) => {
        updateRoleFormRef?.current?.setFieldsValue(response.content);
      })
      .finally(() => {
        handleLoading(false);
      });
  };

  const update = (id: string) => {
    loadTreeData();
    show();
    roleDetail(id);
  };

  const onCancel = () => {
    hide();
    props.onCancel();
  };

  const onFinish = async (values: CleverFramework.MenuListItem) => {
    console.info('onFinish', values);
    const success = await handleUpdate(values);
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
      onUpdate(id: string) {
        update(id);
      },
    };
  });

  const intl = useIntl();

  return (
    <ModalForm<CleverFramework.RoleListItem>
      title={intl.formatMessage({
        id: 'pages.system.roleTable.updateForm.updateRole',
        defaultMessage: '修改角色',
      })}
      width="400px"
      visible={updateModalVisible}
      // 通过formRef进行绑定
      formRef={updateRoleFormRef}
      modalProps={{ onCancel: onCancel }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Spin spinning={loading}>
        <ProFormText disabled={true} label="id" name="id" />
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
          // TODO 需要获取半选中的节点
          // getValueFromEvent={ (checkedKeys, event: any) => {
          //   console.info('getValueFromEvent', checkedKeys, event);
          //   debugger
          //   return checkedKeys.concat(event.halfCheckedKeys)
          // }}

          // getValueProps={ (value: StoreValue) => {
          //   console.info(value);
          //   debugger
          //   return value;
          // }}

          valuePropName={'checkedKeys'}
          trigger={'onCheck'}
        >
          <Tree checkable={true} key={'id'} treeData={menuTreeData} />
        </ProForm.Item>
      </Spin>
    </ModalForm>
  );
};

export default forwardRef<HTMLFormElement, UpdateRoleFormProps>(RoleCreateForm);
