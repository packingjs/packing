# build-library

将 JavaScript 文件打包成基础库，引用页面直接通过 `<script>` 标签引入即可，类似 jQuery 的基础类。

## config/packing.js
``` javascript
export default (packing) => {
  const p = packing;
  p.path.entries = './src/lib.js';
  p.commonChunks = {};
  p.visualizer.enabled = false;
  p.template.enabled = false;
  return p;
};
```

## config/webpack.build.babel.js
``` javascript
export default (webpackConfig) => {
  const config = webpackConfig;
  // lib文件输出名称
  config.output.filename = 'abc.js';

  // lib暴露在 window 下的名称
  config.output.library = 'ABC';

  // 打包方式，一般不需要修改
  // 详细文档请看 https://webpack.js.org/configuration/output/#output-librarytarget
  config.output.libraryTarget = 'umd';
  return config;
};
```

## src/lib.js
``` javascript
module.exports = {
  name: 'Joe'
};
```

## src/index.html
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8'>
    <title>library example</title>
  </head>

  <body>
    <h1>library example</h1>
    <p>Tutorial of how to author a library using webpack.</p>
    <script src="abc.js"></script>
    <script>
    console.log(ABC);
    </script>
  </body>
</html>
```

## prd/abc.js
```js
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.ABC=t():e.ABC=t()}(window,function(){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},n.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/",n(n.s="./src/lib.js")}({"./src/lib.js":function(module,exports,__webpack_require__){"use strict";eval("\n\nmodule.exports = {\n  name: 'Joe'\n};\n\n//# sourceURL=webpack://ABC/./src/lib.js?")}})});
```

## Info
```
Versions:
 user-agent: npm/6.0.1 node/v8.5.0 darwin x64
 packing: 3.2.4
[dotenv]: 配置文件加载成功，文件位置：/Users/zhongzhi/workspace/github/packingjs/packing/examples/build-library/profiles/local.env
Hash: f506cd746bbebdbfadb2
Version: webpack 4.8.3
Time: 381ms
Built at: 2018-05-18 17:07:02
 Asset       Size  Chunks             Chunk Names
abc.js  932 bytes    main  [emitted]  main
Entrypoint main = abc.js
[./src/lib.js] 50 bytes {main} [built]
[build]:💚 Webpack 打包成功。

```
