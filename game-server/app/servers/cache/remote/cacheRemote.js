'use strict';

var pomelo = require('pomelo');

var logger = require('pomelo-logger').getLogger(__filename);
var cacheManager = require('../../../services/cacheManager');
var rcode = require('../../../../../shared/rcode');

module.exports = function(app) {
    return new Remote();
};

function Remote(app) {
    this.app = app;
};

var pro = Remote.prototype;

pro.set = function(field, key, value, callback) {
    var args = [].slice.call(arguments);

    callback = args.pop();

    callback(cacheManager.set.apply(cacheManager, args));
};

pro.get = function(field, key, callback) {
    var args = [].slice.call(arguments);

    callback = args.pop();

    callback(cacheManager.get.apply(cacheManager, args));
};
