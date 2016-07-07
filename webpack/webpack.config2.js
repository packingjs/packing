import path from 'path';
import HtmlWebpackPlugin from 'packing-html-webpack-plugin';
import glob from 'glob';
import packing from './packing.config';

const { templateExtension } = packing;
const { dist, templatesPagesDist } = packing.path;
const htmlWebpackPluginConfig = [];

glob.sync(`**/*${templateExtension}`, {
  cwd: path.resolve(templatesPagesDist)
}).forEach(page => {
  const key = page.replace(templateExtension, '');
  const templateInitData = path.resolve('mock/pages', page.replace(templateExtension, '.js'));
  htmlWebpackPluginConfig.push({
    filename: page.replace(templateExtension, '.html'),
    template: path.resolve(templatesPagesDist, page),
    templateInitData,
    cache: false,
    inject: false,
    chunks: [key],
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
  ]
};

const plugins = htmlWebpackPluginConfig.map((item) => new HtmlWebpackPlugin(item));

export default {
  output,
  module: moduleConfig,
  plugins,
};
