/**
 * webpack开发环境配置文件
 * @author Joe Zhong <zhong.zhi@163.com>
 * @module config/webpack.serve.babel
 */

import path from 'path';
import { isString, isArray, isObject, isFunction } from 'util';
import webpack from 'webpack';
import OpenBrowserPlugin from 'open-browser-webpack-plugin';
import WebpackPwaManifest from 'webpack-pwa-manifest';
import StylelintWebpackPlugin from 'stylelint-webpack-plugin';
import '../bootstrap';
import { pRequire, getContext, requireDefault } from '..';

const {
  assetExtensions,
  localhost,
  port,
  hot,
  cssModules,
  cssModulesIdentName,
  commonChunks,
  templateInjectManifest,
  stylelint,
  stylelintOptions,
  path: {
    src: {
      root: src
    },
    tmpDll,
    entries
  }
} = pRequire('config/packing');

/**
 * 给所有入口js加上HRM的clientjs
 * @param {string|array|object} entry 页面入口列表
 * @return {array}
 */
const pushClientJS = (entry) => {
  const clientJS = 'webpack-hot-middleware/client';
  let newEntry = entry;
  if (isString(newEntry)) {
    newEntry = [clientJS, newEntry];
  } else if (isArray(newEntry)) {
    newEntry.unshift(clientJS);
  } else if (isObject(newEntry)) {
    Object.keys(newEntry).forEach((key) => {
      newEntry[key] = pushClientJS(newEntry[key]);
    });
  }
  return newEntry;
};

/**
 * 生成webpack配置文件
 * @param {object} program 程序进程，可以获取启动参数
 * @param {object} options 特征配置项
 * @return {object}
 */
const webpackConfig = (program) => {
  const context = getContext();
  const dllPath = path.resolve(context, tmpDll);

  let entry = isFunction(entries) ? entries() : entries;

  const mode = 'development';

  const output = {
    chunkFilename: '[name].js',
    filename: '[name].js',
    // prd环境静态文件输出地址
    path: context,
    // dev环境下数据流访问地址
    publicPath: '/'
  };

  // 开启css-modules时的配置
  const cssModulesOptions = cssModules ? { module: true, localIdentName: cssModulesIdentName } : {};
  const cssLoaderOptions = Object.assign({ importLoaders: 2 }, cssModulesOptions);

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
          { loader: 'css-loader', options: cssLoaderOptions },
          { loader: 'postcss-loader' }
        ]
      },
      {
        test: /\.(scss|sass)$/i,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: cssLoaderOptions },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' }
        ]
      },
      {
        test: /\.less$/i,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: cssLoaderOptions },
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
    modules: [path.resolve(context, src), 'node_modules']
  };

  const plugins = [];

  if (stylelint) {
    plugins.push(new StylelintWebpackPlugin({
      ...{ context: path.resolve(context, src) },
      ...stylelintOptions
    }));
  }

  if (templateInjectManifest) {
    plugins.push(new WebpackPwaManifest({
      ...requireDefault(path.resolve(context, 'config/webpack.manifest')),
      ...{ filename: '[name][ext]' }
    }));
  }

  if (hot) {
    entry = pushClientJS(entry);
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  if (program.open_browser) {
    plugins.push(new OpenBrowserPlugin({ url: `http://${localhost}:${port.dev}` }));
  }

  // 从配置文件中获取dll
  if (commonChunks && Object.keys(commonChunks).length > 0) {
    Object.keys(commonChunks).forEach((key) => {
      plugins.push(new webpack.DllReferencePlugin({
        context,
        // eslint-disable-next-line
        manifest: require(path.resolve(dllPath, `${key}-manifest.json`))
      }));
    });
  }

  const performance = { hints: false };

  return {
    mode,
    context,
    entry,
    output,
    module,
    resolve,
    plugins,
    performance
  };
};

export default program => webpackConfig(program);
