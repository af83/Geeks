$.sammy(function() {

  var set_input = function(html) {
    $('#input-box').html(html).show()
                   .find('input').first().focus();
  };


  this.get('', function() {
    this.redirect('#/');
    console.log(this);
  });

  this.get('#/', function() {
    $('#input-box').hide();
  });

  this.get('#/geeks/new', function() {
    $.get('/geeks/new', set_input);
  });

  this.post('#/geeks', function(env) {
    $.post('/geeks', env.params.toHash());
    this.redirect('#/');
    return false;
  });

  this.get('#/geeks/:id/edit', function(env) {
    var id = env.params.id;
    $.get('/geeks/'+id+'/edit', set_input);
  });

  this.post('#/geeks/:id', function(env) {
    var id = env.params.id;
    $.post('/geeks/' + id, JSON.stringify(env.params.toHash()));
    this.redirect('#/');
    return false;
  });

});

