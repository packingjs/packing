const loaderUtils = require('loader-utils');

const reg = /src\s*=\s*"([^"]+)/g;
let content = 'ab <img src="logo.png"> cd <img src="logo.png"> 123';

const matches = [];
let result;
while(result = reg.exec(content)) { // eslint-disable-line
  const a = result[0].replace(result[1], '');
  matches.push({
    start: result.index + a.length,
    length: result[1].length,
    value: result[1]
  });
}

// console.log(content.length);
content = content.split('');
matches.reverse().forEach((link) => {
  const url = loaderUtils.urlToRequest(link.value);
  content.splice(link.start, link.length, url);
});
content = content.join('');
console.log(content);
