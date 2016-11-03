/**
 * 本地安装generator
 * @axample npm run test:generator
 */
import shell from 'shelljs';

// rm -rf /usr/local/lib/node_modules/generator-packing
// cp -R ../generator-packing /usr/local/lib/node_modules

shell.exec('shopt -s extglob');
shell.rm('-rf', '/usr/local/lib/node_modules/generator-packing/!(node_modules)');
shell.cp('-R', 'generator-packing', '/usr/local/lib/node_modules');

console.log('✔ generator-packing install successfully');
