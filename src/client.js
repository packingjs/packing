// import 'babel-polyfill';
// var json = require('./test.json');
import React from 'react';
import ReactDOM from 'react-dom';
import json from './test.json';
require('./2');
// require('./test.less');
require('./test2.scss');
require('../static/1.jpg');
require('../static/big.jpg');
console.log('--', json.name);

ReactDOM.render(
  <h1>Hello, world!i</h1>,
  document.getElementById('app')
);


if (module.hot) {
  module.hot.accept();
}
