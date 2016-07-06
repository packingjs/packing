var util = require('util');
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');
var glob = require('glob');
var mkdirp = require('mkdirp');

function RevWorldPlugin(patterns, options) {
  this.patterns = util.isArray(patterns) ? patterns : [patterns];
  this.options = Object.assign({}, options, {
    format: '[name]-[hash][ext]',
    algorithm: 'sha256',
    length: 8
  });
}

RevWorldPlugin.prototype.apply = function(compiler) {
  var self = this;
  var options = this.options;

  compiler.plugin('emit', function(compilation, callback) {
    var sourceMap = {};

    self.patterns.forEach(function(pattern) {
      // console.log(pattern);
      glob.sync(pattern.src, { cwd: pattern.cwd, nodir: true }).forEach(function(item) {
        var file = path.join(pattern.cwd, item);
        // console.log(file);
        var createHash = crypto.createHash(self.options.algorithm);
        var fileData = fs.readFileSync(file);
        var hash = createHash.update(fileData).digest('hex');
        var suffix = hash.slice(0, self.options.length);
        var ext = path.extname(file);
        // var newName = [path.basename(file, ext), suffix, ext.slice(1)].join('.');
        var newName = self.options.format
          .replace('[name]', path.basename(file, ext))
          .replace('[hash]', suffix)
          .replace('[ext]', ext);
        // console.log(newName);
        var destDir = path.join(pattern.dest, path.dirname(item))
        var destFile = path.join(destDir, newName);
        if (!fs.existsSync(destDir)) {
          mkdirp.sync(destDir);
        }
        fs.writeFileSync(destFile, fileData);
        // fs.renameSync(file, destFile);
        var value = path.join(path.dirname(item), newName);
        sourceMap[item] = value;
        console.log(`${item} ====> ${value}`);
      });

    });
    // 将sourcemap绑定在compiler对象上传递给replace-hash-webpack-plugin使用
    compiler.revSourceMap = sourceMap;
    callback();
  });
};

module.exports = RevWorldPlugin;
