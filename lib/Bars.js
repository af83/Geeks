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
    client.addListener('error', function(error) {
      sys.debug(error)
    })

    //sys.debug(sys.inspect(client, true))
    var request = client.request('GET', '/carte', {'host': url})
    request.addListener('response', function(response) {
        sys.debug('STATUS: ' + response.statusCode);
        sys.debug('HEADERS: ' + JSON.stringify(response.headers));
        sys.debug('discover response\\o/')
        response.setEncoding('utf8')
        response.addListener('data', function(chunk) { // @todo is that really a chunk ?
            // callback( JSON.parse(chunk) )
            sys.puts('BODY: ' + chunk);
        })
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
