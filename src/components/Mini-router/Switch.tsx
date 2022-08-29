import React, { useContext } from "react";
import { matchPath } from "react-router-dom";
import { RouterContext } from "./Router";
export default function Switch(props: any) {
  const context = useContext(RouterContext);
  const location = props.location || context.location;
  let children, match;
  React.Children.forEach(props.children, (child) => {
    if (!match && React.isValidElement(child)) {
      const path = (child.props as any).path; //获取Route上的path
      children = child; /* 匹配的children */
      match = path
        ? matchPath({ ...(child.props as any) }, location.pathname)
        : context.match; /* 计算是否匹配 */
    }
  });
  /* 克隆一份Children，混入 computedMatch 并渲染。 */
  return match
    ? React.cloneElement(children, { location, computedMatch: match })
    : null;
}
