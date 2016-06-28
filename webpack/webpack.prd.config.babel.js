import webpackConfig from './webpack.config';

export default webpackConfig({
  devtool: false,
  progress: true,
  hot: false,
  longTermCaching: true,
  build: true,
  minimize: true,
});
