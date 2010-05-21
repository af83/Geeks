GLOBAL.DEBUG = true

require.paths.unshift("./vendor/Socket.IO-node/lib")
require.paths.unshift("./vendor/rest-mongo/src")

var sys     = require("sys"),
    kiwi    = require("kiwi"),
    rest_mongo = require("rest-mongo"),
    io = require('socket.io')


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
  this.contentType("html")

  R.Geek.index(function(result) {
      self.render("index.html.haml", {locals: {geeks: result}})
  }, function(err) {
      self.halt(400, "Database error")
  })
})

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

