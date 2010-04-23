GLOBAL.DEBUG = true;

var sys     = require('sys'),
    events  = require('events'),
    http    = require('http')

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
    this.discover(
        bar.url,
        bar.port,
        function(params) {
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
    sys.debug('discover\\o/')
    var client = http.createClient(port, url)

    sys.debug(sys.inspect(client, true))
    var request = client.request('GET', '/carte', {'host': url})
    request.addListener('response', function(err, response) {
        if(err) sys.debug(err)
        sys.debug('discover response\\o/')
            response.addlistener('data', function(chunk) { // @todo is that really a chunk ?
                callback(JSON.parse)
            })
    })
    request.close()
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
