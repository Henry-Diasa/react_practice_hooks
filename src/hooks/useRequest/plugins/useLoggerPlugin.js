const useLoggerPlugin = (fetchInstance, { name }) => {
  return {
    onBefore: () => {
      console.log(name, "onBefore");
    },
    onRequest: () => {
      // 钩子可以改变请求
      console.log(name, "onRequest");
      return { servicePromise: Promise.resolve("onRequest返回值") };
    },
    onSuccess: () => {
      console.log(
        name,
        "onSuccess",
        fetchInstance.state.name,
        fetchInstance.state.id
      );
    },
    onError: () => {
      console.log(name, "onError");
    },
    onFinally: () => {
      console.log(name, "onFinally");
    },
    onCancel: () => {
      console.log(name, "onCancel");
    },
    onMutate: () => {
      console.log(name, "onMutate");
    }
  };
};

useLoggerPlugin.onInit = ({ name }) => {
  console.log(name, "onInit");
  return { name };
};

export default useLoggerPlugin;
