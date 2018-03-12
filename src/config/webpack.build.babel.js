/**
 * webpack编译环境配置文件
 * @author Joe Zhong <zhong.zhi@163.com>
 * @module config/webpack.build.babel
 */

import path from 'path';
import { isFunction, isObject } from 'util';
import { yellow } from 'chalk';
// import webpack from 'webpack';
import CleanPlugin from 'clean-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
// import ReplaceHashWebpackPlugin from 'replace-hash-webpack-plugin';
import { plugin as TemplateWebpackPlugin } from 'packing-template';
import pRequire from '../util/require';

// js输出文件保持目录名称
const JS_DIRECTORY_NAME = 'js';
// js输出文件保持目录名称
const CSS_DIRECTORY_NAME = 'css';

const { NODE_ENV, CONTEXT } = process.env;
const context = CONTEXT || process.cwd();

const { cdnRoot } = pRequire(`src/profiles/${NODE_ENV}`);
const appConfig = pRequire('config/packing');
const {
  assetExtensions,
  commonChunks,
  // templateExtension,
  longTermCaching,
  longTermCachingSymbol,
  fileHashLength,
  minimize,
  cssModules,
  cssModulesIdentName = '[path][name]__[local]--[hash:base64:5]',
  path: {
    src,
    entries,
    assets,
    assetsDist,
    templatesDist
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
  const assetsPath = path.resolve(context, assetsDist);
  const chunkhash = getHashPattern('chunkhash');
  const contenthash = getHashPattern('contenthash');
  let entry = isFunction(entries) ? entries() : entries;

  const output = {
    chunkFilename: `${JS_DIRECTORY_NAME}/[name]${chunkhash}.js`,
    filename: `${JS_DIRECTORY_NAME}/[name]${chunkhash}.js`,
    // prd环境静态文件输出地址
    path: assetsPath,
    // dev环境下数据流访问地址
    publicPath: cdnRoot
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
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: cssLoaderOptions },
            { loader: 'postcss-loader' }
          ]
        })
      },
      {
        test: /\.(scss|sass)$/i,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: cssLoaderOptions },
            { loader: 'postcss-loader' },
            { loader: 'sass-loader' }
          ]
        })
      },
      {
        test: /\.less$/i,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: cssLoaderOptions },
            { loader: 'postcss-loader' },
            { loader: 'less-loader' }
          ]
        })
      },
      {
        test: new RegExp(`.(${assetExtensions.join('|')})$`, 'i'),
        loader: 'url-loader',
        options: {
          name: `[path][name]${getHashPattern('hash')}.[ext]`,
          context: assets,
          limit: 100
        }
      }
    ]
  };

  const resolve = {
    modules: [src, assets, 'node_modules']
  };

  const plugins = [
    new CleanPlugin([assetsDist, templatesDist], {
      root: context
    }),

    new TemplateWebpackPlugin(appConfig),

    // css files from the extract-text-plugin loader
    new ExtractTextPlugin({
      filename: `${CSS_DIRECTORY_NAME}/[name]${contenthash}.css`,
      allChunks: true
    })

    // new ReplaceHashWebpackPlugin({
    //   cwd: templatesDist,
    //   src: `**/*${templateExtension}`,
    //   dest: templatesDist
    // })
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
  // // 扩展阅读 http://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
  // plugins.push(new webpack.optimize.CommonsChunkPlugin({ names: chunkNames }));

  // if (minimize) {
  //   plugins.push(
  //     // optimizations
  //     new webpack.optimize.OccurrenceOrderPlugin(),
  //     new webpack.optimize.UglifyJsPlugin({
  //       compress: {
  //         warnings: false,
  //         drop_debugger: true,
  //         drop_console: true
  //       },
  //       comments: /^!/,
  //       sourceMap
  //     }),
  //   );
  // }

  return {
    mode: NODE_ENV !== 'production' ? 'development' : 'production',
    context,
    entry,
    output,
    optimization: {
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
      minimize
    },
    module,
    resolve,
    plugins
  };
};

export default program => webpackConfig(program);
