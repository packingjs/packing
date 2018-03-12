const cp = require('child_process');
const chalk = require('chalk');
const glob = require('glob');

const files = glob.sync('cases/**/index.js', { cwd: __dirname });

let failed = 0;
files.forEach((file, i) => {
  const cmd = `node_modules/.bin/mocha test/${file}`;
  console.log(chalk.yellow(`[${i + 1}/${files.length}] ${cmd}`));
  try {
    const stdout = cp.execSync(cmd, { encoding: 'utf-8' });
    console.log(stdout);
  } catch (e) {
    failed += 1;
    // console.log(e);
    console.log(chalk.red(e.stdout));
  }
});

console.log('done');

if (failed > 0) {
  console.log(chalk.red(`${failed} failed`));
}
