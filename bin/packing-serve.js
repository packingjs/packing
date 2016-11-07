#!/usr/bin/env node

require('packing/util/babel-register');

const nopt = require('nopt');
const path = require('path');
const Express = require('express');
const webpack = require('webpack');
const urlrewrite = require('packing-urlrewrite');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const pRequire = require('packing/util/require');

const program = nopt(process.argv, 2);
const webpackConfig = pRequire('config/webpack.serve.babel', program);
const packing = pRequire('config/packing', program);
const templateEngine = packing.templateEngine;
const rewriteRules = packing.rewriteRules;
const template = require('packing-template-' + templateEngine);
const src = packing.path.src;
const assets = packing.path.assets;
const templatesPages = packing.path.templatesPages;
const mockPageInit = packing.path.mockPageInit;
const dll = packing.path.dll;
const compiler = webpack(webpackConfig);
const port = packing.port.dev;
const serverOptions = {
  contentBase: src,
  quiet: false,
  noInfo: false,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' },
  stats: { colors: true },
};

const cwd = process.cwd();
const assetsPath = path.join(cwd, assets);
const dllPath = path.join(cwd, dll);

const app = new Express();
app.use(Express.static(assetsPath));
app.use(Express.static(dllPath));
app.use(urlrewrite(rewriteRules));
app.use(webpackDevMiddleware(compiler, serverOptions));
app.use(webpackHotMiddleware(compiler));
app.use(template({
  templates: templatesPages,
  mockData: mockPageInit,
  rewriteRules: rewriteRules,
}));

app.listen(port, function (err) {
  if (err) {
    console.error(err);
  } else {
    console.info('==> 🚧  Webpack development server listening on port %s', port);
  }
});
