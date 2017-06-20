import { resolve, extname } from 'path';
import { existsSync } from 'fs';
import { isFunction } from 'util';

export default (file, program) => {
  let configFile = file;
  if (['.js', '.json'].indexOf(extname(file)) < 0) {
    configFile += '.js';
  }
  const pathInProject = resolve(configFile);
  const pathInLib = resolve(__dirname, '..', configFile);
  // eslint-disable-next-line
  let defaultConfig = require(pathInLib);
  if (isFunction(defaultConfig)) {
    defaultConfig = defaultConfig(program);
  }

  if (existsSync(pathInProject)) {
    // eslint-disable-next-line
    const projectConfig = require(pathInProject);
    return isFunction(projectConfig) ? projectConfig(defaultConfig, program) : projectConfig;
  }

  return defaultConfig;
};
