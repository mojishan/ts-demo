'use strict';

var pomelo = require('pomelo');
var app = pomelo.createApp();
var routeUtil = require('./app/utils').routeUtil;

app.set('name', 'tankstrike');

// global server configure
app.configure('production|development', function() {
    app.route('area', routeUtil.area);
    app.route('connector', routeUtil.connector);
});

// global connector server configure
app.configure('production|development', 'connector', function() {
    app.set('connectorConfig', {
        connector: pomelo.connectors.hybirdconnector,
        // useDict: true,
        // useProtobuf: true,
        heartbeat: 3
    });
});

// global gate server configure
app.configure('production|development', 'gate', function() {
    app.set('connectorConfig', {
        connector: pomelo.connectors.hybirdconnector,
        useProtobuf : true
    });
});

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
