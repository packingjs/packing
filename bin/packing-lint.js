#!/usr/bin/env node

const exec = require('child_process').exec;

const args = process.argv.splice(2);
exec('eslint ' + args.join(' '), (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  if (stdout) {
    console.log(stdout);
  } else if (stderr) {
    console.log(stderr);
  }
});
