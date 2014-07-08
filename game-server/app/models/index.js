'use strict';

var CONF_DB = require('../consts/config').DB;
var mongoose = require('mongoose');
var dbURI = 'mongodb://' + CONF_DB.dbHost + ':' + CONF_DB.dbPort + '/' + CONF_DB.dbName;
var connOpts = {
    //db: {native_parser: true},
    server: {
        //auto_reconnect: true, // default is true
        //poolSize: 5,
        socketOptions: {keepAlive: 10}
    },
    //replset: {rs_name: ''},
    user: CONF_DB.dbUser,
    padd: CONF_DB.dbPass
};

var db = mongoose.connection;
db.on('error', function(err) {
    console.error('Error in MongoDb connection: ' + err);
    mongoose.disconnect();
});
db.on('open', function() {
    console.log('Connect opened!');
});
db.on('connected', function() {
    console.log('Connect to MongoDb success.');
});
db.on('disconnected', function() {
    console.log('MongoDB disconnected!');
    mongoose.connect(dbURI, connOpts);
});
mongoose.connect(dbURI, connOpts);

require('./user');

exports.User = mongoose.model('User');

module.exports = exports;
