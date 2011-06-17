
// Add location of submodules to path:
[ 'nodetk/src'
, 'rest-mongo/src'
].forEach(function(submodule) {
  require.paths.unshift(__dirname + '/../vendor/' + submodule);
});

var http = require('http')
  , connect = require('connect')
  , connect_form = require('connect-form')
  , sessions = require('cookie-sessions')
  , bserver = require('nodetk/browser/server')
  , rest_server = require('rest-mongo/http_rest/server')
  , oauth2_client = require('oauth2-client')
  , request = require('request')

  , config = require('./config')
  , geeks_app = require('./geeks_app')
  , geeks_events = require('./geeks_events')
  , ms_templates = require('./ms_templates')
  , RFactory = require('./model').RFactory
  , schema = require('./schema').schema
  , valid_auth = require('./valid_auth')
  ;


var oauth2_client_options = {
  auth_server: {
    // To get info from access_token and set them in session
    treat_access_token: function(data, req, res, callback, fallback) {
      var params = {oauth_token: data.token.access_token};
      request.get({url: config.oauth2_client.current_user_url,
                   headers: {'Authorization' : 'OAuth '+ data.token.access_token}
                  },
                  function(error, response, body) {
                    if(error || response.statusCode != 200)
                      return fallback("Bad answer from AuthServer: "+ response.statusCode+" "+body);
                    else {
                      var info = JSON.parse(body);
                      req.session = {userid: info.entry.displayName};
                      callback();
                    }
                  });
    }
  }
};

// To serve some node JS modules/packages to the browser:
require.paths.unshift(__dirname);
var serve_modules_connector = bserver.serve_modules_connector({
  modules: ['schema'],
  packages: ['nodetk', 'rest-mongo'],
});

var oauth2_client_obj = oauth2_client.createClient(config.oauth2_client, oauth2_client_options);

// The middlewares stack:
var server = connect.createServer(
  sessions(config.session)
, oauth2_client_obj.connector()
, valid_auth.connector(oauth2_client_obj)
, connect.static(__dirname + '/public', {cache: false})
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
      console.log('WS server listening...');
    });
  }
  ms_templates.generate_refresh_templates(function() {
    geeks_events.listen(ws_server);
    server.listen(port, callback);
  });
};


if(process.argv[1] == __filename) {
  var port = config.server.port;
  serve(port, function(err) {
    if (err) throw err;
    console.log('Geeks listening on http://localhost:'+port);
  }, config.server.websocket_port);
}
