import { existsSync } from 'fs';
// import rimraf from 'rimraf';
import pRequire from '../../../src/util/require';
import { execWebpack, getTestCaseName } from '../../util';

describe(getTestCaseName(), async () => {
  before(async () => {
    if (process.env.DEBUG) {
      const stdout = await execWebpack(pRequire('config/webpack.dll.babel'));
      console.log(stdout);
    } else {
      await execWebpack(pRequire('config/webpack.dll.babel'));
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
