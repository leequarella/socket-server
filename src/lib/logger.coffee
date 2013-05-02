class Logger
  constructor: ->
  info: (message) ->
    console.log ">>>>>>>>> " + message + " <<<<<<<<<"

exports.Logger = Logger
