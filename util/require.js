var path = require('path');
var existsSync = require('fs').existsSync;
var isFunction = require('util').isFunction;

module.exports = function (file) {
  if (['.js', '.json'].indexOf(path.extname(file)) < 0) {
    file += '.js'
  }
  var pathInProject = path.resolve(file);
  var pathInLib = path.resolve(__dirname, '..', file);
  var defaultConfig = require(pathInLib);

  if (existsSync(pathInProject)) {
    var projectConfig = require(pathInProject);
    return isFunction(projectConfig) ? projectConfig(defaultConfig) : projectConfig;
  } else {
    return defaultConfig;
  }
};
