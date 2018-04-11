/**
 * webpack编译环境配置文件
 * @author Joe Zhong <zhong.zhi@163.com>
 * @module config/webpack.build.babel
 */

import path from 'path';
import { isObject } from 'util';
import { yellow } from 'chalk';
import CleanPlugin from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import WebpackPwaManifest from 'webpack-pwa-manifest';
import StylelintWebpackPlugin from 'stylelint-webpack-plugin';
import { plugin as PackingTemplatePlugin } from '..';
import '../bootstrap';
import { pRequire, getContext, requireDefault } from '..';
import getEntries from '../lib/getEntries';

const { NODE_ENV, CDN_ROOT } = process.env;
const context = getContext();
const appConfig = pRequire('config/packing');
const {
  assetExtensions,
  commonChunks,
  longTermCaching: {
    enable: longTermCachingEnable,
    delimiter,
    fileHashLength
  },
  // minimize,
  cssLoader,
  template: {
    injectManifest
  },
  stylelint: {
    enable: stylelintEnable,
    options: stylelintOptions
  },
  minimize,
  path: {
    src: {
      root: srcRoot
    },
    dist: {
      root: distRoot,
      js,
      css
    },
    entries
  }
} = appConfig;

const getHashPattern = (type) => {
  let hashPattern = '';

  if (longTermCachingEnable) {
    hashPattern = `${delimiter}[${type}:${fileHashLength}]`;
  }
  return hashPattern;
};

/**
 * 生成webpack配置文件
 * @param {object} program 程序进程，可以获取启动参数
 * @param {object} options 特征配置项
 * @return {object}
 */
const webpackConfig = () => {
  const outputPath = path.resolve(context, distRoot);
  const chunkhash = getHashPattern('chunkhash');
  const contenthash = getHashPattern('contenthash');
  const hash = getHashPattern('hash');
  let entry = getEntries(entries);

  const output = {
    chunkFilename: `${js}/[name]${chunkhash}.js`,
    filename: `${js}/[name]${chunkhash}.js`,
    // prd环境静态文件输出地址
    path: outputPath,
    // dev环境下数据流访问地址
    publicPath: CDN_ROOT
  };

  const cssLoaderOptions = {
    ...cssLoader,
    ...{
      minimize: { minifyFontValues: false }
    }
  };

  const module = {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.css$/i,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader', options: cssLoaderOptions },
          { loader: 'postcss-loader' }
        ]
      },
      {
        test: /\.(scss|sass)$/i,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader', options: cssLoaderOptions },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' }
        ]
      },
      {
        test: /\.less$/i,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader', options: cssLoaderOptions },
          { loader: 'postcss-loader' },
          { loader: 'less-loader' }
        ]
      },
      {
        test: new RegExp(`.(${assetExtensions.join('|')})$`, 'i'),
        loader: 'file-loader',
        options: {
          // context 参数会影响静态文件打包输出的路径
          name: `[path][name]${hash}.[ext]`
        }
      }
    ]
  };

  const resolve = {
    modules: [srcRoot, 'node_modules']
  };

  const plugins = [
    new CleanPlugin(distRoot, { root: context }),

    new PackingTemplatePlugin(appConfig),

    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: `${css}/[name]${contenthash}.css`,
      // filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ];

  if (stylelintEnable) {
    plugins.push(new StylelintWebpackPlugin({
      ...{ context: path.resolve(context, srcRoot) },
      ...stylelintOptions
    }));
  }

  if (injectManifest) {
    plugins.push(new WebpackPwaManifest({
      ...requireDefault(path.resolve(context, 'config/webpack.manifest')),
      ...{ filename: `[name]${hash}[ext]` }
    }));
  }

  // 从配置文件中获取并生成webpack打包配置
  // fix: #14
  let chunkNames = [];
  if (commonChunks && Object.keys(commonChunks).length > 0) {
    const manifestChunkName = 'manifest';
    chunkNames = Object.keys(commonChunks);
    const lastChunkName = chunkNames[chunkNames.length - 1];
    // 确保manifest放在最后
    if (lastChunkName !== manifestChunkName) {
      chunkNames.push(manifestChunkName);
    }
    // 检测chunk配置的有效性
    const index = chunkNames.indexOf(manifestChunkName);
    if (index !== chunkNames.length - 1) {
      // manifest位置不对时，校正配置并给出提示
      chunkNames.splice(index, 1);
      console.log(yellow('⚠️  There is a problem with the manifest package configuration. Packing has automatically repaired the error configuration'));
    }
    chunkNames.filter(name => name !== manifestChunkName).forEach((key) => {
      if (isObject(entry)) {
        entry[key] = commonChunks[key];
      } else {
        entry = {
          main: entry,
          [key]: commonChunks[key]
        };
      }
    });
  }

  const optimization = {
    // splitChunks: {
    //   cacheGroups: {
    //     vendor: {
    //       chunks: 'initial',
    //       test: 'vendor1',
    //       name: 'vendor1',
    //       enforce: true
    //     }
    //   }
    // },
    // minimizer: [
    //   new UglifyJsPlugin({
    //     cache: true,
    //     parallel: true,
    //     sourceMap: true // set to true if you want JS source maps
    //   })
    // ],
    minimize
  };

  return {
    mode: NODE_ENV !== 'production' ? 'development' : 'production',
    context,
    entry,
    output,
    optimization,
    module,
    resolve,
    plugins
  };
};

export default program => webpackConfig(program);
