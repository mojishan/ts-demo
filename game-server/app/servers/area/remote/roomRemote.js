'use strict';

var pomelo = require('pomelo');

var logger = require('pomelo-logger').getLogger(__filename);
var roomManager = require('../../../services/roomManager');
var rcode = require('../../../../../shared/rcode');

var serverId = pomelo.app.get('serverId');

module.exports = function(app) {
    return new Remote();
};

function Remote(app) {
    this.app = app;
};

var pro = Remote.prototype;

pro.listServers = function(callback) {
    var servers = roomManager.getTankServers();

    callback(servers);
};

pro.createRoom = function(info, callback) {
    var room = roomManager.createRoom(info);

    this.getRoomInfo(room.id, ['id', 'name'], callback);
};

pro.getRoomsInfo = function(fields, callback) {
    var args = [].slice.call(arguments);

    callback = args.pop();

    callback(roomManager.getRoomsInfo.apply(roomManager, args));
};

pro.getRoomInfo = function(roomId, fields, callback) {
    var args = [].slice.call(arguments);

    callback = args.pop();

    callback(roomManager.getRoomInfo.apply(roomManager, args));
};

pro.joinRoom = function(roomId, info, callback) {
    var rc = roomManager.joinRoom(roomId, info);

    callback(rc);
};

pro.leaveRoom = function(roomId, playerId, serverId, callback) {
    var rc = roomManager.leaveRoom(roomId, playerId, serverId);

    callback(rc);
};
