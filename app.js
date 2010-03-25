// My little node.js stuff.
var fs      = require("fs"),
    events  = require("events"),
    emitter = new events.EventEmitter()

// Express
require.paths.unshift("vendor/express/lib");
require("express");
require("express/plugins");
var utils = require('express/utils'),
    kiwi  = require('kiwi');

configure(function() {
  kiwi.seed('haml');
  use(MethodOverride);
  use(ContentLength);
  use(CommonLogger);
  set("root", __dirname);                  // Root dir
  set("geeks", set("root") + "/geeks");    // Geeks JSON store dir
});

/**
 * Home page
 */
get('/', function() {
  var self = this;
  this.contentType("html");

  // Read all geek files in local geek/ directory
  fs.readdir(set("geeks"), function(err, files) {
    if (err)
      self.halt(400, "Could not find a geek list in: " + set("geeks"));

    var acc = [];
    emitter.addListener("oneMoreFile", function(geek)
    {
      debug("One more file called.");
      acc.push(geek);
      if (acc.length  == files.length)
        self.render("index.haml.html", { locals: { geeks: acc } });
    });

    // Emit "oneMoreFile" for each file read
    for (file_name in files) {
      fs.readFile(set("geeks") + "/" + files[file_name], function(err, data)
      {
        if (err)
          self.halt(400, "Could not load geek in file: " + file_name);
        emitter.emit("oneMoreFile", JSON.parse(data));
      });
    }
  });
});

/**
 * Long poll.
 * Watching for geeks update.
 * Submiting a changed geek.
 * @todo timeout
 */
get("/events", function() {
    var self = this;
    this.contentType("text");

    // watching geeks dir
    // @fixme this only watches one file at a time
    fs.readdir(set("geeks"), function(err, files)
    {
      if (err)
        self.halt(400, "failed");

      // Watch a file, emit it on change.
      var watchFile = function(name)
      {
        debug("watchFile: " + name);
        fs.watchFile(name, function(current, previous) {
          debug(name + " has changed, sending it.");
          fs.readFile(name, function(err, data) {
            if (err)
              self.halt(400, "failed");
            self.halt(200, data);
          });
        });
      };

      // Watch every geek/ directory files for change
      for (name in files) {
        watchFile(set("geeks") + "/" + files[name]);
      }
    });

    // New file in geeks/ directory
    // @see POST action for: /geek/create
    emitter.addListener("newGeeks", function(file_name) {
      fs.readFile(file_name, function(err, data) {
        if (err)
          self.halt(400, "failed");
        self.halt(200, data);
      });
    });
});

/**
 * Create a new geek.
 */
post("/geek/create", function() {
  var self      = this;
  var file_name = set("geeks") + "/" + this.param("name") + ".json";
  var fd        = fs.open(file_name, "w+", 0666, function (err, fd)
  {
    if (err)
      self.halt(400, "failed");
    fs.write(fd, JSON.stringify(self.params.post), null, null, function(err, bytes) {
      if (err)
        self.halt(400, "failed");
      fs.close(fd, function(err)
      {
        if (err)
          self.halt(400, "failed");
        emitter.emit("newGeeks", file_name);
        self.halt(200, "done");
      });
    });
  });
});

/**
 * Display a form to create a new geek
 * @todo gruik, don't returning a hard file,
 *  haven't debug this.render('new_geek.mustache.html') for now.
 */
get("/geek/new", function(){
  this.render("new_geek.haml.html", { layout: false });
});

// Render all other static files
get('/*', function(file) {
  this.sendfile(set('root') + '/public/' + file)
});

run();
