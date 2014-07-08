/**
 * tankstrike
 * rooms.js
 */

define(['tmpl'], function(tmpl) {
    var self = this;
    var listView = $('#view-rooms-list');
    var listRoute = 'connector.roomHandler.listRooms';

    function init(serverId) {
        if(!serverId) return alert('请选择服务器');

        listRooms(serverId);
    };

    function listRooms(serverId) {
        pomelo.request(listRoute, {serverId: serverId}, function(r) {
            if(r.rc === 0) {
                if(r.list.length) {
                    listView.find('ul.list').html(tmpl.roomsList(r));
                    listView.fadeIn();
                    bind();
                } else {
                    require(['create_room'], function(createRoomView) {
                        createRoomView.init();
                    });
                }
            } else {
                alert('拉取房间信息失败');
            }
        });
    };

    function bind() {
        ;
    };

    return {
        init: init,
        listRooms: listRooms
    };
});
