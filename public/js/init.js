// Events channel
(function poll() {
    $.ajax({
        url: '/events',
        cache: false,
        dataType: 'json',
        success: function(geek) {
            $('#geeks').append('<li><img src="/images/geeks/' + 
                               geek.name + '">' + geek.name + '</li>');
            poll();
        }
    });
})();

// Every link with a classname 'as_dialog' will open as dialog on click.
$(document).ready(function() {
    $('a.as_dialog').live('click', function(event) {
        event.preventDefault();
        ( new GeeksDialog($(this).attr('href')) ).show();
    });
});
