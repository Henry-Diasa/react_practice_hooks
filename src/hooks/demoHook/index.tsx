import { useState } from "react";
export default function demoHook() {
  const [count] = useState(0);
  return <div>{count}</div>;
}
