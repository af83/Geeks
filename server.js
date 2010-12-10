
// Add location of submodules to path:
[ 'connect/lib'
, 'mustache.js/lib'
, 'nodetk/src'
, 'rest-mongo/src'
, 'Socket.IO-node/lib'
].forEach(function(submodule) {
  require.paths.unshift(__dirname + '/vendor/' + submodule);
});

var connect = require('connect')

  , bserver = require('nodetk/browser/server')
  , rest_server = require('rest-mongo/http_rest/server')

  , geeks_app = require('./geeks_app')
  , geeks_events = require('./geeks_events')
  , ms_templates = require('./ms_templates')
  , RFactory = require('./model').RFactory  
  , schema = require('./schema').schema
  ;


// To serve some node JS modules/packages to the browser:
require.paths.unshift(__dirname);
var serve_modules_connector = bserver.serve_modules_connector({
  modules: ['assert', 'util', 'schema'],
  packages: ['nodetk', 'rest-mongo'],
});

// The middlewares stack:
var server = connect.createServer(
  connect.staticProvider({root: __dirname + '/public', cache: false})
, geeks_app.connector()
, rest_server.connector(RFactory, schema, {eventEmitter: geeks_events.emitter})
, serve_modules_connector
);


var serve = function(port, callback) {
  /* Lunch HTTP server */
  ms_templates.generate_refresh_templates(function() {
    geeks_events.listen(server);
    server.listen(port, callback);
  });
};


if(process.argv[1] == __filename) {
  serve(3000, function() {
    console.log('Geeks listning on http://localhost:3000');
  });
}

