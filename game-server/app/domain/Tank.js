'use strict';

var Tank = module.exports = function(options) {
    if(!(this instanceof Tank)) return new Tank(options);

    this.type = options.type;
    this.player = options.player;
};

var proto = Tank.prototype;

proto.move = function() {
    ;
};

proto.fire = function() {
    ;
};
