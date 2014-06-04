class ServerInitializer
  constructor: (port, sslport) ->
    @port = port
    @express = require 'express'
    @http = require 'http'
    @https = require 'https'
    @fs = require 'fs'
    @options = {
          key: @fs.readFileSync(__dirname+'/../../../private/key.pem'),
          cert: @fs.readFileSync(__dirname+'/../../../private/cacert.pem')
    }
    console.log "STARTING SERVER"
    @startExpress()
    @startSocketIO()
    @startStaticService()

  startExpress: ->
    console.log " ...preparing express server."
    global.app = @express()
    app.set 'port', 4001

  startSocketIO: ->
    console.log " ...preparing http for socket.io"
    if env == 'production'
      app.listen app.get 'port', () ->
        console.log "Express server running on: " + app.get 'port'
    global.server = @https.createServer(@options, app)
    server.listen port
    @httpserver = @http.createServer(app)
    global.io = require('socket.io').listen(server)
    console.log " ...socket.io listening on port #{port}"

  startStaticService: ->
    console.log " ...preparing to serve static assets"
    app.use @express.bodyParser()
    app.use @express.static(__dirname + '/static')
    console.log "..done."

exports.ServerInitializer = ServerInitializer
