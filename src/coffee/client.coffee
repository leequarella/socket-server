class Client
  constructor: (@socket, @channel, @nickname) ->
    @id = @socket.id

  setChannel:(channel) -> @channel = channel

  setNickname: (nickname) -> @nickname = nickname

exports.Client = Client
