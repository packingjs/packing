import { resolve } from 'path';
import request from 'supertest';
import webpack from 'webpack';
import Express from 'express';
import webpackDevMiddleware from 'webpack-dev-middleware';
import urlrewrite from 'packing-urlrewrite';
import '../../../src';
import { pRequire, middleware, getContext } from '../../../src';

describe('serve', async () => {
  let app;
  before(() => {
    const context = getContext();
    const appConfig = pRequire('config/packing');
    const webpackConfig = pRequire('config/webpack.serve.babel', {}, appConfig);
    const mwOptions = process.env.DEBUG ? {
      serverSideRender: true
    } : {
      serverSideRender: true,
      // 禁止 webpack-dev-middleware 输出日志
      logger: {
        info: () => {},
        error: console.log
      }
    };

    app = new Express();
    app.use(Express.static(resolve(context, appConfig.path.tmpDll)));
    const compiler = webpack(webpackConfig);
    const webpackDevMiddlewareInstance = webpackDevMiddleware(compiler, mwOptions);
    webpackDevMiddlewareInstance.waitUntilValid(async () => {
      app.use(urlrewrite(appConfig.rewriteRules));
      middleware(app, appConfig);
    });
    app.use(webpackDevMiddlewareInstance);
  });

  it('应该正常返回网页', async () => {
    const res = await request(app.listen()).get('/entry');
    res.status.should.eql(200);
  });

  it('应该正常返回entry.js', async () => {
    const res = await request(app.listen()).get('/entry.js');
    res.status.should.eql(200);
    res.text.should.match(/polyfill/);
  });
});
