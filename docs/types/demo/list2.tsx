
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-undef */
/* eslint-disable no-sequences */
/* eslint-disable no-console */
import React, { FC, useRef, useState } from 'react';
import { Button, Col, Row, Space } from 'antd';
import { YForm } from 'yforms';
import { YFormListComponentProps, YFormListProps } from 'yforms/lib/YForm/component/List';
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined';
import MinusOutlined from '@ant-design/icons/lib/icons/MinusOutlined';
import { YFormInstance } from 'yforms/lib/YForm/Form';
import { YFormItemsType } from 'yforms/lib/YForm/ItemsType';
import { TreeSelectSingle } from './treeSelect';
import {data1, data2} from './json/treeData';
import InputForm, { InputFormProps } from './InputForm';

declare module 'yforms/lib/YForm/ItemsType' {
  export interface YFormItemsTypeDefine {
    treeSelectSingle: { componentProps?: { str?: string } };
    inputForm: { componentProps?: InputFormProps };
  }
}

export const itemsType: YFormItemsType = {
  treeSelectSingle: { component: <TreeSelectSingle /> },
  inputForm: { component: <InputForm /> },
};
YForm.Config({ itemsType });

const options = [
  { id: 'not_blank', name: '有值' },
  { id: 'is_blank', name: '无值' },
  { id: 'in', name: '等于' },
  { id: 'not_in', name: '不等于' },
  { id: 'contains', name: '包含' },
  { id: 'not_contains', name: '不包含' },
  { id: 'between', name: '介于' },
];

const disabledOpts = ['not_blank', 'is_blank'];

interface SwitchCardProps {
  form? : any;
  children: React.ReactNode;
  name: [index:number, name:string] | string;
  isShow: boolean;
  disabled: boolean;
}

const style: React.CSSProperties = {
  position: 'relative',
  width: 2,
  backgroundColor: '#40a9ff',
  margin: '8px 24px 32px 12px',
  display: 'flex',
  alignItems: 'center',
};

const btnStyle: React.CSSProperties = {
  width: 20,
  height: 20,
  position: 'absolute',
  left: '-9px',
  textAlign: 'center',
  padding: 0,
  borderRadius: 5,
  fontSize: 12,
};

const cardStyle: React.CSSProperties = {
  display: 'flex',
  width: '100%',
  flexWrap: 'wrap',
  alignContent: 'flexStart',
};

type SwitchValue = 'and' | 'or';

const defaultRuleValue = { type: 'rule', tag: '', function: 'in', params: [''] };

const defaultConditonValue = { relation: 'and', type: 'rules_relation', rules: [defaultRuleValue] };

const initialValues = { rules: [{ relation: 'and', type: 'rules_relation', rules: [{ type: 'rule', tag: '', function: 'in', params: ['通过'] }] }] };

const ruleFiterProps = {
  rootName: 'condition',
  condition: 'rules',
  rules: 'rules',
  relation: 'relation',
  relationTop: 'relation',
};

const SwitchButton = ({
  disabled = false,
  value,
  onChange,
  // eslint-disable-next-line no-shadow
  style,
}: {
  // eslint-disable-next-line react/require-default-props
  disabled?: boolean;
  // eslint-disable-next-line react/require-default-props
  value?: SwitchValue;
  // eslint-disable-next-line react/require-default-props
  onChange?: (value: SwitchValue) => void;
  style: React.CSSProperties;
}) => {
  const onClick = () => {
    if (value === 'and' && onChange) {
      onChange('or');
    }
    if (value === 'or' && onChange) {
      onChange('and');
    }
  };
  return (
    <Button disabled={disabled} onClick={onClick} style={style} type="primary">
      {value === 'and' ? '且' : '或'}
    </Button>
  );
};

const SwitchCard: FC<SwitchCardProps> = ({ form, children, name, isShow, disabled }) => {
  return (
    <Row>
      <Col style={{ ...cardStyle, width: 40 }}>
        <div style={{ ...style, margin: '10px 24px 34px 12px', display: isShow ? 'flex' : 'none' }}>
          <YForm
            form={form}
          >
            <YForm.Item name={name} initialValue="and">
              <SwitchButton disabled={disabled} style={btnStyle} />
            </YForm.Item>
          </YForm>
        </div>
      </Col>
      <Col span={20}>
        {children}
      </Col>
    </Row>
  );
};

