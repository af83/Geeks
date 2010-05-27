$(document).ready(function() {
    // Every link with a classname 'as_dialog' will open as dialog on click.
    $('a.as_dialog').live('click', function(event) {
        event.preventDefault();
        ( new GeeksDialog($(this).attr('href')) ).show();
    });


    var geeks_map = new scene({
        // Must keep the background ratio:
        width: 1605,
        height: 714,
        objects: [
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
      width: "30px",
      height: "30px",
      movable: true,
      resizable: true,
      src: '/public/images/smiley.png',
      z: 2,
      top: 0,
      left: 0,
      title: function(geek) {
        return geek.name;
      },
      update_callback: function(geek) {
        var data = JSON.stringify(geek);
        $.post('/geeks/'+geek.id, data);
      }
    },
    add_geek = function(geek) {
      geeks_map.add_object(geek, defaults);
    };

    $.getJSON('/geeks.json', function(geeks) {
      geeks.forEach(add_geek);
    });
    events_dispatcher.bind('NewGeek', add_geek);

});
