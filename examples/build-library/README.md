# Examples: build-library

## 目的
将js文件打包成基础库，引用页面直接通过 `<script>` 标签引入即可，类似 jQuery 的基础类

## 步骤
- 修改 `config/packing.js`
    ```js
    export default (packing) => {
      const p = packing;
      p.commonChunks = {};
      return p;
    };
    ```
- 修改 `config/webpack.serve.babel.js` 和 `config/webpack.build.babel.js`
    ```js
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
- 在 html 页面直接引用
    ```html
    <script src="abc.js"></script>
    ```
