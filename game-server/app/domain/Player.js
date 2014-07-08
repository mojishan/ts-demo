'use strict';

// var models = require('../models/');
// var User = models.User;

var when = require('when');

var _PLAYER_ID = 0;

var Player = module.exports = function(options) {
    if(!(this instanceof Player)) return new Player(options);

    // this.room = room;

    this.uid = options.uid;
    this.id = this.uid;
    this.nick = options.nick;
    this.avatar = options.avatar;
    // 积分
    this.integral = options.integral;
    // 累计玩过的次数
    this.playCounts = options.playCounts;

    // 对战分数，重新开始的时候清0
    this.score = 0;
    // 拥有的tank
    // this.tank;

    return this;
};

var pro = Player.prototype;

pro.updateInfo = function(field, value) {
    var self = this;

    return when.promise(function(resolve, reject, notify) {
        User.findByIdAndUpdate(self.uid, {$set: {field: value}}, function(err, doc) {
            if(err) reject(err);
            else resolve(doc);
        });
    });
};
