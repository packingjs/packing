import should from 'should';
// import { existsSync, stat } from 'fs';
// import path from 'path';
import glob from 'packing-glob';
import { exec, createFile, createPackingConfig } from './util';

describe('packing config', function entries() {
  // 设置 mocha 实例超时时间
  // 由于 this 的原因，该方法不能在箭头函数中使用
  this.timeout(30 * 1000);

  describe('path.entries', async () => {
    before(async () => {
      createPackingConfig(`
        p.path.entries = './entry.js';
      `);
      createFile('entry.js', `
        console.log('Hi');
      `);
    });

    it('设置为字符串应该输出main_\\w{8}.js', async () => {
      const cmd = 'CONTEXT=test/src node_modules/.bin/babel-node src/bin/packing.js build';
      await exec(cmd);
      const files = glob('main_*.js', { cwd: 'prd/assets/js' });

      // 测试 entries 配置
      should(files).with.lengthOf(1);
      // 测试 md5 文件名
      files[0].should.with.lengthOf(16);
    });

    after(async () => {
      console.log('---after');
    });
  });
});
