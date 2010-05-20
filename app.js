GLOBAL.DEBUG = true
var sys     = require("sys"),
    events  = require("events"),
    kiwi    = require("kiwi"),
    rest_mongo = require("rest-mongo")


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

var geeks_eventor = new events.EventEmitter()


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
 * Long poll.
 * Watching for geeks update.
 * Submiting the freshly created geek.
 * @todo timeout
 */
get("/events", function() {
  var self = this
  this.contentType("text")

  geeks_eventor.addListener("newGeek", function(geek) {
      self.halt(200, JSON.stringify(geek))
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
        geeks_eventor.emit("newGeek", geek)
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

run()

