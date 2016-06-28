import webpackConfig from './webpack.config';

export default webpackConfig({
  devtool: true,
  progress: true,
  hot: true,
	// longTermCaching: true,
	// minimize: true,
});
