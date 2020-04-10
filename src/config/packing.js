/**
 * `packing` 配置模块
 * @module config/packing
 */
import path from 'path';
import packingGlob from 'packing-glob';

const context = process.env.CONTEXT || process.cwd();

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
      const entryFileName = 'entry.+(js|tsx)';
      const entryPath = 'src/pages';
      const entryPattern = `**/${entryFileName}`;
      const cwd = path.resolve(context, entryPath);
      const config = {};
      packingGlob(entryPattern, { cwd }).forEach((page) => {
        const key = path.dirname(page);
        config[key] = path.join(cwd, page);
      });
      return config;
    }
  },

  /** 模版配置 */
  template: {
    /**
     * 是否启用 packing template
     * @type {bool}
     */
    enabled: true,

    /**
     * packing template 选项
     * @type {object}
     */
    options: {
      /**
       * 模版引擎类型
       * 目前支持
       * - html
       * - pug
       * - ejs
       * - handlebars
       * - smarty
       * - velocity
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
       * 如需兼容 packing@<3.0.0 的工程，该值设置为 false
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
       * `manifest.json` 输出位置
       * @type {string}
       */
      manifest: 'manifest.json',

      /**
       * 母模版位置
       * @type {string}
       */
      master: 'src/templates/pages/default.pug',

      /**
       * 输出网页使用的字符编码
       * @type {string}
       */
      charset: 'UTF-8',

      /**
       * 输出网页使用的标题
       * @type {string}
       */
      title: '',

      /**
       * 输出网页使用的 favicon 图标
       * - false: 不使用 favicon 图标
       * - 非空字符串: favicon 图标的位置
       * @type {(bool|string)}
       */
      favicon: false,

      /**
       * 输出网页使用的关键字
       * @type {(bool|string)}
       */
      keywords: false,

      /**
       * 输出网页使用的描述
       * @type {(bool|string)}
       */
      description: false,

      /**
       * 网页文件中需要在编译时替换为 _hash 的标签属性列表
       * 格式为 tag:attribute
       * 如果想对所有标签的某个属性替换，请使用 * 代替 tag
       * 如所有标签的 src 属性都需要替换，则使用 *:src
       * @example ['*:src', 'link:href']
       * @type {array}
       */
      attrs: ['img:src', 'link:href'],

      /**
       * 模版中命中的静态文件编译输出的文件名
       * @type {string}
       */
      path: '[path][name]_[hash:8].[ext]'
    }

  },

  /** HRM 配置 */
  hot: {
    /**
     * 是否启用热模块替换
     * @type {bool}
     */
    enabled: true,

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
    enabled: true,

    /**
     * 缓存选项
     * @type {object}
     */
    options: {
      /**
       * 文件名与 hash 连接使用的字符串
       * @type {string}
       */
      delimiter: '_',

      /**
       * hash 长度
       * @type {number}
       */
      fileHashLength: 8
    }
  },

  /** 压缩代码配置 */
  minimize: {
    /**
     * 是否压缩代码
     * @type {bool}
     */
    enabled: true,

    /**
     * terser plugin 配置
     * @type {object}
     */
    options: {
      // sourceMap: true,
      terserOptions: {
        output: {
          // 删除注释
          comments: false
        }
      }
    }
  },

  /**
   * `css-loader` 配置项
   * @type {object}
   * @see {@link https://github.com/webpack-contrib/css-loader|css-loader}
   */
  cssLoader: {
    /**
     * 在 css loader 之前应用的 loader 数量
     * @type {number}
     */
    importLoaders: 2,
    /**
     * 是否启用 `CSS Modules`
     * @type {bool}
     */
    modules: false
    // modules: {
    // /**
    //  * 自定义css-modules类标识命名规则
    //  * @type {string}
    //  */
    //   localIdentName: '[path]__[name]___[local]_[hash:base64:5]'
    // }
  },

  /** eslint 配置 */
  eslint: {
    /**
     * 是否启用 `eslint`
     * @type {bool}
     */
    enabled: true,

    /**
     * `eslint` 配置项
     * @type {object}
     * @see {@link https://github.com/webpack-contrib/eslint-loader|eslint options}
     */
    options: {
    }
  },

  /**
   * runtimeChunk 配置
   * @see https://webpack.js.org/plugins/split-chunks-plugin/
   */
  runtimeChunk: {
    /**
     * 是否启用 runtimeChunk
     * @type {bool}
     */
    enabled: false,

    /**
     * runtimeChunk 输出的文件名
     * @type {string}
     */
    name: 'runtime'
  },

  /**
   * commonChunks 配置
   * 可以配置多个 common 包，配置的包名称会转换为正则表达式
   * 该配置分别在以下过程中被调用：
   * - 在 `packing serve` 任务中被 `DllPlugin` 调用
   * - 在 `packing build` 任务中被 `SplitChunkPlugin` 调用
   * 注意，如果配置了commonChunks，所有网页模版需要引用公共包文件
   * 否则会报错
   * <script src="/vendor.js"></script>
   * @type {object}
   * @see https://webpack.js.org/plugins/split-chunks-plugin/
   */
  commonChunks: {
    // vendor: [
    //   'react',
    //   'react-dom'
    //   'packing-ajax'
    // ]
  },

  /**
   * webpack-bundle-analyzer 配置
   * @see https://www.npmjs.com/package/webpack-bundle-analyzer
   */
  bundleAnalyzer: {
    /**
     * 是否启用 webpack-bundle-analyzer
     * @type {bool}
     */
    enabled: true,

    /**
     * `webpack-bundle-analyzer` 配置项
     * @type {object}
     */
    options: {
    }
  },

  /** graphql 配置 */
  graphql: {
    /**
     * 是否使用 `GraphQL-mock-server`
     * @type {bool}
     */
    enabled: false,

    options: {
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
    }
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
    // '^/$': '/index',

    /** API转发 */
    '^/api/(.*)': 'require!/mock/api/$1.js'
    // '^/api/(.*)': '/index.jade.html',
    // '^/api/(.*)': 'http://touch.qunar.com/api/hotel/findhotelcity?cityName=%E5%8C%97%E4%BA%AC',
    // '^/hello': 'http://localhost:3001/123/4.html',
  },

  /**
   * packing-serve使用的webpackDevMiddleware配置项
   * @type {object}
   */
  devMwOptions: {
    /**
     * 是否将中间产物写入文件
     * @type {bool|function}
     */
    writeToDisk: false
  },

  /**
   * packing-serve是否支持部分页面编译
   * @type {object}
   */
  partialCompile: {
    /**
     * 是否启用部分页面编译
     * @type {bool}
     */
    enabled: false,

    /**
     * 默认编译的页面
     * @type {array}
     */
    whitelist: []
  }
};
