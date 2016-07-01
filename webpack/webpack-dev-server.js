import path from 'path';
import Express from 'express';
import webpack from 'webpack';
import urlrewrite from 'packing-urlrewrite';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from './webpack.dev.config.babel';
import packing from './packing.config';
import url from 'url';

const { src, assets } = packing.path;
const compiler = webpack(webpackConfig);
const port = packing.port.dev;
const serverOptions = {
  contentBase: src,
  quiet: false,
  noInfo: true,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' },
  stats: { colors: true }
};

const abc = (router, root) => {
  console.log(root);
  return (req, res, next) => {
    // const { pathname } = url.parse(req.url);
    // if (router.hasOwnProperty(pathname)) {
    //   console.log('====', path.resolve(root, router[pathname]));
    // }
    // console.log(pathname);
    // console.log('Time: %d', Date.now());
    next();
  };
};

const app = new Express();
app.use(Express.static(path.join(__dirname, '..', assets)));
app.use(abc(packing.router, path.join(__dirname, '..', 'templates')));
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
