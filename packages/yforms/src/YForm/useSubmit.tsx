import { useRef, useState } from 'react';
import { ParamsObjType } from './Form';

export interface YFormUseSubmitProps {}

export interface YFormUseSubmitReturnProps {
  submit: { forceUpdate?: (p: Omit<YFormUseSubmitReturnProps, 'submit'>) => void };
  disabled: boolean | undefined;
  params: ParamsObjType;
}

export default (): YFormUseSubmitReturnProps => {
  const [update, forceUpdate] = useState<Partial<Omit<YFormUseSubmitReturnProps, 'submit'>>>({});
  const thisRef = useRef<YFormUseSubmitReturnProps['submit']>({ forceUpdate });
  return { disabled: update.disabled, params: update.params || {}, submit: thisRef.current };
};
