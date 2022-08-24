import { useEffect } from "react";
import styles from "./index.module.scss";
import { devDependencies } from "../../../package.json";

import logoSrc from "@assets/vite.jpg";
import { ReactComponent as ReactLogo } from "@assets/react.svg";
// worker
import Worker from "./example.js?worker";
// 1. 初始化 Worker 实例
const worker = new Worker();
// 2. 主线程监听 worker 的信息
worker.addEventListener("message", (e) => {
  // console.log(e);
});
export function Header() {
  useEffect(() => {
    const img = document.getElementById("logo") as HTMLImageElement;
    img.src = logoSrc;
  }, []);
  return (
    <div>
      <p className={styles.header}>this is header</p>
      <div className="p-20px text-center flex-c">
        <h1 className="font-bold text-2xl mb-2">
          vite version: {devDependencies.vite} 123
        </h1>

        <button
          bg="blue-400 hover:blue-500 dark:blue-500 dark:hover:blue-600"
          text="sm white"
          font="mono light"
          p="y-2 x-4"
          border="2 rounded blue-200"
        >
          Button
        </button>
      </div>
      <img src={logoSrc} className="m-auto mb-4" />
      <img id="logo" className="m-auto mb-4" />
      <ReactLogo />
    </div>
  );
}
