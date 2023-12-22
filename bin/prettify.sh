#!/bin/sh

function prettify {
  jshon <"$1" >"${1%.json}".pretty.json
  echo "prettified ${1%.json}.pretty.json"
}

for i in $(ls public/*.json | grep -v pretty); do prettify "$i"; done
for i in $(ls public-old/*.json | grep -v pretty); do prettify "$i"; done
