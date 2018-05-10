#!/usr/bin/env node

/**
 * serve脚本
 * @author Joe Zhong <zhong.zhi@163.com>
 * @module tools/serve
 */
import { join, resolve, dirname } from 'path';
import { existsSync, readFileSync } from 'fs';
import { isString } from 'util';
import Express from 'express';
import urlrewrite from 'packing-urlrewrite';
import '../bootstrap';
import { pRequire, getContext } from '..';

const context = getContext();
const appConfig = pRequire('config/packing', {});
const {
  template: {
    options: {
      engine,
      extension
    }
  },
  rewriteRules,
  path: {
    dist: {
      root: distRoot,
      templates: distTemplates
    },
    mockPages
  },
  port: {
    dist: port
  }
} = appConfig;

let templates = isString(distTemplates) ? distTemplates : distTemplates.pages;
templates = join(distRoot, templates);

const parserHtml = ({ templates: templateRoot }) => (req, res) => {
  const { pathname } = req._parsedUrl; // eslint-disable-line
  const file = `${resolve(context, templateRoot)}${pathname}.html`;

  if (existsSync(file)) {
    const output = readFileSync(file, { encoding: 'utf-8' });
    res.end(output);
  } else {
    res.status(404);
  }
};

const app = new Express();
app.use(Express.static(resolve(context, distRoot)));
app.use(urlrewrite(rewriteRules));
if (engine === 'html') {
  app.use(parserHtml({ templates }));
} else {
  const options = {
    templates, // 使用相对路径
    mockData: mockPages,
    rewriteRules,
    extension
  };
  if (engine === 'pug') {
    options.basedir = dirname(resolve(context, templates));
  }
  app.use(require(`packing-template-${engine}`)(options));
}

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.info('==> 🚧  Listening on port %s', port);
  }
});
