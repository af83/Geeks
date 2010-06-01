require.paths.unshift(__dirname + '/../vendor/node-irc/lib')
require.paths.unshift(__dirname + '/../vendor/nodetk/src')

var sys = require("sys"),
    irc = require("irc"),
    bar = require('./bar'),
    search = require('nodetk/text/search'),
    web = require('nodetk/web'),
    R = require("../db").RFactory()


var bot = new irc.Client('irc.freenode.net', 'geeks_bot', {
    debug: true,
    channels: ['#af83-lab']
})

bot.addListener('error', function(message) {
    sys.puts('ERROR: ' + message.command + ': ' + message.args.join(' '))
})

var register_send_url = function(from, channel, url) {
  /* Given a url, from whom it has been received, and where,
   * save it to DB + emit corresponding event.
   */
  R.URL.index({query: {url: url}}, function(existing_urls) {
    R.URL.clear_cache();
    if(existing_urls && existing_urls.length > 0) return;
    var data = {'from': from, 'channel': channel, 'url': url}
    bar.emit_event('IrcURL', data)
    var url_obj = new R.URL(data)
    url_obj.save()
  })
}

bot.addListener('message', function(from, to, message) {
  sys.puts('Received message from ' + from + " : " + message)
  if (to.match(/^[#&]/)) { // channel message
    var urls = search.extract_URLs(message)
    urls.forEach(function(url) {
      sys.puts('URL: ' + url)
      var data = {from: from, channel: to, url: url}
      if(url.indexOf('http') == 0) web.check_url(url, {}, function(info) {
        register_send_url(from, to, info.location)
      }, function(err) {
        sys.puts("error:" + err)
      })
      else register_send_url(from, to, url)
    })
  }
})

