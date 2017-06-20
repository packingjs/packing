import { readFileSync } from 'fs';
import { resolve } from 'path';

const babelrc = JSON.parse(readFileSync(resolve('.babelrc'), 'utf8'));
const presets = babelrc.presets.filter(item => item !== 'react');

require('babel-register')({
  presets,
  plugins: babelrc.plugins
});

if (!{}.hasOwnProperty.call(process.env, 'NODE_ENV')) {
  process.env.NODE_ENV = 'local';
}
