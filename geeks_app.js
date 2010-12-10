var fs = require('fs')
  , URL = require('url')

  , config = require('./config')
  , geeks_events = require('./geeks_events')
  , ms_templates = require('./ms_templates')
  , RFactory = require('./model').RFactory
  ;

var AVATARS_DIR = __dirname + "/public/images/geeks/";

var error = function(res, err) {
  console.error(err);
  res.writeHead(500, {'Content-Type': 'text/html'});
  res.end(err.message);
};


var index = function(req, res) {
  /* Serve the app HTML page. */
  res.writeHead(200, {'Content-Type': 'text/HTML; charset=utf-8'});
  var html = ms_templates.render('index.html', {
    ws_port: config.server.websocket_port
  });
  res.end(html);
};


var update_geek = function(req, res, geek_id) {
  /* Handles upload for geek avatar: POST on /geeks/id/avatar */
  req.form.complete(function(err, fields, files){
    if(err) return error(res, err);
    var avatar = files.avatar
      , name = avatar && avatar.filename || ''
      , parts = name.split('.')
      , ext = parts.length == 2 && parts[1] || ''
      ;
    if(! /^(jpg|png|jpeg|gif)$/i.test(ext)) {
      res.writeHead(400, {'Content-Type': 'text/html'});
      res.end('You must give a file with one of the following extensions: '+
              'jpg, jpeg, png, gif.');
      return;
    }
    var R = RFactory();
    R.Geek.get({ids: geek_id}, function(geek) {
      var previous = geek.avatar_fname && parseInt(geek.avatar_fname.split('_')[1]) || 0;
      geek.avatar_fname = geek_id + "_" + (previous + 1);
      fs.rename(avatar.path, AVATARS_DIR + geek.avatar_fname, function(error) {
        if(error) return error(res, error);
        res.writeHead(201, {}); res.end();
        geek.save(function() {
          geeks_events.emitter.emit('UPDATE:Geek', [geek_id], geek.json());
        });
      });
    }, function(err) {
      res.writeHead(404, {}); 
      res.end(err.message);
    });
  });
};

var upload_avatar_re = new RegExp('^/geeks/(\\w+)/avatar$');
exports.connector = function() {
  return function(req, res, next) {
    var url = URL.parse(req.url)
      ;
    if(req.method == 'GET' && url.pathname == '/') return index(req, res);
    var match = url.pathname.match(upload_avatar_re);
    if(match && req.method == 'POST') {
      return update_geek(req, res, match[1]);
    }
    next();
  };
};

