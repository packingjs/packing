/**
 * 初始化一个示例工程
 * @axample npm run test:example profiles ~/workspace/test3
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
const templateRoot = 'generator-packing/generators/app/templates';

const name = path.basename(destination);
const props = {
  props: {
    name,
    react: true,
    template: 'html',
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

// 在控制台显示执行的命令
shell.config.verbose = true;
shell.mkdir('-p', destination);
// 需要打开extglob模式
shell.exec('shopt -s extglob');
// 删除除node_modules之外的其他文件
shell.rm('-rf', `${destination}/!(node_modules)`);
// 部署example代码
shell.cp('-R', `examples/${example}/*`, destination);

copyTpl(
  `${templateRoot}/babelrc`,
  '.babelrc',
  props,
);

copyTpl(
  `${templateRoot}/eslintrc`,
  '.eslintrc',
  props,
);

copyTpl(
  `${templateRoot}/_package.json`,
  'package.json',
  props,
);

// 更新project中的node_modules
shell.mkdir(`${destination}/node_modules/packing`);
shell.cp('.babelrc', `${destination}/node_modules/packing`);
shell.cp('package.json', `${destination}/node_modules/packing`);
shell.cp('-R', 'bin', `${destination}/node_modules/packing`);
shell.cp('-R', 'config', `${destination}/node_modules/packing`);
shell.cp('-R', 'util', `${destination}/node_modules/packing`);
shell.cp('-R', 'src', `${destination}/node_modules/packing`);
