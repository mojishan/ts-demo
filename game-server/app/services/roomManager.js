'use strict';

var pomelo = require('pomelo');
var _ = require('lodash');
var logger = require('pomelo-logger').getLogger(__filename);

var utils = require('../utils');
var rcode = require('../../../shared/rcode');
var serversConf = require('../../config/servers');
var CONF = require('../consts/config');
var Room = require('../domain/Room');
var serverId = pomelo.app.get('serverId');

var exp = module.exports;

// {roomId1: room1}
var _roomsMap = {};
// {roomId: serverId}
var _roomServerMap = {};
var _players = 0;

// remoteCache('rooms')
// remoteCache('player')
// remoteCache('player, rooms')
var remoteCache = function(key, callback) {
    var keys = key.split(/\W+/);
    var valMap = {};

    _.each(keys, function(k) {
        var v = k === 'rooms' ? Object.keys(_roomsMap).length : _players;
        valMap[serverId + '.' + k] = v;
    });

    // => {'area-servers': {server1: {rooms: 1}}}
    // set(field, {key1: v1, key2: v2}, callback)
    pomelo.app.rpc.cache.cacheRemote.set(
        Math.floor(Math.random()*10),
        'area-servers',
        valMap,
        callback || null
    );
};

var createRoom = exp.createRoom = function(info) {
    var room = new Room(info);
    // logger.debug('serverId|', serverId, process.pid)

    _roomsMap[room.id] = room;
    // 创建房间的时候即指定admin，而且join房间，少一次rpc调用
    this.joinRoom(room.id, info, true);
    // room.pushMessage({route: 'create-room', x: 1});

    return room;
};

var getRoomsInfo = exp.getRoomsInfo = function(fields) {
    var r = [];

    _.each(Object.keys(_roomsMap), function(roomId) {
        r.push(getRoomInfo(roomId, fields));
    });

    return r;
};

var getRoomInfo = exp.getRoomInfo = function(roomId, fields) {
    if(!roomId) return null;

    var room = _roomsMap[roomId];
    var keys = room ? Object.keys(room) : [];
    var r = {};

    if(!room) return null;

    fields = undefined === fields ? ['id', 'name'] :
        (Array.isArray(fields) ? fields : fields.split(/\W+/));

    keys = _.intersection(fields, keys);

    _.each(keys, function(key) {
        r[key] = room[key];
    });

    return r;
};

var joinRoom = exp.joinRoom = function(roomId, info, isAdmin) {
    var room = _roomsMap[roomId];
    var player;
    var r;

    if(!room) return rcode['ROOM_NOT_FOUND'];

    if(room.players < room.maxPlayers) {
        player = room.addPlayer(info, isAdmin);
        r = room.joinRoom(player.id, info.serverId);
    } else {
        return rcode['MAX_PLAYERS_LIMIT'];
    }

    if(r !== rcode['SUCCESS']) return r;

    _players++;
    if(isAdmin) remoteCache('rooms, players');
    else remoteCache('players');
    room.pushMessage({route: 'join-room', name: player.name, uid: player.uid});

    return r;
};

var leaveRoom = exp.leaveRoom = function(roomId, uid, serverId) {
    if(!roomId) return rcode.SUCCESS;

    var room = _roomsMap[roomId];
    var r;
    var player;

    if(!room) return rcode['ROOM_NOT_FOUND'];

    player = room.getPlayerByUid(uid);
    r = room.kick(player.id, serverId);

    if(r === rcode.SUCCESS) {
        _players--;
        room.pushMessage({route: 'leave-room', name: player.name, uid: uid});

        if(room.playersNum <= 0) {
            // 没有玩家的时候，删除房间
            delete _roomsMap[room.id];
            remoteCache('rooms, players');
        } else if(player.isAdmin) {
            // 如果是管理员离开房间，则删除房间，先通知房间内所有玩家，即解散房间
            room.pushMessage({route: 'disband-room'});
            delete _roomsMap[room.id];
            remoteCache('rooms, players');
        } else {
            remoteCache('players');
        }
    }

    return r;
};
