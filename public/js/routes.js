$.sammy(function() {

  var before_change; // if set, to be ran before every change of url hash
  var before = function() {
    if(before_change) {
      before_change();
      before_change = null;
    }
  };
  var input_box = $('#input-box'),
      new_geek_link = $('.header ul li a[href="#/geeks/new"]');

  var set_input = function(html) {
    input_box.html(html).show()
             .find('input').first().focus();
  };


  this.get('', function() {
    this.redirect('#/');
    console.log(this);
  });

  this.get('#/', function() {
    before();
  });

  this.get('#/geeks/new', function() {
    before();
    $.get('/geeks/new', set_input);
    new_geek_link.addClass('active')
    before_change = function() {
      input_box.hide();
      new_geek_link.removeClass('active');
    };
  });

  this.post('#/geeks', function(env) {
    before();
    var geek = new R.Geek(env.params.toHash());
    geek.save();
    this.redirect('#/');
    return false;
  });

  this.get('#/geeks/:id/edit', function(env) {
    before();
    var id = env.params.id;
    var ajax_upload;

    $.get('/geeks/'+id+'/edit', function(html) {
      set_input(html);

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
    before_change = function() {
      input_box.hide();
      // We remove the file input added previously (if any added):
      ajax_upload.disable();
      console.log(ajax_upload._button.parentNode);
      $('body div input[name="avatar"]').parent().remove();
      delete ajax_upload;
    };
  });

  this.post('#/geeks/:id', function(env) {
    before();
    var geek = new R.Geek(env.params.toHash());
    geek.save();
    this.redirect('#/');
    return false;
  });

});

