var URL = require('url')

  , ms_templates = require('./ms_templates')
  ;

var ROUTING = {GET: {}};


ROUTING.GET['/'] = function(res, res) {
  /* Serve the app HTML page. */
  res.writeHead(200, {'Content-Type': 'text/HTML; charset=utf-8'});
  var html = ms_templates.render('index.html');
  res.end(html);
};

exports.connector = function() {
  return function(req, res, next) {
    var url = URL.parse(req.url)
      , routing = ROUTING[req.method] || {}
      , action = routing[url.pathname]
      ;
    if (action) action(req, res);
    else next();
  };
};

