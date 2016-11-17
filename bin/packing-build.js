#!/usr/bin/env node

require('packing/util/babel-register');

// const nopt = require('nopt');
//
// const program = nopt(process.argv, 2);
const webpack = require('webpack');
const pRequire = require('packing/util/require');

const webpackConfig = pRequire('config/webpack.build.babel', {});

function formatError(e) {
  var text = "";
  if(typeof e === "string")
    e = {
      message: e
    };
  if(e.chunk) {
    text += "chunk " + (e.chunk.name || e.chunk.id) +
      (e.chunk.entry ? " [entry]" : e.chunk.initial ? " [initial]" : "") + "\n";
  }
  if(e.file) {
    text += e.file + "\n";
  }
  // if(e.module && e.module.readableIdentifier && typeof e.module.readableIdentifier === "function") {
  //   text += e.module.readableIdentifier(requestShortener) + "\n";
  // }
  text += e.message;
  if(e.details) text += "\n" + e.details;
  if(e.missing) text += e.missing.map(function(item) {
    return "\n[" + item + "]";
  }).join("");
  if(e.dependencies && e.origin) {
    text += "\n @ ";
    e.dependencies.forEach(function(dep) {
      if(!dep.loc) return;
      if(typeof dep.loc === "string") return;
      if(!dep.loc.start) return;
      if(!dep.loc.end) return;
      text += " " + dep.loc.start.line + ":" + dep.loc.start.column + "-" +
        (dep.loc.start.line !== dep.loc.end.line ? dep.loc.end.line + ":" : "") + dep.loc.end.column;
    });
  }
  return text;
}

webpack(webpackConfig, function (err, stats) {
  if (err) {
    console.log(err);
  } else if (stats.hasErrors() || stats.hasWarnings()) {
    // console.log(stats.compilation.errors);
    stats.compilation.errors.map(formatError).forEach((error) => {
      console.log('\n');
      console.log('ERROR in ' + error);
      console.log('\n');
    });
    console.log('💔  webpack: bundle is now INVALID.');
  } else {
    console.log(stats.toString(stats));
    console.log('💚  webpack: bundle is now VALID.');
  }
});
