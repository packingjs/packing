const path = require('path');
const existsSync = require('fs').existsSync;
const isFunction = require('util').isFunction;

module.exports = function (file, program) {
  let configFile = file;
  if (['.js', '.json'].indexOf(path.extname(file)) < 0) {
    configFile += '.js';
  }
  const pathInProject = path.resolve(configFile);
  const pathInLib = path.resolve(__dirname, '..', configFile);
  let defaultConfig = require(pathInLib);
  if (isFunction(defaultConfig)) {
    defaultConfig = defaultConfig(program);
  }

  if (existsSync(pathInProject)) {
    const projectConfig = require(pathInProject);
    return isFunction(projectConfig) ? projectConfig(defaultConfig, program) : projectConfig;
  }

  return defaultConfig;
};
