#!/bin/sh

rootDir=$(pwd)

# Run release on each package individually except the common
# @makaira/storefront-types because this has to run in advance.
# This is required, because in the release process commits are
# created in parallel. This is not possible with lint-staged.
# Therefore we have to run it in sequence. Turbo currently does
# not a have an automatic feature to do so.

for package in $(ls packages); do
  if [ "$package" != "storefront-types" ]; then
    ./node_modules/.bin/turbo run release --filter="$package"
  fi
done
