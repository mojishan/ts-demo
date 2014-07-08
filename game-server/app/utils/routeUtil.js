'use strict';

var exp = module.exports;

var logger = require('pomelo-logger').getLogger(__filename);

exp.area = function(session, msg, app, callback) {
    // var serverId = session.get('serverId');
    var serverId = session.get('areaServerId');
    logger.debug('route selected area server id', serverId);

    if(!session) {
        callback(new Error('fail to route to connector server for session is empty'));
        return;
    }

    if(!serverId) {
        callback(new Error('can not find server info for type: ' + msg.serverType));
        return;
    }

    callback(null, serverId);
};

exp.connector = function(session, msg, app, callback) {
    if(!session) {
        callback(new Error('fail to route to connector server for session is empty'));
        return;
    }

    if(!session.frontendId) {
        callback(new Error('fail to find frontend id in session'));
        return;
    }

    callback(null, session.frontendId);
};
