import { defineConfig } from "vite-plugin-windicss";

export default defineConfig({
  // 开启 attributify 可以用 props 的方式去定义样式属性
  attributify: true,
  shortcuts: {
    "flex-c": "flex justify-center items-center"
  }
});
