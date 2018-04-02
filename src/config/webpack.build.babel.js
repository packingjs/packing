/**
 * webpack编译环境配置文件
 * @author Joe Zhong <zhong.zhi@163.com>
 * @module config/webpack.build.babel
 */

import path from 'path';
import { isFunction, isObject } from 'util';
import { yellow } from 'chalk';
import CleanPlugin from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { plugin as PackingTemplatePlugin } from '..';
import '../bootstrap';
import { pRequire, getContext } from '..';

// js输出文件保持目录名称
const JS_DIRECTORY_NAME = 'js';
// js输出文件保持目录名称
const CSS_DIRECTORY_NAME = 'css';

const { NODE_ENV, CDN_ROOT } = process.env;
const context = getContext();
const appConfig = pRequire('config/packing');
const {
  assetExtensions,
  commonChunks,
  longTermCaching,
  longTermCachingSymbol,
  fileHashLength,
  minimize,
  cssModules,
  cssModulesIdentName,
  path: {
    src: {
      root: srcRoot
    },
    dist: {
      root: distRoot
    },
    entries
  }
} = appConfig;

const getHashPattern = (type) => {
  let hashPattern = '';

  if (longTermCaching) {
    hashPattern = `${longTermCachingSymbol}[${type}:${fileHashLength}]`;
  }
  return hashPattern;
};

/**
 * 生成webpack配置文件
 * @param {object} program 程序进程，可以获取启动参数
 * @param {object} options 特征配置项
 * @return {object}
 */
const webpackConfig = () => {
  const outputPath = path.resolve(context, distRoot);
  const chunkhash = getHashPattern('chunkhash');
  const contenthash = getHashPattern('contenthash');
  let entry = isFunction(entries) ? entries() : entries;

  const output = {
    chunkFilename: `${JS_DIRECTORY_NAME}/[name]${chunkhash}.js`,
    filename: `${JS_DIRECTORY_NAME}/[name]${chunkhash}.js`,
    // prd环境静态文件输出地址
    path: outputPath,
    // dev环境下数据流访问地址
    publicPath: CDN_ROOT
  };

  // 开启css-modules时的配置
  const cssModulesOptions = cssModules ? { module: true, localIdentName: cssModulesIdentName } : {};
  const cssLoaderOptions = Object.assign({
    importLoaders: 2,
    minimize: { minifyFontValues: false }
  }, cssModulesOptions);

  const module = {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.css$/i,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader', options: cssLoaderOptions },
          { loader: 'postcss-loader' }
        ]
      },
      {
        test: /\.(scss|sass)$/i,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader', options: cssLoaderOptions },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' }
        ]
      },
      {
        test: /\.less$/i,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader', options: cssLoaderOptions },
          { loader: 'postcss-loader' },
          { loader: 'less-loader' }
        ]
      },
      {
        test: new RegExp(`.(${assetExtensions.join('|')})$`, 'i'),
        loader: 'file-loader',
        options: {
          // context 参数会影响静态文件打包输出的路径
          name: `[path][name]${getHashPattern('hash')}.[ext]`
        }
      }
    ]
  };

  const resolve = {
    modules: [srcRoot, 'node_modules']
  };

  const plugins = [
    new CleanPlugin([distRoot]),

    new PackingTemplatePlugin(appConfig),

    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: `${CSS_DIRECTORY_NAME}/[name]${contenthash}.css`,
      // filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ];

  // 从配置文件中获取并生成webpack打包配置
  // fix: #14
  let chunkNames = [];
  if (commonChunks && Object.keys(commonChunks).length > 0) {
    const manifestChunkName = 'manifest';
    chunkNames = Object.keys(commonChunks);
    const lastChunkName = chunkNames[chunkNames.length - 1];
    // 确保manifest放在最后
    if (lastChunkName !== manifestChunkName) {
      chunkNames.push(manifestChunkName);
    }
    // 检测chunk配置的有效性
    const index = chunkNames.indexOf(manifestChunkName);
    if (index !== chunkNames.length - 1) {
      // manifest位置不对时，校正配置并给出提示
      chunkNames.splice(index, 1);
      console.log(yellow('⚠️  There is a problem with the manifest package configuration. Packing has automatically repaired the error configuration'));
    }
    chunkNames.filter(name => name !== manifestChunkName).forEach((key) => {
      if (isObject(entry)) {
        entry[key] = commonChunks[key];
      } else {
        entry = {
          main: entry,
          [key]: commonChunks[key]
        };
      }
    });
  }

  const optimization = {
    // splitChunks: {
    //   cacheGroups: {
    //     vendor: {
    //       chunks: 'initial',
    //       test: 'vendor1',
    //       name: 'vendor1',
    //       enforce: true
    //     }
    //   }
    // },
    // minimizer: [
    //   new UglifyJsPlugin({
    //     cache: true,
    //     parallel: true,
    //     sourceMap: true // set to true if you want JS source maps
    //   })
    // ],
    minimize
  };

  return {
    mode: NODE_ENV !== 'production' ? 'development' : 'production',
    context,
    entry,
    output,
    optimization,
    module,
    resolve,
    plugins
  };
};

export default program => webpackConfig(program);
