import { useEffect, useRef } from "react";
import useUnmount from "../lib/useUnmount";
import subscribeFocus from "../lib/subscribeFocus";
function limit(fn, timespan) {
  let pending = false;
  return (...args) => {
    if (pending) return;
    pending = true;
    fn(...args);
    setTimeout(() => {
      pending = false;
    }, timespan);
  };
}
const useRefreshOnWindowFocusPlugin = (
  fetchInstance,
  { refreshOnWindowFocus, focusTimespan = 5000 }
) => {
  const unsubscribeRef = useRef();
  const stopSubscribe = () => {
    unsubscribeRef.current?.();
  };
  useEffect(() => {
    if (refreshOnWindowFocus) {
      const limitRefresh = limit(
        fetchInstance.refresh.bind(fetchInstance),
        focusTimespan
      );
      unsubscribeRef.current = subscribeFocus(() => limitRefresh());
    }
    return () => {
      stopSubscribe();
    };
  }, [refreshOnWindowFocus, focusTimespan]);
  useUnmount(() => {
    stopSubscribe();
  });
  return {};
};

export default useRefreshOnWindowFocusPlugin;
