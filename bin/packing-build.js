#!/usr/bin/env babel-node

require('packing/util/babel-register');

const pkg = require('packing/package.json');
const program = require('commander');

program
  .version(pkg.version)
  .parse(process.argv);

const webpack = require('webpack');
const pRequire = require('packing/util/require');

const webpackConfig = pRequire('config/webpack.build.babel', program);
webpack(webpackConfig, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('💚  build ok!');
  }
});
