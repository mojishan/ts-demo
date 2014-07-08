var channel = module.exports;

var ROOM_PREFIX = 'ROOM_';

channel.getRoomChannelName = function(roomId) {
  return ROOM_PREFIX + roomId;
};
