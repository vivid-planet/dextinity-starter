#!/usr/bin/env sh
set -e

cd "$(dirname "$0")"

mkdir -p ./lang

[ -d lang/starter-lang ] || git clone https://github.com/vivid-planet/dextinity-starter-lang.git lang/starter-lang
[ -d lang/dextinity-lang ] || git clone https://github.com/vivid-planet/dextinity-lang.git lang/dextinity-lang
