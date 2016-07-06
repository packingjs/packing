import path from 'path';
import HtmlWebpackPlugin from 'packing-html-webpack-plugin';
import glob from 'glob';
import packing from './packing.config';

const { dist, assets, templatesPagesDist } = packing.path;

const htmlWebpackPluginConfig = [];
const ext = '.jade';
glob.sync(`**/*${ext}`, {
  cwd: path.resolve(templatesPagesDist)
}).forEach(page => {
  const key = page.replace(ext, '');
  const templateInitData = path.resolve('mock/page', page.replace(ext, '.js'));
  htmlWebpackPluginConfig.push({
    filename: page.replace(ext, '.html'),
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

/* eslint-disable */
let moduleConfig = {
  loaders: [
    { test: /\.jpg$/, loader: 'url?name=[name]-[hash:6].[ext]&limit=10240' },
    { test: /\.jade$/, loader: 'jade' },
  ]
};
/* eslint-enable */

const plugins = htmlWebpackPluginConfig.map((item) => new HtmlWebpackPlugin(item));

export default {
  // devtool,
  // context,
  // progress,
  // entry,
  output,
  module: moduleConfig,
  // resolve,
  plugins,
};
