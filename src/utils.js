
exports.error = function(res, err) {
  console.error(err);
  res.writeHead(500, {'Content-Type': 'text/html'});
  res.end(err.message);
};

