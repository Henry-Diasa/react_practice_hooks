// 是 useMemo 或 useRef的替代品。换言之，useCreation这个钩子增强了 useMemo 和 useRef，让这个钩子可以替换这两个钩子

import { useRef } from "react";
import type { DependencyList } from "react";
// 判断两个依赖是否相等
const depsAreSome = (
  oldDeps: DependencyList,
  deps: DependencyList
): boolean => {
  if (oldDeps === deps) return true;
  for (let i = 0; i < oldDeps.length; i++) {
    if (!Object.is(oldDeps[i], deps[i])) return false;
  }
  return true;
};

const useCreation = <T>(fn: () => T, deps: DependencyList) => {
  const { current } = useRef({
    deps,
    obj: undefined as undefined | T,
    initialized: false
  });
  if (current.initialized === false || !depsAreSome(current.deps, deps)) {
    current.deps = deps;
    current.obj = fn();
    current.initialized = true;
  }

  return current.obj as T;
};

export default useCreation;
