import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormText, ProFormRadio, ModalForm } from '@ant-design/pro-form';
import { useIntl } from 'umi';
import type { CleverFramework } from '@/services/clever-framework/typings';
import { systemUserAdd } from '@/services/clever-framework/api';

export type CreateUserFormProps = {
  onFinish?: any;
  onCancel?: any;
};

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: CleverFramework.UserListItem) => {
  const loadingMessage = message.loading('正在添加');
  let success: boolean = false;
  try {
    await systemUserAdd({ ...fields });
    message.success('添加成功');
    success = true;
  } catch (error) {
    message.error('添加失败, 请重试!');
  } finally {
    loadingMessage();
  }
  return success;
};

const UserCreateForm: React.ForwardRefRenderFunction<HTMLFormElement, CreateUserFormProps> = (
  props,
  ref: any,
) => {
  // 绑定一个 ProFormInstance 实例
  const createFormRef = useRef<ProFormInstance<CleverFramework.UserListItem>>();

  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);

  const hide = () => {
    handleCreateModalVisible(false);
  };

  const show = () => {
    handleCreateModalVisible(true);
  };

  const onCancel = () => {
    hide();
  };

  const onFinish = async (values: CleverFramework.UserListItem) => {
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
        show();
      },
    };
  });

  const intl = useIntl();

  return (
    <ModalForm<CleverFramework.UserListItem>
      title={intl.formatMessage({
        id: 'pages.system.userTable.createForm.newUser',
        defaultMessage: '新建用户',
      })}
      width="400px"
      visible={createModalVisible}
      // 通过formRef进行绑定
      formRef={createFormRef}
      modalProps={{ onCancel: onCancel }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <ProFormText
        rules={[
          {
            required: true,
            message: '用户名必填',
          },
        ]}
        label="用户名"
        name="username"
      />
      <ProFormText
        rules={[
          {
            required: true,
            message: '用户昵称必填',
          },
        ]}
        label="用户昵称"
        name="nickname"
      />
      <ProFormText
        rules={[
          {
            required: true,
            message: '用户密码必填',
          },
        ]}
        label="用户密码"
        name="password"
      />
      <ProFormText label="手机号" name="phone" />
      <ProFormText label="邮箱" name="email" />
      <ProFormRadio.Group
        name="userStatus"
        label={intl.formatMessage({
          id: 'pages.system.userTable.userStatus',
          defaultMessage: '状态',
        })}
        options={[
          {
            value: 1,
            label: '启用',
          },
          {
            value: 0,
            label: '禁用',
          },
        ]}
        initialValue={1}
      />
    </ModalForm>
  );
};

export default forwardRef<HTMLFormElement, CreateUserFormProps>(UserCreateForm);
