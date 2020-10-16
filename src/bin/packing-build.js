#!/usr/bin/env node

import { red, yellow } from 'chalk';
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
    let plainError = '';
    stats.toJson().errors.forEach((error) => {
      Object.keys(error).forEach((key) => {
        plainError += `\n${yellow(key)}: ${red(error[key])}`;
      });
      plainError += '\n';
    });
    const message = red('[build]: 💔 Webpack 打包失败。\n') + plainError;
    console.log(message);
    // 让 jenkins 终止编译
    process.exit(1);
  } else {
    console.log(stats.toString(stats));
    console.log('[build]:💚 Webpack 打包成功。');
    // jenkins 编译完不退出，这里临时处理一下，需要定位具体原因
    process.exit(0);
  }
});
