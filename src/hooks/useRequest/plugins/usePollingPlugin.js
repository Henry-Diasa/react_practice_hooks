import { useRef } from "react";
import useUpdateEffect from "../lib/useUpdateEffect";
import isDocumentVisible from "../lib/isDocumentVisible";
import subscribeReVisible from "../lib/subscribeReVisible";

const usePollingPlugin = (
  fetchInstance,
  { pollingInterval, pollingWhenHidden = true }
) => {
  const timerRef = useRef();
  const unsubscribeRef = useRef();
  const stopPolling = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    unsubscribeRef.current?.();
  };
  useUpdateEffect(() => {
    if (!pollingInterval) {
      stopPolling();
    }
  }, [pollingInterval]);
  if (!pollingInterval) return {};
  return {
    onBefore: () => {
      stopPolling();
    },
    onFinally: () => {
      // 文档不可见并且不轮询
      if (!pollingWhenHidden && !isDocumentVisible()) {
        unsubscribeRef.current = subscribeReVisible(() => {
          fetchInstance.refresh();
        });
        return;
      }
      timerRef.current = setTimeout(() => {
        fetchInstance.refresh();
      }, pollingInterval);
    },
    onCancel: () => {
      stopPolling();
    }
  };
};

export default usePollingPlugin;
