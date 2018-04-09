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
import '../bootstrap';
import { pRequire, getContext } from '..';
import graphqlMockServer from '../lib/graphql-mock-server';

program
  .option('-c, --clean-cache', 'clean dll cache')
  .option('-s, --skip-dll', 'skip dll build')
  .option('-o, --open-browser', 'open browser')
  .option('--no-listen', 'no listen app instance')
  .parse(process.argv);

const context = getContext();

const appConfig = pRequire('config/packing');
const {
  rewriteRules,
  graphql: {
    enable: graphqlEnable,
    graphqlEndpoint,
    graphiqlEndpoint
  },
  hot,
  commonChunks,
  path: { tmpDll },
  port: { dev: port }
} = appConfig;

const hasCommonChunks = commonChunks && Object.keys(commonChunks).length > 0;

const parser = __dirname.indexOf('/dist/') === 0 ?
  'node' :
  'node_modules/.bin/babel-node';

let cmd = `CONTEXT=${context} ${parser} ${__dirname}/packing-dll.js`;

if (!program.skip_dll && hasCommonChunks) {
  // 带上命令参数
  if (program.clean_cache) {
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
  // contentBase: src,
  // quiet: false,
  // noInfo: false,
  // hot: true,
  // inline: true,
  // lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' },
  stats: { colors: true },
  serverSideRender: true
};
const dllPath = join(context, tmpDll);

const webpackDevMiddlewareInstance = webpackDevMiddleware(compiler, mwOptions);

const spinner = new Spinner('webpack: Compiling.. %s');
spinner.setSpinnerString('|/-\\');
spinner.start();

webpackDevMiddlewareInstance.waitUntilValid(() => {
  spinner.stop();

  const app = new Express();
  app.use(Express.static(context));
  app.use(Express.static(dllPath));
  app.use(urlrewrite(rewriteRules));
  app.use(webpackDevMiddlewareInstance);
  if (hot) {
    app.use(webpackHotMiddleware(compiler));
  }
  packingTemplate(app, appConfig);

  if (graphqlEnable) {
    graphqlMockServer(app, {
      graphqlEndpoint,
      graphiqlEndpoint
    });
  }

  console.log('--!program.no_listen:', !program.no_listen);
  if (!program.no_listen) {
    // app.listen(port, (err) => {
    //   if (err) {
    //     console.error(err);
    //   } else {
    //     console.info('==> 🚧  Listening on port %s\n', port);
    //   }
    // });
  } else {
    process.exit(0);
  }
});
