/* Really simple events dispatcher using Websockets.
 * We expect socket.io lib to be on the server side.
 *
 * Usage:
 *  events_dispatcher.bind('EventName', callback(jsondata));
 */
events_dispatcher = (function() {

  if (!('WebSocket' in window)) {
    $('body').prepend('<p style="background:red">' +
                      'Your browser does not support WebSockets! ' +
                      'You won\'t have any live events!</p>');
    return {bind: function(){}};
  }
  var mapper = {};

  var ws_url = 'ws://' + window.location.host + '/socket.io/websocket';
  var socket;
  
  (function init_socket() {
    socket = new WebSocket(ws_url);

    socket.onmessage = function (msg) {
      var messages = JSON.parse(msg.data).messages;
      messages.forEach(function(message) {
        var callback = message.event && mapper[message.event];
        callback && callback(message.data);
      });
    };

    socket.onclose = function() {
      // The connection has been closed, try to reconnect in 0.5 seconds:
      setTimeout(init_socket, 500);
    };
  })();

  return {
    bind: function(name, fct) {
      mapper[name] = fct;
    }
  }

})();

