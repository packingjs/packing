#!/usr/bin/env node

import { execSync } from 'child_process';
import { join } from 'path';
import program from 'commander';
import webpack from 'webpack';
import Express from 'express';
import urlrewrite from 'packing-urlrewrite';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { Spinner } from 'cli-spinner';
import { middleware as packingTemplate } from '..';
import validateSchema from '../lib/validate-schema';
import '../bootstrap';
import { pRequire, getContext } from '..';

validateSchema();

program
  .option('-c, --clean', 'clean dll cache')
  .option('-d, --no-dll', 'skip dll build')
  .option('-l, --no-listen', 'skip listen app')
  .option('-o, --open', 'open browser')
  .parse(process.argv);

const context = getContext();

const appConfig = pRequire('config/packing');
const {
  rewriteRules,
  graphql: {
    enabled: graphqlEnabled,
    options: graphqlOptions
  },
  hot: {
    enabled: hotEnabled
  },
  template: {
    enabled: templateEnabled
  },
  commonChunks,
  path: { src: { root: src }, tmpDll },
  port: { dev: port }
} = appConfig;

const hasCommonChunks = commonChunks && Object.keys(commonChunks).length > 0;

const parser = __dirname.indexOf('/dist/') === 0 ?
  'node' :
  'node_modules/.bin/babel-node';

let cmd = `CONTEXT=${context} ${parser} ${__dirname}/packing-dll.js`;

if (program.dll && hasCommonChunks) {
  // 带上命令参数
  if (program.clean) {
    cmd = `${cmd} -c`;
  }
  try {
    execSync(cmd, { encoding: 'utf-8' });
    // console.log(stdout);
  } catch (e) {
    console.log(e.stdout);
    process.exit(1);
  }
}

const webpackConfig = pRequire('config/webpack.serve.babel', program, appConfig);
const compiler = webpack(webpackConfig);
const mwOptions = {
  contentBase: src,
  quiet: false,
  noInfo: false,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' },
  stats: { colors: true },
  serverSideRender: true
};
const dllPath = join(context, tmpDll);

const webpackDevMiddlewareInstance = webpackDevMiddleware(compiler, mwOptions);

const spinner = new Spinner('webpack: bundling.. %s');
spinner.setSpinnerDelay(100);
setTimeout(() => {
  spinner.start();
}, 0);

webpackDevMiddlewareInstance.waitUntilValid(() => {
  spinner.stop(true);

  const app = new Express();
  app.use(Express.static(context));
  app.use(Express.static(dllPath));
  app.use(urlrewrite(rewriteRules));
  app.use(webpackDevMiddlewareInstance);
  if (hotEnabled) {
    app.use(webpackHotMiddleware(compiler));
  }
  if (templateEnabled) {
    packingTemplate(app, appConfig);
  }

  if (graphqlEnabled) {
    const graphqlMockServer = require('../lib/graphql-mock-server');
    graphqlMockServer(app, graphqlOptions);
  }

  if (program.listen) {
    app.listen(port, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.info('==> 🚧  Listening on port %s\n', port);
      }
    });
  } else {
    process.exit(0);
  }
});
