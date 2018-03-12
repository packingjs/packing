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
    }
  });

  it('应该输出main_\\w{8}.js', async () => {
    const files = glob('main_*.js', { cwd: `${__dirname}/prd/assets/js` });

    // 测试 entries 配置
    files.should.with.lengthOf(1);
    // 测试 md5 文件名
    files[0].should.with.lengthOf(16);
  });
});
