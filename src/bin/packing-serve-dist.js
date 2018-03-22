#!/usr/bin/env node

/**
 * serve脚本
 * @author Joe Zhong <zhong.zhi@163.com>
 * @module tools/serve
 */
import { resolve } from 'path';
import { existsSync, readFileSync } from 'fs';
import pug from 'pug';
import Express from 'express';
import urlrewrite from 'packing-urlrewrite';
import { getPath, getContext } from 'packing-template-util';
import '../util/babel-register';
import pRequire from '../util/require';

const { CONTEXT } = process.env;
const context = CONTEXT ? resolve(CONTEXT) : process.cwd();
const appConfig = pRequire('config/packing', {});
const {
  templateEngine,
  templateExtension,
  rewriteRules,
  path: {
    assetsDist,
    templatesPagesDist,
    mockPageInit
  },
  port: {
    dist
  }
} = appConfig;
// const template = require(`packing-template-${templateEngine}`);
const port = dist;

const template = () => async (req, res, next) => {
  const { templatePath, pageDataPath, globalDataPath } = getPath(req, {
    templates: templatesPagesDist,
    mockData: mockPageInit,
    extension: templateExtension,
    globalData: '__global.js',
    rewriteRules
  });
  let globals = {};
  try {
    globals = await getContext(req, res, pageDataPath, globalDataPath);
  } catch (e) {
    console.log(e);
  }
  if (existsSync(templatePath)) {
    try {
      if (templateEngine === 'html') {
        const output = readFileSync(templatePath, { encoding: 'utf-8' });
        res.end(output);
      } else {
        res.end(pug.renderFile(templatePath, globals));
      }
    } catch (e) {
      console.log(e);
      next();
    }
  } else {
    next();
  }
};

const app = new Express();
app.use(Express.static(resolve(context, assetsDist)));
app.use(urlrewrite(rewriteRules));
app.use(template());

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.info('==> 🚧  Listening on port %s', port);
  }
});
