#!/usr/bin/env node

import { execSync } from 'child_process';
import { resolve, join } from 'path';
import program from 'commander';
import webpack from 'webpack';
import Express from 'express';
import urlrewrite from 'packing-urlrewrite';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { Spinner } from 'cli-spinner';
import { middleware as packingTemplate } from 'packing-template';
import '../util/babel-register';
import pRequire from '../util/require';

program
  .option('-c, --clean_cache', 'clean dll cache')
  .option('-o, --open_browser', 'open browser')
  .parse(process.argv);

const { env: { CONTEXT } } = process;
const context = CONTEXT ? resolve(CONTEXT) : process.cwd();

const parser = __dirname.indexOf('/dist/') === 0 ?
  'node' :
  'node_modules/.bin/babel-node';

let cmd = `${parser} ${__dirname}/packing-dll.js`;
if (CONTEXT) {
  cmd = `CONTEXT=${CONTEXT} ${cmd}`;
}
if (program.clean_cache) {
  cmd = `${cmd} -c`;
}
try {
  const stdout = execSync(cmd, { encoding: 'utf-8' });
  console.log(stdout);
} catch (e) {
  console.log(e.stdout);
  process.exit(1);
}

const appConfig = pRequire('config/packing');
const {
  rewriteRules,
  graphqlMockServer,
  graphqlEndpoint,
  graphiqlEndpoint,
  path: { dll, src },
  port: { dev }
} = appConfig;

const webpackConfig = pRequire('config/webpack.serve.babel', program, appConfig);
const compiler = webpack(webpackConfig);
const port = dev;
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
const dllPath = join(context, dll);

const spinner = new Spinner('webpack: Compiling.. %s');
spinner.setSpinnerString('|/-\\');
spinner.start();

const webpackDevMiddlewareInstance = webpackDevMiddleware(compiler, mwOptions);
webpackDevMiddlewareInstance.waitUntilValid(() => {
  spinner.stop();

  const app = new Express();
  app.use(Express.static(context));
  app.use(Express.static(dllPath));
  app.use(urlrewrite(rewriteRules));
  app.use(webpackDevMiddlewareInstance);
  app.use(webpackHotMiddleware(compiler));
  packingTemplate(app, appConfig);

  if (graphqlMockServer) {
    try {
      const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
      const { addMockFunctionsToSchema, makeExecutableSchema } = require('graphql-tools');
      const { mergeTypes, mergeResolvers, fileLoader } = require('merge-graphql-schemas');
      const bodyParser = require('body-parser');

      let typesArray = '';
      let mocks = {};
      try {
        typesArray = fileLoader(resolve('mock/**/schema.js'));
        mocks = mergeResolvers(fileLoader(resolve('mock/**/resolver.js')));
      } catch (e) {
        console.log(e);
      }

      try {
        const schema = makeExecutableSchema({ typeDefs: mergeTypes(typesArray) });
        addMockFunctionsToSchema({ schema, mocks });
        app.use(graphqlEndpoint, bodyParser.json(), graphqlExpress(() => ({ schema })));
        app.use(graphiqlEndpoint, graphiqlExpress({
          endpointURL: graphqlEndpoint,
          query: ''
        }));
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log('\n缺少依赖包，请先安装 npm i --dev apollo-server-express graphql-tools merge-graphql-schemas body-parser \n');
      process.exit(1);
    }
  }

  app.listen(port, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.info('==> 🚧  Listening on port %s\n', port);
    }
  });
});
