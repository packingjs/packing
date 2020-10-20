import { readFileSync, existsSync } from 'fs';
import rimraf from 'rimraf';
import { exec, getTestCaseName } from '../../util';

describe(getTestCaseName(), async () => {
  const cssFile = `${__dirname}/prd/css/entry.css`;
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

  it('应该能正常打出 entry.css', async () => {
    existsSync(cssFile).should.be.true();
  });

  it.skip('应该正常使用 autoprefixer', async () => {
    const cssContent = readFileSync(cssFile, 'utf8');
    cssContent.should.match(/-webkit-/);
  });
});
