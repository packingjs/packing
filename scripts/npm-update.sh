#!/bin/sh

########################
# 检查并更新到最新依赖包
########################

registry="https://registry.npm.taobao.org"

start=`date +%s`

echo "正在执行命令：npm outdated --registry ${registry} --parseable --depth=0 | cut -d: -f4"

packages=`npm outdated --registry ${registry} --parseable --depth=0 | cut -d: -f4`

for package in ${packages}
do
    package=`echo ${package} | replace "@" "@^"`
    echo "正在执行命令：npm install ${package} --registry ${registry}"
    npm install ${package} --registry ${registry}
done

end=`date +%s`
dif=$[ end - start ]

echo "########################"
echo "更新成功!"
echo "\n本次更新耗时 ${dif} 秒"
echo "\n更新了以下依赖包："
echo "${packages}"
echo "########################"
