import React, {forwardRef, useRef, useState} from 'react';
import {message, Modal, Tree, TreeSelect} from 'antd';
import ProForm, {
  ProFormText,
  ModalForm, ProFormInstance,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';
import type {CleverFramework} from "@/services/clever-framework/typings";
import {systemMenu, systemMenuDetail, systemMenuUpdate} from "@/services/clever-framework/api";
import {CreateFormProps} from "@/pages/System/menu/MenuCreateForm";

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<CleverFramework.RoleListItem>;

export type CreateMenuFormProps = {
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


const RoleCreateForm: React.FC<CreateMenuFormProps> = (props: CreateMenuFormProps, ref: any) => {

  // 绑定一个 ProFormInstance 实例
  const updateFormRef = useRef<ProFormInstance<CleverFramework.RoleListItem>>();
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

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    console.log('selected', selectedKeys, info);
  };

  const onCheck = (checkedKeys: React.Key[], info: any) => {
    console.log('onCheck', checkedKeys, info);
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

  const intl = useIntl();


  return (
    <ModalForm<CleverFramework.RoleListItem>
      title={intl.formatMessage({
        id: 'pages.system.menuTable.createForm.newMenu',
        defaultMessage: '新建菜单',
      })}
      width="400px"
      visible={updateModalVisible}
      // 通过formRef进行绑定
      formRef={ updateFormRef }
      modalProps={ { onCancel: onCancel } }
      onFinish={ onFinish }
      onFinishFailed={ onFinishFailed }
    >
      <ProFormText
        rules={[
          {
            required: true,
            message: "角色名称必填",
          },
        ]}
        label="角色名称"
        width="md"
        name="roleName"
      />
      <ProForm.Item rules={[{required: true, message: '请选择父级信息'}]} name="parentId" label="父级">
        <Tree
          checkable
          key={ 'id' }
          fieldNames={ { title: 'menuName', key: 'id', children: 'children' } }
          onSelect={onSelect}
          onCheck={onCheck}
          treeData={menuTreeData}
        />
      </ProForm.Item>
    </ModalForm>
  );
};

export default forwardRef(RoleCreateForm);
