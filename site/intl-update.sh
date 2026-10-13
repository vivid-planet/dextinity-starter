#!/usr/bin/env sh

cd "$(dirname "$0")" || exit

rm -rf ./lang/
mkdir -p ./lang

git clone https://github.com/vivid-planet/dextinity-starter-lang.git lang/starter-lang
