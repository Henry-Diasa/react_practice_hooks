import { useEffect } from "react";

import useLatest from "./useLatest";

function useUnmount(fn) {
  const fnRef = useLatest(fn);
  useEffect(() => () => fnRef.current(), []);
}
export default useUnmount;
