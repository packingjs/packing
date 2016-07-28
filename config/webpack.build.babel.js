import { existsSync } from 'fs';
import path from 'path';
import { isArray, isFunction } from 'util';
import webpack from 'webpack';
import CleanPlugin from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import ReplaceHashWebpackPlugin from 'replace-hash-webpack-plugin';
import RevWebpackPlugin from 'packing-rev-webpack-plugin';
// import MoveWebpackPlugin from 'move-webpack-plugin';
import strip from 'strip-loader';
import autoprefixer from 'autoprefixer';
import packingGlob from 'packing-glob';
import packing from './packing';

const {
  dist,
  templates,
  templatesPages,
  entries,
  assets,
  assetsDist,
  templatesDist,
} = packing.path;
const { templateExtension } = packing;
const cwd = process.cwd();
const pattern = isArray(templateExtension) && templateExtension.length > 1 ?
  `**/*{${templateExtension.join(',')}}` :
  `**/*${templateExtension}`;

/**
 * 根据文件的目录结构生成entry配置
 */
const initConfig = () => {
  const entryConfig = {};

  packingGlob(pattern, {
    cwd: path.resolve(cwd, templatesPages)
  }).forEach(page => {
    console.log(`template page: ${page}`);
    const ext = path.extname(page);
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

  return entryConfig;
};

const webpackConfig = (options) => {
  const projectRootPath = path.resolve(__dirname, '../');
  const assetsPath = path.resolve(projectRootPath, assetsDist);
  const chunkhash = options.longTermCaching ? '-[chunkhash:8]' : '';
  const contenthash = options.longTermCaching ? '-[contenthash:8]' : '';
  const context = path.resolve(__dirname, '..');
  const entry = initConfig();

  const output = {
    chunkFilename: `[name]${chunkhash}.js`,
    filename: `[name]${chunkhash}.js`,
    // prd环境静态文件输出地址
    path: assetsPath,
    // dev环境下数据流访问地址
    publicPath: '',
  };

  /* eslint-disable */
  let moduleConfig = {
    loaders: [
      { test: /\.js?$/, loaders: [strip.loader('debug'), 'babel'], exclude: /node_modules/},
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css?importLoaders=2!postcss') },
      { test: /\.less$/, loader: ExtractTextPlugin.extract('style', 'css?importLoaders=2!postcss!less') },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css?importLoaders=2!postcss!sass') },
      { test: /\.json$/, loader: 'json' },
      { test: /\.(jpg|png|ttf|woff|woff2|eot|svg)$/, loader: 'url?name=[name]-[hash:8].[ext]&limit=10000' },
    ]
  };

  const postcss = () => [autoprefixer];

  const resolve = {
    alias: {
      'env-alias': path.resolve(__dirname, '../src/config/env', process.env.NODE_ENV)
    },
    modulesDirectories: [ 'src', 'node_modules' ],
    extensions: ['', '.json', '.js', '.jsx']
  };

  const ignoreRevPattern = '**/big.jpg';
  const plugins = [
    new CleanPlugin([dist], {
      root: projectRootPath
    }),

    // replace hash时也会将template生成一次，这次copy有些多余
    new CopyWebpackPlugin([{
      context: assets,
      from: ignoreRevPattern,
      to: path.resolve(cwd, assetsDist),
    }]),

    // css files from the extract-text-plugin loader
    new ExtractTextPlugin(`[name]${contenthash}.css`, {
      allChunks: true
    }),

    new webpack.DefinePlugin({
      '__DEVTOOLS__': false,
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        CDN_ROOT: JSON.stringify(process.env.CDN_ROOT)
      },
    }),

    new ReplaceHashWebpackPlugin({
      assetsDomain: process.env.CDN_ROOT,
      cwd: templates,
      src: pattern, // [pattern, '!**/index.*'], // 排除!开头的pattern匹配的文件
      dest: templatesDist,
    }),

    new RevWebpackPlugin({
      cwd: assets,
      src: ['**/*'],
      dest: assetsDist,
    }),
  ];

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


  if (options.minimize) {
    plugins.push(
      // optimizations
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_debugger: true,
          drop_console: true,
        },
        comments: /^!/,
        sourceMap: options.sourceMap,
      })
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
    postcss,
    resolve,
    plugins,
  };
};

export default webpackConfig({
  devtool: false,
  longTermCaching: true,
  minimize: true,
  sourceMap: false,
});
