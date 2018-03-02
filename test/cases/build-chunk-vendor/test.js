import should from 'should';
// import { existsSync, stat } from 'fs';
// import path from 'path';
import glob from 'packing-glob';
// import rimraf from 'rimraf';
import { exec /* , createFile, createPackingConfig */ } from '../../util';
import { getTestCaseName } from '../../util';

describe(getTestCaseName(), function main() { // eslint-disable-line
  // 设置 mocha 实例超时时间
  // 由于 this 的原因，该方法不能在箭头函数中使用
  this.timeout(30 * 1000);

  // before(async () => {
  //   createPackingConfig(`
  //     p.path.entries = './entry.js';
  //     p.commonChunks = {
  //       vendor: [
  //         './a'
  //       ]
  //     }
  //   `);
  //   createFile('entry.js', `
  //     import a from './a';
  //     console.log(a);
  //   `);
  //   createFile('a.js', `
  //     export default 'a';
  //   `);
  // });

  it('应该能正常打出vendor包', async () => {
    const cmd = `CONTEXT=${__dirname} node_modules/.bin/babel-node src/bin/packing.js build`;
    await exec(cmd);
    const files = glob('vendor_*.js', { cwd: `${__dirname}/prd/assets/js` });

    // 测试 entries 配置
    files.should.with.lengthOf(1);
  });

  after(async () => {
    // 删除临时文件
    // rimraf.sync(`${__dirname}/prd`);
  });
});
