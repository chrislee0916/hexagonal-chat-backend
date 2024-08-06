#!/bin/sh


if [ "$#" -eq 0 ]; then
  yarn run migration:run
  node dist/src/main.js
fi
exec "$@"