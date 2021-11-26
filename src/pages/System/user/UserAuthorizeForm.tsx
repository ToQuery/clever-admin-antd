import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { message, Spin } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, { ProFormText, ModalForm } from '@ant-design/pro-form';
import { useIntl } from 'umi';
import type { CleverFramework } from '@/services/clever-framework/typings';
import { systemUserDetail, systemUserUpdate } from '@/services/clever-framework/api';
import { EditableProTable } from '@ant-design/pro-table';

export type AuthorizeUserFormProps = {
  user?: CleverFramework.UserListItem;
  onFinish?: any;
  onCancel?: any;
};

/**
 * @param fields
 */
const handleAuthorize = async (fields: CleverFramework.UserAuthorize) => {
  const loadingMessage = message.loading('正在修改');
  let success: boolean = false;
  try {
    await systemUserUpdate({ ...fields });
    message.success('授权成功');
    success = true;
  } catch (error) {
    console.error(error);
    message.error('授权失败, 请重试!');
  } finally {
    loadingMessage();
  }
  return success;
};

const UserAuthorizeForm: React.ForwardRefRenderFunction<HTMLFormElement, AuthorizeUserFormProps> = (
  props,
  ref: any,
) => {
  // 绑定一个 ProFormInstance 实例
  const authorizeFormRef = useRef<ProFormInstance<CleverFramework.UserAuthorize>>();

  const [authorizeModalVisible, handleAuthorizeModalVisible] = useState<boolean>(false);

  const [loading, handleLoading] = useState<boolean>(false);

  const hide = () => {
    handleAuthorizeModalVisible(false);
  };

  const show = () => {
    handleAuthorizeModalVisible(true);
  };

  const userDetail = (id: string) => {
    handleLoading(true);
    systemUserDetail(id)
      .then((response) => {
        authorizeFormRef?.current?.setFieldsValue({
          ...response.content,
          id: props.user?.id,
          username: props.user?.username,
        });
      })
      .finally(() => {
        handleLoading(false);
      });
  };

  const authorize = (id: string) => {
    show();
    userDetail(id);
  };

  const onCancel = () => {
    hide();
    props.onCancel();
  };

  const onFinish = async (values: CleverFramework.UserAuthorize) => {
    console.info('onFinish', values);
    const success = await handleAuthorize(values);
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
      onAuthorize(user: CleverFramework.UserListItem) {
        authorize(user);
      },
    };
  });

  const intl = useIntl();

  return (
    <ModalForm<CleverFramework.UserAuthorize>
      title={
        intl.formatMessage({
          id: 'pages.system.userTable.updateForm.authorizeUser',
          defaultMessage: '授权用户',
        }) + `${props.user?.username}`
      }
      width="400px"
      visible={authorizeModalVisible}
      // 通过formRef进行绑定
      formRef={authorizeFormRef}
      modalProps={{ onCancel: onCancel }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Spin spinning={loading}>
        <ProFormText
          disabled={true}
          label="id"
          width="md"
          name="id"
          initialValue={props.user?.id}
        />
        <ProFormText
          disabled={true}
          label="用户名"
          width="md"
          name="username"
          initialValue={props.user?.username}
        />

        <ProForm.Item label="角色" name="roles" trigger="onValuesChange">
          <EditableProTable<CleverFramework.UserListItem>
            rowKey="id"
            toolBarRender={false}
            columns={[]}
          />
        </ProForm.Item>
      </Spin>
    </ModalForm>
  );
};

export default forwardRef<HTMLFormElement, AuthorizeUserFormProps>(UserAuthorizeForm);
