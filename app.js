GLOBAL.DEBUG = true
var sys     = require("sys")
    events  = require("events")
    kiwi    = require("kiwi")

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

// Geeks DB
var _Geeks = require("Geeks"),
    Geeks  = _Geeks.Geeks,
    Geek   = _Geeks.Geek

var _Bars  = require("Bars"),
    Bars   = _Bars.Bars,
    Bar    = _Bars.Bar
new Bar('localhost', 3001)

/**
 * Home page
 */
get('/', function() {
  var self = this
  this.contentType("html")

  Geeks.all(function(err, result) {
    if (err)
      self.halt(400, "Database error")
    self.render("index.html.haml", { locals: { geeks: result } })
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

  Geeks.addListener("new", function(geek) {
    self.halt(200, JSON.stringify(geek.data))
  })
})

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
  this.render("new_geek.html.haml", { layout: false })
})

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
    })
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
    }, 'coco')
})

/* Render all other static files
get('/*', function(file) {
  this.sendFile(set('root') + '/public/' + file)
})*/

run()
