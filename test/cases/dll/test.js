import { existsSync } from 'fs';
// import rimraf from 'rimraf';
import { pRequire } from '../../../src';
import { execWebpack, getTestCaseName } from '../../util';

describe(getTestCaseName(), async () => {
  before(async () => {
    const stdout = await execWebpack(pRequire('config/webpack.dll.babel'));
    if (process.env.DEBUG) {
      console.log(stdout);
    }
  });

  after(async () => {
    // 留着给其他case使用
    // rimraf.sync(`${__dirname}/.tmp`);
  });

  it('应该能正确的输出vendor.js', async () => {
    existsSync(`${__dirname}/.tmp/dll/vendor.js`).should.be.true();
  });

  it('应该能正确的输出vendor-manifest.json', async () => {
    existsSync(`${__dirname}/.tmp/dll/vendor-manifest.json`).should.be.true();
  });
});
