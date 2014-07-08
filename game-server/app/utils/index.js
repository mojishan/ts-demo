'use strict';

var crc = require('crc');

var exp = module.exports;

var slice = exp.slice = Array.prototype.slice;

var toString = exp.toString = Object.prototype.toString;

var type = exp.type = function(obj) {
    var s = toString.call(obj);

    return s.substring(8, s.length - 1).toLowerCase();
};

exp.dispatch = function(uid, connectors) {
    var index = Math.abs(crc.crc32(uid)) % connectors.length;
    return connectors[index];
};

exp.routeUtil = require('./routeUtil');
