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

  /**
   * @param username {string}
   * @param password {string}
   * @param success {function}
   * @param fail {function}
   */
  self.signIn = function (username, password, success, fail) {
    let payload = {
      username: username,
      password: password
    };
    API.post("auth/", payload, {}, function (data) {
      self.setAuth(data.data.user, data.data.token);
      $rootScope.$broadcast("mr-player.Auth:signIn");
      success(data);
    }, function (data) {
      fail(data);
    });
  };

  /**
   * Sign up then sign in.
   *
   * @param email {string}
   * @param username {string}
   * @param password {string}
   * @param success {function}
   * @param fail {function}
   */
  self.signUp = function (email, username, password, success, fail) {
    let payload = {
      email: email,
      username: username,
      password: password
    };
    API.post("users/", payload, {}, function (data) {
      $rootScope.$broadcast("mr-player.Auth:signUp", data.data);
      self.signIn(username, password);
      success(data);
    }, function (data) {
      fail(data);
    });
  };
});
