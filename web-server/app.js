var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('cookie-session');

// process.env.NODE_ENV = 'production';

var app = express();
var routes = require('./routes');
var env = app.get('env') || 'development';
var staticPath = 'web' + (env == 'production' ? '/dist' : '');

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, staticPath)));
app.use(session({
    name: '__alloyts',
    keys: ['alloy@ts'],
    secret: 'alloy@ts',
    // 7 days
    maxage: 'development' == env ? (1000 * 60 * 60) : (1000 * 60 * 60 * 24 * 7)
}));

// set routes
routes(app);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');

    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (env === 'development') {
    app.use(function(err, req, res, next) {
        res.send(500, err.stack || err.message);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.send(500, 'Server error.');
});

module.exports = app;
