import rimraf from 'rimraf';
import request from 'supertest';
import webpack from 'webpack';
import Express from 'express';
import webpackDevMiddleware from 'webpack-dev-middleware';
import '../../../src';
import { pRequire } from '../../../src';
import { exec, getTestCaseName } from '../../util';

describe(getTestCaseName(), async () => {
  after(async () => {
    // 删除临时文件
    if (!process.env.DEBUG) {
      rimraf.sync(`${__dirname}/prd`);
    }
  });

  it('应该能在/b.js中找到vendor的引用', async () => {
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
    const app = new Express();
    app.use(webpackDevMiddleware(compiler, mwOptions));
    const { text, status } = await request(app.listen()).get('/b.js');
    status.should.eql(200);
    text.should.match(/module\.exports = vendor_/);
  });

  it('manifest', async () => {
    const cmd = 'node_modules/.bin/babel-node src/bin/packing.js build';
    const stdout = await exec(cmd);
    if (process.env.DEBUG) {
      console.log(stdout);
    }
  });
});
