#!/bin/bash

export PATH=/usr/local/n/versions/node/6.2.1/bin:$PATH

if [ ! -n "$1" ] ;then
  echo 参数错误
  echo usage: build.sh target_name
else
  npm install --registry http://registry.npm.corp.qunar.com --disturl=https://npm.taobao.org/dist --sass-binary-site=http://npm.taobao.org/mirrors/node-sass
  echo target_name: $1
  npm run build:$1
fi
