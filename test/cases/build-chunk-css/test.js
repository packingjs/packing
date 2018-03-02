import should from 'should';
import glob from 'packing-glob';
// import rimraf from 'rimraf';
import { exec } from '../../util';
import { getTestCaseName } from '../../util';

// 等 extract-text-webpack-plugin 兼容 webpack v4 后再开启该用例
describe.skip(getTestCaseName(), function main() { // eslint-disable-line
  // 设置 mocha 实例超时时间
  // 由于 this 的原因，该方法不能在箭头函数中使用
  this.timeout(30 * 1000);

  it('应该能正常打出entry.css', async () => {
    const cmd = `CONTEXT=${__dirname} node_modules/.bin/babel-node src/bin/packing.js build`;
    await exec(cmd);
    const files = glob('entry_*.css', { cwd: `${__dirname}/prd/assets/css` });

    // 测试 entries 配置
    files.should.with.lengthOf(1);
  });

  after(async () => {
    // 删除临时文件
    // rimraf.sync(`${__dirname}/prd`);
  });
});
