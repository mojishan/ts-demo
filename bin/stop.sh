#!/bin/bash
TS=$(forever list | grep /data/sites/ts.alloyteam.com/app.js | awk '{print $5}')
if [ -z $TS ];then
  echo "ts already stopped"
else
  echo "forever stopping ts"
  function forever_stop_ts {
    forever stop /data/sites/ts.alloyteam.com/app.js
  }
  forever_stop_ts
  D=$(date "+%Y-%m-%d %H:%M:%S")
  echo "forever stopped ts at "$D
fi
