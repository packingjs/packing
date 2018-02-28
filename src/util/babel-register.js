import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

let babelConfig = {
  presets: [
    'es2015',
    'stage-0'
  ],

  plugins: [
    'add-module-exports',
    'babel-plugin-transform-decorators-legacy'
  ]
};
const babelrc = resolve('.babelrc');

if (existsSync(babelrc)) {
  babelConfig = JSON.parse(readFileSync(babelrc, 'utf8'));
  babelConfig.presets = babelConfig.presets.filter(item => item !== 'react');
}

require('babel-register')(babelConfig);

if (!{}.hasOwnProperty.call(process.env, 'NODE_ENV')) {
  process.env.NODE_ENV = 'local';
}
