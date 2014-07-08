/**
 * tankstrike
 * servers.js
 */

define(['tmpl'], function(tmpl) {
    var self = this;
    var viewBox = $('#view-servers-list');
    var listRoute = 'connector.serverHandler.listServers';
    var selectRoute = 'connector.serverHandler.selectServer';

    function init(host, port, user) {
        self.user = user;
        listServers(host, port, user.uid, true);
        bind();
    };

    function listServers(host, port, uid, log) {
        // 连接connector服务器
        pomelo.init({
            host: host,
            port: port,
            log: log || false
        }, function() {
            pomelo.request(listRoute, {uid: uid}, function(r) {console.log(r)
                if(r.rc === 0) {
                    viewBox.find('ul.list').html(tmpl.serversList(r));
                    viewBox.fadeIn();
                } else {
                    console.error('拉取分区信息失败');
                }
            });
        });
    };

    function bind() {
        viewBox.on('click', 'ul.list > li', function(e) {
            pomelo.request(selectRoute, {serverId: $(this).data('serverId')}, function(r) {
                // pomelo.disconnect();
                if(r.rc === 0) {
                    require(['rooms'], function(roomsView) {
                        viewBox.fadeOut();
                        roomsView.init(r.serverId);
                    });
                } else {
                    console.error('连接后端服务器失败');
                }
            });
        });
    };

    return {
        init: init
    };
});
