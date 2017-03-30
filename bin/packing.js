#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');

console.log('Versions:');
console.log(` user-agent: ${process.env.npm_config_user_agent}`);
console.log(` packing: ${pkg.version}`);

program
  .command('serve', 'start dev web server', { isDefault: true })
  .command('serve:dist', 'review build output')
  .command('build', 'build project')
  .parse(process.argv);
