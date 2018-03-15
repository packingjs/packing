/**
 * 这个文件可以修改serve的默认设置
 * 默认配置请看 `node_modules/packing/config/webpack.serve.babel.js`
 *
 * @param object webpackConfig 默认配置对象
 */

// import path from 'path';

export default (webpackConfig/* , program, appConfig */) => {
  // webpackConfig.plugins.forEach((plugin) => {
  //   if (plugin.constructor.name === 'PackingTemplatePlugin') {
  //     plugin.options = {
  //       ...plugin.options,
  //       ...{
  //         template: path.resolve(__dirname, '../template.html'),
  //         favicon: 'images/favico.jpg'
  //       }
  //     };
  //   }
  // });
  return webpackConfig;
};
