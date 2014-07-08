'use strict';

var _ = require('lodash');
var Player = require('./Player');

module.exports = PlayerManager;

function PlayerManager(room) {
    if(!(this instanceof PlayerManager)) return new PlayerManager(room);

    // this.room = room;
    this._players = {};
    this._ids = [];
};

var pro = PlayerManager.prototype;

Object.defineProperty(pro, 'playersNum', {
    get: function() {
        return this._ids.length;
    }
});

pro.get = function(playerId) {
    return playerId ? this._players[playerId] : this._players;
};

pro.getPlayerByUid = function(uid) {
    return _.find(this._players, function(player) {
        return player.uid === uid;
    });
};

pro.add = function(player) {
    if(player instanceof Player) {
        this._ids.push(player.id);
        return this._players[player.id] = player;
    } else {
        return this.add(Player(arguments[0]));
    }
};

pro.del = function(playerId) {
    delete this._players[playerId];
    this._ids.splice(this._ids.indexOf(playerId), 1);
};

pro.contains = function(id) {
    return !!~this._ids.indexOf(id);
};
