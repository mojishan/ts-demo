define(function() {
    var gateRoute = 'gate.gateHandler.queryEntry';
    var gateHost = window.location.hostname;
    var gatePort = 3014;

    function connect(user, log) {
        var def = $.Deferred();

        // 连接gate服务器
        pomelo.init({
            host: gateHost,
            port: gatePort,
            log: log || false
        }, function() {
            pomelo.request(gateRoute, user, function(r) {
                pomelo.disconnect();
                if(r.rc === 0) {
                    require(['servers'], function(serversView) {
                        def.resolve(r);
                        serversView.init(r.host, r.port, user);
                    });
                } else {
                    console.error('连接gate服务器失败');
                    def.reject(r);
                }
            });
        });

        return def.promise();
    };

    return {
        connect: connect
    };
});
