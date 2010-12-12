/* Where is defined the DB connection.
 *
 */

var rest_mongo = require("rest-mongo/core")
  , mongo_backend = require("rest-mongo/mongo_backend")
  , config = require('./config')
  , schema = require('./schema').schema
  ;

var backend = mongo_backend.get_backend(config.db);
exports.RFactory = rest_mongo.getRFactory(schema, backend);

