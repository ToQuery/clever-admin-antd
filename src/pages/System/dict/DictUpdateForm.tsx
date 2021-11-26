import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { message, Spin } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, { ProFormText, ModalForm } from '@ant-design/pro-form';
import { useIntl } from 'umi';
import type { CleverFramework } from '@/services/clever-framework/typings';
import { systemDictDetail, systemDictUpdate } from '@/services/clever-framework/api';
import { EditableProTable } from '@ant-design/pro-table';

export type UpdateDictFormProps = {
  onFinish?: any;
  onCancel?: any;
};

/**
 * @param fields
 */
const handleUpdate = async (fields: CleverFramework.DictListItem) => {
  const loadingMessage = message.loading('正在修改');
  let success: boolean = false;
  try {
    await systemDictUpdate({ ...fields });
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

const DictUpdateForm: React.ForwardRefRenderFunction<HTMLFormElement, UpdateDictFormProps> = (
  props,
  ref: any,
) => {
  // 绑定一个 ProFormInstance 实例
  const updateDictFormRef = useRef<ProFormInstance<CleverFramework.DictListItem>>();

  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>();

  const [loading, handleLoading] = useState<boolean>(false);

  const hide = () => {
    updateDictFormRef?.current?.resetFields();
    handleUpdateModalVisible(false);
  };

  const show = () => {
    handleUpdateModalVisible(true);
  };

  const dictDetail = (id: string) => {
    handleLoading(true);
    systemDictDetail(id)
      .then((response) => {
        updateDictFormRef?.current?.setFieldsValue(response.content);
      })
      .finally(() => {
        handleLoading(false);
      });
  };

  const update = (id: string) => {
    show();
    dictDetail(id);
  };

  const onCancel = () => {
    hide();
    props.onCancel();
  };

  const onFinish = async (values: CleverFramework.DictListItem) => {
    console.info('onFinish', values);
    handleLoading(true);
    const success = await handleUpdate(values);
    handleLoading(false);
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
    <ModalForm<CleverFramework.DictListItem>
      title={intl.formatMessage({
        id: 'pages.system.dictTable.createForm.newDict',
        defaultMessage: '新建字典',
      })}
      width="700px"
      visible={updateModalVisible}
      // 通过formRef进行绑定
      formRef={updateDictFormRef}
      modalProps={{ onCancel: onCancel }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Spin spinning={loading}>
        <ProFormText disabled={true} label="id" name="id" />

        <ProFormText label="字典名称" name="dictName" />

        <ProFormText label="字典Code" name="dictCode" />

        <ProFormText label="字典描述" name="dictDesc" />

        <ProFormText label="字典序号" name="sortNum" />

        <ProForm.Item label="字典值" name="dictItems" trigger="onValuesChange">
          <EditableProTable<CleverFramework.DictValueListItem>
            rowKey="id"
            toolBarRender={false}
            columns={[
              {
                title: '字典值名称',
                dataIndex: 'itemText',
                valueType: 'text',
                formItemProps: {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '请填写字典值名称',
                    },
                  ],
                },
              },
              {
                title: '字典值',
                dataIndex: 'itemValue',
                valueType: 'text',
                formItemProps: {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '请填写字典值',
                    },
                  ],
                },
              },
              {
                title: '字典值描述',
                dataIndex: 'itemDesc',
                valueType: 'text',
              },
              {
                title: '字典值状态',
                dataIndex: 'disable',
                valueEnum: {
                  1: {
                    text: '禁用',
                    status: 1,
                  },
                  0: {
                    text: '启用',
                    status: 0,
                  },
                },
                formItemProps: {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '请选择字典值状态',
                    },
                  ],
                },
                width: 110,
              },
              {
                title: '序号',
                dataIndex: 'sortNum',
                valueType: 'text',
                formItemProps: {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '请填写序号',
                    },
                  ],
                },
                width: 100,
              },
              {
                title: '操作',
                valueType: 'option',
                width: 90,
              },
            ]}
            recordCreatorProps={{
              newRecordType: 'dataSource',
              creatorButtonText: '新增字典',
              record: () => ({
                id: (Math.random() * 1000000).toFixed(0),
                disable: '0',
                sortNum: 1,
              }),
            }}
            editable={{
              type: 'multiple',
              editableKeys,
              actionRender: (row, config, defaultDoms) => {
                return [defaultDoms.delete];
              },
              onChange: setEditableRowKeys,
            }}
          />
        </ProForm.Item>
      </Spin>
    </ModalForm>
  );
};

export default forwardRef<HTMLFormElement, UpdateDictFormProps>(DictUpdateForm);
