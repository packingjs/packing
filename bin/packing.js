#!/usr/bin/env babel-node

var path = require('path');
var program = require('commander');
var pkg = require('packing/package.json');

program
  .version(pkg.version)
  .command('serve', 'start dev web server', { isDefault: true })
  .command('serve:dist', 'review build output')
  .command('dll', 'run webpack DllPlugin')
  .parse(process.argv);

// process.exit(1);
