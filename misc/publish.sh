#!/bin/bash
DIR="$( cd "$( dirname "$0"  )" && pwd  )"
cd $DIR/../
echo `pwd`
yarn build 
yarn publish --verbose
