import React, {useContext, useRef, useState} from 'react';
import {useIntl} from 'umi';
import {PageContainer} from '@ant-design/pro-layout';
import type {ActionType} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

import type {Biz} from "@/services/clever-framework/biz-typings";
import type {AppBase} from "@/components/CleverFramework/app-typings";
import {NewsColumns} from "./NewsColumns";
import type { FormInstance} from "@ant-design/pro-form";
import {BetaSchemaForm} from "@ant-design/pro-form";
import {bizNewsPage} from "@/services/clever-framework/biz-api";
import {Button} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {FormattedMessage} from "@@/plugin-locale/localeExports";
import {FormFieldType} from "@ant-design/pro-form/lib/components/SchemaForm";
import ProProvider from "@ant-design/pro-provider";

const TableList: React.FC = () => {

  const actionRef = useRef<ActionType>();

  const formRef = useRef<FormInstance>();

  const [visible, handleVisible] = useState<boolean>(false);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const values = useContext(ProProvider);
  return (
    <PageContainer>
      <ProTable<Biz.News, AppBase.RequestParam & Biz.News, FormFieldType | 'richText'>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleVisible(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={async (params) => {
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          const responseParam = await bizNewsPage(params);
          return {
            data: responseParam.content,
            success: responseParam.success,
            total: responseParam.page.totalElements,
          };
        }}
        columns={NewsColumns}
        rowSelection={{}}
      />
      <ProProvider.Provider
        value={{
          ...values,
          valueTypeMap: {
            richText: {
              render: (text) => <a>{text}</a>,
              renderFormItem: () => (
                <span>富文本编辑器 </span>
              ),
            },
          }
        }}
      >
        <BetaSchemaForm<Biz.News, FormFieldType | "richText">
          title={"新闻管理"}
          layoutType="ModalForm"
          formRef={formRef}
          visible={visible}
          layout={"horizontal"}
          onFinish={async (formData) => {
            console.log(formData);
          }}
          columns={NewsColumns}
        />
      </ProProvider.Provider>
    </PageContainer>
  );
};

export default TableList;
