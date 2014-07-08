/**
 * tankstrike
 * login.js
 */

define(function() {
    var viewBox = $('#view-login');
    var form = viewBox.find('form');

    viewBox.removeClass('none');

    form.on('submit', function(e) {
        e.preventDefault();

        $.ajax({
            url: '/user/login',
            type: 'POST',
            data: {
                name: $('#name').val(),
                pass: $('#passwd').val()
            }
        }).then(function(r) {
            viewBox.fadeOut();
            require(['connectGate'], function(gate) {
                gate.connect(r.user);
            });
        }, function(r) {
            console.error('login error:', r);
        });
    });
});
