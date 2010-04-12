GLOBAL.DEBUG = true;
var sys = require('sys')

// My little node.js stuff.
var fs      = require("fs"),
    events  = require("events")

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

process.mixin(GLOBAL, require("./Geeks"))

/**
 * Home page
 */
get('/', function() {
  var self = this;
  this.contentType("html");

  Geeks.all(function(err, result) {
        if(err) {
            self.halt(400)
        }
        self.render("index.haml.html", { locals: { geeks: result } });
    });
});

/**
 * Long poll.
 * Watching for geeks update.
 * Submiting the freshly created geek.
 * @todo timeout
 */
get("/events", function() {
    var self = this;
    this.contentType("text");

    Geeks.addListener("new", function(geek) {
        self.halt(200, JSON.stringify(geek.data))
    })
});

/**
 * Create a new geek.
 */
post("/geek/create", function() {
    var self = this
    var geek = new Geek({name: this.param("name"),
                        pole: this.param("pole")
    })
    geek.save(function(err, geek){
        if(err) {
            self.halt(400, "failed")
        }
        else {
            self.halt(200, JSON.stringify(geek.data) )
        }
    })
})

/**
 * Display a form to create a new geek
 */
get("/geek/new", function(){
  this.render("new_geek.haml.html", { layout: false })
});

/**
 * Want to clean Geeks list ?
 */
post('/geeks/purge', function() {
    var self = this
    new Geeks.purge(function(err, result) {
        if(err) { 
            self.halt(400)
        }
        self.halt(200, sys.inspect(result))
    });
})

/**
 * Initializing mongoDB
 */
get('/geeks/createDB', function() {
    var self = this
    Geeks.createDB(function(err, result) {
        if(err)
            self.halt(400)
        self.halt(200, sys.inspect(result))
    }, 'coco');
})

// Render all other static files
get('/*', function(file) {
  this.sendfile(set('root') + '/public/' + file)
});

run();
