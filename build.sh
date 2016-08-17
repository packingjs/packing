#!/bin/bash

if [ ! -n "$1" ] ;then
  echo 参数错误
  echo usage: build.sh target_name
else
  echo target_name: $1
  # origin	git@gitlab.corp.qunar.com:mobile/pad.git (fetch)
  # origin	git@gitlab.corp.qunar.com:mobile/pad.git (push)
  git=`git remote -v`
  # 从开头删除到顺数最后一个减搜索号。
  git="${git##*:}"
  # 从结尾删除到倒数第一个小数点。
  git="${git%\.*}"

  echo project_name: $git

  cache_directory=/home/q/prj/npm/$git

  echo cache_directory: $cache_directory

  NPM_CACHE_DIR=$cache_directory npm-cache install npm --registry http://registry.npm.corp.qunar.com --production && npm run build:$1
fi
