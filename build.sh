#!/bin/bash

if [ ! -n "$1" ] ;then
  echo 参数错误
  echo usage: build.sh target_name
else
  echo $1
  npm install --cache-min 9999999 --registry http://registry.npm.corp.qunar.com --production && npm run build:$1
fi
