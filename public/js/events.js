/* Really simple events dispatcher using Websockets.
 * We expect socket.io lib to be on the server side.
 *
 * Usage:
 *  events_dispatcher.bind('EventName', callback(jsondata));
 */
events_dispatcher = (function() {

  if (!('WebSocket' in window)) {
    alert("Your browser does not support WebSockets! " +
          "You won't have any live events!");
    return {bind: function(){}};
  }
  var mapper = {};

  var ws_url = 'ws://' + window.location.host + '/socket.io/websocket';
  var socket = new WebSocket(ws_url);

  socket.onmessage = function (msg) {
    var messages = JSON.parse(msg.data).messages;
    messages.forEach(function(message) {
      var callback = message.event && mapper[message.event];
      callback && callback(message.data);
    });
  };

  return {
    bind: function(name, fct) {
      mapper[name] = fct;
    }
  }

})();

