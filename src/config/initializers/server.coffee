class ServerInitializer
  constructor: (port) ->
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
    @startSecureSocketIO()
    @startStaticService()

  startExpress: ->
    console.log " ...preparing express server."
    global.app = @express()

  startSecureSocketIO: ->
    console.log " ...preparing https for socket.io"
    global.server = @https.createServer(@options, app)
    global.io = require('socket.io').listen(server)
    server.listen @port
    console.log " ...socket.io listening on port #{port}"

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
