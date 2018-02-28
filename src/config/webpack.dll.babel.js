/**
 * webpack开发环境配置文件
 * @author Joe Zhong <zhong.zhi@163.com>
 * @module config/webpack.serve.babel
 */

import path from 'path';
import webpack from 'webpack';
import CleanPlugin from 'clean-webpack-plugin';
import pRequire from '../util/require';

const {
  assetExtensions,
  commonChunks,
  path: {
    src,
    assets,
    dll
  }
} = pRequire('config/packing');
const cwd = process.cwd();

/**
 * 生成webpack配置文件
 * @param {object} program 程序进程，可以获取启动参数
 * @return {object}
 */
const webpackConfig = () => {
  const context = cwd;
  const devtool = 'eval';
  const entry = commonChunks;
  const output = {
    path: path.join(cwd, dll),
    filename: '[name].js',
    library: '[name]_[hash]'
  };

  const moduleConfig = {
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

  const resolve = {
    modules: [src, assets, 'node_modules']
  };

  const plugins = [
    new CleanPlugin([dll], {
      root: cwd
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
    resolve,
    plugins,
    devtool
  };
};

export default program => webpackConfig(program);
