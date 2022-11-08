import { useRef } from "react";
import useUpdateEffect from "../lib/useUpdateEffect";

const usePollingPlugin = (fetchInstance, { pollingInterval }) => {
  const timerRef = useRef();
  const stopPolling = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
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
      timerRef.current = setTimeout(() => {
        fetchInstance.refresh();
      }, pollingInterval);
    },
    onCancel: () => {
      stopPolling();
    }
  };
};
