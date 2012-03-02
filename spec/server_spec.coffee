describe "server", ->
  it "is able to be created", ->
    server = new app.Server(3000)
    expect(server.port).toEqual(3000)
