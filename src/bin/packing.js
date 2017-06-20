#!/usr/bin/env node

import program from 'commander';
import pkg from '../../package.json';

console.log('Versions:');
console.log(` user-agent: ${process.env.npm_config_user_agent}`);
console.log(` packing: ${pkg.version}`);

program
  .command('serve', 'start dev web server', { isDefault: true })
  .command('serve:dist', 'review build output')
  .command('build', 'build project')
  .command('lint', 'lint code')
  .parse(process.argv);
