import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {message, Spin, Tree} from 'antd';
import ProForm, {
  ProFormText,
  ModalForm, ProFormInstance,
} from '@ant-design/pro-form';
import {useIntl} from 'umi';
import type {CleverFramework} from "@/services/clever-framework/typings";
import {systemMenu, systemRoleAdd} from "@/services/clever-framework/api";
import {DataNode} from "rc-tree/lib/interface";

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<CleverFramework.RoleListItem>;

export type UpdateFormProps = {
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


const RoleCreateForm: React.ForwardRefRenderFunction<HTMLFormElement, UpdateFormProps> = (props: UpdateFormProps, ref: any) => {

  // 绑定一个 ProFormInstance 实例
  const updateFormRef = useRef<ProFormInstance<CleverFramework.RoleListItem>>();
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
      // const dataNodes = menuTreeData2DataNode();
      handleMenuTreeData(response?.content);
    }).finally(() => {
      handleLoading(false);
    });
  };

  /*
  const menuTreeData2DataNode: DataNode[] = (treeDatas: CleverFramework.MenuListItem[]) => {
    const dataNodes: any[] = [];
    for (let i = 0; i < treeDatas.length; i++) {
      const treeData = treeDatas[i];
      dataNodes.push({
        key: treeData.id,
        title: treeData.menuName,
        children: ( treeData.children && treeData.children.length > 0 ) ? menuTreeData2DataNode(treeData.children) : []
      })
    }
    return dataNodes;

  }*/

  const hide = () => {
    handleCreateModalVisible(false);
  }

  const show = () => {
    loadTreeData();
    handleCreateModalVisible(true);
  }


  const onCancel = () => {
    hide();
    props.onCancel();
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

  const onMenuTreeCheck =  (value: any , e: any) => {
    console.log("onMenuTreeCheck", value, e)
  };


  useImperativeHandle(ref,()=>{
    // 这里return 的对象里面方法和属性可以被父组件调用
    return {
      onShow(){
        // loadMenuTreeData();
        show();
      },
    }
  })

  const intl = useIntl();


  return (
    <ModalForm<CleverFramework.RoleListItem>
      title={intl.formatMessage({
        id: 'pages.system.menuTable.createForm.newMenu',
        defaultMessage: '新建菜单',
      })}
      width="400px"
      visible={createModalVisible}
      // 通过formRef进行绑定
      formRef={ updateFormRef }
      modalProps={ { onCancel: onCancel } }
      onFinish={ onFinish }
      onFinishFailed={ onFinishFailed }
    >
      <Spin spinning={loading}>
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
        <ProForm.Item
          rules={[
            {
              required: true,
              message: "菜单权限必填",
            },
          ]}
          label="菜单权限"
          name="menuIds"
          initialValue={ "101" }
        >
          <Tree
            checkable={ true }
            key={ 'id' }
            fieldNames={ { title: 'menuName', key: 'id', children: 'children' } }
            onCheck={onMenuTreeCheck}
            treeData={menuTreeData}
          />
        </ProForm.Item>
      </Spin>
    </ModalForm>
  );
};

export default forwardRef<HTMLFormElement, UpdateFormProps>(RoleCreateForm);
