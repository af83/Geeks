// this is an export from another proect thanks to fdemetz@af83.com
// this may be use in a meanwhile.
// @todo load greeter lib.
// àtodo load historyManager.
function showNotifications(xhr)
{
    var notifs = eval(xhr.getResponseHeader('X-Notify'));
    function showNotification(index, code)
    {
        var text = xhr.getResponseHeader('X-Notify-'+ code);
        if (code >= 400) {
            var title = "Erreur";
        } else {
            var title = "Succès";
        }
        $.gritter.add({
            title: title,
            text: text
                      });
    }
    $(notifs).each(showNotification);
}

/** Class GeeksDialog
 * @param href
 * @param options
 * @param callback function call on ready (after dom inject))
 */
function GeeksDialog(href, options, callback)
{
    this._href = href;
    var defaultOptions = {buttonClose : 'Annuler',
                          removeSubmit: true, // and handle them as ajax.
                          resizable : true,
                          history: false // activate for history manager
    };
    this._options = $.extend({}, defaultOptions, options || {});
    this.callback = callback || function(c){};
}
GeeksDialog.prototype = {
    /**
     * Return dom element of this dialog
     * create div.dialog if not present.
     */
    getContent: function()
    {
        var d = $('.dialog');
        if(d.size() < 1)
        {
            $('body').append('<div class="dialog"/>');
            d = $('.dialog');
        }
        return d;

    },

    show : function()
    {
        var self = this;
        $.get(this._href, function(data) {
                  self._createDialog(data);
              }, 'html');
    },

    close : function()
    {
        this.getContent().dialog('destroy');
    },

    _prepareContentDialog : function(data)
    {
        var content = $(data);
        var size = content.find("h1").attr('rel');
        return {
            content : content,
            size: size
        };
    },

    _getButtons : function(data)
    {
        var self = this;
        var defaultName = this._options.buttonClose;
        var buttons = {};
        buttons[defaultName] = function() {
            $(this).dialog('destroy');
        };
        if (this._options.removeSubmit)
        {
            data.find("input[type='submit']").each(
            function(i, el) {
                var submit = $(el);
                if (self._options.onSubmit)
                {
                    buttons[submit.attr('value')] = self._options.onSubmit;
                }
                else
                {
                 buttons[submit.attr('value')] = function() {
                    var dialog = $(this);
                    var form = $(this).find("form");
                    var content = form.serialize()+"&"+ submit.attr('name')+'=';
                    var action = form.attr("action");
                    $.ajax(
                        {url: action,
                         data: content,
                         type: form.attr("method"),
                         complete : showNotifications,
                         error : function(xhr)
                         {
                             var content = $(xhr.responseText);
                             self._getButtons(content);
                             dialog.html(content);
                         },
                         success: function()
                         {
                             dialog.dialog('destroy');
                            if(this.options.history)
                            {
                                $.historyLoad($.historyCurrentHash.substr(1));
                            }
                         }
                        });
                };
                    }
            }
        );
        data.find("input[type='submit']").remove();
        }

        return buttons;
    },

    _createDialog : function(data, status)
    {
        var d = this._prepareContentDialog(data);
        var buttons = this._getButtons(d.content);
        this.getContent().empty().append(d.content)
        .dialog({title: d.title,
                 modal: true,
                 width: parseInt(d.size, 10),
                 position: 'top',
                 buttons : buttons,
                 resizable : this._options.resizable,
                 close : function()
                 {
                     $(this).dialog('destroy');
                 }
                });
       this.callback(this);
    }
};
