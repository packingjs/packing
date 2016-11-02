#!/usr/bin/env babel-node

require('packing/util/babel-register');

const nopt = require('nopt');

const program = nopt(process.argv, 2);
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
