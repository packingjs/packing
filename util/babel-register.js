const fs = require('fs');
const path = require('path');

const babelrc = JSON.parse(fs.readFileSync(path.resolve('.babelrc'), 'utf8'));
const presets = babelrc.presets.filter(function (item) {
  return item !== 'react';
});

require('babel-register')({
  only: /(packing|profiles|mock|config\/webpack)/,
  presets: presets,
  plugins: babelrc.plugins,
});

if (!{}.hasOwnProperty.call(process.env, 'NODE_ENV')) {
  process.env.NODE_ENV = 'local';
}
