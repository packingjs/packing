import { readFileSync } from 'fs';
import glob from 'packing-glob';
import rimraf from 'rimraf';
import { exec, getTestCaseName } from '../../util';

describe(getTestCaseName(), async () => {
  let files;
  let content;
  before(async () => {
    const cmd = 'node_modules/.bin/babel-node src/bin/packing.js build';
    const stdout = await exec(cmd);
    if (process.env.DEBUG) {
      console.log(stdout);
    }
    files = glob('main_*.js', { cwd: `${__dirname}/prd/js` });
    content = readFileSync(`${__dirname}/prd/js/${files[0]}`, {
      encoding: 'utf-8'
    });
  });

  after(async () => {
    // 删除临时文件
    if (!process.env.DEBUG) {
      rimraf.sync(`${__dirname}/prd`);
    }
  });

  it('应该输出main_\\w{8}.js', async () => {
    // 测试 entries 配置
    files.should.with.lengthOf(1);
    // 测试 md5 文件名
    files[0].should.with.lengthOf(16);
  });

  it('应该不包含代码注释', async () => {
    content.should.not.match(/\/\*\*\*\*\*\*\//);
  });
});
