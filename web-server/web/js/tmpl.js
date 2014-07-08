define(function(){

  var _ = {};_.defaults = function(obj) {
Array.prototype.slice.call(arguments, 1).forEach(function(source) {
if (source) {
for (var prop in source) {
if (obj[prop] === void 0) obj[prop] = source[prop];
}
}
});
return obj;
};_.escape = function(string) {
var escapeMap = {
'&': '&amp;',
'<': '&lt;',
'>': '&gt;',
'"': '&quot;',
"'": '&#x27;'
};
var escapeRegexe = new RegExp('[' + Object.keys(escapeMap).join('') + ']', 'g');if (string == null) return '';
return ('' + string).replace(escapeRegexe, function(match) {
return escapeMap[match];
});
};

  this["JST"] = this["JST"] || {};

  this["JST"]["roomsList"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape, __j = Array.prototype.join;function print() { __p += __j.call(arguments, '') }with (obj) { for(var i=0; i<list.length; i++) { ;__p += '\n'; var room = list[i]; ;__p += '\n<li>\n<h3>' +((__t = ( room.name || '' )) == null ? '' : __t) +'</h3>\n<p>战斗模式：' +((__t = ( room.mode || '' )) == null ? '' : __t) +'</p>\n<p>玩家数：' +((__t = ( room.players || 0 )) == null ? '' : __t) +'</p>\n<p>状态：' +((__t = ( room.status || 0 )) == null ? '' : __t) +'</p>\n</li>\n'; } ;}return __p};

  this["JST"]["serversList"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape, __j = Array.prototype.join;function print() { __p += __j.call(arguments, '') }with (obj) { for(var i=0; i<list.length; i++) { ;__p += '\n'; var svr = list[i]; ;__p += '\n<li data-server-id="' +((__t = ( svr.id )) == null ? '' : __t) +'">\n<h3>' +((__t = ( svr.id )) == null ? '' : __t) +'</h3>\n<p>房间数：' +((__t = ( svr.rooms )) == null ? '' : __t) +'</p>\n<p>在线人数：' +((__t = ( svr.players )) == null ? '' : __t) +'</p>\n</li>\n'; } ;}return __p};

  return this["JST"];

});