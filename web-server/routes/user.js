/* GET users listing. */

var util = require('util');

var rcode = require('../../shared/rcode');

var UID = 0;

// GET userinfo
exports.userInfo = function(req, res, next) {
    if(req.session && req.session.user) {
        res.json({rc: rcode.SUCCESS, user: req.session.user});
    } else {
        res.json({rc: rcode.NO_AUTH});
    }
};

// Get login
exports.login = function(req, res, next) {
    var name = req.param('name');
    var pass = req.param('pass');
    var user = {
        name: name,
        pass: pass,
        uid: '_ts_' + UID++
    };

    if(req.session) req.session.user = user;

    res.json({rc: rcode.SUCCESS, user: user});
};
