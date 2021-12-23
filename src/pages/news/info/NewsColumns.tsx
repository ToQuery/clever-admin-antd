import type {ProColumns} from "@ant-design/pro-table";
import type {Biz} from "@/services/clever-framework/biz-typings";
import type {ProFormColumnsType} from "@ant-design/pro-form";
import type {FormFieldType} from "@ant-design/pro-form/lib/components/SchemaForm";


const valueEnum = {
  DRAFT: {text: '草稿'},
  SHOW: {text: '显示'},
  HIDE: {text: '隐藏'},
};

export const NewsColumns: ProColumns<Biz.News, FormFieldType | 'richText'>[] & ProFormColumnsType<Biz.News | 'richText'>[] = [
  {
    title: '新闻标题',
    dataIndex: 'title',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
    valueType: 'text',
  },
  {
    valueType: 'group',
    columns: [
      {
        title: '阅读数量',
        dataIndex: 'showNum',
        formItemProps: {
          rules: [
            {
              required: true,
              message: '此项为必填项',
            },
          ],
        },
        valueType: 'text',
        width: '100%',
      },
      {
        title: '点赞数量',
        dataIndex: 'likeNum',
        formItemProps: {
          rules: [
            {
              required: true,
              message: '此项为必填项',
            },
          ],
        },
        valueType: 'text',
        width: '100%',
      },
    ]
  },
  {
    title: '显示状态',
    dataIndex: 'showStatus',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
    valueType: 'select',
    valueEnum,
  },
  {
    title: 'showTime',
    dataIndex: 'showTime',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
    valueType: 'dateTime',
  },
  {
    valueType: 'group',
    columns: [
      {
        title: 'localDate',
        dataIndex: 'localDate',
        formItemProps: {
          rules: [
            {
              required: true,
              message: '此项为必填项',
            },
          ],
        },
        valueType: 'date',
      },
      {
        title: 'localTime',
        dataIndex: 'localTime',
        formItemProps: {
          rules: [
            {
              required: true,
              message: '此项为必填项',
            },
          ],
        },
        valueType: 'time',
      },
    ]
  },
  {
    title: 'localDateTime',
    dataIndex: 'localDateTime',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
    valueType: 'dateTime',
  },
  {
    title: 'localDateTime',
    dataIndex: 'localDateTime',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
    valueType: "richText",
  },
]

export default {
  NewsColumns,
};
