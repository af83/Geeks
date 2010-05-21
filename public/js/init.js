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
});
