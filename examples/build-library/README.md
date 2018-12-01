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
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.ABC=t():e.ABC=t()}(window,function(){return function(n){var r={};function o(e){if(r[e])return r[e].exports;var t=r[e]={i:e,l:!1,exports:{}};return n[e].call(t.exports,t,t.exports,o),t.l=!0,t.exports}return o.m=n,o.c=r,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)o.d(n,r,function(e){return t[e]}.bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="/",o(o.s="./src/lib.js")}({"./src/lib.js":function(module,exports){eval("module.exports = {\n  name: 'Joe'\n};\n\n//# sourceURL=webpack://ABC/./src/lib.js?")}})});
```

## Info
```
Versions:
 user-agent: npm/6.4.1 node/v8.9.1 darwin x64
 packing: 3.3.1
[dotenv]: 配置文件加载成功，文件位置：/Users/zhan.chen/Documents/github/packing/examples/build-library/profiles/local.env
Hash: 32bda4b575826943d8af
Version: webpack 4.26.1
Time: 503ms
Built at: 2018-12-01 11:48:55
 Asset      Size  Chunks             Chunk Names
abc.js  1.25 KiB    main  [emitted]  main
Entrypoint main = abc.js
[./src/lib.js] 35 bytes {main} [built]
[build]:💚 Webpack 打包成功。

```
