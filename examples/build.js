const { execSync } = require('child_process');
const { readFileSync, writeFile } = require('fs');
const { join } = require('path');

const { CONTEXT } = process.env;

const options = require(join(CONTEXT, 'options'));

let stdout;
  if (options.build) {
  try {
    const cmd = `CONTEXT=${CONTEXT} NODE_ENV=local node_modules/.bin/babel-node src/bin/packing.js build`;
    stdout = execSync(cmd, { encoding: 'utf-8' });
  } catch (e) {
    console.log(e);
  }
}

let readme = readFileSync(join(CONTEXT, 'template.md'), 'utf-8');

const regexp = new RegExp('\\{\\{([^:\\}]+)\\}\\}', 'g');

readme = readme.replace(regexp, (match) => {
  match = match.substr(2, match.length - 4);
  if(match === 'stdout') {
    return stdout;
  }

  return readFileSync(join(CONTEXT, match), 'utf-8').replace(/[\r\n]*$/, '');
});

writeFile(join(CONTEXT, 'README.md'), readme, 'utf-8');
