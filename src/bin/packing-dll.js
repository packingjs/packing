#!/usr/bin/env node

import { existsSync, writeFileSync, unlinkSync } from 'fs';
import { resolve } from 'path';
import program from 'commander';
import webpack from 'webpack';
import mkdirp from 'mkdirp';
import '../util/babel-register';
import pRequire from '../util/require';
import { md5, getContext } from '../util';
import packingPackage from '../../package.json';

program
  .option('-c, --clean_cache', 'clean dll cache')
  .parse(process.argv);

const context = getContext();
const projectPackage = require(resolve(context, 'package.json'));
const webpackConfigDll = pRequire('config/webpack.dll.babel', program);
const appConfig = pRequire('config/packing');
const { commonChunks, path: { tmpDll } } = appConfig;

if (Object.keys(commonChunks).length !== 0) {
  const allDependencies = Object.assign(
    packingPackage.dependencies,
    packingPackage.devDependencies,
    projectPackage.dependencies,
    projectPackage.devDependencies
  );
  const dllDeps = {};
  const destDir = resolve(context, tmpDll);
  const hashFile = `${destDir}/hash.json`;

  if (program.clean_cache) {
    if (existsSync(hashFile)) {
      unlinkSync(hashFile);
    }
  }

  Object.keys(commonChunks).forEach((chunkName) => {
    commonChunks[chunkName].forEach((d) => {
      if (allDependencies[d]) {
        dllDeps[d] = allDependencies[d];
      }
    });
  });

  const newHash = md5(JSON.stringify(dllDeps));

  let skip = true;
  if (existsSync(hashFile)) {
    const oldHash = require(hashFile).hash;
    console.log('[packing-dll]oldHash:', oldHash);
    console.log('[packing-dll]newHash:', newHash);
    if (oldHash !== newHash) {
      skip = false;
    }
  } else {
    skip = false;
  }

  if (skip) {
    console.log('💛  DllPlugin skipped!');
  } else {
    // 写入newHash
    webpack(webpackConfigDll, (err) => {
      if (err) {
        console.log(err);
      } else {
        if (!existsSync(destDir)) {
          mkdirp.sync(destDir);
        }
        writeFileSync(hashFile, JSON.stringify({
          hash: newHash
        }));
        console.log('💚  DllPlugin executed!');
      }
    });
  }
}
