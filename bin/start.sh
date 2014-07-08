#!/bin/bash
TS=$(forever list | grep /data/sites/ts.alloyteam.com/app.js | awk '{print $5}')
if [ -z $TS ];then
  echo "forever starting ts"
  function forever_start_ts {
    cd /data/sites/ts.alloyteam.com
    NODE_ENV=production forever start -o out.log -e err.log -a /data/sites/ts.alloyteam.com/app.js
  }
  make cache
  forever_start_ts
  D=$(date "+%Y-%m-%d %H:%M:%S")
  echo "forever started ts at "$D
else
  echo "ts already started"
fi
