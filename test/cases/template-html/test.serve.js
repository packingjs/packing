import { resolve } from 'path';
import request from 'supertest';
import webpack from 'webpack';
import Express from 'express';
import webpackDevMiddleware from 'webpack-dev-middleware';
import '../../../src';
import { getContext, pRequire, middleware } from '../../../src';

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
      middleware(app, appConfig);
    });
    app.use(webpackDevMiddlewareInstance);
  });

  describe('单层目录', async () => {
    let res;
    before(async () => {
      res = await request(app.listen()).get('/a');
    });

    it('应该正常返回网页', async () => {
      res.status.should.eql(200);
    });

    it('应该包含网页标题', async () => {
      res.text.should.match(/<title>Title<\/title>/);
    });

    it('应该包含网页关键字', async () => {
      res.text.should.match(/<meta name="keywords" content="Keywords">/);
    });

    it('应该包含网页描述', async () => {
      res.text.should.match(/<meta name="description" content="Description">/);
    });

    it('应该将存在的 __var__ 变量替换为实际变量', async () => {
      res.text.should.match(/<h1>city<\/h1>/);
    });

    it('应该将不存在的 __var__ 变量替换为空字符串', async () => {
      res.text.should.match(/<h2><\/h2>/);
    });

    it('应该不引用 e.js', async () => {
      res.text.should.not.match(/<script src="\/e\.js"><\/script>/);
    });

    it('应该引用了 vendor.js', async () => {
      res.text.should.match(/<script src="\/vendor\.js"><\/script>/);
    });

    it('应该引用了 a.js', async () => {
      res.text.should.match(/<script src="\/a\.js"><\/script>/);
    });

    it('应该按 vendor.js -> a.js 的顺序引用', async () => {
      const vendorMatches = res.text.match('<script src="/vendor.js"></script>');
      const aMatches = res.text.match('<script src="/a.js"></script>');
      (vendorMatches.index < aMatches.index).should.be.true();
    });

    it('应该访问到 /a.js', async () => {
      const { status } = await request(app.listen()).get('/a.js');
      status.should.eql(200);
    });

    it('应该访问到 /vendor.js', async () => {
      const { status } = await request(app.listen()).get('/vendor.js');
      status.should.eql(200);
    });
  });

  describe('多层目录', async () => {
    let res;
    before(async () => {
      res = await request(app.listen()).get('/c/d');
    });

    it('应该正常返回网页', async () => {
      res.status.should.eql(200);
    });

    it('应该使用 master2.html 母模版', async () => {
      res.text.should.match(/<h1>master2<\/h1>/);
    });

    it('应该包含网页标题', async () => {
      res.text.should.match(/<title><\/title>/);
    });

    it('应该不包含网页关键字', async () => {
      res.text.should.not.match(/<meta name="keywords"/);
    });

    it('应该不包含网页描述', async () => {
      res.text.should.not.match(/<meta name="description"/);
    });

    it('应该引用了 vendor.js', async () => {
      res.text.should.match(/<script src="\/vendor\.js"><\/script>/);
    });

    it('应该引用了 c/d.js', async () => {
      res.text.should.match(/<script src="\/c\/d\.js"><\/script>/);
    });

    it('应该按 vendor.js -> c/d.js 的顺序引用', async () => {
      const vendorMatches = res.text.match('<script src="/vendor.js"></script>');
      const aMatches = res.text.match('<script src="/c/d.js"></script>');
      (vendorMatches.index < aMatches.index).should.be.true();
    });
  });
});
