/**
 * webpack开发环境配置文件
 * @author Joe Zhong <zhong.zhi@163.com>
 * @module config/webpack.serve.babel
 */

import path from 'path';
import webpack from 'webpack';
import CleanPlugin from 'clean-webpack-plugin';
import autoprefixer from 'autoprefixer';
import packing, { assetExtensions } from './packing';

const {
  src,
  assets,
  dll
} = packing.path;

const projectRootPath = path.resolve(__dirname, '../');

/**
 * 返回样式loader字符串
 * @param {string} cssPreprocessor css预处理器类型
 * @return {string}
 */
const styleLoaderString = (cssPreprocessor) => {
  const query = cssPreprocessor ? `!${cssPreprocessor}` : '';
  return `style!css?importLoaders=2!postcss${query}`;
};

/**
 * 生成webpack配置文件
 * @param {object} options 特征配置项
 * @return {object}
 */
const webpackConfig = (options) => {
  const context = path.resolve(__dirname, '..');
  const devtool = options.devtool;

  const entry = packing.commonChunks;

  const output = {
    path: path.join(context, dll),
    filename: '[name].js',
    library: '[name]_[hash]'
  };

  const moduleConfig = {
    loaders: [
      { test: /\.js?$/i, loaders: ['babel', 'eslint'], exclude: /node_modules/ },
      { test: /\.css$/i, loader: styleLoaderString() },
      { test: /\.less$/i, loader: styleLoaderString('less') },
      { test: /\.scss$/i, loader: styleLoaderString('sass') },
      {
        test: new RegExp(`.(${assetExtensions.join('|')})$`, 'i'),
        loader: `file?name=[path][name].[ext]&context=${assets}&emitFile=false`
      }
    ]
  };

  const postcss = () => [autoprefixer];

  const resolve = {
    modulesDirectories: [src, assets, 'node_modules']
  };

  const plugins = [
    new CleanPlugin([dll], {
      root: projectRootPath
    }),
    new webpack.DllPlugin({
      path: path.join(output.path, '[name]-manifest.json'),
      name: '[name]_[hash]'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ];

  return {
    context,
    entry,
    output,
    module: moduleConfig,
    postcss,
    resolve,
    plugins,
    devtool
  };
};

export default webpackConfig({
  hot: false,
  // 检测到module有变化时，强制刷新页面
  reload: false,
  devtool: 'eval'
});
