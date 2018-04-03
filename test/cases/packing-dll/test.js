import importFresh from 'import-fresh';
import rimraf from 'rimraf';
import { exec, getTestCaseName, createFile } from '../../util';

describe(getTestCaseName(), async () => {
  before(async () => {
    rimraf.sync(`${__dirname}/.tmp`);
  });

  after(async () => {
    // 删除临时文件
    if (!process.env.DEBUG) {
      rimraf.sync(`${__dirname}/.tmp`);
    }
    createFile('package.json', `{
      "dependencies": {
        "a": "^8.13"
      },
      "devDependencies": {
        "b": "^1.3.2",
        "c": "^1.18.2"
      }
    }`);
  });

  it('第一次应该执行 DLL 编译', async () => {
    const cmd = 'node_modules/.bin/babel-node src/bin/packing.js dll';
    const stdout = await exec(cmd);
    if (process.env.DEBUG) {
      console.log(stdout);
    }
    stdout.should.match(/DllPlugin executed!/);
  });

  it('第二次应该跳过 DLL 编译', async () => {
    const cmd = 'node_modules/.bin/babel-node src/bin/packing.js dll';
    const stdout = await exec(cmd);
    if (process.env.DEBUG) {
      console.log(stdout);
    }
    stdout.should.match(/DllPlugin skipped!/);
  });

  it('带 -c 参数时应该强行执行 DLL 编译', async () => {
    const cmd = 'node_modules/.bin/babel-node src/bin/packing.js dll -c';
    const stdout = await exec(cmd);
    if (process.env.DEBUG) {
      console.log(stdout);
    }
    stdout.should.match(/DllPlugin executed!/);
  });

  it('依赖发生变化时应该重新执行 DLL 编译', async () => {
    const { hash } = importFresh(`${__dirname}/.tmp/dll/hash.json`);
    createFile('package.json', `{
      "dependencies": {
        "a": "^8.14"
      },
      "devDependencies": {
        "b": "^1.3.2",
        "c": "^1.18.2"
      }
    }`);
    const cmd = 'node_modules/.bin/babel-node src/bin/packing.js dll';
    const stdout = await exec(cmd);
    if (process.env.DEBUG) {
      console.log(stdout);
    }
    const { hash: newHash } = importFresh(`${__dirname}/.tmp/dll/hash.json`);
    newHash.should.not.eql(hash);
  });
});
