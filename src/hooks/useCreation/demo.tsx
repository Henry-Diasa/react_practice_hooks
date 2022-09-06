import { useState } from "react";
import { Button } from "antd";
import useCreation from ".";

const Index = () => {
  const [, setFlag] = useState<boolean>(false);
  const getNowData = () => {
    return Math.random();
  };
  const nowData = useCreation(() => getNowData(), []);
  return (
    <div>
      <div>正常的函数：{getNowData()}</div>
      <div>useCreation包裹后： {nowData}</div>
      <Button onClick={() => setFlag((v) => !v)}>渲染</Button>
    </div>
  );
};

export default Index;
