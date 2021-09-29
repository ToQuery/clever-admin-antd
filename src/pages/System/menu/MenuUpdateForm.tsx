import React, {forwardRef, ForwardRefRenderFunction, useEffect, useImperativeHandle, useRef, useState} from 'react';
import { message, TreeSelect} from 'antd';
import type {ProFormInstance} from '@ant-design/pro-form';
import ProForm, {
  ModalForm,
  ProFormText,
} from '@ant-design/pro-form';
import { useIntl } from 'umi';
import type {CleverFramework} from "@/services/clever-framework/typings";

import {systemMenu, systemMenuAdd, systemMenuDetail, systemMenuUpdate} from '@/services/clever-framework/api';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<CleverFramework.MenuListItem>;

export type UpdateFormProps = {
  onFinish?: any;
  onCancel?: any;
};


/**
 * @param fields
 */
const handleUpdate = async (fields: CleverFramework.MenuListItem) => {
  const hide = message.loading('正在添加');
  try {
    await systemMenuUpdate({ ...fields });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};


const MenuUpdateForm: React.FC<UpdateFormProps> = (props: UpdateFormProps, ref: any) => {

  // 绑定一个 ProFormInstance 实例
  const updateFormRef = useRef<ProFormInstance<CleverFramework.MenuListItem>>();

  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [menuTreeData, handleMenuTreeData] = useState<CleverFramework.MenuListItem[]>([]);

  const loadTreeData = () => {
    systemMenu().then(response => {
      handleMenuTreeData(response.content);
    });
  };


  const hide = () => {
    handleUpdateModalVisible(false);
  }

  const show = () => {
    handleUpdateModalVisible(true);
  }

  const menuDetail = (id: string) => {
    systemMenuDetail(id).then(responseParam => {
      updateFormRef?.current?.setFieldsValue(responseParam.content);
    })
  }

  const update = (id: string) => {
    loadTreeData();
    show();
    handleUpdateModalVisible(true);
    menuDetail(id);
  }

  const onCancel = () => {
    hide();
    props.onCancel();
  }

  const onFinish = async (values: CleverFramework.MenuListItem) => {
    console.info('onFinish', values);
    const success = await handleUpdate(values);
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
    updateFormRef?.current?.setFieldsValue({ parentId: value });
  };

  // useEffect(() => {
  //   if (updateModalVisible){
  //     updateFormRef.resetFields();
  //   }
  // }, [updateModalVisible, updateFormRef])

  useImperativeHandle(ref,()=>{
    // 这里return 的对象里面方法和属性可以被父组件调用
    return {
      onUpdate(id: string){
        update(id);
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
      key={ 'id' }
      visible={updateModalVisible}
      // 通过formRef进行绑定
      formRef={ updateFormRef }
      modalProps={ { onCancel: onCancel, destroyOnClose: true } }
      onFinish={ onFinish }
      onFinishFailed={ onFinishFailed }
    >
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
      <ProForm.Item rules={[{required: true, message: '请选择父级信息'}]} name="parentId" label="父级">
        <TreeSelect
          treeDataSimpleMode
          key={'id'}
          style={{ width: '328px' }}
          placeholder="请选择父级菜单"
          fieldNames={ { label: 'menuName', value: 'id', children: 'children' } }
          onChange={onMenuTreeChange}
          treeData={menuTreeData}
        />
      </ProForm.Item>
    </ModalForm>
  );
};

export default forwardRef(MenuUpdateForm);
