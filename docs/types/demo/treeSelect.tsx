/* eslint-disable react-hooks/exhaustive-deps */
/**
 * title: 动态获取数据
 * desc: '`getOptions` 用于接口返回数据，并能根据表单当前值对数处理（尝试修改 optionName 字段值）'
 */

import { TreeNodeProps, TreeSelect } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { YForm } from 'yforms';
import { YFormInstance } from 'yforms/lib/YForm/Form';
import {data1, data2} from './json/treeData';
import useDeepCompareEffect from 'use-deep-compare-effect'

type TreeSelectProps = React.ComponentProps<typeof TreeSelect>;

type leaf  =  { level: number; value: string; title: string };

type stem = leaf & { children: leaf[]};

type branch = leaf & { children: stem[]};

type tree = branch[];

export interface TreeSelectSingleProps extends Omit<TreeSelectProps, 'value' | 'onChange'| 'treeData'> {
    value?: string;
    onChange?: (value: string) => void;
    treeData?: tree; // { level: number; value: string, title: string, children: { level: number; value: string, title: string, children: item[] } [] }[];
    createTreeNode?: (treeData: tree ) => TreeNodeProps[]
}

/**
 * 三级目录
 */
export const TreeSelectSingle = (props: TreeSelectSingleProps) => {
  const {value: selectedValue, onChange, treeData, createTreeNode:defaultCreateTreeNode , ...restProps } = props;
  const { TreeNode } = TreeSelect;
  const [value, setValue] = useState<string>(selectedValue);
  const [list, setlist] = useState<TreeSelectSingleProps['treeData']>(treeData);
  
  useDeepCompareEffect(
    () => {
      setlist(treeData);
      setValue('');
      onChange('');
    }, [list, treeData],
  )

  useEffect(() => {
    if(value !== selectedValue){
      setValue(selectedValue);
    }
  }, [selectedValue])

  const createTreeNode = (list: TreeSelectSingleProps['treeData']) => {
    if(defaultCreateTreeNode){
      return defaultCreateTreeNode(list);
    }
    const treeNodes: TreeNodeProps[] = [];
    list.forEach((v)=>{
      treeNodes.push(
        <TreeNode key={v.value} value={v.value} title={v.title} disabled>
          {
            v.children.map((c) =>  <TreeNode  key={c.value} value={c.value} title={c.title} disabled> 
              {
                c.children.map((g) => <TreeNode  key={g.value} value={g.value} title={g.title} />)
              }
            </TreeNode>)
          }
        </TreeNode>
      )
    })
    return treeNodes;
  }

  return (
    <TreeSelect
      value={value}
      onChange={onChange}
      showSearch
      allowClear
      treeDefaultExpandAll
      {...restProps}
    >
      {createTreeNode(list)}
    </TreeSelect>
  );
};

// TreeSelectSingle.defaultProps = {
//   value: '',
//   onChange: (v) => window.console.error('TreeSelectSingle.onChange : ', String(v)),
//   treeData : [],
// }

// export const TreeSelectSingleFrom: FC<TreeSelectSingleProps<number|string>> = ({value, onChange, treeData, createTreeNode}) => {
//   return <TreeSelectSingle treeData={treeData} value={value} onChange={onChange} createTreeNode={createTreeNode}/>
// };

const options = [
  { id: '1', name: '男' },
  { id: '2', name: '女' },
];

const Demo = () => {
  const [form]: [YFormInstance] = YForm.useForm();
  const [value, setvalue] = useState()
  const [treeData, setTreeData] = useState(data1);

  const onClick = () =>{
    const input = form.getFieldValue('input');
    setvalue(input);
  }

  const onChange = (checked) => {
    if(checked){
      setTreeData(data1);
    }else{
      setTreeData(data2);
    }
  }

  return (
    <>
    <TreeSelectSingle
        value={value}
        onChange={(v)=> window.console.log('---------------->', v)}
        placeholder="Please select"
        style={{ width: '100%' }}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }} 
        treeData={treeData} />
    <YForm form={form}>
      {[
        { type: 'input', label: 'input', name: 'input' },
        { type: 'select', label: 'select', name: 'list', componentProps: { options } },
        { type: 'radio', label: 'radio', name: 'list', componentProps: { options } },
        {
          type: 'checkboxGroup',
          label: 'checkboxGroup',
          name: 'list',
          componentProps: { options },
        },
        {
          type: 'switch',
          label: '切换',
          name: '开关',
          componentProps: { checkedChildren: '1', unCheckedChildren: '2' , onChange: onChange},
        },
        {
          type: 'button',
          componentProps: {
            children: '添加',
            type: 'primary', 
            style: { width: '100%' },
            onClick : ()=> onClick()
          }          
        },
      ]}
    </YForm>
    </>
  );
};

export default Demo;
