import React, { useState } from "react";
import useLog, { LogContext } from "./index";
function Home() {
  const [dom, reportMessage] = useLog();
  return (
    <div>
      {/* 监听内部点击 */}
      <div ref={dom}>
        <button> 按钮 one (内部点击) </button>
        <button> 按钮 two (内部点击) </button>
        <button> 按钮 three (内部点击) </button>
      </div>
      {/* 外部点击 */}
      <button
        onClick={() => {
          console.log(reportMessage);
        }}
      >
        {" "}
        外部点击{" "}
      </button>
    </div>
  );
}
const Index = React.memo(Home); /*  阻断 useState 的更新效应  */
export default function Root() {
  const [value, setValue] = useState({});
  return (
    <LogContext.Provider value={value}>
      <Index />
      <button onClick={() => setValue({ name: "xx", author: "xx" })}>
        点击
      </button>
    </LogContext.Provider>
  );
}
