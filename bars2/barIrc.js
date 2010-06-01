require.paths.unshift(__dirname + '/../vendor/node-irc/lib')
require.paths.unshift(__dirname + '/../vendor/nodetk/src')

var sys = require("sys"),
    irc = require("irc"),
    bar = require('./bar'),
    search = require('nodetk/text/search'),
    web = require('nodetk/web')

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
      var data = {from: from, channel: to, url: url}
      if(url.indexOf('http') == 0) web.check_url(url, {}, function(info) {
        data.url = info.location
        bar.emit_event('IrcURL', data)
      }, function(err) {
        sys.puts("error:" + err);
      })
      else bar.emit_event('IrcURL', data)
    })
  }
});

