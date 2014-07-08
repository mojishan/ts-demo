/**
 * tankstrike
 * roomMsgHandler.js
 */

define(function() {
    function init() {
        pomelo.on('create-room', function(data) {
            console.log('create-room', data);
        });

        pomelo.on('join-room', function(data) {
            console.log('join-room', data);
        });

        pomelo.on('leave-room', function(data) {
            console.log('leave-room', data);
        });

        pomelo.on('disband-room', function(data) {
            console.log('disband-room', data);
        });
    };

    return {
        init: init
    };
});
