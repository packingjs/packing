/* eslint import/no-dynamic-require: 0 */
/* eslint global-require: 0 */

import { resolve, extname, join } from 'path';
import { existsSync } from 'fs';
import { isFunction } from 'util';

export default (file, program, appConfig) => {
  const { CONTEXT } = process.env;

  let configFile = file;
  if (['.js', '.json'].indexOf(extname(file)) < 0) {
    configFile += '.js';
  }
  // 为了测试方便，增加 `process.env.CONTEXT`
  const pathInProject = resolve(CONTEXT ? join(CONTEXT, configFile) : configFile);
  const pathInLib = resolve(__dirname, '..', configFile);
  // console.log('==pathInProject:', pathInProject);
  // console.log('==pathInLib:', pathInLib);

  let defaultConfig = require(pathInLib);
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
