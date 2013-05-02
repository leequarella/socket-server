(function() {
  var Logger;

  Logger = (function() {
    function Logger() {}

    Logger.prototype.info = function(message) {
      return console.log(">>>>>>>>> " + message + " <<<<<<<<<");
    };

    return Logger;

  })();

  exports.Logger = Logger;

}).call(this);
