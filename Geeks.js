GLOBAL.DEBUG = true;
var sys     = require('sys'),
fs      = require("fs"),
events  = require("events")

require.paths.unshift("./lib/support/mongodb/lib")
var mongo = require('mongodb/db')
process.mixin(mongo, require('mongodb/connection'))

var host = 'localhost'
var port = mongo.Connection.DEFAULT_PORT


var Geeks = function(){}
sys.inherits(Geeks, events.EventEmitter)

/**
 * Retreiving every geeks in mongo
 * @param callback Function(err, result) executed on result available.
 */
Geeks.prototype.all = function(callback){
    db = new mongo.Db('GeeksNode', new mongo.Server(host, port, {}), {});
    db.open(function(err, adb) {
        if(err) {
            db.close()
            callback(err, null)
        }
        else {
            adb.collection('test', function(err, collection) {
                if(err) {
                    db.close()
                    callback(err, null)
                }
                else {
                    collection.find(function(err, cursor) {
                        if(err) {
                            db.close()
                            callback(err, null)
                        }
                        else {
                            var results = []
                            cursor.each(function(err, item) {
                                if(item != null) results.push(new Geek(item))
                                else callback(false, results)
                            });
                            db.close()
                        }
                    })
                }
            })
        }
    })
}

/**
 * Adding geek to mongo
 * @param callback Function(err, result) executed on operation complete.
 */
Geeks.prototype.add = function(callback, geek){
    var self = this
    var db = new mongo.Db('GeeksNode', new mongo.Server(host, port, {}), {});
    var wrap_callback = function(err, result){
        db.close()
        callback(err, result)
    }

    db.open(function(err, result) {
        if(err) {
            wrap_callback(err, null)
        }
        else {
            db.collection('test', function(err, collection) {
                if(err){
                    wrap_callback(err, null)
                }
                else {
                    var geeks = []
                    collection.insert( geek.data, function(err, geeks) {
                        if(err) {
                            wrap_callback(err, null)
                        }
                        else {
                            wrap_callback(false, geek)
                            self.emit("new", geek)
                        }
                    })
                }
            })
        }
    })
}

Geeks.prototype.purge = function(callback, err){
    var db = new mongo.Db('GeeksNode', new mongo.Server(host, port, {}), {});
    var wrap_callback = function(err, result){
        db.close()
        callback(err, result)
    }

     db.open(function(err, result) {
        if(err)
            wrap_callback(err, null)
        else {
            db.collection('test', function(err, collection) {
                if(err)
                {
                    wrap_callback(err, null)
                }
                else {
                    collection.remove(wrap_callback)
                }
            })
        }
    })
}

/**
 * Create the mongo DB
 * @param callback Function(err, result) executed on operation complete.
 */
Geeks.prototype.createDB = function(callback, data){
    var db = new mongo.Db('GeeksNode', new mongo.Server(host, port, {}), {});
    db.open(function(err, db) {
        db.dropDatabase(function(err, result){
            db.dropCollection('test', function(err, result) {
                db.createCollection('test', function(err, collection) {

                    // Erase all records in collection
                    collection.remove(function(err, collection) {
                        db.admin(function(err, admin) {

                            // Profiling level set/get
                            admin.profilingLevel(function(err, profilingLevel) {
                                sys.puts("Profiling level: " + profilingLevel);
                            });

                            // Start profiling everything
                            admin.setProfilingLevel('all', function(err, level) {
                                sys.puts("Profiling level: " + level);            

                                // Read records, creating a profiling event
                                collection.find(function(err, cursor) {
                                    cursor.toArray(function(err, items) {

                                        // Stop profiling
                                        admin.setProfilingLevel('off', function(err, level) {
                                            // Print all profiling info
                                            admin.profilingInfo(function(err, info) {
                                                sys.puts(sys.inspect(info));

                                                // Validate returns a hash if all is well or return an error has if there is a
                                                // problem.
                                                admin.validatCollection(collection.collectionName, function(err, result) {
                                                    sys.puts(result.result);
                                                    db.close();
                                                    callback();
                                                });
                                            });
                                        });
                                    });
                                });            
                            });
                        });
                    });
                });    
            });    
        });
    });
};


var Geek = function(data)
{
    this.data = data
    this.name = data.name
}

Geek.prototype.save = function(callback) {
    singletonGeeks.add(callback, this)
}

// @todo inherits from 
var singletonGeeks = new Geeks
exports.Geeks = singletonGeeks
exports.Geek = Geek
