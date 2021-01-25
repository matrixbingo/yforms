import React from 'react';
import { Radio as AntdRadio } from 'antd';
import { RadioGroupProps as AntdRadioGroupProps } from 'antd/lib/radio';
import { map } from 'lodash';
import { getFieldKeyValue } from '../utils';
import { OptionsBaeProps } from '.';

export interface RadioProps extends Omit<AntdRadioGroupProps, 'options'>, OptionsBaeProps {}

const InternalRadio: React.ForwardRefRenderFunction<HTMLDivElement, RadioProps> = (props, ref) => {
  const {
    postField = 'id',
    showField = 'name',
    renderOption,
    onAddProps,
    options,
    ...rest
  } = props;

  const _children = map(options, (item, index) => {
    const _postField = getFieldKeyValue(item, index, postField);
    const _showField = getFieldKeyValue(item, index, showField);
    const _props = onAddProps && onAddProps(item, index);
    return (
      <AntdRadio key={_postField} value={_postField} disabled={item.disabled} {..._props}>
        {renderOption ? renderOption(item) : _showField}
      </AntdRadio>
    );
  });

  return (
    <AntdRadio.Group {...rest} ref={ref}>
      {_children}
    </AntdRadio.Group>
  );
};

const Radio = React.forwardRef<HTMLDivElement, RadioProps>(InternalRadio);

export default Radio;
