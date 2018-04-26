# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
