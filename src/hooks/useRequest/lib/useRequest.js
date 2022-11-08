import useLatest from "./useLatest";
import useUpdate from "./useUpdate";
import useCreation from "./useCreation";
import useMount from "./useMount";
import Fetch from "./Fetch";
import useMemoizedFn from "./useMemoizedFn";
import useUnmount from "./useUnmount";
// 插件
import useLoggerPlugin from "../plugins/useLoggerPlugin";
import useLoadingDelayPlugin from "../plugins/useLoadingDelayPlugin";
import usePollingPlugin from "../plugins/usePollingPlugin";
function useRequest(service, options = {}, plugins = []) {
  plugins = [
    ...plugins,
    useLoggerPlugin,
    useLoadingDelayPlugin,
    usePollingPlugin
  ];
  const { manual = false, ...rest } = options;
  const fetchOptions = { manual, ...rest };
  const serviceRef = useLatest(service);
  const update = useUpdate();

  const fetchInstance = useCreation(() => {
    const initState = plugins
      .map((p) => p?.onInit?.(fetchOptions))
      .filter(Boolean);
    return new Fetch(
      serviceRef,
      fetchOptions,
      update,
      Object.assign({}, ...initState)
    );
  }, []);
  // [{onBefore, onRequest}]
  fetchInstance.pluginImpls = plugins.map((p) =>
    p(fetchInstance, fetchOptions)
  );
  useMount(() => {
    if (!manual) {
      const params = fetchInstance.state.params || options.defaultParams || [];
      fetchInstance.run(...params);
    }
  });
  useUnmount(() => {
    fetchInstance.cancel();
  });
  return {
    loading: fetchInstance.state.loading,
    data: fetchInstance.state.data,
    error: fetchInstance.state.error,
    run: useMemoizedFn(fetchInstance.run.bind(fetchInstance)),
    runAsync: useMemoizedFn(fetchInstance.runAsync.bind(fetchInstance)),
    refresh: useMemoizedFn(fetchInstance.refresh.bind(fetchInstance)),
    refreshAsync: useMemoizedFn(fetchInstance.refreshAsync.bind(fetchInstance)),
    mutate: useMemoizedFn(fetchInstance.mutate.bind(fetchInstance)),
    cancel: useMemoizedFn(fetchInstance.cancel.bind(fetchInstance))
  };
}

export default useRequest;
