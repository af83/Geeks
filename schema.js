/* Schema of application data, used by rest-mongo to generate objects */

exports.schema = {
  Geek: {
    resource: '/geeks',
    schema: {
      id: "Geek",
      description: "A geek / person / dev ...",
      type: "object",

      properties: {
        id: {type: "string"},
        name: {type: "string"},
        nickname: {type: "string"},
        pole: {type: "string"},
        avatar_fname: {type: "string"}, //avatar file name
        // position on map:
        width: {type: "float"},
        height: {type: "float"},
        top: {type: "float"},
        left: {type: "float"}
      }
    }
  },

  URL: {
    resource: '/urls',
    schema: {
      id: "URL",
      description: "URL, potentially interesting for geeks",
      type: "object",

      properties: {
        url: {type: "string"}, // the URL value
        from: {type: "string"}, // who posted the url (nick, name...)
        channel: {type: "string"} // where it has been posted (irc chan...)
      }
    }
  }

}

