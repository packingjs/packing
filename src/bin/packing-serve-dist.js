#!/usr/bin/env node

/**
 * serve脚本
 * @author Joe Zhong <zhong.zhi@163.com>
 * @module tools/serve
 */
require('../util/babel-register');

const pRequire = require('../util/require');
const path = require('path');
const Express = require('express');
const urlrewrite = require('packing-urlrewrite');

const program = {};
const packing = pRequire('config/packing', program);
const templateEngine = packing.templateEngine;
const rewriteRules = packing.rewriteRules;
// eslint-disable-next-line
const template = require('packing-template-' + templateEngine);
const assetsDist = packing.path.assetsDist;
const templatesPagesDist = packing.path.templatesPagesDist;
const mockPageInit = packing.path.mockPageInit;
const port = packing.port.dist;

const app = new Express();
app.use(Express.static(path.join(process.cwd(), assetsDist)));
app.use(urlrewrite(rewriteRules));
app.use(template({
  templates: templatesPagesDist,
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
