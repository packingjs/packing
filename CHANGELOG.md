# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [6.3.0](https://github.com/packingjs/packing/compare/v6.2.0...v6.3.0) (2020-04-10)


### Features

* 使用 webpack-bundle-analyzer 代替 webpack-visualizer-plugin ([63c5ae8](https://github.com/packingjs/packing/commit/63c5ae83332e2633bfa6a46fb2d9f4401bab44fd))

## [6.2.0](https://github.com/packingjs/packing/compare/v6.1.5...v6.2.0) (2020-04-09)


### Features

* 支持只编译部分页面，参数 `partialCompile.enabled` 和 `partialCompile.whitelist` ([f8a9f2b](https://github.com/packingjs/packing/commit/f8a9f2b586f2d87653b0058971cf0e69fe56fdf4))

### [6.1.5](https://github.com/packingjs/packing/compare/v6.1.4...v6.1.5) (2020-03-12)


### Bug Fixes

* 修复 entries 错误 ([8696425](https://github.com/packingjs/packing/commit/8696425c0b2e848f7d955338f572eedd39ae7ea4))

### [6.1.4](https://github.com/packingjs/packing/compare/v6.1.3...v6.1.4) (2020-03-12)


### Bug Fixes

* 修复 entries 匹配无效的问题 ([927f569](https://github.com/packingjs/packing/commit/927f5696218aa53ab6f50fee1a73f4773c6edfc3))

### [6.1.3](https://github.com/packingjs/packing/compare/v6.1.2...v6.1.3) (2020-03-12)

### [6.1.2](https://github.com/packingjs/packing/compare/v6.1.1...v6.1.2) (2020-02-11)

### [6.1.1](https://github.com/packingjs/packing/compare/v6.1.0...v6.1.1) (2020-02-11)


### Bug Fixes

* 修复entry.settings.tsx导致页面出错的问题 ([0b76b6f](https://github.com/packingjs/packing/commit/0b76b6f986ddc32ada62948142a6de52e657e88b))

## [6.1.0](https://github.com/packingjs/packing/compare/v6.0.0...v6.1.0) (2020-02-08)


### Features

* 增加 core-js@3.x ([9387fa0](https://github.com/packingjs/packing/commit/9387fa0245ff2f5e6a72f4ae5228649f5ad86236))

## [6.0.0](https://github.com/packingjs/packing/compare/v5.3.0...v6.0.0) (2019-10-30)


### Features

* 用 postcss stylelint 插件方式代替 stylelint-webpack-plugin ([e30d6c5](https://github.com/packingjs/packing/commit/e30d6c5347a27382ca1b3095eb5e84be6113349e))

## [5.3.0](https://github.com/packingjs/packing/compare/v5.1.0...v5.3.0) (2019-10-30)


### Features

* 升级 css-loader@3.2.0 ([d8d8a7d](https://github.com/packingjs/packing/commit/d8d8a7d8ea0ea3f902ecb38d7e23b8ca5c885d18))
* 升级依赖包 ([629f853](https://github.com/packingjs/packing/commit/629f853de5e8c487efdc5771456eb140742cc880))
* 增加 typescript 支持 ([266473d](https://github.com/packingjs/packing/commit/266473dbccf6c27567ab0fd1fb4e7cf75bf11600))

## [5.1.0](https://github.com/packingjs/packing/compare/v5.0.0...v5.1.0) (2019-06-10)


### Features

* 升级所有依赖包到最新版本 ([602c4ba](https://github.com/packingjs/packing/commit/602c4ba))
* 增加了 `stylelint` 参数 `allowEmptyInput = true`，避免部分不使用样式文件(css/less/scss)的工程报错。([10ed562](https://github.com/packingjs/packing/commit/10ed562))



## [5.0.0](https://github.com/packingjs/packing/compare/v4.0.5...v5.0.0) (2019-06-09)


### BREAKING CHANGES

*  `css-loader@>1.0` 内置不支持 css 压缩，需要引入 `postcss-nano` 来做压缩
  * 删除 `cssLoaderOptions.minimize. minifyFontValues = false `
  * CSS压缩功能失效，需要使用postcss-nano来压缩 ([3f90f18](https://github.com/packingjs/packing/commit/3f90f18))，在 `config/postcss.config.js` 增加 nano 配置：
    ```js
    plugins: {
      nano: process.env.NODE_ENV === 'local' ? false : {}
    }
    ```

### Bug Fixes

* 修复 open 包存在的安全漏洞 ([44026f0](https://github.com/packingjs/packing/commit/44026f0))


### Features

* css-loader@^2.1.1



<a name="4.0.5"></a>
## [4.0.5](https://github.com/packingjs/packing/compare/v4.0.4...v4.0.5) (2019-06-09)

### BREAK CHANGES:
* `clean-webpack-plugin` 从 3.0 起使用语法有变化，如果在工程中有修改 `config/webpack.serve.babel.js` 和 `config/webpack.build.babel.js` 请注意语法的变化。
  ```js
  // < 3.0
  import CleanWebpackPlugin from 'clean-webpack-plugin';

  // >= 3.0
  import { CleanWebpackPlugin } from 'clean-webpack-plugin';
  ```

### Features

* 升级依赖包
  * clean-webpack-plugin@^3.0.0
  * dotenv@^8.0.0
  * import-fresh@^3.0.0
  * mini-css-extract-plugin@^0.7.0
  * open@^6.3.0
  * url-loader@^2.0.0
  * webpack-pwa-manifest@^4.0.0

<a name="4.0.4"></a>
## [4.0.4](https://github.com/packingjs/packing/compare/v4.0.3...v4.0.4) (2019-01-22)


### Bug Fixes

* 使用terser工具代替uglifyjs进行代码压缩 ([9b0fe32](https://github.com/packingjs/packing/commit/9b0fe32))



<a name="4.0.3"></a>
## [4.0.3](https://github.com/packingjs/packing/compare/v4.0.2...v4.0.3) (2018-12-12)



<a name="4.0.2"></a>
## [4.0.2](https://github.com/packingjs/packing/compare/v4.0.1...v4.0.2) (2018-12-01)

### Bug Fixes

* [ESLINT_LEGACY_OBJECT_REST_SPREAD] DeprecationWarning: The 'parserOptions.ecmaFeatures.experimentalObjectRestSpread' option is deprecated. Use 'parserOptions.ecmaVersion' instead. ([d76db01](https://github.com/packingjs/packing/commit/d76db01))


<a name="4.0.1"></a>
## [4.0.1](https://github.com/packingjs/packing/compare/v4.0.0...v4.0.1) (2018-12-01)（deprecate）


<a name="4.0.0"></a>
# [4.0.0](https://github.com/packingjs/packing/compare/v4.0.1...v4.0.0) (2018-12-01)


### BREAKING CHANGE

* Upgrade to babel 7

Upgrade to babel 7 and update outdated packages.

Now you can use ES2018 grammar and experimental features of ECMAScript!

** 升级指南 **
> 1. 执行 `npm install --save packing@latest` 更新4.0.0以上版本的packing依赖；
> 2. 执行 `npx babel-upgrade --write --install` 命令，将会自动更新babel相关依赖以及`.babelrc`或`babel.config.js`配置文件；
> 3. 执行 `npm install --save-dev @babel/register` 安装最新版babel-register；
> 4. 删除 `.babelrc` 或 `babel.config.js` 配置文件中可能存在的的重复plugin；
> 5. 若自动更新生成的`.babelrc` 或 `babel.config.js` 配置文件中存在 `@babel/plugin-transform-runtime` 这个plugin，删除这个plugin配置参数中的 `polyfill` 属性。
> 6. 由于不再支持在runtime插件中配置polyfill，若需要使用polyfill，执行 `@babel/polyfill` 安装babel-polyfill，并在 `.babelrc` 或 `babel.config.js` 配置文件中的presets属性下的 `@babel/preset-env` 配置参数中添加 `useBuiltIns: 'usage' `。若有`core-js`相关错误，尝试安装最新版 `core-js`。 详情[参考官网babel-polyfill](https://babeljs.io/docs/en/babel-polyfill)介绍。


<a name="3.3.1"></a>
## [3.3.1](https://github.com/packingjs/packing/compare/v3.3.0...v3.3.1) (2018-08-22)



<a name="3.3.0"></a>
# [3.3.0](https://github.com/packingjs/packing/compare/v3.2.4...v3.3.0) (2018-08-22)


### Bug Fixes

* [#23](https://github.com/packingjs/packing/issues/23) entrypoint为数组时报错 ([0cbcc37](https://github.com/packingjs/packing/commit/0cbcc37))


### Features

* [#24](https://github.com/packingjs/packing/issues/24) 支持多个webpack配置 ([9203d78](https://github.com/packingjs/packing/commit/9203d78))
* [#25](https://github.com/packingjs/packing/issues/25) 暴露webpackDevMiddleware配置项writeToDisk ([ad5b753](https://github.com/packingjs/packing/commit/ad5b753))



<a name="3.2.5"></a>
## [3.2.5](https://github.com/packingjs/packing/compare/v3.2.4...v3.2.5) (2018-06-26)


### Bug Fixes

* [#23](https://github.com/packingjs/packing/issues/23) entrypoint为数组时报错 ([0cbcc37](https://github.com/packingjs/packing/commit/0cbcc37))



<a name="3.2.4"></a>
## [3.2.4](https://github.com/packingjs/packing/compare/v3.2.3...v3.2.4) (2018-05-16)


### Bug Fixes

* [#22](https://github.com/packingjs/packing/issues/22) async/await 语法报错 ([109b713](https://github.com/packingjs/packing/commit/109b713))



<a name="3.2.3"></a>
## [3.2.3](https://github.com/packingjs/packing/compare/v3.2.2...v3.2.3) (2018-05-16)



<a name="3.2.2"></a>
## [3.2.2](https://github.com/packingjs/packing/compare/v3.2.1...v3.2.2) (2018-05-15)


### Bug Fixes

* 修复 es6 语法错误 ([abd837b](https://github.com/packingjs/packing/commit/abd837b))



<a name="3.2.1"></a>
## [3.2.1](https://github.com/packingjs/packing/compare/v3.2.0...v3.2.1) (2018-05-15)


### Bug Fixes

* 当母模版名称和路由名称一样时，settings.js 中的master参数无效 ([e96a795](https://github.com/packingjs/packing/commit/e96a795))



<a name="3.2.0"></a>
# [3.2.0](https://github.com/packingjs/packing/compare/v3.1.0...v3.2.0) (2018-05-14)


### Features

* 增加配置参数有效性检查 ([c05ee60](https://github.com/packingjs/packing/commit/c05ee60))



<a name="3.1.0"></a>
# [3.1.0](https://github.com/packingjs/packing/compare/v3.0.4...v3.1.0) (2018-05-10)



<a name="3.0.4"></a>
## [3.0.4](https://github.com/packingjs/packing/compare/v3.0.3...v3.0.4) (2018-05-10)


### Bug Fixes

* 修复 manifest.json 地址在编译机上错误的问题 ([5375fbf](https://github.com/packingjs/packing/commit/5375fbf))



<a name="3.0.3"></a>
## [3.0.3](https://github.com/packingjs/packing/compare/v3.0.2...v3.0.3) (2018-05-10)



<a name="3.0.2"></a>
## [3.0.2](https://github.com/packingjs/packing/compare/v3.0.0-beta.18...v3.0.2) (2018-05-04)



<a name="3.0.0-beta.18"></a>
# [3.0.0-beta.18](https://github.com/packingjs/packing/compare/v3.0.0-beta.17...v3.0.0-beta.18) (2018-04-26)



<a name="3.0.0-beta.17"></a>
# [3.0.0-beta.17](https://github.com/packingjs/packing/compare/v3.0.0-beta.16...v3.0.0-beta.17) (2018-04-26)


### Bug Fixes

* babel不编译隐藏文件 ([c6df9e9](https://github.com/packingjs/packing/commit/c6df9e9))


### Features

* **eslint:** 检查 import 地址时区分大小写 ([fee351a](https://github.com/packingjs/packing/commit/fee351a))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/packingjs/packing/compare/v3.0.0-beta.16...v3.0.0) (2018-04-26)


<a name="3.0.0-beta.16"></a>
# [3.0.0-beta.16](https://github.com/packingjs/packing/compare/v3.0.0-beta.15...v3.0.0-beta.16) (2018-04-26)



<a name="3.0.0-beta.15"></a>
# [3.0.0-beta.15](https://github.com/packingjs/packing/compare/v3.0.0-beta.14...v3.0.0-beta.15) (2018-04-26)



<a name="3.0.0-beta.14"></a>
# [3.0.0-beta.14](https://github.com/packingjs/packing/compare/v3.0.0-beta.13...v3.0.0-beta.14) (2018-04-25)


### Bug Fixes

* 兼容字符串类型 entry point ([92fdd89](https://github.com/packingjs/packing/commit/92fdd89))



<a name="3.0.0-beta.13"></a>
# [3.0.0-beta.13](https://github.com/packingjs/packing/compare/v3.0.0-beta.12...v3.0.0-beta.13) (2018-04-24)



<a name="3.0.0-beta.12"></a>
# [3.0.0-beta.12](https://github.com/packingjs/packing/compare/v3.0.0-beta.11...v3.0.0-beta.12) (2018-04-20)



<a name="3.0.0-beta.11"></a>
# [3.0.0-beta.11](https://github.com/packingjs/packing/compare/v3.0.0-beta.10...v3.0.0-beta.11) (2018-04-19)


### Bug Fixes

* 修复开发环境下 script 闭合标签错误的问题 ([f887d61](https://github.com/packingjs/packing/commit/f887d61))



<a name="3.0.0-beta.10"></a>
# [3.0.0-beta.10](https://github.com/packingjs/packing/compare/v3.0.0-beta.9...v3.0.0-beta.10) (2018-04-19)



<a name="3.0.0-beta.9"></a>
# [3.0.0-beta.9](https://github.com/packingjs/packing/compare/v3.0.0-beta.8...v3.0.0-beta.9) (2018-04-19)



<a name=""></a>
# [](https://github.com/packingjs/packing/compare/v3.0.0-beta.8...v) (2018-04-19)



<a name=""></a>
# [](https://github.com/packingjs/packing/compare/v3.0.0-beta.8...v) (2018-04-19)



<a name="3.0.0-beta.8"></a>
# [3.0.0-beta.8](https://github.com/packingjs/packing/compare/v3.0.0-beta.7...v3.0.0-beta.8) (2018-04-19)


### Bug Fixes

* 修复当build结果存在 warning 就不自动弹出包体积分析报告网页 ([cdb478c](https://github.com/packingjs/packing/commit/cdb478c))



<a name="3.0.0-beta.7"></a>
# [3.0.0-beta.7](https://github.com/packingjs/packing/compare/v3.0.0-beta.6...v3.0.0-beta.7) (2018-04-19)


### Features

* 增加输出文件分析报表功能，借助报表能优化打包结果 ([fa5d49e](https://github.com/packingjs/packing/commit/fa5d49e))



<a name="3.0.0-beta.6"></a>
# [3.0.0-beta.6](https://github.com/packingjs/packing/compare/v3.0.0-beta.5...v3.0.0-beta.6) (2018-04-18)


### Features

* 内置 `postcss.config.js` 配置文件 ([c5450be](https://github.com/packingjs/packing/commit/c5450be))



<a name="3.0.0-beta.5"></a>
# [3.0.0-beta.5](https://github.com/packingjs/packing/compare/v3.0.0-beta.4...v3.0.0-beta.5) (2018-04-17)



<a name="3.0.0-beta.4"></a>
# [3.0.0-beta.4](https://github.com/packingjs/packing/compare/v3.0.0-beta.3...v3.0.0-beta.4) (2018-04-08)


### Bug Fixes

* 修复 build 时删除 prd 目录不成功的问题 ([61a2cbb](https://github.com/packingjs/packing/commit/61a2cbb))


### Features

* 可以用 `packing.config.templateInjectManifest` 向网页中插入 pwa manifest.json ([c38ad91](https://github.com/packingjs/packing/commit/c38ad91))
* **cli:** 增加 `-s, --skip_dll` 参数用来跳过 `packing serve` 时 dll 编译 ([c6c173b](https://github.com/packingjs/packing/commit/c6c173b))
* **stylelint:** 增加 `stylelint` 功能，校验 `css` 语法 ([35cd0fe](https://github.com/packingjs/packing/commit/35cd0fe))。在 `packing.js` 中增加了两个控制参数：
    - `stylelint`: 是否启用 `Stylelint`
    - `stylelintOptions`: stylelint参数，请参考 [Stylelint官方文档](https://stylelint.io/user-guide/node-api/#options)


<a name="3.0.0-beta.3"></a>
# [3.0.0-beta.3](https://github.com/packingjs/packing/compare/v3.0.0-beta.2...v3.0.0-beta.3) (2018-04-02)

### Features
* 用 `file-loader` 代替 `url-loader` 加载静态文件
* 使用 `dotenv` 加载 `process.env` 环境变量
* 将 `packing-template` 合并到 `packing` 工程，方便开发调试
* 调整 `packing.path` 结构
    - `path.dll` 更名为 `path.tmpDll`
    - 删除 `assetsDist` `templatesDist` `templatesPagesDist`
    - 删除 `packing.path.assets` 配置，如果希望直接 `import` `path.assets` 下的文件请使用 `webpack.resolve.alias` 设置
      ```js
      webpackConfig.resolve.alias = {
        assets: 'assets'
      };
      ```
    - 分为 `src` `dist` 两类，每种目录均使用 `root` 的相对目录
    - 简化 `templates` 目录设置
      - {string}:
      - {object}
        - layout:
        - pages:
    - `mockPageInit` 更名为 `mockPages`

* `path.templates` 结构调整
    - 兼容字符串类型参数
    - 允许传入包含 `layout` `pages` 的对象参数

* 默认模版类型改为 `pug`
    - `templateEngine` 默认值由 `html` 改为 `pug`
    - `templateExtension` 默认值由 `.html` 改为 `.pug`

* `src/profiles` --> `profiles`
    - 位置变化：该目录无需编译，移动到 `src` 目录外
    - 格式变化：使用 `key=value` 的方式描述，每行一个配置

* 编译输出目录由 `prd/assets/` 变更为 `prd/`


<a name="3.0.0-beta.2"></a>
# [3.0.0-beta.2](https://github.com/packingjs/packing/compare/v3.0.0-beta.1...v3.0.0-beta.2) (2018-03-29)


### Features

* **packing dll:**  增加 `packing dll` 命令 ([e78a7c3](https://github.com/packingjs/packing/commit/e78a7c3))



<a name="3.0.0-beta.1"></a>
# [3.0.0-beta.1](https://github.com/packingjs/packing/compare/v3.0.0-beta.0...v3.0.0-beta.1) (2018-03-27)

### Bug Fixes
- 修复 `packing@<=2.6.6` `packing-urlrewrite` 兼容问题

<a name="3.0.0-beta.0"></a>
# [3.0.0-beta.0](https://github.com/packingjs/packing/compare/v2.6.6...v3.0.0-beta.0) (2018-03-26)

### 重大改变
- 能根据 `entry points` 自动生成网页文件
- node@>=6.11.5
- 使用 webpack v4
- 升级到最新的依赖包

### 新功能
- 能根据 `entry points` 自动生成网页文件
- 增加 `process.env.CONTEXT`，可以在运行时指定工程位置
- 将开发环境下的工程根目录设置为虚拟目录，取消assets虚拟目录
- 支持 https 请求转发 ([fca12f2](https://github.com/packingjs/packing/commit/fca12f2))
- **config:** 增加 `templateInjectPosition` 参数，用来控制生成网页时是否往html中注入 assets ([03b4b16](https://github.com/packingjs/packing/commit/03b4b16))

### 优化
- 在 webpack-dev-middleware 编译后再启动 express 服务
- 补充了重要功能的测试用例
- 使用了多进程运行测试用例，确保各用例之间的环境变量不再相互干扰
- 使用 `travis-ci` 做为集成工具

# Bugfixes
- 当 `.tmp/vendor` 目录不存在时执行 `packing serve -c` 不再报错 ([464c613](https://github.com/packingjs/packing/commit/464c613))
- 修复 `packing-urlrewrite` 不能转发 `https://` 请求的问题
- 修复了默认 `profiles` 中 `cdnRoot` 路径错误
-

### 内部改变
- `util/babel-register.js` 使用的配置项写死在代码中，不再依赖工程根目录的 `.babelrc`，
- 删除了默认配置中 `webpack.DefinePlugin` 插件，使用 `mode` 参数代替
- 删除了默认配置中的 `webpack-uncomment-block` `replace-hash-webpack-plugin`，使用 `packing-template` 代替
-

### 删除的功能
- 删除 `packing lint`，请使用 `eslint` 代替
- 删除代码覆盖率统计的依赖包
- 删除了 `packing-profile-webpack-plugin`，使用场景太少
- 删除了 `assets` 虚拟目录，请看 `兼容性 -> 静态文件引用` 部分

### 兼容性
- 在模版中引用静态文件时，文件路径需要使用相对于工程根目录的相对路径。比如工程目录结构如下图所示，在 `default.png` 中引用 `1.png`的正确写法为：
  - v3 以前的写法是 `img(src="1.png")`，可以忽略 `assets` 这一级目录
  - v3+ 需要把路径写完整， `img(src="assets/1.png")`
  ```
  .
  ├── /assets/
  │   └── /1.png
  └── /templates/
      ├── /layout/
      └── /pages/
          └── /default.pug

  ```
- `webpack.optimize.UglifyJsPlugin` 配置方式发生了变化，需要在下面的位置修改配置：
  ```js
  {
    optimization: {
      UglifyJs: {
        compress: {
          warnings: false,
          drop_debugger: true,
          drop_console: true
        },
        comments: /^!/,
        sourceMap
      }
    }
  }
  ```

- 设置 `packing/config/packing.js` 中的 `templateInjectPosition: false` 来关闭生成网页文件时自动注入 assets 的功能

- 如果使用 `packing` 自动生成的模版，需要修改 node 工程的 pug 代码，需要增加 `basedir` 参数，值为模版的目录
```js
new Pug({
    viewPath: 'templates',
    basedir: 'templates'
})
```

<a name="2.6.6"></a>
## [2.6.6](https://github.com/packingjs/packing/compare/v2.6.5...v2.6.6) (2018-02-28)


### Bug Fixes

* [#18](https://github.com/packingjs/packing/issues/18) 修复在开发环境中，commonChunk中引用的资源文件通过webapck.dll打包后未能生成实体文件，导致开发环境无法正确访问的问题 ([97dd090](https://github.com/packingjs/packing/commit/97dd090))



<a name="2.6.5"></a>
## [2.6.5](https://github.com/packingjs/packing/compare/v2.6.4...v2.6.5) (2018-02-11)


### Bug Fixes

* [#16](https://github.com/packingjs/packing/issues/16) 增加longTermCachingSymbol参数，让编译产物名称具有更多灵活性 ([f3e2440](https://github.com/packingjs/packing/commit/f3e2440))



<a name="2.6.4"></a>
## [2.6.4](https://github.com/packingjs/packing/compare/v2.6.3...v2.6.4) (2018-02-01)


### Bug Fixes

* 关闭 cssnano minifyFontValues 功能 ([14c0738](https://github.com/packingjs/packing/commit/14c0738))



<a name="2.6.3"></a>
## [2.6.3](https://github.com/packingjs/packing/compare/v2.6.2...v2.6.3) (2018-01-29)


### Bug Fixes

* 当packing.commonChunks为空时，不应该输出manifest.js ([6c20f4c](https://github.com/packingjs/packing/commit/6c20f4c))



<a name="2.6.2"></a>
## [2.6.2](https://github.com/packingjs/packing/compare/v2.6.1...v2.6.2) (2018-01-26)


### Bug Fixes

* 当loader的options.name包含[path]时，hash替换有问题 ([3666cda](https://github.com/packingjs/packing/commit/3666cda))



<a name="2.6.1"></a>
## [2.6.1](https://github.com/packingjs/packing/compare/v2.6.0...v2.6.1) (2018-01-26)



<a name="2.6.0"></a>
# [2.6.0](https://github.com/packingjs/packing/compare/v2.5.2...v2.6.0) (2017-12-12)


### Features

* 支持模拟 GraphQL 接口数据 ([b307a5f](https://github.com/packingjs/packing/commit/b307a5f))



<a name="2.5.2"></a>
## [2.5.2](https://github.com/packingjs/packing/compare/v2.5.1...v2.5.2) (2017-12-06)


### Bug Fixes

*  用babel-preset-env代替babel-preset-es2015 [#15](https://github.com/packingjs/packing/issues/15) ([8edb8db](https://github.com/packingjs/packing/commit/8edb8db))

* 修复页面代码（非vendor）变化会影响到vendor.js hash变化 [#14](https://github.com/packingjs/packing/issues/14)  ([54ae56e](https://github.com/packingjs/packing/commit/54ae56e))



<a name="2.5.1"></a>
## [2.5.1](https://github.com/packingjs/packing/compare/v2.5.0...v2.5.1) (2017-11-27)


### Bug Fixes

* packing 打包错误之后没有退出，没有被阻断jenkins编译 [#13](https://github.com/packingjs/packing/issues/13) ([eac3367](https://github.com/packingjs/packing/commit/eac3367))



<a name="2.5.0"></a>
# [2.5.0](https://github.com/packingjs/packing/compare/v2.4.0...v2.5.0) (2017-10-13)


### Features

* uncomment specified code blocks in templates after build ([13d1079](https://github.com/packingjs/packing/commit/13d1079))



<a name="2.4.0"></a>
# [2.4.0](https://github.com/packingjs/packing/compare/v2.3.1...v2.4.0) (2017-10-11)


### Features

* 增加css-modules支持，通过packing.js配置 ([3784300](https://github.com/packingjs/packing/commit/3784300))



<a name="2.3.1"></a>
## [2.3.1](https://github.com/packingjs/packing/compare/v2.3.0...v2.3.1) (2017-09-13)


### Bug Fixes

* 增加向下兼容性 ([8dafa6f](https://github.com/packingjs/packing/commit/8dafa6f))



<a name="2.3.0"></a>
# [2.3.0](https://github.com/packingjs/packing/compare/v2.2.11...v2.3.0) (2017-08-09)


### Features

* 在webpack配置文件中增加了packing.js配置的参数 ([aa49c58](https://github.com/packingjs/packing/commit/aa49c58))
* 开发环境增加编译loading动画 ([938dc73](https://github.com/packingjs/packing/commit/938dc73))



<a name="2.2.11"></a>
## [2.2.11](https://github.com/packingjs/packing/compare/v2.2.10...v2.2.11) (2017-08-08)


### Bug Fixes

* Remove DashboardPlugin from webpack.serve.babel.js ([4444d53](https://github.com/packingjs/packing/commit/4444d53))



<a name="2.2.10"></a>
## [2.2.10](https://github.com/packingjs/packing/compare/v2.2.9...v2.2.10) (2017-08-03)



<a name="2.2.9"></a>
## [2.2.9](https://github.com/packingjs/packing/compare/v2.2.7...v2.2.9) (2017-08-03)


### Bug Fixes

* fixed the formatError when packing build failed ([5548135](https://github.com/packingjs/packing/commit/5548135))
* Remove LoaderOptionsPlugin which only exists for migration. As a result, this fixs the problem that the file "postcss.config.js" dose not work. ([b8f37f8](https://github.com/packingjs/packing/commit/b8f37f8))


### Performance Improvements

* 优化目录结构，工程层级更加清晰 ([2058ebc](https://github.com/packingjs/packing/commit/2058ebc))
* 升级到 webpack 3.0 ([540bf74](https://github.com/packingjs/packing/commit/540bf74))



<a name="2.2.7"></a>
## [2.2.7](https://github.com/packingjs/packing/compare/v2.2.5...v2.2.7) (2017-06-14)



<a name="2.2.5"></a>
## [2.2.5](https://github.com/packingjs/packing/compare/v2.2.4...v2.2.5) (2017-06-13)



<a name="2.2.4"></a>
## [2.2.4](https://github.com/packingjs/packing/compare/v2.2.3...v2.2.4) (2017-06-13)



<a name="2.2.3"></a>
## [2.2.3](https://github.com/packingjs/packing/compare/v2.2.2...v2.2.3) (2017-06-13)


### Bug Fixes

* eslint-config-qunar[@1](https://github.com/1).1.4 ([1ce1034](https://github.com/packingjs/packing/commit/1ce1034))



<a name="2.2.2"></a>
## [2.2.2](https://github.com/packingjs/packing/compare/v2.2.1...v2.2.2) (2017-06-13)


### Bug Fixes

* 删除postcssrc中的parser选项 ([bf6b6a1](https://github.com/packingjs/packing/commit/bf6b6a1))



<a name="2.2.1"></a>
## [2.2.1](https://github.com/packingjs/packing/compare/v2.2.0...v2.2.1) (2017-06-13)


### Bug Fixes

* 将eslint放在实例工程中 ([c45efdc](https://github.com/packingjs/packing/commit/c45efdc))



<a name="2.2.0"></a>
# [2.2.0](https://github.com/packingjs/packing/compare/v0.1.1...v2.2.0) (2017-06-12)


### Bug Fixes

* Compatible yarn ([4d7a458](https://github.com/packingjs/packing/commit/4d7a458))
* Compatible yarn ([c1e800a](https://github.com/packingjs/packing/commit/c1e800a))
* Fix dependencies errors ([849dcda](https://github.com/packingjs/packing/commit/849dcda))
* Fix DLL task bug ([aed8d4b](https://github.com/packingjs/packing/commit/aed8d4b))
* Fix sytnax error ([7d220e2](https://github.com/packingjs/packing/commit/7d220e2))
* Fix win32 error when filename has colon ([bce361a](https://github.com/packingjs/packing/commit/bce361a))
* Fixed formatError to for compatibility with webpack2 ([9b5563e](https://github.com/packingjs/packing/commit/9b5563e))
* Fixed library example path error ([b2d0509](https://github.com/packingjs/packing/commit/b2d0509))
* Upgrade eslint-plugin-jsx-a11y[@4](https://github.com/4).0.0 ([6d9ba39](https://github.com/packingjs/packing/commit/6d9ba39))
* 修复项目路径中包含packing时babel解析错误的bug ([63db513](https://github.com/packingjs/packing/commit/63db513))
* **babelrc:** Fix babel config syntax error ([c00e85a](https://github.com/packingjs/packing/commit/c00e85a))


### Features

* Added .eslintignore ([4b051ca](https://github.com/packingjs/packing/commit/4b051ca))
* Compatible yarn ([41174cf](https://github.com/packingjs/packing/commit/41174cf))
* Execute generator from cli ([9f3d773](https://github.com/packingjs/packing/commit/9f3d773))
* Set the module option to false in our es2015 preset ([6ca861d](https://github.com/packingjs/packing/commit/6ca861d))
* Support yarn ([9a1b210](https://github.com/packingjs/packing/commit/9a1b210))
