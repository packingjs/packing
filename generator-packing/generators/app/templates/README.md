# <%= props.name %>

## 常用命令

1. 启动开发模式
  ```
  npm run serve
  # window系统使用下面的命令
  # npm run serve:normal
  ```

2. 在浏览器中预览网站 `http://localhost:8081`

3. 其他命令
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
  npm run serve -- --open_browser
  npm run serve -- -o

  # 启动时强制清除DLL缓存功能
  npm run serve -- --clean_cache
  npm run serve -- -c
  ```

## 目录结构

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
├── .babelrc                            # babel配置
├── .editorconfig                       # 代码编辑器配置
├── .eslintrc                           # eslint配置
├── package.json
├── pom.xml                             # maven配置
└── README.md                   
```

## 约定
* 网页模版中对静态资源引用时使用绝对路径，如 `<script src='/logo/qunar.png'>`
* **CSS文件引用 `assets` 中的静态资源时使用波浪线 `~` 开头的相对路径**，下面的css能引用到 `assets/images/packing-logo.png`
```css
background: url(~images/packing-logo.png)
```

## Examples
https://github.com/zhongzhi107/packing/tree/master/examples

## 使用其他npm源
```
# npm使用qunar源
npm install --registry http://registry.npm.corp.qunar.com --disturl=https://npm.taobao.org/dist --sass-binary-site=http://npm.taobao.org/mirrors/node-sass
npm install --registry http://registry.npm.taobao.com

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

### package.json中依赖包的版本更新了，但DLL不更新，还是走的缓存
启动时使用参数强制删除缓存
```
npm run serve -- --clean_cache
```

### dll_vendor:Uncaught ReferenceError: __webpack_require__ is not defined
vendor.js里没有打入任何js，检查packing.js的 `commonChunks.vendor` 配置

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

### 本地编译正常，在编译服务器上发布时却提示找不到某些依赖包
本地开发时用的npm安装命令是 `npm install` ，它会`devDependencies`和`dependencies`包含的所有包，为了减少不必要的包安装、提高安装速度，在编译服务器上用的npm安装命令是 `npm install --production`，它只会安装`dependencies`下的包。出现这种情况是因为包的位置摆放错误，你需要把在编译服务器上提示找不到的这些包从`devDependencies`移动到`dependencies`下。

### schema和job参数怎么配置
```
fe.xxx.build_method=node
fe.xxx.build_command:
```
