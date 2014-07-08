'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    uid: String, // alloy account id
    integral: Number,
    playCount: Number
}, {collection: 'users'});

mongoose.model('User', UserSchema);
