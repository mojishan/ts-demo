'use strict';

var logger = require('pomelo-logger').getLogger(__filename);

// All the instance servers
var _servers = [];

var exp = module.exports;

exp.addServer = function(server) {
    _servers.push(server);
};

exp.removeServer = function(sid) {
    for(var i = 0; i < _servers.length; i++) {
        if(_servers[i].id === sid){
            // delete _servers[i];
            _servers.splice(i, 1);
        }
    }
};
