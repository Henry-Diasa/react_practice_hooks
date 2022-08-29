import {
  useState,
  useEffect,
  createContext,
  useMemo,
  PropsWithChildren
} from "react";

import { BrowserHistory, createBrowserHistory as createHistory } from "history";

export const RouterContext = createContext({});

export let rootHistory: BrowserHistory;

export default function Router(props: PropsWithChildren) {
  // 缓存history
  const history = useMemo(() => {
    rootHistory = createHistory();
    return rootHistory;
  }, []);
  const [location, setLocation] = useState(history.location);

  useEffect(() => {
    const unListen = history.listen((loc) => {
      setLocation(loc);
    });
    return function () {
      unListen && unListen();
    };
  }, []);
  return (
    <RouterContext.Provider
      value={{
        location,
        history,
        match: {
          path: "/",
          url: "/",
          params: {},
          isExact: location.pathname === "/"
        }
      }}
    >
      {props.children}
    </RouterContext.Provider>
  );
}
