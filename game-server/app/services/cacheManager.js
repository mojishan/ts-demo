'use strict';

var pomelo = require('pomelo');
var _ = require('lodash');
var logger = require('pomelo-logger').getLogger(__filename);

var utils = require('../utils');
var rcode = require('../../../shared/rcode');

var exp = module.exports;

// cache global data in independent process
var _cache = {};

exp.set = function(field, valMap) {
    if('object' === utils.type(valMap)) {
        var set = function(value, key) {
            var obj = _cache[field] || (_cache[field] = {});
            var keys = key.split(/\./);
            var k;

            while(k = keys.shift()) {
                if(!(k in obj)) {
                    if(keys.length) obj = obj[k] = {};
                    else obj[k] = value;
                } else {
                    if(!keys.length) {
                        obj[k] = value;
                    } else {
                        if('object' === utils.type(obj)) obj = obj[k];
                        else throw TypeError(obj + ' is not an Object.');
                    }
                }
            }
        };

        _.each(valMap, set);
    } else {
        _cache[field] = valMap;
    }

    logger.debug('_cache', _cache)
};

exp.get = function(field, key) {
    if(!arguments.length) return _cache;

    var item = _cache[field];

    return key ? item[key] : item;
};
