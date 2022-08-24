import { defineConfig, normalizePath } from "vite";
import viteEslint from "vite-plugin-eslint";
import react from "@vitejs/plugin-react";
import path from "path";
import autoprefixer from "autoprefixer";
import windi from "vite-plugin-windicss";

// 用 normalizePath 解决 window 下的路径问题
const variablePath = normalizePath(path.resolve("./src/variable.scss"));
// https://vitejs.dev/config/
export default defineConfig({
  // 引入 path 包注意两点:
  // 1. 为避免类型报错，你需要通过 `pnpm i @types/node -D` 安装类型
  // 2. tsconfig.node.json 中设置 `allowSyntheticDefaultImports: true`，以允许下面的 default 导入方式
  // 修改index.html的默认路径
  // root: path.resolve(__dirname, "src"),
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData 的内容会在每个 scss 文件的开头自动注入
        additionalData: `@import "${variablePath}";`
      }
    },
    modules: {
      // 一般我们可以通过 generateScopedName 属性来对生成的类名进行自定义
      // 其中，name 表示当前文件名，local 表示类名
      generateScopedName: "[name]__[local]__[hash:base64:5]"
    },
    postcss: {
      plugins: [
        autoprefixer({
          // 指定目标浏览器
          overrideBrowserslist: ["Chrome > 40", "ff > 31", "ie 11"]
        })
      ]
    }
  },
  plugins: [
    react({
      babel: {
        plugins: [
          // 适配 styled-component
          "babel-plugin-styled-components",
          // 适配 emotion
          "@emotion/babel-plugin"
        ]
      },
      // 注意: 对于 emotion，需要单独加上这个配置
      // 通过 `@emotion/react` 包编译 emotion 中的特殊 jsx 语法
      jsxImportSource: "@emotion/react"
    }),
    windi(),
    viteEslint()
  ]
});
