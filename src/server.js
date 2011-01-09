
// Add location of submodules to path:
[ 'connect/lib'
, 'connect-form/lib'
, 'mustache.js/lib'
, 'node-formidable/lib'
, 'nodetk/src'
, 'rest-mongo/src'
, 'Socket.IO-node/lib'
].forEach(function(submodule) {
  require.paths.unshift(__dirname + '/../vendor/' + submodule);
});

var http = require('http')

  , connect = require('connect')
  , connect_form = require('connect-form')
  , bserver = require('nodetk/browser/server')
  , rest_server = require('rest-mongo/http_rest/server')

  , config = require('./config')
  , geeks_app = require('./geeks_app')
  , geeks_events = require('./geeks_events')
  , ms_templates = require('./ms_templates')
  , RFactory = require('./model').RFactory  
  , schema = require('./schema').schema
  ;


// To serve some node JS modules/packages to the browser:
require.paths.unshift(__dirname);
var serve_modules_connector = bserver.serve_modules_connector({
  modules: ['schema'],
  packages: ['nodetk', 'rest-mongo'],
});

// The middlewares stack:
var server = connect.createServer(
  connect.staticProvider({root: __dirname + '/public', cache: false})
, rest_server.connector(RFactory, schema, {eventEmitter: geeks_events.emitter})
, connect_form({keepExtensions: true})
, geeks_app.connector()
, geeks_events.connector
, serve_modules_connector
);


var serve = function(port, callback, websocket_port) {
  /* Lunch HTTP server and if necessary HTTP server for websocket. */
  websocket_port = websocket_port || port;
  var ws_server = server;
  if(port != websocket_port) {
    ws_server = http.createServer();
    ws_server.listen(websocket_port, function() {
      console.log('WS server listning...');    
    });
  }
  ms_templates.generate_refresh_templates(function() {
    geeks_events.listen(ws_server);
    server.listen(port, callback);
  });
};


if(process.argv[1] == __filename) {
  var port = config.server.port;
  serve(port, function() {
    console.log('Geeks listning on http://localhost:'+port);
  }, config.server.websocket_port);
}

