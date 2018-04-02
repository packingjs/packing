/**
 * 和构建工具相关的配置信息
 * @author Joe Zhong <zhong.zhi@163.com>
 * @module config/packing
 */
import path from 'path';
import packingGlob from 'packing-glob';

export default {
  // 文件路径，所有目录都使用相对于项目根目录的相对目录格式
  path: {
    // 源文件相关路径
    src: {
      /**
       * 源文件根目录 {string}
       */
      root: 'src',

      /**
       * 模版文件路径 {string|object}
       * 相对于 `src.root` 的相对地址
       * 若不区分布局文件和网页文件，请直接传入字符串
       */
      templates: {
        layout: 'templates/layout',
        pages: 'templates/pages'
      }
    },

    // 编译输出文件相关路径
    dist: {
      /**
       * webpack 编译产物输出目录 {string}
       * 即 `webpack.config.output.path` 参数
       */
      root: 'prd',

      /**
       * 模版文件路径 {string|object}
       * 相对于 `dist.root` 的相对地址
       * 若不区分布局文件和网页文件，请直接传入字符串
       */
      templates: {
        layout: 'templates/layout',
        pages: 'templates/pages'
      }
    },

    // 页面初始化 mock 数据文件存放目录
    mockPages: 'mock/pages',

    // dllPlugin 编译输出物临时存放目录
    tmpDll: '.tmp/dll',

    // webpack打包入口JS文件目录
    // As value an object, a function is accepted.
    // entries: {
    //   index: './src/entries/index.js',
    //   abc: './src/entries/abc.less'
    // }
    entries: () => {
      const entryPath = 'src/entries';
      const entryPattern = '**/*.js';
      const cwd = path.resolve(entryPath);
      const config = {};
      packingGlob(entryPattern, { cwd }).forEach((page) => {
        const ext = path.extname(page).toLowerCase();
        const key = page.replace(ext, '');
        config[key] = path.join(cwd, page);
      });
      return config;
    }
  },

  // 模版引擎类型，目前支持的类型有[html,pug,ejs,handlebars,smarty,velocity,artTemplate]
  templateEngine: 'pug',

  // 模版文件扩展名
  templateExtension: '.pug',

  // 是否往模版中注入 assets [bool|string]
  // false: 不注入
  // 'head': 在</head>前注入
  // 'body': 在</body>前注入
  templateInjectPosition: 'body',

  // 本地访问的域名，为了调试方便，可能改成my.qunar.com
  localhost: 'localhost',

  // dev环境启用 hmr
  hot: false,

  // 编译时做文件 md5
  longTermCaching: true,

  // 文件名与 md5 连接使用的字符串
  longTermCachingSymbol: '_',

  // 静态文件md5保留长度
  fileHashLength: 8,

  // 编译时做代码压缩
  minimize: true,

  // 编译时启用source map
  sourceMap: false,

  // 启用css-loader的css-modules功能
  cssModules: false,

  // 自定义css-modules类标识命名规则
  cssModulesIdentName: '[path][name]__[local]--[hash:base64:5]',

  // webserver端口
  port: {
    // 开发环境端口号
    dev: 8081,
    // 预览编译后结果的端口号
    dist: 8080
  },

  // commonChunks配置，在serve任务中被DllPlugin调用，在build任务中被CommonsChunkPlugin调用
  // CommonsChunkPlugin会将最后一个当作Entry chunk
  // 注意，如果配置了commonChunks，所有网页模版需要引用公共包文件
  // 否则会报错
  // <script src="/vendor.js"></script>
  commonChunks: {
    // vendor: [
    //   'react',
    //   'react-dom'
    //   'packing-ajax'
    // ]
  },

  // 静态资源类型
  assetExtensions: [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'mp3',
    'ttf',
    'woff',
    'woff2',
    'eot',
    'svg'
  ],

  // URL转发路由规则配置
  // require! 表示使用本地mock文件
  rewriteRules: {
    // 网站URL与模版的对应路由关系
    '^/$': '/index.html',

    // API转发
    '^/api/(.*)': 'require!/mock/api/$1.js'
    // '^/api/(.*)': '/index.jade.html',
    // '^/api/(.*)': 'http://touch.qunar.com/api/hotel/findhotelcity?cityName=%E5%8C%97%E4%BA%AC',
    // '^/hello': 'http://localhost:3001/123/4.html',
  },

  // 是否使用GraphQL-mock-server
  graphqlMockServer: false,

  // GraphQL 地址
  graphqlEndpoint: '/graphql',

  // GraphiQL 地址
  graphiqlEndpoint: '/graphiql'

};
