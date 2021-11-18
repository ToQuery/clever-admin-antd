import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { message, Spin } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormText, ProFormRadio, ModalForm } from '@ant-design/pro-form';
import { useIntl } from 'umi';
import type { CleverFramework } from '@/services/clever-framework/typings';
import { systemUserDetail, systemUserUpdate } from '@/services/clever-framework/api';

export type UpdateUserFormProps = {
  onFinish?: any;
  onCancel?: any;
};

/**
 * @param fields
 */
const handleUpdate = async (fields: CleverFramework.UserListItem) => {
  const loadingMessage = message.loading('正在修改');
  let success: boolean = false;
  try {
    await systemUserUpdate({ ...fields });
    message.success('修改成功');
    success = true;
  } catch (error) {
    debugger;
    console.error(error);
    debugger;
    message.error('修改失败, 请重试!');
    debugger;
  } finally {
    loadingMessage();
  }
  return success;
};

const UserUpdateForm: React.ForwardRefRenderFunction<HTMLFormElement, UpdateUserFormProps> = (
  props,
  ref: any,
) => {
  // 绑定一个 ProFormInstance 实例
  const updateFormRef = useRef<ProFormInstance<CleverFramework.UserListItem>>();

  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [loading, handleLoading] = useState<boolean>(false);

  const hide = () => {
    handleUpdateModalVisible(false);
  };

  const show = () => {
    handleUpdateModalVisible(true);
  };

  const userDetail = (id: string) => {
    handleLoading(true);
    systemUserDetail(id)
      .then((response) => {
        updateFormRef?.current?.setFieldsValue(response.content);
      })
      .finally(() => {
        handleLoading(false);
      });
  };

  const update = (id: string) => {
    show();
    userDetail(id);
  };

  const onCancel = () => {
    hide();
    props.onCancel();
  };

  const onFinish = async (values: CleverFramework.UserListItem) => {
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
    <ModalForm<CleverFramework.UserListItem>
      title={intl.formatMessage({
        id: 'pages.system.menuTable.createForm.newMenu',
        defaultMessage: '新建菜单',
      })}
      width="400px"
      visible={updateModalVisible}
      // 通过formRef进行绑定
      formRef={updateFormRef}
      modalProps={{ onCancel: onCancel }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Spin spinning={loading}>
        <ProFormText disabled={true} label="id" width="md" name="id" />
        <ProFormText
          rules={[
            {
              required: true,
              message: '用户名必填',
            },
          ]}
          label="用户名"
          width="md"
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
          width="md"
          name="nickname"
        />
        <ProFormText label="手机号" width="md" name="phone" />
        <ProFormText label="邮箱" width="md" name="email" />
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
      </Spin>
    </ModalForm>
  );
};

export default forwardRef<HTMLFormElement, UpdateUserFormProps>(UserUpdateForm);
