/**
 * 这个文件可以修改serve的默认设置
 * 默认配置请看 `node_modules/packing/config/webpack.serve.babel.js`
 *
 * @param object webpackConfig 默认配置对象
 */

import path from 'path';
import webpack from 'webpack';

export default (webpackConfig, program, packingConfig) => {
  const { CONTEXT } = process.env;

  webpackConfig.plugins = [
    new webpack.DllReferencePlugin({
      context: CONTEXT,
      // eslint-disable-next-line
      manifest: require(path.join(CONTEXT, packingConfig.path.dll, 'vendor-manifest.json'))
    })
  ];
  return webpackConfig;
};
