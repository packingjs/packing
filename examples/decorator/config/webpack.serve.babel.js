/**
 * 这个文件可以修改serve的默认设置
 * 配置文件的位置在 `node_modules/packing/config/webpack.serve.babel.js`
 *
 * @param object webpackConfig 默认配置对象
 */

import assign from 'object-assign-deep';
import ProfilesPlugin from 'packing-profile-webpack-plugin';

export default (webpackConfig) => {

  return assign({}, webpackConfig, {
    // 在这里自定义配置
  });
};
