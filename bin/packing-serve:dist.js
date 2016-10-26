#!/usr/bin/env babel-node

/**
 * serve脚本
 * @author Joe Zhong <zhong.zhi@163.com>
 * @module tools/serve
 */
require('packing/util/babel-register');

const program = require('commander');
const pkg = require('packing/package.json');
program
  .version(pkg.version)
  .parse(process.argv);

const pRequire = require('packing/util/require');
const path = require('path');
const Express = require('express');
const urlrewrite = require('packing-urlrewrite');
const packing = pRequire('config/packing');
const templateEngine = packing.templateEngine;
const rewriteRules = packing.rewriteRules;
// eslint-disable-next-line
const template = require(`packing-template-${templateEngine}`);
const assetsDist = packing.path.assetsDist;
const templatesPagesDist = packing.path.templatesPagesDist;
const mockPageInit = packing.path.mockPageInit;
const port = packing.port.dist;

const app = new Express();
app.use(Express.static(path.join(__dirname, '..', assetsDist)));
app.use(urlrewrite(rewriteRules));
app.use(template({
  templates: templatesPagesDist,
  mockData: mockPageInit,
  rewriteRules: rewriteRules
}));

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.info('==> 🚧  Webpack development server listening on port %s', port);
  }
});
