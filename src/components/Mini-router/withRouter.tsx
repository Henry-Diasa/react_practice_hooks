import { useContext } from "react";
import hoistStatics from "hoist-non-react-statics";
import { RouterContext } from "./Router";

export default function withRouter(Component) {
  const WrapComponent = (props: any) => {
    const { wrappedComponentRef, ...remainingProps } = props;
    const context = useContext(RouterContext);
    return (
      <Component {...remainingProps} ref={wrappedComponentRef} {...context} />
    );
  };
  // 继承静态属性
  return hoistStatics(WrapComponent, Component);
}
