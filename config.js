
exports.db = {
  host: 'localhost',
  port: 27017,
  db_name: 'Geeks_dev'
}

exports.server = {
  port: 3000,
  // null = INADDR_ANY, set something else eventually.
  host: null
}

exports.barIrc = {
  network: 'irc.freenode.net',
  nickname: 'geeks_bot',
  channels: ['#af83-lab'],
  debug: true
}

