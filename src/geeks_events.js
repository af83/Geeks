/* This is where are handled "live" events of the application.
 */
var events = require('events')
  , URL = require('url')

  , io = require('socket.io')
  , extend = require('nodetk/utils').extend

  , error = require('./utils').error
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

emitter.on('REMOVE:Geek', function() {
});
// ----------------------------------


var websocket_listener;
var listen = exports.listen = function(server) {
  /* Plug web-socket on given server to send events to clients. */
  websocket_listener = io.listen(server, {
    resource: "socket.io"
  , transports: ['websocket', 'flashsocket', 'htmlfile', 'xhr-multipart', 'xhr-polling']
  });
};


// -----------------------------------
// Connect middleware to handle events post:

var post_event = function(req, res) {
  /* POST /events */
  req.form.complete(function(err, fields) {
    if(err) return error(res, err);
    var event_name = fields['event']
      , event_data = fields['data']
      ;
    if(!event_name || !event_data) {
      res.writeHead(400, {}); res.end();
      return;
    }
    data = JSON.parse(event_data);
    res.writeHead(200, {}); res.end();
    websocket_listener.broadcast({event: event_name, data: data});
  });
};

exports.connector = function(req, res, next) {
  var url = URL.parse(req.url);
  if (req.method == "POST" && url.pathname == "/events") post_event(req, res);
  else next();
};

