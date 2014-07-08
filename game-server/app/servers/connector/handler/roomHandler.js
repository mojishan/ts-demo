'use strict';

var rcode = require('../../../../../shared/rcode');
var CONF = require('../../../consts/config');
var utils = require('../../../utils/index');
var logger = require('pomelo-logger').getLogger(__filename);

module.exports = function(app) {
    return new Handler(app);
};

var Handler = function(app) {
    this.app = app;
};

var prop = Handler.prototype;

// list all room on target server
prop.listRooms = function(msg, session, next) {
    var serverId = msg.serverId;

    if(!serverId) {
        next(null, {
            rc: rcode.PARAM_MISSING,
            msg: 'Server id required'
        });
        return;
    }

    this.app.rpc.area.roomRemote.getRoomsInfo(session, function(rooms) {
        next(null, {
            rc: rcode.SUCCESS,
            list: rooms
        });
    });
};

// create a room on target server
prop.createRoom = function(msg, session, next) {
    var areaId = session.get('areaServerId');
    var uid = session.uid;

    if(!uid) return next(null, {rc: rcode.NO_AUTH});

    if(!areaId) {
        next(null, {
            rc: rcode.PARAM_MISSING,
            msg: 'Area server id required'
        });
        return;
    }

    msg.uid = uid;
    msg.serverId = this.app.get('serverId');

    this.app.rpc.area.roomRemote.createRoom(session, msg, function(roomInfo) {
        session.set('roomId', roomInfo.id);
        session.push('roomId', function(err) {
            if(err) logger.error('Set roomId for session service failed! error : %j', err.stack);
        });
        next(null, {
            rc: rcode.SUCCESS,
            info: roomInfo
        });
    });
};

// enter room
prop.entryRoom = function(msg, session, next) {
    var self = this;
    var name = msg.name;
    var pass = msg.pass;
    var uid = session.uid;
    var roomId = msg.roomId;
    var r;

    session.set('roomId', roomId);
    // session.set('serverId', msg.serverId);
    session.push('roomId', function(err) {
        if(err) {
            console.error('set roomId for session service failed! error is : %j', err.stack);
        }
    });

    msg.serverId = this.app.get('serverId');

    r = self.app.rpc.area.roomRemote.joinRoom(session, msg, null);

    next(null, {rc: r});
};

// leave a room
prop.leaveRoom = function(msg, session, next) {
    var roomId = session.get('roomId');
    var serverId = this.app.get('serverId');

    self.app.rpc.area.roomRemote.leaveRoom(session, roomId, session.uid, serverId, function(r) {
        next(null, {rc: r});
    });
};
