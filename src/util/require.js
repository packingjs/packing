/* eslint import/no-dynamic-require: 0 */
/* eslint global-require: 0 */

import { resolve, extname } from 'path';
import { existsSync } from 'fs';
import { isFunction } from 'util';

export default (file, program, appConfig) => {
  let configFile = file;
  if (['.js', '.json'].indexOf(extname(file)) < 0) {
    configFile += '.js';
  }
  const pathInProject = resolve(configFile);
  const pathInLib = resolve(__dirname, '..', configFile);
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
