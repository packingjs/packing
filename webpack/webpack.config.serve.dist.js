import { isArray } from 'util';
import path from 'path';
import HtmlWebpackPlugin from 'packing-html-webpack-plugin';
import glob from 'glob';
import packing from './packing.config';

const { templateExtension } = packing;
const { dist, templatesDist, mockPageInit } = packing.path;
const htmlWebpackPluginConfig = [];
const globOptions = { cwd: path.resolve(templatesDist) };
const jsExt = '.js';
const extensions = isArray(templateExtension) ? templateExtension : [templateExtension];

extensions.forEach((ext) => {
  glob.sync(`**/*${ext}`, globOptions).forEach(page => {
    const templateInitData = path.resolve(mockPageInit, page.replace(ext, jsExt));
    htmlWebpackPluginConfig.push({
      filename: `${page}.html`,
      template: path.resolve(templatesDist, page),
      templateInitData,
      cache: false,
      inject: false,
    });
  });
});

const projectRootPath = path.resolve(__dirname, '../');
const assetsPath = path.resolve(projectRootPath, dist);

const output = {
  // prd环境静态文件输出地址
  path: assetsPath,
};

const moduleConfig = {
  loaders: [
    { test: /\.jade$/, loader: 'jade' },
    { test: /\.html$/, loader: 'html' },
    { test: /\.ejs$/, loader: 'ejs' },
    { test: /\.tpl$|.smarty$/, loader: 'smarty' },
    { test: /\.handlebars$/, loader: 'handlebars' },
    { test: /\.mustache$/, loader: 'mustache' },
    { test: /\.md$/, loader: 'html!markdown' },
  ]
};

const plugins = htmlWebpackPluginConfig.map((item) => new HtmlWebpackPlugin(item));

export default {
  output,
  module: moduleConfig,
  plugins,
};
