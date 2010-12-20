
exports.db = {
  host: 'localhost',
  port: 27017,
  db_name: 'Geeks_dev',
  // Max number of URLs in DB:
  max_nb_urls: 200
};

exports.server = {
  host: 'localhost',
  port: 3000,
  websocket_port: 3001
};

exports.ircEmitter = {
  network: 'irc.freenode.net',
  nickname: 'geeks_bot',
  channels_r: ['#af83-lab'], // Where the bot can only read
  channels_rw: ['#af83-lab2'], // Where the bot can also 'speak'
  debug: true
};

exports.oauth2_client = {
  base_url: 'http://127.0.0.1:3000',
  process_login_url: '/oauth2/process',
  redirect_uri: 'http://127.0.0.1:3000/oauth2/process',
  login_url: '/login',
  logout_url: '/logout',
  default_redirection_url: '/',

  server_base_url: 'http://localhost:8080',
  server_authorize_endpoint: 'http://localhost:8080/oauth2/authorize',
  server_token_endpoint: 'http://localhost:8080/oauth2/token',

  client_id: "4d0f675af223750721000008",
  client_secret: 'some secret string',
  name: 'geeks'
};

