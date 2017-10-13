/**
 * webpack编译环境配置文件
 * @author Joe Zhong <zhong.zhi@163.com>
 * @module config/webpack.build.babel
 */

import path from 'path';
import { isFunction } from 'util';
import webpack from 'webpack';
import CleanPlugin from 'clean-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import UncommentBlock from 'webpack-uncomment-block';
import ReplaceHashWebpackPlugin from 'replace-hash-webpack-plugin';
import ProfilesPlugin from 'packing-profile-webpack-plugin';
import pRequire from '../util/require';

// js输出文件保持目录名称
const JS_DIRECTORY_NAME = 'js';
// js输出文件保持目录名称
const CSS_DIRECTORY_NAME = 'css';

const { cdnRoot } = pRequire(`src/profiles/${process.env.NODE_ENV}`);
const {
  assetExtensions,
  commonChunks,
  fileHashLength,
  templateExtension,
  longTermCaching,
  minimize,
  sourceMap,
  cssModules,
  cssModulesIdentName = '[path][name]__[local]--[hash:base64:5]',
  uncommentPattern,
  path: {
    src,
    templates,
    entries,
    assets,
    assetsDist,
    templatesDist
  }
} = pRequire('config/packing');

/**
 * 生成webpack配置文件
 * @param {object} program 程序进程，可以获取启动参数
 * @param {object} options 特征配置项
 * @return {object}
 */
const webpackConfig = () => {
  const projectRootPath = process.cwd();
  const assetsPath = path.resolve(projectRootPath, assetsDist);
  const chunkhash = longTermCaching ? `-[chunkhash:${fileHashLength}]` : '';
  const contenthash = longTermCaching ? `-[contenthash:${fileHashLength}]` : '';
  const context = projectRootPath;
  const entry = isFunction(entries) ? entries() : entries;

  const output = {
    chunkFilename: `${JS_DIRECTORY_NAME}/[name]${chunkhash}.js`,
    filename: `${JS_DIRECTORY_NAME}/[name]${chunkhash}.js`,
    // prd环境静态文件输出地址
    path: assetsPath,
    // dev环境下数据流访问地址
    publicPath: cdnRoot
  };

  // 开启css-modules时的配置
  const cssModulesOptions = cssModules ? { module: true, localIdentName: cssModulesIdentName } : {};
  const cssLoaderOptions = Object.assign({ importLoaders: 2, minimize: true }, cssModulesOptions);

  const moduleConfig = {
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
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: cssLoaderOptions },
            { loader: 'postcss-loader' }
          ]
        })
      },
      {
        test: /\.(scss|sass)$/i,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: cssLoaderOptions },
            { loader: 'postcss-loader' },
            { loader: 'sass-loader' }
          ]
        })
      },
      {
        test: /\.less$/i,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: cssLoaderOptions },
            { loader: 'postcss-loader' },
            { loader: 'less-loader' }
          ]
        })
      },
      {
        test: new RegExp(`.(${assetExtensions.join('|')})$`, 'i'),
        loader: 'url-loader',
        options: {
          name: `[path][name]-[hash:${fileHashLength}].[ext]`,
          context: assets,
          limit: 100
        }
      }
    ]
  };

  const resolve = {
    modules: [src, assets, 'node_modules']
  };

  const plugins = [
    new CleanPlugin([assetsDist, templatesDist], {
      root: projectRootPath
    }),

    // css files from the extract-text-plugin loader
    new ExtractTextPlugin({
      filename: `${CSS_DIRECTORY_NAME}/[name]${contenthash}.css`,
      allChunks: true
    }),
  
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        CDN_ROOT: JSON.stringify(cdnRoot)
      }
    }),

    new UncommentBlock({
      cwd: templates,
      src: `**/*${templateExtension}`,
      dest: templatesDist,
      pattern: uncommentPattern
    }),

    new ReplaceHashWebpackPlugin({
      cwd: templatesDist,
      src: `**/*${templateExtension}`,
      dest: templatesDist
    }),

    new ProfilesPlugin({
      failOnMissing: true
    })

  ];

  // 从配置文件中获取并生成webpack打包配置
  if (commonChunks) {
    const chunkKeys = Object.keys(commonChunks);
    chunkKeys.forEach((key) => {
      entry[key] = commonChunks[key];
    });

    // 扩展阅读 http://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
    plugins.push(
      new webpack.optimize.CommonsChunkPlugin({ names: chunkKeys }),
    );
  }

  if (minimize) {
    plugins.push(
      // optimizations
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_debugger: true,
          drop_console: true
        },
        comments: /^!/,
        sourceMap
      }),
    );
  }

  // 在编译机上编译需要调整目录结构
  // 把编译后的模版目录移动到根目录
  // if (process.env.NODE_ENV !== '') {
  //   plugins.push(
  //     new MoveWebpackPlugin({
  //       src: templatesDist,
  //       dest: ''
  //     }, 'done')
  //   );
  // }

  return {
    context,
    entry,
    output,
    module: moduleConfig,
    resolve,
    plugins
  };
};

export default program => webpackConfig(program);
