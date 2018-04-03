/**
 * webpack开发环境配置文件
 * @author Joe Zhong <zhong.zhi@163.com>
 * @module config/webpack.dll.babel
 */

import { resolve } from 'path';
import webpack from 'webpack';
import CleanPlugin from 'clean-webpack-plugin';
import '../bootstrap';
import { pRequire, getContext } from '..';

/**
 * 生成webpack配置文件
 * @param {object} program 程序进程，可以获取启动参数
 * @return {object}
 */

export default () => {
  const context = getContext();
  const {
    assetExtensions,
    commonChunks,
    path: {
      tmpDll
    }
  } = pRequire('config/packing');

  const output = {
    filename: '[name].js',
    path: resolve(context, tmpDll),
    library: '[name]_[hash]'
  };

  const module = {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'eslint-loader'
          }
        ]
      },
      {
        test: /\.css$/i,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { importLoaders: 2 } },
          { loader: 'postcss-loader' }
        ]
      },
      {
        test: /\.(scss|sass)$/i,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { importLoaders: 2 } },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' }
        ]
      },
      {
        test: /\.less$/i,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { importLoaders: 2 } },
          { loader: 'postcss-loader' },
          { loader: 'less-loader' }
        ]
      },
      {
        test: new RegExp(`.(${assetExtensions.join('|')})$`, 'i'),
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
          publicPath: '/'
        }
      }
    ]
  };

  const plugins = [
    new CleanPlugin(tmpDll, {
      root: context,
      verbose: false
    }),
    new webpack.DllPlugin({
      name: '[name]_[hash]',
      path: resolve(context, `${tmpDll}/[name]-manifest.json`)
    })
  ];

  return {
    mode: 'development',
    context,
    entry: commonChunks,
    output,
    module,
    plugins
  };
};
