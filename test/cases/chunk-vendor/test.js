import glob from 'packing-glob';
import rimraf from 'rimraf';
import { exec, getTestCaseName } from '../../util';

describe(getTestCaseName(), async () => {
  before(async () => {
    const cmd = 'node_modules/.bin/babel-node src/bin/packing.js build';
    if (process.env.DEBUG) {
      const stdout = await exec(cmd);
      console.log(stdout);
    } else {
      await exec(cmd);
    }
  });

  after(async () => {
    // 删除临时文件
    if (!process.env.DEBUG) {
      rimraf.sync(`${__dirname}/prd`);
      rimraf.sync(`${__dirname}/.tmp`);
    }
  });

  it('应该能正常打出vendor包', async () => {
    const files = glob('vendor_*.js', { cwd: `${__dirname}/prd/assets/js` });

    // 测试 entries 配置
    files.should.with.lengthOf(1);
  });
});
