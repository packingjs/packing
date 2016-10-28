import fs from 'fs';
import path from 'path';
import { template } from 'lodash';

if (process.argv.length < 3) {
  console.log('Please specify the destination path');
  process.exit(1);
}

const destination = path.resolve(process.argv[2]);
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
  const targetPath = path.resolve(target);
  const content = template(fs.readFileSync(sourcePath, fsOptions))(data);
  fs.writeFileSync(targetPath, content, fsOptions);
  console.log(`${targetPath} created.`);
}

copyTpl(
  'generator-packing/generators/app/templates/babelrc',
  '.babelrc',
  props
);
copyTpl(
  'generator-packing/generators/app/templates/_package.json',
  'package.json',
  props
);
// template(this.fs.read(this.templatePath('README.md')));
