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
- [x]urlrewrite
- [ ]支持SPA／多入口网站／React Native
- [x]支持多种资源的引入，如images、fonts、json
- [x]大size图片在css中引用hash自动更新
- [x]使用babel，支持ES6、ES7
- [x]统一的eslint语法检查
- [x]less、sass支持
- [x]css预编译
- [x]支持source map
- [x]支持资源hash rename
- [x]预览编译后的内容
- [x]不同环境使用profiles文件
- [ ]redux-dev-tool
- [x]同时支持多种模版[html/jade/ejs/handlebars/smarty/velocity/md]
- [x]自动抽取common.js
- [ ]rev-webpack-plugin增加无引用文件删除的参数
- [ ]新版本升级提示

### Todo
- [ ]文档
- [ ]自动化生成scheme和job
- [ ]generator
- [ ]example
- [ ]unit test

### Directory

```
.
├── /config/                            # webpack配置文件
│   ├── /packing.js                     # 和构建工具相关的配置
│   ├── /webpack.build.babel.js         # webpack编译环境配置文件
│   ├── /webpack.serve.babel.js         # webpack开发环境配置文件
│   └── /webpack.serve:dist.js          # webpack预览编译后结果的配置文件
├── /mock/                              # 模拟数据
│   ├── /api/                           # API接口类型模拟数据
│   └── /pages                          # 页面初始化类型模拟数据
├── /prd/                               # 项目编译输出目录
├── /src/                               # 项目源码目录
│   ├── /config/                        # 和网站运行相关的配置，如dev/beta环境差异变量
│   ├── /entries/                       # webpack打包入口js
│   └── /templates/                     # 后端模版，如jade、smarty
├── /static/                            # 静态资源，如图片、字体
├── /tools/                             # webpack配置文件
│   ├── /serve.js                       # serve脚本
│   └── /serve:dist.js                  # serve:dist脚本
│── .babelrc                            # babel配置
│── .editorconfig                       # 代码编辑器配置
│── .eslintrc                           # eslint配置
│── package.json
│── pom.xml                             # maven配置
└── README.md                   
```

### Others
```
# npm使用qunar源
npm install --registry http://registry.npm.corp.qunar.com
npm install --registry http://registry.npm.taobao.com

# 只安装dependencies，不安装devDependencies，适用于QDR编译机
npm install --registry http://registry.npm.corp.qunar.com --production
```

### Yeoman generator
```
npm install -g yo generator-packing
yo packing
```

### 常见问题

#### 迁移已有的项目

#### 新建项目

#### 如何配置和线上环境一样的路由

#### 如何模拟数据

#### 如何让文件在编译过程不做reversion

#### eslint错误太多了
根据团队的实际代码风格，修改 `.eslintrc`

#### schema怎么配置
