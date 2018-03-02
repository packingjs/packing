import should from 'should';
import glob from 'packing-glob';
import rimraf from 'rimraf';
import { exec /* , createFile, createPackingConfig */ } from '../../util';
import { getTestCaseName } from '../../util';

describe.skip(getTestCaseName(), function main() { // eslint-disable-line
  // 设置 mocha 实例超时时间
  // 由于 this 的原因，该方法不能在箭头函数中使用
  this.timeout(30 * 1000);

  // before(async () => {
  //   createPackingConfig(`
  //     p.path.entries = {
  //       entry: './entry.js'
  //     };
  //   `);
  //   createFile('entry.js', `
  //     import './a.css';
  //   `);
  //   createFile('a.css', `
  //     .c {
  //       color: '#f00';
  //       content: '===c class==='
  //     }
  //   `);
  // });

  it.skip('应该能正常打出entry.css', async () => {
    const cmd = `CONTEXT=${__dirname} node_modules/.bin/babel-node src/bin/packing.js build`;
    await exec(cmd);
    const files = glob('entry.css', { cwd: `${__dirname}/prd/assets/css` });

    // 测试 entries 配置
    should(files).with.lengthOf(1);
  });

  after(async () => {
    // 删除临时文件
    rimraf.sync(`${__dirname}/prd`);
  });
});
