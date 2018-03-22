/* eslint import/no-dynamic-require: 0 */
/* eslint global-require: 0 */

import { resolve, extname, join } from 'path';
import { existsSync } from 'fs';
import { isFunction } from 'util';
import importFresh from 'import-fresh';

export default (file, program, appConfig) => {
  const context = process.env.CONTEXT || process.cwd();

  let configFile = file;
  if (['.js', '.json'].indexOf(extname(file)) < 0) {
    configFile += '.js';
  }
  // 为了测试方便，增加 `process.env.CONTEXT`
  const pathInProject = resolve(context ? join(context, configFile) : configFile);
  const pathInLib = resolve(__dirname, '..', configFile);

  // 此处不能使用 require.cache
  // 因为该方法依赖 process.env.CONTEXT
  // 而在跑测试用例时会在不同的用例设置不同的 process.env.CONTEXT
  // 使用 require.cache 就会导致除第一次外的所有结果都从缓存中加载，从而引发错误
  let defaultConfig = importFresh(pathInLib);
  defaultConfig = defaultConfig.default || defaultConfig;
  if (isFunction(defaultConfig)) {
    defaultConfig = defaultConfig(program, appConfig);
  }

  if (existsSync(pathInProject)) {
    let projectConfig = require(pathInProject);
    projectConfig = projectConfig.default || projectConfig;
    return isFunction(projectConfig) ?
      projectConfig(defaultConfig, program, appConfig) :
      projectConfig;
  }

  return defaultConfig;
};
