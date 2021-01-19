import React, { useContext } from 'react';
import { Form } from 'antd';
import { concat, forEach, get } from 'lodash';
import { FormItemProps as AntdFormItemProps } from 'antd/lib/form';

import { FormItemsTypeProps, ItemsType } from './form';
import { FormContext, FormItemContext, FormListContent } from './context';

export interface FormItemProps<Values = any> extends AntdFormItemProps<Values> {
  isShow?: FormItemsTypeProps<Values>['isShow'];
}

function Item<Values = any>(props: FormItemProps<Values> & ItemsType<Values>) {
  const { children, componentProps, format, initFormat, isShow, component, type, ...rest } = props;

  const { name, shouldUpdate } = rest;
  const formProps = useContext(FormContext);
  const { itemsType, onInitFormat, onFormat } = formProps;
  const listContext = useContext(FormListContent);
  const { prefixName } = listContext;

  const allName = prefixName ? concat(prefixName, name) : name;

  if (initFormat) {
    onInitFormat({ name: allName, format: initFormat });
  }
  if (format) {
    if (typeof format === 'function') {
      onFormat({ name: allName, format });
    } else {
      forEach(format, (item) => {
        const { name, format, removeField } = item;
        const _name = prefixName ? concat(prefixName, name) : name;
        onFormat({ name: _name, format, removeField });
      });
    }
  }

  // 根据类型解析渲染组件
  const typeProps = get(itemsType, type);

  const dom = (
    <FormItemContext.Provider value={{ name }}>
      <Form.Item {...rest}>
        {typeProps
          ? React.cloneElement(component || typeProps.component, componentProps)
          : children}
      </Form.Item>
    </FormItemContext.Provider>
  );

  // isShow 判断
  if ('isShow' in props) {
    if (!isShow) return null;
    if (typeof isShow === 'function') {
      return (
        <Form.Item noStyle shouldUpdate={shouldUpdate}>
          {(form) => isShow(form.getFieldsValue(true)) && dom}
        </Form.Item>
      );
    }
  }

  return dom;
}

export default Item;
