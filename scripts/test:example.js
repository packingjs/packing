/**
 * 初始化一个示例工程
 * @axample npm run test-example profiles ~/workspace/test3
 */
import fs from 'fs';
import path from 'path';
import { template } from 'lodash';
import shell from 'shelljs';

if (process.argv.length < 3) {
  console.log('Please specify example name');
  process.exit(1);
}

if (process.argv.length < 4) {
  console.log('Please specify the destination path');
  process.exit(1);
}

const example = process.argv[2];
const destination = path.resolve(process.argv[3]);
console.log('==', destination);
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

shell.mkdir('-p', destination);
shell.cp('-R', `examples/${example}/*`, destination);

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

// 更新project中的node_modules
shell.mkdir(`${destination}/node_modules/packing`);
shell.cp('.babelrc', `${destination}/node_modules/packing`);
shell.cp('package.json', `${destination}/node_modules/packing`);
shell.cp('-R', 'bin', `${destination}/node_modules/packing`);
shell.cp('-R', 'config', `${destination}/node_modules/packing`);
shell.cp('-R', 'util', `${destination}/node_modules/packing`);
