export default (webpackConfig) => {
  const config = webpackConfig;
  // lib文件输出名称
  config.output.filename = 'abc.js';

  // lib暴露在 window 下的名称
  config.output.library = 'ABC';

  // 打包方式，一般不需要修改
  // 详细文档请看 https://webpack.js.org/configuration/output/#output-librarytarget
  config.output.libraryTarget = 'umd';
  return config;
};
