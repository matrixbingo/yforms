/* eslint-disable no-console */
import React, { FC, useRef, useState } from 'react';
import { Button, Col, Row, Space } from 'antd';
import { YForm } from 'yforms';
import { YFormListComponentProps, YFormListProps } from 'yforms/lib/YForm/component/List';
import { YFormInstance } from 'yforms/lib/YForm/Form';
import PlusCircleOutlined from '@ant-design/icons/lib/icons/PlusCircleOutlined';
import MinusCircleOutlined from '@ant-design/icons/lib/icons/MinusCircleOutlined';

interface SwitchCardProps {
  children: React.ReactNode;
  name: [index:number, name:string] | string,
  isShow: boolean,
  disabled: boolean
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

const cardStyle: React.CSSProperties = { display: 'flex', width : '100%', flexWrap: 'wrap',
alignContent: 'flexStart'
}

type SwitchValue = 'and' | 'or';

const defaultRuleValue =  {relation: "and", rules: [{ name: 'realtime', age: 11 }]};

const ruleFiterProps = {
  condition:'condition',
  rules:'rules',
  relation:'relation',
  relationTop:'relation'
}

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


const SwitchCardCol: FC<SwitchCardProps> = ({children, name, isShow, disabled}) =>{
  return <Row>
    <Col style={{...cardStyle, width : 40}}>
      <div style={{ ...style, margin: '10px 24px 34px 12px' , display:isShow ? 'flex' : 'none'}}>
        <YForm.Item name = {name}  initialValue="and">
          <SwitchButton disabled={disabled} style={btnStyle} />
        </YForm.Item>
      </div>
    </Col>
    <Col span={20}>
    {children}
    </Col>
  </Row>
}

export default () => {
  const ref = useRef(null); 
  const [listNum, setListNum] =  useState([]);
  const [, setCoordinates] =  useState('s');
  const [, setSize] =  useState(null);
  const [disabled, setDisabled] = useState(false);
  const [form]: [YFormInstance] = YForm.useForm();
  const {condition, rules, relationTop, relation} = ruleFiterProps;

  const onFinish = () => {
    // window.console.log('---------------->', values);
    const params = form.getFieldsValue();
    console.log('params:', params);
  };

  const updateSize = () => {
    setSize(form.getFieldsValue()?.[condition]?.length);
  }

  const updateCoordinates = (index0, index1, length) => {
    setCoordinates(index0 + '.' + index1 + ':' + length);
  }

  return (
    <>
     {/* <div style={cardStyle}>
          <div style={{...style, display: form.getFieldsValue()?.[condition]?.length > 1 ? 'flex' : 'none'}}>
          <YForm form={form} >
            <YForm.Item name={relationTop} initialValue="and">
              <SwitchButton disabled={disabled} style={btnStyle} />
            </YForm.Item>
            </YForm>
          </div> */}
          <SwitchCardCol name={relationTop} isShow={form.getFieldsValue()?.[condition]?.length > 1} disabled={disabled}>
    <YForm
      offset={100}
      form={form}
      onFinish={onFinish}
      disabled={disabled}
      initialValues={{type:'sasasas',condition:[{relation: "and", rules: [{ name: '', age: 0 }]}]}}
    >
      {[
        {
          type: 'list',
          name: condition,
          componentProps: {
            showIcons: { showBottomAdd: false, showAdd: false, showRemove: false },
            onShowIcons: (): ReturnType<Required<YFormListComponentProps>['onShowIcons']> => ({
              showAdd: false,
              showRemove: false,
            }),
          },
          items: ({ index : index0, remove : remove0, add : add0 }): ReturnType<Extract<YFormListProps['items'], Function>> => {
            if(!ref.current){
              ref.current = add0;
            }
            const size  = form.getFieldsValue()?.[condition]?.[index0]?.[rules]?.length;
            return [
              {
                dataSource: [
                  <SwitchCardCol name={[index0, relation]} isShow={size > 1} disabled={disabled} key={index0}>
                    <YForm.Items offset={100}>
                      {
                        [
                          { type: 'custom', noStyle: true, name: [index0, relation], componentProps:{style:{'display':'none'}} },
                          {
                            type: 'list',
                            name: [index0, rules] ,
                            componentProps: {
                              showIcons: { showBottomAdd: false, showAdd: false , showRemove: false}
                            },
                            items: ({ index : index1, add : add1, remove:remove1 }): ReturnType<Extract<YFormListProps['items'], Function>> => {
                              const length  = form.getFieldsValue()?.[condition]?.[index0]?.[rules].length;
                              updateCoordinates(index0, index1, length);
                              return [
                                {
                                  type: 'oneLine',
                                  componentProps: {  oneLineStyle: ['50%', 8, '50%'] },
                                  items: () => [
                                    { label: '姓名', type: 'input', name: [index1, 'name'] },
                                    { type: 'custom', children: <span /> },
                                    { label: '年龄', type: 'input', name: [index1, 'age'] },
                                    <Space className="padding-icons inline-icons" style={{ top: 5}}>
                                      <PlusCircleOutlined style={{ margin: '5px 0px 0px 8px', fontSize: 18, color: '#1890ff' }} onClick={() => {add1()}}/>
                                      <MinusCircleOutlined style={{ margin: '5px 8px 0 8px', fontSize: 18, color: '#999' }} onClick={() => {
                                        if(length === 1){
                                          remove0(index0);
                                          updateSize();
                                        }else{
                                          remove1(index1);
                                          updateCoordinates(index0, index1, length - 1);
                                        }
                                    }}/>
                                  </Space>
                                  ]
                                },
                              ];
                            },
                          }
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
            style: { width: '100%' },
            onClick: () => {
              if(ref.current){
                ref.current(defaultRuleValue);
                // form.setFields([
                //   {name:['condition', 'relation'], value: "and"},
                //   {name:['condition', 'rules', 'name'], value: ""},
                //   {name:['condition', 'rules', 'age'], value: 0}
                // ]);

                // form.setFields([{ name: 'id', value: '123', errors: ['error message'] }]);
                updateSize();
              }
            },
            children: '添加',
          },
        }
      ]}
  </YForm> 
  </SwitchCardCol>

  
    {/* <div style={cardStyle}>
          <div style={{...style, display: form.getFieldsValue()?.[condition]?.length > 1 ? 'flex' : 'none'}}>
          <YForm form={form} >
            <YForm.Item name={relationTop} initialValue="and">
              <SwitchButton disabled={disabled} style={btnStyle} />
            </YForm.Item>
            </YForm>
          </div>
    <YForm
      offset={100}
      form={form}
      onFinish={onFinish}
      disabled={disabled}
      initialValues={{condition:[{relation: "and", rules: [{ name: '', age: 0 }]}]}}
    >
      {[
        {
          type: 'list',
          name: condition,
          componentProps: {
            showIcons: { showBottomAdd: false, showAdd: false, showRemove: false },
            onShowIcons: (): ReturnType<Required<YFormListComponentProps>['onShowIcons']> => ({
              showAdd: false,
              showRemove: false,
            }),
          },
          items: ({ index : index0, remove : remove0, add : add0 }): ReturnType<Extract<YFormListProps['items'], Function>> => {
            if(!ref.current){
              ref.current = add0;
            }
            const size  = form.getFieldsValue()?.[condition]?.[index0]?.[rules]?.length;
            return [
              {
                dataSource: [
                  <SwitchCardCol name={[index0, relation]} isShow={size > 1} disabled={disabled}>
                    <YForm.Items offset={100}>
                      {
                        [
                          { type: 'custom', noStyle: true, name: [index0, relation], componentProps:{style:{'display':'none'}} },
                          {
                            type: 'list',
                            name: [index0, rules] ,
                            componentProps: {
                              showIcons: { showBottomAdd: false, showAdd: false , showRemove: false}
                            },
                            items: ({ index : index1, add : add1, remove:remove1 }): ReturnType<Extract<YFormListProps['items'], Function>> => {
                              const length  = form.getFieldsValue()?.[condition]?.[index0]?.[rules].length;
                              updateCoordinates(index0, index1, length);
                              return [
                                {
                                  type: 'oneLine',
                                  componentProps: {  oneLineStyle: ['50%', 8, '50%'] },
                                  items: () => [
                                    { label: '姓名', type: 'input', name: [index1, 'name'] },
                                    { type: 'custom', children: <span /> },
                                    { label: '年龄', type: 'input', name: [index1, 'age'] },
                                    <Space className="padding-icons inline-icons" style={{ top: 5}}>
                                      <PlusCircleOutlined style={{ margin: '5px 0px 0px 8px', fontSize: 18, color: '#1890ff' }} onClick={() => {add1()}}/>
                                      <MinusCircleOutlined style={{ margin: '5px 8px 0 8px', fontSize: 18, color: '#999' }} onClick={() => {
                                        if(length === 1){
                                          remove0(index0);
                                          updateSize();
                                        }else{
                                          remove1(index1);
                                          updateCoordinates(index0, index1, length - 1);
                                        }
                                    }}/>
                                  </Space>
                                  ]
                                },
                              ];
                            },
                          }
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
            style: { width: '100%' },
            onClick: () => {
              if(ref.current){
                ref.current(defaultRuleValue);
                // form.setFields([
                //   {name:['condition', 'relation'], value: "and"},
                //   {name:['condition', 'rules', 'name'], value: ""},
                //   {name:['condition', 'rules', 'age'], value: 0}
                // ]);

                // form.setFields([{ name: 'id', value: '123', errors: ['error message'] }]);
                updateSize();
              }
            },
            children: '添加',
          },
        }
      ]}
  </YForm>
  </div> */}
      <Button onClick={onFinish}>submit</Button>
    </>
  );
};


