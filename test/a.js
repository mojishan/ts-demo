var data = require('./data');

if(!data.x.num) data.x.num = 0;

exports.add = function() {
    data.x.num++;
}
