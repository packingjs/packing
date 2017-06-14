#!/usr/bin/env node

require('../util/babel-register');

const chalk = require('chalk');
const webpack = require('webpack');
const pRequire = require('../util/require');
const formatError = require('../util/require');

const webpackConfig = pRequire('config/webpack.build.babel', {});

webpack(webpackConfig, function (err, stats) {
  if (err) {
    console.log(err);
  } else if (stats.hasErrors()) {
    stats.compilation.errors.map(formatError).forEach((error) => {
      console.log('\n');
      console.log(chalk.red('ERROR in ' + error));
      console.log('\n');
    });
    console.log(chalk.red('💔  webpack: bundle is now INVALID.'));
  } else if (stats.hasWarnings()) {
    console.log(chalk.yellow('⚠️  webpack: ', stats.compilation.warnings));
  } else {
    console.log(stats.toString(stats));
    console.log('💚  webpack: bundle is now VALID.');
  }
});
