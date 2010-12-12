/* Really simple events dispatcher using Websockets.
 * We expect socket.io lib to be on the server side.
 *
 * Usage:
 *  events_dispatcher.bind('EventName', callback(jsondata));
 */
events_dispatcher = (function() {
  var mapper = {};
  var socket;
  
  var init_socket = function() {
    WEB_SOCKET_SWF_LOCATION = '/js/WebSocketMain.swf';    
    socket = new io.Socket(document.domain, {port: WS_PORT});
    
    socket.on('message', function(message) {
      var callback = message.event && mapper[message.event];
      callback && callback(message.data);
    });

    socket.on('disconnect', check_connection);
    socket.connect();
  };

  var check_connection = function() {
    if(socket && !socket.connected) {
      delete socket;
      init_socket();
    }
  };

  init_socket();
  setInterval(check_connection, 3000);

  return {
    bind: function(name, fct) {
      mapper[name] = fct;
    }
  };

})();

