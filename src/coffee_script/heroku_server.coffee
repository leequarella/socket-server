#	Tuned for heroku
#	@ Author Lee Quarella
#		This server is very simple, allows end users to connect to it, join a channel, and receive information on that channel.
#		Servers can send post requests here which are then sent to the appropriate channels.

#Initialize the server
@port = process.env.PORT || 3000
@express = require('express')
@app = require('express').createServer()
@io = require('socket.io').listen(@app)
@app.listen(@port)
@app.use(@express.bodyParser()) 
console.log "+++++++++++++++++++++++++++++++++++++++++++++++++++"

@checkCredentials = (creds) ->
  #if creds are good
    return true
  #else
    return false


@app.post '/', (req, res) ->
  # First checks to make sure the request has the proper credentials.
  # Then accepts a post request (params: channel, message_type, message).
  # Finally sends the message_type and message to the channel
  if checkCredentials req.body.credentials 
    res.send("received")
    console.log "EMMITING (post) " + req.body.message_type + " to channel " + req.body.channel + ": " + req.body.message
    io.sockets.in(req.body.channel).emit(req.body.message_type, { message: req.body.message })



@io.sockets.on 'connection', (socket) ->
  console.log "((((((((Client connected))))))))"
  clients.newClient(socket)

  socket.on 'set nickname', (data) ->
    clients.setNickname(socket, data.nickname)

  socket.on "change channel", (data) ->
    console.log "((((((((Client joining channel " + data.channel + "))))))))\n\n"
    clients.joinChannel(socket, data.channel)

  socket.on 'disconnect', ()->
    console.log "((((((((Client disconnected))))))))\n\n"
    clients.disconnect(socket)




@clients =
  list: {}
  newClient: (socket) ->
    client =
      socket: socket
      channel: null
      nickname: null
    @list[socket.id] = client


  setNickname: (socket, nickname) -> 
    client = @list[socket.id]
    client.nickname = nickname
    socket.set 'nickname', nickname, ()->
      socket.broadcast.emit 'channel message', {userName: "Server", mes: nickname + ' has connected.'}


  joinChannel: (socket, channel)->
    client = @list[socket.id]
    @leaveCurrentChannel(socket)
    client.channel = channel
    socket.set 'channel', channel, ()->
      if client.nickname
        socket.broadcast.to(channel).emit("channel message", { userName: "Server", mes: client.nickname + " has joined the channel."})
      else
        socket.emit('channel message', {userName: "Server", mes: "Changed to channel " + client.channel})
    socket.join(channel)


  leaveCurrentChannel: (socket) ->
    client = @list[socket.id]
    old_channel = client.channel
    if old_channel
      socket.broadcast.to(old_channel).emit("channel message", { userName: "Server", mes: client.nickname + " has left the channel."})
      socket.leave(old_channel)


  disconnect: (socket) ->
    client = @list[socket.id]
    console.log client.nickname + " disconnected from channel " + client.channel + "."
    if client.nickname
      socket.broadcast.to(client.channel).emit("channel message", { userName: "Server", mes: client.nickname + " has disconnected."})
    delete clients[socket.id]





