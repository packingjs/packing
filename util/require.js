var existsSync = require('fs').existsSync;
var path = require('path');

module.exports = function (file) {
  if (['.js', '.json'].indexOf(path.extname(file)) < 0) {
    file += '.js'
  }
  var pathInProject = path.resolve(file);
  var pathInLib = path.resolve(__dirname, '..', file);

  if (existsSync(pathInProject)) {
    return require(pathInProject);
  } else if (existsSync(pathInLib)) {
    return require(pathInLib);
  } else {
    console.log(file + ' not exist.');
  }
};
