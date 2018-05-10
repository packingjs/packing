#!/usr/bin/env node

import { resolve } from 'path';
import { red, yellow } from 'chalk';
import open from 'open';
import webpack from 'webpack';
import program from 'commander';
import '../bootstrap';
import { pRequire, getContext } from '..';

program
  .option('-o, --open', 'open webpack visualizer report')
  .parse(process.argv);

const context = getContext();
const appConfig = pRequire('config/packing');
const webpackConfig = pRequire('config/webpack.build.babel', {}, appConfig);

const {
  path: {
    dist: {
      root: distRoot
    }
  },
  visualizer: {
    enabled: visualizerEnabled,
    options: visualizerOptions
  }
} = appConfig;

webpack(webpackConfig, (err, stats) => {
  if (err) {
    console.log(err);
  } else if (stats.hasErrors()) {
    const message = red(`[build]: 💔 Webpack 打包失败。\n${stats.compilation.errors}`);
    console.log(message);
    // 让 jenkins 终止编译
    process.exit(1);
  } else {
    console.log(stats.toString(stats));
    console.log('[build]:💚 Webpack 打包成功。');
  }

  if (visualizerEnabled) {
    const file = resolve(context, distRoot, 'stats.html');
    const message = `[webpack-visualizer-plugin]: 模块报表已经生成，该报表可以指导优化输出文件体积\n请运行 open file://${file} 查看报表`;
    console.log(message);
    if (program.open || visualizerOptions.open) {
      open(`file://${file}`);
    }
  }
});
