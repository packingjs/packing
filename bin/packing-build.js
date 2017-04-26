#!/usr/bin/env node

require('packing/util/babel-register');

const chalk = require('chalk');
const webpack = require('webpack');
const pRequire = require('packing/util/require');

const webpackConfig = pRequire('config/webpack.build.babel', {});

/* eslint-disable */
function formatError(e) {
  var text = '';
	if(typeof e === 'string') {
		e = {
			message: e
		};
  }
	if(e.chunk) {
		text += 'chunk ' + (e.chunk.name || e.chunk.id);
    if (e.chunk.hasRuntime()) {
      text += ' [entry]';
    } else {
      text += e.chunk.isInitial() ? ' [initial]' : '';
    }
    text += '\n';
	}
	if(e.file) {
		text += e.file + '\n';
	}
	if(e.module && e.module.readableIdentifier && typeof e.module.readableIdentifier === 'function') {
		text += e.module.readableIdentifier(requestShortener) + '\n';
	}
	text += e.message;
	if(e.details) text += '\n' + e.details;
	if(e.missing) text += e.missing.map(function(item) {
    return '\n[' + item + ']';
  }).join('');
	if(e.dependencies && e.origin) {
		text += '\n @ ' + e.origin.readableIdentifier(requestShortener);
		e.dependencies.forEach(function(dep) {
			if(!dep.loc) return;
			if(typeof dep.loc === 'string') return;
			var locInfo = formatLocation(dep.loc);
			if(!locInfo) return;
			text += ' ' + locInfo;
		});
		var current = e.origin;
		while(current.issuer) {
			current = current.issuer;
			text += '\n @ ' + current.readableIdentifier(requestShortener);
		}
	}
  return text;
}
/* eslint-enable */

webpack(webpackConfig, function (err, stats) {
  if (err) {
    console.log(err);
  } else if (stats.hasErrors()) {
    stats.compilation.errors.map(formatError).forEach((error) => {
      console.log('\n');
      console.log(chalk.red('ERROR in ' + error));
      console.log('\n');
    });
    console.log(chalk.red('💔  webpack: bundle is now INVALID.'));
  } else if (stats.hasWarnings()) {
    console.log(chalk.yellow('⚠️  webpack: ', stats.compilation.warnings));
  } else {
    console.log(stats.toString(stats));
    console.log('💚  webpack: bundle is now VALID.');
  }
});
