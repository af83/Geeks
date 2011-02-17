
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

exports.session = {
  secret: "n0F5z60HmCGpHaznEJAROV5jNH1oXxBAI1XBfXaPMzv",
  session_key: "geeks"
};

exports.ircEmitter = {
  network: 'irc.freenode.net',
  nickname: 'geeks_bot',
  channels_r: ['#af83-lab'], // Where the bot can only read
  channels_rw: ['#af83-lab2'], // Where the bot can also 'speak'
  debug: true
};

var base_auth_url = "http://localhost:7070";

exports.oauth2_client = {
  enabled: true,

  client: {
    crypt_key: 'toto',
    sign_key: 'titi',
    base_url: 'http://127.0.0.1:3000',
    process_login_url: '/oauth2/process',
    redirect_uri: 'http://127.0.0.1:3000/oauth2/process',
    login_url: '/login',
    logout_url: '/logout',
    default_redirection_url: '/'
  },

  current_user_url: base_auth_url + '/portable_contacts/@me/@self',

  default_server: "auth_server",

  servers: {
    auth_server: {
      server_authorize_endpoint: base_auth_url + '/oauth2/authorize',
      server_token_endpoint: base_auth_url + '/oauth2/token',

      client_id: "4d540f5d1277275252000005",
      client_secret: 'some secret string',
      name: 'geeks'
    }
  }
};
