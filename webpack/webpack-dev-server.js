import path from 'path';
import Express from 'express';
import webpack from 'webpack';
import urlrewrite from 'packing-urlrewrite';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from './webpack.config.serve.babel';
import packing from './packing.config';

const { src, assets } = packing.path;
const compiler = webpack(webpackConfig);
const port = packing.port.dev;
const serverOptions = {
  contentBase: src,
  quiet: true,
  noInfo: true,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' },
  stats: { colors: true }
};

const app = new Express();
app.use(Express.static(path.join(__dirname, '..', assets)));
app.use(urlrewrite(packing.rewriteRules));
app.use(webpackDevMiddleware(compiler, serverOptions));
app.use(webpackHotMiddleware(compiler));

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.info('==> 🚧  Webpack development server listening on port %s', port);
  }
});
