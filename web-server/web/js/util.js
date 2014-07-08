/**
 * util.js
 */

define('util', function() {
    function $(id) {
        return document.querySelector(id);
    };

    return {
        '$': $
    };
});
