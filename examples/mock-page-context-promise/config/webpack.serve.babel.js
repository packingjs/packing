/**
 * 这个文件可以修改serve的默认设置
 * 默认配置请看 `node_modules/packing/config/webpack.serve.babel.js`
 *
 * @param object webpackConfig 默认配置对象
 */

export default (webpackConfig) => {
  const config = webpackConfig;
  // webpackConfig 为系统默认的webpack配置，此处可以根据项目情况修改
  // 修改 entry
  // config.entry = 'xxx/xxx.js';
  // 修改 plugins（修改 ＝ 先删除现有的，再添加新的）
  // config.plugins = config.plugins.filter(plugin => !(plugin.filename && plugin.id));
  // config.plugins.push(
  //   new ExtractTextPlugin({
  //     filename: '[name]-[contenthash:8].css',
  //     allChunks: true
  //   })
  // )
  return config;
};
