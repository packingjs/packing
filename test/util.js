/* eslint-disable import/prefer-default-export */

import { exec as execute } from 'child_process';
import webpack from 'webpack';
import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';

export const exec = command => new Promise((resolve, reject) => {
  execute(command, (err, stdout, stderr) => {
    if (err) {
      return reject(err);
    }
    return resolve(stdout + stderr);
  });
});

// 随机返回 true/false
export const random = () => parseInt((Math.random() * 10) % 2, 10);

export const createFile = (file, content) => {
  const parentId = module.parent.id;
  const fullname = path.resolve(path.dirname(parentId), file);
  const dir = path.dirname(fullname);

  // 确保文件目录存在
  mkdirp.sync(dir);

  fs.writeFileSync(fullname, content);
};

export const append = (file, text, position = 'end') => {
  const parentId = module.parent.id;
  const fullname = path.resolve(path.dirname(parentId), file);
  const origin = fs.readFileSync(fullname);
  const content = position === 'end' ? origin + text : text + origin;
  createFile(file, content);
};

export const preappend = (file, text) => append(file, text, 'begin');

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
