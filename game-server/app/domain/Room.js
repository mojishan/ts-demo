'use strict';

var util = require('util');
var events = require('events');
var pomelo = require('pomelo');
var _ = require('lodash');

var rcode = require('../../../shared/rcode');
var utils = require('../utils');
var CONF = require('../consts/config');
var ROOM_CONF = CONF.ROOM;
var GameMode = require('./game_mode/Mode');
var PlayerManager = require('./PlayerManager');
var Player = require('./Player');

// var serverId = pomelo.app.get('serverId');
var ROOM_ID_NUM = 0;

module.exports = Room;

function Room(options) {
    if(!(this instanceof Room)) return new Room(options);

    events.EventEmitter.call(this);

    var settings = {
        id: ROOM_CONF.namePrefix + (++ROOM_ID_NUM),
        name: options.name,
        passwd: options.passwd
    };
    var player;

    settings = _.extend({
        revivalInterval: ROOM_CONF.revivalInterval,
        maxPlayers: ROOM_CONF.maxPlayers,
        // map: ROOM_CONF.map,
        allowKillFriend: ROOM_CONF.allowKillFriend,
        allowJoinAfterStart: ROOM_CONF.allowJoinAfterStart,
        mode: ROOM_CONF.mode
    }, settings, options);

    this.status = ROOM_CONF.status.pending;
    // connector server id
    // this.serverId = settings.serverId;
    // id由roomManager生成
    this.id = settings.id;
    this.name = settings.name;
    this.passwd = settings.passwd;
    // 死亡复活时间
    this.revivalInterval = settings.revivalInterval;
    this.maxPlayers = settings.maxPlayers;
    // this.map = settings.map;
    this.allowKillFriend = settings.allowKillFriend;
    this.allowJoinAfterStart = settings.allowJoinAfterStart;

    this.createChannel();

    this.playerManager = PlayerManager(this);
    this.players = this.playerManager.playersNum;

    this.setMode(settings);

    return this;
};

util.inherits(Room, events.EventEmitter);

var pro = Room.prototype;

pro.createChannel = function() {
    if(this.channel) return this.channel;

    var channelName = ROOM_CONF.prefix + this.id;

    this.channel = pomelo.app.get('channelService').getChannel(channelName, true);
    return this.channel;
};

pro.addPlayer2Channel = function(playerId, serverId) {
    if(this.channel) {
        // 这里需要通知同一个房间内的所有玩家，pemelo已经做了？？
        this.channel.add(playerId, serverId);
        return true;
    }

    return false;
};

pro.addPlayer = function(info, isAdmin) {
    var player = this.playerManager.add(info);

    if(isAdmin) this.setAdmin(player);

    if(this.channel) {
        // 这里需要通知同一个房间内的所有玩家，pemelo已经做了？？
        this.channel.add(player.id, info.serverId);
    }

    return player;
};

pro.setAdmin = function(player) {
    player = player instanceof Player ? player : this.playerManager.get(player);

    if(player.isAdmin) return player;

    this.admin = player;
    player.isAdmin = true;
    // if(!this.playerManager.contains(player.id)) this.playerManager.add(player);

    // this.gameMode.emit('setAdmin', player);
};

pro.setMode = function(settings) {
    // setting.mode = 'xxx'
    this.gameMode = new GameMode(this, settings);

    // this.init();
};

pro.setMap = function(mapName) {
    this.map = mapName;
};

pro.joinRoom = function(player, serverId) {
    player = player instanceof Player ? player : this.getPlayer(player);

    if(this.addPlayer2Channel(player.id, serverId)) return rcode['SUCCESS'];
    else return rcode['CHANNEL_NOT_FOUND'];
};

pro.getPlayer = function(playerId) {
    return this.playerManager.get(playerId);
};

pro.getPlayerByUid = function(uid) {
    return this.playerManager.getPlayerByUid(uid);
};

pro.pushMessage = function(msg) {
    if(this.channel) this.channel.pushMessage(msg);
};

pro.kick = function(playerId, serverId) {
    var player = this.getPlayer(playerId);

    if(this.playerManager.contains(playerId)) {
        this.playerManager.del(playerId);
        if(this.channel) {
            this.channel.leave(playerId, serverId);
        } else {
            return rcode['CHANNEL_NOT_FOUND'];
        }
    } else {
        return rcode['PLAYER_NOT_FOUND'];
    }

    return rcode['SUCCESS'];
};
