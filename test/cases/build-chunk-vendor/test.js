import glob from 'packing-glob';
import rimraf from 'rimraf';
import { exec /* , createFile, createPackingConfig */ } from '../../util';
import { getTestCaseName } from '../../util';

describe(getTestCaseName(), async function main() { // eslint-disable-line
  beforeEach(() => {
    process.env.CONTEXT = __dirname;
  });

  it('应该能正常打出vendor包', async () => {
    const cmd = 'node_modules/.bin/babel-node src/bin/packing.js build';
    await exec(cmd);
    const files = glob('vendor_*.js', { cwd: `${__dirname}/prd/assets/js` });

    // 测试 entries 配置
    files.should.with.lengthOf(1);
  });

  after(async () => {
    // 删除临时文件
    rimraf.sync(`${__dirname}/prd`);
    rimraf.sync(`${__dirname}/.tmp`);
  });
});
