# 改第三方库
```
// 要改动的包在 package.json 中必须声明确定的版本，不能有~或者^的前缀。
pnpm i @milahu/patch-package -D

// 我们进入第三方库的代码中进行修改
npx patch-package react-virtualized

// package.json
{
  "scripts": {
    // 省略其它 script
    "postinstall": "patch-package"
  }
}
```