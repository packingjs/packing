import { existsSync } from 'fs';
// import rimraf from 'rimraf';
import pRequire from '../../../src/util/require';
import { execWebpack, getTestCaseName } from '../../util';

describe(getTestCaseName(), async () => { // eslint-disable-line
  before(async () => {
    process.env.CONTEXT = __dirname;
    await execWebpack(pRequire('config/webpack.dll.babel'));
  });

  after(async () => {
    // rimraf.sync(`${__dirname}/.tmp`);
  });

  it('应该能正确的输出vendor.js', async () => {
    existsSync(`${__dirname}/.tmp/dll/vendor.js`).should.be.true();
  });

  it('应该能正确的输出vendor-manifest.json', async () => {
    existsSync(`${__dirname}/.tmp/dll/vendor-manifest.json`).should.be.true();
  });
});
