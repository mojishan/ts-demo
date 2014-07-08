/**
 * tankstrike
 * room.js
 */

define(['roomMsgHandler'], function(msgHandler) {
    var self = this;
    var roomView = $('#view-room');
    var listRoute = 'connector.roomHandler.listRooms';
    var enterRoute = 'connector.roomHandler.entryRoom';
    var leaveRoute = 'connector.roomHandler.leaveRoom';
    var destroyRoute = 'connector.roomHandler.destroyRoom';

    function init(roomInfo) {
        // create room done
        if(roomInfo && roomInfo.id) {
            roomView.fadeIn();
            msgHandler.init();
        }
    };

    function bind() {
        ;
    };

    function enterRoom(roomId) {
        pomelo.request(enterRoute, {roomId: roomId}, function(r) {
            // pomelo.disconnect();
            if(r.rc === 0) {
                console.log('xxxx');
                roomView.fadeIn();
                msgHandler.init();
            } else {
                console.error('进入房间失败！');
            }
        });
    };

    return {
        init: init,
        enterRoom: enterRoom
    };
});
