#!/usr/bin/env node

import { red, yellow } from 'chalk';
import webpack from 'webpack';
import '../bootstrap';
import { pRequire } from '..';

const appConfig = pRequire('config/packing');
const webpackConfig = pRequire('config/webpack.build.babel', {}, appConfig);

webpack(webpackConfig, (err, stats) => {
  if (err) {
    console.log(err);
  } else if (stats.hasErrors()) {
    const message = red(`[错误]: 💔 Webpack 打包失败。\n${stats.compilation.errors}`);
    console.log(message);
    // 让 jenkins 终止编译
    process.exit(1);
  } else if (stats.hasWarnings()) {
    const message = yellow(`[警告]: ⚠️ Webpack 打包成功，请关注以下信息：\n${stats.compilation.warnings}`);
    console.log(yellow(message));
  } else {
    console.log(stats.toString(stats));
    console.log('[成功]:💚 Webpack 打包成功。');
  }
});
