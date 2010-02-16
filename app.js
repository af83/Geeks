var posix = require('posix');
var events  = require("events")
var emitter = new events.EventEmitter()
require.paths.unshift('vendor/express/lib');
require('express');
require('express/plugins');

configure(function() {
    use(MethodOverride);
    use(ContentLength);
    set('root', __dirname);
});

// Home page
get('/', function() {
    self = this;
    this.contentType('text');
    posix.readdir(set('root')+"/geeks")
    .addCallback(function(files_name) {
            var acc = [];
            emitter.addListener("oneMoreFile",
                function(geek){
                    acc.push(geek);
                    if( acc.length  == files_name.length) {
                        self.render('home.haml.html', { locals: { geeks: acc}})
                    }
            })
            for(file_name in files_name) {
                posix.cat(set('root')+"/geeks/"+files_name[file_name])
                .addCallback(function(data) {
                    emitter.emit("oneMoreFile", JSON.parse(data))
                });
            }
        }
    )

    var geeks = [{name: '1'}, {name: '22'}]
});

/**
 * Long poll.
 * Watching on geeks update.
 * Submiting a changed geek.
 * @todo timeout
 */
get('/events', function() {
    var self = this;
    this.contentType('text');
    // watching geeks dir
    posix.readdir(set('root')+"/geeks")
    .addCallback(function(files_name) {
        // use for watching a geek file and emit it on change as json.
        var watchFile = function(file_name){
            process.watchFile(file_name,
                function(current, previous){
                    posix.cat(file_name)
                    .addCallback(function(data){
                       self.halt(200, data);
                    });
                }
            )
        }
        // listenning at each geek change
        for(file_name in files_name){
            watchFile(set('root')+"/geeks/"+files_name[file_name]);
        }
    })
    emitter.addListener("newGeeks", function(file_name){
        posix.cat(file_name)
        .addCallback(function(data){
            self.halt(200, data);
        })
    });

});

/**
 * listing saved geeks.
 */
get('/test', function() {
    var self = this;
    this.contentType('text');
    // agregate all geeks as an array
    posix.readdir(set('root')+"/geeks")
    .addCallback(function(files_name) {
            var acc = [];
            emitter.addListener("oneMoreFile",
                function(geek){
                    acc.push(geek);
                    if( acc.length  == files_name.length) {
                        self.render('test.haml.html', { locals: { geeks: acc}})
                    }
            })
            for(file_name in files_name) {
                posix.cat(set('root')+"/geeks/"+files_name[file_name])
                .addCallback(function(data) {
                    emitter.emit("oneMoreFile", JSON.parse(data))
                });
            }
        }
    )
});


/*
* Write a geek to the file system.
*/
post('/geek/new', function() {
    var self = this;
    debug(this.param('name'))
    var file_name = set('root')+"/geeks/"+this.param('name')+".json";
    var fd = posix.open(file_name, process.O_CREAT | process.O_WRONLY, 0666)
    .addCallback(function (fd){
        posix.write(fd, JSON.stringify(self.params.post)) // tojson
        .addCallback(function(bytes){
            posix.close(fd)
            .addCallback(function(){
                debug(file_name)
                emitter.emit("newGeeks", file_name);
                self.halt(200, "done");
            }).addErrback(function(){
                self.halt(400, "failed");
            });
        }).addErrback(function(){
                self.halt(400, "failed");
         })
        .addErrback(function(){
            self.halt(400, "failed");
        });
    });
});


/**
 * form to create a geek to the file system
 * @todo gruik, returning an hard file, haven't debug this.render('new_geek.mustache.html') for now.
 */
get('/geek/new', function(){
    //this.sendfile(set('root')+'/views/new_geek.haml.html');
    this.render("new_geek.haml.html", {layout: false});
});

// Render static files
get('/*', function(file) {
  this.sendfile(set('root') + '/public/' + file)
});


run();
