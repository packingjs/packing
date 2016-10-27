var fs = require('fs');
var path = require('path');
var babelrc = JSON.parse(fs.readFileSync(path.resolve('.babelrc'), 'utf8'));
var presets = babelrc.presets.filter(function(item) {
  return item !== 'react'
});

require('babel-register')({
  only: /(packing|profiles|mock|config\/webpack)/,
  presets: presets,
  plugins: babelrc.plugins
});
