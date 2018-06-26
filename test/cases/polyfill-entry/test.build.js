import glob from 'packing-glob';
import rimraf from 'rimraf';
import { exec } from '../../util';

describe('build', async () => {
  before(async () => {
    const cmd = 'node_modules/.bin/babel-node src/bin/packing.js build';
    const stdout = await exec(cmd);
    if (process.env.DEBUG) {
      console.log(stdout);
    }
  });

  after(async () => {
    // 删除临时文件
    if (!process.env.DEBUG) {
      rimraf.sync(`${__dirname}/prd`);
    }
  });

  it('应该输出entry_\\w{8}.js', async () => {
    const files = glob('entry_*.js', { cwd: `${__dirname}/prd/js` });

    // 测试 entries 配置
    files.should.with.lengthOf(1);
    // 测试 md5 文件名
    files[0].should.with.lengthOf(17);
  });
});
