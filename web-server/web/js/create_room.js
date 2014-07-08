/**
 * tankstrike
 * create_room.js
 */

define(function() {
    var self = this;
    var viewBox = $('#view-create-room');
    var createRoute = 'connector.roomHandler.createRoom';

    function init() {
        viewBox.fadeIn();
        bind();
    };

    function bind() {
        $('#new-room-submit').on('click', function(e) {
            var name = $('#new-room-name').val();
            var pass = $('#new-room-passwd').val();

            if(name && pass) {
                createRoom({
                    name: name,
                    passwd: pass
                });
            } else {
                alert('请完善房间信息');
            }
        });
    };

    function createRoom(info) {
        pomelo.request(createRoute, info, function(r) {
            if(r.rc == 0) {
                console.info(r.info);
                require(['room'], function(roomView) {
                    viewBox.fadeOut();
                    roomView.init(r.info);
                });
            } else {
                alert('创建房间失败');
            }
        });
    };

    return {
        init: init,
        createRoom: createRoom
    };
});
