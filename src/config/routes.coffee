app.get '/client/socket_junk.js', (req, res) -> res.sendfile("client/socket_junk.js")
app.get '/client/ui.js', (req, res) -> res.sendfile("client/ui.js")
app.get '/client/init.js', (req, res) -> res.sendfile("client/init.js")

app.get '/', (req, res) -> # First checks to make sure the request has the proper credentials.
  # Then serves up the index page
  # Finally sends the message_type and message to the channel
  if Security.checkCredentials req.body.credentials
    Logger.info "!! GET REQUEST RECEIVED !!"
    res.sendfile("app/views/index.html")
    io.sockets.in(req.body.channel).emit(req.body.message_type, { message: req.body.message })

app.post '/', (req, res) ->
  # First checks to make sure the request has the proper credentials.
  # Then accepts a post request (params: channel, message_type, message).
  # Finally sends the message_type and message to the channel
  if Security.checkCredentials req.body.credentials
    Logger.info "EMMITING (post) " + req.body.message_type + " to channel " + req.body.channel + ": " + req.body.message
    res.send("received")
    io.sockets.in(req.body.channel).emit(req.body.message_type, { message: req.body.message })

io.sockets.on 'connection', (socket) ->
  Logger.info "Client connected"
  Clients.newClient(socket)

  socket.on 'set nickname', (data) ->
    Logger.info "Nickname set " + data. nickname
    Clients.setNickname(socket, data.nickname)

  socket.on "change channel", (data) ->
    Logger.info "Client joining channel " + data.channel
    Clients.joinChannel(socket, data.channel)

  socket.on 'disconnect', ->
    Logger.info "Client disconnected. " + socket.id
    Clients.disconnect(socket)

  socket.on 'broadcast', (data) ->
    Logger.info "Client Broadcasting " + socket.id
    Clients.broadcast(socket, data.message)
