
[ 'node-irc/lib'
, 'nodetk/src'
].forEach(function(path){
  require.paths.unshift(__dirname + '/../vendor/' + path);
});

var irc = require("irc")
  , search = require('nodetk/text/search')
  , web = require('nodetk/web')

  , config = require("../config")
  , emitter = require('./emitter')
  , RFactory = require("../db").RFactory
  ;

var geeks_url = 'http://' + config.server.host;
if(config.server.port) geeks_url += ':' + config.server.port;

var bot = new irc.Client(config.ircEmitter.network, config.ircEmitter.nickname, {
    debug: config.ircEmitter.debug,
    channels: config.ircEmitter.channels
});

bot.addListener('error', function(message) {
    console.log('ERROR: ' + message.command + ': ' + message.args.join(' '));
});

var register_send_url = function(from, channel, url) {
  /* Given a url, from whom it has been received, and where,
   * save it to DB + emit corresponding event.
   */
  var R = RFactory();
  R.URL.index({query: {url: url}}, function(existing_urls) {
    if(existing_urls && existing_urls.length > 0) {
      var url_obj = existing_urls[0];
      bot.say(channel, from + ': this URL has already been posted on ' + 
                       url_obj.channel + ' by ' + url_obj.from + '.');
      return;
    }
    var data = {'from': from, 'channel': channel, 'url': url};
    emitter.emit_event('IrcURL', data);
    var url_obj = new R.URL(data);
    url_obj.save();
    bot.say(channel, 'Thanks for the URL ' + from + 
            ', it has been added to Geeks (' + geeks_url + ').');
  });
};

bot.addListener('message', function(from, to, message) {
  console.log('Received message from ' + from + " : " + message);
  if (to.match(/^[#&]/)) { // channel message
    var urls = search.extract_URLs(message);
    urls.forEach(function(url) {
      console.log('URL: ' + url);
      var data = {from: from, channel: to, url: url};
      if(url.indexOf('http') == 0) web.check_url(url, {}, function(info) {
        register_send_url(from, to, info.location);
      }, function(err) {
        bot.say(to, from + ": this URL doesn't seem to lead anywhere...");
      });
      else register_send_url(from, to, url);
    });
  }
});

