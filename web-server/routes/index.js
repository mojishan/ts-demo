/* routes home. */

var user = require('./user');

module.exports = function(app) {
    app.get('/user/info', user.userInfo);

    app.post('/user/login', user.login);
};
