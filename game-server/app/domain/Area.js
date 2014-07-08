'use strict';

var pomelo = require('pomelo');
var Room = require('./Room');
var app = pomelo.app;

Area.ID = 1;

module.exports = function Area(options) {
    if(!(this instanceof Area)) return new Area(options);

    this.id = options.id || Area.ID++;
    this.channel = null;
    this.rooms = {};
    this.maxRooms = options.maxRooms || 50;
};

var proto = Area.prototype;

Object.defineProperty(proto, 'roomsLength', {
    get: function() {
        return Object.keys(this.rooms).length;
    }
});

proto.getChannel = function() {
    return this.channel || 
        (this.channel = app.get('channelService').getChannel('area_' + this.id, true));
};

proto.createRoom = function(options) {
    if(this.roomsLength < this.maxRooms) {
        var room = new Room(options);

        rooms[room.id] = room;

        return room;
    } else {
        console.warn('Rooms length limit.');
        return null;
    }
};

proto.getRoom = function(id) {
    return this.rooms[id] || null;
};

proto.removeRoom = function(id) {
    return delete this.rooms[id];
};

