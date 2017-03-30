#!/usr/bin/env node

require('packing/util/babel-register');

const program = require('commander');
const path = require('path');
const Express = require('express');
const webpack = require('webpack');
const urlrewrite = require('packing-urlrewrite');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const pRequire = require('packing/util/require');
const fs = require('fs');
const crypto = require('crypto');
const mkdirp = require('mkdirp');
const packingPackage = require('packing/package.json');

const projectPackage = require(path.resolve('./package.json'));

program
  .option('-c, --clean_cache', 'clean dll cache')
  .option('-o, --open_browser', 'open browser')
  .parse(process.argv);

const webpackConfigDll = pRequire('config/webpack.dll.babel', program);
const packing = pRequire('config/packing', program);
const commonChunks = packing.commonChunks;
const dll = packing.path.dll;

function md5(string) {
  return crypto.createHash('md5').update(string).digest('hex');
}

function httpd() {
  const webpackConfig = pRequire('config/webpack.serve.babel', program);
  const templateEngine = packing.templateEngine;
  const rewriteRules = packing.rewriteRules;
  const template = require('packing-template-' + templateEngine);
  const src = packing.path.src;
  const assets = packing.path.assets;
  const templatesPages = packing.path.templatesPages;
  const mockPageInit = packing.path.mockPageInit;
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
}

function execDll(destDir, hashFile, newHash) {
  // 写入newHash
  webpack(webpackConfigDll, function (err) {
    if (err) {
      console.log(err);
    } else {
      if (!fs.existsSync(destDir)) {
        mkdirp.sync(destDir);
      }
      fs.writeFileSync(hashFile, JSON.stringify({
        hash: newHash,
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
    projectPackage.devDependencies
  );
  const dllDeps = {};
  const destDir = path.resolve(process.cwd(), dll);
  const hashFile = destDir + '/hash.json';

  if (program.clean_cache) {
    fs.unlinkSync(hashFile);
  }

  Object.keys(commonChunks).forEach(function (chunkName) {
    commonChunks[chunkName].forEach(function (d) {
      if (allDependencies[d]) {
        dllDeps[d] = allDependencies[d];
      }
    });
  });

  const newHash = md5(JSON.stringify(dllDeps));

  if (fs.existsSync(hashFile)) {
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
