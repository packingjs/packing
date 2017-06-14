# 从 v1 升级到 v2

支持 yarn 是 v2 的一个重要功能。

由于 yarn 对多级依赖 node_modules 中 `bin` 文件的处理和 npm 存在差异 [#1210](https://github.com/yarnpkg/yarn/pull/1210)，所以在 v2 版本中将以下几个依赖包从 packing 中移除了

- eslint
- better-npm-run

取而代之的是在项目中添加上面的这几个依赖

```
yarn add eslint better-npm-run
```

另外，以后用 generator-packing 初始化的工程将 **不再包含** `better-npm-run`
