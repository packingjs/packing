/**
 * 该脚步会在npm run serve前执行，serve前一定执行过DllPlugin
 * 出于性能的考虑，只有在DllPlugin中包含的文件或者文件版本发生改变时
 * 才会重新执行一次DllPlugin
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import mkdirp from 'mkdirp';
import webpack from 'webpack';
import packing, { commonChunks } from '../config/packing';
import pkg from '../package.json';
import webpackConfig from '../config/webpack.dll.babel';

const { dll } = packing.path;

function md5(string) {
  return crypto.createHash('md5').update(string).digest('hex');
}

function execDll(destDir, hashFile, newHash) {
  // 写入newHash
  webpack(webpackConfig, (err) => {
    if (err) {
      console.log(err);
    } else {
      if (!fs.existsSync(destDir)) {
        mkdirp.sync(destDir);
      }
      fs.writeFileSync(hashFile, JSON.stringify({
        hash: newHash
      }));
      console.log('DllPlugin executed!');
    }
  });
}

const allDependencies = Object.assign(pkg.dependencies, pkg.devDependencies);
const dllDeps = {};
const destDir = path.resolve(process.cwd(), dll);
const hashFile = `${destDir}/hash.json`;

Object.keys(commonChunks).forEach((chunkName) => {
  commonChunks[chunkName].forEach((d) => {
    if (allDependencies[d]) {
      dllDeps[d] = allDependencies[d];
    }
  });
});

const newHash = md5(JSON.stringify(dllDeps));

if (fs.existsSync(hashFile)) {
  // eslint-disable-next-line
  const oldHash = require(hashFile).hash;
  if (oldHash !== newHash) {
    execDll(destDir, hashFile, newHash);
  }
} else {
  execDll(destDir, hashFile, newHash);
}
