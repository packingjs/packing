import request from 'supertest';
import webpack from 'webpack';
import Express from 'express';
import webpackDevMiddleware from 'webpack-dev-middleware';
import '../../../src/util/babel-register';
import pRequire from '../../../src/util/require';
import { getTestCaseName } from '../../util';

describe(getTestCaseName(), async () => { // eslint-disable-line
  let app;
  before(() => {
    process.env.CONTEXT = __dirname;
    const appConfig = pRequire('config/packing');
    const webpackConfig = pRequire('config/webpack.serve.babel', {}, appConfig);
    const mwOptions = {
      // 禁止 webpack-dev-middleware 输出日志
      logger: {
        info: () => {},
        error: console.log
      }
    };

    // eslint-disable-next-line
    const compiler = webpack(webpackConfig);
    const webpackDevMiddlewareInstance = webpackDevMiddleware(compiler, mwOptions);
    app = new Express();
    app.use(webpackDevMiddlewareInstance);
  });

  beforeEach(() => {
    process.env.CONTEXT = __dirname;
  });

  it('应该能访问到/a.html', async () => {
    const { status, text } = await request(app.listen()).get('/a.html');
    status.should.eql(200);
    console.log(text);
  });

  it('应该在/a.html找到a.js', async () => {
    const { text } = await request(app.listen()).get('/a.html');
    text.should.match(/<script type="text\/javascript" src="\/a\.js">/);
  });

  it('应该能访问到/a.js', async () => {
    const { header, text, status } = await request(app.listen()).get('/a.js');
    status.should.eql(200);
    text.length.toString().should.eql(header['content-length']);
  });

  it('应该能访问到/b.html', async () => {
    const { status } = await request(app.listen()).get('/b.html');
    status.should.eql(200);
  });

  it('应该在/b.html找到b.js', async () => {
    const { text } = await request(app.listen()).get('/b.html');
    text.should.match(/<script type="text\/javascript" src="\/b\.js">/);
  });

  it('应该能访问到/b.js', async () => {
    const { header, text, status } = await request(app.listen()).get('/b.js');
    status.should.eql(200);
    text.length.toString().should.eql(header['content-length']);
  });
});
