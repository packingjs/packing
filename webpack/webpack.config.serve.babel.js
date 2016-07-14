import path from 'path';
import { isString, isArray, isObject } from 'util';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'packing-html-webpack-plugin';
import glob from 'glob';
import autoprefixer from 'autoprefixer';
import packing from './packing.config';

const {
  dist,
  entries,
  templates,
  mockPageInit,
} = packing.path;
const { templateExtension } = packing;
const clientJS = 'webpack-hot-middleware/client';
const cwd = process.cwd();

/**
 * 给所有入口js加上HRM的clientjs
 */
const pushClientJS = entry => {
  let newEntry = entry;
  if (isString(newEntry)) {
    newEntry = [clientJS, newEntry];
  } else if (isArray(newEntry)) {
    newEntry.unshift(clientJS);
  } else if (isObject(newEntry)) {
    Object.keys(newEntry).forEach(key => {
      newEntry[key] = pushClientJS(newEntry[key]);
    });
  }
  return newEntry;
};

/**
 * 根据文件的目录结构生成entry配置
 */
const initConfig = () => {
  const jsExt = '.js';
  const entryConfig = {};
  const htmlWebpackPluginConfig = [];
  const extensions = isArray(templateExtension) ? templateExtension : [templateExtension];

  extensions.forEach((ext) => {
    glob.sync(`**/*${ext}`, {
      cwd: path.resolve(cwd, templates)
    }).forEach(page => {
      let key = page.replace(ext, '');
      // 写入页面级别的配置
      if (entryConfig[key]) {
        key += ext;
      }
      const value = path.resolve(cwd, entries.replace('{pagename}', key));
      entryConfig[key] = value;

      const templateInitData = path.resolve(mockPageInit, page.replace(ext, jsExt));
      htmlWebpackPluginConfig.push({
        filename: `${page}.html`,
        template: path.resolve(templates, page),
        templateInitData,
        cache: false,
        inject: false,
      });
    });
  });
  console.log(htmlWebpackPluginConfig);
  return {
    entryConfig,
    htmlWebpackPluginConfig
  };
};

const webpackConfig = (options) => {
  const { entryConfig, htmlWebpackPluginConfig } = initConfig();
  const projectRootPath = path.resolve(__dirname, '../');
  const assetsPath = path.resolve(projectRootPath, `./${dist}/assets`);
  const chunkhash = options.longTermCaching ? '-[chunkhash:8]' : '';
  const progress = options.progress;
  const context = path.resolve(__dirname, '..');

  let entry = entryConfig;

  const output = {
    chunkFilename: `[name]${chunkhash}.js`,
    filename: `[name]${chunkhash}.js`,
    // prd环境静态文件输出地址
    path: assetsPath,
    // dev环境下数据流访问地址
    publicPath: '',
    // publicPath: '/js/'
  };

  /* eslint-disable */
  let moduleConfig = {
    loaders: [
      { test: /\.js?$/, loaders: ['babel', 'eslint'], exclude: /node_modules/},
      { test: /\.less$/, loader: 'style!css?importLoaders=2&localIdentName=[local]___[hash:base64:8]!postcss!less?outputStyle=expanded' },
      { test: /\.scss$/, loader: 'style!css?importLoaders=2&localIdentName=[local]___[hash:base64:8]!postcss!sass?outputStyle=expanded' },
      { test: /\.json$/, loader: 'json' },
      { test: /\.(jpg|png|gif|ttf|woff|woff2|eot|svg)$/, loader: 'url?name=[name]-[hash:8].[ext]&limit=10000' },
      { test: /\.jade$/, loader: 'jade' },
      { test: /\.html$/, loader: 'html' },
      { test: /\.ejs$/, loader: 'ejs' },
      { test: /\.(tpl|smart)$/, loader: 'smarty' },
      { test: /\.handlebars$/, loader: 'handlebars' },
      { test: /\.mustache$/, loader: 'mustache' },
      { test: /\.md$/, loader: 'html!markdown' },
    ]
  };

  const postcss = () => [autoprefixer];

  const resolve = {
    alias: {
      'env-alias': path.resolve(__dirname, '../src/config/env', process.env.NODE_ENV)
    },
    modulesDirectories: [
      'src',
      'node_modules'
    ],
    extensions: ['', '.json', '.js', '.jsx']
  };

  const plugins = htmlWebpackPluginConfig.map((item) => new HtmlWebpackPlugin(item));

  if (options.hot) {
    entry = pushClientJS(entry);
    plugins.push(
      new webpack.HotModuleReplacementPlugin()
    );
    // moduleConfig.loaders.unshift({
    //   test: /\.js$/,
    //   loader: 'react-hot',
    //   exclude: nodeModuleReg
    // });
  }


  // 从配置文件中获取并生成webpack打包配置
  if (packing.commonChunks) {
    const chunkKeys = Object.keys(packing.commonChunks);
    chunkKeys.forEach((key) => {
      entry[key] = packing.commonChunks[key];
    });

    // 扩展阅读 http://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
    plugins.push(
      new webpack.optimize.CommonsChunkPlugin({ names: chunkKeys })
    );
  }

  return {
    context,
    progress,
    entry,
    output,
    module: moduleConfig,
    postcss,
    resolve,
    plugins,
  };
};

export default webpackConfig({
  progress: true,
  hot: true,
});
