GLOBAL.DEBUG = true

require.paths.unshift("./vendor/Socket.IO-node/lib")
require.paths.unshift("./vendor/rest-mongo/src")

var sys     = require("sys"),
    kiwi    = require("kiwi"),
    rest_mongo = require("rest-mongo"),
    io = require('socket.io'),
    utils = require("nodetk/utils")


require.paths.unshift(__dirname + "/lib")

// Express
kiwi.require("express")
require("express/plugins")

configure(function() {
  kiwi.seed("haml")
  use(Logger)
  use(MethodOverride)
  use(ContentLength)
  use(Cookie)
  set('root', __dirname)
  use(Static)
  set("cache static files")
})

var schema = {
  Geek: {
    schema: {
      id: "Geek",
      description: "A geek / person / dev ...",
      type: "object",

      properties: {
        name: {type: "string"},
        pole: {type: "string"},
        width: {type: "float"},
        height: {type: "float"},
        top: {type: "float"},
        left: {type: "float"}
      }
    }
  }
}
var RFactory = rest_mongo.getRFactory(schema, "Geeks_dev")


// Sample component
var _Bars  = require("Bars"),
    Bars   = _Bars.Bars,
    Bar    = _Bars.Bar
new Bar('localhost', 3001)

/**
 * Home page
 */
get('/', function() {
  var self = this,
      R = RFactory()
  self.contentType("html")

  R.Geek.index(function(result) {
      self.render("index.html.haml", {locals: {geeks: result}})
  }, function(err) {
      self.halt(400, "Database error")
  })
})


get('/geeks.json', function() {
  var self = this,
      R = RFactory()
  self.contentType("json")
  
  R.Geek.index(function(geeks) {
    geeks = geeks.map(function(geek) {return geek.json()});
    self.halt(200, JSON.stringify(geeks))
  }, function(error) {
    self.halt(501)
  });
});

post('/geeks/:id', function(id) {
  var R = RFactory(),
      self = this,
      geek

  try {
    geek = JSON.parse(self.body)
    // TODO: cleaner filtering
    delete geek.id
    delete geek.movable
    delete geek.resizable
  } catch (e) {
    return self.halt(400)
  }

  R.Geek.update({
    ids: id,
    data: geek
  }, function() {
    var data = utils.extend({id: id}, geek)
    websocket_listener.broadcast({event: "UpdateGeek", data: data})
    self.halt(200)
  }, function() {
    self.halt(501)
  });
});

/**
 * Create a new geek.
 */
post("/geek/create", function() {
    var self = this,
        R = RFactory()

    var geek = new R.Geek({name: this.param("name"),
                           pole: this.param("pole")
    })
    geek.save(function() {
        websocket_listener.broadcast({event: "NewGeek", data: geek})
        self.halt(201)
    }, function(err) {
        self.halt(400, "failed")
    })
})

/**
 * Display a form to create a new geek
 */
get("/geek/new", function(){
  this.render("new_geek.html.haml", { layout: false })
})

/* Serve JS client files from git submodules in /vendor/js_client/ dir.
 */
get('/public/js2/:name.js', function(name) {
  this.sendfile(__dirname + '/vendor/js_client/' + name + '/' + name + '.js')
})


/**
 * Want to clean Geeks list ?
 */
post('/geeks/purge', function() {
    var self = this,
        R = RFactory()
    R.Geek.clear_all(function() {
        self.halt(200, "Geeks deleted")
    }, function(err) {
        self.halt(400)
    })
})

var server = run()
var websocket_listener = io.listen(server, {
    resource: "socket.io", 
    transports: ['websocket'],
})

