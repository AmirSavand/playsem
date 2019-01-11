app.service("Auth", function (API, $rootScope) {

  /**
   * @private
   */
  let self = this;

  /**
   * @type {function}
   * @returns {object|boolean}
   */
  self.getAuth = function () {
    let user = false;

    if (self.isAuth()) {
      user = JSON.parse(localStorage.getItem("user"));
    }

    return user;
  };

  /**
   * @type {function}
   *
   * @param {object} user
   * @param {string} token
   */
  self.setAuth = function (user, token) {
    localStorage.setItem("user", JSON.stringify(user));
    if (token) {
      localStorage.setItem("token", token);
    }
    $rootScope.$broadcast("mr-player.Auth:setAuth");
  };

  /**
   * @type {function}
   *
   * @param user
   * @param broadcast
   */
  self.updateAuth = function (user, broadcast) {
    localStorage.setItem("user", JSON.stringify(user));
    if (broadcast) {
      $rootScope.$broadcast("mr-player.Auth:updateAuth");
    }
  };

  /**
   * Sign user out and remove all authentication properties
   */
  self.unAuth = function () {
    if (self.isAuth()) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("parties");
      $rootScope.$broadcast("mr-player.Auth:unAuth");
    }
  };

  /**
   * @type {function}
   * @returns {boolean}
   */
  self.isAuth = function () {
    return localStorage.hasOwnProperty("token") && localStorage.hasOwnProperty("user");
  };
});
