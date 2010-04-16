GLOBAL.DEBUG = true;

var sys     = require('sys'),
    events  = require('events'),
    http    = require('http')

// DEBUG
debug = sys.debug

/**
 * Availbale Bar services
 * Used as a singleton.
 */
var Bars = function()
{
    this.bars = []
}
sys.inherits(Bars, events.EventEmitter)

Bars.prototype.register = function(bar) {
            debug('\o/')
    this.discover(
        bar.url,
        bar.port,
        function(params) {
            debug('\o/')
            bar.params = params;
            this.bars.push(bar) // note that's it's not always true, sometimes it hit you.
        } 
    )
}

/**
 *
 * @todo consider an error reporting to notify the callback on wrong response. 
 */
Bars.prototype.discover = function(url, port, callback) {
            debug('discover\\o/')
    var anonymous_bar= http.createClient(port, url)
    var request = anonymous_bar.request('GET', '/carte')
    request.addListener('response', function(response) {
            debug('discover response\\o/')
        if(response.statusCode == 200) {
            response.addlistener('data', function(chunk) { // @todo is that really a chunk ?
                callback(JSON.parse)
            })
        }
    })
    request.end()
}


/**
 * A Geek bar where the server can collect some activities.
 */
var Bar = function( url, port)
{
    this.url  = url
    this.port = port
    singletonBars.register(this)
}


// @todo inherits from 
var singletonBars = new Bars
exports.Bars = singletonBars
exports.Bar = Bar
