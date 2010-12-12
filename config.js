
exports.db = {
  host: 'localhost',
  port: 27017,
  db_name: 'Geeks_dev'
}

exports.server = {
  host: 'localhost',
  port: 3000,
  websocket_port: 3001
}

exports.ircEmitter = {
  network: 'irc.freenode.net',
  nickname: 'geeks_bot',
  channels: ['#af83-lab'],
  debug: true
}

