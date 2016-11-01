/**
 * 这个文件可以修改build的默认设置
 * 配置文件的位置在 `node_modules/packing/config/webpack.build.babel.js`
 *
 * @param object webpackConfig 默认配置对象
 */

import assign from 'object-assign-deep';

export default webpackConfig => assign({}, webpackConfig, {
  // 在这里自定义配置
});