const SwitchCardCol: FC<SwitchCardProps> = ({ children, name, isShow, disabled }) => {
  return (
    <Row>
      <Col style={{ ...cardStyle, width: 40 }}>
        <div style={{ ...style, margin: '10px 24px 34px 12px', display: isShow ? 'flex' : 'none' }}>
          <YForm.Item name={name} initialValue="and">
            <SwitchButton disabled={disabled} style={btnStyle} />
          </YForm.Item>
        </div>
      </Col>
      <Col span={20}>
        {children}
      </Col>
    </Row>
  );
};

export const colStyle = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};

export default () => {
  const [form]: [YFormInstance] = YForm.useForm();
  const ref = useRef<any>(null);
  const [, setCoordinates] = useState('');
  const [, setSize] = useState(null);
  const [disabled] = useState(false);
  const [treeData, setTreeData] = useState(data1);
  // const [form]: [YFormInstance] = YForm.useForm();
  const { condition, rules, relationTop, relation } = ruleFiterProps;

  const onFinish = () => {
    // window.console.log('---------------->', values);
    const params = form.getFieldsValue();
    console.log('params:', params);
  };

  const getSize = () => {
    return form.getFieldsValue()?.[condition]?.length;
  };

  const getRulesCountByIndex = (index: number) => {
    return form.getFieldsValue()?.[condition]?.[index]?.[rules]?.length;
  };

  const updateSize = () => {
    setSize(getSize());
  };

  const updateCoordinates = (index0: number, index1: number, length: number) => {
    setCoordinates(`${index0}.${index1}:${length}`);
  };

  const updateValue = async (index0: number, index1: number, value: string) => {
    const data = { ...form.getFieldsValue() };
    if (data[condition][index0] && data[condition][index0][rules] && data[condition][index0][rules][index1] && data[condition][index0][rules][index1].params[0] !== value) {
      data[condition][index0][rules][index1].params[0] = value;
      form.setFieldsValue(data);
    }
  };

  const onChangeSwitch = (checked) => {
    if(checked){
      setTreeData(data2);
    }else{
      setTreeData(data1);
    }
  }

  return (
    <>
      <SwitchCard form={form} name={relationTop} isShow={form.getFieldsValue()?.[condition]?.length > 0} disabled={disabled}>
        <YForm
          form={form}
          offset={100}
          disabled={disabled}
          initialValues={initialValues}
        >
          {[
            {
              type: 'list',
              noStyle: true,
              name: condition,
              componentProps: {
                showIcons: { showBottomAdd: false, showAdd: false, showRemove: false },
                onShowIcons: (): ReturnType<Required<YFormListComponentProps>['onShowIcons']> => ({
                  showAdd: false,
                  showRemove: false,
                }),
              },
              items: ({ index: index0, remove: remove0, add: add0 }): ReturnType<Extract<YFormListProps['items'], Function>> => {
                if (!ref.current) {
                  ref.current = add0;
                }
                const size = getRulesCountByIndex(index0);
                return [
                  {
                    dataSource: [
                      <SwitchCardCol name={[index0, relation]} isShow={size > 1} disabled={disabled} key={index0}>
                        <YForm.Items offset={100} noStyle>
                          {
                            [
                              { type: 'custom', noStyle: true, name: [index0, relation], componentProps: { style: { display: 'none' } } },
                              // { type: 'custom', noStyle: true, name: [index0, 'type'], componentProps: { style: { display: 'none' } } },
                              {
                                type: 'list',
                                noStyle: true,
                                name: [index0, rules],
                                componentProps: {
                                  showIcons: { showBottomAdd: false, showAdd: false, showRemove: false },
                                },
                                items: ({ index: index1, add: add1, remove: remove1 }): ReturnType<Extract<YFormListProps['items'], Function>> => {
                                  const length = getRulesCountByIndex(index0);
                                  updateCoordinates(index0, index1, length);
                                  return [
                                    {
                                      type: 'oneLine',
                                      noStyle: true,
                                      componentProps: { oneLineStyle: ['35%', 8, '20%', 8, '35%', 4, '10%'] },
                                      items: () => [
                                        { type: 'treeSelectSingle', name: [index1, 'tag'], componentProps: { treeData }},
                                        { type: 'custom', children: <span /> },
                                        { type: 'select', name: [index1, 'function'], componentProps: { options, defaultValue: 'in', allowClear: false } },
                                        { type: 'custom', children: <span /> },
                                        {
                                          shouldUpdate: (prevValues, curValues) => prevValues?.[condition]?.[index0]?.[rules]?.[index1]?.function !== curValues?.[condition]?.[index0]?.[rules]?.[index1]?.function,
                                          children: ({ getFieldValue }) => {
                                            const fieldsValue = getFieldValue([condition, index0, rules, index1]);
                                            const inputDisabled = disabledOpts.includes(fieldsValue?.function);
                                            if (inputDisabled) {
                                             // updateValue(index0, index1, '');
                                            }
                                            const inputForm = [{
                                              noStyle: true,
                                              type: 'inputForm',
                                              name: [0],
                                              rules: [{ required: false }],
                                              componentProps: {
                                                disabled: inputDisabled,
                                              },
                                            }]
                                            const items = [{
                                              noStyle: true,
                                              type: 'input',
                                              name: [0],
                                              componentProps: {
                                                disabled: inputDisabled,
                                              },
                                            }]
                                            if(fieldsValue?.function === 'between'){
                                              items.push({
                                                noStyle: true,
                                                type: 'input',
                                                name: [1],
                                                componentProps: {
                                                  disabled: inputDisabled,
                                                },
                                              });
                                            }
                                            
                                            return [
                                              {
                                                type: 'list',
                                                noStyle: true,
                                                name: [index1, 'params'],
                                                componentProps: { oneLineStyle: ['90%'], showIcons: { showBottomAdd: false, showAdd: false, showRemove: false } },
                                                items: () => inputDisabled?inputForm:items,
                                              },
                                            ];
                                          },
                                        },
                                        { type: 'custom', children: <span /> },
                                        {
                                          type: 'custom',
                                          children: <Space className="padding-icons inline-icons" style={{ top: 5 }}>
                                            <Button
                                              type="primary"
                                              shape="circle"
                                              size="small"
                                              icon={<PlusOutlined />}
                                              onClick={() => {
                                                add1(defaultRuleValue);
                                                // updateType(index0);
                                              }}
                                            />
                                            <Button
                                              danger
                                              type="dashed"
                                              shape="circle"
                                              size="small"
                                              icon={<MinusOutlined />}
                                              disabled={ index0 === 0 && index1 === 0 }
                                              onClick={() => {
                                                if (length === 1) {
                                                  remove0(index0);
                                                  updateSize();
                                                } else {
                                                  remove1(index1);
                                                  updateCoordinates(index0, index1, length);
                                                }
                                                // updateType(index0);
                                              }}
                                            />
                                          </Space>,
                                        },
                                        // { type: 'custom', noStyle: true, name: [index1, 'type'], componentProps: { style: { display: 'none' } } },
                                      ],
                                    },
                                  ];
                                },
                              },
                            ]
                          }
                        </YForm.Items>
                      </SwitchCardCol>,
                    ],
                  },
                ];
              },
            },
            {
              type: 'button',
              componentProps: {
                type: 'dashed',
                style: { width: '80%' },
                onClick: () => {
                  if (ref.current) {
                    ref.current(defaultConditonValue);
                    updateSize();
                  }
                },
                children: '添加条件',
              },
            },
            {
              type: 'switch',
              label: '切换',
              name: '开关',
              componentProps: { checkedChildren: '1', unCheckedChildren: '2' , onChange: onChangeSwitch },
            },
          ]}
        </YForm>
      </SwitchCard>
      <Button onClick={onFinish}>submit</Button>
    </>
  );
};


