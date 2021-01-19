import React from 'react';
import { find, forEach, get, isArray, isObject, merge, set, sortBy } from 'lodash';
import { FormatFieldsValue, FormProps, ItemsType } from './form';
import { FormItemProps } from 'antd/lib/form';

// 获取唯一 key
export const getOnlyKey = () => {
  const keyMap = new Set();
  return (index, pIndex, name) => {
    let _index = name ? name.toString() : index;
    let key = pIndex ? `${pIndex}_${_index}` : _index;
    if (keyMap.has(key)) {
      _index = `${_index}_${index}`;
      key = pIndex ? `${pIndex}_${_index}` : _index;
    }
    keyMap.add(key);
    return key;
  };
};

// 返回上一级 name 的数据
export const getParentNameData = (values: any, name: FormItemProps['name']) => {
  const _values = { ...values };
  const _name = isArray(name) ? name : [name];
  if (_name.length === 1) {
    return _values;
  }
  return get(_values, _name.slice(0, _name.length - 1));
};

// TODO 暂未使用
export const onFormatFieldsValue = (formatFieldsValue: FormatFieldsValue[]) => {
  return (list: FormatFieldsValue[]) => {
    const _formatFields = formatFieldsValue;
    forEach(list, (item) => {
      // 已存在不再注册
      if (!find(_formatFields, { name: item.name })) {
        _formatFields.push(item);
      }
    });
    return _formatFields;
  };
};

export const eachChildren = (props: FormProps) => {
  const { children, initialValues } = props;
  const formatValues = { ...initialValues };
  const list = [];
  const each = (children: FormProps['children']) => {
    forEach(isArray(children) ? children : [children], (item) => {
      if (isArray(item)) {
        return each(item);
      }
      if (React.isValidElement<Pick<FormProps, 'children'>>(item)) {
        if (item.props && item.props.children) {
          return each(isArray(item.props.children) ? item.props.children : [item.props.children]);
        }
      }
      if (isObject(item)) {
        const { name, format, initFormat } = item as ItemsType;
        if (initFormat) {
          // set(formatValues, name, initFormat(get(initialValues, name), initialValues));
        }
        if (format) {
          if (typeof format === 'function') {
            list.push({ name, format });
          } else {
            forEach(format, (item) => {
              const { name, format, removeField } = item;
              list.push({ name, format, removeField });
            });
          }
        }
      }
    });
  };
  each(children);
  // 根据 name 长度倒序排序，先格式化内层值，再格式化外层值
  const _list = sortBy(list, (item) => {
    if (isArray(item.name)) {
      return -item.name.length;
    }
    return -`${item.name}`.length;
  });

  return { formatValues, formatList: _list };
};

export function submitFormatValues(values: any, formatFieldsValue?: FormatFieldsValue[]) {
  const _values = merge({}, values);
  forEach(formatFieldsValue, (item) => {
    const { name, format } = item;
    const parentValue = getParentNameData(values, name);
    // 如果上一级是 undefined，则不处理该字段。（List add 会生成空对象）
    if (parentValue === undefined) return;
    if (name && format) {
      set(_values, name, format(get(values, name), values));
    }
  });
  return _values;
}

// 获取一行多组件的 width
export const oneLineItemStyle = (list?: (number | string)[]) => {
  if (!list || !Array.isArray(list)) return [];
  const _list: { display: string; width: string }[] = [];
  let width = 0;
  let count = 0;
  list.forEach((item) => {
    if (typeof item === 'number') {
      width += item;
    } else {
      count += 1;
    }
  });

  list.forEach((item) => {
    if (typeof item === 'number') {
      _list.push({ display: 'inline-block', width: `${item}px` });
    } else {
      _list.push({ display: 'inline-block', width: `calc(${item} - ${width / count}px)` });
    }
  });
  return _list;
};

export type stringAndFunc<T> = string | ((record: T, index: number) => React.ReactNode);

export function getFieldKeyValue<T>(record: T, index: number, field: stringAndFunc<T>) {
  const recordKey = typeof field === 'function' ? field(record, index) : get(record, field);
  return recordKey === undefined ? index : recordKey;
}
