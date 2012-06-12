#	@ Author Lee Quarella
#   This server is very simple, allows end users to connect to it, join a channel, and receive information on that channel.
#	Servers can send post requests here which are then sent to the appropriate channels.

#Initialize the server
port = process.env.PORT || 3001
express = require 'express'
app = express.createServer()
io = require('socket.io').listen(app)
app.listen port
app.use express.bodyParser()
app.use express.static(__dirname + '/views')

Clients = require("./javascripts/clients").Clients
Clients = new Clients

Security = require("./javascripts/security").Security
Security = new Security

app.get '/', (req, res) ->
  # First checks to make sure the request has the proper credentials.
  # Then serves up the index page
  # Finally sends the message_type and message to the channel
  if Security.checkCredentials req.body.credentials
    res.render("views/index.html")
    console.log "!! GET REQUEST RECEIVED !!"
    io.sockets.in(req.body.channel).emit(req.body.message_type, { message: req.body.message })

app.post '/', (req, res) ->
  # First checks to make sure the request has the proper credentials.
  # Then accepts a post request (params: channel, message_type, message).
  # Finally sends the message_type and message to the channel
  if Security.checkCredentials req.body.credentials
    res.send("received")
    console.log "(((((((( EMMITING (post) " + req.body.message_type + " to channel " + req.body.channel + ": " + req.body.message + " ))))))))"
    io.sockets.in(req.body.channel).emit(req.body.message_type, { message: req.body.message })

io.sockets.on 'connection', (socket) ->
  console.log "((((((((Client connected))))))))"
  Clients.newClient(socket)

  socket.on 'set nickname', (data) ->
    console.log "((((((((Nickname set " + data. nickname +  "))))))))"
    Clients.setNickname(socket, data.nickname)

  socket.on "change channel", (data) ->
    console.log "((((((((Client joining channel " + data.channel + "))))))))\n"
    Clients.joinChannel(socket, data.channel)

  socket.on 'disconnect', ->
    console.log "((((((((Client disconnected. " + socket.id + "))))))))\n"
    Clients.disconnect(socket)

  socket.on 'broadcast', (data) ->
    console.log "((((((((Client Broadcasting " + socket.id + "))))))))\n"
    Clients.broadcast(socket, data.message)
