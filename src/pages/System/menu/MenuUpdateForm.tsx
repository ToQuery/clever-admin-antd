import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Form, message, Spin, TreeSelect } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { useIntl } from 'umi';
import { CleverFramework } from '@/components/CleverCore/system-typings';
import { systemMenu, systemMenuDetail, systemMenuUpdate } from '@/components/CleverCore/system-api';

export type UpdateMenuFormProps = {
  onFinish?: any;
  onCancel?: any;
};

/**
 * @param fields
 */
const handleUpdate = async (fields: CleverFramework.MenuListItem) => {
  const loadingMessage = message.loading('正在修改');
  let success: boolean = false;
  try {
    await systemMenuUpdate({ ...fields });
    message.success('修改成功');
    success = true;
  } catch (error) {
    message.error('修改失败, 请重试!');
  } finally {
    loadingMessage();
  }
  return success;
};

const MenuUpdateForm: React.ForwardRefRenderFunction<HTMLFormElement, UpdateMenuFormProps> = (
  props: UpdateMenuFormProps,
  ref: any,
) => {
  // 绑定一个 ProFormInstance 实例
  const updateMenuFormRef = useRef<ProFormInstance<CleverFramework.MenuListItem>>();

  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [loading, handleLoading] = useState<boolean>(false);

  const [menuTreeData, handleMenuTreeData] = useState<CleverFramework.MenuListItem[]>([]);

  const doMenuTreeData = (
    menuTreeDataValue: React.SetStateAction<CleverFramework.MenuListItem[]>,
  ) => {
    handleMenuTreeData(menuTreeDataValue);
    // handleMenuTreeData(menuTreeDataValueOld => {
    //   // @ts-ignore
    //   return menuTreeDataValueOld.concat(menuTreeDataValue)
    // });
  };

  const hide = () => {
    handleUpdateModalVisible(false);
  };

  const show = () => {
    handleUpdateModalVisible(true);
  };

  const menuDetail = (id: string) => {
    handleLoading(true);
    systemMenu()
      .then((response) => {
        doMenuTreeData(response.content);
        return systemMenuDetail(id);
      })
      .then((responseParam) => {
        updateMenuFormRef?.current?.setFieldsValue(responseParam.content);
      })
      .finally(() => {
        handleLoading(false);
      });
  };

  const update = (id: string) => {
    show();
    menuDetail(id);
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

  const onMenuTreeChange = (value: any) => {
    console.log('onMenuTreeChange', value);
    updateMenuFormRef?.current?.setFieldsValue({ parentId: value });
  };

  // useEffect(() => {
  //   if (updateModalVisible){
  //     updateFormRef.resetFields();
  //   }
  // }, [updateModalVisible, updateFormRef])

  //获取数据
  // useEffect(() => {
  //   const createData = async () => {
  //     //这里的请求是自己封装的  按自己项目中的请求来
  //     const { content } = await systemMenu();
  //     handleMenuTreeData(content);
  //     debugger
  //   }
  //   createData();
  //   debugger
  // }, [])

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
    <ModalForm<CleverFramework.MenuListItem>
      title={intl.formatMessage({
        id: 'pages.system.menuTable.createForm.newMenu',
        defaultMessage: '修改菜单',
      })}
      width="400px"
      key={'id'}
      visible={updateModalVisible}
      // 通过formRef进行绑定
      formRef={updateMenuFormRef}
      modalProps={{ onCancel: onCancel, destroyOnClose: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Spin spinning={loading}>
        <ProFormText disabled={true} label="id" name="id" />
        <ProFormText
          rules={[
            {
              required: true,
              message: '菜单名称必填',
            },
          ]}
          label="菜单名称"
          name="menuName"
        />
        <ProFormText
          rules={[{ required: true, message: '菜单code必填' }]}
          label="菜单Code"
          name="menuCode"
        />
        <Form.Item
          rules={[{ required: true, message: '请选择父级信息' }]}
          name="parentId"
          label="父级"
        >
          <TreeSelect
            key={'id'}
            placeholder="请选择父级菜单"
            treeDefaultExpandAll={true}
            fieldNames={{ label: 'menuName', value: 'id', children: 'children' }}
            onChange={onMenuTreeChange}
            treeData={menuTreeData}
          />
        </Form.Item>
      </Spin>
    </ModalForm>
  );
};

export default forwardRef<HTMLFormElement, UpdateMenuFormProps>(MenuUpdateForm);
