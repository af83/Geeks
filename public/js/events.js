/* Really simple events dispatcher using Websockets.
 * We expect socket.io lib to be on the server side.
 *
 * Usage:
 *  events_dispatcher.bind('EventName', callback(jsondata));
 */
events_dispatcher = (function() {
  var mapper = {};
  var host = WS_PORT && (window.location.hostname + ':' + WS_PORT)
             || window.location.host
  var socket;
  
  (function init_socket() {
    socket = new io.Socket();
    
    socket.on('message', function(message) {
      var callback = message.event && mapper[message.event];
      callback && callback(message.data);
    });

    socket.on('disconnect', function() {
      // The connection has been closed, try to reconnect in 0.5 seconds:
      setTimeout(init_socket, 500);
    });

    socket.connect();
  })();

  return {
    bind: function(name, fct) {
      mapper[name] = fct;
    }
  };

})();

