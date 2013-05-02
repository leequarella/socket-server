(function() {
  var Security;

  Security = (function() {
    function Security() {}

    Security.prototype.checkCredentials = function(creds) {
      return true;
      return false;
    };

    return Security;

  })();

  exports.Security = Security;

}).call(this);
