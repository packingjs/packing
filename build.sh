#!/bin/bash

if [ ! -n "$1" ] ;then
  echo 参数错误
  echo usage: build.sh target_name
else
  echo $1
  NPM_CACHE_DIR=/home/q/prj/npm npm-cache install npm --registry http://registry.npm.corp.qunar.com --production && npm run build:$1
fi
