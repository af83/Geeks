$.sammy(function() {

  this.get('#/', function() {
    $('#input-box').hide();
  });

  this.get('#/geeks/new', function() {
    $.get('/geeks/new', function(html) {
      $('#input-box').html(html).show()
                     .find('input').first().focus();
    });
  });

  this.post('#/geeks', function(env) {
    $.post('/geeks', env.params);
    this.redirect('#/');
    return false;
  });

});

