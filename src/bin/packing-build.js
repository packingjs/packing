#!/usr/bin/env node

import { red, yellow } from 'chalk';
import webpack from 'webpack';
import '../util/babel-register';
import pRequire from '../util/require';
import formatError from '../util/format-error';

const webpackConfig = pRequire('config/webpack.build.babel', {});

webpack(webpackConfig, (err, stats) => {
  if (err) {
    console.log(err);
  } else if (stats.hasErrors()) {
    stats.compilation.errors.map(formatError).forEach((error) => {
      console.log('\n');
      console.log(red(`ERROR in ${error}`));
      console.log('\n');
    });
    console.log(red('💔  webpack: bundle is now INVALID.'));
  } else if (stats.hasWarnings()) {
    console.log(yellow('⚠️  webpack: ', stats.compilation.warnings));
  } else {
    console.log(stats.toString(stats));
    console.log('💚  webpack: bundle is now VALID.');
  }
});
