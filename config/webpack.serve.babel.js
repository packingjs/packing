/**
 * webpack开发环境配置文件
 * @author Joe Zhong <zhong.zhi@163.com>
 * @module config/webpack.serve.babel
 */

import { existsSync } from 'fs';
import path from 'path';
import { isString, isArray, isObject, isFunction } from 'util';
import webpack from 'webpack';
import DashboardPlugin from 'webpack-dashboard/plugin';
import packingGlob from 'packing-glob';
import autoprefixer from 'autoprefixer';
import packing, { assetExtensions } from './packing';

const {
  src,
  assets,
  assetsDist,
  entries,
  templatesPages
} = packing.path;
const { templateExtension } = packing;
const cwd = process.cwd();

 /**
  * 给所有入口js加上HRM的clientjs
  * @param {string|array|object} entry 页面入口列表
  * @param {boolean} reload 是否强制刷新页面
  * @return {array}
  */
const pushClientJS = (entry, reload) => {
  let clientJS = 'webpack-hot-middleware/client';
  if (reload) {
    clientJS += '?reload=true';
  }
  let newEntry = entry;
  if (isString(newEntry)) {
    newEntry = [clientJS, newEntry];
  } else if (isArray(newEntry)) {
    newEntry.unshift(clientJS);
  } else if (isObject(newEntry)) {
    Object.keys(newEntry).forEach((key) => {
      newEntry[key] = pushClientJS(newEntry[key], reload);
    });
  }
  return newEntry;
};

/**
 * 根据文件的目录结构生成entry配置
 * @return {object}
 */
const initConfig = () => {
  const entryConfig = {};
  const globOptions = { cwd: path.resolve(cwd, templatesPages) };
  const pattern = isArray(templateExtension) && templateExtension.length > 1 ?
    `**/*{${templateExtension.join(',')}}` :
    `**/*${templateExtension}`;

  packingGlob(pattern, globOptions).forEach((page) => {
    const ext = path.extname(page).toLowerCase();
    let key = page.replace(ext, '');
    // 写入页面级别的配置
    if (entryConfig[key]) {
      key += ext;
    }
    let value;
    if (isFunction(entries)) {
      value = entries(key);
    } else {
      value = path.resolve(cwd, entries.replace('{pagename}', key));
    }
    if (existsSync(value)) {
      entryConfig[key] = value;
    } else {
      console.log(`❗️ entry file not exist: ${value}`);
    }
  });

  return {
    entryConfig
  };
};

/**
 * 返回样式loader字符串
 * @param {string} cssPreprocessor css预处理器类型
 * @return {string}
 */
const styleLoaderString = (cssPreprocessor) => {
  const query = cssPreprocessor ? `!${cssPreprocessor}` : '';
  return `style!css?importLoaders=2!postcss${query}`;
};

/**
 * 生成webpack配置文件
 * @param {object} options 特征配置项
 * @return {object}
 */
const webpackConfig = (options) => {
  const { entryConfig } = initConfig();
  const projectRootPath = path.resolve(__dirname, '../');
  const assetsPath = path.resolve(projectRootPath, assetsDist);
  const context = path.resolve(__dirname, '..');
  const devtool = options.devtool;

  let entry = entryConfig;

  const output = {
    chunkFilename: '[name].js',
    filename: '[name].js',
    // prd环境静态文件输出地址
    path: assetsPath,
    // dev环境下数据流访问地址
    publicPath: ''
  };

  const moduleConfig = {
    loaders: [
      { test: /\.js?$/i, loaders: ['babel', 'eslint'], exclude: /node_modules/ },
      { test: /\.css$/i, loader: styleLoaderString() },
      { test: /\.less$/i, loader: styleLoaderString('less') },
      { test: /\.scss$/i, loader: styleLoaderString('sass') },
      { test: /\.json$/i, loader: 'json' },
      {
        test: new RegExp(`\.(${assetExtensions.join('|')})$`, 'i'),
        loader: `file?name=[path][name].[ext]&context=${assets}&emitFile=false`
      }
    ]
  };

  const postcss = () => [autoprefixer];

  const resolve = {
    alias: {
      'env-alias': path.resolve(__dirname, '../src/config/env', process.env.NODE_ENV)
    },
    modulesDirectories: [src, assets, 'node_modules']
  };

  const plugins = [];

  if (options.hot) {
    entry = pushClientJS(entry, options.reload);
    plugins.push(
      new webpack.HotModuleReplacementPlugin()
    );
    // moduleConfig.loaders.unshift({
    //   test: /\.js$/,
    //   loader: 'react-hot',
    //   exclude: nodeModuleReg
    // });
  }

  plugins.push(
    new webpack.DefinePlugin({
      // '__DEVTOOLS__': true,
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        CDN_ROOT: JSON.stringify(process.env.CDN_ROOT)
      }
    }),
    new DashboardPlugin()
  );

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
    entry,
    output,
    module: moduleConfig,
    postcss,
    resolve,
    plugins,
    devtool
  };
};

export default webpackConfig({
  hot: true,
  // 检测到module有变化时，强制刷新页面
  reload: false,
  devtool: 'eval-source-map'
});
