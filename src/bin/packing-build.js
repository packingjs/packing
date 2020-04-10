#!/usr/bin/env node

import { red } from 'chalk';
import webpack from 'webpack';
import program from 'commander';
import validateSchema from '../lib/validate-schema';
import '../bootstrap';
import { pRequire } from '..';

validateSchema();

program.parse(process.argv);
const appConfig = pRequire('config/packing');
const webpackConfig = pRequire('config/webpack.build.babel', {}, appConfig);

webpack(webpackConfig, (err, stats) => {
  if (err) {
    console.log(err);
  } else if (stats.hasErrors()) {
    const message = red(`[build]: 💔 Webpack 打包失败。\n${stats.toJson().errors}`);
    console.log(message);
    // 让 jenkins 终止编译
    process.exit(1);
  } else {
    console.log(stats.toString(stats));
    console.log('[build]:💚 Webpack 打包成功。');
  }
});
