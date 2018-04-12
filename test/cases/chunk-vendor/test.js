import glob from 'packing-glob';
import rimraf from 'rimraf';
import { readFileSync } from 'fs';
import { join } from 'path';
import { exec, getTestCaseName, createFile } from '../../util';

function getHash(name) {
  return name.replace(/(\w+)_(\w+).js/, '$2');
}

describe(getTestCaseName(), async () => {
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

  let vendorHash;
  let aHash;
  describe('vendor.js', async () => {
    let content;
    it('应该能正常打出 vendor_*.js', async () => {
      const vendor = glob('vendor_*.js', { cwd: `${__dirname}/prd/js` });
      vendor.should.have.length(1);
      vendorHash = getHash(vendor[0]);
      content = readFileSync(`${__dirname}/prd/js/${vendor[0]}`, {
        encoding: 'utf-8'
      });
    });

    it('vendor.js 中不应该包含 ./a.js', async () => {
      content.should.not.match(/"\.\/a\.js"/);
    });

    it('vendor.js 中不应该包含 ./useless.js', async () => {
      content.should.not.match(/"\.\/useless\.js"/);
    });

    it('vendor.js 中应该包含 ./node_modules/sub/bbb.js', async () => {
      content.should.match(/"\.\/node_modules\/sub\/bbb\.js"/);
    });

    it('vendor.js 中应该包含 ./node_modules/sub2 所有文件', async () => {
      content.should.match(/"\.\/node_modules\/sub2\/a\.js"/);
      content.should.match(/"\.\/node_modules\/sub2\/b\.js"/);
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
      aHash = getHash(a[0]);
      content = readFileSync(`${__dirname}/prd/js/${a[0]}`, {
        encoding: 'utf-8'
      });
    });

    it('a.js 中应该包含 ./a.js', async () => {
      content.should.match(/"\.\/a\.js"/);
    });

    it('vendor.js 中不应该包含 ./useless.js', async () => {
      content.should.not.match(/"\.\/useless\.js"/);
    });

    it('a.js 中不应该包含 ./node_modules/sub/bbb.js', async () => {
      content.should.not.match(/"\.\/node_modules\/sub\/bbb\.js"/);
    });

    it('vendor.js 中不应该包含 ./node_modules/sub2 任何文件', async () => {
      content.should.not.match(/"\.\/node_modules\/sub2\/a\.js"/);
      content.should.not.match(/"\.\/node_modules\/sub2\/b\.js"/);
    });

    it('a.js 中不应该包含 ./node_modules/ccc.js', async () => {
      content.should.not.match(/"\.\/node_modules\/ccc\.js"/);
    });

    it('a.js 中不应该包含 ./d.js', async () => {
      content.should.not.match(/"\.\/d\.js"/);
    });
  });

  describe('hash 比较', async () => {
    describe('a.js 内容改变', async () => {
      let origin;
      before(async () => {
        origin = readFileSync(join(__dirname, 'a.js'));
        createFile('a.js', `${origin}\n/* new */`);

        const cmd = 'node_modules/.bin/babel-node src/bin/packing.js build';
        const stdout = await exec(cmd);
        if (process.env.DEBUG) {
          console.log(stdout);
        }
      });

      after(async () => {
        createFile('a.js', origin);
      });

      it('a.js 的 hash 应该改变', async () => {
        const a = glob('a_*.js', { cwd: `${__dirname}/prd/js` });
        a.should.have.length(1);
        getHash(a[0]).should.not.eql(aHash);
      });

      it('vendor.js 的 hash 应该不变', async () => {
        const vendor = glob('vendor_*.js', { cwd: `${__dirname}/prd/js` });
        vendor.should.have.length(1);
        getHash(vendor[0]).should.eql(vendorHash);
      });
    });

    describe('vendor 的内容改变', async () => {
      let origin;
      before(async () => {
        origin = readFileSync(join(__dirname, 'node_modules/ccc.js'));
        createFile('node_modules/ccc.js', `${origin}\n/* new */`);

        const cmd = 'node_modules/.bin/babel-node src/bin/packing.js build';
        const stdout = await exec(cmd);
        if (process.env.DEBUG) {
          console.log(stdout);
        }
      });
      after(async () => {
        createFile('node_modules/ccc.js', origin);
      });
      it('a.js 的 hash 应该不变', async () => {
        const a = glob('a_*.js', { cwd: `${__dirname}/prd/js` });
        a.should.have.length(1);
        getHash(a[0]).should.eql(aHash);
      });
      it('vendor.js 的 hash 应该改变', async () => {
        const vendor = glob('vendor_*.js', { cwd: `${__dirname}/prd/js` });
        vendor.should.have.length(1);
        getHash(vendor[0]).should.not.eql(vendorHash);
      });
    });
  });
});
