import { useEffect } from "react";
import { rootHistory } from "./Router";

export default function useListen(cb: (l: any) => void) {
  useEffect(() => {
    if (!rootHistory) return () => ({});
    /* 绑定路由事件监听器 */
    const unlisten = rootHistory.listen((location) => {
      cb && cb(location);
    });
    return function () {
      unlisten && unlisten();
    };
  }, []);
}
