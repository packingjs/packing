/* eslint-disable import/prefer-default-export */

import { exec as execute } from 'child_process';
import webpack from 'webpack';
import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';

export const exec = command => new Promise((resolve, reject) => {
  execute(command, (err, stdout) => {
    if (err) {
      return reject(err);
    }
    return resolve(stdout);
  });
});

export const createFile = (file, content) => {
  const parentId = module.parent.id;
  const fullname = path.resolve(path.dirname(parentId), file);
  const dir = path.dirname(fullname);

  // 确保文件目录存在
  mkdirp.sync(dir);

  fs.writeFileSync(fullname, content);
};

export const createPackingConfig = (content) => {
  content = `
    export default (packing) => {
      const p = packing;
      ${content}
      return p;
    }
  `;
  createFile('config/packing.js', content);
};

export const createWebpackConfig = (file, content) => {
  content = `
    export default (webpackConfig, program, appConfig) => {
      const p = webpackConfig;
      ${content}
      return p;
    };
  `;
  createFile(file, content);
};

export const createServeConfig = content => createWebpackConfig('config/webpack.serve.babel.js', content);

export const createBuildConfig = content => createWebpackConfig('config/webpack.build.babel.js', content);

export const execWebpack = config => new Promise((resolve, reject) => {
  webpack(config, (err, stats) => {
    if (err) {
      reject(err);
    } else {
      resolve(stats);
    }
  });
});

export const getTestCaseName = (dirname = process.env.CONTEXT) => {
  const folders = dirname.split(path.sep);
  return folders[folders.length - 1];
};
