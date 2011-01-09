<?xml version="1.0" encoding="utf-8" ?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Geeks</title>
  <link type="text/css" rel="stylesheet" href="/css/map.css"/>
  <link type="text/css" rel="stylesheet" href="/css/irc_url.css"/>
  <link type="text/css" rel="stylesheet" href="/css/input_box.css"/>
</head>

<body>
  <div class="header">
    <ul class="toBeExtended">
      <li>
        <a href="#/geeks/new" class="tool as_dialog">+ new geek</a>
      </li>
    </ul>

    <div class="englobe">
      <div id="irc_urls">
        <p class="text">URLs posted on IRC:</p>
        <ul></ul>
      </div>
      <p class="image">Feedz Da Geeks</p>
    </div>
  </div>

  <div id="map"></div>

  <script type="text/javascript">WS_PORT={{ws_port}};</script>
  <div id="events"></div>
  <div id="input-box"></div>
  <div class="footer"></div>

  <script type="text/javascript" src="/js/jquery-1.4.js"></script>
  <script type="text/javascript" src="/js/sammy.js"></script>
  <script type="text/javascript" src="/js/mustache.js"></script>  
  <script type="text/javascript" src="/js/jquery.mousewheel.js"></script>
  <script type="text/javascript" src="/js/jquery.drag_resize.js"></script>
  <script type="text/javascript" src="/js/jquery.px2percent.js"></script>
  <script type="text/javascript" src="/js/ajaxupload.js"></script>
  <script type="text/javascript" src="/js/socket.io.js"></script>  
  <script type="text/javascript" src="/js/routes.js"></script>
  <script type="text/javascript" src="/js/events.js"></script>  
  <script type="text/javascript" src="/js/map.js"></script>
  <script type="text/javascript" src="/js/templates_fr.js"></script>  
  <script type="text/javascript" src="/js/init.js"></script>
  <script type="text/javascript" src="/yabble.js"></script>
  <script type="text/javascript" src="/init_browser.js"></script>  
  <script type="text/javascript">
  //<![CDATA[
    require.useScriptTags();
    require.setModuleRoot('wrapped_js/');
    require.ensure([
      'util',
      'events',
      //
      'schema',
      //
      'rest-mongo/core',
      'rest-mongo/http_rest/jquery_backend',
      'nodetk/logging',
      'nodetk/orchestration/callbacks',
      'nodetk/utils',
    ], function(require) {
      var schema = require('schema').schema;
      var backend = require('rest-mongo/http_rest/jquery_backend').get_backend();
      var RFactory = require('rest-mongo/core').getRFactory(schema, backend);
      R = RFactory();
      init_geeks();
    });
  //]]>
  </script>
</body>
</html>

