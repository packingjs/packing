#!/usr/bin/env node

/**
 * serve脚本
 * @author Joe Zhong <zhong.zhi@163.com>
 * @module tools/serve
 */
import { join } from 'path';
/* eslint-disable */
import Express from 'express';
import urlrewrite from 'packing-urlrewrite';
/* eslint-enable */
import '../util/babel-register';
import pRequire from '../util/require';

const {
  templateEngine,
  rewriteRules,
  path: {
    assetsDist,
    templatesPagesDist,
    mockPageInit
  },
  port: {
    dist
  }
} = pRequire('config/packing', {});
// eslint-disable-next-line
const template = require(`packing-template-${templateEngine}`);
const port = dist;

const app = new Express();
app.use(Express.static(join(process.cwd(), assetsDist)));
app.use(urlrewrite(rewriteRules));
app.use(template({
  templates: templatesPagesDist,
  mockData: mockPageInit,
  rewriteRules
}));

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.info('==> 🚧  Listening on port %s', port);
  }
});
