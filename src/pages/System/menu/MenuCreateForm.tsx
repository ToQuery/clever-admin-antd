import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {message, Spin, TreeSelect} from 'antd';
import type { ProFormInstance} from '@ant-design/pro-form';
import ProForm, {
  ModalForm,
  ProFormText,
} from '@ant-design/pro-form';
import { useIntl } from 'umi';
import type {CleverFramework} from "@/services/clever-framework/typings";

import { systemMenu, systemMenuAdd } from '@/services/clever-framework/api';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<CleverFramework.MenuListItem>;

export type CreateFormProps = {
  onFinish?: any;
  onCancel?: any;
};




/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: CleverFramework.MenuListItem) => {
  const loadingMessage = message.loading('正在添加');
  let success: boolean = false;
  try {
    await systemMenuAdd({ ...fields });
    message.success('添加成功');
    success = true;
  } catch (error) {
    message.error('添加失败, 请重试!');
  } finally {
    loadingMessage();
  }
  return success;
};


const MenuCreateForm: React.ForwardRefRenderFunction<HTMLFormElement, CreateFormProps> = (props: CreateFormProps, ref: any) => {

  // 绑定一个 ProFormInstance 实例
  const createFormRef = useRef<ProFormInstance<CleverFramework.MenuListItem>>();

  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);

  const [loading, handleLoading] = useState<boolean>(false);

  const [menuTreeData, handleMenuTreeData] = useState<CleverFramework.MenuListItem[]>([]);

  const loadTreeData = () => {

    handleLoading(true);
    systemMenu().then(response => {
      handleMenuTreeData(response?.content);
    }).finally(() => {
      handleLoading(false);
    });
  };


  const hide = () => {
    createFormRef?.current?.resetFields();
    handleCreateModalVisible(false);
  }

  const show = () => {
    loadTreeData();
    handleCreateModalVisible(true);
  }

  const onCancel = () => {
    hide();
  }

  const onFinish = async (values: CleverFramework.MenuListItem) => {
    console.info('onFinish', values);
    const success = await handleAdd(values);
    if (success) {
      hide();
      props.onFinish();
    }
  }


  const onFinishFailed = (values: any) => {
    console.info('onFinishFailed', values);
  }


  const onMenuTreeChange =  (value: any ) => {
    console.log("onMenuTreeChange", value)
  };

  // useEffect(() => {
  //   if (createModalVisible){
  //     fromRef.resetFields();
  //   }
  // }, [createModalVisible, fromRef])

  useImperativeHandle(ref,()=>{
    // 这里return 的对象里面方法和属性可以被父组件调用
    return {
      onShow(parentId: string  = "0"){
        createFormRef?.current?.setFieldsValue({ parentId: parentId });
        show();
      },
    }
  })

  const intl = useIntl();

  return (
    <ModalForm<CleverFramework.MenuListItem>
      title={intl.formatMessage({
        id: 'pages.system.menuTable.createForm.newMenu',
        defaultMessage: '新建菜单',
      })}
      width="400px"
      visible={createModalVisible}
      // 通过formRef进行绑定
      formRef={ createFormRef }
      modalProps={ { onCancel: onCancel } }
      onFinish={ onFinish }
      onFinishFailed={ onFinishFailed }
    >
      <Spin spinning={loading}>
        <ProFormText
          rules={[
            {
              required: true,
              message: "菜单名称必填",
            },
          ]}
          label="菜单名称"
          width="md"
          name="menuName"
        />
        <ProFormText rules={[ { required: true, message: "菜单code必填", }, ]}
          label="菜单Code"
          width="md"
          name="menuCode"
        />
        <ProForm.Item rules={[{required: true, message: '请选择父级信息'}]} name="parentId" label="父级" valuePropName="value" >
            <TreeSelect
              key={'id'}
              style={{ width: '328px' }}
              placeholder="请选择父级菜单"
              treeDefaultExpandAll={true}
              fieldNames={ { label: 'menuName', value: 'id', children: 'children' } }
              onChange={onMenuTreeChange}
              treeData={menuTreeData}
            />
          </ProForm.Item>
      </Spin>
    </ModalForm>
  );
};

export default forwardRef<HTMLFormElement, CreateFormProps>(MenuCreateForm);
