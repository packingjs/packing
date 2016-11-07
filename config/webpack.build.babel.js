/**
 * webpack编译环境配置文件
 * @author Joe Zhong <zhong.zhi@163.com>
 * @module config/webpack.build.babel
 */

import path from 'path';
import { isFunction } from 'util';
import webpack from 'webpack';
import CleanPlugin from 'clean-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import ReplaceHashWebpackPlugin from 'replace-hash-webpack-plugin';
import autoprefixer from 'autoprefixer';
import pRequire from '../util/require';

// js输出文件保持目录名称
const JS_DIRECTORY_NAME = 'js';
// js输出文件保持目录名称
const CSS_DIRECTORY_NAME = 'css';

const packing = pRequire('config/packing');
const { assetExtensions, fileHashLength, templateExtension } = packing;
const { src, templates, entries, assets, assetsDist, templatesDist } = packing.path;

/**
 * 返回样式loader字符串
 * @param {string} cssPreprocessor css预处理器类型
 * @return {string}
 */
const styleLoaderString = (cssPreprocessor) => {
  const query = cssPreprocessor ? `!${cssPreprocessor}` : '';
  return ExtractTextPlugin.extract('style', `css?importLoaders=2!postcss${query}`);
};

/**
 * 生成webpack配置文件
 * @param {object} program 程序进程，可以获取启动参数
 * @param {object} options 特征配置项
 * @return {object}
 */
const webpackConfig = (program, options) => {
  const projectRootPath = process.cwd();
  const assetsPath = path.resolve(projectRootPath, assetsDist);
  const chunkhash = options.longTermCaching ? `-[chunkhash:${fileHashLength}]` : '';
  const contenthash = options.longTermCaching ? `-[contenthash:${fileHashLength}]` : '';
  const context = projectRootPath;
  const entry = isFunction(entries) ? entries() : entries;

  const output = {
    chunkFilename: `${JS_DIRECTORY_NAME}/[name]${chunkhash}.js`,
    filename: `${JS_DIRECTORY_NAME}/[name]${chunkhash}.js`,
    // prd环境静态文件输出地址
    path: assetsPath,
    // dev环境下数据流访问地址
    publicPath: '',
  };

  const moduleConfig = {
    loaders: [
      { test: /\.js?$/i, loaders: ['babel'], exclude: /node_modules/ },
      { test: /\.css$/i, loader: styleLoaderString() },
      { test: /\.less$/i, loader: styleLoaderString('less') },
      { test: /\.scss$/i, loader: styleLoaderString('sass') },
      {
        test: new RegExp(`.(${assetExtensions.join('|')})$`, 'i'),
        loader: `url?name=[path][name]-[hash:${fileHashLength}].[ext]&context=${assets}&limit=100!image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false`,
      },
    ],
  };

  const postcss = () => [autoprefixer];

  const resolve = {
    modulesDirectories: [src, assets, 'node_modules'],
  };

  const plugins = [
    new CleanPlugin([assetsDist, templatesDist], {
      root: projectRootPath,
    }),

    // css files from the extract-text-plugin loader
    new ExtractTextPlugin(`${CSS_DIRECTORY_NAME}/[name]${contenthash}.css`, {
      allChunks: true,
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        CDN_ROOT: JSON.stringify(process.env.CDN_ROOT),
      },
    }),

    new ReplaceHashWebpackPlugin({
      assetsDomain: process.env.CDN_ROOT,
      cwd: templates,
      src: `**/*${templateExtension}`,
      dest: templatesDist,
    }),

  ];

  // 从配置文件中获取并生成webpack打包配置
  if (packing.commonChunks) {
    const chunkKeys = Object.keys(packing.commonChunks);
    chunkKeys.forEach((key) => {
      entry[key] = packing.commonChunks[key];
    });

    // 扩展阅读 http://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
    plugins.push(
      new webpack.optimize.CommonsChunkPlugin({ names: chunkKeys, children: true })
    );
  }

  if (options.minimize) {
    plugins.push(
      // optimizations
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_debugger: true,
          drop_console: true,
        },
        comments: /^!/,
        sourceMap: options.sourceMap,
      })
    );
  }

  // 在编译机上编译需要调整目录结构
  // 把编译后的模版目录移动到根目录
  // if (process.env.NODE_ENV !== '') {
  //   plugins.push(
  //     new MoveWebpackPlugin({
  //       src: templatesDist,
  //       dest: ''
  //     }, 'done')
  //   );
  // }

  return {
    context,
    entry,
    output,
    module: moduleConfig,
    postcss,
    resolve,
    plugins,
  };
};

export default program => webpackConfig(program, {
  devtool: false,
  longTermCaching: true,
  minimize: true,
  sourceMap: false,
});
