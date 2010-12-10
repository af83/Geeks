/* This is where are handled "live" events of the application. 
 */
var events = require('events')

  , io = require('socket.io')

  , extend = require('nodetk/utils').extend
  ;


var emitter = exports.emitter = new events.EventEmitter();

emitter.on('CREATE:Geek', function(geek) {
  websocket_listener.broadcast({event: "NewGeek", data: geek.json()});
});

emitter.on('UPDATE:Geek', function(ids, data_) {
  var data = extend({}, data_);
  ids.forEach(function(id) {
    data.id = id;
    websocket_listener.broadcast({event: "UpdateGeek", data: data});
  });
});


// TODO: events to deletion of geeks
// ----------------------------------
emitter.on('DELETE:Geek', function(ids) {
  var data = {ids: ids};
  websocket_listener.broadcast({event: "DeleteGeek", data: data});
});

emitter.on('DELETE_ALL:Geek', function() {
});
// ----------------------------------


var websocket_listener;
var listen = exports.listen = function(server) {
  /* Plug web-socket on given server to send events to clients. */
  websocket_listener = io.listen(server, {
    resource: "socket.io"
  , transports: ['websocket']
  });
};

