// Events channel
(function(){
    events_dispatcher.bind('NewGeek', function(geek) {
        $('#geeks').append('<li><img src="/images/geeks/' +
                           geek.name + '">' + geek.name + '</li>');
    });
})();

// Every link with a classname 'as_dialog' will open as dialog on click.
$(document).ready(function() {
    $('a.as_dialog').live('click', function(event) {
        event.preventDefault();
        ( new GeeksDialog($(this).attr('href')) ).show();
    });


    var geeks_map = new scene({
        // Must keep the background ratio:
        width: 1605,
        height: 714,
        placements: [
          {src: "/public/images/plan_af1.png",
           width: 100,
           height: 100,
           movable: false,
           resizable: false,
           left: 0,
           top: 0,
           z: 1,
           title: "",
          },
        ]
    }, $("#map"));

    var defaults = {
      width: 20,
      height: 20,
      movable: true,
      resizable: true,
      src: '/public/images/smiley.png',
      top: 0,
      left: 0,
      update_callback: function(geek) {
        var data = JSON.stringify(geek);
        $.post('/geeks/'+geek.id, data);
      }
    };
    $.getJSON('/geeks.json', function(geeks) {
      geeks.forEach(function(geek) {
        geeks_map.add_obj($.extend({
          title: geek.name
        }, defaults, geek));
      });
    });

});
