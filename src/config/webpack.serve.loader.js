/**
 * webpack.serve.loader 配置文件
 * @author Joe Zhong <zhong.zhi@163.com>
 * @module config/webpack.serve.loader
 */

import path from 'path';
import { pRequire } from '..';
import getExistsFilePath from '../lib/getExistsFilePath';

const {
  assetExtensions,
  cssLoader: cssLoaderOptions
} = pRequire('config/packing');

const postcssConfigFileName = 'postcss.config.js';
const postcssConfigFileInProject = path.resolve(context, postcssConfigFileName);
const postcssConfigFileInLib = path.resolve(__dirname, postcssConfigFileName);
const postcssLoaderOptions = {
  config: {
    path: getExistsFilePath(postcssConfigFileInProject, postcssConfigFileInLib)
  }
};

export default {
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
        { loader: 'css-loader', options: cssLoaderOptions },
        { loader: 'postcss-loader', options: postcssLoaderOptions }
      ]
    },
    {
      test: /\.(scss|sass)$/i,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader', options: cssLoaderOptions },
        { loader: 'postcss-loader', options: postcssLoaderOptions },
        { loader: 'sass-loader' }
      ]
    },
    {
      test: /\.less$/i,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader', options: cssLoaderOptions },
        { loader: 'postcss-loader', options: postcssLoaderOptions },
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
