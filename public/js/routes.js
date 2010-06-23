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
    var geek = new R.Geek(env.params.toHash());
    geek.save();
    this.redirect('#/');
    return false;
  });

  this.get('#/geeks/:id/edit', function(env) {
    var id = env.params.id;
    $.get('/geeks/'+id+'/edit', function(html) {
      set_input(html);

      // Avatar uploading:
      new AjaxUpload('upload_avatar', {
        name: 'avatar',
        action: '/geeks/'+id+'/avatar',
        autoSubmit: true,
        responseType: false,
        onSubmit: function(file, ext) {
          if (! (/^(jpg|png|jpeg|gif)$/i.test(ext))) {
            alert("Invalid file extension!");
            return false;
          }
        }
      });

    });
  });

  this.post('#/geeks/:id', function(env) {
    var geek = new R.Geek(env.params.toHash());
    geek.save();
    this.redirect('#/');
    return false;
  });

});

