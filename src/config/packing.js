/**
 * `packing` 配置模块
 * @module config/packing
 */
import path from 'path';
import packingGlob from 'packing-glob';

export default {
  /**
   * 本地访问的域名
   * 如果需要使用 `qunar.com` 的 cookie，需要改成类似 `my.qunar.com` 这种
   * @type {string}
   */
  localhost: 'localhost',

  /**
   * webserver 端口
   */
  port: {
    /**
     * 开发环境 webserver 端口
     * @type {number}
     */
    dev: 8081,

    /**
     * 预览编译结果时 webserver 端口
     * @type {number}
     */
    dist: 8080
  },

  /**
   * 文件路径配置
   * 所有目录都使用相对于项目根目录的相对目录格式
   */
  path: {
    /** 源文件相关路径 */
    src: {
      /**
       * 源文件根目录
       * @type {string}
       */
      root: 'src',

      /**
       * 模版文件路径
       * 相对于 `src.root` 的相对地址
       * 若不区分布局文件和网页文件，请直接传入字符串
       * @type {(string|object)}
       */
      templates: {
        layout: 'templates/layout',
        pages: 'templates/pages'
      }
    },

    /** 编译输出文件相关路径 */
    dist: {
      /**
       * webpack 编译产物输出目录
       * 即 `webpack.config.output.path` 参数
       * @type {string}
       */
      root: 'prd',

      /**
       * 模版文件路径
       * 相对于 `dist.root` 的相对地址
       * 若不区分布局文件和网页文件，请直接传入字符串
       * @type {(string|object)}
       */
      templates: {
        layout: 'templates/layout',
        pages: 'templates/pages'
      },

      /**
       * JavaScript 输出目录
       * @type {string}
       */
      js: 'js',

      /**
       * CSS 输出目录
       * @type {string}
       */
      css: 'css'
    },

    /**
     * 页面初始化 mock 数据文件存放目录
     * @type {string}
     */
    mockPages: 'mock/pages',

    /**
     * dllPlugin 编译输出物临时存放目录
     * @type {string}
     */
    tmpDll: '.tmp/dll',

    /**
     * 打包入口文件
     * @type {(string|object|function)}
     * @example
     * // string
     * entries: './src/entries/index.js'
     * @example
     * // object
     * entries: {
     *   index: './src/entries/index.js',
     *   abc: './src/entries/abc.less'
     * }
     * @example
     * // function
     * entries: () => {}
     */
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

  /** 模版配置 */
  template: {
    /**
     * 模版引擎类型
     * 目前支持
     * - html
     * - pug
     * - ejs
     * - handlebars
     * - smarty
     * - velocity
     * - artTemplate
     * @type {string}
     */
    engine: 'pug',

    /**
     * 模版文件扩展名
     * @type {string}
     */
    extension: '.pug',

    /**
     * 是否根据 `entry pointer` 自动生成网页文件
     * @type {bool}
     */
    autoGeneration: true,

    /**
     * 是否往模版中注入 assets
     * @type {bool}
     */
    inject: true,

    /**
     * JavaScript Chunk 注入的位置
     * - 'head': 在</head>前注入
     * - 'body': 在</body>前注入
     * @type {'head'|'body'}
     */
    scriptInjectPosition: 'body',

    /**
     * 是否往模版中注入 PWA manifest.json
     * @type {bool}
     */
    injectManifest: false,

    /**
     * `manifest.json` 文件位置
     * @type {string}
     */
    manifest: 'manifest.json'
  },

  /** HRM 配置 */
  hot: {
    /**
     * 是否启用热模块替换
     * @type {bool}
     */
    enable: true,

    /**
     * HRM 选项
     * @type {object}
     * @see {@link https://github.com/webpack-contrib/webpack-hot-middleware|webpack-hot-middleware}
     */
    options: {}
  },

  /** 长效缓存配置 */
  longTermCaching: {
    /**
     * 是否启用编译时文件 hash 重命名
     * @type {bool}
     */
    enable: true,

    /**
     * 文件名与 hash 连接使用的字符串
     * @type {string}
     */
    joinSymbol: '_',

    /**
     * hash 长度
     * @type {number}
     */
    fileHashLength: 8
  },

  /** uglifyJS 配置 */
  uglify: {
    /**
     * 是否启用 uglifyJS 压缩代码
     * @type {bool}
     */
    enable: true,

    options: {
      /**
       * 是否输出 `source map` 文件
       * @type {bool}
       */
      sourceMap: false
    }
  },

  /**
   * `css-loader` 配置项
   * @type {object}
   * @see {@link https://github.com/webpack-contrib/css-loader|css-loader}
   */
  cssLoader: {
    /**
     * 是否启用 `CSS Modules`
     * @type {bool}
     */
    modules: false,

    /**
     * 自定义css-modules类标识命名规则
     * @type {string}
     */
    localIdentName: '[path][name]__[local]--[hash:base64:5]'
  },

  /** stylelint 配置 */
  stylelint: {
    /**
     * 是否启用 `stylelint`
     * @type {bool}
     */
    enable: false,

    /**
     * `stylelint` 配置项
     * @type {object}
     * @see {@link https://stylelint.io/user-guide/node-api/#options|stylelint options}
     */
    options: {
      files: ['**/*.css', '**/*.less', '**/*.s?(a|c)ss']
    }
  },

  /**
   * commonChunks 配置
   * `CommonsChunkPlugin` 会将最后一个当作 `Entry chunk`
   * 该配置分别在以下过程中被调用：
   * - 在 `packing serve` 任务中被 `DllPlugin` 调用
   * - 在 `packing build` 任务中被 `CommonsChunkPlugin` 调用
   * 注意，如果配置了commonChunks，所有网页模版需要引用公共包文件
   * 否则会报错
   * <script src="/vendor.js"></script>
   * @type {string}
   */
  commonChunks: {
    // vendor: [
    //   'react',
    //   'react-dom'
    //   'packing-ajax'
    // ]
  },

  /** graphql 配置 */
  graphql: {
    /**
     * 是否使用 `GraphQL-mock-server`
     * @type {bool}
     */
    enable: false,

    /**
     * GraphQL 地址
     * @type {string}
     */
    graphqlEndpoint: '/graphql',

    /**
     * GraphiQL 地址
     * @type {string}
     */
    graphiqlEndpoint: '/graphiql'
  },

  /**
   * 静态资源类型
   * @type {array}
   */
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

  /**
   * URL转发路由规则配置
   * `require!` 表示使用本地 mock 文件
   * @type {object}
   */
  rewriteRules: {
    /** 网站URL与模版的对应路由关系 */
    '^/$': '/index.html',

    /** API转发 */
    '^/api/(.*)': 'require!/mock/api/$1.js'
    // '^/api/(.*)': '/index.jade.html',
    // '^/api/(.*)': 'http://touch.qunar.com/api/hotel/findhotelcity?cityName=%E5%8C%97%E4%BA%AC',
    // '^/hello': 'http://localhost:3001/123/4.html',
  }

};
