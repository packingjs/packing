import { existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import request from 'supertest';
import Express from 'express';
import urlrewrite from 'packing-urlrewrite';
import { getTestCaseName } from '../../util';
import { getContext } from '../../../src';

const context = getContext();

const parserHtml = ({ templates }) => (req, res) => {
  const { pathname } = req._parsedUrl; // eslint-disable-line
  const file = `${resolve(context, templates)}${pathname}.html`;

  if (existsSync(file)) {
    const output = readFileSync(file, { encoding: 'utf-8' });
    res.end(output);
  } else {
    res.status(404);
  }
};

const rewriteRules = {
  '^/$': '/default'
};
const mockData = 'mock/pages';

describe(getTestCaseName(), async () => {
  ['html', 'pug', 'ejs', 'handlebars', 'smarty', 'velocity']
    .forEach(async (engine) => {
      // const engine = 'artTemplate';
      const extension = `.${engine}`;
      it(`${engine}模版应该解析正常`, async () => {
        const templates = 'templates/pages';
        const app = new Express();
        app.use(urlrewrite(rewriteRules));
        if (engine === 'html') {
          app.use(parserHtml({ templates }));
        } else {
          const options = {
            templates, // 使用相对路径
            mockData,
            rewriteRules,
            extension
          };
          if (engine === 'pug') {
            options.basedir = dirname(resolve(context, templates));
          }
          app.use(require(`packing-template-${engine}`)(options));
        }
        const res = await request(app.listen()).get('/default');
        res.status.should.eql(200);
        res.text.should.match(/Hello packing/);
      });
    });
});
