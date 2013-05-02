class ServerInitializer
  constructor: () ->
    global.port = process.env.PORT || 3001
    @port = port
    @express = require 'express'
    @http = require 'http'
    console.log "STARTING SERVER"
    @startExpress()
    @startSocketIO()
    @startStaticService()

  startExpress: ->
    console.log " ...preparing express server."
    global.app = @express()

  startSocketIO: ->
    console.log " ...preparing http for socket.io"
    global.server = @http.createServer(app)
    global.io = require('socket.io').listen(server)
    server.listen @port
    console.log " ...socket.io listening on port #{port}"

  startStaticService: ->
    console.log " ...preparing to serve static assets"
    app.use @express.bodyParser()
    app.use @express.static(__dirname + '/static')
    console.log "..done."

exports.ServerInitializer = ServerInitializer
