import { forwardRef, useImperativeHandle } from "react";
import FormContext from "./FormContext";
import useForm from "./useForm";
function Form(
  { form, onFinish, onFinishFailed, initialValues, children },
  ref
) {
  const formInstance = useForm(form, initialValues);
  const { setCallback, dispatch, ...providerFormInstance } = formInstance;
  setCallback({
    onFinish,
    onFinishFailed
  });

  useImperativeHandle(ref, () => providerFormInstance, []);
  const RenderChildren = (
    <FormContext.Provider value={formInstance}>{children}</FormContext.Provider>
  );

  return (
    <form
      onReset={(e) => {
        e.preventDefault();
        e.stopPropagation();
        formInstance.resetFields();
      }}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        formInstance.submit();
      }}
    >
      {RenderChildren}
    </form>
  );
}

export default forwardRef(Form);
