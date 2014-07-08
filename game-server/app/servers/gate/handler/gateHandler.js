'use strict';

var rcode = require('../../../../../shared/rcode');
var utils = require('../../../utils/index');

module.exports = function(app) {
    return new Handler(app);
};

function Handler(app) {
    this.app = app;
};

Handler.prototype.queryEntry = function(msg, session, next) {
    var uid = msg.uid;
    var connectors = this.app.getServersByType('connector');
    var target;

    if(!uid) return next(null, {rc: rcode.NO_AUTH});

    if(!connectors || connectors.length === 0) {
        return next(null, {rcode: rcode.SERVER_ERROR});
    }

    target = utils.dispatch(uid, connectors);

    next(null, {
        rc: rcode.SUCCESS,
        host: target.host,
        port: target.clientPort
    });
};
