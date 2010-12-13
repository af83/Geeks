
exports.db = {
  host: 'localhost',
  port: 27017,
  db_name: 'Geeks_dev',
  // Max number of URLs in DB:
  max_nb_urls: 200
}

exports.server = {
  host: 'localhost',
  port: 3000,
  websocket_port: 3001
}

exports.ircEmitter = {
  network: 'irc.freenode.net',
  nickname: 'geeks_bot',
  channels_r: ['#af83-lab'], // Where the bot can only read
  channels_rw: ['#af83-lab2'], // Where the bot can also 'speak'
  debug: true
}

