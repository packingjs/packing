#!/usr/bin/env node

/**
 * serve脚本
 * @author Joe Zhong <zhong.zhi@163.com>
 * @module tools/serve
 */
import { resolve, join } from 'path';
import { existsSync, readFileSync } from 'fs';
import pug from 'pug';
import Express from 'express';
import urlrewrite from 'packing-urlrewrite';
import { getPath, getContext as getGlobals } from 'packing-template-util';
import '../bootstrap';
import { pRequire, getContext } from '..';

const context = getContext();
const appConfig = pRequire('config/packing', {});
const {
  templateEngine,
  templateExtension,
  rewriteRules,
  path: {
    dist: {
      root: distRoot,
      templates,
      templatesPages
    },
    mockPages
  },
  port: {
    dist: port
  }
} = appConfig;

const template = () => async (req, res, next) => {
  const { templatePath, pageDataPath, globalDataPath } = getPath(req, {
    templates: join(distRoot, templatesPages),
    mockData: mockPages,
    extension: join(distRoot, templateExtension),
    globalData: '__global.js',
    rewriteRules
  });
  let globals = {};
  try {
    globals = await getGlobals(req, res, pageDataPath, globalDataPath);
  } catch (e) {
    console.log(e);
  }
  if (existsSync(templatePath)) {
    try {
      if (templateEngine === 'html') {
        const output = readFileSync(templatePath, { encoding: 'utf-8' });
        res.end(output);
      } else {
        res.end(pug.renderFile(templatePath, {
          ...globals,
          ...{ basedir: templates }
        }));
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
app.use(Express.static(resolve(context, distRoot)));
app.use(urlrewrite(rewriteRules));
app.use(template());

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.info('==> 🚧  Listening on port %s', port);
  }
});
