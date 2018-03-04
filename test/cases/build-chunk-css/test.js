import glob from 'packing-glob';
import rimraf from 'rimraf';
import { exec } from '../../util';
import { getTestCaseName } from '../../util';

// 等 extract-text-webpack-plugin 兼容 webpack v4 后再开启该用例
describe.skip(getTestCaseName(), async () => { // eslint-disable-line
  beforeEach(() => {
    process.env.CONTEXT = __dirname;
  });

  it('应该能正常打出entry.css', async () => {
    const cmd = 'node_modules/.bin/babel-node src/bin/packing.js build';
    await exec(cmd);
    const files = glob('entry_*.css', { cwd: `${__dirname}/prd/assets/css` });

    // 测试 entries 配置
    files.should.with.lengthOf(1);
  });

  after(async () => {
    // 删除临时文件
    rimraf.sync(`${__dirname}/prd`);
  });
});
