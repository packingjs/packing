#!/usr/bin/env node

import { existsSync, writeFileSync, unlinkSync } from 'fs';
import { resolve, join } from 'path';
import program from 'commander';
import webpack from 'webpack';
/* eslint-disable */
import Express from 'express';
import urlrewrite from 'packing-urlrewrite';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { Spinner } from 'cli-spinner';
/* eslint-enable */
import { createHash } from 'crypto';
import mkdirp from 'mkdirp';
import '../util/babel-register';
import pRequire from '../util/require';
import packingPackage from '../../package.json';

// eslint-disable-next-line
const projectPackage = require(resolve('./package.json'));

program
  .option('-c, --clean_cache', 'clean dll cache')
  .option('-o, --open_browser', 'open browser')
  .parse(process.argv);

const webpackConfigDll = pRequire('config/webpack.dll.babel', program);
const appConfig = pRequire('config/packing');
const {
  commonChunks,
  templateEngine,
  rewriteRules,
  graphqlMockServer,
  graphqlEndpoint,
  graphiqlEndpoint,
  path: {
    dll,
    src,
    // assets,
    templatesPages,
    mockPageInit
  },
  port: {
    dev
  }
} = appConfig;

function md5(string) {
  return createHash('md5').update(string).digest('hex');
}

function httpd() {
  const webpackConfig = pRequire('config/webpack.serve.babel', program, appConfig);
  // eslint-disable-next-line
  const template = require(`packing-template-${templateEngine}`);
  const compiler = webpack(webpackConfig);
  const port = dev;
  const serverOptions = {
    contentBase: src,
    quiet: false,
    noInfo: false,
    hot: true,
    inline: true,
    lazy: false,
    publicPath: webpackConfig.output.publicPath,
    headers: { 'Access-Control-Allow-Origin': '*' },
    stats: { colors: true }
  };
  const cwd = process.cwd();
  // const assetsPath = join(cwd, assets);
  const dllPath = join(cwd, dll);

  const spinner = new Spinner('webpack: Compiling.. %s');
  spinner.setSpinnerString('|/-\\');
  spinner.start();

  const webpackDevMiddlewareInstance = webpackDevMiddleware(compiler, serverOptions);
  webpackDevMiddlewareInstance.waitUntilValid(() => {
    spinner.stop();

    const app = new Express();
    app.use(Express.static(cwd));
    app.use(Express.static(dllPath));
    app.use(urlrewrite(rewriteRules));
    app.use(webpackDevMiddlewareInstance);
    app.use(webpackHotMiddleware(compiler));
    app.use(template({
      templates: templatesPages,
      mockData: mockPageInit,
      rewriteRules
    }));

    if (graphqlMockServer) {
      try {
        /* eslint-disable */
        const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
        const { addMockFunctionsToSchema, makeExecutableSchema } = require('graphql-tools');
        const { mergeTypes, mergeResolvers, fileLoader } = require('merge-graphql-schemas');
        const bodyParser = require('body-parser');
        /* eslint-enable */

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
}

function execDll(destDir, hashFile, newHash) {
  // 写入newHash
  webpack(webpackConfigDll, (err) => {
    if (err) {
      console.log(err);
    } else {
      if (!existsSync(destDir)) {
        mkdirp.sync(destDir);
      }
      writeFileSync(hashFile, JSON.stringify({
        hash: newHash
      }));
      console.log('💚  DllPlugin executed!');

      // start httpd
      httpd();
    }
  });
}

if (Object.keys(commonChunks).length === 0) {
  httpd();
} else {
  const allDependencies = Object.assign(
    packingPackage.dependencies,
    packingPackage.devDependencies,
    projectPackage.dependencies,
    // eslint-disable-next-line
    projectPackage.devDependencies
  );
  const dllDeps = {};
  const destDir = resolve(process.cwd(), dll);
  const hashFile = `${destDir}/hash.json`;

  if (program.clean_cache) {
    unlinkSync(hashFile);
  }

  Object.keys(commonChunks).forEach((chunkName) => {
    commonChunks[chunkName].forEach((d) => {
      if (allDependencies[d]) {
        dllDeps[d] = allDependencies[d];
      }
    });
  });

  const newHash = md5(JSON.stringify(dllDeps));

  if (existsSync(hashFile)) {
    // eslint-disable-next-line
    const oldHash = require(hashFile).hash;
    console.log('oldHash:%s, newHash:%s', oldHash, newHash);
    if (oldHash !== newHash) {
      execDll(destDir, hashFile, newHash);
    } else {
      console.log('💛  DllPlugin skipped!');
      // start httpd
      httpd();
    }
  } else {
    execDll(destDir, hashFile, newHash);
  }
}
