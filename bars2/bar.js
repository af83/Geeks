var http = require('http'),
    sys = require('sys'),
    config = require('../config')

var get_client = function() {
  var client = http.createClient(config.server.port, 
                                 config.server.host || 'localhost')
  client.addListener('error', function(error) {
    sys.debug(error)
  })
  return client;
}


/* Send an event to the Geeks main server
 *
 * Arguments:
 *  - name: name of the event
 *  - data: JSON obj, event data
 */
exports.emit_event = function(name, data) {
  // TODO: maybe don't recreate a client on each event
  var geeks = get_client()
      request = geeks.request('POST', '/events', {'Transfer-Encoding': 'chunked'})
      event = {event: name, data: data}
  request.write(JSON.stringify(event), 'utf8')
  request.addListener('response', function(response) {
    sys.puts(JSON.stringify(response.headers))
  })
  request.end()
}

