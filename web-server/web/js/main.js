// requirejs config
require.config({
    baseUrl: '/js/',
    paths: {
        'util': 'util',
        'login': 'login',
        'servers': 'servers',
        'rooms': 'rooms',
        'connectGate': 'connect_gate'
    },
    shim: {
        tmpl: 'tmpl'
    }
});

console.time('load modules cast');
function init() {
    $.get('/user/info')
        .done(function(r) {
            console.log(r);
            if(r.rc === 0) require(['connectGate'], function(gate) {gate.connect(r.user);});
            else require(['login']);
        })
        .fail(function(err) {
            throw err;
        })
        .always(function() {
            console.timeEnd('load modules cast');
        });
};

$(document).ready(init);
