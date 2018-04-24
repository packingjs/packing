/**
 * webpack.serve.loader 配置文件
 * @author Joe Zhong <zhong.zhi@163.com>
 * @module config/webpack.serve.loader
 */

import path from 'path';
import { pRequire, getContext } from '..';
import getExistsFilePath from '../lib/get-exists-file-path';

const context = getContext();

const {
  assetExtensions,
  cssLoader: cssLoaderOptions,
  eslint: {
    enable: eslintEnable,
    options: eslintOptions
  }
} = pRequire('config/packing');

const postcssConfigFileName = '.postcssrc.js';
const postcssConfigFileInProject = path.resolve(context, postcssConfigFileName);
const postcssConfigFileInLib = path.resolve(__dirname, postcssConfigFileName);
const postcssLoaderOptions = {
  config: {
    path: getExistsFilePath(postcssConfigFileInProject, postcssConfigFileInLib)
  }
};

const jsLoaders = [
  {
    loader: 'babel-loader'
  }
];

if (eslintEnable) {
  jsLoaders.push({
    loader: 'eslint-loader',
    options: eslintOptions
  });
}

export default {
  rules: [
    {
      test: /\.js$/i,
      exclude: /node_modules/,
      use: jsLoaders
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
