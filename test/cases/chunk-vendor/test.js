import glob from 'packing-glob';
import rimraf from 'rimraf';
import { readFileSync } from 'fs';
import { exec, getTestCaseName } from '../../util';

describe(getTestCaseName(), async () => {
  before(async () => {
    const cmd = 'node_modules/.bin/babel-node src/bin/packing.js build';
    if (process.env.DEBUG) {
      const stdout = await exec(cmd);
      console.log(stdout);
    } else {
      await exec(cmd);
    }
  });

  after(async () => {
    // 删除临时文件
    if (!process.env.DEBUG) {
      rimraf.sync(`${__dirname}/prd`);
    }
  });

  describe('vendor.js', async () => {
    let content;
    it('应该能正常打出 vendor_*.js', async () => {
      const vendor = glob('vendor_*.js', { cwd: `${__dirname}/prd/js` });
      vendor.should.have.length(1);
      content = readFileSync(`${__dirname}/prd/js/${vendor[0]}`, {
        encoding: 'utf-8'
      });
    });

    it('vendor.js 中不应该包含 ./a.js', async () => {
      content.should.not.match(/"\.\/a\.js"/);
    });

    it('vendor.js 中应该包含 ./node_modules/sub/bbb.js', async () => {
      content.should.match(/"\.\/node_modules\/sub\/bbb\.js"/);
    });

    it('vendor.js 中应该包含 ./node_modules/ccc.js', async () => {
      content.should.match(/"\.\/node_modules\/ccc\.js"/);
    });

    it('vendor.js 中应该包含 ./d.js', async () => {
      content.should.match(/"\.\/d\.js"/);
    });
  });

  describe('a.js', async () => {
    let content;
    it('应该能正常打出 a_*.js', async () => {
      const a = glob('a_*.js', { cwd: `${__dirname}/prd/js` });
      a.should.have.length(1);
      content = readFileSync(`${__dirname}/prd/js/${a[0]}`, {
        encoding: 'utf-8'
      });
    });

    it('a.js 中应该包含 ./a.js', async () => {
      content.should.match(/"\.\/a\.js"/);
    });

    it('a.js 中不应该包含 ./node_modules/sub/bbb.js', async () => {
      content.should.not.match(/"\.\/node_modules\/sub\/bbb\.js"/);
    });

    it('a.js 中不应该包含 ./node_modules/ccc.js', async () => {
      content.should.not.match(/"\.\/node_modules\/ccc\.js"/);
    });

    it('a.js 中不应该包含 ./d.js', async () => {
      content.should.not.match(/"\.\/d\.js"/);
    });
  });
});
