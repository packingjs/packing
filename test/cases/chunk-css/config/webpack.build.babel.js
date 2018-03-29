/**
 * 这个文件可以修改build的默认设置
 * 默认配置请看 `node_modules/packing/config/webpack.build.babel.js`
 *
 * @param object webpackConfig 默认配置对象
 */

export default (webpackConfig) => {
  const config = webpackConfig;
  config.plugins = config.plugins.filter(p => p.constructor.name !== 'PackingTemplatePlugin');
  return config;
};
