/**
 * webpack编译环境配置文件
 * @author Joe Zhong <zhong.zhi@163.com>
 * @module config/webpack.build.babel
 */

import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import WebpackPwaManifest from 'webpack-pwa-manifest';
import StylelintWebpackPlugin from 'stylelint-webpack-plugin';
import WebpackVisualizerPlugin from 'webpack-visualizer-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import { plugin as PackingTemplatePlugin } from '..';
import '../bootstrap';
import { pRequire, getContext, requireDefault } from '..';
import getEntries from '../lib/get-entries';
import getExistConfigPath from '../lib/get-exist-config-path';

const { NODE_ENV, CDN_ROOT = '/' } = process.env;
const context = getContext();
const appConfig = pRequire('config/packing');
const {
  assetExtensions,
  commonChunks,
  runtimeChunk: {
    enabled: runtimeChunkEnabled,
    name: runtimeChunkName
  },
  longTermCaching: {
    enabled: longTermCachingEnabled,
    options: {
      delimiter,
      fileHashLength
    }
  },
  cssLoader,
  template: {
    enabled: templateEnabled,
    options: {
      injectManifest
    }
  },
  stylelint: {
    enabled: stylelintEnabled,
    options: stylelintOptions
  },
  eslint: {
    enabled: eslintEnabled,
    options: eslintOptions
  },
  visualizer: {
    enabled: visualizerEnabled
  },
  minimize: {
    enabled: minimizeEnabled,
    options: minimizeOptions
  },
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

  if (longTermCachingEnabled) {
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
  const entry = getEntries(entries);

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

  const postcssLoaderOptions = {
    config: {
      path: getExistConfigPath('postcss', context, __dirname)
    }
  };

  const jsLoaders = [
    {
      loader: 'babel-loader'
    }
  ];

  if (eslintEnabled) {
    jsLoaders.push({
      loader: 'eslint-loader',
      options: eslintOptions
    });
  }

  const module = {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: jsLoaders
      },
      {
        test: /\.css$/i,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader', options: cssLoaderOptions },
          { loader: 'postcss-loader', options: postcssLoaderOptions }
        ]
      },
      {
        test: /\.(scss|sass)$/i,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader', options: cssLoaderOptions },
          { loader: 'postcss-loader', options: postcssLoaderOptions },
          { loader: 'sass-loader' }
        ]
      },
      {
        test: /\.less$/i,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader', options: cssLoaderOptions },
          { loader: 'postcss-loader', options: postcssLoaderOptions },
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
    new CleanWebpackPlugin(),

    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: `${css}/[name]${contenthash}.css`,
      // filename: '[name].css',
      chunkFilename: `${css}/[id]${contenthash}.css`
    })
  ];

  if (templateEnabled) {
    plugins.push(new PackingTemplatePlugin(appConfig));
  }

  // 该插件用的还是旧插件机制
  if (stylelintEnabled) {
    plugins.push(new StylelintWebpackPlugin({
      ...{
        context: path.resolve(context, srcRoot),
        configFile: getExistConfigPath('stylelint', context, __dirname)
      },
      ...stylelintOptions
    }));
  }

  if (injectManifest) {
    plugins.push(new WebpackPwaManifest({
      ...requireDefault(path.resolve(context, 'config/webpack.manifest')),
      ...{ filename: `[name]${hash}[ext]` }
    }));
  }

  // 该插件用的还是旧插件机制
  if (visualizerEnabled) {
    plugins.push(new WebpackVisualizerPlugin());
  }

  const optimization = { minimize: minimizeEnabled };
  // const optimization = {};

  if (minimizeEnabled) {
    optimization.minimizer = [
      new TerserWebpackPlugin(minimizeOptions)
    ];
  }

  if (runtimeChunkEnabled) {
    optimization.runtimeChunk = {
      name: runtimeChunkName
    };
  }

  if (commonChunks && Object.keys(commonChunks).length > 0) {
    const cacheGroups = {};
    Object.keys(commonChunks).forEach((chunkName) => {
      const pattern = commonChunks[chunkName].join('|');
      cacheGroups[chunkName] = {
        test: new RegExp(`(${pattern})`), // /(ccc|sub\/bbb|\.\/d)/,
        chunks: 'initial',
        name: chunkName,
        // 优先级
        priority: 10,
        // 忽略命中次数，只要命中且使用过一次就打入 vendor
        enforce: true
      };
    });
    optimization.splitChunks = { cacheGroups };
  }

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
