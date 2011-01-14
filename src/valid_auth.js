var config = require('./config')
, oauth2_client = require('oauth2_client')
;

exports.connector = function() {
  return function(req, res, next) {
    if((!req.session || !req.session.userid) && config.oauth2_client.enabled) {
      return oauth2_client.redirects_for_login(res);
    }
    else next();
  };
};
