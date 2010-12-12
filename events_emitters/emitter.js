var web = require('nodetk/web')
  , config = require('../config')
  ;

var url = 'http://' + (config.server.host || 'localhost') +
          ':' + config.server.port + '/events';

/* Send an event to the Geeks main server
 *
 * Arguments:
 *  - name: name of the event
 *  - data: JSON obj, event data
 */
exports.emit_event = function(name, data) {
  web.POST(url, {'event': name, 'data': JSON.stringify(data)}, function(http_code, headers, body) {
    if(http_code < 200 || http_code >= 300) {
      console.error("Bad answer when posting event: " + body);
    }
  });
};

