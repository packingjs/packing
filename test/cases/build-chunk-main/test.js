import glob from 'packing-glob';
import rimraf from 'rimraf';
import { exec } from '../../util';
import { getTestCaseName } from '../../util';

describe(getTestCaseName(), async () => { // eslint-disable-line
  beforeEach(() => {
    process.env.CONTEXT = __dirname;
  });

  it('设置为字符串应该输出main_\\w{8}.js', async () => {
    const cmd = 'node_modules/.bin/babel-node src/bin/packing.js build';
    await exec(cmd);
    const files = glob('main_*.js', { cwd: `${__dirname}/prd/assets/js` });

    // 测试 entries 配置
    files.should.with.lengthOf(1);
    // 测试 md5 文件名
    files[0].should.with.lengthOf(16);
  });

  after(async () => {
    // 删除临时文件
    rimraf.sync(`${__dirname}/prd`);
  });
});
