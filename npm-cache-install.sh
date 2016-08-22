#!/bin/bash

git=`git remote -v`
# 从开头删除到顺数最后一个减搜索号。
git="${git##*:}"
# 从结尾删除到倒数第一个小数点。
git="${git%\.*}"

echo project_name: $git

cache_directory=/home/q/prj/npm/$git
#cache_directory=~/.package_cache/$git

echo cache_directory: $cache_directory

npm-cache install --cacheDirectory $cache_directory --clearInvalidCache npm --registry http://registry.npm.corp.qunar.com --production
