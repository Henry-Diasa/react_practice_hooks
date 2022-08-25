import { defineConfig, normalizePath } from "vite";
import viteEslint from "vite-plugin-eslint";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";
import autoprefixer from "autoprefixer";
import windi from "vite-plugin-windicss";
// import viteImagemin from "vite-plugin-imagemin";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
// 用 normalizePath 解决 window 下的路径问题
const variablePath = normalizePath(path.resolve("./src/variable.scss"));
const isProduction = process.env.NODE_ENV === "production";
// 填入项目的 CDN 域名地址
const CDN_URL = "xxxxxx";

const esbuildPatchPlugin = {
  name: "react-virtualized-patch",
  setup(build) {
    build.onLoad(
      {
        filter:
          /react-virtualized\/dist\/es\/WindowScroller\/utils\/onScroll.js$/
      },
      async (args) => {
        const text = await fs.promises.readFile(args.path, "utf8");

        // return {
        //   contents: text.replace(
        //     'import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";',
        //     ""
        //   )
        // };
      }
    );
  }
};
export default defineConfig({
  // 引入 path 包注意两点:
  // 1. 为避免类型报错，你需要通过 `pnpm i @types/node -D` 安装类型
  // 2. tsconfig.node.json 中设置 `allowSyntheticDefaultImports: true`，以允许下面的 default 导入方式
  // 修改index.html的默认路径
  // root: path.resolve(__dirname, "src"),
  optimizeDeps: {
    entries: ["**/*.vue"],
    include: [
      // 按需加载的依赖都可以声明到这个数组里 避免二次预构建
      "object-assign",
      // 间接依赖的声明语法，通过`>`分开, 如`a > b`表示 a 中依赖的 b
      "@loadable/component > hoist-non-react-statics"
    ],
    exclude: ["@loadable/component"], // 将某些依赖从预构建的过程中排除,注意它所依赖的包是否具有 ESM 格式
    esbuildOptions: {
      plugins: [
        // 加入 Esbuild 插件
        esbuildPatchPlugin
      ]
    }
  },
  base: isProduction ? CDN_URL : "/",
  build: {
    assetsInlineLimit: 8 * 1024 //svg 格式的文件不受这个临时值的影响，始终会打包成单独的文件
  },
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
    viteEslint(),
    svgr(),
    // viteImagemin({
    //   // 无损压缩配置，无损压缩下图片质量不会变差
    //   optipng: {
    //     optimizationLevel: 7
    //   },
    //   // 有损压缩配置，有损压缩下图片质量可能会变差
    //   pngquant: {
    //     quality: [0.8, 0.9]
    //   },
    //   // svg 优化
    //   svgo: {
    //     plugins: [
    //       {
    //         name: "removeViewBox"
    //       },
    //       {
    //         name: "removeEmptyAttrs",
    //         active: false
    //       }
    //     ]
    //   }
    // }),
    createSvgIconsPlugin({
      iconDirs: [path.join(__dirname, "src/assets")]
    })
  ],
  resolve: {
    alias: {
      "@assets": path.join(__dirname, "src/assets")
    }
  }
  // assetsInclude: [] 其它格式的静态资源
});
