// My little node.js stuff.
var posix   = require("posix"),
    events  = require("events"),
    emitter = new events.EventEmitter()

// Load Express from Visionmedia
require.paths.unshift("vendor/express/lib");
require("express");
require("express/plugins");

configure(function() {
    use(MethodOverride);
    use(ContentLength);
    use(CommonLogger);
    set("root", __dirname);                  // Root dir
    set("geeks", set("root") + "/geeks");    // Geeks JSON store dir
});

// Home page
get('/', function() {
    var self = this;
    this.contentType("html");

    posix.readdir(set("geeks"))
    .addCallback(function(file_list) {
            var acc = [];
            emitter.addListener("oneMoreFile",
                function(geek) {
                    acc.push(geek);
                    if (acc.length  == file_list.length) {
                        self.render("home.haml.html", { locals: { geeks: acc } });
                    }
                }
            );
            for (file_name in file_list) {
                posix.cat(set("geeks") + "/" + file_list[file_name])
                .addCallback(function(data) {
                    emitter.emit("oneMoreFile", JSON.parse(data));
                });
            }
        }
    )
    //var geeks = [{name: '1'}, {name: '22'}]
});

/**
 * Long poll.
 * Watching on geeks update.
 * Submiting a changed geek.
 * @todo timeout
 */
get("/events", function() {
    var self = this;
    this.contentType("text");

    // watching geeks dir
    posix.readdir(set("geeks"))
    .addCallback(function(files_name) {
        // use for watching a geek file and emit it on change as json.
        var watchFile = function(file_name) {
            process.watchFile(file_name,
                function(current, previous) {
                    posix.cat(file_name)
                    .addCallback(function(data) {
                       self.halt(200, data);
                    });
                }
            )
        }
        // listenning at each geek change
        for (file_name in files_name) {
            watchFile(set("geeks") + "/" + files_name[file_name]);
        }
    })
    emitter.addListener("newGeeks", function(file_name) {
        posix.cat(file_name)
        .addCallback(function(data) {
            self.halt(200, data);
        })
    });
});

/**
 * listing saved geeks.
 */
get("/test", function() {
    var self = this;
    this.contentType("text");

    // agregate all geeks as an array
    posix.readdir(set("geeks"))
    .addCallback(function(files_name) {
            var acc = [];
            emitter.addListener("oneMoreFile",
                function(geek) {
                    acc.push(geek);
                    if (acc.length == files_name.length) {
                        self.render("test.haml.html", { locals: { geeks: acc } });
                    }
            });
            for (file_name in files_name) {
                posix.cat(set("geeks") + "/" + files_name[file_name])
                .addCallback(function(data) {
                    emitter.emit("oneMoreFile", JSON.parse(data));
                });
            }
        }
    )
});

/*
* Write a geek to the file system.
*/
post("/geek/new", function() {
    var self = this;
    debug(this.param("name"));
    var file_name = set("geeks") + "/" + this.param("name") + ".json";
    var fd = posix.open(file_name, process.O_CREAT | process.O_WRONLY, 0666)
    .addCallback(function (fd) {
        posix.write(fd, JSON.stringify(self.params.post)) // tojson
        .addCallback(function(bytes) {
            posix.close(fd)
            .addCallback(function() {
                debug(file_name);
                emitter.emit("newGeeks", file_name);
                self.halt(200, "done");
            }).addErrback(function() {
                self.halt(400, "failed");
            });
        }).addErrback(function() {
                self.halt(400, "failed");
         })
        .addErrback(function() {
            self.halt(400, "failed");
        });
    });
});

/**
 * form to create a geek to the file system
 * @todo gruik, returning an hard file, haven't debug this.render('new_geek.mustache.html') for now.
 */
get("/geek/new", function(){
    this.render("new_geek.haml.html", { layout: false });
});

// Render all static files
get('/*', function(file) {
  this.sendfile(set('root') + '/public/' + file)
});

run();
