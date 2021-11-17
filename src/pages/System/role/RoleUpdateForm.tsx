import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {message, Spin, Tree} from 'antd';
import type { ProFormInstance} from '@ant-design/pro-form';
import ProForm, {
  ProFormText,
  ModalForm
} from '@ant-design/pro-form';
import {useIntl} from 'umi';
import type {CleverFramework} from "@/services/clever-framework/typings";
import {
  systemMenu,
  systemRoleUpdate,
  systemRoleDetail,
} from "@/services/clever-framework/api";
// import {DataNode} from "rc-tree/lib/interface";

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
const handleUpdate = async (fields: CleverFramework.RoleListItem) => {
  const loadingMessage = message.loading('正在修改');
  let success: boolean = false;
  try {
    await systemRoleUpdate({ ...fields });
    message.success('修改成功');
    success = true;
  } catch (error) {
    debugger
    console.error(error)
    debugger
    message.error('修改失败, 请重试!');
    debugger
  } finally {
    loadingMessage();
  }
  return success;
};


const RoleCreateForm: React.ForwardRefRenderFunction<HTMLFormElement, UpdateFormProps> = (props: UpdateFormProps, ref: any) => {

  // 绑定一个 ProFormInstance 实例
  const updateRoleFormRef = useRef<ProFormInstance<CleverFramework.RoleListItem>>();
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

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

  const show = () => {
    handleUpdateModalVisible(true);
  }

  const hide = () => {
    updateRoleFormRef?.current?.resetFields()
    handleUpdateModalVisible(false);
  }

  const roleDetail = (id: string) => {
    handleLoading(true)
    systemRoleDetail(id).then(response => {
      updateRoleFormRef?.current?.setFieldsValue(response.content);
    }).finally(() => {
      handleLoading(false)
    })
  }

  const update = (id: string) => {
    loadTreeData();
    show();
    roleDetail(id);
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


  useImperativeHandle(ref,()=>{
    // 这里return 的对象里面方法和属性可以被父组件调用
    return {
      onUpdate(id: string){
        update(id);
      },
    }
  })


  const intl = useIntl();


  // @ts-ignore
  // @ts-ignore
  return (
    <ModalForm<CleverFramework.RoleListItem>
      title={intl.formatMessage({
        id: 'pages.system.menuTable.createForm.newMenu',
        defaultMessage: '修改角色',
      })}
      width="400px"
      visible={updateModalVisible}
      // 通过formRef进行绑定
      formRef={ updateRoleFormRef }
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
          initialValue={ [] }
          valuePropName={ "checkedKeys" }
          trigger={ "onCheck" }
        >
          <Tree
            checkable={ true }
            key={ 'id' }
            fieldNames={ { title: 'menuName', key: 'id', children: 'children' } }
            treeData={menuTreeData}
          />
        </ProForm.Item>
      </Spin>
    </ModalForm>
  );
};

export default forwardRef<HTMLFormElement, UpdateFormProps>(RoleCreateForm);
