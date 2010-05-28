require.paths.unshift(__dirname + '/../vendor/node-irc/lib')
require.paths.unshift(__dirname + '/../vendor/nodetk/src')

var sys = require("sys"),
    irc = require("irc"),
    bar = require('./bar'),
    search = require('nodetk/text/search')

sys.puts(require.paths)

var bot = new irc.Client('irc.freenode.net', 'geeks_bot', {
    debug: true,
    channels: ['#af83-lab']
});

bot.addListener('error', function(message) {
    sys.puts('ERROR: ' + message.command + ': ' + message.args.join(' '));
});



bot.addListener('message', function(from, to, message) {
  sys.puts('Received message from ' + from + " : " + message)
  if (to.match(/^[#&]/)) { // channel message
    var urls = search.extract_URLs(message)
    urls.forEach(function(url) {
      sys.puts('URL: ' + url)
      bar.emit_event('IrcURL', {
        from: from, 
        channel: to, 
        url: url
      })
    })
  }
});

