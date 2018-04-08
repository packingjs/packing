import rimraf from 'rimraf';
import { exec, getTestCaseName } from '../../util';

describe(getTestCaseName(), async () => {
  it('packing serve 应该报错', async () => {
    const cmd = 'node_modules/.bin/babel-node src/bin/packing.js serve --skip_dll';
    try {
      await exec(cmd);
      should.fail(); // eslint-disable-line
    } catch (error) {
      if (process.env.DEBUG) {
        console.log(error.message);
      }
      error.message.should.match(/Expected empty line before rule/);
    }
  });

  it('packing build 应该报错', async () => {
    const cmd = 'node_modules/.bin/babel-node src/bin/packing.js build';
    try {
      await exec(cmd);
      should.fail(); // eslint-disable-line
    } catch (error) {
      error.code.should.eql(1);
    }
    if (!process.env.DEBUG) {
      rimraf.sync(`${__dirname}/prd`);
    }
  });
});
