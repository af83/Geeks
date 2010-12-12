/* Load some data in DB for dev env.
 */

require.paths.unshift(__dirname + '/../vendor/nodetk/src')

var sys = require("sys"),
    RFactory = require("../db").RFactory,
    R = RFactory()


sys.puts('Erasing DB...')
R.Geek.clear_all(function() {
  R.URL.clear_all(function() {
    sys.puts('done');
    insert_data();
  })
})

insert_data = function() {
  sys.puts('Inserting some data in DB...')
  // Insert some geeks:
  var geeks = [
    new R.Geek({name: "Pierre", nickname: "Virtuo", pole:"R&D", top: 15, left: 8}),
    new R.Geek({name: "Pix", nickname: "PiXeL", pole:"UX", top: 45, left: 60}),
  ]
  
  // Insert some urls:
  var urls = [
    new R.URL({'from': 'Virtuo', 'channel': "#af83", 'url': 'http://bonjourlechat.fr'}),
    new R.URL({'from': 'Ry', 'channel': "#NodeJS", 'url': 'http://nodejs.org'}),
    new R.URL({'from': 'Shaka', 'channel': "#af83", 'url': 'http://bonjourmadame.fr'}),
    new R.URL({'from': 'PiXel', 'channel': "#af83", 'url': 'http://www.af83.com'}),
    new R.URL({'from': 'G', 'channel': "#af83", 'url': 'http://www.google.fr'}),
    new R.URL({'from': 'Toto', 'channel': "#af83", 'url': 'http://toto.fr'}),
  ]
  R.save([].concat(geeks, urls), function() {
    sys.puts("done")
    process.exit();
  })
  
}
