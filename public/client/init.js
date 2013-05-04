(function() {
  $(function() {
    window.Ui = new Ui;
    return window.ClientSocket = new ClientSockets(1);
  });

}).call(this);
