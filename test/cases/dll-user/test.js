import should from 'should';
import request from 'supertest';
import webpack from 'webpack';
import Express from 'express';
import webpackDevMiddleware from 'webpack-dev-middleware';
import '../../../src/util/babel-register';
import pRequire from '../../../src/util/require';
import { getTestCaseName } from '../../util';

describe(getTestCaseName(), async () => {
  let app;

  before(() => {
    const appConfig = pRequire('config/packing');
    const webpackConfig = pRequire('config/webpack.serve.babel', {}, appConfig);
    const mwOptions = process.env.DEBUG ? {} : {
      // 禁止 webpack-dev-middleware 输出日志
      logger: {
        info: () => {},
        error: console.log
      }
    };

    const compiler = webpack(webpackConfig);
    app = new Express();
    app.use(webpackDevMiddleware(compiler, mwOptions));
  });

  it('应该能在/b.js中找到vendor的引用', async () => {
    const { text, status } = await request(app.listen()).get('/b.js');
    status.should.eql(200);
    text.should.match(/module\.exports = vendor_/);
  });
});
