/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Input, InputProps } from "antd"
import { useMount } from 'ahooks';

export interface InputFormProps extends Omit<InputProps, 'value' | 'onChange'> {
    value?: string;
    onChange?: (value: string) => void;
}

const InputForm = (props: InputFormProps) => {
    const {value: inputValue, onChange: inputOnChange, disabled, ...restProps } = props;
    const [value, setValue] = useState(inputValue);

    useMount(() => {
        if(disabled){
            window.console.log('useMount.disabled ---------------->', disabled);
            setValue('');
            inputOnChange('');
        }
    });

    useEffect(() => {
        window.console.log('inputValue, value ---------------->', inputValue, value);
        if(inputValue !== value){
            setValue(inputValue);
            inputOnChange(inputValue);
        }
    }, [inputValue]);

    const onChange = (e) => {
        const { value } = e.target;
        setValue(value);
        inputOnChange(value);

    }

    return <Input value={value} onChange={onChange} disabled={disabled} {...restProps}/>
}

export default InputForm;