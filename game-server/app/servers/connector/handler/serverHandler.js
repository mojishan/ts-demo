'use strict';

var rcode = require('../../../../../shared/rcode');
var utils = require('../../../utils/index');
var logger = require('pomelo-logger').getLogger(__filename);

module.exports = function(app) {
    return new Handler(app);
};

function Handler(app) {
    this.app = app;
};

// list all connector servers
Handler.prototype.listServers = function(msg, session, next) {
    var uid = msg.uid;
    var sessionService = this.app.get('sessionService');
    var servers = this.app.getServersByType('area');
    var r = [];

    if(!uid) return next(null, {rc: rcode.NO_AUTH});

    // 检查uid是否在db，没有则创建用户
    // todo

    // duplicate log in
    if(!!sessionService.getByUid(uid)) {
        next(null, {
            rc: rcode.DUPLICATE_LOGIN,
            msg: 'duplicate log in'
        });
        return;
    }

    if(!servers || servers.length === 0) {
        return next(null, {rc: rcode.SERVER_ERROR});
    }

    session.bind(uid);
    session.on('closed', onUserLeave.bind(null, this.app));

    this.app.rpc.cache.cacheRemote.get(session, 'area-servers', function(serversMap) {
        if(!serversMap) serversMap = {};

        r = servers.map(function(svr) {
            var server = serversMap[svr.id] || {};

            return {
                id: svr.id,
                name: svr.name,
                rooms: server.rooms || 0,
                players: server.players || 0
            };
        });

        next(null, {
            rc: rcode.SUCCESS,
            list: r
        });
    });
};

// select connector server
Handler.prototype.selectServer = function(msg, session, next) {
    var uid = session.uid;
    var sid = msg.serverId;
    var servers = this.app.getServersByType('area');
    var target;

    if(!uid) return next(null, {rc: rcode.NO_AUTH});

    if(!servers || servers.length === 0) {
        return next(null, {rcode: rcode.SERVER_ERROR});
    }

    if(sid !== 'auto') target = servers.filter(function(svr) {return svr.id === sid;})[0];

    if(!target) target = utils.dispatch(uid, servers);

    session.set('areaServerId', target.id);
    session.push('areaServerId', function(err) {
        if(err) logger.error('Set areaServerId for session service failed! error : %j', err.stack);
    });

    next(null, {
        rc: rcode.SUCCESS,
        serverId: target.id
    });
};

// player leave handler
function onUserLeave(app, session) {
    var roomId = session.get('roomId');
    var serverId = app.get('serverId');

    if(session && session.uid) logger.info('user %s leaved.', session.uid);

    if(!session || !session.uid || roomId === undefined) return;

    // 如果还没绑定roomId和playerId，离开之后务必删除这个房间
    app.rpc.area.roomRemote.leaveRoom(session, roomId, session.uid, serverId, function(rc) {
        if(rc !== rcode.SUCCESS) logger.error('Player leave room error, code', rc);
    });
};
