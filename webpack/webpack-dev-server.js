import path from 'path';
import Express from 'express';
import webpack from 'webpack';
import urlrewrite from 'packing-urlrewrite';
import webpackConfig from './dev.config.babel';
import packing from './packing';

const compiler = webpack(webpackConfig);
const port = packing.port.dev;
const serverOptions = {
  contentBase: packing.path.src,
  quiet: false,
  noInfo: true,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' },
  stats: { colors: true }
};

const app = new Express();

const rules = {
  '^/api/(.*)': 'require!/mock/api/$1.js',
  // '^/hello': 'http://localhost:3001/123/4.html',
};

console.log(path.join(__dirname, '..', packing.path.static));

app.use(Express.static(path.join(__dirname, '..', packing.path.static)));
app.use(urlrewrite(rules));
app.use(require('webpack-dev-middleware')(compiler, serverOptions));
app.use(require('webpack-hot-middleware')(compiler));

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.info('==> 🚧  Webpack development server listening on port %s', port);
  }
});
