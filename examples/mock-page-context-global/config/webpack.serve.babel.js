/**
 * 这个文件可以修改serve的默认设置
 * 默认配置请看 `node_modules/packing/config/webpack.serve.babel.js`
 *
 * @param object webpackConfig 默认配置对象
 */

export default (webpackConfig, program, appConfig) => {
  const config = webpackConfig;
  console.log('-------');
  console.log(appConfig);
  console.log('-------');
  return config;
};
