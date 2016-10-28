#!/usr/bin/env babel-node

require('packing/util/babel-register');

const pkg = require('packing/package.json');
const program = require('commander');

program
  .version(pkg.version)
  .parse(process.argv);

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mkdirp = require('mkdirp');
const webpack = require('webpack');
const pRequire = require('packing/util/require');

const webpackConfig = pRequire('config/webpack.dll.babel', program);
const packing = pRequire('config/packing', program);
const commonChunks = packing.commonChunks;
const dll = packing.path.dll;

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
        hash: newHash,
      }));
      console.log('💚  DllPlugin executed!');
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
  } else {
    console.log('💛  DllPlugin skipped!');
  }
} else {
  execDll(destDir, hashFile, newHash);
}
