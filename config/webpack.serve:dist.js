/**
 * webpack预览编译后结果的配置文件
 * @author Joe Zhong <zhong.zhi@163.com>
 * @module config/webpack.serve:dist
 */

import { isArray } from 'util';
import path from 'path';
import HtmlWebpackPlugin from 'packing-html-webpack-plugin';
import packingGlob from 'packing-glob';
import packing from './packing';

const { templateExtension } = packing;
const { dist, templatesDistPages, mockPageInit } = packing.path;
const htmlWebpackPluginConfig = [];
const globOptions = { cwd: path.resolve(templatesDistPages) };
const jsExt = '.js';
const pattern = isArray(templateExtension) && templateExtension.length > 1 ?
  `**/*{${templateExtension.join(',')}}` :
  `**/*${templateExtension}`;

packingGlob(pattern, globOptions).forEach(page => {
  const ext = path.extname(page).toLowerCase();
  const templateInitData = path.resolve(mockPageInit, page.replace(ext, jsExt));
  htmlWebpackPluginConfig.push({
    filename: ext === '.html' ? page : `${page}.html`,
    template: path.resolve(templatesDistPages, page),
    templateInitData,
    cache: false,
    inject: false
  });
});


const projectRootPath = path.resolve(__dirname, '../');
const assetsPath = path.resolve(projectRootPath, dist);

const output = {
  // prd环境静态文件输出地址
  path: assetsPath
};

const moduleConfig = {
  loaders: [
    { test: /\.(jade|pug)$/i, loader: 'pug' },
    { test: /\.html$/i, loader: 'html' },
    { test: /\.ejs$/i, loader: 'ejs' },
    { test: /\.(tpl|smarty)$/i, loader: 'smarty' },
    { test: /\.handlebars$/i, loader: 'handlebars' },
    { test: /\.mustache$/i, loader: 'mustache' }
  ]
};

const plugins = htmlWebpackPluginConfig.map((item) => new HtmlWebpackPlugin(item));

export default {
  output,
  module: moduleConfig,
  plugins
};
