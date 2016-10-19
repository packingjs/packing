# Packing

>基于webpack的前端集成开发环境和编译环境

[![NPM](https://nodei.co/npm/packing.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/packing/)

[![Build Status](https://travis-ci.org/zhongzhi107/packing.svg?branch=master)](https://travis-ci.org/zhongzhi107/packing)
[![Build status](https://ci.appveyor.com/api/projects/status/52hgp0fv4bmjjq25?svg=true)](https://ci.appveyor.com/project/zhongzhi107/packing)
[![Coverage Status](https://coveralls.io/repos/github/zhongzhi107/packing/badge.svg?branch=master)](https://coveralls.io/github/zhongzhi107/packing?branch=master)
[![Dependency Status](https://david-dm.org/zhongzhi107/packing.svg)](https://david-dm.org/zhongzhi107/packing)
[![devDependency Status](https://david-dm.org/zhongzhi107/packing/dev-status.svg)](https://david-dm.org/zhongzhi107/packing#info=devDependencies)
[![Inline docs](http://inch-ci.org/github/zhongzhi107/packing.svg?branch=master)](http://inch-ci.org/github/zhongzhi107/packing)

## Introduction
* 由于react的流行，公司越来越多的项目都希望使用react来构建，但目前公司的前端工具FEKit不能很好的支持react开发和编译
* 有些部门已经使用了react，但在实施过程中或多或少的遇到了一些问题，这些问题具有一些共性，其实可以使用统一的方案来解决
* 无线touch团队在过往的工作中在前端工程化和react方面积累了不少经验，愿意进行技术分享和全公司内推广
* 只关心通用的集成开发环境和编译过程，不关心网站的架构和目录结构
* 部分灵感来源于grunt和Yeoman

## Install

1. 安装`yo`和`generator-packing`
  ```
  npm install -g yo generator-packing
  ```

2. 生成你的网站
  ```
  yo packing
  ```

3. 启动开发模式
  ```
  npm run serve
  ```

4. 在浏览器中预览网站 `http://localhost:8081`

5. 其他命令
  ```sh
  # 编译工程
  npm run build

  # 编译并预览编译结果，端口8080
  npm run serve:dist

  # 禁用启动时自动打开浏览器功能
  DISABLE_OPEN_BROWSER=true npm run serve
  ```

## Features
- [x]react支持
- [x]HMR
- [x]动态加载
- [x]支持自定义打包规则和指定common.js
- [x]yo-generator
- [x]工程新增的node_modules也能顺利在QDR中发布
- [x]urlrewrite/自定义路由规则
- [x]支持SPA／多入口网站／React Native
- [x]支持多种资源的引入，如images、fonts、json
- [x]大size图片在css中引用hash自动更新
- [x]使用babel，支持ES6/7
- [x]统一的eslint语法检查
- [x]less、sass支持
- [x]使用postcss预编译
- [x]支持source map
- [x]支持资源hash rename
- [x]预览编译后的内容
- [x]不同环境使用profiles文件
- [x]redux-devtools
- [x]支持多种模版
  - html
  - [pug](https://pugjs.org)
  - [ejs](https://github.com/tj/ejs)
  - [handlebars](http://handlebarsjs.com/)
  - [smarty](http://www.smarty.net/)
  - [velocity](http://velocity.apache.org/)
  - [artTemplate](https://github.com/aui/artTemplate)

## Todo
- [ ]文档
- [ ]页面初始化数据支持代理服务器功能
- [ ]性能：不常修改的common包支持编译结果缓存
- [ ]example
  - [ ]base
  - [ ]custom template
  - [ ]react+redus+redux-devtools
  - [ ]commonChunk
  - [ ]url rules
  - [ ]data mock
  - [ ]profiles
- [ ]unit test

## Directory

```
.
├── /assets/                            # 静态资源，如图片、字体
├── /config/                            # webpack配置文件
│   ├── /packing.js                     # 和构建工具相关的配置
│   ├── /webpack.build.babel.js         # webpack编译环境配置文件
│   └── /webpack.serve:dist.js          # webpack预览编译后结果的配置文件
├── /mock/                              # 模拟数据
│   ├── /api/                           # API接口类型模拟数据
│   └── /pages/                         # 页面初始化类型模拟数据
├── /prd/                               # 项目编译输出目录
├── /src/                               # 项目源码目录
│   ├── /entries/                       # webpack打包入口js
│   ├── /profiles/                      # 类似maven的profiles，设置不同环境下的配置
│   └── /templates/                     # 后端模版，如jade、smarty
├── /tools/                             # packing脚本
│   ├── /serve.js                       # serve脚本
│   └── /serve:dist.js                  # serve:dist脚本
├── .babelrc                            # babel配置
├── .editorconfig                       # 代码编辑器配置
├── .eslintrc                           # eslint配置
├── package.json
├── pom.xml                             # maven配置
└── README.md                   
```

## 约定
* 网页模版中对静态资源引用时使用绝对路径，如 `<script src='/logo/qunar.png'>`
* css中对静态资源引用时使用波浪线`~`开头相对路径，如 `background:url(~/logo.png)`

## 使用镜像源安装npm
```
# npm使用qunar源
npm install --registry http://registry.npm.corp.qunar.com --disturl=https://npm.taobao.org/dist --sass-binary-site=http://npm.taobao.org/mirrors/node-sass

# 淘宝源
npm install --registry https://registry.npm.taobao.org

# 只安装dependencies，不安装devDependencies，适用于QDR编译机
npm install --registry http://registry.npm.corp.qunar.com --production
```

## 常见问题

### 如何配置和线上环境一样的路由
路由规则修改后需要重启`npm run serve`

### eslint错误太多了
根据团队的实际代码风格，修改 `.eslintrc`

### js文件中如何使用图片、字体等静态资源
假设文件目录结构如下：
```
├── /hotel/
│   └── /entries/
│       └── /index.js
└── /assets/
    └── /images/
        └── /logo.png

```
有两种方式能将静态资源引入JavaScript中：

1. 使用webpack的require机制（推荐）
  require或import时使用静态资源相对路径，有两种相对路径可用：
  - 静态文件相对于当前JavaScript文件的相对路径

    ```js
    // index.js
    import logo from '../../assets/images/logo.png';
    ```
    当文件目录层级比较深时，这种方式书写较费劲
  - 静态文件相对于`assets`的相对路径

    ```js
    // index.js
    import logo from 'images/logo.png';
    ```
    这种方式比较简洁
    无论使用上述哪种方式引入的静态资源，使用时都必须使用绝对路径

    ```js
    // index.js
    import logo from '../../assets/images/logo.png';
    // import logo from 'images/logo.png';
    var a = new Image();
    a.src = `/${logo}`;
  ```

2. 手动拼资源的URL地址，获取到静态资源的uri地址 `process.env.CDN_ROOT`，从而手工拼接url，这种方式引入的静态资源不会做md5

  ```js
  // index.js
  var a = new Image();
  a.src = process.env.CDN_ROOT + '/images/logo.png';
  ```


### webpackJsonp is not defined
可能配置了common chunks，公共文件打到了vendor.js，需要在页面引用vendor.js，
```html
<script src="/vendor.js"></script>
```
如果vendor.js引用了css，页面还需要引用vendor.css
```html
<link href="/vendor.css" media="all" rel="stylesheet" />
```

### 网页需要引入一个less文件，但这个网页没有js文件，我应该如何把这个less编译成css
在 config/packing.js 的 `entries` 添加这个less文件，如
```js
entries: {
  abc: './src/entries/abc.less'
  // 需要输出到不同路径的话可以随意修改key值
  // 'test/abc': './src/entries/abc.less'
}
```
编译时会把 `abc.less` 编译成 `prd/css/abc-xxxxxxxx.css`，同时html中的引用也会自动更新

```html
<!--编译前html代码-->
<link href="/abc.css" rel="stylesheet" />
```

```html
<!--编译后html代码-->
<link href="/abc-xxxxxxxx.css" rel="stylesheet" />
```

### 如何模拟数据

### 本地编译正常，在编译服务器上发布时却提示找不到某些依赖包
本地开发时用的npm安装命令是 `npm install` ，它会`devDependencies`和`dependencies`包含的所有包，为了减少不必要的包安装、提高安装速度，在编译服务器上用的npm安装命令是 `npm install --production`，它只会安装`dependencies`下的包。出现这种情况是因为包的位置摆放错误，你需要把在编译服务器上提示找不到的这些包从`devDependencies`移动到`dependencies`下。

### schema和job参数怎么配置
```
fe.xxx.build_method=node
fe.xxx.build_command:
```
