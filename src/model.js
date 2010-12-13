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

// In case we need to delete the URL collection:
// backend.db.dropCollection('URL', function(err){
//   if(err) {
//     console.error(err);
//   }
// });

// We don't want more than X urls in our DB:
var MAX_NB_URLS = config.db.max_nb_urls;
backend.db.createCollection("URL", {
  capped:true 
, size:MAX_NB_URLS*1000
, max:MAX_NB_URLS
}, function(err, collection) {
  if(err) {
    console.error(err);
  }
});

