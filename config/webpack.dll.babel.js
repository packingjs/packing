/**
 * webpack开发环境配置文件
 * @author Joe Zhong <zhong.zhi@163.com>
 * @module config/webpack.serve.babel
 */

import path from 'path';
import webpack from 'webpack';
import CleanPlugin from 'clean-webpack-plugin';
import autoprefixer from 'autoprefixer';
import pRequire from '../util/require';

const packing = pRequire('config/packing');
const { assetExtensions } = packing;
const { src, assets, dll } = packing.path;
const cwd = process.cwd();

/**
 * 生成webpack配置文件
 * @param {object} program 程序进程，可以获取启动参数
 * @return {object}
 */
const webpackConfig = () => {
  const context = cwd;
  const devtool = 'eval';
  const entry = packing.commonChunks;
  const output = {
    path: path.join(cwd, dll),
    filename: '[name].js',
    library: '[name]_[hash]',
  };

  const moduleConfig = {
    rules: [
      {
        id: 'js',
        test: /\.js?$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'eslint-loader',
          },
        ],
      },
      {
        id: 'css',
        test: /\.css$/i,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', query: { importLoaders: 2 } },
          { loader: 'postcss-loader' },
        ],
      },
      {
        id: 'sass',
        test: /\.scss$/i,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', query: { importLoaders: 2 } },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' },
        ],
      },
      {
        id: 'less',
        test: /\.less$/i,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', query: { importLoaders: 2 } },
          { loader: 'postcss-loader' },
          { loader: 'less-loader' },
        ],
      },
      {
        id: 'assets',
        test: new RegExp(`.(${assetExtensions.join('|')})$`, 'i'),
        loader: 'file-loader',
        query: {
          name: '[path][name].[ext]',
          context: assets,
          emitFile: false,
        },
      },
    ],
  };

  const resolve = {
    modules: [src, assets, 'node_modules'],
  };

  const plugins = [
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [autoprefixer],
      },
    }),
    new CleanPlugin([dll], {
      root: cwd,
    }),

    new webpack.DllPlugin({
      path: path.join(output.path, '[name]-manifest.json'),
      name: '[name]_[hash]',
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),

  ];

  return {
    context,
    entry,
    output,
    module: moduleConfig,
    postcss,
    resolve,
    plugins,
    devtool,
  };
};

export default program => webpackConfig(program);
