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

  describe('单层目录', async () => {
    let res;
    before(async () => {
      res = await request(app.listen()).get('/a');
      console.log(res.text);
    });

    it('应该正常返回网页', async () => {
      res.status.should.eql(200);
    });

    it('应该使用 master 母模版', async () => {
      res.text.should.match(/<h1>master<\/h1>/);
    });

    it('应该包含 favicon', async () => {
      res.text.should.match(/<link rel="icon" type="image\/png" href="images\/favico\.jpg">/);
    });

    it('应该包含网页标题', async () => {
      res.text.should.match(/<title>Page A<\/title>/);
    });

    it('应该包含网页关键字', async () => {
      res.text.should.match(/<meta name="keywords" content="A AA">/);
    });

    it('应该包含网页描述', async () => {
      res.text.should.match(/<meta name="description" content="A simple text">/);
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

    it('应该能获取到 __global.js 中的页面模拟数据', async () => {
      res.text.should.match(/<li>global<\/li>/);
    });

    it('应该能获取到特定页面的模拟数据', async () => {
      res.text.should.match(/<li>a<\/li>/);
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

    it('应该使用 default 母模版', async () => {
      res.text.should.match(/<h1>default<\/h1>/);
    });

    it('应该包含网页默认标题', async () => {
      res.text.should.match(/<title>Default title<\/title>/);
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

    it('应该能获取到 __global.js 中的页面模拟数据', async () => {
      res.text.should.match(/<li>global<\/li>/);
    });

    it('应该能获取到特定页面的模拟数据', async () => {
      res.text.should.match(/<li>c\/d<\/li>/);
    });
  });

  describe('网址转发', async () => {
    let res;
    before(async () => {
      res = await request(app.listen()).get('/test');
    });

    it('/test 应该转发到 /a', async () => {
      res.status.should.eql(200);
      res.text.should.match(/<title>Page A<\/title>/);
    });
  });
});
