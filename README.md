# Packing

>基于webpack的前端集成开发环境和编译环境

[![NPM](https://nodei.co/npm/packing.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/packing/)
[![Build Status](https://travis-ci.org/qails/qails.svg?branch=master)](https://travis-ci.org/packingjs/packing)
[![Dependency Status](https://david-dm.org/packingjs/packing.svg)](https://david-dm.org/packingjs/packing)
[![devDependency Status](https://david-dm.org/packingjs/packing/dev-status.svg)](https://david-dm.org/packingjs/packing#info=devDependencies)

## 特点
* 不依赖 host 文件，根据环境自动切换资源路径
* 节约开发服务器，多分支开发部署到同一台服务器不会相互覆盖
* 提供资源包体积分析报告

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

  # 不同环境下编译工程
  npm run build:dev
  npm run build:beta
  npm run build:prod

  # 编译并预览编译结果，端口8080
  npm run serve:dist

  # 启动不带webpack-dashboard的开发环境
  npm run serve:normal

  # 启动时自动打开浏览器功能
  npm run serve -- --open
  npm run serve -- -o

  # 启动时强制清除DLL缓存功能
  npm run serve -- --clean
  npm run serve -- -c
  ```

## Directory

```
.
├── /bin/
│   ├── /packing-build.js
│   ├── /packing-serve:dist.js
│   ├── /packing-serve.js
│   └── /packing.js
├── /config/
│   ├── /packing.js              # 构建工具相关配置
│   ├── /webpack.build.babel.js  # webpack编译环境配置文件
│   ├── /webpack.dll.babel.js    # DllPlugin插件编译配置
│   └── /webpack.serve:dist.js   # webpack预览编译后结果的配置文件
├── /examples/                   # 例子
├── /src/                        # 项目代码容器目录
├── /util/                       # util
├── .babelrc                     # babel配置
├── .eslintrc.js                 # eslint配置
├── package.json
└── README.md                   
```

## 例子
- [build-library](examples/build-library)<br/>演示输出一个工具类库
- [common-chunks](examples/common-chunks)<br/>演示将共用代码打包成common包
- [custom-page-master](examples/custom-page-master)<br/>演示自定义网页母模版
- [custom-page-title](examples/custom-page-title)<br/>演示自定义网页标题、关键字、网页描述等信息
- [mock-ajax](examples/mock-ajax)<br/>演示模拟异步请求
- [mock-graphql](examples/mock-graphql)<br/>演示模拟GraphQL服务
- [mock-page-context-global](examples/mock-page-context-global)<br/>演示模拟公用的模版数据
- [mock-page-context-promise](examples/mock-page-context-promise)<br/>演示模拟从其他服务获取模版数据
- [remove-default-plugin](examples/remove-default-plugin)<br/>演示删除packing默认配置
