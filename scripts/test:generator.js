/**
 * 初始化一个示例工程
 * @axample npm run test-generator ~/workspace/test
 */
import fs from 'fs';
import path from 'path';
import { template } from 'lodash';
import shell from 'shelljs';

if (process.argv.length < 3) {
  console.log('Please specify the destination path');
  process.exit(1);
}

const destination = path.resolve(process.argv[2]);
const templateRoot = 'generator-packing/generators/app/templates';
const name = path.basename(destination);
const props = {
  props: {
    name,
    react: false,
  },
};

function copyTpl(source, target, data) {
  const fsOptions = { encoding: 'utf8' };
  const sourcePath = path.resolve(source);
  const targetPath = path.resolve(destination, target);
  const content = template(fs.readFileSync(sourcePath, fsOptions))(data);
  fs.writeFileSync(targetPath, content, fsOptions);
  console.log(`${targetPath} created.`);
}

copyTpl(
  `${templateRoot}/babelrc`,
  '.babelrc',
  props
);
copyTpl(
  `${templateRoot}/eslintrc`,
  '.eslintrc',
  props
);
copyTpl(
  `${templateRoot}/_package.json`,
  'package.json',
  props
);

shell.rm('-rf', `${destination}/.tmp`);
shell.rm('-rf', `${destination}/assets`);
shell.rm('-rf', `${destination}/config`);
shell.rm('-rf', `${destination}/mock`);
shell.rm('-rf', `${destination}/src`);

shell.cp('-R', `${templateRoot}/assets`, `${destination}/assets`);
shell.cp('-R', `${templateRoot}/config`, `${destination}/config`);
shell.cp('-R', `${templateRoot}/mock`, `${destination}/mock`);
shell.cp('-R', `${templateRoot}/src`, `${destination}/src`);

// 更新project中的node_modules
shell.cp('package.json', `${destination}/node_modules/packing/package.json`);
shell.cp('-R', 'bin', `${destination}/node_modules/packing`);
shell.cp('-R', 'config', `${destination}/node_modules/packing`);
shell.cp('-R', 'util', `${destination}/node_modules/packing`);
