const { execSync } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');
const rimraf = require('rimraf');
const { join } = require('path');

const { CONTEXT } = process.env;

// 删除 README.md
rimraf.sync(`${CONTEXT}/README.md`);

const stdout = {};
const actions = require(join(CONTEXT, 'actions'));
Object.keys(actions).forEach((action) => {
  if (actions[action]) {
    try {
      const cmd = `CONTEXT=${CONTEXT} NODE_ENV=local node_modules/.bin/babel-node src/bin/packing.js ${action}`;
      stdout[action] = execSync(cmd, { encoding: 'utf-8' });
    } catch (e) {
      console.log(e);
    }
  }
});
// process.exit(0);

let readme = readFileSync(join(CONTEXT, 'template.md'), 'utf-8');

const regexp = new RegExp('\\{\\{([^}]+)\\}\\}', 'g');

readme = readme.replace(regexp, (match) => {
  match = match.substr(2, match.length - 4);
  const result = /stdout:(build|serve)/.exec(match);
  if (result !== null) {
    const action = result[1];
    return stdout[action] || '';
  }

  return readFileSync(join(CONTEXT, match), 'utf-8').replace(/[\r\n]*$/, '');
});

writeFileSync(join(CONTEXT, 'README.md'), readme, 'utf-8');

// 删除 prd
rimraf.sync(`${CONTEXT}/prd`);
