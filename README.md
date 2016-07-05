[![NPM version][npm-image]][npm-url] [![Gitter chat][gitter-image]][gitter-url] [![Downloads][downloads-image]][downloads-url]

[![NPM][nodei-image]][nodei-url]

build
[![Build Status][travis-image]][travis-url] [![Appveyor Status][appveyor-image]][appveyor-url]  [![Coverage Status][coveralls-image]][coveralls-url]

dependencies
[![Dependency Status][david-image]][david-url] [![devDependency Status][david-dev-image]][david-dev-url] [![peerDependency Status][david-peer-image]][david-peer-url]

donation
[![gratipay donate button][gratipay-image]][gratipay-url] [![Donate to sokra][donate-image]][donate-url]

[![BADGINATOR][badginator-image]][badginator-url]

基于webpack的前端集成开发环境和编译环境

### Introduction
* 由于react的流行，公司越来越多的项目都希望使用react来构建，但目前公司的前端工具FEKit不能支持react开发和编译
* 有些部门已经使用了react，但在实施过程中或多或少的遇到了一些问题，这些问题具有一些共性，其实可以使用统一的方案来解决
* 无线touch团队在过往的工作中在前端工程化和react方面积累了不少经验，愿意进行技术分享和全公司内推广
* 只关心通用的集成开发环境和编译过程，不关注前端架构

### Install
```sh
npm install
# 如果是在公司内网，使用下面的命令安装速度更快
# npm install --registry http://registry.npm.corp.qunar.com

# 启动开发模式
npm run serve

#open http://localhost:3001

# 编译工程
npm run build

# 编译并预览编译结果
npm run serve:dist
```

### Features
- [x]react支持
- [ ]HMR
- [x]动态加载
- [x]支持自定义打包规则
- [ ]yo-generator
- [ ]集成到QDR中，自动生产job，发布无障碍
- [ ]工程新增的node_modules也能顺利在QDR中发布
- [ ]urlrewrite
- [ ]支持SPA／多入口网站／React Native
- [ ]兼容fekit
- [x]支持多种资源的引入，如images、fonts、json
- [x]大size图片在css中引用hash自动更新
- [x]使用babel，支持ES6、ES7
- [x]统一的eslint语法检查
- [x]less、sass支持
- [x]css预编译
- [x]支持source map
- [x]支持资源hash rename
- [ ]预览编译后的内容
- [x]不同环境使用profiles文件
- [ ]redux-dev-tool
- [ ]支持多种模版
- [ ]自动抽取common.js
### Todo
- [ ]文档
- [ ]自动化生成scheme和job
- [ ]generator
- [ ]example
- [ ]unit test

### Others
```
# npm使用qunar源
npm install --registry http://registry.npm.corp.qunar.com
npm install --registry http://registry.npm.taobao.com
```
