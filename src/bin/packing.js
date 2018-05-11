#!/usr/bin/env node

import program from 'commander';
import validateSchema from '../lib/validate-schema';
import pkg from '../../package.json';

console.log('Versions:');
console.log(` user-agent: ${process.env.npm_config_user_agent}`);
console.log(` packing: ${pkg.version}`);

validateSchema();

program
  .command('serve', 'start dev web server')
  .command('serve-dist', 'review build output')
  .alias('serve:dist')
  .command('build', 'build project')
  .command('dll', 'build dll')
  .parse(process.argv);
