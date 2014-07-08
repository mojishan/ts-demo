'use strict';

var CONF = require('../../consts/config').MODE;
var Mode = require('./Mode');

module.exports = function createMode(room, options) {
    // var mode = require('./modes/' + options.mode);
    var modeConf = require(CONF[room.mode]);
    var mode = Mode(modeConf);

    options.room = room;

    mode.init(options);

    return mode;
};
