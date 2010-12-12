$.sammy(function() {

  var ajax_upload;
  var input_box = $('#input-box'),
      new_geek_link = $('.header ul li a[href="#/geeks/new"]');

  var show_input = function() {
    input_box.show()
             .find('input').first().focus();
  };
  
  this.before({}, function() {
    input_box.hide();
    // We remove the file input added previously (if any added):
    if(ajax_upload) {
      ajax_upload.disable();
      $('body div input[name="avatar"]').parent().remove();
      delete ajax_upload;
    }
    $('.tool.as_dialog.active').removeClass('active');    
  });

  this.get('', function() {
    this.redirect('#/');
    console.log(this);
  });

  this.get('#/', function() {
  });

  this.get('#/geeks/new', function() {
    input_box.renders('new_geek.html');
    show_input();
    new_geek_link.addClass('active')
  });

  this.post('#/geeks', function(env) {
    var geek = new R.Geek(env.params.toHash());
    geek.save();
    this.redirect('#/');
    return false;
  });

  this.get('#/geeks/:id/edit', function(env) {
    var id = env.params.id;

    R.Geek.get({ids: id}, function(geek) {
      input_box.renders('edit_geek.html', geek)
      show_input();
      // Avatar uploading:
      ajax_upload = new AjaxUpload('upload_avatar', {
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
    R.Geek.update({ids: env.params.id, data: env.params.toHash()});
    this.redirect('#/');
    return false;
  });

});

